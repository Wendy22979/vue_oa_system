<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <h2 class="centInfo">{{ this.$route.params.month }}人事报表</h2>
        <el-tabs v-model="activeName" class="infoPosin">
          <el-tab-pane name="first">
            <span slot="label">考勤统计</span>
            <!-- <component :is="allList" :show-height="showHeight" :month="this.$route.params.month" @archivingReportForm="archivingReportForm" /> -->
            <AllList :month="this.$route.params.month" @archivingReportForm="archivingReportForm" />
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import AllList from '../components/AllList'
import { fileUpdate } from '@/api/attendances'
export default {
  name: 'Report',
  components: {
    AllList
  },
  data() {
    return {
      activeName: 'first' // 当前tab
    }
  },
  methods: {
    // 归档报表
    archivingReportForm() {
      this.$confirm(
        '报表归档将覆盖上一次归档记录，无法恢复。',
        '归档确认'
      )
        .then(async() => {
          await fileUpdate({ month: this.$route.params.month })
          this.$message.success('归档报表成功')
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
