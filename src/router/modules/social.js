import Layout from '@/layout'

export default {
  path:"/social",
  component:Layout,
  children:[
    {
      path:"",//二级路由默认值
      name:"social_securitys",
      component:()=>import("@/views/social"),
      meta:{
        title:"社保",
        icon:"table"
      }
    }
  ]
}