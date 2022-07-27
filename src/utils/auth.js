import Cookies from 'js-cookie'// 存储事件戳

const TokenKey = 'hrsass-token' // 给存储的token设置一个名，用变量接收
const TimeKey = 'hrsass-timestamp'// 存储时间戳的名字

// 获取token
export function getToken() {
  return localStorage.getItem(TokenKey)
}
// 设置token
export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}
// 删除token
export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

// 获取存储时间戳
export function getTimeStamp() {
  return Cookies.get(TimeKey)
}
// 设置存储时间戳
export function setTimeStamp() {
  return Cookies.set(TimeKey, Date.now())
}
