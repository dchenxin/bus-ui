import request from '@/utils/request'

// 查询网上商城列表
export function listOnlineMail(query) {
  return request({
    url: '/module/onlineMail/list',
    method: 'get',
    params: query
  })
}

// 查询网上商城详细
export function getOnlineMail(id) {
  return request({
    url: '/module/onlineMail/' + id,
    method: 'get'
  })
}

// 新增网上商城
export function addOnlineMail(data) {
  return request({
    url: '/module/onlineMail',
    method: 'post',
    data: data
  })
}

// 修改网上商城
export function updateOnlineMail(data) {
  return request({
    url: '/module/onlineMail',
    method: 'put',
    data: data
  })
}

// 删除网上商城
export function delOnlineMail(id) {
  return request({
    url: '/module/onlineMail/' + id,
    method: 'delete'
  })
}

// 导出网上商城
export function exportOnlineMail(query) {
  return request({
    url: '/module/onlineMail/export',
    method: 'get',
    params: query
  })
}

// 审核通过商品
export function examineOnlineMail(id) {
  return request({
    url: '/module/onlineMail/examine/' + id,
    method: 'get',
  })
}

// 审核不通过 商品
export function failOnlineMail(id) {
  return request({
    url: '/module/onlineMail/fail/' + id,
    method: 'get',
  })
}

// 上架商品
export function putOnlineMail(id) {
  return request({
    url: '/module/onlineMail/put/' + id,
    method: 'get',
  })
}

// 下架商品
export function offOnlineMail(id) {
  return request({
    url: '/module/onlineMail/off/' + id,
    method: 'get',
  })
}

// 强制下架商品
export function forceOffOnlineMail(id) {
  return request({
    url: '/module/onlineMail/forceOff/' + id,
    method: 'get',
  })
}

// 审核失败后 重新提交审核
export function resubmitOnlineMail(id) {
  return request({
    url: '/module/onlineMail/resubmit/' + id,
    method: 'get',
  })
}
