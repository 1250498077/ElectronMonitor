import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Icon, List, Avatar } from 'antd';

import config from 'config/Config';

// 引入富文本编辑器
import KingEditor from 'widget/Editor/KingEditor';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';

const CDN_BASE = config.CDN_BASE || '';
// 在视图注入module层数据
@inject('RichEditorMod')
// 在组件中可通过this.props.history.push跳转路由
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class RichEditorView extends Component {
  constructor(props, context) {
    super(props, context);
    this.stores = this.props.RichEditorMod;
  }

  // 富文本内容变化的回调函数
  detailChange(html){
    // 这里设置到Mod层的状态机
    this.stores.setHtml({ html })
  }

  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    console.log('html: ', this.stores.state.html);

    return (
      <div>
        <PageTitle title='富文本编辑器'/>
        <KingEditor id="KingEditor" style={{ width: '100%', mheight: 500 }} html={''} inputChange={html => this.detailChange(html)} />
      </div>
    )
  }
}

export default Form.create()(RichEditorView);