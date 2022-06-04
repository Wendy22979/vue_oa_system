<template>
  <div>
    <el-dialog title="分配角色" :visible="showRoleDialog" :before-close="done">
      <el-checkbox-group v-model="roleIds">
        <el-checkbox :label="item.id" v-for="item in list" :key="item.id">{{
          item.name
        }}</el-checkbox>
        <!-- 选项 -->
      </el-checkbox-group>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
          <el-button size="small" @click="done">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList } from "@/api/setting";
import { getUserDetailById } from "@/api/user";
import { assignRoles } from "@/api/employees";

export default {
  name: "AssignRole",
  data() {
    return {
      list: [], //角色列表
      roleIds: [], //所有权限选中列表
    };
  },
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
    },
  },
  created() {
    this.getRoleList(); // 初始化角色列表请求
  },
  methods: {
    // 初始化角色列表请求
    async getRoleList() {
      try {
        let { rows } = await getRoleList({ page: 1, pagesize: 20 });
        this.list = rows;
      } catch (error) {
        console.log(error);
      }
    },
    // 获取员工的权限,在父组件中，点击角色时调用
    async getUserDetailById(id) {
      try {
        const { roleIds } = await getUserDetailById(id);
        this.roleIds = roleIds;
      } catch (error) {
        console.log(error);
      }
    },
    // 关闭弹窗
    done() {
      this.roleIds = [];
      this.$emit("update:showRoleDialog", false);
    },
    // 确定
    async btnOk() {
      try {
        await assignRoles({ id: this.userId, roleIds: this.roleIds });
        this.$message.success("更改成功");
        //  关闭弹窗
        this.$emit("update:showRoleDialog", false);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>