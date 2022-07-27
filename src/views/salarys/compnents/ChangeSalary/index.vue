<template>
  <div class="changeSalary">
    <div class="infoBox">
      <div class="logo"><img src="@/assets/common/img.jpeg" alt=""></div>
      <div class="info">
        <p>
          <span class="name">{{ user.username }}</span>
        </p>
        <p>
          <span>部门：</span>
          {{ user.departmentName }}
        </p><p>
          <span>入职时间：</span>
          {{ user.timeOfEntry|formDate }}
        </p>
      </div>
    </div>
    <div>
      <el-form label-width="110px" class="demo-ruleForm">
        <el-form-item label="调整基本工资">
          <el-input v-model="userSalary.currentBasicSalary" style="width: 220px;" :disabled="true" />
          <span class="Label">-></span>
          <el-input
            v-model="ruleForm.currentBasicSalary"
            style="width: 220px;"
            placeholder="请输入调整后基本工资"
            type="number"
          />
        </el-form-item>
        <el-form-item label="调整岗位工资">
          <el-input v-model="userSalary.currentPostWage" style="width: 220px;" :disabled="true" />
          <span class="Label">-></span>
          <el-input
            v-model="ruleForm.currentPostWage"
            style="width: 220px;"
            placeholder="请输入调整后岗位工资"
            type="number"
          />
        </el-form-item>
        <el-form-item label="工资合计">
          <el-input v-model="computeCurrentTotal" style="width: 220px;" :disabled="true" />
          <span class="Label">-></span>
          <el-input v-model="computeChangeTotal" style="width: 220px;" :disabled="true" />
        </el-form-item>
        <el-form-item label="调整幅度">
          <el-input v-model="computeChangeSize" style="width: 220px;" :disabled="true" />
        </el-form-item>
        <div class="buttones" style="text-align: center;margin-top: 40px;">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="onClose">关闭</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { changeSalary } from '@/api/salarys'
export default {
  name: 'ChangeSalary',
  props: ['user-salary', 'user-id'],
  data() {
    return {
      user: {}, // 用户详细信息
      ruleForm: { // 收集数据
        currentBasicSalary: '', // 调整后基本工资
        currentPostWage: '' // 调整后岗位工资
      }
    }
  },
  computed: {
    computeCurrentTotal() { // 当前总工资
      const currentBasicSalary = Number(this.userSalary.currentBasicSalary)
      const currentPostWage = Number(this.userSalary.currentPostWage)
      const total = currentBasicSalary + currentPostWage
      return total
    },
    computeChangeTotal() { // 调整后总工资
      const currentBasicSalary = Number(this.ruleForm.currentBasicSalary)
      const currentPostWage = Number(this.ruleForm.currentPostWage)
      return currentBasicSalary + currentPostWage
    },
    computeChangeSize() { // 工资涨幅
      return this.computeChangeTotal - this.computeCurrentTotal
    }
  },
  watch: {
    userId() {
      this.getUserDetailById()
    }
  },
  mounted() {
    this.getUserDetailById()
  },
  methods: {
    // 请求部分用户信息
    async getUserDetailById() {
      try {
        const res = await getUserDetailById(this.userId)
        this.user = res
      } catch (error) {
        console.log(error)
      }
    },
    // 确定
    async onSubmit() {
      // 发送请求
      await changeSalary({ ...this.ruleForm, userId: this.userId })
      // 成功提醒
      this.$message({ message: '保存成功', type: 'success' })
      // 父组件更新数据
      this.$emit('success')
      // 关闭弹窗
      this.$emit('onDialogCancel')
      // 清除数据
      this.ruleForm = {
        currentBasicSalary: '',
        currentPostWage: ''
      }
    },
    // 取消
    onClose() {
      // 关闭弹窗
      this.$emit('onDialogCancel')
      // 清除数据
      this.ruleForm = {
        currentBasicSalary: '',
        currentPostWage: ''
      }
    }
  }

}
</script>

<style lang="scss" scoped>
@import '../../../../styles/variables.scss';
  .changeSalary{
    .infoBox{
      display: flex;
      border-bottom: solid 1px #ccc;
      margin-bottom: 20px;
      padding: 10px 0 20px 0;
      img{
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
      .logo{
        border:solid 1px #ccc;
        width: 102px;
        height: 102px;
        border-radius: 50%;
        margin-right: 20px;
      }
      .info{
        p{
          line-height: 30px;
          .name{font-size: 16px;}
          span{
            font-weight: bold;
            display: inline-block;
            margin-right: 0px;
            margin-left: 10px;
          }
        }
      }
      .buttones{
        text-align: center;
      }
    }
    .Label{
      margin: 0 20px;
      color:#999;
    }
  }
</style>
