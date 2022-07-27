<template>
  <div class="setting-container">
    <div class="setting-content">
      <el-card class="box-card">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="用户管理" name="first">
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addRole"
              >新增角色</el-button>
            </el-row>
            <el-table
              border
              :data="
                dataList.slice(
                  page.pagesize * (page.page - 1),
                  page.pagesize * page.page
                )
              "
            >
              <el-table-column
                label="序号"
                width="120"
                type="index"
                :index="indexMethod"
              />
              <el-table-column label="名称" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <el-button type="success" @click="allot(row.id)">分配权限</el-button>
                  <el-button
                    type="primary"
                    @click="edit(row.id)"
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    @click="deleteRole(row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="center">
              <!-- 分页器 -->
              <el-pagination
                layout="prev, pager, next"
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>

          <!-- 配置管理 -->
          <el-tab-pane label="配置管理" name="second" />
        </el-tabs>
      </el-card>
      <!-- 弹窗结构 -->
      <el-dialog
        :title="title"
        :visible="showDialog"
        :before-close="handleClose"
      >
        <el-form ref="roleForm" :model="roleForm" :rules="rules">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <el-row
          slot="footer"
          class="dialog-footer"
          type="flex"
          justify="center"
        >
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="btnOk()">确 定</el-button>
        </el-row>
      </el-dialog>
      <!-- 分配权限弹框 -->
      <AllotPower ref="allotPower" :show-perm-dialog.sync="showPermDialog" />
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole
} from '@/api/setting'
import AllotPower from '@/views/setting/allot'
export default {
  name: 'Setting',
  components: {
    AllotPower
  },
  data() {
    return {
      node: {}, // 当前节点信息
      activeName: 'first',
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      dataList: [],
      title: '编辑角色',
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      showPermDialog: false// 分配权限弹窗显示隐藏
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    async getRoleList() {
      const res = await getRoleList(this.page)
      this.dataList = res.rows
      this.page.total = res.total
    },
    indexMethod(index) {
      return index + this.page.pagesize * (this.page.page - 1) + 1
    },
    changePage(newpage) {
      // newpage是当前点击的页码
      this.page.page = newpage
      //  重新渲染数据
      this.getRoleList()
    },
    // 删除
    async deleteRole(id) {
      try {
        await this.$confirm('确定要删除吗？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(async() => {
          await deleteRole(id)
          this.getRoleList()
          this.$message.success('删除角色成功')
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑
    async edit(id) {
      try {
        this.title = '编辑角色'
        this.node = await getRoleDetail(id)
        this.roleForm.description = this.node.description
        this.roleForm.name = this.node.name
        this.showDialog = true
      } catch (error) {
        console.log(error)
      }
    },
    // 点x和取消关闭弹框
    handleClose() {
      this.showDialog = false
      this.$refs['roleForm'].resetFields()
    },
    // 弹窗确定
    btnOk() {
      this.$refs['roleForm'].validate(async(isOk) => {
        if (!isOk) return false
        try {
          if ((this.title === '编辑角色')) {
            await updateRole({ ...this.node, ...this.roleForm })
          } else if ((this.title === '新增角色')) {
            const data = {
              name: this.roleForm.name,
              region: this.roleForm.description
            }
            await addRole(data)
          }
          //  更新数据
          await this.getRoleList()
          // 成功提醒
          this.$message.success('操作成功')
          // 关闭弹窗
          this.showDialog = false
          // 清空表单
          this.$refs['roleForm'].resetFields()
        } catch (error) {
          console.log(error)
        }
      })
    },
    // 新增角色
    async addRole() {
      this.title = '新增角色'
      this.showDialog = true
    },
    // 分配权限
    async allot(id) {
      // 请求参数
      await this.$refs['allotPower'].getRoleDetail(id)
      // 显示弹窗
      this.showPermDialog = true
    }
  }
}
</script>

<style scoped>
</style>
