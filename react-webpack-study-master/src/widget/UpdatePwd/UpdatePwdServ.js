import config from 'config/Config';

// import { request } from 'utils/request'

// 请求短信验证码
export function getPhoneCode (params) {
  // return request({
  //   url: 'sms/send',
  //   method: 'GET',
  //   data: params
  // })
}

// 修改密码 - 提交
export function updateLoginPwd (params) {
  // return request({
  //   url: 'comm/user/password/update',
  //   method: 'PUT',
  //   data: params
  // })
}

// 重置密码
export function forgetLoginPwd (params) {
  // return request({
  //   url: 'user/password/forget',
  //   method: 'POST',
  //   data: params
  // })
}
