import request from '@/utils/request'

// 查询政策发布信息列表
export function listPolicy(query) {
  return request({
    url: '/module/policy/list',
    method: 'get',
    params: query
  })
}

// 查询政策发布信息详细
export function getPolicy(id) {
  return request({
    url: '/module/policy/' + id,
    method: 'get'
  })
}

// 新增政策发布信息
export function addPolicy(data) {
  return request({
    url: '/module/policy',
    method: 'post',
    data: data
  })
}

// 修改政策发布信息
export function updatePolicy(data) {
  return request({
    url: '/module/policy',
    method: 'put',
    data: data
  })
}

// 删除政策发布信息
export function delPolicy(id) {
  return request({
    url: '/module/policy/' + id,
    method: 'delete'
  })
}

// 导出政策发布信息
export function exportPolicy(query) {
  return request({
    url: '/module/policy/export',
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
    url: '/module/policy/changeStatus',
    method: 'put',
    data: data
  })
}
