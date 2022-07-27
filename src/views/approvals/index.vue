<template>
  <div class="approvals-container">
    <div class="approvals-content">
      <!-- 顶部组件 -->
      <div class="interval top">
        <PageTools>
          <template v-slot:before>
            当前审批中 0 本月审批通过 1 本月审批驳回 0
          </template>
          <template v-slot:after>
            <el-button type="primary" size="mini" @click="$router.push('/approvals/securitySetting')">流程设置</el-button>
          </template>
        </PageTools>
      </div>

      <!-- 审批列表展示 -->
      <div class="interval">
        <el-card>
          <el-table
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              width="80"
            />
            <el-table-column
              prop="processName"
              label="审批类型"
              sortable
            />
            <el-table-column
              prop="username"
              label="申请人"
              sortable
            />
            <el-table-column
              prop="procCurrNodeUserName"
              label="当前审批人"
              sortable
            />
            <el-table-column
              prop="procApplyTime"
              label="审批发起时间"
              :formatter="dateTime"
              sortable
            />
            <el-table-column
              label="审批状态"
              sortable
            >
              <template slot-scope="scope">
                <span v-if="scope.row.processState==='0'" class="rovalsState">
                  <em class="sub" />已提交
                </span>
                <span v-if="scope.row.processState==='1'" class="rovalsState">
                  <em class="stay" />审批中
                </span>
                <span v-if="scope.row.processState==='2'" class="rovalsState">
                  <em class="adopt" />审批通过
                </span>
                <span v-if="scope.row.processState==='3'" class="rovalsState">
                  <em class="reject" />审批不通过
                </span>
                <span v-if="scope.row.processState==='4'" class="rovalsState">
                  <em class="revoke" />撤销
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="toDetail(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>

  </div>
</template>

<script>
import PageTools from '@/components/PageTools'
import { getApprovalList } from '@/api/approvals'
import * as dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

export default {
  name: 'Approvals',
  components: {
    PageTools
  },
  data() {
    return {
      tableData: [],
      infoList: { // 要传参数据
        page: 1,
        pageSize: 10
      },
      total: 0 // 数据总条数
    }
  },
  mounted() {
    this.getApprovalListInfo()
  },
  methods: {
    // 初始化审批列表请求
    async getApprovalListInfo() {
      try {
        const res = await getApprovalList(this.infoList)
        this.tableData = res.rows
        this.total = res.total
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    },
    // 事件转换处理函数
    dateTime(row) {
      return dayjs(row.procApplyTime).format('YYYY-MM-DD')
    },
    // 查看的处理函数
    toDetail(obj) {
      var name = obj.processName // 传入数据读取审批类型
      switch (name) {
        case '请假':
          this.$router.push({ path: '/approvals/leaveApproval/' + obj.processId })
          break
        case '离职':
          this.$router.push({ path: '/approvals/quitApproval/' + obj.processId })
          break
        case '加班':
          this.$router.push({ path: '/approvals/overtimeApproval/' + obj.processId })
      }
    }
  }

}
</script>

<style scoped>
 .interval{
  margin: 0 20px;
  margin-bottom:10px;
 }
 .top{
  margin-top:30px
 }
</style>
