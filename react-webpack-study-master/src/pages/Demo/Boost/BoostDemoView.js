import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Icon } from 'antd';
import config from 'config/Config';

// 引入图片放大镜组件
import ImgBoost from 'widget/ImgBoost/ImgBoostView';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';

// 在视图注入module层数据
@inject('BoostDemoMod')
// 在组件中可通过this.props.history.push跳转路由
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class BoostDemoView extends Component {
  constructor(props, context) {
    super(props, context);
    this.stores = this.props.BoostDemoMod;
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <PageTitle title='图片放大镜'/>
        <span>鼠标移过去，点击预览</span><br/>
        {<ImgBoost src='http://dtyunxi.com/images/case-detail-maotai-logo.png'/>}
      </div>
    )
  }

}

// 注入antd的Form对象，以便可以在组件中使用 this.props.form
export default Form.create()(BoostDemoView);