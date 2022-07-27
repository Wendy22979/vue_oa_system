<template>
  <div class="salarys-container">
    <div class="salarys-content">
      <!-- 顶部 -->
      <PageTools>
        <template v-slot:before>
          本月0：入职 0 离职 0 调薪 0 未定薪 0
        </template>
        <template v-slot:after>
          <el-button type="danger" size="mini" @click="$router.push({name:'salarysSetting'})">设置</el-button>
          <el-button type="primary" size="mini" @click="$router.push(`/salarys/monthStatement?yearMonth=${yearMonth}`)">{{ yearMonth }}报表</el-button>
        </template>
      </PageTools>

      <!-- 筛选区域 -->
      <el-card class="box-card">
        <el-form ref="form" label-width="100px">
          <el-form-item label="聘用形式：">
            <el-checkbox-group v-model="formData.approvalsTypeChecks">
              <el-checkbox v-for="item in hireType" :key="item.id" :label="item.id" name="type" @change="changeParams">{{ item.value }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="员工状态：">
            <el-checkbox-group v-model="formData.approvalsStateChecks">
              <el-checkbox v-for="item in workingState" :key="item.id" :label="item.id" name="type" @change="changeParams">{{ item.value }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="部门：">
            <el-checkbox-group v-model="formData.departmentChecks">
              <el-checkbox v-for="item in departmentsList" :key="item.id" :label="item.name" name="type" @change="changeParams" />
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 员工薪资展示列表 -->
      <el-card class="box-card">
        <el-table
          :data="list"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
          />
          <el-table-column
            prop="username"
            label="姓名"
            width="180"
          />
          <el-table-column
            prop="mobile"
            label="手机"
            width="180"
          />
          <el-table-column
            prop="workNumber"
            label="工号"
          />
          <el-table-column
            prop="formOfEmployment"
            label="聘用形式"
          />
          <el-table-column
            prop="departmentName"
            label="部门"
          />
          <el-table-column
            prop="timeOfEntry"
            label="入职时间"
            :formatter="formatEmployment"
          />
          <el-table-column
            label="工资基数"
          >
            <template slot-scope="scope">
              {{ scope.row.currentBasicSalary + scope.row.currentPostWage }}
            </template>
          </el-table-column>
          <el-table-column
            label="津贴方案"
          >通用方案</el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.currentBasicSalary"
                size="mini"
                type="primary"
                @click="changeSalary('ChangeSalary',scope.row.id)"
              >调薪</el-button>
              <el-button
                v-else
                size="mini"
                type="danger"
                @click="fixedSalary('FixedSalary',scope.row.id)"
              >定薪</el-button>
              <el-button type="text" size="mini">
                <router-link :to="{'path': '/salarys/details/'+yearMonth+'/'+scope.row.id}">查看</router-link>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <div class="pagination">
          <Pagination
            :current-page.sync="page.page"
            :page-size="page.pageSize"
            :total="page.total"
            :updata-list="getSalarysListInfo"
          />
        </div>
      </el-card>

      <!-- 弹窗 -->
      <el-dialog :title="topLabel" :visible="centerDialogVisible" width="50%" left :before-close="handleClose">
        <component
          :is="currentComponent"
          :user-salary="selectedSalaryInfo"
          :user-id="selectUserId"
          @success="getSalarysListInfo"
          @onDialogCancel="handleClose"
        />
        <!-- <ChangeSalary v-if="seeState == 'changeSalary'" :user-salary="selectedSalaryInfo" :user-id="selectUserId" @onDialogCancel="centerDialogVisible=false" /> -->
        <!-- <FixedSalary v-if="seeState == 'fixedSalary'" /> -->
      </el-dialog>
    </div>

  </div>
</template>

<script>
import PageTools from '@/components/PageTools'
import { getSalarysList, getCompanySetting, getSalaryDetail } from '@/api/salarys'
import EmployeeData from '@/api/constant/employees' // 列表渲染的下拉框
import { getDepartments } from '@/api/departments'
import { yearMonthDay } from '@/utils/dateFormatting'
import FixedSalary from './compnents/FixedSalary'
import ChangeSalary from './compnents/ChangeSalary'
export default {
  name: 'Salarys',
  components: {
    PageTools,
    FixedSalary,
    ChangeSalary
  },
  data() {
    return {
      page: { // 页码信息
        total: 0,
        page: 1,
        pageSize: 10
      },
      yearMonth: '', // 当月月份
      formData: { // 筛选条件
        approvalsTypeChecks: [], // 聘用形式
        approvalsStateChecks: [], // 员工状态
        departmentChecks: [] // 员工部门
      },
      list: [], // 员工薪资列表
      departmentsList: [], // 部门列表,
      hireType: EmployeeData.hireType, // 聘用类型
      workingState: EmployeeData.workingState, // 员工状态
      currentComponent: '', // 当前组件名
      centerDialogVisible: false, // 弹框显示隐藏
      topLabel: '', // 弹框标题
      selectedSalaryInfo: '', // 员工工资信息
      selectUserId: ''// 员工id

    }
  },
  mounted() {
    this.getSalarysListInfo()
    this.getDepartments()
  },
  methods: {
    // 获取初始化员工薪资列表
    async getSalarysListInfo() {
      const data = await getCompanySetting()
      this.yearMonth = data.dataMonth // 当月月份
      const { rows, total } = await getSalarysList({ ...this.page, ...this.formData })
      this.page.total = total
      this.list = rows
    },
    // 部门列表请求
    async getDepartments() {
      try {
        const res = await getDepartments()
        this.departmentsList = res.depts
      } catch (error) {
        console.log(error)
      }
    },
    // 筛选处理函数
    changeParams() {
    //  更新数据
      this.getSalarysListInfo()
    },
    // 时间处理
    formatEmployment(option) {
      return yearMonthDay(option.timeOfEntry)
    },
    // 修改数据，是弹窗内部的组件进行切换,调薪处理函数
    async  changeSalary(name, id) {
      this.currentComponent = name // 修改组件名
      this.topLabel = '调薪' // 修改弹窗标题
      this.centerDialogVisible = true // 显示弹窗
      this.selectUserId = id
      // 查询员工工资
      try {
        this.selectedSalaryInfo = await getSalaryDetail(id)
      } catch (error) {
        console.log(error)
      }
    },
    // 定薪处理函数
    fixedSalary(name, id) {
      this.topLabel = '定薪'
      this.currentComponent = name
      this.centerDialogVisible = true
      this.selectUserId = id
    },
    handleClose() {
      // 关闭弹窗
      this.centerDialogVisible = false
    }
  }

}
</script>

<style scoped>
 .salarys-content{
  padding: 0 15px;
 }
 .box-card{
  margin-top:15px;
 }
 .pagination{
  text-align: center;
 }
</style>
