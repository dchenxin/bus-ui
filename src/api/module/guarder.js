import request from '@/utils/request'

// 查询守线员信息列表
export function listGuarder(query) {
  return request({
    url: '/ruoyi/guarder/list',
    method: 'get',
    params: query
  })
}

// 查询守线员信息详细
export function getGuarder(id) {
  return request({
    url: '/ruoyi/guarder/' + id,
    method: 'get'
  })
}

// 新增守线员信息
export function addGuarder(data) {
  return request({
    url: '/ruoyi/guarder',
    method: 'post',
    data: data
  })
}

// 修改守线员信息
export function updateGuarder(data) {
  return request({
    url: '/ruoyi/guarder',
    method: 'put',
    data: data
  })
}

// 删除守线员信息
export function delGuarder(id) {
  return request({
    url: '/ruoyi/guarder/' + id,
    method: 'delete'
  })
}

// 导出守线员信息
export function exportGuarder(query) {
  return request({
    url: '/ruoyi/guarder/export',
    method: 'get',
    params: query
  })
}