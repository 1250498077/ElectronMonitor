import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Icon, Button } from 'antd';
import config from 'config/Config';

// 多级树目录
import SimpleTree from 'widget/SimpleTree/SimpleTreeView';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';

// 在视图注入module层数据
@inject('SimpleTreeDemoMod')
// 在组件中可通过this.props.history.push跳转路由
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class SimpleTreeDemoView extends Component {
  constructor(props, context){
    super(props, context);
    this.stores = this.props.SimpleTreeDemoMod;
    this.state = {
      // 是否有复选框勾选
      checkable: true,
      treeDataSimpleMode: true,
      // treeData: [
      //   { id: '0', pid: '-1', title: '类目树'},
      //   { id: '01', pid: '0', title: '服装类'},
      //   { id: '011', pid: '01', title: '男装'},
      //   { id: '012', pid: '01', title: '女装'},
      //   { id: '02', pid: '0', title: '酒类'},
      //   { id: '03', pid: '0', title: '零食类'}
      // ],
      // 树的数据，必须
      treeData: [
        {
          id: '0',
          name: '类目树',
          children: [
            {
              id: '01',
              name: '服装类',
              children: [
                { id: '011', name: '男装'},
                { id: '012', name: '女装'}
              ]
            },
            {
              id: '02',
              name: '酒类'
            },
            {
              id: '03',
              name: '零食类'
            }
          ]
        }
      ],
      // 选中节点的keys值
      selectedKeys: [],
      // 勾选节点的keys值
      checkedKeys: []
    }
  }

  // 点击选中节点 selectedKeys 选中的节点
  onSelectNode = (selectedKeys, parentKey) => {
    console.log('selectedKeys:', selectedKeys, 'parentKey:', parentKey);
    this.setState({selectedKeys});
  }

  // 点击勾选节点 checkedKeys 勾选中的节点，当checkable为true时生效
  onCheckNode = (checkedKeys, parentKey) => {
    console.log('checkedKeys:', checkedKeys, 'parentKey:', parentKey);
    this.setState({checkedKeys});
  }

  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const { treeData, checkable, selectedKeys, checkedKeys, treeDataSimpleMode } = this.state;

    return (
      <div>
        {/* 页面标题组件 */}
        <PageTitle type='collapse' title='树目录展示'/>
        <SimpleTree 
          treeData={treeData} 
          selectedKeys={selectedKeys}
          onSelectNode={this.onSelectNode}
          checkable={checkable}
          checkedKeys={checkedKeys}
          onCheckNode={this.onCheckNode}
          treeDataSimpleMode={treeDataSimpleMode}
        />
      </div>
    )
  }
}

export default Form.create()(SimpleTreeDemoView);