import request from '@/utils/request'

// 查询app用户列表
export function listUser(query) {
  return request({
    url: '/module/user/list',
    method: 'get',
    params: query
  })
}

// 查询app用户详细
export function getUser(id) {
  return request({
    url: '/module/user/' + id,
    method: 'get'
  })
}

// 新增app用户
export function addUser(data) {
  return request({
    url: '/module/user',
    method: 'post',
    data: data
  })
}

// 修改app用户
export function updateUser(data) {
  return request({
    url: '/module/user',
    method: 'put',
    data: data
  })
}

// 删除app用户
export function delUser(id) {
  return request({
    url: '/module/user/' + id,
    method: 'delete'
  })
}

// 导出app用户
export function exportUser(query) {
  return request({
    url: '/module/user/export',
    method: 'get',
    params: query
  })
}