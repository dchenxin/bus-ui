import request from '@/utils/request'

// 查询终端信息列表
export function listTerminal(query) {
  return request({
    url: '/ruoyi/terminal/list',
    method: 'get',
    params: query
  })
}

// 查询终端信息详细
export function getTerminal(id) {
  return request({
    url: '/ruoyi/terminal/' + id,
    method: 'get'
  })
}

// 新增终端信息
export function addTerminal(data) {
  return request({
    url: '/ruoyi/terminal',
    method: 'post',
    data: data
  })
}

// 修改终端信息
export function updateTerminal(data) {
  return request({
    url: '/ruoyi/terminal',
    method: 'put',
    data: data
  })
}

// 删除终端信息
export function delTerminal(id) {
  return request({
    url: '/ruoyi/terminal/' + id,
    method: 'delete'
  })
}

// 导出终端信息
export function exportTerminal(query) {
  return request({
    url: '/ruoyi/terminal/export',
    method: 'get',
    params: query
  })
}