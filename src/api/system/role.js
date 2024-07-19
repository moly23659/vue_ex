import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/system/role/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/system/role',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/system/role',
    method: 'put',
    data: data
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: '/system/role/' + roleId,
    method: 'delete'
  })
}

// 查询角色已授权用户列表
export function allocatedUserList(query) {
  return request({
    url: '/system/role/authUser/allocatedList',
    method: 'get',
    params: query
  })
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
  return request({
    url: '/system/role/authUser/unallocatedList',
    method: 'get',
    params: query
  })
}

// 取消用户授权角色
export function authUserCancel(data) {
  return request({
    url: '/system/role/authUser/cancel',
    method: 'put',
    data: data
  })
}

// 批量取消用户授权角色
export function authUserCancelAll(data) {
  return request({
    url: '/system/role/authUser/cancelAll',
    method: 'put',
    params: data
  })
}

// 授权用户选择
export function authUserSelectAll(data) {
  return request({
    url: '/system/role/authUser/selectAll',
    method: 'put',
    params: data
  })
}

// 根据角色ID查询部门树结构
export function deptTreeSelect(roleId) {
  return request({
    url: '/system/role/deptTree/' + roleId,
    method: 'get'
  })
}

export function getjudge() {
  return request({
    url: '/system/role/getjudge',
    method: 'get',
  
  })
}
export function findjudge(id) {
  return request({
    url: '/system/role/findjudge/'+id,
    method: 'get',
})
}
export function updatejudge(rid,userid) {
  return request({
    url: '/system/role/updatejudge/'+rid+'/'+userid,
    method: 'post',
})
}
export function selectjudge(pid) {
  return request({
    url: '/system/role/selectjudge/'+pid,
    method: 'post',
})
}


export function score() {
  return request({
    url: '/Score/list',
    method: 'get',
})
}
export function getjudgeall() {
  return request({
    url: '/Score/getjudgeall',
    method: 'get',  
})
}
// 新增评委账号
 export function addjudge(data){
  return request({
    url:'/Score/SetJudge',
    method:'post',
    data: data
  })
 }
//  设置角色权限
  export function setrole(query){
  return request({
    url:'/system/role/setrole',
    method:'post',
    params: query
  })
 }
// 查看所有评委的权限
 export function getalljudge(){
  return request({
    url:'/system/role/getalljudge',
    method:'get',
    
  })
 }
//  查询评分状态
export function getstatus(){
  return request({
    url:'Score/rqScore',
    method:'get',
    
  })
 }

 export function controlstatus(data){
  return request({
    url:'Score/control',
    method:'post',
    data: data
    
  })
 }
