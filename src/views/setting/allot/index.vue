<template>
  <div>
    <el-dialog
      title="分配权限"
      :visible="showPermDialog"
      :before-close="handleClose"
    >
      <el-tree
        ref="permTree"
        :data="list"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK"
            >确定</el-button
          >
          <el-button size="small" @click="handleClose">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList } from "@/api/permisson";
import { getRoleDetail,assignPrem } from "@/api/setting";
import { tranListToTreeData } from "@/utils";
export default {
  name: "AllotPower",
  data() {
    return {
      list: [], //权限列表
      defaultProps: {
        label: "name",
        children: "children",
      },
      selectCheck: [], //选中节点的id
      roleId: "", //角色id
    };
  },
  props: {
    showPermDialog: {
      type: Boolean,
      default: false,
    },
  },
  created(){
    this.getPermissionList()// 初始化权限列表请求
  },
  methods: {
    // 取消关闭
    handleClose() {
      this.$emit("update:showPermDialog", false);
      this.selectCheck = []
    },
    // 初始化权限列表请求,在父组件中点击分配权限时被调用
    async getPermissionList() {
      try {
        this.list = tranListToTreeData(await getPermissionList(), "0");
      } catch (error) {
        console.log(error);
      }
    },
    // 获取角色权限详情
    async getRoleDetail(id) {
      this.roleId = id; //存储角色id
      try {
        // 获取角色权限
        let { permIds } = await getRoleDetail(id);
        // 存储角色权限
        this.selectCheck = permIds;
      } catch (error) {
        console.log(error);
      }
    },

    // 确认
    async btnPermOK() {
      // 更新权限
      try {
        await assignPrem({permIds:this.selectCheck,id:this.roleId});
        this.$message.success("更新成功")
        // 关闭弹窗
         this.$emit("update:showPermDialog", false)
        this.selectCheck = []
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>