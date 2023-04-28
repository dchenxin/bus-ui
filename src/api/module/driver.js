import request from '@/utils/request'

// 查询驾驶员信息列表
export function listDriver(query) {
  return request({
    url: '/ruoyi/driver/list',
    method: 'get',
    params: query
  })
}

// 查询驾驶员信息详细
export function getDriver(id) {
  return request({
    url: '/ruoyi/driver/' + id,
    method: 'get'
  })
}

// 新增驾驶员信息
export function addDriver(data) {
  return request({
    url: '/ruoyi/driver',
    method: 'post',
    data: data
  })
}

// 修改驾驶员信息
export function updateDriver(data) {
  return request({
    url: '/ruoyi/driver',
    method: 'put',
    data: data
  })
}

// 删除驾驶员信息
export function delDriver(id) {
  return request({
    url: '/ruoyi/driver/' + id,
    method: 'delete'
  })
}

// 导出驾驶员信息
export function exportDriver(query) {
  return request({
    url: '/ruoyi/driver/export',
    method: 'get',
    params: query
  })
}