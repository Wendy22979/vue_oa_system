import {login,getUserInfo,getUserDetailById} from "@/api/user"
import {getToken,setToken,removeToken,getTimeStamp,setTimeStamp} from  "@/utils/auth"
import { get } from "js-cookie"

const getDefaultState = () => {
  return {
    token: getToken(),//值从本地缓存中读取
    userInfo:{}  //值不能是null
  }
}

const state = getDefaultState()

const mutations = {
  // 存储token的值
  SET_TOKEN(state,token){
    state.token = token
    setToken(token)
  },
  // 删除token
  REMOVE_TOKEN (state) {
    state.token = null  //删除vuex中的token
    removeToken()
  },

  //设置用户信息
  GET_USER_INFO(state,data){
    state.userInfo = {...data}
  },
  // 清除用户信息
  REMOVE_USER_INFO (state) {
    state.userInfo = {}
  }
  
 
}

const actions = {
  // 登录请求接口
  async login({commit},data){
    try{
      let result = await login(data)
      commit('SET_TOKEN',result)
      setTimeStamp()//存储时间戳
    }catch(error){
      console.log(error)
    }
  },

  // 用户信息接口
  async getUserInfo({commit}){
    try{
      let res = await getUserInfo()//获取用户信息
      let resP = await getUserDetailById(res.userId)//用户头像
      // 合并数据
      let data={...res,...resP}
      console.log(data)
      commit("GET_USER_INFO",data)
      return res;   //？
    }catch(error){
      console.log(error)
    }
  },

  // 用户退出功能
  loginout({commit}){
  // 删除本地token
  commit("REMOVE_TOKEN")
  // 删除用户资料
  commit("REMOVE_USER_INFO")

  }

   
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

