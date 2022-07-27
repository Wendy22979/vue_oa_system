const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username, // 用户名
  staffPhoto: state => state.user.userInfo.staffPhoto, // 用户头像
  departmentNameP: state => state.user.userInfo.departmentName, // 部门信息
  routes: state => state.permission.routes // 用户权限路由
}
export default getters
