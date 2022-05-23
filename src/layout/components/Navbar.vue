<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <div class="app-breadcrumb">
      丁鹿学堂教育机构
      <span class="breadBtn">体验版</span>
    </div>

    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <!-- 右侧导航栏 -->
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img
          :src="$store.getters.staffPhoto"
          class="user-avater"
          v-imgerror = "defaultImg"
          alt=""
        />
        <span class="name">{{$store.getters.name}}</span>
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
</template>

<script>
import { mapGetters,mapActions } from "vuex";
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from "@/components/Hamburger";

export default {
  data() {
    return {
      defaultImg: require("@/assets/common/head.jpg")
    }
  },
  components: {
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  methods: {
    ...mapActions("user",["loginout"]),
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },

    // 退出登录
    loginDel(){
      this.loginout();//清除
      this.$router.push("/login")//跳转到login页面
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  position: relative;
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
    margin-right: 30px;
    position: absolute;
    top: 8px;
    right: 0;

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
}
</style>
