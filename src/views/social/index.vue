<template>
  <div class="social-container">
    <div class="social-content">
      <!-- 顶部组件 -->
      <div class="marginBottom">
        <PageTools>
          <template v-slot:before>
            本月：社保在缴{{ 'xx' }}&nbsp;&nbsp;公积金在缴{{ 'xx' }}&nbsp;&nbsp;增员{{ 'xx' }}&nbsp;&nbsp;减员{{ 'xx' }}&nbsp;&nbsp;入职{{ 'xx' }}&nbsp;&nbsp;离职{{ 'xx' }}
          </template>
          <template v-slot:after>
            <el-button type="danger" size="mini" @click="$router.push('/social/historicalArchiving')">历史归档</el-button>
            <el-button type="primary" size="mini" @click="$router.push(`/social/monthStatement?yearMonth=${dataMonth}`)">{{ dataMonth }}报表</el-button>
          </template>
        </PageTools>
      </div>

      <!-- 筛选组件 -->
      <div class="marginBottom">  <SocialTool @changeSelectParams="changeSelectParams" /></div>

      <!-- 列表展示区 -->
      <div class="marginBottom">
        <el-card class="box-card">
          <el-table
            :data="socialList"
            style="width: 100%"
          >
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
              prop="departmentName"
              label="部门"
            />
            <el-table-column
              prop="timeOfEntry"
              label="入职时间"
            />
            <el-table-column
              prop="leaveTime"
              label="离职时间"
            />
            <el-table-column
              prop="participatingInTheCity"
              label="社保城市"
            />
            <el-table-column
              prop="providentFundCity"
              label="工积金城市"
            />
            <el-table-column
              prop="socialSecurityBase"
              label="社保基数"
            />
            <el-table-column
              prop="providentFundBase"
              label="公积金基数"
            />
            <el-table-column
              label="操作"
            >
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push(`/social/detail/${row.id}`)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页器 -->
          <div class="pagination">
            <el-pagination
              :page-size="socialParams.pageSize"
              :pager-count="11"
              :current-page="socialParams.page"
              layout="prev, pager, next"
              :total="total"
              @current-change="currentChange"
            />
          </div>

        </el-card>
      </div>

    </div>

  </div>
</template>

<script>
import SocialTool from './components/SocialTool'
import PageTools from '@/components/PageTools'
import { getSocialList, getSettings } from '@/api/social'
export default {
  name: 'Social',
  components: {
    SocialTool,
    PageTools
  },
  data() {
    return {
      socialList: [], // 社保列表
      socialParams: {
        page: 1,
        pageSize: 10,
        departmentChecks: [], // 部门列表
        providentFundChecks: [], // 公积金城市列表
        socialSecurityChecks: []// 参保城市列表
      },
      total: 0, // 总数
      dataMonth: ''// 报表时间,后续路由跳转需要
    }
  },
  mounted() {
    this.socialInfo()
    this.getSettingsInfo()
  },
  methods: {
    // 初始化社保列表请求
    async socialInfo() {
      const { rows, total } = await getSocialList(this.socialParams)
      this.total = total
      this.socialList = rows
    },
    // 通过企业配置信息接口，获取报表时间
    async getSettingsInfo() {
      const { dataMonth } = await getSettings()
      this.dataMonth = dataMonth
    },
    // 当前页改变时触发
    currentChange(page) {
      // 修改当前页面
      this.socialParams.page = page
      // 更新数据
      this.socialInfo()
    },
    // 筛选处理函数
    changeSelectParams(params) {
      // 合并数据
      this.socialParams = { ...this.socialParams, ...params }
      // 更新数据
      this.socialInfo()
    }
  }

}
</script>

<style scoped>
.pagination{
  display: flex;
  justify-content: center;
}
.marginBottom{
  margin-bottom:15px;
}

</style>
