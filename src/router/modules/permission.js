import Layout from '@/layout'

export default {
  path:"/permission",
  component:Layout,
  children:[
    {
      path:"",//二级路由默认值
      name:"permissions",
      component:()=>import("@/views/permission"),
      meta:{
        title:"权限管理",
        icon:"lock"
      }
    }
  ]
}