import request from '@/utils/request'

// 查询乘客列表
export function listPassenger(query) {
  return request({
    url: '/module/passenger/list',
    method: 'get',
    params: query
  })
}

// 查询乘客详细
export function getPassenger(id) {
  return request({
    url: '/module/passenger/' + id,
    method: 'get'
  })
}

// 新增乘客
export function addPassenger(data) {
  return request({
    url: '/module/passenger',
    method: 'post',
    data: data
  })
}

// 修改乘客
export function updatePassenger(data) {
  return request({
    url: '/module/passenger',
    method: 'put',
    data: data
  })
}

// 删除乘客
export function delPassenger(id) {
  return request({
    url: '/module/passenger/' + id,
    method: 'delete'
  })
}

// 导出乘客
export function exportPassenger(query) {
  return request({
    url: '/module/passenger/export',
    method: 'get',
    params: query
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/module/passenger/importTemplate',
    method: 'get'
  })
}
