// 审批接口
import request from '@/utils/request'

// 发起审批流程申请
export const startProcess = (data) => {
  return request({
    url: '/user/process/startProcess',
    method: 'post',
    data
  })
}

// 获取审批列表
export function getApprovalList(data) {
  return request({
    url: `/user/process/instance/${data.page}/${data.pageSize}`,
    method: 'put',
    data
  })
}

// 获取流程列表
export function getFlowList(params) {
  return request({ url: `/user/process/definition`, params })
}

// 更改流程激活与挂载状态
export function suspend(params) {
  return request({
    url: `/user/process/suspend/${params.processKey}`,
    params
  })
}

// 文件上传接口
export function uploadFile(data) {
  return request({
    url: `/user/process/deploy`,
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 获取流程详情，id为审批单的id
export function getApprovalsDetail(id) {
  return request({
    url: `/user/process/instance/${id}`
  })
}

// 查询审批单审批明细
export function getApprovalsTaskDetail(id) {
  return request({
    url: `/user/process/instance/tasks/${id}`
  })
}
