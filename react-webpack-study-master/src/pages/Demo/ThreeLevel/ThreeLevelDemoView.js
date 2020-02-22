import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Icon, Button } from 'antd';
import config from 'config/Config';

// 单选表格组件
import ThreeLevel from 'widget/ThreeLevel/ThreeLevelView';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';

// 在视图注入module层数据
@inject('ThreeLevelDemoMod')
// 在组件中可通过this.props.history.push跳转路由
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class ThreeLevelDemoView extends Component {
  constructor(props, context){
    super(props, context);
    this.stores = this.props.ThreeLevelDemoMod;
    this.state = {
      selectProps: {
        // 节点的名称字段名 - 如title、name等
        node_field: 'title',
        // 节点的值字段名 - 如id、value等
        node_id_field: 'value',
        // 节点父ID字段名 - 如 parent_value, pid, parentId等
        node_pid_field: 'parent_value',

        // - 方式1: 直接传入方式 - 初步封装方式，开发者需实现获取数据逻辑，封装度低
        // 三级联动的数据，json的key要跟 node_field、node_id_field、node_pid_field 对应
        cmpt_items: [
          { value: '001', title: '广东'},
          { value: '002', title: '广西'},
          { value: '003', title: '海南'},
          { value: '001001', title: '广州', parent_value: '001'},
          { value: '001002', title: '深圳', parent_value: '001'},
          { value: '001003', title: '珠海', parent_value: '001'},
          { value: '002001', title: '南宁', parent_value: '002'},
          { value: '002002', title: '柳州', parent_value: '002'},
          { value: '002003', title: '桂林', parent_value: '002'},
          { value: '001001001', title: '天河', parent_value: '001001'},
          { value: '001001002', title: '越秀', parent_value: '001001'},
          { value: '001001003', title: '海珠', parent_value: '001001'},
          { value: '001002001', title: '福田', parent_value: '001002'},
          { value: '001002002', title: '罗湖', parent_value: '001002'},
          { value: '001002003', title: '南山', parent_value: '001002'},
          { value: '002001001', title: '安吉', parent_value: '002001'},
          { value: '002001002', title: '朝阳', parent_value: '002001'},
          { value: '002001003', title: '邕宁', parent_value: '002001'}
        ],
        // 方式2: 以api接口描述方式 - 深层次封装方式，开发者无需实现获取数据逻辑，封装适中
        api_url: '',
        api_params: '',
        api_method: '',
        api_headers: {},
      }
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
        <PageTitle type='collapse' title='三级联动组件'/>
        <ThreeLevel selectProps={this.state.selectProps}></ThreeLevel>
      </div>
    )
  }
}

export default Form.create()(ThreeLevelDemoView);