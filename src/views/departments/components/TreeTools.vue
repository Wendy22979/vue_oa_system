<template>
  <el-row
    type="flex"
    class="row-bg"
    justify="space-between"
    style="width: 100%; height: 40px"
    align="middle"
  >
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" class="row-bg" justify="end">
        <el-col>
          <span>{{ treeNode.manager }}</span>
        </el-col>
        <el-col>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add" >添加子部门</el-dropdown-item>
              <el-dropdown-item 
              v-if="isShow" 
              command="edit"
                >编辑部门</el-dropdown-item
              >
              <el-dropdown-item v-if="isShow" command="del"
                >删除部门</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import {delDepartments} from "@/api/departments"
export default {
  name:"TreeTools",
  // data() {
  //   return {
  //     dialogVisible: false //弹窗显示隐藏
  //   }
  // },
  props:{
    treeNode:{
      type:Object,
      require:true
    },
    isShow:{
      // 下拉菜单部分选项是否展示，false为不展示
      type:Boolean,
      default:true,
    }
  },
  methods:{
     handleCommand(command){
      if(command == "del"){
         this.$confirm(`此操作将删除部门${this.treeNode.name}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await delDepartments(this.treeNode.id);
          await this.$emit("upDateDepartments");
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
   

      } else if(command == "add"){
        // 添加
        this.$emit("addDepartments",this.treeNode)
      } else if(command == "edit"){
        // 修改
        this.$emit("editDepts",this.treeNode)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>