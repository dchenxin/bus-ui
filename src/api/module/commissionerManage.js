import request from '@/utils/request'

// 查询特派员人员管理列表
export function listCommissionerManage(query) {
  return request({
    url: '/module/commissionerManage/list',
    method: 'get',
    params: query
  })
}

// 查询特派员人员管理列表
export function listCommissionerManageAll(query) {
  return request({
    url: '/module/commissionerManage/all',
    method: 'get',
    params: query
  })
}

// 查询特派员人员管理详细
export function getCommissionerManage(id) {
  return request({
    url: '/module/commissionerManage/' + id,
    method: 'get'
  })
}

// 新增特派员人员管理
export function addCommissionerManage(data) {
  return request({
    url: '/module/commissionerManage',
    method: 'post',
    data: data
  })
}

// 修改特派员人员管理
export function updateCommissionerManage(data) {
  return request({
    url: '/module/commissionerManage',
    method: 'put',
    data: data
  })
}

// 删除特派员人员管理
export function delCommissionerManage(id) {
  return request({
    url: '/module/commissionerManage/' + id,
    method: 'delete'
  })
}

// 导出特派员人员管理
export function exportCommissionerManage(query) {
  return request({
    url: '/module/commissionerManage/export',
    method: 'get',
    params: query
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/module/commissionerManage/importTemplate',
    method: 'get'
  })
}
