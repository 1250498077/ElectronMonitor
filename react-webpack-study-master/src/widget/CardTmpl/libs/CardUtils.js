// 排除属性
import { omit, keys, get, find, isArray, isBoolean, isPlainObject, includes, filter, assign, cloneDeep, isEmpty } from 'lodash';
// 哈希路由，地址栏#后面的参数
import { HashRouter } from 'react-router-dom';
// 日期处理
import moment from 'moment';
// 树目录打平
import treeFlatter from 'tree-flatten';
// 布局配置
import layoutCfg from '../CardTmplConf';
// 编辑表单默认按钮
import defaultButtons from './defaultButtons';

  // 表单元素的属性
const getFieldsProps = (eField) => {
  // 排除掉自定义的属性，剩下的跟antd的属性一样
  return omit(eField, ['en_name', 'zh_name', 'elem_type', 'rules', 'api_url', 'api_params', 'cmpt_items']);
}

// 跳转URL
const goToUrl = (e, url) => {
  if(e){
    // 阻止冒泡
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
  }

  if(window.app.router){
    // 跳转到新的路由
    window.app.router.push(url);
  }else{
    HashRouter.push(url);
  }
}

// 获取下拉框、复选框列表
const getBoxList = (eField, biz) => {
  // 若设置了内容项，则直接取内容项
  if(eField.cmpt_items){
    return eField.cmpt_items;
  }
  // 若设置了取值路径
  if(eField.get_items_path){
    return get(biz, `${eField.get_items_path}`, []);
  }
  return [];
}

const changeValue = (eField, value) => {
  let dateIncludes = [ 'DatePicker', 'MonthPicker'];
  // 日期组件，转换为moment类型
  if(includes(dateIncludes, '' + eField.elem_type)){
    if(!value){
      return null;
    }
    if(moment.isMoment(value)){
      return value;
    }
    return moment(value);
  }

  let splitIncludes = ['Cascader', 'RangePicker'];
  // 级联组件，转换为数组
  if(includes(splitIncludes, '' + eField.elem_type)){
    if(!isArray(value) && -1 !== ('' + value).indexOf(',')){
      value = value.split(',');
    }
  }
  return value? value: '';
}

const getStrDate = (eField, dateValue) => {
  if(!dateValue){
    return '';
  }
  if('RangePicker' === '' + eField.elem_type && -1 !== ('' + dateValue).indexOf(',')){
    let strDateArr = ('' + dateValue).split(',');
    return strDateArr.join('至');
  }
  let defaultFormat = 'YYYY-MM-DD';
  let format = eField.format || defaultFormat;
  let strDate = moment(dateValue).format(format);
  return strDate;
}

// 从查询回来的结果集中获取字段的值
const getRecordSetValue = (eField, recordSet) => {
  if(eField.get_value_path){
    return changeValue(eField, get(recordSet, `${eField.get_value_path}`, ''));
  }
  return changeValue(eField, get(recordSet, `${eField.en_name}`, ''));
}

/**
 * 获取字段显示的文本标签值 - 用于级联选择器、复选框有多个值返回的元素
 * @param  {Object} eField    字段信息
 * @param  {Object} recordSet 一条数据库记录
 * @param  {Array} cmptItems 组件内容项
 * @return {String}           返回文本标签的值
 */
const getDisplayLabel = (eField, recordSet, cmptItems) => {
  let strValue = getRecordSetValue(eField, recordSet);
  // 如果是布尔值，则直接返回
  if(isBoolean(strValue)){
    return strValue;
  }
  // null、undefined则返回空''
  if(!strValue){
    return '';
  }
  // 不包含逗号，则直接返回
  if(-1 === strValue.indexOf(',')){
    return strValue;
  }

  // 从列表内容可选项中取出对应为label文本来显示
  let labels = [];
  let values = strValue.split(',');
  values.map((value, i) => {
    if(value){
      let label = find(cmptItems, ['value', value]).label;
      labels.push(label);
    }
  });
  let str = labels.length > 0 ? labels.join(',') : '';
  return str;
}

