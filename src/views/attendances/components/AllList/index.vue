<template>
  <div class="boxInfo">
    <!-- 数据表格 -->
    <div class="fr clearfix searchInfo">
      <a class="el-button fr el-button--primary el-button--mini" title="导出" @click="handelFileDownload">导出</a>
    </div>
    <el-table
      :data="dataList"
      element-loading-text="给我一点时间"
      fit
      highlight-current-row
      style="width: 100%; margin-top:10px;"
      border
      height="400"
    >
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="workNumber" label="工号" width="100" />
      <el-table-column prop="mobile" label="手机号" width="200" />
      <el-table-column prop="department" label="部门" width="200" />
      <el-table-column prop="leaveDays" label="事假" width="100" />
      <el-table-column prop="dayOffLeaveDays" label="调休" width="100" />
      <el-table-column prop="normalDays" label="正常" width="100" />
      <el-table-column prop="laterTimes" label="迟到次数" width="100" />
      <el-table-column prop="earlyTimes" label="早退次数" width="100" />
      <el-table-column prop="averageDailyNaturalDays" label="日均时长" width="150" />
      <el-table-column prop="absenceDays" label="旷工天数" width="100" />
      <el-table-column prop="whetherItIsFullOfWork" label="是否全勤" width="100" />
      <el-table-column prop="actualAttendanceDaysAreOfficial" label="实际出勤天数" width="180" />
      <el-table-column prop="attendanceDay" label="应出勤工作日" width="120" />
      <el-table-column prop="salaryStandard" label="计薪标准" width="100" />
      <el-table-column prop="officialSalaryDays" label="计薪天数" width="150" />
    </el-table>
    <!-- 分页 -->
    <!-- <div class="pagination">
      <Pagination :total="page.total" :page-size="page.pageSize" :current-page.sync="page.page" :updata-list="reportFormList" />
    </div> -->
    <!--表格归档 / -->
    <div class="butList">
      <el-tooltip class="item" effect="dark" content="将当前报表存放至归档，归档可以多次，但只保留最后一次" placement="top-start">
        <el-button type="primary" size="small" @click="archivingReportForm">归档{{ month.substr(4) }}月份报表</el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="开始做下月考勤" placement="top-start">
        <el-button type="primary" size="small" @click="createReportForm">新建报表</el-button>
      </el-tooltip>
      <!-- <el-button @click="handleRest">取消</el-button> -->
    </div>
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination'
import { reportFormList, archives, newReports } from '@/api/attendances'
import { excelDerive } from '@/utils/excel' // excle导出
export default {
  name: 'AllList',
  components: {
    // Pagination
  },
  props: ['month'],
  data() {
    return {
      dataList: [], // 表格数据
      page: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      departmentId: '' // 部门id，目前没用
    }
  },
  created() {
    this.reportFormList()
  },
  methods: {
    // 导出
    handelFileDownload() {
      const title = `${this.$route.params.month}人事报表`
      // 表头关系
      const relation = {
        '姓名': 'name',
        '工号': 'workNumber',
        '手机号': 'mobile',
        '部门': 'department',
        '事假': 'leaveDays',
        '调休': 'dayOffLeaveDays',
        '正常': 'normalDays',
        '迟到次数': 'laterTimes',
        '早退次数': 'earlyTimes',
        '日均时长': 'averageDailyNaturalDays',
        '旷工次数': 'absenceDays',
        '是否全勤': 'whetherItIsFullOfWork',
        '实际出勤天数': 'actualAttendanceDaysAreOfficial',
        '应出勤工作日': 'attendanceDay',
        '计薪天数': 'officialSalaryDays'

      }
      const headers = Object.keys(relation) // 表头[]

      // 数据转换
      const data = this.dataList.map(item => {
        return headers.map(key => {
          // if (relation[key] === 'whetherItIsFullOfWork') { // 对是否全勤进行转换
          //   return this.fStandards(item[relation[key]])
          // }
          return item[relation[key]]
        })
      })
      excelDerive(headers, title, data)
    },
    // 列表数据请求
    async reportFormList() {
      try {
        const res = await reportFormList({ atteDate: this.month, departmentId: this.departmentId })
        this.dataList = res
      } catch (error) {
        console.log(error)
      }
    },
    // 归档表格
    archivingReportForm() {
      var atteDate = {
        departmentId: this.departmentId,
        atteDate: this.month
      }
      this.$confirm(
        '该月报表已归档过，重新归档将覆盖上一份报表，您确认要再次归档吗？',
        '归档' + this.month.substr(4) + '报表'
      )
        .then(async() => {
          await archives(atteDate)
          this.$message.success('归档成功')
        })
        .catch(error => {
          this.$message.error('归档失败')
          console.log(error)
        })
    },
    // 新建表格
    createReportForm() {
      // 对月份进行处理
      const year = this.month.substring(0, 4)
      const month = this.month.substring(4)
      const date = this.getNextMonth(year, Number(month) + 1)
      this.$confirm(
        '新建报表会使得' +
          this.month +
          '月报表不能修改，且您上一次归档之后的修改将不会被保存。您确定现在就开始做下月考勤吗？',
        '新建' + date.month + '报表'
      )
        .then(async() => {
          const atteTime = date.year + date.month + ''
          await newReports({ yearMonth: atteTime })
          this.$message.success('新建报表成功！')
          this.$router.back()
        })
        .catch(error => {
          this.$message.error('新建报表失败')
          console.log(error)
        })
    },
    // 年月处理函数
    getNextMonth(year, month) {
      if (Number(month) === 13) { // 月份超范围则月份重置,年+1
        month = 1
        year = Number(year) + 1
      }

      if (month < 10) { // 月份补0
        month = '0' + month
      }

      return {
        year,
        month
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../../styles/variables.scss';
.butList {
  // border-top: solid 1px #f4f4f4;
  margin-top: 15px;
  text-align: center;
  background: #fff;
  span {
    display: inline-block;
    background: $green;
    color: #fff;
    padding: 8px 20px;
    border-radius: 3px;
    margin: 10px;
    cursor: pointer;
  }
  .cancel {
    background: #ccc;
    color: #666;
  }
}
  .pagination{
    text-align: center;
  }
</style>
