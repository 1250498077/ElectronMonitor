import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Icon, Button } from 'antd';
import config from 'config/Config';

// 引入右侧边栏组件
import SiderPanel from 'widget/SiderPanel/SiderPanelView';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';

// 在视图注入module层数据
@inject('SiderPanelDemoMod')
// 在组件中可通过this.props.history.push跳转路由
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class SiderPanelDemoView extends Component {
  constructor(props, context) {
    super(props, context);
    this.stores = this.props.SiderPanelDemoMod;
    this.state = {
      show: false
    }
  }

  // 打开，关闭右侧对话框
  changeShow(e){
    this.setState({
      show: !this.state.show
    })
  }

  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    return (
      <div>
        {/* 页面标题组件 */}
        <PageTitle type='collapse' title='面板组件'/>
        <Button type='primary' onClick={e => this.changeShow(e)}>打开右侧边栏</Button>
        <SiderPanel
          show={this.state.show}
          changeShow={(e) => this.changeShow(e)}
          style={{width: "400px"}}
        >
        <p>在这里填写你的内容，点击灰色的蒙版关闭此面板</p>
        </SiderPanel>
      </div>
    )
  }
}

export default Form.create()(SiderPanelDemoView);