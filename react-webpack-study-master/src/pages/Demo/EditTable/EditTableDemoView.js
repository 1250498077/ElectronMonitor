import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Icon } from 'antd';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';
// 可编辑表格
import EditTable from 'widget/EditTable/EditTableView';

// 站点配置
import config from 'config/Config';
// 静态资源CDN前缀，页面中的图片img的src属性必须加上它
const CDN_BASE = config.CDN_BASE || '';


// 注入在config/Stores.js中注册的EditTableDemoMod，以便获取store中的状态state或调用方法
@inject('EditTableDemoMod')
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
// 在组件中可通过this.props.history.push跳转路由
@withRouter
class EditTableView extends  Component {
 constructor(props, context) {
    super(props, context);
    this.store = this.props.EditTableDemoMod;
    this.state = {
      fields: [
        {
          en_name: 'real_name',
          zh_name: '姓名',
          elem_type: 'input',
          width: 180
        },
        {
          en_name: 'age',
          zh_name: '年龄',
          elem_type: 'input',
          width: 180
        }
      ],
      datas: [
        {
          key: 1,
          real_name: '张三',
          age: 20
        },
        {
          key: 2,
          real_name: '李四',
          age: 22
        }
      ],
      actions: [
        {
          func_name: 'onDelete',
          label: '删除'
        }
      ]
    }
  }

  componentDidMount (){}

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <PageTitle title='可编辑表格'/>
        <EditTable 
          leftTitle='字段设置'
          etFields={this.state.fields}
          etDatas={this.state.datas}
          etActions={this.state.actions}
          onOk={e => { console.log('e:', e)}}
        />
      </div>
    )
  }
}

// 注入antd的Form对象，以便可以在组件中使用 this.props.form
export default Form.create()(EditTableView);