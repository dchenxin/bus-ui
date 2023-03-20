import request from '@/utils/request'

// 查询考评项列表
export function listQuarterlyReviewItem(query) {
  return request({
    url: '/module/quarterlyReviewItem/list',
    method: 'get',
    params: query
  })
}

// 查询考评项详细
export function getQuarterlyReviewItem(id) {
  return request({
    url: '/module/quarterlyReviewItem/' + id,
    method: 'get'
  })
}

// 新增考评项
export function addQuarterlyReviewItem(data) {
  return request({
    url: '/module/quarterlyReviewItem',
    method: 'post',
    data: data
  })
}

// 修改考评项
export function updateQuarterlyReviewItem(data) {
  return request({
    url: '/module/quarterlyReviewItem',
    method: 'put',
    data: data
  })
}

// 删除考评项
export function delQuarterlyReviewItem(id) {
  return request({
    url: '/module/quarterlyReviewItem/' + id,
    method: 'delete'
  })
}

// 导出考评项
export function exportQuarterlyReviewItem(query) {
  return request({
    url: '/module/quarterlyReviewItem/export',
    method: 'get',
    params: query
  })
}