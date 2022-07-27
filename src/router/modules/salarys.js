import Layout from '@/layout'

export default {
  path: '/salarys',
  component: Layout,
  children: [
    {
      path: '', // 二级路由默认值
      name: 'salarys',
      component: () => import('@/views/salarys'),
      meta: {
        title: '工资',
        icon: 'money'
      }
    },
    {
      path: 'setting',
      component: () => import('@/views/salarys/setting'),
      name: 'salarysSetting',
      hidden: true,
      meta: {
        title: '设置'
      }
    },
    {
      path: 'monthStatement',
      component: () => import('@/views/salarys/month'),
      name: 'salarysMonthStatement',
      hidden: true,
      meta: {
        title: '月报表'
      }
    },
    {
      path: 'details/:yearMonth/:id',
      component: () => import('@/views/salarys/detail/index.vue'),
      name: 'salarysDetails',
      hidden: true,
      meta: {
        title: '薪资详情'
      }
    }
  ]
}
