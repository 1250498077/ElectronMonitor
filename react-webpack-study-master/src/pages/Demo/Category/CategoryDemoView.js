import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Icon } from 'antd';
import config from 'config/Config';

// 引入类目树组件
import CategoryTree from 'widget/CategoryTree/CategoryTreeView';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';

// 在视图注入module层数据
@inject('CategoryDemoMod')
// 在组件中可通过this.props.history.push跳转路由
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class CategoryDemoView extends Component {
  constructor(props, context) {
    super(props, context);
    this.stores = this.props.CategoryDemoMod;
    this.state = {
      /* 类目树的数据*/
      categoryList: [
        {
          id: '0',
          name: '部门树',
          children: [
            {
              id: '01',
              name: '产品中心',
              children: [
                {
                  id: '011',
                  name: '中台开发',
                },
                {
                  id: '012',
                  name: '前台开发',
                  children: [
                    {
                      id: '0121',
                      name: 'PC端开发'
                    },
                    {
                      id: '0122',
                      name: '手机端开发'
                    }
                  ]
                }
              ]
            },
            {
              id: '02',
              name: '资源能力中心',
              children: [
                {
                  id: '021',
                  name: '汽车事业部',
                },
                {
                  id: '022',
                  name: '地产事业部'
                }
              ]
            }
          ]
        }
      ]
    }
  }

  // 点击选中节点 selectedKeys 选中的节点
  onSelectNode = (selectedKeys, parentKey) => {
    console.log('selectedKeys:', selectedKeys, 'parentKey:', parentKey);
  }

  // 添加节点处理 item 选中的节点数据
  onAddNode = (item, parentKey) => {
    console.log('add item:', item, 'parentKey:', parentKey);
  }

  // 删除节点处理  item 删除项的的节点数据
  onRemoveNode = (item, parentKey) => {
    console.log('remove item:', item, 'parentKey:', parentKey);
  }

  // 上移
  onMoveUp = () => {
    console.log('move up')
  }

  // 下移
  onMoveDown = () => {
    console.log('move down')
  }

  // 置顶
  onMoveTop = () => {
    console.log('move top')
  }

  // 置底
  onMoveBottom = () => {
    console.log('move bottom')
  }

  render() {
    return (
      <div>
        <PageTitle title='类目树组件'/>
        {
          this.state.categoryList.length > 0 && (
            <CategoryTree 
              categoryList={this.state.categoryList} 
              onSelectNode={this.onSelectNode}
              onAddNode={this.onAddNode}
              onRemoveNode={this.onRemoveNode}
              onMoveUp={this.onMoveUp}
              onMoveDown={this.onMoveDown}
              onMoveTop={this.onMoveTop}
              onMoveBottom={this.onMoveBottom}
            >
            <br/>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这里是你可以自定义的内容</p>
            </CategoryTree>
          )
        }
      </div>
    )
  }

}

// 注入antd的Form对象，以便可以在组件中使用 this.props.form
export default Form.create()(CategoryDemoView);