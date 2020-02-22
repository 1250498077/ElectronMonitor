import request from 'utils/request';

export default class {
  // 查询图片列表
  static getImgs(params) {
    return request({
      url: 'hello/imgs',
      method: 'GET',
      data: params,
      // 对应后端的应用工程名
      app: 'ide-op-mgmt-application'
    })
  }
}