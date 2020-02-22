// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, Row, message } from 'antd';
// 样式管理器
import cx from 'classnames';
// 引入lodash
import { get, keys, isArray, isString, cloneDeep, isBoolean, isEmpty, isPlainObject, isFunction, has, omit, includes } from 'lodash';

// 当前组件样式
import styles  from './CardTmplLess.less';
// 布局配置
import layoutCfg from './CardTmplConf';
// 表单包装器
import CardTmplWrapper  from './CardTmplWrapper';
// HTTP请求工具
import { getOneRecord,  getExtFields, doSubmit } from './libs/HttpUtils';
// 自定义操作
import { goToUrl, getFormItemLayout, getBizValue, getExtButtons, isSearchForm } from './libs/CardUtils';
// 地址栏参数获取
import utils from 'utils';

// 渲染输入框、单选框组、下拉框、复选框组、操作按钮
import {
  renderInput, renderRadio, renderRadioGroup, renderSelect, renderCheckbox, renderCheckboxGroup, renderActionBar, 
  renderDatePicker, renderUploader, renderTextArea, renderInputNumber, renderRate, renderTreeSelect, renderSwitch,
  renderCascader, renderEditor, renderMonthPicker, renderRangePicker, renderText, renderFormItem, renderAreaPicker
} from './libs';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';

// 表单项
const FormItem = Form.Item;

