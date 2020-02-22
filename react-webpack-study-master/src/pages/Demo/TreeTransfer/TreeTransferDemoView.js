import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Icon, Button } from 'antd';
import config from 'config/Config';

// 树形穿梭框
import TreeTransfer from 'widget/TreeTransfer/TreeTransferView';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';

// 在视图注入module层数据
@inject('TreeTransferDemoMod')
// 在组件中可通过this.props.history.push跳转路由
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class TreeTransferDemoView extends Component {
  constructor(props, context){
    super(props, context);
    this.stores = this.props.TreeTransferDemoMod;
    this.state = {
      // 左侧的产品属性
      dataSource: [
        {
          "id": "1173522726990653440",
          "name": "智芯单品",
          "children": [
          {
            "id": "1173522727091316736",
            "name": "智芯单品",
            "parentId": "1173522726990653440",
            "parentName": "智芯单品"
          }]
        },
        {
          "id": "1173522748954126336",
          "name": "蜜儿餐",
          "children": [
          {
            "id": "1173522749044303872",
            "name": "蜜儿餐",
            "parentId": "1173522748954126336",
            "parentName": "蜜儿餐"
          }]
        },
        {
          "id": "1173522761677547520",
          "name": "空净",
          "children": [
          {
            "id": "1173522761768773632",
            "name": "空净",
            "parentId": "1173522761677547520",
            "parentName": "空净"
          }]
        }
      ],
      // 选中到右侧的产品属性
      selectedData: [{
        id: '1173522749044303872',
        parentId: '1173522748954126336'
      }],
      initFlag: false
    }
  }

  // 穿梭移动时触发
  onTransfer(data){
    this.setState({
      show: !this.state.show
    })
  }

  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    return (
      <div>
        {/* 页面标题组件 */}
        <PageTitle type='collapse' title='树形穿梭框'/>
        <TreeTransfer
          titles={['未选择产品属性', '已选产品属性']}
          selectedData={this.state.selectedData}
          dataSource={this.state.dataSource}
          // childrenKey='children' 子节点的键值，默认children
          notFoundContent="暂无选中属性" // 没有数据时的提示
          dataCbk={(data) => this.onTransfer(data)}
          initFlag={this.state.initFlag}
        />
      </div>
    )
  }
}

export default Form.create()(TreeTransferDemoView);