import request from '@/utils/request'

// 查询应用条款管理列表
export function listAppTerm(query) {
  return request({
    url: '/module/appTerm/list',
    method: 'get',
    params: query
  })
}

// 查询应用条款管理详细
export function getAppTerm(id) {
  return request({
    url: '/module/appTerm/' + id,
    method: 'get'
  })
}

// 新增应用条款管理
export function addAppTerm(data) {
  return request({
    url: '/module/appTerm',
    method: 'post',
    data: data
  })
}

// 修改应用条款管理
export function updateAppTerm(data) {
  return request({
    url: '/module/appTerm',
    method: 'put',
    data: data
  })
}

// 删除应用条款管理
export function delAppTerm(id) {
  return request({
    url: '/module/appTerm/' + id,
    method: 'delete'
  })
}

// 导出应用条款管理
export function exportAppTerm(query) {
  return request({
    url: '/module/appTerm/export',
    method: 'get',
    params: query
  })
}