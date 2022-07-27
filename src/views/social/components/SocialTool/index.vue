<template>
  <div>
    <el-card class="box-card">
      <el-form label-width="100px" :model="ruleForm">
        <el-form-item label="部门" props="departmentChecks">
          <el-checkbox-group v-model="ruleForm.departmentChecks">
            <el-checkbox v-for="item in departmentList" :key="item.id" :label="item.name" name="type" @change="changeSelect" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="社保城市" props="socialSecurityChecks">
          <el-checkbox-group v-model="ruleForm.socialSecurityChecks">
            <el-checkbox v-for="item in cityList" :key="item.id" :label="item.name" name="type" @change="changeSelect" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="公积金城市" props="providentFundChecks">
          <el-checkbox-group v-model="ruleForm.providentFundChecks">
            <el-checkbox v-for="item in cityList" :key="item.id" :label="item.name" name="type" @change="changeSelect" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>

    </el-card>
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { getCityList } from '@/api/social'
export default {
  name: 'SocialTool',
  data() {
    return {
      ruleForm: {
        departmentChecks: [], // 部门列表
        providentFundChecks: [], // 公积金城市列表
        socialSecurityChecks: []// 参保城市列表
      },
      departmentList: [], // 部门列表
      cityList: [] // 城市列表

    }
  },
  mounted() {
    this.getCity()
    this.getDepartmentList()
  },
  methods: {
    // 部门列表获取
    async getDepartmentList() {
      const res = await getDepartments()
      this.departmentList = res.depts
    },
    // 获取城市信息
    async getCity() {
      const res = await getCityList()
      this.cityList = res
    },
    // 筛选的实现
    changeSelect() {
      this.$emit('changeSelectParams', this.ruleForm)
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
