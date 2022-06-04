<template>
  <div>
    <el-dialog title="新增员工" :visible="isShow" :before-close="cancel">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="160px"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名" prop="username">
          <el-input
            style="width: 80%"
            placeholder="请输入姓名"
            v-model="ruleForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            style="width: 80%"
            placeholder="请输入手机号"
            v-model="ruleForm.mobile"
          ></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            style="width: 80%"
            placeholder="请输入入职时间"
            v-model="ruleForm.timeOfEntry"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select
            style="width: 80%"
            placeholder="请选择"
            v-model="ruleForm.formOfEmployment"
          >
            <el-option :label="item.value" :value="item.id" v-for="item in employeeEnum" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input
            style="width: 80%"
            placeholder="请输入工号"
            v-model="ruleForm.workNumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门" propr="departmentName">
          <el-input
            style="width: 80%"
            placeholder="请选择部门"
            v-model="ruleForm.departmentName"
            @focus="getDepartments"
          ></el-input>
          <el-tree :data="treeNode" :props="defaultProps" @node-click="handleNodeClick" v-show="treeShow"></el-tree>
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            style="width: 80%"
            placeholder="请输入转正时间"
            v-model="ruleForm.correctionTime"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addEmployeeListApi } from "@/api/employees";
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils";
import employeeEnum from "@/views/employees/engageModality"
export default {
  name: "AddEmployee",
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ruleForm: {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber:"",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      },
      rules: {
        username: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        timeOfEntry: [{ required: true, message: "入职时间", trigger: "blur" }],
      },
      employeeEnum:employeeEnum.data,//聘用形式
      treeNode:[],//所有部门名存储
      defaultProps:{
        label:'name',
        children:'children'
      },
      treeShow:false,//树是否显示
    };
  },
  methods: {
    cancel() {
      this.$emit("update:isShow", false);
      this.$refs["ruleForm"].resetFields();
       this.ruleForm.departmentName = ""//表单清除无法清除这个属性
    },
    // 确认
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            console.log(this.ruleForm)
            await addEmployeeListApi(this.ruleForm);
            // 成功提示消息
            this.$message.success("添加成功");
            // 更新数据
            this.$parent.getEmployeeList();
            // 清空表单
            this.$refs["ruleForm"].resetFields();
             this.ruleForm.departmentName = ""
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 树被选择后的结果
    handleNodeClick(node){
      this.ruleForm.departmentName = node.name;
      // 隐藏显示
      this.treeShow = false
    },
    // 获取部门列表
    async getDepartments(){
    //  获取焦点树显示
     this.treeShow = true
    //  请求列表
     let {depts} = await getDepartments()
    //  对列表进行树型转换并赋值
     this.treeNode = tranListToTreeData(depts,"")
     
    }
  },
};
</script>

<style lang="scss" scoped>
</style>