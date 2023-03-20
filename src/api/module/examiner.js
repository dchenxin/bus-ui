import request from '@/utils/request'

// 查询考评人列表
export function listExaminer(query) {
  return request({
    url: '/module/examiner/list',
    method: 'get',
    params: query
  })
}

// 查询考评人详细
export function getExaminer(id) {
  return request({
    url: '/module/examiner/' + id,
    method: 'get'
  })
}

// 新增考评人
export function addExaminer(data) {
  return request({
    url: '/module/examiner',
    method: 'post',
    data: data
  })
}

// 修改考评人
export function updateExaminer(data) {
  return request({
    url: '/module/examiner',
    method: 'put',
    data: data
  })
}

// 删除考评人
export function delExaminer(id) {
  return request({
    url: '/module/examiner/' + id,
    method: 'delete'
  })
}

// 导出考评人
export function exportExaminer(query) {
  return request({
    url: '/module/examiner/export',
    method: 'get',
    params: query
  })
}

// 查询考评人详细
export function getLeisureExaminers() {
  return request({
    url: '/module/examiner/leisure',
    method: 'get'
  })
}

// 查询考评人列表
export function allExaminer(query) {
  return request({
    url: '/module/examiner/all',
    method: 'get',
    params: query
  })
}
