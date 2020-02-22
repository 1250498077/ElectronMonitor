import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Button, Input } from 'antd';

import config from 'config/Config';
const CDN_BASE = config.CDN_BASE || '';

// 剪贴板组件
import Clipboard from 'widget/Clipboard/ClipboardView';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';
// 样式工具
import cx from 'classnames';

// 在视图注入module层数据
@inject('ClipboardDemoMod')
// 在组件中可通过this.props.history.push跳转路由
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class ClipboardDemoView extends Component {
  constructor(props, context){
    super(props, context);
    this.stores = this.props.ClipboardDemoMod;
    this.state = {
      targetList: ['itemCode']
    }
  }

  // 插入真实DOM
  componentDidMount(){ }

  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const { targetList } = this.state;

    return (
      <div>
        {/* 页面标题组件 */}
        <PageTitle type='collapse' title='剪贴板组件'/>
        <p>拷贝如下的换行的订单号码列表，粘贴到输入框中</p>
        <ul>
          <li>001</li>
          <li>002</li>
          <li>003</li>
          <li>004</li>
          <li>005</li>
        </ul>
        <Input id='itemCode' placeholder="请输入" style={{width: '500px'}}/>
        {
          targetList && targetList.length > 0 && (
            <Clipboard
              targetList={targetList}
            />
          )
        }
      </div>
    )
  }
}

export default Form.create()(ClipboardDemoView);