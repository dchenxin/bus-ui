import request from '@/utils/request'

// 查询评分明细列表
export function listQuarterlyReviewScore(query) {
  return request({
    url: '/module/quarterlyReviewScore/list',
    method: 'get',
    params: query
  })
}

// 查询保存表中的数据（保存表）
export function listQuarterlyReviewScoreSave(query) {
  return request({
    url: '/module/appSavedata/list',
    method: 'get',
    params: query
  })
}

// 查询评分明细详细
export function getQuarterlyReviewScore(id) {
  return request({
    url: '/module/quarterlyReviewScore/' + id,
    method: 'get'
  })
}

// 查询评分明细详细（保存表）
export function getQuarterlyReviewScoreSave(guid) {
  return request({
    url: '/module/appSavedata/' + guid,
    method: 'get'
  })
}

// 修改评分明细（保存表）
export function updateQuarterlyReviewScoreSave(data) {
  return request({
    url: '/module/appSavedata',
    method: 'put',
    //baseURL:'http://27.150.182.183:9219',
    data: data
  })
}

// 新增评分明细（保存表）
export function createSaveData(data) {
  return request({
    url: '/module/appSavedata/createData?reviewId='+data,
    method: 'post',
    //data: data
  })
}

// 将保存表数据插入至考评分数表，并更新考评总表的分数
export function SaveQuarterlyReview(data) {
  return request({
    url: '/module/appSavedata/SaveQuarterlyReview?reviewId='+data,
    method: 'get',
    //data: data
  })
}

// 新增评分明细
export function addQuarterlyReviewScore(data) {
  return request({
    url: '/module/quarterlyReviewScore',
    method: 'post',
    data: data
  })
}

// 修改评分明细
export function updateQuarterlyReviewScore(data) {
  return request({
    url: '/module/quarterlyReviewScore',
    method: 'put',
    data: data
  })
}

// 删除评分明细
export function delQuarterlyReviewScore(id) {
  return request({
    url: '/module/quarterlyReviewScore/' + id,
    method: 'delete'
  })
}

// 导出评分明细
export function exportQuarterlyReviewScore(query) {
  return request({
    url: '/module/quarterlyReviewScore/export',
    method: 'get',
    params: query
  })
}
