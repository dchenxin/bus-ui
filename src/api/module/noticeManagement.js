import request from '@/utils/request'

// 查询公告管理列表
export function listNoticeManagement(query) {
  return request({
    url: '/module/noticeManagement/list',
    method: 'get',
    params: query
  })
}

// 查询公告管理详细
export function getNoticeManagement(id) {
  return request({
    url: '/module/noticeManagement/' + id,
    method: 'get'
  })
}

// 新增公告管理
export function addNoticeManagement(data) {
  return request({
    url: '/module/noticeManagement',
    method: 'post',
    data: data
  })
}

// 修改公告管理
export function updateNoticeManagement(data) {
  return request({
    url: '/module/noticeManagement',
    method: 'put',
    data: data
  })
}

// 删除公告管理
export function delNoticeManagement(id) {
  return request({
    url: '/module/noticeManagement/' + id,
    method: 'delete'
  })
}

// 导出公告管理
export function exportNoticeManagement(query) {
  return request({
    url: '/module/noticeManagement/export',
    method: 'get',
    params: query
  })
}