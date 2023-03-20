import request from '@/utils/request'

// 查询村档信息列表
export function listVillageManage(query) {
  return request({
    url: '/module/villageManage/list',
    method: 'get',
    params: query
  })
}

// 查询村档信息详细
export function getVillageManage(id) {
  return request({
    url: '/module/villageManage/' + id,
    method: 'get'
  })
}

// 查询村档信息详细
export function listRoadInfo(query) {
  return request({
    url: '/module/villageManage/roadList',
    method: 'get',
    params: query
  })
}

// 新增村档信息
export function addVillageManage(data) {
  return request({
    url: '/module/villageManage',
    method: 'post',
    data: data
  })
}

// 修改村档信息
export function updateVillageManage(data) {
  return request({
    url: '/module/villageManage',
    method: 'put',
    data: data
  })
}

// 删除村档信息
export function delVillageManage(id) {
  return request({
    url: '/module/villageManage/' + id,
    method: 'delete'
  })
}

// 导出村档信息
export function exportVillageManage(query) {
  return request({
    url: '/module/villageManage/export',
    method: 'get',
    params: query
  })
}

// 查询相关村档的职责列表
export function listRuralDuty(id,query) {
  return request({
    url: '/module/villageManage/getListDuty/'+id,
    method: 'get',
    params: query
  })
}

// 查询相关村档的街道列表
export function listRuralRoad(id,query) {
  return request({
    url: '/module/villageManage/getListStreet/'+id,
    method: 'get',
    params: query
  })
}
// 查询拼接乡村
export function listRuralInfo() {
  return request({
    url: '/module/villageManage/ruralList',
    method: 'get',
  })
}
