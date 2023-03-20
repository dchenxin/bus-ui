import request from '@/utils/request'

// 查询资讯样例列表
export function listFeedbackDemo(query) {
  return request({
    url: '/module/feedbackDemo/list',
    method: 'get',
    params: query
  })
}

// 查询资讯样例详细
export function getFeedbackDemo(id) {
  return request({
    url: '/module/feedbackDemo/' + id,
    method: 'get'
  })
}

// 新增资讯样例
export function addFeedbackDemo(data) {
  return request({
    url: '/module/feedbackDemo',
    method: 'post',
    data: data
  })
}

// 修改资讯样例
export function updateFeedbackDemo(data) {
  return request({
    url: '/module/feedbackDemo',
    method: 'put',
    data: data
  })
}

// 删除资讯样例
export function delFeedbackDemo(id) {
  return request({
    url: '/module/feedbackDemo/' + id,
    method: 'delete'
  })
}

// 导出资讯样例
export function exportFeedbackDemo(query) {
  return request({
    url: '/module/feedbackDemo/export',
    method: 'get',
    params: query
  })
}

// 资讯状态修改
export function changeNewStatus(id, state) {
  const data = {
    id,
    state
  };
  return request({
    url: '/module/feedbackDemo/changeStatus',
    method: 'put',
    data: data
  })
}
