<template>
  <div>
    <el-card class="box-card">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col>
          <div v-if="isShow" class="left">
            <i class="el-icon-info"></i>
             <slot name="before"></slot>
          </div>
        </el-col>
        <el-col :span="4">
          <el-row type="flex" justify="end">
          <slot name="after">
            <!-- 添加左侧按钮 -->
          </slot>
        </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "PageTools",
  props: {
    isShow: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style scoped lang="scss">
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}
.left {
  line-height: 35px;
  display: inline-block;
  padding: 0 10px;
  border-radius: 3px;
  border: 1px solid #91d5ff;
  background: #e6f7ff;
}
.left i {
  margin-right: 5px;
  color: #409eff;
}
</style>