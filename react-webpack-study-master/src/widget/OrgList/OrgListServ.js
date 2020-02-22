import config from 'config/Config';
// import { request } from 'utils/request'

// 获取用户组织机构
export async function getUserOrg (params) {
  // return request({
  //   url: 'sys/user/unit/list',
  //   method: 'get',
  //   data: params,
  // })

  let res = {
    "resultCode": 0,
    "resultMsg": "success",
    "data": {
      orgList: [{
        "name": "杭州xxx科技有限公司", 
        "id": "1157282239283725312"
      },{
        "name": "广州xxx科技有限公司", 
        "id": "1157282239283725313"
      }],
      orgInfo: {
        id: "1157282239283725313",
        name: '广州xxx科技有限公司'
      }
    }
  }
  return Promise.resolve(res)
}