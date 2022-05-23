import Layout from '@/layout'

export default {
  path:"/salarys",
  component:Layout,
  children:[
    {
      path:"",//二级路由默认值
      component:()=>import("@/views/salarys"),
      meta:{
        title:"工资",
        icon:"money"
      }
    }
  ]
}