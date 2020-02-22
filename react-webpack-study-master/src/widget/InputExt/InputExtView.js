// 加载React
import React, { Component } from 'react';
// 引入antd
import { Form, Input } from 'antd';
const FormItem = Form.Item;
// 引入lodash
import { omit, pick, includes } from 'lodash';

import { Phone, IDcard, IP, Money, URL, CharValid, EnNum, Chinese, Tel } from './libs';
// 引入规则
import { rulesMap } from './RuleList'

// 记录自定义扩展，RulesList定义
// const customRulesType = ['phone', 'IdCard', 'IP', 'money', 'CharValid', 'EnNum', 'chinese', 'tel']

class InputExtView extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  //准备：即将被重新渲染，状态未变化
  componentWillMount() {}

  //准备：即将被重新渲染，状态未变化
  componentWillUpdate(nextProps, nextState) {}

  //完成：正在被重新渲染，状态已变化
  componentDidUpdate(prevProps, prevState) {}

  // 已加载组件，收到新属性时调用
  async componentWillReceiveProps(nextProps) {}

  //组件将被卸载
  componentWillUnmount(){}

  // 已插入真实DOM
  async componentDidMount(){

  }

  // 获取表单对象标题和文本框的比例（布局）
  getFormItemLayout (props) {
    if(!props.formItemLayout){
      return {
        labelCol: {
          span: 8
        },
        wrapperCol: {
          span: 16
        }
      };
    }

    return props.formItemLayout;
  }

  // 设置输入框文本长度
  getValueMax(rules) {
    let newRules = rules.concat();

    rules.map((item) => {
      // 如果开发者定义了max，就直接返回规则
      if(item.max) {
        return newRules;
      }
    })
    // 否则设置默认的长度
    newRules.push({
      max: 30,
      message: '长度超出限制'
    })

    return newRules;
  }

  // 处理规则1
  handleRules(rules, type) {

    // 如果没有type，就不是默认组件，直接返回rules
    if (!type) {
      return rules
    }

    // 取出默认规则
    let defaultRules = [rulesMap[type]], isCustomRules = false;
    // 如果开发者不自定义任何规则，则返回默认规则
    if(!rules) {
      return  defaultRules;
    }

    // 如果开发者定义了自定义规则，则立即返回开发者定义的规则
    let arrCopy = [];
    rules.map((item) => {
      if(item.type) {
        isCustomRules = true;
        item = omit(item, 'type');
      }
      arrCopy.push(item);
    })

    if(isCustomRules) {
      return arrCopy;
    }else{
      return arrCopy.concat(defaultRules);
    }
  }

  // 取出Input的属性
  getInputProps (props) {
    let tmpObj = { name: props.en_name };
    let newProps = omit(props, ['label', 'en_name', 'rules', 'form']);
    return Object.assign(newProps, tmpObj);
  }

  // 获取校验规则
  getRules(){
    let { type, rules } = this.props;
    // 合并校验规则
    rules = this.handleRules(rules, type);
    rules = this.getValueMax(rules);
    return rules;
  }

  render(ReactElement, DOMElement, callback) {
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem {...omit(this.props, ['en_name', 'rules', 'form'])}   {...this.getFormItemLayout(this.props)}>
        {
          getFieldDecorator(this.props.en_name, {
            initialValue: this.props.value || '',
            rules: this.getRules()
          })(<Input {...this.getInputProps(this.props)}/>)
        }
      </FormItem>
    )
  }
}

InputExtView.Phone = Form.create()(Phone);
InputExtView.IDcard = Form.create()(IDcard);
InputExtView.IP = Form.create()(IP);
InputExtView.Money = Form.create()(Money);
InputExtView.URL = Form.create()(URL);
InputExtView.CharValid = Form.create()(CharValid);
InputExtView.EnNum = Form.create()(EnNum);
InputExtView.Chinese = Form.create()(Chinese);
InputExtView.Tel = Form.create()(Tel);

export default Form.create()(InputExtView);