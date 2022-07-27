<template>
  <div>
    <el-card class="box-card">
      <el-tag
        v-for="(item,index) in crumbsList"
        :key="item.title"
        closable
        size="small"
        :disable-transitions="false"
        :class="{active:activeIndex === index}"
        @close="handleClose(index)"
        @click="skipRoute(item,index)"
      >
        <span v-if="activeIndex === index" class="dot" />
        {{ item.title }}
      </el-tag>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'CrumbsNav',
  data() {
    return {
      activeIndex: 0,
      crumbsList: [] // 面包屑列表
    }
  },
  watch: {
    $route(newValue) {
      console.log(newValue.name)
      // 提取信息
      const nav = {
        title: newValue.meta.title,
        name: newValue.name || '',
        query: newValue.query || {},
        params: newValue.params || undefined
      }
      // 去重
      const flag = this.crumbsList.findIndex(item => item.title === nav.title)
      // 不存在则添加
      if (flag === -1) {
        this.crumbsList.push(nav)
        // 修改当前的索引
        this.activeIndex = this.crumbsList.length - 1
      } else {
        // 存在则只修改索引
        this.activeIndex = flag
      }
    }
  },
  methods: {
    // 删除
    handleClose(index) {
      // 移除导航项
      this.crumbsList.splice(index, 1)
      // // 如果删除的是当前导航
      if (this.activeIndex === index) {
        if (index === 0 && this.crumbsList.length !== 0) { // 索引为0
          this.activeIndex === 0
        } else if (this.crumbsList.length === 0) { // 索引为最后一个时,跳转首页
          this.$router.push('/dashboard')
          return false
        } else { // 为其他的
          console.log('else')
          this.activeIndex = this.activeIndex - 1
        }
      } else if (this.activeIndex > index) { // 非当前路由
        this.activeIndex = this.activeIndex - 1
      }

      // 跳转路由
      this.$router.push({
        name: this.crumbsList[this.activeIndex].name,
        query: this.crumbsList[this.activeIndex].query,
        params: this.crumbsList[this.activeIndex].params
      })
    },
    // 点击事件路由跳转
    skipRoute(item, index) {
      // 代参数路由跳转
      this.$router.push({
        name: item.name,
        query: item.query,
        params: item.params
      })
      // 修改当前索引
      this.activeIndex = index
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card{
  margin-bottom: 10px;
  box-sizing: border-box;
  height: 44px;
  ::v-deep .el-card__body{
  padding: 10px 10px;
 }
  .el-tag{
   background-color: #fff;
   color:black;
   border-color:#ccc;
   border-radius:0;
   margin-right:10px;
    //  小圆点样式
    .dot {
    display: inline-block;
    height: 8px;
    width: 8px;
    background-color: #fff;
    border-radius:8px;
    margin-right:4px;
    }
  }
  .active {
    background-color: rgb(64,158,255);
    color:#fff;
    border-color:rgb(64,158,255);
    ::v-deep .el-tag__close{
     color:#fff;
    }
  }
}

</style>
