import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Icon, Button } from 'antd';
import config from 'config/Config';

// 千分位组件
import ThousandBit from 'widget/ThousandBit/ThousandBitView';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';

// 在视图注入module层数据
@inject('ThousandBitDemoMod')
// 在组件中可通过this.props.history.push跳转路由
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class stepPointDemoView extends Component {
  constructor(props, context){
    super(props, context);
    this.stores = this.props.ThousandBitDemoMod;
    this.state = {
      thousandProps: {
        // 需要格式化的数字，默认0
        number: 28956323323,
        // 需要保留的小数位，默认0
        precision: 2,
        // 是否需要加金额前缀，默认false
        prefix: '￥',
        // 千分位的样式
        style: {
          color: 'red',
          fontWeight: 'bold'
        }
      }
    }
  }

  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    return (
      <div>
        {/* 页面标题组件 */}
        <PageTitle type='collapse' title='千分位组件'/>
        <p>要转换的数字为：28956323323</p>
        <ThousandBit {...this.state.thousandProps}/>
      </div>
    )
  }
}

export default Form.create()(stepPointDemoView);