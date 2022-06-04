//组织结构接口
import request from '@/utils/request'

// 初始化列表请求
export function getDepartments() {
  return request({
    url: '/company/department',
  })
}

// 删除接口
export function delDepartments(id){
  return request({
  url:`/company/department/${id}`,
   method:"delete"
  })
}

// 新增部门
export function addDepartmentApi(data){
  return request({
    url:"/company/department",
    method:"post",
    data
  })
}

// 部门负责人获取
export function getEmployeeSimple(){
  return request({
    url: `/sys/user/simple`
  })
}

// 获取部门详细信息
export function getDepartDetail (id) {
  // 返回一个axios对象
  return request({
    url: `/company/department/${id}`,

 })
}

// 编辑接口
export function updateDepartments (data) {
  // 返回一个axios对象
  return request({
    url: `/company/department/${data.id}`,
    method: "put",
    data
 })
}