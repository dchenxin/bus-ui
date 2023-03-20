import request from '@/utils/request'

// 查询农产品列表
export function listFarmProducts(query) {
  return request({
    url: '/module/farmProducts/list',
    method: 'get',
    params: query
  })
}

// 查询农产品详细
export function getFarmProducts(id) {
  return request({
    url: '/module/farmProducts/' + id,
    method: 'get'
  })
}

// 新增农产品
export function addFarmProducts(data) {
  return request({
    url: '/module/farmProducts',
    method: 'post',
    data: data
  })
}

// 修改农产品
export function updateFarmProducts(data) {
  return request({
    url: '/module/farmProducts',
    method: 'put',
    data: data
  })
}

// 删除农产品
export function delFarmProducts(id) {
  return request({
    url: '/module/farmProducts/' + id,
    method: 'delete'
  })
}

// 导出农产品
export function exportFarmProducts(query) {
  return request({
    url: '/module/farmProducts/export',
    method: 'get',
    params: query
  })
}

// 审核通过农产品
export function examineFarmProducts(id) {
  return request({
    url: '/module/farmProducts/examine/' + id,
    method: 'get',
  })
}

// 审核不通过 农产品
export function failFarmProducts(id) {
  return request({
    url: '/module/farmProducts/fail/' + id,
    method: 'get',
  })
}


// 上架农产品
export function putFarmProducts(id) {
  return request({
    url: '/module/farmProducts/put/' + id,
    method: 'get',
  })
}

// 下架农产品
export function offFarmProducts(id) {
  return request({
    url: '/module/farmProducts/off/' + id,
    method: 'get',
  })
}


// 强制下架农产品
export function forceOffFarmProducts(id) {
  return request({
    url: '/module/farmProducts/forceOff/' + id,
    method: 'get',
  })
}

// 审核失败后 重新提交审核
export function resubmitFarmProducts(id) {
  return request({
    url: '/module/farmProducts/resubmit/' + id,
    method: 'get',
  })
}
