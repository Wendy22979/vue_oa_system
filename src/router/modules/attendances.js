import Layout from '@/layout'

export default {
  path:"/attendances",
  component:Layout,
  children:[
    {
      path:"",//二级路由默认值
      component:()=>import("@/views/attendances"),
      meta:{
        title:"考勤",
        icon:"skill"
      }
    }
  ]
}