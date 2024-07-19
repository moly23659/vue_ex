import request from '@/utils/request'


export function getbyid(pid){
    return request({
      url: '/system/pro/getbyid/'+pid,
      method: 'get',
    })
  } 
  export function getscore(pid){
      return request({
        url: '/Score/getscore/'+pid,
        method: 'get',
      })
  }
  export function addscore(data){
    return request({
      url: '/Score/addscore',
      method: 'post',
      data:data
    })
}
export function editscore(data){
    return request({
      url: '/Score/editscore',
      method: 'post',
      data:data
    })
}