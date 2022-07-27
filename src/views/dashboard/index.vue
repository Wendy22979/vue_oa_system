<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <!-- 头部区域 -->
      <el-card class="box-card">
        <div>
          <div class="fl headL">
            <div class="headImg">
              <!-- 处理默认图片,头像 用户头像-->
              <img v-imgerror="defaultImg" :src="staffPhoto">
            </div>
            <div class="headInfoTip">
              <p class="firstChild">早安，祝你开心每一天！</p>
              <!-- 用户信息 -->
              <p class="lastChild">
                {{ name }} | -
                {{ departmentNameP }}
              </p>
            </div>
          </div>
          <div class="fr" />
        </div>
      </el-card>
      <!-- 主要内容区域 -->
      <el-row type="flex" justify="space-between">
        <!-- 左侧区域内容 -->
        <el-col :span="13" style="padding-right: 26px">
          <!-- 工作日历 -->
          <el-card class="box-card">
            <div slot="header" class="header">
              <span>工作日历</span>
            </div>
            <!-- 放置日历组件 -->
            <WorkCalendar />
          </el-card>
          <!-- 公告 -->
          <el-card class="box-card">
            <div class="advContent">
              <div class="title">公告</div>
              <div class="contentItem">
                <ul class="noticeList">
                  <li>
                    <div class="item">
                      <img src="@/assets/common/img.jpeg" alt="">
                      <div>
                        <p>
                          <span class="col">朱继柳</span> 发布了
                          第1期“大讲堂”互动讨论获奖名单公布
                        </p>
                        <p>2018-07-21 15:21:38</p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="item">
                      <img src="@/assets/common/img.jpeg" alt="">
                      <div>
                        <p>
                          <span class="col">朱继柳</span> 发布了
                          第2期“大讲堂”互动讨论获奖名单公布
                        </p>
                        <p>2018-07-21 15:21:38</p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="item">
                      <img src="@/assets/common/img.jpeg" alt="">
                      <div>
                        <p>
                          <span class="col">朱继柳</span> 发布了
                          第3期“大讲堂”互动讨论获奖名单公布
                        </p>
                        <p>2018-07-21 15:21:38</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </el-card>
        </el-col>
        <!-- 右侧区域内容 -->
        <el-col :span="11">
          <el-card class="box-card">
            <div class="header headTit">
              <span>流程申请</span>
            </div>
            <div class="sideNav">
              <el-button
                class="sideBtn"
                @click="showDialog = true"
              >加班离职</el-button>
              <el-button class="sideBtn">请假调休</el-button>
              <el-button
                class="sideBtn"
                @click="$router.push('/users/approvals')"
              >审批列表</el-button>
              <el-button
                class="sideBtn"
                @click="$router.push('/users/info')"
              >我的信息</el-button>
            </div>
          </el-card>

          <!-- 绩效指数 -->
          <el-card class="box-card">
            <div slot="header" class="header">
              <span>绩效指数</span>
            </div>
            <!-- 放置雷达图 -->
            <Radar />
          </el-card>
          <!-- 帮助连接 -->
          <el-card class="box-card">
            <div class="header headTit">
              <span>帮助链接</span>
            </div>
            <div class="sideLink">
              <el-row>
                <el-col :span="8">
                  <a href="javascript:;">
                    <span class="icon iconGuide" />
                    <p>入门指南</p>
                  </a>
                </el-col>
                <el-col :span="8">
                  <a href="javascript:;">
                    <span class="icon iconHelp" />
                    <p>在线帮助手册</p>
                  </a>
                </el-col>
                <el-col :span="8">
                  <a href="javascript:;">
                    <span class="icon iconTechnology" />
                    <p>联系技术支持</p>
                  </a>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 离职弹窗 -->
      <el-dialog :visible="showDialog" title="离职申请" :before-close="btnCancel">
        <!-- 表单内容 -->
        <el-form
          ref="ruleForm"
          label-width="120px"
          :model="ruleForm"
          :rules="rules"
        >
          <el-form-item label="期望离职时间" prop="exceptTime">
            <!-- 离职时间 返回的值就是 字符串结构了 -->
            <el-date-picker
              v-model="ruleForm.exceptTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <!-- 放置输入框 -->
          <el-form-item label="离职原因" prop="reason">
            <el-input
              v-model="ruleForm.reason"
              type="textarea"
              :rows="3"
              style="width: 70%"
            />
          </el-form-item>
        </el-form>
        <!-- 确定取消 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import WorkCalendar from '@/components/WorkCalendar'
