import config from 'config/Config';
// import { request } from 'utils/request'
// 我的消息列表
export function myList(params) {
  // return request({
  //   url: requestApiUrl.mymessageList,
  //   method: 'GET',
  //   data: params
  // })

  let data = {
    "data": {
      "total": 1,
      "pages": 1,
      "pageSize": 5,
      "list": [
        {
          "subject": "飞天茅台酒卖出一瓶1999",
          "id": 64400,
          "time": "2017-11-17 16:29:28",
          "title": "收到茅台了1999，收到一个新的茅台，呵呵",
          "content": "收到一个新的茅台订单1，请注意查收！^_^"
        },
        {
          "subject": "飞天茅台酒卖出一瓶2999",
          "id": 64401,
          "time": "2017-11-17 16:29:28",
          "title": "收到茅台了2999",
          "content": "收到一个新的茅台订单2，请注意查收！^_^"
        }
      ],
      "pageNum": 1
    },
    "resultCode": 0,
    "resultMsg": "success"
  }
  return Promise.resolve(data)
}
