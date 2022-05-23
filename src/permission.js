import router from './router'
import store from './store'
// 引入进度条插件
import Nprogress from 'nprogress'
// 进度条样式
import 'nprogress/nprogress.css'

// 白名单，不需要验证即可登录
const whiteList = ["/login","/404"]
// 前置路由守卫
router.beforeEach( async(to,from,next)=>{
  Nprogress.start() //开启进度条
  
  // 判断是否登录，有token就登陆了
  if(store.state.user.token){
    if(to.path === "/login"){//如果条转到登录页面就直接跳到首页
      next("/")
    }else { //登录后其他页面跳转就直接放行
     if (!store.state.user.userInfo.userId) {
      await store.dispatch('user/getUserInfo')
     }
      next()
    }

  }else {
    // 没有登录就判断将要条转的页面是否为白名单
    if(whiteList.indexOf(to.path) > -1){
      next()
    }else {
      next("/login")
    }
  }
Nprogress.done()//关闭进度条
})




// 后置路由守卫
router.afterEach((to,from)=>{
  Nprogress.done()//关闭进度条
})

// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
