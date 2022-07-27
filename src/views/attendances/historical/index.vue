<template>
  <div class="historicalArcBox">
    <div class="historicalArcTop">
      <div class="title">
        <span>员工历史归档</span>
        <div class="yearChange">
          <el-select v-model="requestParameters.departmentId" placeholder="请选择部门" @change="selectChange">
            <el-option
              v-for="item in departmentData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-date-picker
            v-model="yearVal"
            type="year"
            format="yyyy"
            value-format="yyyy"
            width="130px"
            placeholder="选择年"
            @change="handleChangeYear"
          />
        </div>
      </div>
    </div>
    <div class="historicalTable">
      <div v-show="showArchivig" class="archivig">该年份无归档报表</div>
      <div v-for="( itemes, index) in tableData" :key="index" class="itemes">
        <div class="itemTopLab" :class="{act: itemes.act}">
          <div class="lab" @click="openTable(itemes,index)">
            >
          </div>
          <div>
            <p ref="sheelName" class="title">{{ itemes.archiveYear }}-{{ itemes.archiveMonth }}月员工报表</p>
            <p class="labTit" @click="openTable(itemes,index)">考勤统计</p>
          </div>
          <div class="fr">
            <div>
              <p class="itemTit">
                <span>总人数</span>
              </p>
              <p class="itemNum">{{ itemes.totalPeopleNum }}</p>
            </div>
            <div>
              <p class="itemTit">
                <span>全勤人数</span>
              </p>
              <p class="itemNum">{{ itemes.fullAttePeopleNum }}</p>
            </div>
          </div>
        </div>
        <div v-show="itemes.act" class="itemDropDown">
          <el-alert
            title="迟到、早退和补签的统计单位为“次”；所有假期类型、外出、旷工的统计单位均为“天”。"
            type="warning"
            :closable="false"
            show-icon
          />
          <div class="topLab">
            <div class="rightLabBox">
              <a
                class="el-button fr el-button--primary el-button--mini"
                title="导出"
                @click="handleExport(itemes)"
              >导出</a>
            </div>
          </div>
          <el-table
            id="item"
            :data="contentData"
            height="300"
            border
            style="width: 100%;text-align: center"
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
            <el-table-column prop="absenceDays" label="旷工天数" width="100" />
            <el-table-column prop="isFullAttendanceint" :formatter="fStandards" label="是否全勤" width="100" />
            <el-table-column prop="actualAtteOfficialDays" label="实际出勤天数（正式）" width="180" />
            <el-table-column prop="workingDays" label="应出勤工作日" width="120" />
            <el-table-column prop="salaryOfficialDays" label="计薪天数（正式）" width="150" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArchivingList, getArchivingCont } from '@/api/attendances'
