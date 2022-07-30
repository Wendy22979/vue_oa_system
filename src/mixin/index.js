import store from '@/store'

export default {
  methods: {
    // 判断添加删除等功能权限，用户userinfo中有没有，返回一个布尔值
    checkPermission(key) {
      // 获取用户数据权限信息，即删除添加的小权限
      const { userInfo: { roles: { points }}} = store.state.user
      if (points && points.length !== 0) {
        return points.some((item) => {
          return item === key
        })
      }
      return false
    }
  }
}
