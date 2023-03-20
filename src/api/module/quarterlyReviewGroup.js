import request from '@/utils/request'

// 查询考评任务列表
export function listQuarterlyReviewGroup(query) {
  return request({
    url: '/module/quarterlyReviewGroup/list',
    method: 'get',
    params: query
  })
}

// 查询考评任务详细
export function getQuarterlyReviewGroup(id) {
  return request({
    url: '/module/quarterlyReviewGroup/' + id,
    method: 'get'
  })
}

// 新增考评任务
export function addQuarterlyReviewGroup(data) {
  return request({
    url: '/module/quarterlyReviewGroup',
    method: 'post',
    data: data
  })
}

// 修改考评任务
export function updateQuarterlyReviewGroup(data) {
  return request({
    url: '/module/quarterlyReviewGroup',
    method: 'put',
    data: data
  })
}

// 删除考评任务
export function delQuarterlyReviewGroup(id) {
  return request({
    url: '/module/quarterlyReviewGroup/' + id,
    method: 'delete'
  })
}

// 导出考评任务
export function exportQuarterlyReviewGroup(query) {
  return request({
    url: '/module/quarterlyReviewGroup/export',
    method: 'get',
    params: query
  })
}


// 重置考评任务总分
export function resetTotalScore(id) {
  return request({
    url: '/module/quarterlyReviewGroup/resetTotalScore/' + id,
    method: 'post'
  })
}
