import router from './router'
import store from './store'
// 引入进度条插件
import Nprogress from 'nprogress'
// 进度条样式
import 'nprogress/nprogress.css'

// 白名单，不需要验证即可登录
const whiteList = ['/login', '/404']
// 前置路由守卫
router.beforeEach(async(to, from, next) => {
  Nprogress.start() // 开启进度条

  // 判断是否登录，有token就登陆了
  if (store.state.user.token) {
    if (to.path === '/login') { // 如果条转到登录页面就直接跳到首页
      next('/')
    } else { // 登录后其他页面跳转就直接放行
      if (!store.state.user.userInfo.userId) {
        const res = await store.dispatch('user/getUserInfo')
        const { roles: { menus }} = res
        //  获取的动态路由
        const routes = await store.dispatch('permission/setRoutes', menus)
        console.log(routes)
        //  添加动态路由
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        next(to.path)
      } else {
        next()
      }
    }
  } else {
    // 没有登录就判断将要条转的页面是否为白名单
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  Nprogress.done()// 关闭进度条
})

// 后置路由守卫
router.afterEach((to, from) => {
  Nprogress.done()// 关闭进度条
})