/**
 * 获取表单占比
 * @param  {Object} eField 字段信息
 * @return {Integer}        表单字段占24份中的几份，默认为8
 */
const getLayoutCol = (eField) => {
  return eField.col || 8;
}

// 获得表单列的属性
const getColProps = (eField) => {
  // 搜索表单时，使用自适应布局，默认为6
  if(eField.searchFormFlag){
    return layoutCfg.searchFormLayout.colItem;
  }

  // 默认为编辑表单的列布局
  return {
    span: getLayoutCol(eField)
  }
}

// 计算FormItem的layout显示比例
const getFormItemLayout = (formItemLayout, searchFormFlag, eField) => {
  // 自定义表单元素布局
  let customLayout = get(eField, 'formItemLayout', {});
  // 不为空，则使用自定义的布局
  if(!isEmpty(customLayout)){
    return customLayout;
  }

  // 搜索表单布局
  if(searchFormFlag){
    return layoutCfg.searchFormLayout.formItem;
  }

  // 占24份中的多少份，搜索表单默认为6份(占整个页面的6/24)，编辑表单为8份(占整个页面的8/24)
  let col = getLayoutCol(eField);
  // 表单元素的布局 - 编辑表单时使用
  return formItemLayout['' + col];
}

// 树目录打平成一维数组
const getFlatTreeArray = (items) => {
  let flatFlag = false;
  if(items.length > 0){
    if(!!items[0].children){
      flatFlag = true;
    }
  }
  if(flatFlag){
    return treeFlatter(items, 'children');
  }
  return items;
}

// 获取树的显示的label文本
const getTreeLabel = (cmptItems, eField, recordSet) => {
  let value = getRecordSetValue(eField, recordSet);
  let flatArr =  getFlatTreeArray(cmptItems);

  let valueArr = [];
  // 已经是数组，则直接返回
  if(isArray(value)){
    valueArr = value;
  }else{
    if(-1 !== ('' + value).indexOf(',')){
      valueArr = ('' + value).split(',');
    }
  }

  // 单个值，则直接翻译
  if(0 === valueArr.length){
    let item = filter(flatArr, (o) => {
      return '' + o.value === '' + value;
    })
    return 0 === item.length? '': item[0].title || item[0].label || '';
  // 有多个值，需要逐个遍历翻译
  }else{
    let labelArr = [];
    valueArr.map((v, i) => {
      flatArr.map((o, j) => {
        if('' + o.value === '' + v){
          labelArr.push(o.label);
        }
      })
    })
    return 0 === labelArr.length? '': labelArr.join(',');
  }
}

// 从业务结果获取字段的值
const getBizValue = (biz, eField) => {
  if(isEmpty(eField)){
    return '';
  }
  // 先从en_name.value获取
  let value = get(biz, `${eField.en_name}.value`, '');
  // 再从en_name直接获取
  if(!value){
    value = get(biz, `${eField.en_name}`, '');
  }
  return value;
}

// 获得填充属性后的按钮列表
const getExtButtons = (buttons) => {
  if(isEmpty(buttons)){
    return {};
  }
  let copyButton = cloneDeep(buttons);
  let newButtons = {}, tmpBtn = {};
  keys(copyButton).map((k, i) => {
    tmpBtn = copyButton[k];
    if(defaultButtons[k]){
      tmpBtn = assign(defaultButtons[k], tmpBtn);
    }
    newButtons[k] = tmpBtn;
  })
  return newButtons;
}

// 卡片模板使用方式 - 是否搜索型表单
const isSearchForm = (buttons) => {
  // 包含了查询按钮，则是搜索表单
  return includes(keys(buttons), 'onSearch');
}

export {
  getFieldsProps, goToUrl, getBoxList, getRecordSetValue, getDisplayLabel,
  getLayoutCol, getStrDate, getTreeLabel, getBizValue, getExtButtons, getColProps, 
  getFormItemLayout, isSearchForm
};