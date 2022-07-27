import request from '@/utils/request'

/*
获取角色列表
*/
export function getRoleList(data) {
  // 返回一个axios对象
  return request({
    url: '/sys/role',
    data
  })
}

/*
删除
*/
export function deleteRole(id) {
  // 返回一个axios对象
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

// 编辑角色
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

/*
获取角色详情
*/
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

/*
新增角色
*/
export function addRole(data) {
  return request({
    url: `/sys/role`,
    method: 'post',
    data
  })
}

/**
 * 给角色分配权限
 *  */
export function assignPrem(data) {
  return request({
    url: `/sys/role/assignPrem`,
    method: 'put',
    data
  })
}
