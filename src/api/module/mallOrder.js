import request from '@/utils/request'

// 查询商城订单列表
export function listMallOrder(query) {
  return request({
    url: '/module/mallOrder/list',
    method: 'get',
    params: query
  })
}

// 查询商城订单详细
export function getMallOrder(id) {
  return request({
    url: '/module/mallOrder/' + id,
    method: 'get'
  })
}

// 新增商城订单
export function addMallOrder(data) {
  return request({
    url: '/module/mallOrder',
    method: 'post',
    data: data
  })
}

// 修改商城订单
export function updateMallOrder(data) {
  return request({
    url: '/module/mallOrder',
    method: 'put',
    data: data
  })
}

// 删除商城订单
export function delMallOrder(id) {
  return request({
    url: '/module/mallOrder/' + id,
    method: 'delete'
  })
}

// 导出商城订单
export function exportMallOrder(query) {
  return request({
    url: '/module/mallOrder/export',
    method: 'get',
    params: query
  })
}

// 生成订单
export function addOrder(productId, quantity, totalAmount) {
  const data = {
    productId,
    quantity,
    totalAmount
  };
  return request({
    url: '/module/mallOrder/addOrder',
    method: 'post',
    data: data
  })
}

// 退款申请
export function refund(id) {
  const data = {
    id,
  };
  return request({
    url: '/module/mallOrder/refund',
    method: 'post',
    data: data
  })
}

// 退款审核通过
export function examineOk(id) {
  const data = {
    id,
  };
  return request({
    url: '/module/mallOrder/examineOk',
    method: 'post',
    data: data
  })
}

// 发货
export function sendOut(id) {
  const data = {
    id,
  };
  return request({
    url: '/module/mallOrder/sendOut',
    method: 'post',
    data: data
  })
}

// 确认收货
export function confirmReceipt(id) {
  const data = {
    id,
  };
  return request({
    url: '/module/mallOrder/confirmReceipt',
    method: 'post',
    data: data
  })
}
