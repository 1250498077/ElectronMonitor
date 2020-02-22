import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Icon } from 'antd';
// 引入简易表格
import BasicTable from 'widget/BasicTable/BasicTableView';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';

// 站点配置
import config from 'config/Config';
// 静态资源CDN前缀，页面中的图片img的src属性必须加上它
const CDN_BASE = config.CDN_BASE || '';

// 注入在config/Stores.js中注册的SimpleTableMod，以便获取store中的状态state或调用方法
@inject('SimpleTableMod')
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
// 在组件中可通过this.props.history.push跳转路由
@withRouter
class SimpleTableView extends  Component {
 constructor(props, context) {
    super(props, context);
    this.store = this.props.SimpleTableMod;
    this.state = {
      tableProps: {
        fields: [
          {
            en_name: 'name',
            zh_name:  '姓名'
          },
          {
            en_name: 'age',
            zh_name:  '年龄'
          },
          {
            en_name: 'sex',
            zh_name:  '性别'
          },
          {
            en_name: 'zw',
            zh_name:  '职务'
          },
          {
            en_name: 'gw',
            zh_name:  '岗位',
            render: (text) => {
              return <span style={{color: 'red'}}>{text}</span>
            }
          }
        ],
        table_data: {
          name: '令狐冲',
          age: 20,
          sex: '男',
          zw: '工程师',
          gw: '前端开发'
        }
      }
    }
  }

  componentDidMount (){}

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <PageTitle title='简易表格'/>
        <BasicTable tableProps={this.state.tableProps}/>
      </div>
    )
  }
}

// 注入antd的Form对象，以便可以在组件中使用 this.props.form
export default Form.create()(SimpleTableView);