import request from '@/utils/request'

// 查询设备厂商信息列表
export function listFactory(query) {
  return request({
    url: '/ruoyi/factory/list',
    method: 'get',
    params: query
  })
}

// 查询设备厂商信息详细
export function getFactory(id) {
  return request({
    url: '/ruoyi/factory/' + id,
    method: 'get'
  })
}

// 新增设备厂商信息
export function addFactory(data) {
  return request({
    url: '/ruoyi/factory',
    method: 'post',
    data: data
  })
}

// 修改设备厂商信息
export function updateFactory(data) {
  return request({
    url: '/ruoyi/factory',
    method: 'put',
    data: data
  })
}

// 删除设备厂商信息
export function delFactory(id) {
  return request({
    url: '/ruoyi/factory/' + id,
    method: 'delete'
  })
}

// 导出设备厂商信息
export function exportFactory(query) {
  return request({
    url: '/ruoyi/factory/export',
    method: 'get',
    params: query
  })
}