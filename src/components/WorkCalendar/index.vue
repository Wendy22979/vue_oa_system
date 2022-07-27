<template>
  <div>
    <!-- 年和月修改 -->
    <el-row type="flex" justify="end">
      <!-- 年 用组件给定一个日期，日期获取年，年取前五年 + 后五年 -->
      <el-select v-model="currentYear" size="small" style="width: 120px" @change="dataChange">
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left: 10px" @change="dataChange">
        <!-- 循环 -->
        <el-option v-for="item in 12" :key="item" :label="item" :value="item" />
      </el-select>
    </el-row>

    <!-- 日历插件 -->
    <el-calendar v-model="currentDate">
      <template
        slot="dateCell"
        slot-scope="{date, data}"
      >
        <div class="date-content">
          <span class="text"> {{ data.day|getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  name: 'WorkCalendar',
  filters: {
    getDay(value) {
      const day = value.split('-')[2]
      return day
    }
  },
  props: {
    startDate: {
      type: Date,
      // 回调函数式的返回值
      default: () => new Date() // 如果没有传递startDate 就取当前时间
    }
  },
  data() {
    return {
      // 当前年份
      currentYear: '', // 初始化赋值
      yearList: [], // 当前年份前后五年的数组
      currentMonth: '', // 当前月份，初始化赋值
      currentDate: '' // 当前时间,组件挂载后赋值
    }
  },
  mounted() {
    this.removeCalendar()
    this.currentDate = this.startDate // 当前时间
    this.currentYear = this.startDate.getFullYear()
    this.currentMonth = this.startDate.getMonth() + 1 // 当前月份
    this.setYear() // 生成年数
  },
  methods: {
    // 日历不需要的删除
    removeCalendar() {
      this.$el.querySelector('.el-calendar__title').remove() // 删除日历年月日
      this.$el.querySelector('.el-button-group').remove() // 删除
      this.$el.querySelector('.el-calendar__header').remove() // 删除日历分割线
    },
    // 判断是否是周末
    isWeek(date) {
      const week = date.getDay() - 0
      if (week === 6 || week === 0) {
        return true
      } else {
        return false
      }
    },
    // 改变年月日
    dataChange() {
      // 修改当前时间，默认是1日开始
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`)
    },
    // 为当前年份生成前后五年的年数
    setYear() {
      this.yearList = Array.from(Array(11), (v, i) => { return this.currentYear - 5 + i })
    }
  }

}
</script>

<style  scoped>
 /deep/ .el-calendar-day {
  height:  auto;
 }
 /deep/ .el-calendar-table__row td,/deep/ .el-calendar-table tr td:first-child,  /deep/ .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 /deep/ .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 /deep/ .el-calendar__header {
   display: none
 }

</style>
