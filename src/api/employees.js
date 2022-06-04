import request from '@/utils/request'

/* 
获取员工列表
*/
export function getEmployeeList (params) {
  return request({
    url:'/sys/user',
    params
 })
}
// 新增员工
export function addEmployeeListApi (data) {
  return request({
    url:'/sys/user',
    method:"post",
    data
 })
}

/* 删除员工的接口
* ***/
export function delEmployee(id) {
 return request({
   url: `/sys/user/${id}`,
   method: 'delete'
 })
}

/* 
批量导入员工接口， 参数data是一个数组类型
*/
export function importEmployee(data) {
  // 返回一个axios对象
  return request({
    url: '/sys/user/batch',
    data,
    method:"post"
 })
}

/* 
更新员工的基本信息
*/
export function saveUserDetailById(data) {
  // 返回一个axios对象
  return request({
    url: `/sys/user/${data.id}`,
    data,
    method:"put"
 })
}


/* 
读取员工的详情信息

*/

export function GetPersonalDetails(id) {
  // 返回一个axios对象
  return request({
    url: `/employees/${id}/personalInfo`,
 })
}

/* 
更新员工详情信息

*/

export function UpdatePersonalDetails(data) {
  // 返回一个axios对象
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    data,
    method:"put"
 })
}


/* 
获取员工岗位信息

*/

export function getPostMag(id) {
  // 返回一个axios对象
  return request({
    url: `/employees/${id}/jobs`,
 })
}


/* 
获取员工简单列表,返回数据只有id与name
*/
export function getEmployeeSimple() {
  // 返回一个axios对象
  return request({
    url: `sys/user/simple`,
 })
}

/* 
更新员工岗位信息

*/

export function UpdatePostMag(data) {
  // 返回一个axios对象
  return request({
    url: `/employees/${data.userId}/transferPosition`,
    data,
    method:"put"
 })
}

/* 
给员工分配角色，上传接口

*/

export function assignRoles(data) {
  // 返回一个axios对象
  return request({
    url: `/sys/user/assignRoles`,
    data,
    method:"put"
 })
}
