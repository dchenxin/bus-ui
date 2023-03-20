import request from '@/utils/request'

// 查询村长信息列表
export function listVillageHead(query) {
  return request({
    url: '/module/villageHead/list',
    method: 'get',
    params: query
  })
}

// 查询村长信息详细
export function getVillageHead(id) {
  return request({
    url: '/module/villageHead/' + id,
    method: 'get'
  })
}

// 新增村长信息
export function addVillageHead(data) {
  return request({
    url: '/module/villageHead',
    method: 'post',
    data: data
  })
}

// 修改村长信息
export function updateVillageHead(data) {
  return request({
    url: '/module/villageHead',
    method: 'put',
    data: data
  })
}

// 删除村长信息
export function delVillageHead(id) {
  return request({
    url: '/module/villageHead/' + id,
    method: 'delete'
  })
}

// 导出村长信息
export function exportVillageHead(query) {
  return request({
    url: '/module/villageHead/export',
    method: 'get',
    params: query
  })
}
// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/module/villageHead/importTemplate',
    method: 'get'
  })
}
