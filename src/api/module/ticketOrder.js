import request from '@/utils/request'

// 查询门票订单列表
export function listTicketOrder(query) {
  return request({
    url: '/module/ticketOrder/list',
    method: 'get',
    params: query
  })
}

// 查询门票订单详细
export function getTicketOrder(id) {
  return request({
    url: '/module/ticketOrder/' + id,
    method: 'get'
  })
}

// 新增门票订单
export function addTicketOrder(data) {
  return request({
    url: '/module/ticketOrder',
    method: 'post',
    data: data
  })
}

// 修改门票订单
export function updateTicketOrder(data) {
  return request({
    url: '/module/ticketOrder',
    method: 'put',
    data: data
  })
}

// 删除门票订单
export function delTicketOrder(id) {
  return request({
    url: '/module/ticketOrder/' + id,
    method: 'delete'
  })
}

// 导出门票订单
export function exportTicketOrder(query) {
  return request({
    url: '/module/ticketOrder/export',
    method: 'get',
    params: query
  })
}