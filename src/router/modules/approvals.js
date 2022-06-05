import Layout from '@/layout'

export default {
  path:"/approvals",
  component:Layout,
  children:[{
    path:"",//二级路由默认值
    name:"approvals",
    component:()=>import("@/views/approvals"),
    meta:{
      title:"审批",
      icon:"tree-table"
    }
    
  }]
  }
    
