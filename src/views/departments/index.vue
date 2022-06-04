<template>
  <div class="departments-container">
    <div class="departments-content">
      <el-card class="box-card">
        <!-- 一行 -->
        <TreeTools
          :treeNode="company"
          :isShow="false"
          @upDateDepartments="upDateDepartments"
          @addDepartments="addDepartments"
        />
        <el-tree :data="data" :props="defaultProps" :default-expand-all="true">
          <TreeTools
            slot-scope="{ data }"
            :treeNode="data"
            @upDateDepartments="upDateDepartments"
            @addDepartments="addDepartments"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
      <AddDept
        :DialogVisible.sync="dialogVisible"
        :node="node"
        @upDateDepartments="upDateDepartments"
        :title="title"
      />
    </div>
  </div>
</template>

<script>
import TreeTools from "./components/TreeTools.vue";
import AddDept from "./components/add-dept.vue";
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils";

export default {
  name: "Departments",
  data() {
    return {
      dialogVisible: false,
      title: "新增部门", //新建或修改弹出的对话框
      node: {}, //节点信息
      company: {
        name: "丁鹿学堂科技",
        manager: "负责人",
        id: "",
      },
      defaultProps: {
        label: "name",
        children: "children",
      },
      data: [],
    };
  },
  components: {
    TreeTools,
    AddDept,
  },
  methods: {
    // 初始化部门列表请求
    async getDepartments() {
      try {
        let res = await getDepartments();
        this.data = tranListToTreeData(res.depts, "");
        console.log(this.data);
      } catch (error) {
        console.log(error);
      }
    },
    // 列表数据更新
    async upDateDepartments() {
      await this.getDepartments();
    },
    // 新增数据
    addDepartments(node) {
      this.dialogVisible = true; //弹框显示
      this.title = "新增部门";
      this.node = node;
    },
    // 编辑部门
    editDepts(node) {
      this.dialogVisible = true; //弹框显示
      this.title = "编辑部门";
      this.node = node;
    },
  },
  created() {
    // 初始化部门列表
    this.getDepartments();
  },
};
</script>

<style scoped>
.box-card {
  padding: 30px 140px;
  font-size: 14px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>