import request from '@/utils/request'

// 查询乡村职责信息列表
export function listVillageDuties(query) {
  return request({
    url: '/module/villageDuties/list',
    method: 'get',
    params: query
  })
}

// 查询村挡信息列表
export function listVillagesManage(query) {
  return request({
    url: '/module/villageDuties/managelist',
    method: 'get',
    params: query
  })
}

// 查询乡村职责信息详细
export function getVillageDuties(id) {
  return request({
    url: '/module/villageDuties/' + id,
    method: 'get'
  })
}

// 新增乡村职责信息
export function addVillageDuties(data) {
  return request({
    url: '/module/villageDuties',
    method: 'post',
    data: data
  })
}

// 修改乡村职责信息
export function updateVillageDuties(data) {
  return request({
    url: '/module/villageDuties',
    method: 'put',
    data: data
  })
}

// 删除乡村职责信息
export function delVillageDuties(id) {
  return request({
    url: '/module/villageDuties/' + id,
    method: 'delete'
  })
}

// 导出乡村职责信息
export function exportVillageDuties(query) {
  return request({
    url: '/module/villageDuties/export',
    method: 'get',
    params: query
  })
}
// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/module/villageDuties/importTemplate',
    method: 'get'
  })
}
