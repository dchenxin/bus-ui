import request from '@/utils/request'

// 查询站点信息列表
export function listStation(query) {
  return request({
    url: '/ruoyi/station/list',
    method: 'get',
    params: query
  })
}

// 查询站点信息详细
export function getStation(id) {
  return request({
    url: '/ruoyi/station/' + id,
    method: 'get'
  })
}

// 新增站点信息
export function addStation(data) {
  return request({
    url: '/ruoyi/station',
    method: 'post',
    data: data
  })
}

// 修改站点信息
export function updateStation(data) {
  return request({
    url: '/ruoyi/station',
    method: 'put',
    data: data
  })
}

// 删除站点信息
export function delStation(id) {
  return request({
    url: '/ruoyi/station/' + id,
    method: 'delete'
  })
}

// 导出站点信息
export function exportStation(query) {
  return request({
    url: '/ruoyi/station/export',
    method: 'get',
    params: query
  })
}

// 下载站点导入模板
export function importTemplate() {
  return request({
    url: '/ruoyi/station/importTemplate',
    method: 'get'
  })
}
