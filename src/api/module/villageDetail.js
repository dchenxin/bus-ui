import request from '@/utils/request'

// 查询村挡信息档案列表
export function listVillageDetail(query) {
  return request({
    url: '/module/villageDetail/list',
    method: 'get',
    params: query
  })
}

// 查询村挡信息档案详细
export function getVillageDetail(id) {
  return request({
    url: '/module/villageDetail/' + id,
    method: 'get'
  })
}
// 新增村挡信息档案
export function addVillageDetail(data) {
  return request({
    url: '/module/villageDetail',
    method: 'post',
    data: data
  })
}

// 修改村挡信息档案
export function updateVillageDetail(data) {
  return request({
    url: '/module/villageDetail',
    method: 'put',
    data: data
  })
}

// 删除村挡信息档案
export function delVillageDetail(id) {
  return request({
    url: '/module/villageDetail/' + id,
    method: 'delete'
  })
}

// 导出村挡信息档案
export function exportVillageDetail(query) {
  return request({
    url: '/module/villageDetail/export',
    method: 'get',
    params: query
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/module/villageDetail/importTemplate',
    method: 'get'
  })
}
