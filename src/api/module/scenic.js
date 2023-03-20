import request from '@/utils/request'

// 查询景区信息列表
export function listScenic(query) {
  return request({
    url: '/module/scenic/list',
    method: 'get',
    params: query
  })
}

// 查询景区信息详细
export function getScenic(id) {
  return request({
    url: '/module/scenic/' + id,
    method: 'get'
  })
}

// 新增景区信息
export function addScenic(data) {
  return request({
    url: '/module/scenic',
    method: 'post',
    data: data
  })
}

// 修改景区信息
export function updateScenic(data) {
  return request({
    url: '/module/scenic',
    method: 'put',
    data: data
  })
}

// 删除景区信息
export function delScenic(id) {
  return request({
    url: '/module/scenic/' + id,
    method: 'delete'
  })
}

// 导出景区信息
export function exportScenic(query) {
  return request({
    url: '/module/scenic/export',
    method: 'get',
    params: query
  })
}