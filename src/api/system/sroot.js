import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listSroot(query) {
  return request({
    url: '/system/sroot/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getSroot(id) {
  return request({
    url: '/system/sroot/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addSroot(data) {
  return request({
    url: '/system/sroot',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateSroot(data) {
  return request({
    url: '/system/sroot',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delSroot(id) {
  return request({
    url: '/system/sroot/' + id,
    method: 'delete'
  })
}

export function session(root) {
  return request({
    url: '/system/sroot/session/' + root,
    method: 'get'
  })
}

export function sessionid(id) {
  return request({
    url: '/system/sroot/sessionid/' + id,
    method: 'get'
  })
}
//查看自己的项目
export function getp(id){
  return request({
    url: '/system/sroot/getp/'+id,
    method: 'get',
  })
}
//填充项目
export function getpbyid(pid){
  return request({
    url: '/system/sroot/getpbyid/'+pid,
    method: 'get',
  })
}

export function getallp(){
  return request({
    url: '/system/sroot/getallp',
    method: 'get',
  })
}

export function allsession() {
  return request({
    url: '/system/sroot/session/all' ,
    method: 'get'
  })
}


export function upload(filelist) {
  return request({
    url: '/system/szw/upload',
    method: 'post',
    data: filelist  // 将文件列表作为请求体发送
  })
}

export function upload2(data) {
  return request({
    url: '/system/szw/upload2',
    method: 'post',
    data: data  // 将文件列表作为请求体发送
  })
}

export function geturl(){ 
return request({
  url: '/system/sroot/geturl',
  method: 'get',
})
}
//个人的上传
export function submitp(project){
  return request({
    url: '/system/sroot/submitp',
    method: 'post',
    data: project
  })
}

//填报情况
export function getpstatus(){
  return request({
    url: '/system/sroot/pstatus',
    method: 'get',
  })
}
//新增子活动
export function addchild(data){
  return request({
    url: '/system/sroot/addchild',
    method: 'post',
    data: data
})
}
//删除子活动
export function delchild(id){
  return request({
    url: '/system/sroot/deletesession/'+id,
    method: 'delete',
  })
}
//修改子活动
export function updatechild(data){
  return request({
    url: '/system/sroot/updatesession',
    method: 'put',
    data: data
  })
}
//初始化
export function init(){
  return request({
    url: '/system/sroot/init',
    method: 'get',
  })
}
//高校
export function hschool(){
  return request({
    url: '/hschool/list',
    method: 'get',
  })
}
export function word(data){
  return request({
    url: '/hschool/word',
    method: 'post',
    data: data
  })
}
export function updatep(data){
  return request({
  url: '/system/pro/updatepro',
  method: 'Post',
  data: data
})
}
export function sendid(projectid){
  return request({
  url: '/szw/deal/'+projectid,
  method: 'get',
})
}

export function test(){
  return request({
    url: '/system/sroot/test',
    method: 'get',
  })
} 

export function getid(id){
  return request({
    url: '/szw/getid/'+id,
    method: 'get',
  })
}
export function upmessage(data){
  return request({
    url: '/szw/addmessage',
    method: 'post',
    data:data,
  })
} 
export function upmodel(data){
  return request({
    url: '/szw/addmodel',
    method: 'post',
    data:data,
  })
} 
export function getsubid(id){
  return request({
    url: '/szw/getsubid/'+id,
    method: 'get',
})
}
export function upsub(data){
  return request({
    url: '/szw/upsub',
    method: 'post',
    data:data,
  
})
}