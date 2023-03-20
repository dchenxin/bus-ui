import request from '@/utils/request'

// 查询商城分类列表
export function listMallSort(query) {
  return request({
    url: '/module/mallSort/list',
    method: 'get',
    params: query
  })
}

// 查询商城分类详细
export function getMallSort(id) {
  return request({
    url: '/module/mallSort/' + id,
    method: 'get'
  })
}

// 新增商城分类
export function addMallSort(data) {
  return request({
    url: '/module/mallSort',
    method: 'post',
    data: data
  })
}

// 修改商城分类
export function updateMallSort(data) {
  return request({
    url: '/module/mallSort',
    method: 'put',
    data: data
  })
}

// 删除商城分类
export function delMallSort(id) {
  return request({
    url: '/module/mallSort/' + id,
    method: 'delete'
  })
}

// 导出商城分类
export function exportMallSort(query) {
  return request({
    url: '/module/mallSort/export',
    method: 'get',
    params: query
  })
}

// 导出商城分类
export function test() {
  return request({
    url: '/module/mallSort/test',
    method: 'get',
  })
}
