import request from '@/utils/request'

// 查询商城商品列表
export function listMallProduct(query) {
  return request({
    url: '/module/mallProduct/list',
    method: 'get',
    params: query
  })
}

// 查询商城商品详细
export function getMallProduct(id) {
  return request({
    url: '/module/mallProduct/' + id,
    method: 'get'
  })
}

// 新增商城商品
export function addMallProduct(data) {
  return request({
    url: '/module/mallProduct',
    method: 'post',
    data: data
  })
}

// 修改商城商品
export function updateMallProduct(data) {
  return request({
    url: '/module/mallProduct',
    method: 'put',
    data: data
  })
}

// 删除商城商品
export function delMallProduct(id) {
  return request({
    url: '/module/mallProduct/' + id,
    method: 'delete'
  })
}

// 导出商城商品
export function exportMallProduct(query) {
  return request({
    url: '/module/mallProduct/export',
    method: 'get',
    params: query
  })
}

// 审核通过商品
export function examineMallProduct(id) {
  return request({
    url: '/module/mallProduct/examine/' + id,
    method: 'get',
  })
}

// 审核不通过 商品
export function failMallProduct(id) {
  return request({
    url: '/module/mallProduct/fail/' + id,
    method: 'get',
  })
}

// 上架商品
export function putMallProduct(id) {
  return request({
    url: '/module/mallProduct/put/' + id,
    method: 'get',
  })
}

// 下架商品
export function offMallProduct(id) {
  return request({
    url: '/module/mallProduct/off/' + id,
    method: 'get',
  })
}

// 强制下架商品
export function forceOffMallProduct(id) {
  return request({
    url: '/module/mallProduct/forceOff/' + id,
    method: 'get',
  })
}

// 审核失败后 重新提交审核
export function resubmitMallProduct(id) {
  return request({
    url: '/module/mallProduct/resubmit/' + id,
    method: 'get',
  })
}
