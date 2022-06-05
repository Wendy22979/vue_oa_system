import Layout from '@/layout'

export default {
  path:"/employees",
  component:Layout,
  children:[
    {
      path:"",//二级路由默认值
      name:"employees",
      component:()=>import("@/views/employees"),
      meta:{
        title:"员工",
        icon:"people"
      }
    },
    {
      path:"detail",
      component: () => import('@/views/employees/detail'),
      hidden: true, //不在左侧菜单显示
      meta: {
        title:"员工详情"
      }
    },
    {
      path:"print/:id",
      component: () => import('@/views/employees/print'),
      hidden: true, //不在左侧菜单显示
      meta: {
        title:"打印信息"
      }
    }
  ]
}