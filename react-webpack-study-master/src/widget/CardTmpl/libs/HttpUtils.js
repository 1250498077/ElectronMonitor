import request from 'utils/request';
import utils  from 'utils';
import { parse } from 'qs';
// 引入lodash
import { get, keys, cloneDeep, pick, isEmpty } from 'lodash';
// 获取记录集的值
import { getRecordSetValue } from './CardUtils';

// 获得提交按钮上配置的接口信息
const getApiOption = (buttons = {}) => {
  let apiObj = {};
  if(isEmpty(buttons)){
    return apiObj;
  }
  keys(buttons).map((k, i) => {
    if('submit' === '' + buttons[k].htmlType){
      apiObj = buttons[k].api;
      return;
    }
  })
  return apiObj;
}

// 提交表单
const doSubmit = async (buttons = {}, params = {}) => {
  let options = getApiOption(buttons);
  if(isEmpty(options)){
    return {};
  }
  // 附加表单数据
  options.data = params;
  // 请求接口
  return request(options);
}

// 查询记录
const queryRecord = (apiObj, queryObj) => {
  let { api_url, api_app } = apiObj;

  let options = {
    url: api_url,
    data: queryObj,
    method: 'GET',
  }
  if(api_app){
    options['app'] = api_app;
  }
  // 请求接口
  return request(options);
}

// 进入编辑页时，查询单条记录出来显示
const getOneRecord = async (props) => {
  // 取出查询接口的API
  let apiObj = pick(props.ui, ['api_url', 'api_params', 'api_app']);
  // API参数转换成对象
  let apiParamsObj = parse(apiObj.api_params || {});
  // 取出参数的key
  let paramsKeys = keys(apiParamsObj);
  // 从地址栏取出参数对象（键和值）
  let queryObj = utils.getQueryString(paramsKeys);
  // 编辑时才需要查询记录
  let result = await queryRecord(apiObj, queryObj);

  // 接口出错，则返回空对象
  if('0' !== '' + result.resultCode){
    return {};
  }
  // 接口返回空的内容，则直接返回空
  let { data = {} } = result;
  if(isEmpty(data)){
    return {};
  }

  // 字段对象，二维数组
  let fields = get(props, 'ui.fields', {});
  // 字段包含的键
  let fKeys = keys(fields);
  // 返回的表单对象
  let formObj = {};
  fKeys.map((k, i) => {
    formObj[k] = getRecordSetValue(fields[k], data);
  })
  return formObj;
}

// 获取字段的内容项
const getFieldItems = async (eField) => {
  let copyField = cloneDeep(eField);
  // 不设置接口地址，接口参数，则中止往下执行，直接返回字段信息
  if(!copyField.api_url){
    return copyField;
  }

  // 从业务系统取表单内容可选项的接口地址，接口参数
  let apiObj = pick(copyField, ['api_url', 'api_params']);
  let queryObj = {};
  if(apiObj.api_params){
    queryObj = parse(apiObj.api_params);
  }

  let res = await queryRecord(apiObj, queryObj);
  // 接口请求出错，则中止往下执行，直接返回字段信息
  if('0' !== '' + res.resultCode){
    return copyField;
  }

  // 接口返回空，则中止往下执行，直接返回字段信息
  let data = res.data;
  if(!data){
    return copyField;
  }

  // 若设置了取内容项的取值路径，则从结果集对应的路径取值
  if(copyField.get_items_path){
    copyField.cmpt_items = get(data, `${get_items_path}`, []);

  // 默认从data.list从获取
  }else{
    copyField.cmpt_items = get(data, 'list', []);
  }
  return copyField;
}

// 获取单选、复选、下拉框的内容项的字段列表
const getExtFields = async (props) => {
  // 字段对象
  let fields = get(props, 'ui.fields', {});
  // 取出所有的key的列表
  let fKeys = keys(fields);

  // 循环取出
  let i = 0, fLen = fKeys.length, k = '', extFields = {}, funcs = [];
  for (; i < fLen; i++) {
    k = fKeys[i];
    funcs.push(getFieldItems(fields[k]));
  }
  // 并行请求
  let key = '', resArr = await Promise.all(funcs);
  resArr.map((res, j) => {
    key = fKeys[j];
    // 已填充了cmpt_items内容可选项的字段信息
    extFields[key] = res;
  })
  // 返回新的字段配置信息（已填充了内容可选项）
  return extFields;
}

export { getExtFields, getOneRecord, doSubmit };