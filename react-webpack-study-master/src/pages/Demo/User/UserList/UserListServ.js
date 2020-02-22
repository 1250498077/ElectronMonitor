import request from 'utils/request';

// 查询员工列表
export function getUser(params) {
  return request({
    url: 'emp/list',
    method: 'GET',
    data: params,
    app: 'ide-op-mgmt-application'
  })
}