import request from '@/utils/request'

// 查询景区门票信息列表
export function listTicket(query) {
  return request({
    url: '/module/ticket/list',
    method: 'get',
    params: query
  })
}

// 查询景区门票信息详细
export function getTicket(id) {
  return request({
    url: '/module/ticket/' + id,
    method: 'get'
  })
}

// 新增景区门票信息
export function addTicket(data) {
  return request({
    url: '/module/ticket',
    method: 'post',
    data: data
  })
}

// 修改景区门票信息
export function updateTicket(data) {
  return request({
    url: '/module/ticket',
    method: 'put',
    data: data
  })
}

// 删除景区门票信息
export function delTicket(id) {
  return request({
    url: '/module/ticket/' + id,
    method: 'delete'
  })
}

// 导出景区门票信息
export function exportTicket(query) {
  return request({
    url: '/module/ticket/export',
    method: 'get',
    params: query
  })
}