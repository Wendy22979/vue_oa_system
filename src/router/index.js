import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


// 动态路由引入
import approvalsRouter from '@/router/modules/approvals'
import attendancesRouter from '@/router/modules/attendances'
import departmentsRouter from '@/router/modules/departments'
import employeesRouter from '@/router/modules/employees'
import permissionRouter from '@/router/modules/permission'
import salarysRouter from '@/router/modules/salarys'
import settingRouter from '@/router/modules/setting'
import socialRouter from '@/router/modules/social'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path:"/import",
    component:Layout,
    hidden:true,//不显示在左侧菜单栏中
    children:[
      {
        path:"/",//默认二级路由
        component:()=>import("@/views/import"),
      }
    ]
  },
//  404页面放在动态路由后面了
]

// 所有动态改变的路由
export const asyncRoutes = [
  approvalsRouter,
  attendancesRouter,
  departmentsRouter,
  employeesRouter,
  permissionRouter,
  salarysRouter,
  settingRouter,
  socialRouter
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRoutes]
})

const router = createRouter()

// 重置路由函数
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
