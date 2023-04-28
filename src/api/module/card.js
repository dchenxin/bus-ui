import request from '@/utils/request'

// 查询卡号信息列表
export function listCard(query) {
  return request({
    url: '/ruoyi/card/list',
    method: 'get',
    params: query
  })
}

// 查询卡号信息详细
export function getCard(id) {
  return request({
    url: '/ruoyi/card/' + id,
    method: 'get'
  })
}

// 新增卡号信息
export function addCard(data) {
  return request({
    url: '/ruoyi/card',
    method: 'post',
    data: data
  })
}

// 修改卡号信息
export function updateCard(data) {
  return request({
    url: '/ruoyi/card',
    method: 'put',
    data: data
  })
}

// 删除卡号信息
export function delCard(id) {
  return request({
    url: '/ruoyi/card/' + id,
    method: 'delete'
  })
}

// 导出卡号信息
export function exportCard(query) {
  return request({
    url: '/ruoyi/card/export',
    method: 'get',
    params: query
  })
}