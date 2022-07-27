<template>
  <div class="quitApproval">
    <div class="contLeft">
      <div class="topTit">
        <img src="@/assets/common/img.jpeg" alt>
        <div class="info">
          <p class="name">
            <strong>{{ information.username }}</strong>
          </p>
          <p>
            <span>部门：{{ information.departmentName }}</span>
          </p>
          <p>
            <span>入职时间： {{ information.timeOfEntry | formatDate }}</span>
          </p>
        </div>
      </div>
      <div class="content">
        <!-- <p v-for="(item, index) in information.body" :key="index"><span>{{item.key}} </span> {{item.val}}</p> -->
        <p>
          <span>补偿方式：</span>
          调休
        </p>
        <p>
          <span>加班开始时间：</span>
          {{ information.data.start_time | formatDate }}
        </p>
        <p>
          <span>加班结束时间：</span>
          {{ information.data.end_time | formatDate }}
        </p>
        <p>
          <span>申请原因：</span>
          {{ information.data.reason }}
        </p>
      </div>
    </div>
    <div class="contRit">
      <div class="topTit">
        <strong>审批记录</strong>
      </div>
      <div class="Items">
        <li v-for="(item, index) in taskInstanceOutList" :key="index">
          <div class="name" :style="index==taskInstanceOutList.length-1?'border-right:none':''">
            <p>{{ item.handleTime | formatDate }}</p>
            <!-- <p>{{item.description}}</p> -->
          </div>
          <div class="act">
            <strong>{{ item.handleUserName }}</strong>
            <span v-if="index==0">发起申请</span>
            <span v-else-if="item.handleType == '3'">审批驳回</span>
            <span v-else-if="item.handleType == '4'">已撤销</span>
            <span v-else-if="item.handleType == '1'">未开始</span>
            <span v-else-if="item.handleType == '2'">审批通过</span>
            <span v-else>审批中</span>
          </div>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { getApprovalsDetail, getApprovalsTaskDetail } from '@/api/approvals'
export default {
  name: 'Overtime',
  filters: {
    // 时间处理函数
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD')
    }
  },
  data() {
    return {
      approvalId: this.$route.params.id, // 审批带id
      information: { }, // 审批单详情
      taskInstanceOutList: [] // 审批流程向请
    }
  },
  mounted() {
    this.getApprovalsDetail()
    this.getApprovalsTaskDetail()
  },
  methods: {
    // 初始化请求，审批单详情
    async getApprovalsDetail() {
      const res = await getApprovalsDetail(this.approvalId)
      this.information = res
      this.$set(this.information, 'data', JSON.parse(this.information.procData))
    },
    // 获取审批单审批明细
    async getApprovalsTaskDetail() {
      this.taskInstanceOutList = await getApprovalsTaskDetail(this.approvalId)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
