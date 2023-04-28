import request from '@/utils/request'

// 查询线路信息列表
export function listLine(query) {
  return request({
    url: '/ruoyi/line/list',
    method: 'get',
    params: query
  })
}

// 查询线路信息详细
export function getLine(id) {
  return request({
    url: '/ruoyi/line/' + id,
    method: 'get'
  })
}

// 新增线路信息
export function addLine(data) {
  return request({
    url: '/ruoyi/line',
    method: 'post',
    data: data
  })
}

// 修改线路信息
export function updateLine(data) {
  return request({
    url: '/ruoyi/line',
    method: 'put',
    data: data
  })
}

// 删除线路信息
export function delLine(id) {
  return request({
    url: '/ruoyi/line/' + id,
    method: 'delete'
  })
}

// 导出线路信息
export function exportLine(query) {
  return request({
    url: '/ruoyi/line/export',
    method: 'get',
    params: query
  })
}