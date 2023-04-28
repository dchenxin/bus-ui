import request from '@/utils/request'

// 查询趟检员信息列表
export function listInspector(query) {
  return request({
    url: '/ruoyi/inspector/list',
    method: 'get',
    params: query
  })
}

// 查询趟检员信息详细
export function getInspector(id) {
  return request({
    url: '/ruoyi/inspector/' + id,
    method: 'get'
  })
}

// 新增趟检员信息
export function addInspector(data) {
  return request({
    url: '/ruoyi/inspector',
    method: 'post',
    data: data
  })
}

// 修改趟检员信息
export function updateInspector(data) {
  return request({
    url: '/ruoyi/inspector',
    method: 'put',
    data: data
  })
}

// 删除趟检员信息
export function delInspector(id) {
  return request({
    url: '/ruoyi/inspector/' + id,
    method: 'delete'
  })
}

// 导出趟检员信息
export function exportInspector(query) {
  return request({
    url: '/ruoyi/inspector/export',
    method: 'get',
    params: query
  })
}