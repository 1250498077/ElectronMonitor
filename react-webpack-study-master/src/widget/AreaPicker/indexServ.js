// 调用接口配置文件
import request from 'utils/request'

// 获取街道列表
export async function getAreaList(params) {
  return request({
    url: 'basic/area/parentCode',
    method: 'GET',
    data: params
  });
};

// 获取省市区的数据
export async function getAllList(params) {
  return request({
    url: 'basic/area/allList',
    method: 'get',
    data: params
  });
}