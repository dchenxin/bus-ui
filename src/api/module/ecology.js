import request from '@/utils/request'

// 查询生态银行信息列表
export function listEcology(query) {
  return request({
    url: '/module/ecology/list',
    method: 'get',
    params: query
  })
}

// 查询生态银行信息详细
export function getEcology(id) {
  return request({
    url: '/module/ecology/' + id,
    method: 'get'
  })
}

// 新增生态银行信息
export function addEcology(data) {
  return request({
    url: '/module/ecology',
    method: 'post',
    data: data
  })
}

// 修改生态银行信息
export function updateEcology(data) {
  return request({
    url: '/module/ecology',
    method: 'put',
    data: data
  })
}

// 删除生态银行信息
export function delEcology(id) {
  return request({
    url: '/module/ecology/' + id,
    method: 'delete'
  })
}

// 导出生态银行信息
export function exportEcology(query) {
  return request({
    url: '/module/ecology/export',
    method: 'get',
    params: query
  })
}

// 资讯状态修改
export function changeNewStatus(id, state) {
  const data = {
    id,
    state
  };
  return request({
    url: '/module/ecology/changeStatus',
    method: 'put',
    data: data
  })
}
