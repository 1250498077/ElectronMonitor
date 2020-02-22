import request from 'utils/request';
import config from 'config/Config';
import { has, get } from 'lodash';

// 查询图形验证码
export function getRouterTable(params) {
  return request({
    url: 'router/list',
    method: 'GET',
    data: params,
    app: 'ide-op-mgmt-application',
    headers: {
      router_init: true
    }
  })
}