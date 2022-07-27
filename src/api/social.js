// 社保页面接口
import request from '@/utils/request'

// 查询企业员工社保列表
export const getSocialList = (data) => {
  return request({
    url: '/social_securitys/list',
    method: 'post',
    data
  })
}

// 查询企业配置对象
export const getSettings = () => {
  return request({
    url: '/social_securitys/settings'
  })
}

// 获取城市
export function getCityList() {
  return request({
    url: '/sys/city'
  })
}

// 查询社保历史归档列表
export function getArchivingList(year) {
  return request({
    url: `/social_securitys/historys/${year}/list`
  })
}

// 查询月份数据报表
export function getArchivingCont(params) {
  return request({
    url: `/social_securitys/historys/${params.month}`,
    params
  })
}

// 归档报表
export function getArchivingArchive(data) {
  return request({
    url: `/social_securitys/historys/${data.yearMonth}/archive`,
    method: 'post',
    data
  })
}

// 保存和更新员工数据
export function saveContent(data) {
  return request({
    url: `/social_securitys/${data.userId}`,
    method: 'put',
    data
  })
}

// 查询用户的社保数据
export function getContent(userId) {
  return request({
    url: `/social_securitys/${userId}`
  })
}

// 根据城市id查询参保城市的参保项目
export function getPaymentItemList(id) {
  return request({
    url: `/social_securitys/payment_item/${id}`
  })
}
