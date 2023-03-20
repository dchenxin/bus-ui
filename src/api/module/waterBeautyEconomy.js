import request from '@/utils/request'

// 查询水美经济列表
export function listWaterBeautyEconomy(query) {
  return request({
    url: '/module/waterBeautyEconomy/list',
    method: 'get',
    params: query
  })
}

// 查询水美经济详细
export function getWaterBeautyEconomy(id) {
  return request({
    url: '/module/waterBeautyEconomy/' + id,
    method: 'get'
  })
}

// 新增水美经济
export function addWaterBeautyEconomy(data) {
  return request({
    url: '/module/waterBeautyEconomy',
    method: 'post',
    data: data
  })
}

// 修改水美经济
export function updateWaterBeautyEconomy(data) {
  return request({
    url: '/module/waterBeautyEconomy',
    method: 'put',
    data: data
  })
}

// 删除水美经济
export function delWaterBeautyEconomy(id) {
  return request({
    url: '/module/waterBeautyEconomy/' + id,
    method: 'delete'
  })
}

// 导出水美经济
export function exportWaterBeautyEconomy(query) {
  return request({
    url: '/module/waterBeautyEconomy/export',
    method: 'get',
    params: query
  })
}

// 资讯状态修改
export function changeNewStatus(id, state) {
  const data = {
    id,
    state
  };
  return request({
    url: '/module/waterBeautyEconomy/changeStatus',
    method: 'put',
    data: data
  })
}
