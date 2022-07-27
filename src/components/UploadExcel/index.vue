<template>
  <div class="flex">
    <div class="left">
      <el-button
        size="small"
        type="primary"
        @click="isUpload"
      >点击上传</el-button>
    </div>
    <div class="right">
      <el-upload
        ref="uploadExl"
        class="upload-demo"
        drag
        multiple
        action="#"
        accept=".xlsx,.xls"
        :on-change="onChange"
        :auto-upload="false"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处</div>
      </el-upload>
    </div>
  </div>
</template>

<script>
import xlsx from 'xlsx'
import { importEmployee } from '@/api/employees'
export default {
  name: 'UploadExcel',
  props: {
    onSuccess: {
      type: Function
    },
    type: { // 上传文件类型,用于判断使用哪个接口
      type: String
    }
  },
  data() {
    return {
      results: [], // 存储excel的数据
      fileList: [] // 存储文件列表
    }
  },
  methods: {
    // 文件内容状态被改变时调用
    async onChange(file, fileList) {
      // 将文件列表存储
      this.fileList = fileList
      // 文件类型检查提示
      const flag = this.file.name.subString(this.file.name.lastIndexOf('.'))
      if (flag !== 'xlsx' || flag !== 'xls') {
        this.$message.error('上传文件格式不正确,只能上传表格')
        return
      }
      if (fileList.length !== 0) {
        // 读取文件
        const dataBinary = await this.readFile(file.raw)
        const workBook = xlsx.read(dataBinary, {
          type: 'binary',
          cellDates: true
        })
        const workSheet = workBook.Sheets[workBook.SheetNames[0]] // 读取第一张表格
        const data = xlsx.utils.sheet_to_json(workSheet) // 转为json数据
        // 将读取的数据的属性名做一个处理，然后返回
        this.results = this.onSuccess(data) // 格式化数据
        console.log(data, 'data')
      } else {
        this.$message.error('请至少上传一个文件')
      }
    },
    // 读取文件
    readFile(file) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = (ev) => {
          resolve(ev.target.result)
        }
      })
    },
    // 点击上传
    async isUpload() {
      if (this.fileList.length === 0) {
        this.$message.error('请至少上传一个文件')
        return false
      }

      // 批量导入员工
      if (this.type === 'user') {
        try {
          // 批量添加员工
          await importEmployee(this.results)
          this.$message.success('批量添加成功')
          this.$refs['uploadExl'].clearFiles() // 清除上传列表
          this.results = []
        // 更新数据
        } catch (error) {
          console.log(error)
        }
      }
      // 批量导入员工考勤,没有接口
      if (this.type === 'attendances') {
        console.log(this.results)
        this.$message.success('批量添加成功')
        this.$refs['uploadExl'].clearFiles() // 清除上传列表
        this.results = []
      }
    }
  }
}
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
