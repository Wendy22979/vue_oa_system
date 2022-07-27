// 考勤
import request from '@/utils/request'

// 获取考勤详情
export function getAtteArchiveDetail(data) {
  return request({
    url: `/attendances/archive/${data.userId}/${data.yearMonth}`
  })
}

// 获取考勤列表
export function getAttendancesList(params) {
  return request({
    url: '/attendances',
    params
  })
}

// 出勤设置数据保存
export function attendanceSave(data) {
  return request({
    url: '/cfg/atte',
    method: 'put',
    data
  })
}

// 请假保存
export function leaveSave(data) {
  return request({
    url: '/cfg/leave',
    method: 'put',
    data
  })
}

// 扣款设置保存
export function deductionsSave(data) {
  return request({
    url: '/cfg/deduction',
    method: 'put',
    data
  })
}

// 获取加班配置
export function getOvertime(data) {
  return request({
    url: '/cfg/extDuty/item',
    method: 'post',
    data
  })
}

// 加班配置保存
export function overtimeSave(data) {
  return request({
    url: '/cfg/extDuty',
    method: 'put',
    data
  })
}

// 获取对应年份的报表列表
export function getArchivingList(params) {
  return request({
    url: '/attendances/reports/year',
    params
  })
}

// 获取报表对应具体数据
export function getArchivingCont(params) {
  return request({
    url: `/attendances/reports/${params.atteArchiveMonthlyId}`,
    params
  })
}

// 报表归档
export function fileUpdate(data) {
  return request({
    url: `/employees/archives/${data.month}`,
    method: 'put',
    data
  })
}
// 获取月考请报表
export function reportFormList(params) {
  return request({
    url: '/attendances/reports',
    params
  })
}

// 月度考勤记录归档
export function archives(params) {
  return request({
    url: '/attendances/archives',
    params
  })
}

// 新建报表
export function newReports(params) {
  return request({
    url: '/attendances/newReports',
    params
  })
}

