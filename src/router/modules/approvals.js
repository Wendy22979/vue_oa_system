import Layout from '@/layout'

export default {
  path: '/approvals',
  component: Layout,
  children: [{
    path: '', // 二级路由默认值
    name: 'approvals',
    component: () => import('@/views/approvals'),
    meta: {
      title: '审批',
      icon: 'tree-table'
    }
  },
  // 流程设置
  {
    path: 'securitySetting',
    component: () => import('@/views/approvals/security'),
    name: 'securitySetting',
    hidden: true,
    meta: {
      title: '设置'
      // icon: 'approval', noCache: true
    }
  },
  // 查看页面
  {
    path: 'leaveApproval/:id',
    component: () => import('@/views/approvals/leave'),
    name: 'leaveApproval',
    hidden: true,
    meta: {
      title: '申请请假',
      icon: 'approval', noCache: true }
  },
  {
    path: 'quitApproval/:id',
    component: () => import('@/views/approvals/quit'),
    name: 'quitApproval',
    hidden: true,
    meta: {
      title: '申请离职',
      icon: 'approval', noCache: true }
  },
  {
    path: 'overtimeApproval/:id',
    component: () => import('@/views/approvals/overtime'),
    name: 'overtimeApproval',
    hidden: true,
    meta: {
      title: '加班申请',
      icon: 'approval', noCache: true }
  }
  ]
}

