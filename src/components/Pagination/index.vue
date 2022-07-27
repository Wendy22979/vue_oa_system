<template>
  <div>
    <!-- 分页器 -->
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      layout=" prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: { // 总数
      type: Number,
      required: true
    },
    pageSize: { // 每页条数
      type: Number,
      default: 10
    },
    currentPage: { // 当前页码数
      type: Number,
      default: 1
    },
    updataList: { // 父组件更新数据函数
      type: Function,
      required: true
    }
  },
  methods: {
    // 页码改变触发事件
    handleCurrentChange(newValue) {
      // 更改父组件当前页码
      this.$emit('update:current-page', newValue)
      // 父组件更新数据
      this.updataList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
