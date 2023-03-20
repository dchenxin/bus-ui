import request from '@/utils/request'

// 查询季度考评列表
export function listQuarterlyReview(query) {
  return request({
    url: '/module/quarterlyReview/list',
    method: 'get',
    params: query
  })
}

// 查询季度考评详细
export function getQuarterlyReview(id) {
  return request({
    url: '/module/quarterlyReview/' + id,
    method: 'get'
  })
}


// 季度考评回退
export function evaluationGoBack(data) {
  return request({
    url: '/module/quarterlyReview/evaluationGoBack?id=' + data,
    method: 'get',
    //data: data
  })
}

// 季度考评回退(多条)
export function multiEvaluationGoBack(data) {
  return request({
    url: '/module/quarterlyReview/multiEvaluationGoBack',
    method: 'post',
    data: data
  })
}




// 新增季度考评
export function addQuarterlyReview(data) {
  return request({
    url: '/module/quarterlyReview',
    method: 'post',
    data: data
  })
}

// 修改季度考评
export function updateQuarterlyReview(data) {
  return request({
    url: '/module/quarterlyReview',
    method: 'put',
    data: data
  })
}

// 删除季度考评
export function delQuarterlyReview(id) {
  return request({
    url: '/module/quarterlyReview/' + id,
    method: 'delete'
  })
}

// 导出季度考评
export function exportQuarterlyReview(query) {
  return request({
    url: '/module/quarterlyReview/export',
    method: 'get',
    params: query
  })
}

// 导出季度考评 示范带
/*export function exportReviewCounty(query) {
  return request({
    url: '/module/quarterlyReview/exportCounty',
    method: 'get',
    params: query
  })
}*/

// 导出季度考评 试点村
/*export function exportReviewVillage(query) {
  return request({
    url: '/module/quarterlyReview/exportVillage',
    method: 'get',
    params: query
  })
}*/


// 导出考评员考评记录
export function exportReviewExaminer(query) {
  return request({
    url: '/module/quarterlyReview/exportReviewExaminer',
    method: 'get',
    params: query
  })
}

// 导出统计打分细则
export function exportDetailScore(query) {
  return request({
    url: '/module/quarterlyReview/exportDetailScore',
    method: 'get',
    params: query
  })
}

// 导出季度考评 统计
export function exportReviewStat(query) {
  return request({
    url: '/module/quarterlyReview/exportStat',
    method: 'get',
    params: query
  })
}

// 季度考评打分
export function setScore(id, score) {
  const data = {
    id,
    score
  };
  return request({
    url: '/module/quarterlyReview/setScore',
    method: 'put',
    data: data
  })
}

