<template>
  <div class="permission-container">
    <div class="permission-content">
       <!-- 靠右的按钮 -->
      <PageTools>
        <template v-slot:after>
          <el-button type="primary" size="small">添加权限</el-button>
        </template>
      </PageTools>
      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column align="center" label="名称" prop="name"/>
        <el-table-column align="center" label="标识" prop="code"/>
        <el-table-column align="center" label="描述"  prop="description"/>
        <el-table-column align="center" label="操作">
          <template>
            <el-button type="text">添加</el-button>
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {getPermissionList} from "@/api/permisson"
import { tranListToTreeData } from "@/utils/index";
export default {
  name: "Permission",
  data() {
    return {
      list: [],//权限列表
    }
  },
  created(){
    this.getPermissionList()
  },
  methods: {
    // 初始化请求列表
   async  getPermissionList() {
     try{
     this.list = tranListToTreeData(await getPermissionList(),"0")
     console.log(this.list)
     }catch(error){
     console.log(error)
     }
    }
  },
};
</script>

<style scoped>
</style>