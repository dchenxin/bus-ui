import request from '@/utils/request'

// 查询商城首页列表
export function listMallIndex(query) {
  return request({
    url: '/module/mallIndex/list',
    method: 'get',
    params: query
  })
}

// 查询商城首页详细
export function getMallIndex(id) {
  return request({
    url: '/module/mallIndex/' + id,
    method: 'get'
  })
}

// 新增商城首页
export function addMallIndex(data) {
  return request({
    url: '/module/mallIndex',
    method: 'post',
    data: data
  })
}

// 修改商城首页
export function updateMallIndex(data) {
  return request({
    url: '/module/mallIndex',
    method: 'put',
    data: data
  })
}

// 删除商城首页
export function delMallIndex(id) {
  return request({
    url: '/module/mallIndex/' + id,
    method: 'delete'
  })
}

// 导出商城首页
export function exportMallIndex(query) {
  return request({
    url: '/module/mallIndex/export',
    method: 'get',
    params: query
  })
}