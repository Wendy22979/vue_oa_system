import request from '@/utils/request'


// 登录接口
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 用户资料接口
export const getUserInfo = () => {
  return request({
    url: '/sys/profile',
    method: 'post',
  })
}


// 获取用户头像,获取员工基本信息
export const getUserDetailById = (id) => {
  return request({
    url: `/sys/user/${id}`,
  })
}



// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }
