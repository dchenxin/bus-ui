import request from '@/utils/request'

// 查询项目监督信息列表
export function listProjectSupervision(query) {
  return request({
    url: '/module/projectSupervision/list',
    method: 'get',
    params: query
  })
}

// 查询项目监督信息详细
export function getProjectSupervision(id) {
  return request({
    url: '/module/projectSupervision/' + id,
    method: 'get'
  })
}

// 新增项目监督信息
export function addProjectSupervision(data) {
  return request({
    url: '/module/projectSupervision',
    method: 'post',
    data: data
  })
}

// 修改项目监督信息
export function updateProjectSupervision(data) {
  return request({
    url: '/module/projectSupervision',
    method: 'put',
    data: data
  })
}

// 删除项目监督信息
export function delProjectSupervision(id) {
  return request({
    url: '/module/projectSupervision/' + id,
    method: 'delete'
  })
}

// 导出项目监督信息
export function exportProjectSupervision(query) {
  return request({
    url: '/module/projectSupervision/export',
    method: 'get',
    params: query
  })
}

// 警告一次
export function warn(id) {
  return request({
    url: '/module/projectSupervision/warn/' + id,
    method: 'get'
  })
}

// 取消警告
export function cancelWarn(id) {
  return request({
    url: '/module/projectSupervision/cancelWarn/' + id,
    method: 'get'
  })
}

// 资讯状态修改
export function changeNewStatus(id, state) {
  const data = {
    id,
    state
  };
  return request({
    url: '/module/projectSupervision/changeStatus',
    method: 'put',
    data: data
  })
}
