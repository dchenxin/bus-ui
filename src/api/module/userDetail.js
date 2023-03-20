import request from '@/utils/request'

// 查询用户详情列表
export function listUserDetail(query) {
  return request({
    url: '/module/userDetail/list',
    method: 'get',
    params: query
  })
}

// 查询用户详情详细
export function getUserDetail(id) {
  return request({
    url: '/module/userDetail/' + id,
    method: 'get'
  })
}

// 新增用户详情
export function addUserDetail(data) {
  return request({
    url: '/module/userDetail',
    method: 'post',
    data: data
  })
}

// 修改用户详情
export function updateUserDetail(data) {
  return request({
    url: '/module/userDetail',
    method: 'put',
    data: data
  })
}

// 删除用户详情
export function delUserDetail(id) {
  return request({
    url: '/module/userDetail/' + id,
    method: 'delete'
  })
}

// 导出用户详情
export function exportUserDetail(query) {
  return request({
    url: '/module/userDetail/export',
    method: 'get',
    params: query
  })
}

// 查询用户详情详细
export function getCurrent() {
  return request({
    url: '/module/userDetail/current',
    method: 'get'
  })
}

// 查询用户详情详细
export function getNoDetails() {
  return request({
    url: '/module/userDetail/noDetails',
    method: 'get'
  })
}
