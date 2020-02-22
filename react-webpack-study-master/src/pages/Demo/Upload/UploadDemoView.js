import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Icon } from 'antd';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';
// 上传组件
import Uploader from 'widget/Upload/UploadView';

// 站点配置
import config from 'config/Config';
// 静态资源CDN前缀，页面中的图片img的src属性必须加上它
const CDN_BASE = config.CDN_BASE || '';


// 注入在config/Stores.js中注册的UploadDemoMod，以便获取store中的状态state或调用方法
@inject('UploadDemoMod')
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
// 在组件中可通过this.props.history.push跳转路由
@withRouter
class UploadDemoView extends  Component {
 constructor(props, context) {
    super(props, context);
    this.store = this.props.UploadDemoMod;
    this.state = {}
  }

  componentDidMount (){}

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <PageTitle title='上传组件演示'/>
        <Uploader uploadSuccessCbf={ (imgUrl) => console.log('imgUrl:', imgUrl) } showType='1' fileType='image' fileMaxSize='1'/>
      </div>
    )
  }
}

// 注入antd的Form对象，以便可以在组件中使用 this.props.form
export default Form.create()(UploadDemoView);