import request from '@/utils/request'

// 查询乡村档案列表
export function listVillageInfo(query) {
  return request({
    url: '/module/villageInfo/list',
    method: 'get',
    params: query
  })
}

// 查询乡村档案详细
export function getVillageInfo(id) {
  return request({
    url: '/module/villageInfo/' + id,
    method: 'get'
  })
}

// 新增乡村档案
export function addVillageInfo(data) {
  return request({
    url: '/module/villageInfo',
    method: 'post',
    data: data
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/module/villageInfo/importTemplate',
    method: 'get'
  })
}

// 修改乡村档案
export function updateVillageInfo(data) {
  return request({
    url: '/module/villageInfo',
    method: 'put',
    data: data
  })
}

// 删除乡村档案
export function delVillageInfo(id) {
  return request({
    url: '/module/villageInfo/' + id,
    method: 'delete'
  })
}

// 导出乡村档案
export function exportVillageInfo(query) {
  return request({
    url: '/module/villageInfo/export',
    method: 'get',
    params: query
  })
}
