import request from '@/utils/request'

// 查询任务考评项关联列表
export function listReviewGrpItemRela(query) {
  return request({
    url: '/module/reviewGrpItemRela/list',
    method: 'get',
    params: query
  })
}

// 查询任务考评项关联详细
export function getReviewGrpItemRela(id) {
  return request({
    url: '/module/reviewGrpItemRela/' + id,
    method: 'get'
  })
}

// 新增任务考评项关联
export function addReviewGrpItemRela(data) {
  return request({
    url: '/module/reviewGrpItemRela',
    method: 'post',
    data: data
  })
}

// 修改任务考评项关联
export function updateReviewGrpItemRela(data) {
  return request({
    url: '/module/reviewGrpItemRela',
    method: 'put',
    data: data
  })
}

// 删除任务考评项关联
export function delReviewGrpItemRela(id) {
  return request({
    url: '/module/reviewGrpItemRela/' + id,
    method: 'delete'
  })
}

// 导出任务考评项关联
export function exportReviewGrpItemRela(query) {
  return request({
    url: '/module/reviewGrpItemRela/export',
    method: 'get',
    params: query
  })
}
// 根据 id修改考评项分数
export function setScoreById(id, maxScore) {
  const data = {
    id,
    maxScore
  };
  return request({
    url: '/module/reviewGrpItemRela/setScore',
    method: 'post',
    data: data
  })
}
