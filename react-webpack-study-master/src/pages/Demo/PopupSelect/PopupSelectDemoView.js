import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Button} from 'antd';

import config from 'config/Config';
// 弹出选择框
import PopupSelect from 'widget/PopupSelect/PopupSelectView';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';
// 样式工具
import cx from 'classnames';

// 在视图注入module层数据
@inject('PopupSelectDemoMod')
// 在组件中可通过this.props.history.push跳转路由
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class PopupSelectDemoView extends Component {
  constructor(props, context){
    super(props, context);
    this.stores = this.props.PopupSelectDemoMod;
    this.state = {
      // 是否弹出
      visible: false
    }
  }

  // 打开/关闭对话框
  toggleDialog(visible){
    this.setState({
      visible
    })
  }

  // 点击确定返回处理
  handleOk(data){
    console.log('返回的数据是：', data);
    this.setState({
      visible: false
    })
  }

  // 点击取消处理
  handleCancel(e){
    this.setState({
      visible: false
    })
  }

  // 插入真实DOM
  componentDidMount(){}

  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    let pageProps = {
      // 界面描述部分
      ui: {
        api_url: 'emp/list', // 接口地址
        method: 'GET', // 接口请求方式
        params: 'pageNum=1&pageSize=10', // 接口默认参数
        search_bar:{ // 查询栏
          fields: [
            {
              en_name: 'name', // 字段英文名
              zh_name: '姓名', // 字段中文名
              elem_type: 'Input', // 页面元素类型
              elem_valid_type: 'string', // 页面元素校验类型，使用antd的校验类型，支持正则表达式
            },
            {
              en_name: 'age',
              zh_name: '年龄',
              placeholder: '请输入年龄',
              elem_type: 'Input',
              elem_valid_type: 'string',
            },
            {
              en_name: 'sex',
              zh_name: '性别',
              placeholder: '请选择性别',
              elem_type: 'Select',
              elem_valid_type: 'string'
            },
            {
              en_name: 'zw',
              zh_name: '职务',
              placeholder: '请选择职务',
              elem_type: 'Select',
              elem_valid_type: 'string'
            },
            {
              en_name: 'gw',
              zh_name: '岗位',
              placeholder: '请选择岗位',
              elem_type: 'Select',
              elem_valid_type: 'string'
            },
          ],
        },
        // 表格配置项
        table: [
          {
            status_params: 'tag=1',
            status_text: '全部',
            badge_num: 10,
            extProps: {
              rowSelection: true,
            },
            fields: [ // 表头字段列，兼容antd的其它字段
              {
                en_name: 'name', // 字段英文名
                zh_name: '姓名', // 字段中文名
              },
              {
                en_name: 'age',
                zh_name: '年龄',
                width: 88,
                // 数字一般右对齐
                align: 'right'
              },
              {
                en_name: 'sex',
                zh_name: '性别',
                width: 68
              },
            ]
          },
          {
            status_params: 'tag=2',
            status_text: '已支付',
            badge_num: 8
          }
        ]
      },
      // 业务数据部分
      biz: {
        queryForm: {},
        syncBackCbf: (biz) => {

        }
      }
    }

    return (
      <div>
        {/* 页面标题组件 */}
        <PageTitle type='collapse' title='弹出选择框'/>
        <Button type='primary' onClick={(e) => this.toggleDialog(true)}>打开多选弹框</Button>
        <PopupSelect
          title='员工选择'
          visible={this.state.visible}
          width={1000}
          pageProps={pageProps}
          handleOk={data => this.handleOk(data)}
          handleCancel={e => this.handleCancel(e)}
        />
      </div>
    )
  }
}

export default Form.create()(PopupSelectDemoView);