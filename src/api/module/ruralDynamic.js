import request from '@/utils/request'

// 查询乡村动态列表
export function listRuralDynamic(query) {
  return request({
    url: '/module/ruralDynamic/list',
    method: 'get',
    params: query
  })
}

// 查询乡村动态详细
export function getRuralDynamic(id) {
  return request({
    url: '/module/ruralDynamic/' + id,
    method: 'get'
  })
}

// 新增乡村动态
export function addRuralDynamic(data) {
  return request({
    url: '/module/ruralDynamic',
    method: 'post',
    data: data
  })
}

// 修改乡村动态
export function updateRuralDynamic(data) {
  return request({
    url: '/module/ruralDynamic',
    method: 'put',
    data: data
  })
}

// 删除乡村动态
export function delRuralDynamic(id) {
  return request({
    url: '/module/ruralDynamic/' + id,
    method: 'delete'
  })
}

// 导出乡村动态
export function exportRuralDynamic(query) {
  return request({
    url: '/module/ruralDynamic/export',
    method: 'get',
    params: query
  })
}

// 上架资讯
export function putInformation(id) {
  return request({
    url: '/module/ruralDynamic/put/' + id,
    method: 'get',
  })
}

// 下架资讯
export function offInformation(id) {
  return request({
    url: '/module/ruralDynamic/off/' + id,
    method: 'get',
  })
}

// 用户状态修改
export function changeNewStatus(id, state) {
  const data = {
    id,
    state
  };
  return request({
    url: '/module/ruralDynamic/changeStatus',
    method: 'put',
    data: data
  })
}
