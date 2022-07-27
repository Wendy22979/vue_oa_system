<template>
  <div class="fixedDalary">
    <el-form label-width="120px" :model="formLabelAlign">
      <el-form-item label="当前基本工资">
        <el-input
          v-model="formLabelAlign.currentBasicSalary"
          placeholder="当前基本工资"
          style="width: 60%"
          type="number"
        />
      </el-form-item>
      <el-form-item label="当前岗位工资">
        <el-input v-model="formLabelAlign.currentPostWage" placeholder="当前岗位工资" style="width: 60%" type="number" />
      </el-form-item>
      <el-form-item label="当前工资合计">
        <el-input v-model="computeCurrentTotal" placeholder="当前工资合计, 自动计算" style="width: 60%" :disabled="true" />
      </el-form-item>
      <el-form-item label="转正基本工资">
        <el-input
          v-model="formLabelAlign.correctionOfBasicWages"
          placeholder="转正基本工资"
          style="width: 60%"
          type="number"
        />
      </el-form-item>
      <el-form-item label="转正岗位工资">
        <el-input v-model="formLabelAlign.turnToPostWages" placeholder="转正岗位工资" style="width: 60%" type="number" />
      </el-form-item>
      <el-form-item label="转正工资合计">
        <el-input v-model="computeTurnTotal" placeholder="当前基本工资, 自动计算" style="width: 60%" :disabled="true" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认</el-button>
        <el-button @click="onClose">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { initSalary } from '@/api/salarys'
export default {
  name: 'FixedSalary',
  props: ['user-salary', 'user-id'],
  data() {
    return {
      formLabelAlign: { // 表单数据收集
        currentBasicSalary: '', // 当前基础工资
        currentPostWage: '', // 当前岗位工资
        correctionOfBasicWages: '', // 转正基本工资
        turnToPostWages: '' // 转正岗位工资
      }
    }
  },
  computed: {
    computeCurrentTotal() { // 当前工资合计
      return (this.formLabelAlign.currentBasicSalary - 0) + (this.formLabelAlign.currentPostWage - 0)
    },
    computeTurnTotal() { // 当前工资合计
      return (this.formLabelAlign.correctionOfBasicWages - 0) + (this.formLabelAlign.turnToPostWages - 0)
    }
  },
  methods: {
    // 确定
    async onSubmit() {
      try {
        await initSalary({ userId: this.userId, ...this.formLabelAlign })
        this.$message.success('定薪成功')
        // 父组件更新
        this.$emit('success')
        // 关闭弹窗
        this.$emit('success')
        // 清空数据,关闭弹窗
        this.onClose()
      } catch (error) {
        console.log(error)
      }
    },
    onClose() {
      this.formLabelAlign = {
        currentBasicSalary: '',
        currentPostWage: '',
        correctionOfBasicWages: '',
        turnToPostWages: ''
      }
      this.$emit('onDialogCancel')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../styles/variables.scss';
.fixedDalary {
  .infoBox {
    display: flex;
    border-bottom: solid 1px #ccc;
    margin-bottom: 20px;
    padding: 10px 0 20px 0;
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
    .logo {
      border: solid 1px #ccc;
      width: 102px;
      height: 102px;
      border-radius: 50%;
      margin-right: 20px;
    }
    .info {
      p {
        line-height: 30px;
        .name {
          font-size: 16px;
        }
        span {
          font-weight: bold;
          display: inline-block;
          margin-right: 0px;
          margin-left: 10px;
        }
      }
    }
    .buttones {
      text-align: center;
    }
  }
  .Label {
    margin: 0 20px;
    color: #999;
  }
}
</style>
