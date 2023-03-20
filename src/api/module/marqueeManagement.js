import request from '@/utils/request'

// 查询跑马灯管理列表
export function listMarqueeManagement(query) {
  return request({
    url: '/module/marqueeManagement/list',
    method: 'get',
    params: query
  })
}

// 查询跑马灯管理详细
export function getMarqueeManagement(id) {
  return request({
    url: '/module/marqueeManagement/' + id,
    method: 'get'
  })
}

// 新增跑马灯管理
export function addMarqueeManagement(data) {
  return request({
    url: '/module/marqueeManagement',
    method: 'post',
    data: data
  })
}

// 修改跑马灯管理
export function updateMarqueeManagement(data) {
  return request({
    url: '/module/marqueeManagement',
    method: 'put',
    data: data
  })
}

// 删除跑马灯管理
export function delMarqueeManagement(id) {
  return request({
    url: '/module/marqueeManagement/' + id,
    method: 'delete'
  })
}

// 导出跑马灯管理
export function exportMarqueeManagement(query) {
  return request({
    url: '/module/marqueeManagement/export',
    method: 'get',
    params: query
  })
}