import Radar from '@/components/Radar'
import { Message } from 'element-ui'
import { startProcess } from '@/api/approvals'
export default {
  name: 'Dashboard',
  data() {
    return {
      defaultImg: require('@/assets/common/head.jpg'),
      showDialog: false, // 弹窗显示隐藏
      ruleForm: { // 离职申请表单信息收集
        exceptTime: '', // 期望离职时间
        reason: '', // 离职原因
        processKey: 'process_dimission', // 特定的审批
        processName: '离职'
      },
      rules: {
        exceptTime: [
          { required: true, message: '离职时间不能为空', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '离职原因不能为空', trigger: 'blur' }
        ]
      }// 验证规则

    }
  },
  computed: {
    ...mapGetters([
      'name',
      'staffPhoto',
      'departmentNameP'
    ]),
    ...mapState('user', ['userInfo'])
  },
  components: {
    WorkCalendar,
    Radar
  },
  methods: {
    // 离职表单取消
    btnCancel() {
      console.log('取消被执行了')
      // 重置表单
      this.ruleForm = {
        exceptTime: '',
        reason: '',
        processKey: 'process_dimission',
        processName: '离职'
      }
      // 关闭弹窗
      this.showDialog = false
    },
    // 离职弹窗确定
    btnOK() {
      // 再次验证信息
      this.$refs['ruleForm'].validate(async(valid) => {
        if (valid) {
          try {
            // 验证成功发送请求
            await startProcess({
              ...this.ruleForm,
              userId: this.userInfo.userId,
              username: this.userInfo.username
            })

            Message.success('申请成功')

            // 关闭弹窗以及重置表单
            this.btnCancel()
          } catch (error) {
            console.log(error)
          }
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 10px;
  li {
    list-style: none;
  }
  .headImg {
    float: left;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #999;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .headInfoTip {
    padding: 25px 0 0;
    margin-left: 120px;
    p {
      padding: 0 0 15px;
      margin: 0;
      &.firstChild {
        font-size: 24px;
      }
      &.lastChild {
        font-size: 20px;
        color: #7f8c8d;
      }
    }
  }
}

.box-card {
  padding: 5px 10px;
  margin-top: 20px;
  .header {
    span {
      color: #2c3e50;
      font-size: 24px;
    }
    .item {
      color: #97a8be;
      float: right;
      padding: 3px 0;
    }
  }
  .headTit {
    span {
      border-bottom: 4px solid #8a97f8;
      padding-bottom: 10px;
    }
  }
}
.header-card {
  position: relative;
  .header {
    position: absolute;
    right: 20px;
    top: 15px;
    z-index: 1;
  }
}

.advContent {
  background: #fff;
  border-radius: 5px 5px 0px 0px;
  .title {
    font-size: 16px;
    padding: 20px;
    font-weight: bold;
    border-bottom: solid 1px #ccc;
  }
  .contentItem {
    padding: 0 30px;
    min-height: 350px;
    .item {
      display: flex;
      padding: 18px 0 10px;
      border-bottom: solid 1px #ccc;
      .col {
        color: #8a97f8;
      }
      img {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        margin-right: 10px;
      }
      p {
        padding: 0 0 8px;
      }
    }
  }
}
.noticeList {
  margin: 0;
  padding: 0;
}
.sideNav,
.sideLink {
  padding: 30px 0 12px;
  .sideBtn {
    padding: 16px 26px;
    font-size: 16px;
    margin: 10px 5px;
  }
}
.sideLink {
  text-align: center;
  .icon {
    display: inline-block;
    width: 76px;
    height: 76px;
    background: url("./../../assets/common/icon.png") no-repeat;
  }
  .iconGuide {
    background-position: 0 0;
  }
  .iconHelp {
    background-position: -224px 0;
  }
  .iconTechnology {
    background-position: -460px 0;
  }
}
</style>
