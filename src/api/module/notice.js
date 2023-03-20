import request from '@/utils/request'

// 查询须知列表
export function listNotice(query) {
  return request({
    url: '/module/notice/list',
    method: 'get',
    params: query
  })
}

// 查询须知详细
export function getNotice(id) {
  return request({
    url: '/module/notice/' + id,
    method: 'get'
  })
}

// 新增须知
export function addNotice(data) {
  return request({
    url: '/module/notice',
    method: 'post',
    data: data
  })
}

// 修改须知
export function updateNotice(data) {
  return request({
    url: '/module/notice',
    method: 'put',
    data: data
  })
}

// 删除须知
export function delNotice(id) {
  return request({
    url: '/module/notice/' + id,
    method: 'delete'
  })
}

// 导出须知
export function exportNotice(query) {
  return request({
    url: '/module/notice/export',
    method: 'get',
    params: query
  })
}