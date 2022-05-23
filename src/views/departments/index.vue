<template>
  <div class="departments-container">
    <div class="departments-content">
      <el-card class="box-card">
        <!-- 一行 -->
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col>
            <span>丁鹿学堂科技</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" class="row-bg" justify="end">
              <el-col>
                <span>负责人</span>
              </el-col>
              <el-col>
                <el-dropdown>
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Departments",
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