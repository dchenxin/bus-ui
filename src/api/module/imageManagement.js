import request from '@/utils/request'

// 查询图片管理列表
export function listImageManagement(query) {
  return request({
    url: '/module/imageManagement/list',
    method: 'get',
    params: query
  })
}

// 查询图片管理详细
export function getImageManagement(id) {
  return request({
    url: '/module/imageManagement/' + id,
    method: 'get'
  })
}

// 新增图片管理
export function addImageManagement(data) {
  return request({
    url: '/module/imageManagement',
    method: 'post',
    data: data
  })
}

// 修改图片管理
export function updateImageManagement(data) {
  return request({
    url: '/module/imageManagement',
    method: 'put',
    data: data
  })
}

// 删除图片管理
export function delImageManagement(id) {
  return request({
    url: '/module/imageManagement/' + id,
    method: 'delete'
  })
}

// 导出图片管理
export function exportImageManagement(query) {
  return request({
    url: '/module/imageManagement/export',
    method: 'get',
    params: query
  })
}