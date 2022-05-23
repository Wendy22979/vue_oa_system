import Layout from '@/layout'

export default {
  path:"/employees",
  component:Layout,
  children:[
    {
      path:"",//二级路由默认值
      component:()=>import("@/views/employees"),
      meta:{
        title:"员工",
        icon:"people"
      }
    }
  ]
}