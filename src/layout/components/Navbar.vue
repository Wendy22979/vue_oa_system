<template>
  <div class="navbar">
    <div>
      <hamburger
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <div class="app-breadcrumb">
        xxxx有限公司
        <span class="breadBtn">体验版</span>
      </div>

    </div>

    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <!-- 右侧 -->
    <div class="rightNav">
      <div class="fullScreen">
        <!-- 中英文切换 -->
        <el-dropdown @command="langChange">
          <span class="el-dropdown-link">
            {{ language }}<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown" class="dropdownItem">
            <el-dropdown-item command="zh">中文</el-dropdown-item>
            <el-dropdown-item command="en">English</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 全屏非全屏 -->
        <span
          class="iconfont"
          :class="{'icon-quanping':!allShow,'icon-quxiaoquanping':allShow}"
          @click="toggle"
        />
      </div>
      <!-- 右侧导航栏 -->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img
            v-imgerror="defaultImg"
            :src="$store.getters.staffPhoto"
            class="user-avater"
            alt=""
          >
          <span class="name">{{ $store.getters.name }}</span>
          <i class="el-icon-caret-bottom" style="color: #fff" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <a
            target="_blank"
            href="https://github.com/PanJiaChen/vue-admin-template/"
          >
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>

          <el-dropdown-item divided @click.native="loginDel">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import screenfull from 'screenfull' // 全屏插件

export default {
  components: {
    Hamburger
  },
  data() {
    return {
      defaultImg: require('@/assets/common/head.jpg'),
      allShow: false, // 是否显示全屏，false为非全屏
      language: '中文'// 语言
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar'])
  },
  methods: {
    ...mapActions('user', ['loginout']),
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },

    // 退出登录
    loginDel() {
      this.loginout()// 清除
      this.$router.push('/login')// 跳转到login页面
    },
    // 全屏切换
    toggle() {
      screenfull.toggle()
      // 修改图标
      this.allShow = !this.allShow
    },
    // 中英文切换
    langChange(command) {
      this.$i18n.locale = command // 切换语言
      if (command === 'en') {
        this.language = 'English'
      } else if (command === 'zh') {
        this.language = '中文'
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.navbar {
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 50px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(left, #3d6df8, #5b8cff);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .app-breadcrumb {
    display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 10px;
    color: #fff;
    .breadBtn {
      background-color: #84a9fe;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      margin-left: 15px;
    }
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .avatar-container {
    padding: 6px 10px;
    .avatar-wrapper {
      margin-top: 5px;
    }

    .user-avater {
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 15px;
      vertical-align: middle;
    }
    .name {
      color: #fff;
      vertical-align: middle;
      margin-left: 5px;
    }
    .user-dropdown {
      color: #fff;
    }
  }
  // 全屏
  .fullScreen{
    // position:absolute;
    // top: 4px;
    // right: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont {
      font-size: 40px;
      color:#fff;
    }
  }
}
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .el-dropdown-link{
    color:#fff;
  }
  .rightNav{
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-content: center;
  }
</style>
