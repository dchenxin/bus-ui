import request from '@/utils/request'

// 首页查询业务数据统计
export function getBusinessStatistics(type) {
  return request({
    url: '/module/businessStatistics/getBusinessStatistics/' + type,
    method: 'get'
  })
}

// 首页查询小程序业务数据统计
export function getOperationStatistics(type) {
  return request({
    url: '/module/oprationStatistics/getOperationStatistics/' + type,
    method: 'get'
  })
}

// 首页提前购票统计
export function getBuyEarlyStatistics(data) {
  return request({
    url: '/module/buyEarlyStatistics/getBuyEarlyStatistics' ,
    method: 'post',
    data: data
  })
}

// 首页起始终点统计
export function getSearchRateStatistics(type) {
  return request({
    url: '/module/stationSearchRateStatistics/getSearchRateStatistics/' + type,
    method: 'get'
  })
}

// 首页性别分布统计
export function getUserSexSpreadStatistics() {
  return request({
    url: '/module/userSexSpreadStatistics/getUserSexSpreadStatistics',
    method: 'get'
  })
}

// 首页年龄分布统计
export function getUserAgeSpreadStatistics() {
  return request({
    url: '/module/userAgeSpreadStatistics/getUserAgeSpreadStatistics',
    method: 'get'
  })
}

// 首页模块点击统计
export function getModelClickStatistics(type) {
  return request({
    url: '/module/modelClickStatistics/getModelClickStatistics/' + type,
    method: 'get'
  })
}

// 首页实载率统计
export function getRealLoadStatistics(type) {
  return request({
    url: '/module/realLoadStatistics/getRealLoadStatistics/' + type,
    method: 'get'
  })
}

export function formatDate(params ) {
  let defaultParams = {
    date: new Date(),
    formatStr: 'yyyy-MM-dd HH:mm:ss'
  }
  params = { ...defaultParams, ...params };
  let date = params.date;
  let formatStr = params.formatStr;
  // 传入日期字符串 - 转成时间戳 - 转成标准时间
  let timeStamp = new Date(date).getTime();
  date = new Date(timeStamp);
  formatStr = formatStr.replace(new RegExp('yyyy'), `${date.getFullYear()}`);
  const month = date.getMonth() + 1;
  formatStr = formatStr.replace(new RegExp('MM'), `${month > 9 ? month : '0' + month}`);
  const day = date.getDate();
  formatStr = formatStr.replace(new RegExp('dd'), `${day > 9 ? day : '0' + day}`);
  const hour = date.getHours();
  formatStr = formatStr.replace(new RegExp('HH'), `${hour > 9 ? hour : '0' + hour}`);
  const min = date.getMinutes();
  formatStr = formatStr.replace(new RegExp('mm'), `${min > 9 ? min : '0' + min}`);
  const sec = date.getSeconds();
  formatStr = formatStr.replace(new RegExp('ss'), `${sec > 9 ? sec : '0' + sec}`);
  return formatStr;
}

// 查询服务器详细
export function getServers() {
  return request({
    url: '/module/index/server',
    method: 'get'
  })
}
