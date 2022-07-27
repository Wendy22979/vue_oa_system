<template>
  <div class="securitySetting">
    <div class="settingList">
      <div v-for="(item,index) in flowList" :key="item.id" class="set">
        <span>{{ item.name }}</span>
        <span>
          <el-switch
            v-model="flowState[index]"
            active-color="#13ce66"
            :inactive-color="inactiveColor"
            @change="handleChange(item,$event)"
          />
        </span>
        <i class="el-icon-setting" @click="setFlow(index,`${item.name}流程`)" />
      </div>
    </div>
    <el-dialog :title="flowName" :visible="dialogVisible" width="30%" :before-close="handleClose">
      <span style="text-align:center">
        <el-upload
          ref="elUpload"
          class="upload-demo"
          drag
          action="#"
          :on-change="changFile"
          :file-list="fileList"
          multiple
          :http-request="uploadFail"
          :auto-upload="false"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处</div>
        </el-upload>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadFail('confirm')">点击上传</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getFlowList, suspend, uploadFile } from '@/api/approvals'
export default {
  name: 'Security',
  data() {
    return {
      requestData: {},
      activeColor: '#13ce66', // 开关打开时的颜色
      inactiveColor: '#ccc', // 开关关闭时的颜色
      dialogVisible: false, // 弹窗是否显示
      flowName: '', // 弹窗标题
      dataBase: [],
      flowState: [], // 流程状态
      flowList: [], // 流程列表
      fileList: [] // 文件列表
    }
  },
  mounted() {
    this.getProcessList()
  },
  methods: {
    // 流程列表获取
    async getProcessList() {
      try {
        const res = await getFlowList()
        console.log(res)
        this.flowList = [...res]
        // 将激活状态存储,此处分离出来，后续传参时更方便，激活状态也需要处理，2为false
        this.flowState = this.flowList.map(item => {
          return item.persistentState.suspensionState !== 2
        })
      } catch (error) {
        console.log(error)
      }
    },
    changFile(file, fileList) {
      this.fileList = fileList
    },
    // 修改流程激活状态
    async handleChange(flow, e) {
      if (!flow.key) {
        this.$message.error('暂不可修改流程状态')
        return false
      }

      // 有key，修改流程状态
      try {
        var parent = {
          processKey: flow.key,
          enable: e
        }
        await suspend(parent)
        this.$message.success('已修改成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 修改弹窗显示状态
    setFlow(index, name) {
      // 为未激活状态
      if (!this.flowState[index]) {
        this.$message.warning('流程未激活，不可使用')
        return
      }
      // 修改弹窗标题
      this.flowName = name
      // 激活状态则修改弹窗
      this.dialogVisible = true
    },
    // 自定义上传
    async uploadFail(btn) {
      // 点击确定后上传
      if (btn === 'confirm') {
        try {
        //  上传文件
          const data = new FormData()
          data.append('file', this.fileList[0].raw)
          uploadFile(data)
          this.$message.success('上传成功')
          // 关闭弹窗
          this.dialogVisible = false
          // 清空文件列表
          this.fileList = []
        } catch (error) {
          console.log(error)
        }
      }
    },
    // 弹窗x和取消处理函数
    handleClose() {
    //  清空上传的文件
      this.fileList = []
      // 关闭弹窗
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/variables";
$active: #13ce66;
$inactive: #ccc;
.securitySetting {
  padding: 20px;
  background: #fff;
  border-radius: 3px;
  margin: 15px;
  border: 1px solid #ebeef5;
  .settingList {
    margin-bottom: 20px;
    .title {
      font-weight: bold;
      line-height: 40px;
      margin-bottom: 20px;
      border-bottom: solid 1px #ccc;
    }
    .set {
      border: solid 1px #ccc;
      border-radius: 3px;
      padding: 15px 30px 15px 20px;
      position: relative;
      display: inline-block;
      margin-right: 20px;
      span:first-child {
        padding-right: 15px;
        border-right: solid 1px #ccc;
        margin-right: 15px;
      }
      .el-icon-setting {
        position: absolute;
        right: 5px;
        top: 5px;
        color: #999;
      }
    }
  }
}
::v-deep .el-dialog__footer {
  text-align: center;
}

</style>
