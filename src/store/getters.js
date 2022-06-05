const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token:  state => state.user.token,
  name: state => state.user.userInfo.username,
  staffPhoto: state => state.user.userInfo.staffPhoto,
  routes:state=>state.permission.routes,
}
export default getters
