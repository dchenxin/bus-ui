import request from '@/utils/request'

// 查询应用版本管理列表
export function listAppVersion(query) {
  return request({
    url: '/module/appVersion/list',
    method: 'get',
    params: query
  })
}

// 查询应用版本管理详细
export function getAppVersion(id) {
  return request({
    url: '/module/appVersion/' + id,
    method: 'get'
  })
}

// 新增应用版本管理
export function addAppVersion(data) {
  return request({
    url: '/module/appVersion',
    method: 'post',
    data: data
  })
}

// 修改应用版本管理
export function updateAppVersion(data) {
  return request({
    url: '/module/appVersion',
    method: 'put',
    data: data
  })
}

// 删除应用版本管理
export function delAppVersion(id) {
  return request({
    url: '/module/appVersion/' + id,
    method: 'delete'
  })
}

// 导出应用版本管理
export function exportAppVersion(query) {
  return request({
    url: '/module/appVersion/export',
    method: 'get',
    params: query
  })
}