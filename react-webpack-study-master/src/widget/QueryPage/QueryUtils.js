import { parse } from 'qs';
import utils  from 'utils';
import request from 'utils/request';
import { getListActions } from './TableLinks';

// 引入lodash
import { get, has, keys, cloneDeep, pick, isEmpty, omit, merge } from 'lodash';

// 查询记录
const queryRecord = (apiObj, queryObj) => {
  let { api_url, api_app, api_method } = apiObj;

  let options = {
    url: api_url,
    data: queryObj,
    method: api_method || 'GET',
  }
  if(api_app){
    options.app = api_app;
  }
  // 请求接口
  return request(options);
}

const getApiObj = (tableObj) => {
  if(isEmpty(tableObj)){
    return {};
  }
  return pick(tableObj, ['api_url', 'api_params', 'api_method', 'api_app', 'get_data_path']);
}

// 获取对应选项卡的表格配置
const getTabsTable = (uiTabs, tabsKeyArr, key, idx) => {
  let copyUITable = cloneDeep(uiTabs);
  // 第一个选选项卡的key
  let firstKey = tabsKeyArr[0];
  // 获取对应key的表格
  let currentTabTable = get(copyUITable, `[${key}].table`, null);
  // 第一个选项卡，直接返回
  if('0' === '' + idx){
    return currentTabTable;
  }

  // 第一个选项卡的table属性
  let firstTable = get(copyUITable, `[${firstKey}].table`, null);

  // 非第一个选项卡，则需要计算table的属性

  // 若不设置table属性，则默认为第一个选项卡的配置
  if(!currentTabTable){
    currentTabTable = firstTable;
  // 若设置了table属性，则覆盖第一个选项卡的配置
  }else{
    currentTabTable = merge(firstTable, currentTabTable);
  }
  return currentTabTable;
}

const getColumnObj = (field) =>{
  return {
    key:  get(field, 'en_name'),
    title: get(field, 'zh_name'),
    dataIndex: get(field, 'en_name'),
    ...omit(field, ['en_name', 'zh_name'])
  }
}

// 获取表头
const getTableColumns = (uiTable) => {
  if(!uiTable.fields){
    return [];
  }
  let columns = [], fieldsObj = uiTable.fields;
  Object.keys(fieldsObj).map((k, i) => {
    columns.push(getColumnObj(fieldsObj[k]));
  })
  let actions = getListActions(uiTable);
  columns.push(actions);
  return columns;
}

// 获取表格属性
const getTableProps = (uiTable, k, props) => {
  if(isEmpty(uiTable)){
    return {};
  }

  let bizTable;
  if(isTabs(props)){
    bizTable = get(props, `biz.tabs[${k}].table`, {});
  }else{
    bizTable = get(props, `biz.table`, {});
  }

  uiTable.columns = getTableColumns(uiTable);
  uiTable = omit(uiTable, ['actions', 'api_url', 'api_params', 'api_method', 'api_app', 'fields', 'get_data_path']);
  let newTable = Object.assign(uiTable, bizTable);
  return newTable;
}

const getCurrent = (result) => {
  // 当前页号 - 默认第1页
  let current = get(result, 'data.pageNum', 1);
  return current;
}

const getPageSize = (result) => {
  // 每页记录数 - 默认10条每页
  let pageSize = get(result, 'data.pageSize', 10);
  return pageSize;
}

const getTotal = (result) => {
  // 总记录数 - 默认0
  let total = get(result, 'data.total', 0);
  return total;
}

const getDataSource = (result, apiObj) => {
  let dataSource = [];
  // 设置了取数据路径，则从对应的路径取值
  if(has(apiObj, 'get_data_path')){
    dataSource = get(result, apiObj.get_data_path, []);
  }
  // 若返回带有list属性，则从data.list取值
  else if(has(result, 'data.list')){
    dataSource = get(result, 'data.list', []);
  }else{
    // 默认从data获取
    dataSource = get(result, 'data', []);
  }
  if(0 !== dataSource.length){
    dataSource.map((item, i) => {
      item.key = i;
    })
  }
  return dataSource;
}

const getTableData = async (apiObj) => {
  if(!apiObj || !apiObj.api_url){
    return [];
  }
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
  return result;
}

const getBizTableProps = (result, apiObj) => {
  let total = getTotal(result);
  return {
    table: {
      defaultCurrent: 1,
      defaultPageSize: 10,
      current: getCurrent(result),
      pageSize: getPageSize(result),
      total,
      dataSource: getDataSource(result, apiObj),
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: e => `共 ${total} 条`,
        pageSizeOptions: ['5', '10', '20', '30', '40'],
        onChange: (page, pageSize) => {
          console.log('page:', page, 'pageSize:', pageSize);
        },
        onShowSizeChange: (current, size) => {
          console.log('current:', current, 'size:', size);
        }
      },
      rowSelection: {
        onChange: (selectedRowKeys) => {
          console.log('selectedRowKeys:', selectedRowKeys);
        }
      }
    }
  }
}

// 查询单个表格的业务数据
const getSingleTableData = async (apiObj) => {
  let result = await getTableData(apiObj);
  let tableResult = getBizTableProps(result, apiObj);
  return tableResult;
}

// 查询多个表格（选项卡）的业务数据
const getMultipleTableData = async (uiTabs, bizTabs) => {
  let funcs = [], tmpMap = {}, keyArray = Object.keys(uiTabs);
  // 遍历每个选项卡，异步请求表格的数据
  keyArray.map((k, i) => {
    let apiObj = getApiObj(uiTabs[k].table);
    tmpMap[i] = { key: k, apiObj};
    funcs.push(getTableData(apiObj));
  });

  // 并行请求多个表格的数据
  let results = await Promise.all(funcs);

  // 没有返回结果，则直接返回UI选项卡
  if(0 === results.length || 0){
    return uiTabs;
  }

  // 构造多个选项卡的业务数据
  let j = 0, len = keyArray.length, newTabs = {};
  for (; j < len; j ++) {
    newTabs['' + tmpMap[j].key] = getBizTableProps(results[j], tmpMap[j].apiObj);
  }

  // 合并选项卡的界面与业务数据
  return merge(bizTabs, newTabs);
}

// 进入列表页时，查询数据列表
const fetchTableDatas = async (props) => {
  let uiTabs = get(props, 'ui.tabs', {});
  let bizTabs = get(props, 'biz.tabs', {});
  // 填充dataSource、current、total等
  if(isEmpty(uiTabs)){
    // 单个表格
    bizTabs = await getSingleTableData(getApiObj(props.ui.table));
  }else{
    // 多个表格
    bizTabs = await getMultipleTableData(uiTabs, bizTabs);
  }
  return bizTabs;
}

// 是否多页签
const isTabs = (props) => {
  return !isEmpty(props.ui.tabs);
}

// 同步数据到父组件，该方法是异步的
const syncDatasToParent = (bizTabs, props) => {
  // 需要设置一个中间变量，在这里不能修改父组件的值
  let copyBiz = props.biz;
  if(isTabs(props)){
    // 给中间变量设值
    copyBiz.tabs = bizTabs;
  }else{
    copyBiz.table = bizTabs.table;
  }
  // 回调数据给父组件
  props.onChange && props.onChange(copyBiz);
}

export { fetchTableDatas, getTabsTable, getTableProps, syncDatasToParent };