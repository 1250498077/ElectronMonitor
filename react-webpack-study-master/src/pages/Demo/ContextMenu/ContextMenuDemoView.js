import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Icon, Button } from 'antd';
import config from 'config/Config';

// 右键菜单
import ContextMenu from 'widget/ContextMenu/ContextMenuView';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';
// 引入样式
import styles from './ContextMenuDemoLess.less';

// 在视图注入module层数据
@inject('ContextMenuDemoMod')
// 在组件中可通过this.props.history.push跳转路由
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class ContextMenuDemoView extends Component {
  constructor(props, context){
    super(props, context);
    this.stores = this.props.ContextMenuDemoMod;
    this.state = {
      menuList: []
    }
  }

  // 已插入真实DOM
  componentDidMount(){
    this.setState({
      menuList: [
        {
          cls: '', // 自定义样式类名
          text: '新增',
          handleClick: (i) => {
            // i为点击的菜单的编号
            console.log('你点击了第:', i, '个菜单');
          }
        },
        {
          cls: '', // 自定义样式类名
          text: '编辑',
          handleClick: (i) => {
            // i为点击的菜单的编号
            console.log('你点击了第:', i, '个菜单');
          }
        }
      ]
    })
  }

  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    return (
      <div>
        {/* 页面标题组件 */}
        <PageTitle type='collapse' title='鼠标右键组件'/>
        <ContextMenu menuList={this.state.menuList}>
          <div className={styles.menuArea}>这里单击鼠标右键，展示弹出菜单</div>
        </ContextMenu>
      </div>
    )
  }
}

export default Form.create()(ContextMenuDemoView);