// 工资页面
import request from '@/utils/request'

// 查询员工薪资列表
export function getSalarysList(data) {
  return request({
    url: '/salarys/list',
    data,
    method: 'post'
  })
}

// 查询企业当月是否设置薪资信息
export function getCompanySetting() {
  return request({
    url: '/salarys/company-settings'
  })
}

// 查询某一个用户的薪资
export function getSalaryDetail(userId) {
  return request({
    url: `/salarys/modify/${userId}`
  })
}

// 调薪
export function changeSalary(data) {
  return request({
    url: `/salarys/modify/${data.userId}`,
    method: 'post',
    data
  })
}

// 定薪
export function initSalary(data) {
  return request({
    url: `/salarys/init/${data.userId}`,
    method: 'post',
    data
  })
}

// 设置初始设置信息获取
export function getSettings() {
  return request({
    url: '/salarys/settings'
  })
}

// 设置数据修改
export function saveSettings(data) {
  return request({
    url: '/salarys/settings',
    method: 'post',
    data
  })
}

// 查询月员工薪资列表
export function getArchivingCont(params) {
  return request({
    url: `/salarys/reports/${params.yearMonth}`,
    params
  })
}

// 归档报表
export function getArchivingArchive(data) {
  return request({
    url: `/salarys/reports/${data.yearMonth}/archive`,
    data,
    method: 'post'
  })
}

// 新建列表
export function newReport(data) {
  return request({
    url: `/salarys/reports/${data.yearMonth}/newReport`,
    method: 'put',
    data
  })
}
