import request from '@/utils/request'

// 查询乡村信息列表
export function listRuralInfo(query) {
  return request({
    url: '/module/ruralInfo/list',
    method: 'get',
    params: query
  })
}

// 查询乡村信息详细
export function getRuralInfo(id) {
  return request({
    url: '/module/ruralInfo/' + id,
    method: 'get'
  })
}

// 新增乡村信息
export function addRuralInfo(data) {
  return request({
    url: '/module/ruralInfo',
    method: 'post',
    data: data
  })
}

// 修改乡村信息
export function updateRuralInfo(data) {
  return request({
    url: '/module/ruralInfo',
    method: 'put',
    data: data
  })
}

// 删除乡村信息
export function delRuralInfo(id) {
  return request({
    url: '/module/ruralInfo/' + id,
    method: 'delete'
  })
}

// 导出乡村信息
export function exportRuralInfo(query) {
  return request({
    url: '/module/ruralInfo/export',
    method: 'get',
    params: query
  })
}

// 查询乡村信息目录
export function optionRuralInfo() {
  return request({
    url: '/module/ruralInfo/options',
    method: 'get',
  })
}

// 查询乡村信息目录 根据用户类型
export function optionRuralByUserType(userType) {
  const data = {
    userType
  };
  return request({
    url: '/module/ruralInfo/options',
    method: 'post',
    data: data
  })
}

// 查询乡村信息目录 根据用户类型
export function optionsByType(parentLevel) {
  const data = {
    parentLevel
  };
  return request({
    url: '/module/ruralInfo/optionsByType',
    method: 'post',
    data: data
  })
}

// 获取当前项的校验码数组
export function getCodeArray(ruralId) {
  return request({
    url: '/module/ruralInfo/codeArray/' + ruralId,
    method: 'get',
  })
}

// 获取村中所有的职责人员
export function getPersons(ruralId) {
  return request({
    url: '/module/ruralInfo/persons/' + ruralId,
    method: 'get',
  })
}

// 查询乡村信息列表
export function listRural() {
  return request({
    url: '/module/ruralInfo/all',
    method: 'get',
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/module/ruralInfo/importTemplate',
    method: 'get'
  })
}


// reset 校验码
export function resetRuralInfo(id) {
  return request({
    url: '/module/ruralInfo/reset/' + id,
    method: 'get'
  })
}

// 查询拼接乡村
export function listAllRural() {
  return request({
    url: '/module/ruralInfo/listAllRural',
    method: 'get',
  })
}

// 更新乡村层级
export function updateRela() {
  return request({
    url: '/module/ruralInfo/updateRela',
    method: 'get',
  })
}

// 查询菜单下拉树结构
export function treeselect(type) {
  const data = {
    type
  };
  return request({
    url: '/module/ruralInfo/treeselect',
    method: 'get',
    params: data
  })
}
