import Layout from '@/layout'

export default {
  path:"/departments",
  component:Layout,
  children:[
    {
      path:"",//二级路由默认值
      component:()=>import("@/views/departments"),
      meta:{
        title:"组织架构",
        icon:"tree"
      }
    }
  ]
}