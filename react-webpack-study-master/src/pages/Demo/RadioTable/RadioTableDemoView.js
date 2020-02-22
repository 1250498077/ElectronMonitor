import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Icon, Button } from 'antd';
import config from 'config/Config';

// 单选表格组件
import RadioTable from 'widget/RadioTable/RadioTableView';
// 页面标题
import PageTitle from 'widget/PageTitle/PageTitleView';

// 在视图注入module层数据
@inject('RadioTableDemoMod')
// 在组件中可通过this.props.history.push跳转路由
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class RadioTableDemoView extends Component {
  constructor(props, context) {
    super(props, context);
    this.stores = this.props.RadioTableDemoMod;
    this.state = {
      modelList: [{
          "name": "商铺管理",
          "tag": "shopMgmt",
          "ck": ["11", "12"],
          "list": [{
              "name": "类目",
              "tag": "type",
              "childCk": [],
              "childList": [{
                  "label": "类目查看",
                  "value": "01"
                },
                {
                  "label": "类目查看",
                  "value": "02"
                },
                {
                  "label": "类目删除",
                  "value": "03"
                },
                {
                  "label": "类目编辑",
                  "value": "04"
                },
                {
                  "label": "类目上移 / 下移  / 置顶 / 置底",
                  "value": "05"
                }
              ]
            },
            {
              "name": "属性",
              "tag": "type",
              "childCk": ["11", "12"],
              "childList": [{
                  "label": "属性查看",
                  "value": "11"
                },
                {
                  "label": "属性查看",
                  "value": "12"
                },
                {
                  "label": "属性删除",
                  "value": "13"
                },
                {
                  "label": "属性编辑",
                  "value": "14"
                },
                {
                  "label": "属性上移 / 下移  / 置顶 / 置底",
                  "value": "15"
                }
              ]
            }
          ]
        },
        {
          "name": "商城",
          "tag": "mall",
          "ck": [],
          "list": [{
            "name": "类目",
            "tag": "type",
            "childCk": [],
            "childList": [{
                "label": "类目查看",
                "value": "21"
              },
              {
                "label": "类目查看",
                "value": "22"
              },
              {
                "label": "类目删除",
                "value": "23"
              },
              {
                "label": "类目编辑",
                "value": "24"
              },
              {
                "label": "类目上移 / 下移  / 置顶 / 置底",
                "value": "25"
              }
            ]
          }]
        }

      ]
    }
  }

  // 复选框勾选请求
  sendReq = (oldList, newList) => {
    console.log('复选框请求 oldList：', oldList, 'newList:', newList);
    this.setState({
      modelList: newList
    })
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    return (
      <div>
        {/* 页面标题组件 */}
        <PageTitle type='collapse' title='单选表格组件'/>
        <RadioTable modelList={this.state.modelList} sendReq={this.sendReq}></RadioTable>
      </div>
    )
  }
}

export default Form.create()(RadioTableDemoView);