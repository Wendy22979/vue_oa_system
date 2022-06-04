<template>
  <el-dialog
    :title="title"
    :visible="DialogVisible"
    width="30%"
    :before-close="done"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="ruleForm.name"
          placeholder="1-50个字符"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门编号" prop="code">
        <el-input
          v-model="ruleForm.code"
          placeholder="1-50个字符"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="ruleForm.manager"
          placeholder="请选择"
          @focus="getManager"
          style="width: 300px"
        >
          <el-option
            v-for="p in peoples"
            :key="p.id"
            :label="p.username"
            :value="p.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="ruleForm.introduce"
          type="textarea"
          placeholder="1300个字符"
          style="width: 300px"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-row type="flex" slot="footer" class="dialog-footer" justify="center">
      <el-button @click="done('ruleForm')">取 消</el-button>
      <el-button type="submit" @click="submitForm('ruleForm')">确 定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  getEmployeeSimple,
  addDepartmentApi,
  getDepartDetail,
  updateDepartments,
} from "@/api/departments";
export default {
  name: "AddDept",
  data() {
    // 验证部门名称是否重复
    const checkNameRepet = async (rule, value, callback) => {
      // 验证前先做一次请求，确保获取的是最新的数据
      let { depts } = await getDepartments();
      let flag = false;
      if (this.title == "新增部门") {
        flag = depts
          .filter((item) => {
            //筛选出同级的部门
            return item.pid == this.node.id;
          })
          .some((item) => {
            return item.name == value;
          });
        if (flag) {
          callback(new Error(`名称重复，同级部门中已经存在${value}`));
        } else {
          callback();
        }
      } else {
        flag = depts
          .filter(
            (item) => item.pid === this.node.pid && item.id !== this.node.id
          ) //赛选出除自己外同辈部门
          .some((item) => item.name === value);
      }
      if (flag) {
        callback(new Error(`名称重复，同级部门中已经存在${value}`));
      } else {
        callback();
      }
    };
    //该验证部门编号是否重复,部门编号唯一
    const checkCodeRepet = async (rule, value, callback) => {
      // 验证前先做一次请求，确保获取的是最新的数据
      let { depts } = await getDepartments();
      let flag = false;
      if (this.title == "新增部门") {
        flag = depts.some((item) => {
          return item.code == value;
        });
      } else {
        flag = depts
          .filter((item) => item.id !== this.node.id)
          .some((item) => item.code == value);
       let i = depts
          .filter((item) => item.id !== this.node.id)
          console.log(i)
      }

      if (flag) {
        callback(new Error(`编号重复，组织架构中已经存在${value}`));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        name: "", //部门名称
        code: "", //部门编号
        manager: "", //负责人
        introduce: "", //介绍
      },
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          { min: 1, max: 50, message: "部门名称1-50个字符", trigger: "blur" },
          { validator: checkNameRepet, trigger: "blur" }, //该验证部门名称不能与同级部门重复
        ],
        code: [
          { required: true, message: "部门编号不能为空", trigger: "blur" },
          { min: 1, max: 50, message: "编号长度为1-50个字符", trigger: "blur" },
          { validator: checkCodeRepet, trigger: "blur" }, //该验证部门编号是否重复
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            min: 1,
            max: 300,
            message: "部门介绍要求1~300个字符",
            trigger: "blur",
          },
        ],
      },
      peoples: [],
    };
  },
  props: {
    DialogVisible: {
      type: Boolean,
      default: false,
    },
    node: {
      type: Object,
      require: true,
    },
    title: {
      //表格标题
      type: String,
      default: "新增部门",
    },
  },
  methods: {
    // 获取部门负责人
    async getManager() {
      this.peoples = await getEmployeeSimple();
    },
    // 关闭对话框
    done() {
      this.$emit("update:DialogVisible", false);
      // 清空表单
      this.$refs["ruleForm"].resetFields();
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(async (isOk) => {
        if (isOk) {
          // 验证成功就提交
          if (this.title == "新增部门") {
            await addDepartmentApi({ ...this.ruleForm, pid: this.node.id });
          } else {
            let data = { ...this.node, ...this.ruleForm };
            await updateDepartments(data);
          }
          // 通知父组件更新
          await this.$emit("upDateDepartments");
          // 清空表单
          this.$refs[formName].resetFields();
          // 关闭对话框
          this.$emit("update:DialogVisible", false);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //获取部门详细信息,并将信息赋给ruleForm
    async getDepartDetail() {
      let from = await getDepartDetail(this.node.id);
      this.ruleForm.name = from.name;
      this.ruleForm.code = from.code;
      this.ruleForm.manager = from.manager;
      this.ruleForm.introduce = from.introduce;
    },
  },
  watch: {
    title(value) {
      if (value == "编辑部门") {
        this.getDepartDetail();
      }
    },
  },
};
</script>

<style lang="sass" scoped>
</style>