import request from '@/utils/request'

// 查询产业振兴列表
export function listVillage(query) {
  return request({
    url: '/module/village/list',
    method: 'get',
    params: query
  })
}
// 查询人才振兴列表
export function villagelist(query) {
  return request({
    url: '/module/village/villagelist',
    method: 'get',
    params: query
  })
}
// 查询文化振兴列表
export function enterprislist(query) {
  return request({
    url: '/module/village/enterprislist',
    method: 'get',
    params: query
  })
}
// 查询生态振兴列表
export function managelist(query) {
  return request({
    url: '/module/village/managelist',
    method: 'get',
    params: query
  })
}

// 查询组织振兴列表
export function organizeList(query) {
  return request({
    url: '/module/village/organizeList',
    method: 'get',
    params: query
  })
}
// 查询信息详细
export function getVillage(id) {
  return request({
    url: '/module/village/' + id,
    method: 'get'
  })
}

// 新增产业振兴信息
export function addVillage(data) {
  return request({
    url: '/module/village',
    method: 'post',
    data: data
  })
}

// 新增组织振兴信息
export function organizeAdd(data) {
  return request({
    url: '/module/village/organizeAdd',
    method: 'post',
    data: data
  })
}
// 新增人才振兴信息
export function villageAdd(data) {
  return request({
    url: '/module/village/villageAdd',
    method: 'post',
    data: data
  })
}
// 新增文化振兴信息
export function enterprisAdd(data) {
  return request({
    url: '/module/village/enterprisAdd',
    method: 'post',
    data: data
  })
}
// 新增生态振兴信息
export function manageAdd(data) {
  return request({
    url: '/module/village/manageAdd',
    method: 'post',
    data: data
  })
}

// 修改信息
export function updateVillage(data) {
  return request({
    url: '/module/village',
    method: 'put',
    data: data
  })
}

// 删除信息
export function delVillage(id) {
  return request({
    url: '/module/village/' + id,
    method: 'delete'
  })
}
// 删除上传图片
export function delImgUrl(fileName) {
  return request({
    url: '/module/village/delFile/' + fileName,
    method: 'get'
  })
}
// 导出产业振兴信息
export function exportVillage(query) {
  return request({
    url: '/module/village/export',
    method: 'get',
    params: query
  })
}
// 导出生态振兴信息
export function ecologyExport(query) {
  return request({
    url: '/module/village/ecologyExport',
    method: 'get',
    params: query
  })
}// 导出组织振兴信息
export function organizeExport(query) {
  return request({
    url: '/module/village/organizeExport',
    method: 'get',
    params: query
  })
}
// 导出文化振兴信息
export function cultureExport(query) {
  return request({
    url: '/module/village/cultureExport',
    method: 'get',
    params: query
  })
}

// 导出人才振兴信息
export function talentExport(query) {
  return request({
    url: '/module/village/talentExport',
    method: 'get',
    params: query
  })
}

// 审核、上架农产品
export function putVillages(id) {
  return request({
    url: '/module/village/put/' + id,
    method: 'get',
  })
}
// 下架
export function offVillages(id) {
  return request({
    url: '/module/village/off/' + id,
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
    url: '/module/village/changeStatus',
    method: 'put',
    data: data
  })
}
