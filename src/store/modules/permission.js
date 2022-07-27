// 引入静态路由和动态改变的路由
import { constantRoutes, asyncRoutes } from '@/router'

const state = () => {
  return {
    routes: [] // 登录用户的所有路由
  }
}

const mutations = {
  SET_ROUTER(state, newRouter) {
    state.routes = [...constantRoutes, ...newRouter]// 静态与动态路由混合
  }
}

const actions = {
  // 获取动态路由name，筛选出动态路由
  setRoutes({ commit }, menus) {
    const router = []
    menus.forEach((item) => {
      router.push(...asyncRoutes.filter(key => key.children[0].name === item))// 过滤数组，并添加到router数组中
    })
    commit('SET_ROUTER', router)
    return router
  }
}

const getters = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
