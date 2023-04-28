import request from '@/utils/request'

// 查询车队信息列表
export function listFleet(query) {
  return request({
    url: '/ruoyi/fleet/list',
    method: 'get',
    params: query
  })
}

// 查询车队信息详细
export function getFleet(id) {
  return request({
    url: '/ruoyi/fleet/' + id,
    method: 'get'
  })
}

// 新增车队信息
export function addFleet(data) {
  return request({
    url: '/ruoyi/fleet',
    method: 'post',
    data: data
  })
}

// 修改车队信息
export function updateFleet(data) {
  return request({
    url: '/ruoyi/fleet',
    method: 'put',
    data: data
  })
}

// 删除车队信息
export function delFleet(id) {
  return request({
    url: '/ruoyi/fleet/' + id,
    method: 'delete'
  })
}

// 导出车队信息
export function exportFleet(query) {
  return request({
    url: '/ruoyi/fleet/export',
    method: 'get',
    params: query
  })
}