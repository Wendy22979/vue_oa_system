import Layout from '@/layout'

export default {
  path: '/social',
  component: Layout,
  children: [
    {
      path: '', // 二级路由默认值
      name: 'social_securitys',
      component: () => import('@/views/social'),
      meta: {
        title: '社保',
        icon: 'table'
      }
    },
    // 历史归档
    {
      path: 'historicalArchiving',
      hidden: true,
      component: () => import('@/views/social/components/historical'),
      name: 'socialHistorical',
      meta: {
        title: '历史归档'
      }
    },
    // 月报表
    {
      path: 'monthStatement',
      component: () => import('@/views/social/components/month'),
      name: 'socialMonthStatement',
      hidden: true,
      meta: {
        title: '当月报表'
      }
    },
    // 员工社保详情
    {
      path: 'detail/:id',
      hidden: true,
      component: () => import('@/views/social/components/detail'),
      name: 'socialDetail',
      meta: {
        title: '社保'
      }
    }
  ]
}
