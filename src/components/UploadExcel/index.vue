<template>
  <div class="flex">
    <div class="left">
      <el-button size="small" type="primary" @click="isUpload"
        >点击上传</el-button
      >
    </div>
    <div class="right">
      <el-upload
        class="upload-demo"
        drag
        multiple
        action="#"
        accept=".xlsx,.xls"
        :on-change="onChange"
        ref="uploadExl"
        :auto-upload="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处</div>
      </el-upload>
    </div>
  </div>
</template>

<script>
import xlsx from "xlsx";
import { importEmployee } from "@/api/employees";
export default {
  name: "UploadExcel",
  data() {
    return {
      results: [], //存储excel的数据
      fileList: [], //存储文件列表
    };
  },
  methods: {
    // 文件内容状态被改变时调用
    async onChange(file, fileList) {
      // 将文件列表存储
      this.fileList = fileList;
      if (fileList.length !== 0) {
        // 读取文件
        let dataBinary = await this.readFile(file.raw);
        let workBook = xlsx.read(dataBinary, {
          type: "binary",
          cellDates: true,
        });
        let workSheet = workBook.Sheets[workBook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(workSheet);
        console.log(data);
        //将读取的数据的属性名做一个处理，然后返回
        this.results = this.onSuccess(data);
      } else {
        this.$message.error("请至少上传一个文件");
      }
    },
    // 读取文件
    readFile(file) {
      return new Promise((resolve) => {
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (ev) => {
          resolve(ev.target.result);
        };
      });
    },
    // 点击上传
    async isUpload() {
      if (this.fileList.length == 0) {
        this.$message.error("请至少上传一个文件");
        return false;
      }
      try {
        console.log(this.results);
        // 批量添加员工
        await importEmployee(this.results);
        this.$message.success("批量添加成功");
        this.$refs["uploadExl"].clearFiles();
        this.results = [];
        // 更新数据
      } catch (error) {
        console.log(error);
      }
    },
  },
  props: {
    onSuccess: {
      type: Function,
    },
  },
};
</script>

<style lang="scss" scoped>
.left {
  width: 360px;
  height: 180px;
  border: 1px dashed #ccc;
  border-right: none;
  text-align: center;
  line-height: 180px;
}
.flex {
  display: flex;
  justify-content: center;
  padding-top: 100px;
}
</style>