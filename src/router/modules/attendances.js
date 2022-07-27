import Layout from '@/layout'

export default {
  path: '/attendances',
  component: Layout,
  children: [{
    path: '', // 二级路由默认值
    name: 'attendances',
    component: () => import('@/views/attendances'),
    meta: {
      title: '考勤',
      icon: 'skill'
    }
  },
  {
    path: 'archiving',
    component: () => import('@/views/attendances/historical/index.vue'),
    name: 'archiving',
    hidden: true,
    meta: {
      title: '归档'
    }
  },
  {
    path: 'report/:month',
    component: () => import('@/views/attendances/report/index.vue'),
    name: 'reports',
    hidden: true,
    meta: {
      title: '报表'
    }
  }]
}
