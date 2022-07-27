<template>
  <div class="attendances-container">
    <div class="attendances-content">
      <!-- 顶部导航 -->
      <PageTool>
        <template v-slot:before>
          有 {{ tobeTaskCount }} 条考勤审批尚未处理
        </template>
        <template v-slot:after>
          <el-button size="mini" type="danger" @click="$router.push('/import?type=attendances')">导入</el-button>
          <el-button size="mini" type="warning" @click="tipsDialogVisible = true">提醒</el-button>
          <el-button size="mini" type="primary" @click="handleSet">设置</el-button>
          <el-button size="mini" type="default" @click="$router.push('/attendances/archiving')">历史归档</el-button>
          <el-button size="mini" type="primary" @click="$router.push({'path':'/attendances/report/'+ yearMonth})">{{ yearMonth }}报表</el-button>
        </template>
      </PageTool>

      <!-- 筛选 -->
      <el-card class="el-card">
        <el-form ref="form" :model="formData" label-width="80px">
          <el-form-item label="部门:">
            <el-checkbox-group v-model="formData.deptID">
              <el-checkbox v-for="item in departmentsList" :key="item.id" :label="item.id" @change="changeCheckbox">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="考勤状态:">
            <el-radio-group v-model="formData.stateID">
              <el-radio v-for="item in attendanceStateList" :key="item.id" :label="item.value" @change="changeCheckbox" />
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 考勤列表展示 -->
      <el-card class="el-card">
        <el-table
          border
          :data="attendanceList"
          style="width: 100%"
          :header-cell-style="{'background-color':'#f0f0f0','color':'black','text-align':'center'}"
          :cell-style="{'text-align':'center'}"
        >
          <el-table-column
            type="index"
            label="序号"
            width="180"
          />
          <el-table-column
            prop="username"
            label="姓名"
            width="180"
          />
          <el-table-column
            prop="workNumber"
            label="工号"
            width="180"
          />
          <el-table-column
            prop="departmentName"
            label="部门"
            width="180"
          />
          <el-table-column
            prop="mobile"
            label="手机"
            width="180"
          />
          <el-table-column
            v-for="(item,index) in attendanceRecord"
            :key="index"
            :label="`${monthOfReport}/${index+1}`"
            width="80"
          >
            <template slot-scope="scope">
              {{ scope.row.attendanceRecord[index].adtStatu | attendancesState }}
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <div class="pagination">
          <Pagination
            :total="page.total"
            :page-size="page.pagesize"
            :current-page.sync="page.page"
            :updata-list="getAttendancesListInfo"
          />
        </div>
      </el-card>
      <!-- 提醒组件 -->
      <el-dialog
        title="提醒"
        :visible.sync="tipsDialogVisible"
        width="280px"
        center
      >
        <div class="attenInfo">
          <p>系统将通过邮件与短信的形式，对全体员工中存在旷工的考勤进行提醒，该提醒每月仅可发送 1 次。</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleSub">我知道了</el-button>
          <el-button @click="tipsDialogVisible = false">取消</el-button>
        </span>
      </el-dialog>
      <!-- 设置弹框 -->
      <AttendanceSet :dialog-form-visible.sync="dialogFormVisible" />
    </div>

  </div>
</template>

<script>
import PageTool from '@/components/PageTools'
import attendanceApi from '@/api/constant/attendance'
import { getDepartments } from '@/api/departments'
import { getAttendancesList } from '@/api/attendances'
import AttendanceSet from './components/AttendanceSet'
export default {
  name: 'Attendances',
  components: {
    PageTool,
    AttendanceSet
  },
  data() {
    return {
      formData: { // 筛选信息存储列表
        deptID: [], // 部门
        stateID: '' // 考勤状态
      },
      page: { // 请求页码设置
        page: 1,
        pagesize: 10,
        total: 0
      },
      departmentsList: [], // 部门列表
      attendanceList: [], // 考勤列表
      monthOfReport: '', // 当前考勤月份
      tobeTaskCount: '', // 待处理的考勤数量
      dialogFormVisible: false, // 设置弹窗是否显示
      tipsDialogVisible: false// 提醒弹窗
    }
  },
  computed: {
    attendanceStateList() { // 考勤状态选项列表
      return attendanceApi.holidayType
    },
    attendanceRecord() { // 考勤列遍历模板.这里需要每月天数
      return this.attendanceList[0] ? this.attendanceList[0].attendanceRecord : []
    },
    // 合成年月日
    yearMonth() {
      const date = new Date()
      const year = date.getFullYear()// 获取当前年
      const month = this.monthOfReport > 10 ? this.monthOfReport : '0' + this.monthOfReport
      return year + month
    }
  },
  mounted() {
    this.getDepartmentsInfo()
    this.getAttendancesListInfo()
    console.log(this.attendanceList)
  },
  methods: {
    // 请求部门列表
    async getDepartmentsInfo() {
      try {
        const { depts } = await getDepartments()
        this.departmentsList = depts
      } catch (error) {
        console.log(error)
      }
    },
    // 获取考勤数据
    async getAttendancesListInfo() {
      try {
        const res = await getAttendancesList({ ...this.page, ...this.formData })
        const { data: { total, rows }, monthOfReport, tobeTaskCount } = res
        this.page.total = total
        this.attendanceList = rows
        this.monthOfReport = monthOfReport
        this.tobeTaskCount = tobeTaskCount
      } catch (error) {
        console.log(error)
      }
    },
    changeCheckbox() {
      this.getAttendancesListInfo()
    },
    // 开启设置弹框
    handleSet() {
      this.dialogFormVisible = true
    },
    // 提醒弹窗
    handleSub() {
      this.tipsDialogVisible = false
      this.$message.success('提醒成功')
    }
  }

}
</script>

<style scoped>
.pagination{
  text-align: center;
}
.attendances-container{
  padding: 10px 20px 0;
}
.el-card {
  margin-top: 15px;
}
</style>