// 导出组件
class CardTmpl extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context)
    this.state = {
      actType: 'add',
      // 查询结果集合 - 详情页时使用
      recordSet: {},
      // 给父组件的props中的fields增加cmpt_items
      extFields: [],
    }
  }

  validForm = (e, form) => {
    return new Promise((resolve, reject) => {
      form.validateFieldsAndScroll((err, values) => {
        resolve({err, values});
      });
    })
  }

  handleSubmit = async (e, ui, buttons, form) => {
    if(e){
      // 阻止冒泡
      e.preventDefault();
    }
    if(!buttons){
      console.warn('按钮未设置');
      return;
    }
    // 校验表单
    let { err, values } = await this.validForm(e, form);
    // 自定义提交表单前的处理
    let beforeSubmit = get(ui, 'beforeSubmit', null);

    // 重新设置过的表单的值
    let newValues = cloneDeep(values);
    if(beforeSubmit){
      newValues = await beforeSubmit(err, values);
      // 校验不通过，不往下执行了
      if(isBoolean(newValues) && !newValues){
        return;
      }
    }

    // 校验通过，则进行提交
    if(!err){
      // 表单提交返回结果
      let submitResult = null

      // 自定义提交表单
      let customSubmit = get(ui, 'customSubmit', null);
      if(customSubmit){
        await customSubmit(newValues);
      }else{
        submitResult = await doSubmit(buttons, newValues);
      }

      // 提交表单后的处理
      let afterSubmit = get(ui, 'afterSubmit', null);
      if(afterSubmit){
        await afterSubmit(submitResult);
        return;
      }

      // 成功后跳转的URL
      let success_url = get(ui, 'success_url', '');
      if('0' === '' + submitResult.resultCode){
        message.success(submitResult.resultMsg || '保存成功');
        if(!success_url){
          return;
        }
        goToUrl(null, success_url);
      }
    }
  }

  //准备：即将被重新渲染，状态未变化
  componentWillMount() {
    // 从地址栏取出参数对象（键和值）
    let actType = utils.getQueryString('actType') || 'add';
    this.setState({ actType });
  }
  //准备：即将被重新渲染，状态未变化
  componentWillUpdate(nextProps, nextState) {}
  //完成：正在被重新渲染，状态已变化
  componentDidUpdate(prevProps, prevState) {}
  // 已加载组件，收到新属性时调用
  async componentWillReceiveProps(nextProps) {}
  //组件将被卸载
  componentWillUnmount(){
    //重写组件的setState方法，直接返回空
    this.setState = (state, callback) => {
      return
    }
  }
  // 已插入真实DOM
  async componentDidMount(){
    // 查询带有组件内容cmpt_items的字段列表fields
    let extFields = await getExtFields(this.props);
    let actType = '' + this.state.actType;
    // 新增页面时，设置下拉、单选等构件的内容项，同时清空表单
    if('add' === actType){
      this.setState({ extFields }, () => {
        this.props.form.resetFields();
      });
      return;
    }

    // 编辑、详情才需要查询记录，同时设置下拉、单选等构件的内容项
    let obj = await getOneRecord(this.props);
    if('detail' === actType){
      this.setState({ recordSet: obj, extFields });
    }else{
      this.setState({ extFields }, () => {
        // 设置一组表单的值
        this.props.form.setFieldsValue(obj);
      });
    }   
  }

  // 不支持的表单元素
  notSupportElement(layout, eField){
    return (
      <FormItem {...layout} label='警告'>
        <span>{`字段${eField.en_name}的${eField.elem_type}尚不支持的表单元素`}</span>
      </FormItem>
    )
  }

  renderCol(k, i, fields, getFieldDecorator, recordSet, actType, form, biz, formItemLayout, searchFormFlag){
    // 字段配置信息
    let eField = fields[k];
    if (isEmpty(eField)) {
      return;
    }
    // 每一行的key
    let eKey = `${eField.en_name}_${i}`;
    // 搜索表单标识
    eField.searchFormFlag = searchFormFlag;
    // 表单元素的布局
    let layout = getFormItemLayout(formItemLayout, searchFormFlag, eField);

    // 显示/隐藏元素
    if(has(eField, 'show')){
      let showFlag = eField.show;
      if(isFunction(eField.show)){
        showFlag = eField.show(form.getFieldsValue())
      }
      if(!showFlag){
        return null;
      }
    }

    // 禁用/启用元素
    if(isFunction(eField.disabled)){
      eField.disabled = eField.disabled();
    }

    // 自定义渲染
    if(!!eField.render){
      return eField.render(form.getFieldsValue());
    }

    // 元素类型
    switch('' + eField.elem_type){
      // 文本输入框
      case 'Input':
        // 函数组件 - 无生命周期函数
        return renderInput(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
        break;
      // 单选框
      case 'Radio':
        return renderRadio(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
      // 单选框组
      case 'RadioGroup':
        return renderRadioGroup(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
        break;
      // 下拉框
      case 'Select':
        return renderSelect(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
        break;
      // 复选框
      case 'Checkbox':
        return renderCheckbox(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
        break;
      // 复选框组
      case 'CheckboxGroup':
        return renderCheckboxGroup(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
        break;
      // 日期框
      case 'DatePicker':
        return renderDatePicker(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
        break;
      // 上传框
      case 'Uploader':
        return renderUploader(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
        break;
      // 文本域
      case 'TextArea':
        return renderTextArea(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
        break;
      // 数字输入框
      case 'InputNumber':
        return renderInputNumber(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
        break;
      // 下拉树
      case 'TreeSelect':
        return renderTreeSelect(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
        break;
      // 开关
      case 'Switch':
        return renderSwitch(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
        break;
      // 级联选择
      case 'Cascader':
        return renderCascader(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
        break;
      // 富文本编辑器
      case 'Editor':
        return renderEditor(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
        break;
      // 月份选择器
      case 'MonthPicker':
        return renderMonthPicker(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
        break;
      // 日期范围选择器
      case 'RangePicker':
        return renderRangePicker(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
        break;
      // 文本显示
      case 'Text':
        return renderText(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
        break;
      // 表单项
      case 'FormItem':
        return renderFormItem(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
        break;
      // 地址选择器
      case 'AreaPicker':
        return renderAreaPicker(layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz);
        break;
      default:
        // 不支持的元素类型
        return this.notSupportElement(layout, eField);
        break;
    }
  }

  // 初始状态或状态变化会触发render
  render(ReactElement, DOMElement, callback) {
    // 表单校验方法
    const { getFieldDecorator } = this.props.form;
    // 界面配置
    const ui = get(this.props, 'ui', {});
    // 业务数据
    const biz = get(this.props, 'biz', {});
    // 表单对象
    const form = get(this.props, 'form', {});
    // 页面行布局
    const rows = get(ui, 'rows', []);
    // 底部操作按钮
    const buttons = getExtButtons(get(ui, 'buttons', {}));

    // 业务数据 - 详情页时使用
    const recordSet = get(this.state, 'recordSet', {});
    // 字段信息 - 附加组件项
    const fields = get(this.state, 'extFields', {});

    // 默认标签和表单元素的布局
    const { formItemLayout, tailFormItemLayout } = layoutCfg;
    // 页面类型，用于判断详情页时变成展示
    const actType = this.state.actType;

    // 搜索表单标识，为true时，则是搜索表单
    const searchFormFlag = isSearchForm(buttons);

    console.log('render card tmpl');

    // 临时列数组
    let tmpCols = [];

    return (
      <div className={`${searchFormFlag? 'listSearchBox': ''}`}>
        <Form onSubmit={ e => { this.handleSubmit(e, ui, buttons, form) }} className='yx-edit-form'>
          {/* 编辑表单，则需要生成多个Row，Row里面有多个Col，形成一个二维数组 */}
          {
            !searchFormFlag && rows && rows.map((cols, idx) => {
              tmpCols = isString(cols)? [cols]: cols;
              return (
                <Row key={idx} gutter={16}>
                  {
                    isArray(tmpCols) && tmpCols.length > 0 && tmpCols.map((k, i) => {
                      return this.renderCol(k, i, fields, getFieldDecorator, recordSet, actType, form, biz, formItemLayout, searchFormFlag)
                    })
                  }
                </Row>
              )
            })
          }
          {/* 自定义的内容，编辑表单使用时，放在按钮上方 */}
          { !searchFormFlag && this.props.children }
          {/* 底部操作按钮, 编辑表单使用时 */}
          { !searchFormFlag && renderActionBar(tailFormItemLayout, buttons, actType, searchFormFlag) }

          {/* 搜索表单，则只有一个Row，里面有多个Col，自动根据屏幕宽度显示N个Col */}
          {
            searchFormFlag && (
              <Row>
                {
                  keys(fields).map((k, i) => {
                    return this.renderCol(k, i, fields, getFieldDecorator, recordSet, actType, form, biz, formItemLayout, searchFormFlag)
                  })
                }
                {/* 底部操作按钮 */}
                { renderActionBar(tailFormItemLayout, buttons, actType, searchFormFlag) }
                {/* 自定义的内容，搜索表单使用时，放在按钮下方 */}
                { this.props.children }
              </Row>
            )
          }

        </Form>
      </div>
    )
  }
}

export default Form.create(CardTmplWrapper)(CardTmpl);