import Layout from '@/layout'

export default {
  path:"/setting",
  component:Layout,
  children:[
    {
      path:"",//二级路由默认值
      component:()=>import("@/views/setting"),
      meta:{
        title:"公司设置",
        icon:"setting"
      }
    }
  ]
}