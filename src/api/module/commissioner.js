import request from '@/utils/request'
import id from "element-ui/src/locale/lang/id";

// 查询科技特派员列表
export function listCommissioner(query) {
  return request({
    url: '/module/commissioner/list',
    method: 'get',
    params: query
  })
}

// 查询科技特派员详细
export function getCommissioner(id) {
  return request({
    url: '/module/commissioner/' + id,
    method: 'get'
  })
}
// 无权限查询用户列表
export function listUser() {
  return request({
    url: '/module/commissioner/userList',
    method: 'get',
  })
}

// 新增科技特派员
export function addCommissioner(data) {
  return request({
    url: '/module/commissioner',
    method: 'post',
    data: data
  })
}

// 修改科技特派员
export function updateCommissioner(data) {
  return request({
    url: '/module/commissioner',
    method: 'put',
    data: data
  })
}

// 删除科技特派员
export function delCommissioner(id) {
  return request({
    url: '/module/commissioner/' + id,
    method: 'delete'
  })
}
// 取消申请科技特派员
export function cancelOne(id) {
  return request({
    url: '/module/commissioner/cancelOne/' + id,
    method: 'get'
  })
}
// 审核指派人员
export function ExamineOne(id,commissionerManageId) {
  const data = {
    id,
    commissionerManageId
  }
  return request({
    url: '/module/commissioner/ExamineOne',
    method: 'put',
    data: data
  })
}
// 重新指派审核指派人员
export function restartExamineOne(id,commissionerManageId) {
  const data = {
    id,
    commissionerManageId
  }
  return request({
    url: '/module/commissioner/restartExamineOne',
    method: 'put',
    data: data
  })
}
// 审核失败指派人员
export function ExamineFail(data) {
  return request({
    url: '/module/commissioner/ExamineFail',
    method: 'put',
    data: data
  })
}

// 导出科技特派员
export function exportCommissioner(query) {
  return request({
    url: '/module/commissioner/export',
    method: 'get',
    params: query
  })
}
// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/module/commissioner/importTemplate',
    method: 'get'
  })
}
// 查询科技特派员列表
export function listfree() {
  return request({
    url: '/module/commissioner/listfree',
    method: 'get',

  })
}
