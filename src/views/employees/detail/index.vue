<template>
  <div>
    <el-card>
      <el-tabs>
        <el-tab-pane label="登录账号设置">
          <el-form
            label-width="120px"
            style="margin-left: 120px; margin-top: 30px"
            :model="userInfo"
            :rules="rules"
            ref="ruleForm"
          >
            <el-form-item label="姓名" prop="username">
              <el-input
                style="width: 300px"
                v-model="userInfo.username"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                style="width: 300px"
                type="password2"
                v-model="userInfo.password2"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="upDate">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情">
          <el-row type="flex" justify="end">
            <el-tooltip class="item" content="打印个人信息" placement="top">
              <router-link :to="`/employees/print/${userId}?type=personal`">打印</router-link>
            </el-tooltip>
          </el-row>
          <UserInfo />
        </el-tab-pane>
        <el-tab-pane label="岗位信息">
          <JobInfo />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById } from "@/api/user";
import { saveUserDetailById } from "@/api/employees";
import UserInfo from "@/views/employees/detail/component/userInfo";
import JobInfo from "@/views/employees/detail/component/jobInfo";
export default {
  name: "detail",
  components: {
    UserInfo,
    JobInfo,
  },
  data() {
    return {
      userId: this.$route.query.id, //用户id
      userInfo: {
        //用户
        username: "",
        password2: "", //传过来的密码为超过十二位加密密码，如果不修改密码直接提交会报错，校验失败，所以用password2来中转，如果更改则将password2值赋给password
      },
      rules: {
        username: [
          { require: true, message: "用户名不能为空", trigger: "blur" },
        ],
        password2: [
          { require: true, message: "用户名不能为空", trigger: "blur" },
          { min: 6, main: 9, message: "密码长度为6到9位", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 获取员工基本信息
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId);
    },
    // 点击更新验证信息
    upDate() {
      try {
        this.$refs["ruleForm"].validate(async (isOk) => {
          if (isOk) {
            await saveUserDetailById({
              ...this.userInfo,
              password: this.userInfo.password2,
            });
            this.$message.success("更新成功");
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    // 获取用户信息
    this.getUserDetailById();
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 400px;

  .top {
    text-align: center;
  }

  .left {
    float: left;
    width: 60px;
  }

  .right {
    float: right;
    width: 60px;
  }

  .bottom {
    clear: both;
    text-align: center;
  }

  .item {
    margin: 4px;
  }

  .left .el-tooltip__popper,
  .right .el-tooltip__popper {
    padding: 8px 10px;
  }
}
</style>