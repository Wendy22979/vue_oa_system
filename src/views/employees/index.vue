<template>
  <div class="employees-container">
    <div class="employees-content">
      <PageTools :isShow="true">
        <template slot="before">
          <span>共{{ page.total }}条记录</span>
        </template>
        <template slot="after">
          <el-button size="small" type="success" @click="excelInto"
            >excel导入</el-button
          >
          <el-button size="small" type="primary" @click="excelExport"
            >excel导出</el-button
          >
          <el-button size="small" type="warning" @click="add"
            >新增员工</el-button
          >
        </template>
      </PageTools>

      <el-table :data="employeesList" border style="width: 100%">
        <el-table-column
          label="序号"
          align="center"
          type="index"
          :index="indexMethod"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          sortable
          align="center"
        ></el-table-column>
        <el-table-column label="头像" sortable align="center">
          <template slot-scope="{ row }">
            <img
              :src="row.staffPhoto"
              alt="!"
              v-imgerror="defaultImg"
              @click="showQrCode(row.staffPhoto)"
            />
            <el-dialog
              title="图片二维码"
              :visible="showCodeDialog"
              width="30%"
              :before-close="done"
            >
              <span ref="qrcodeUrl" class="center"></span>
            </el-dialog>
          </template>
        </el-table-column>
        <el-table-column
          prop="workNumber"
          label="工号"
          sortable
          align="center"
        ></el-table-column>
        <el-table-column
          props="formOfEmployment"
          label="聘用形式"
          sortable
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{
              row.formOfEmployment
                ? row.formOfEmployment == 1
                  ? "正式"
                  : "非正式"
                : ""
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="departmentName"
          label="部门"
          sortable
          align="center"
        ></el-table-column>
        <el-table-column label="入职时间" sortable align="center">
          <template slot-scope="{ row }">
            <span>{{ row.timeOfEntry | formDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="enableState"
          label="账号状态"
          sortable
          align="center"
        >
          <template slot-scope="{ row }">
            <el-switch :value="row.enableState == 1 ? true : false">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="getCheck(row.id)"
              >查看</el-button
            >
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="showRole(row.id)"
              >角色</el-button
            >
            <el-button type="text" size="small" @click="delEmployee(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row type="flex" justify="center">
        <el-pagination
          layout="prev, pager, next"
          :current-page="page.page"
          :page-size="page.size"
          @current-change="changePage"
          :total="page.total"
        >
        </el-pagination>
      </el-row>
    </div>

    <AddEmployee :isShow.sync="isShow" />
    <AssignRole
      :showRoleDialog.sync="showRoleDialog"
      :userId="userId"
      ref="assignRole"
    />
  </div>
</template>

<script>
import { getEmployeeList } from "@/api/employees";
import AddEmployee from "@/views/employees/addEmployee";
import { formDate } from "@/filters/index";
import { delEmployee } from "@/api/employees";
import engageModality from "@/views/employees/engageModality";
import AssignRole from "@/views/employees/assignRole";
import QrCode from "qrcodejs2";
export default {
  name: "Employees",
  data() {
    return {
      employeesList: [], //员工列表
      tableData: {
        username: "",
        staffPhoto: "",
        workNumber: "",
        formOfEmployment: "",
        departmentName: "",
        timeOfEntry: "",
        enableState: "",
      },
      page: {
        page: 1,
        size: 10,
        total: 0,
      },
      defaultImg: require("@/assets/common/head.jpg"), //设置默认用户头像，加载失败时启用
      isShow: false, //新增员工弹窗显示隐藏
      showCodeDialog: false, //二维码弹窗
      showRoleDialog: false, //权限分配弹窗
      userId: "", //员工id
    };
  },
  created() {
    //  初始化列表请求
    this.getEmployeeList();
  },
  methods: {
    //  初始化列表请求
    async getEmployeeList() {
      try {
        let { total, rows } = await getEmployeeList({ ...this.page });
        console.log(rows);
        this.employeesList = rows;
        this.page.total = total;
      } catch (error) {
        console.log(error);
      }
    },
    indexMethod(index) {
      return index + this.page.size * (this.page.page - 1) + 1;
    },
    changePage(newpage) {
      // newpage是当前点击的页码
      this.page.page = newpage;
      //  重新渲染数据
      this.getEmployeeList();
    },
    //  新增员工
    add() {
      this.isShow = true;
    },
    //点击跳转
    excelInto() {
      this.$router.push("/import?type=user");
    },

    // 点击导出
    excelExport() {
      //  表头关系
      const headers = {
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };

      // 按需加载调用导出插件
      import("@/vendor/Export2Excel").then(async (excel) => {
        // 请求列表,获取所有数据
        let { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total,
        });
        // 处理数据格式，变为二维数组
        let data = this.formatJson(headers, rows);
        // 传入插件准备导出
        excel.export_json_to_excel({
          header: Object.keys(headers), //表头数组
          data, //二维数组结构，必传，为导出的数据列表
          filename: "员工信息列表", //文件标题
          autoWidth: true, //是否自适应
          bookType: "xlsx", //文件类型后缀
        });
      });
    },

    // 数据处理为二维数组
    formatJson(headers, rows) {
      rows = rows.map((item) => {
        return Object.keys(headers).map((key) => {
          // 对是时间和聘用形式做处理
          if (
            headers[key] == "timeOfEntry" ||
            headers[key] == "correctionTime"
          ) {
            return formDate(item[headers[key]]);
          }
          if (headers[key] == "formOfEmployment") {
            let en = engageModality.data.find((obj) => {
              return item[headers[key]] == obj.id;
            });
            return en ? en.value : "未知";
          }

          return item[headers[key]];
        });
      });
      return rows;
    },
    // 跳转到查看页面
    getCheck(id) {
      this.$router.push({
        path: "/employees/detail",
        query: {
          id,
        },
      });
    },

    //  删除接口
    async delEmployee(id) {
      try {
        await delEmployee(id);
        this.$message.success("删除成功");
        // 更新数据
        this.getEmployeeList();
      } catch (error) {
        console.log(error);
      }
    },
    showQrCode(url) {
      if (url) {
        this.showCodeDialog = true;
        // 弹出对话框是同步的，但是里面内容的渲染是异步的
        this.$nextTick(() => {
          // // 生成二维码
          new QrCode(this.$refs.qrcodeUrl, {
            text: url,
            width: 100,
            height: 100,
            colorDark: "black",
            colorLight: "white",
          });
        });
      } else {
        this.$message.warning("用户还未上传头像");
      }
    },
    done() {
      this.showCodeDialog = false;
      // 关闭弹窗的同时对内容进行清空
      this.$refs.qrcodeUrl.innerHTML = "";
    },
    // 角色分配弹窗
    showRole(id) {
      this.userId = id;
      this.$refs.assignRole.getUserDetailById(id);
      this.showRoleDialog = true;
    },
  },
  components: {
    AddEmployee,
    AssignRole,
  },
};
</script>

<style scoped>
img {
  width: 100px;
  height: 100px;
}
.center {
  display: flex;
  justify-content: center;
}
</style>