import { getDepartments } from '@/api/departments'
import { excelDerive } from '@/utils/excel' // excle导出
export default {
  name: 'Historical',
  data() {
    return {
      tableData: [
      ],
      yearVal: '',
      requestParameters: { // 传入获取年份报表列表的参数
        year: '',
        departmentId: ''// 部门id
      },
      departmentData: [], // 部门列表
      contentData: [], // 报表数据
      baseData: { // 请求报表具体数据的传递参数
        atteArchiveMonthlyId: ''// 归档id
      }

    }
  },
  computed: {
    showArchivig() {
      return this.tableData.length === 0
    }
  },
  created() {
    const { year } = this.getMonth()
    this.yearVal = year + ''
    this.requestParameters.year = this.yearVal
    this.getDepartments()
  },
  methods: {
    // 当前年月获取与处理
    getMonth() {
      const date = new Date()
      var year = date.getFullYear() // 获取当前年
      var month = date.getMonth() // 获取当前月
      return {
        year,
        month
      }
    },
    // 选择年份后
    handleChangeYear() {
      this.requestParameters.year = this.yearVal // 存储年份
      // 获取报表列表
      this.getArchivingList()
    },

    // 请求,获取对应年份的报表列表
    async getArchivingList() {
      try {
        const res = await getArchivingList(this.requestParameters)
        if (res.length !== 0) {
          this.tableData = res
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 点击展示信息,请求表格数据
    async openTable(itemes, index) {
      this.baseData.atteArchiveMonthlyId = itemes.id // 归档id
      // 请求数据,此时为false,更新数据后改为true
      if (!itemes.act) {
        console.log('我进来了')
        try {
          this.contentData = await getArchivingCont(this.baseData) // 根据归档id查询数据
          console.log(this.contentData, '1111')
          // 表格显示
          this.$set(this.tableData[index], 'act', true)
        } catch (error) {
          console.log(error)
          this.$message.error(error)
        }
      } else {
        this.$set(this.tableData[index], 'act', false)
      }
    },
    // 导出
    handleExport(itemes) {
      const obj = this.contentData
      const title = itemes.archiveYear + '-' + itemes.archiveMonth + '月员工报表'
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
        '旷工次数': 'absenceDays',
        '是否全勤': 'isFullAttendanceint',
        '实际出勤天数(正式)': 'actualAtteOfficialDays',
        '应出勤工作日': 'workingDays',
        '计薪天数(正式)': 'salaryOfficialDays'

      }
      const headers = Object.keys(relation) // 表头[]

      // 数据处理为二维数组
      const data = obj.map(item => {
        return headers.map(key => {
          if (relation[key] === 'isFullAttendanceint') { // 对是否全勤进行转换
            return this.fStandards(item[relation[key]])
          }
          return item[relation[key]]
        })
      })
      excelDerive(headers, title, data)
    },
    // 是否全勤转换
    fStandards(state) {
      return state === 0 ? '是' : '否'
    },
    // 获取部门列表,并初始化数据请求,以当前时间,第一个部门
    async getDepartments() {
      const { depts } = await getDepartments()
      this.departmentData = depts
      this.requestParameters.departmentId = depts[0].id // 第一个部门的id
      this.getArchivingList()
    },
    // 部门选择改变,更新报表列表
    selectChange() {
      this.getArchivingList()
    }
  }

}
</script>

<style lang="scss" scoped>
@import "../../../styles/variables.scss";
 .historicalArcBox {
  padding: 20px;
  .historicalArcTop {
    position: relative;
    background: #fff;
    padding: 10px 15px 0 15px;
    .title {
      color: $blue;
      line-height: 40px;
      border-bottom: solid 2px $blue;
      font-size: 18px;
      font-weight: bold;
      display: inline-block;
      padding: 0 25px;
      .yearChange {
        position: absolute;
        top: 5px;
        right: 10px;
      }
    }
  }
  .historicalTable {
    background: #fff;
    .itemes {
      .itemTopLab {
        border-top: solid 1px #f0f0f0;
        border-bottom: solid 3px #ccc;
        padding: 15px;
        .fr {
          text-align: center;
        }
        div {
          display: inline-block;
          padding: 10px 50px 0;
        }

        div:last-child,
        div:first-child {
          border: none;
        }
        .lab {
          position: relative;
          top: -30px;
          padding-right: 0;
          padding-left: 15px;
        }
        .labTit {
          cursor: pointer;
        }
        .title {
          font-size: 16px;
          margin: 10px 0;
          span {
            position: relative;
            bottom: -2px;
            font-size: 13px;
            color: #999;
            margin-left: 5px;
          }
        }
        .itemTit {
          color: #999;
          margin: 8px 0;
          font-size: 13px;
        }
        .itemNum {
          font-size: 20px;
          margin: 0;
        }
      }
      .itemDropDown {
        background: #fff;
        .topLab {
          position: relative;
          padding: 15px 15px 30px;
          div {
            display: inline-block;
            margin: 0 10px;
            span {
              display: inline-block;
              position: relative;
              top: 2px;
              margin-right: 5px;
              width: 15px;
              height: 15px;
              background: $cl-1;
            }
          }
          .rightLabBox {
            position: absolute;
            right: -10px;
            top: 10px;
            .btn {
              border: solid 1px $green;
              color: $green;
              border-radius: 3px;
              padding: 4px 10px;
              font-size: 14px;
            }
          }
        }
      }
      .act {
        border-bottom: solid 3px $blue;
        .lab {
          color: $blue;
        }
        .labTit {
          color: $blue;
        }
      }
    }
    .itemes:hover {
      background: #fafbff;
    }
    .itemes .lab:hover {
      cursor: pointer;
    }
  }
}
</style>
