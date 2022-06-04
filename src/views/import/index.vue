<template>
  <div>
    <UploadExcel :onSuccess="success" />
  </div>
</template>

<script>
import UploadExcel from "@/components/UploadExcel";
export default {
  name: "Import",
  data() {
    return {
      type: this.$route.query.type, //传递的为user,判断是否导入员工，还可以导入其他
    };
  },
  methods: {
    success(results) {
      //  如果是添加员工列表则做如下处理
      if (this.type == "user") {
        //处理表格数据并上传
        // console.log("header",header)
        // console.log("results",results)
        // results为excel中的数据
        // 处理表格中数据的函数，将格式转为需要的格式再传给服务器，根据需求处理函数
        const userRelations = {
          //先将表头对应的英文存入该变量，后续匹配，再将表头的中文转换为英文，用于提交
          入职日期: "timeOfEntry",
          手机号: "mobile",
          姓名: "username",
          转正日期: "correctionTime",
          工号: "workNumber",
        };
        const arr = []; //用于存储最终的数据，用于提交
        results.forEach((item) => {
          let userInfo = {}; //存储每个人的信息
          Object.keys(item).forEach((key) => {
            // 对入职日期和转正日期做一个处理
            if (
              userRelations[key] === "timeOfEntry" ||
              userRelations[key] === "correctionTime"
            ) {
              // 转化时间
              // let time = this.formDate(item[key], "/");
              // console.log(new Date(time));
              userInfo[userRelations[key]] = item[key]; //将时间转化为标准时间再赋值
              return;
            }
            userInfo[userRelations[key]] = item[key];
          });
          arr.push(userInfo);
        });
        return arr;
      }
    },
    // // },
    // 转化excel日期的格式
    // formDate(numb, format) {
    //   console.log(numb)
    //   // const time = new Date((numb - 1) * 24 * 3600000 + 1);
    //   // time.setYear(time.getFullYear() - 70);
    //   const time = numb
    //   const year = time.getFullYear() + "";
    //   const month = time.getMonth() + 1 + "";
    //   const date = time.getDate() - 1 + "";
    //   if (format && format.length !== 0) {
    //     //如果传了年月日的分隔符就该格式，例2022-1-12
    //     return year + format + month + format + date;
    //   }
    //   return (
    //     //否则使用补零字符串形式例20220117
    //     year +
    //     (month < 10 ? "0" + month : month) +
    //     (date < 10 ? "0" + date : date)
    //   );
    // },
  },
  components: {
    UploadExcel,
  },
};
</script>

<style lang="scss" scoped>
</style>