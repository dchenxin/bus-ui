import request from '@/utils/request'

// 查询民情反馈列表
export function listPubilcFeedback(query) {
  return request({
    url: '/module/pubilcFeedback/list',
    method: 'get',
    params: query
  })
}

// 查询民情反馈详细
export function getPubilcFeedback(id) {
  return request({
    url: '/module/pubilcFeedback/' + id,
    method: 'get'
  })
}

// 新增民情反馈
export function addPubilcFeedback(data) {
  return request({
    url: '/module/pubilcFeedback',
    method: 'post',
    data: data
  })
}

// 修改民情反馈
export function updatePubilcFeedback(data) {
  return request({
    url: '/module/pubilcFeedback',
    method: 'put',
    data: data
  })
}

// 删除民情反馈
export function delPubilcFeedback(id) {
  return request({
    url: '/module/pubilcFeedback/' + id,
    method: 'delete'
  })
}

// 导出民情反馈
export function exportPubilcFeedback(query) {
  return request({
    url: '/module/pubilcFeedback/export',
    method: 'get',
    params: query
  })
}

// 审核、上架民情反馈
export function putFeedback(id) {
  return request({
    url: '/module/pubilcFeedback/put/' + id,
    method: 'get',
  })
}

// 下架民情反馈
export function offFeedback(id) {
  return request({
    url: '/module/pubilcFeedback/off/' + id,
    method: 'get',
  })
}

// 季度考评回复
export function setReply(id, returnContent) {
  const data = {
    id,
    returnContent
  };
  return request({
    url: '/module/pubilcFeedback/reply',
    method: 'put',
    data: data
  })
}
