<template>
  <div>
    <!--  -->
    <UploadExcel :on-success="success" :type="type" />
  </div>
</template>

<script>
import UploadExcel from '@/components/UploadExcel'
export default {
  name: 'Import',
  components: {
    UploadExcel
  },
  data() {
    return {
      type: this.$route.query.type // 传递的为user,判断是否导入员工，还可以导入其他
    }
  },
  methods: {
    success(results) {
      //  如果是添加员工列表则做如下处理
      if (this.type === 'user') {
        // 处理表格数据并上传
        // results为excel中的数据
        // 处理表格中数据的函数，将格式转为需要的格式再传给服务器，根据需求处理函数
        const userRelations = {
          // 先将表头对应的英文存入该变量，后续匹配，再将表头的中文转换为英文，用于提交
          入职日期: 'timeOfEntry',
          手机号: 'mobile',
          姓名: 'username',
          转正日期: 'correctionTime',
          工号: 'workNumber'
        }
        const arr = [] // 用于存储最终的数据，用于提交
        results.forEach((item) => {
          const userInfo = {} // 存储每个人的信息
          Object.keys(item).forEach((key) => {
            // 对入职日期和转正日期做一个处理
            if (
              userRelations[key] === 'timeOfEntry' ||
              userRelations[key] === 'correctionTime'
            ) {
              // 转化时间
              // let time = this.formDate(item[key], "/");
              // console.log(new Date(time));
              userInfo[userRelations[key]] = item[key] // 将时间转化为标准时间再赋值
              return
            }
            userInfo[userRelations[key]] = item[key]
          })
          arr.push(userInfo)
        })
        return arr
      }
      // 考勤导入,对插件读取的数据进行转换
      if (this.type === 'attendances') {
        // 定义表头对照
        const userRelations = {
          // 先将表头对应的英文存入该变量，后续匹配，再将表头的中文转换为英文，用于提交
          姓名: 'name',
          工号: 'workNumber',
          手机号: 'mobile',
          部门: 'department',
          事假: 'leaveDays',
          调休: 'dayOffLeaveDays',
          正常: 'normalDays',
          迟到次数: 'laterTimes',
          早退次数: 'earlyTimes',
          日均时长: 'hoursPerDays',
          旷工天数: 'absenceDays',
          是否全勤: 'isFullAttendanceint',
          实际出勤天数: 'actualAtteOfficialDays',
          应出勤天数: 'actualAtteOfficialDays',
          计薪标准: 'salaryStandards',
          计薪天数: ' salaryOfficialDays'

        }
        const arr = [] // 用于存储最终的数据，用于提交
        results.forEach((item) => {
          const userInfo = {} // 存储每个人的信息
          Object.keys(item).forEach(key => {
            userInfo[userRelations[key]] = item[key]
          })
          arr.push(userInfo)
        })
        return arr
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
