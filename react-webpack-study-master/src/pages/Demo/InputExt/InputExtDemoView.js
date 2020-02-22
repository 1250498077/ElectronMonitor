import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Row, Col, Button} from 'antd';

import config from 'config/Config';
const CDN_BASE = config.CDN_BASE || '';

import InputExt from 'widget/InputExt/InputExtView';
const { Phone, IDcard, IP, URL, Money, CharValid, EnNum, Chinese, Tel } = InputExt;

// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';
// 样式工具
import cx from 'classnames';

// 在视图注入module层数据
@inject('InputExtDemoMod')
// 在组件中可通过this.props.history.push跳转路由
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class InputExtDemoView extends Component {
  constructor(props, context){
    super(props, context);
    this.stores = this.props.InputExtDemoMod;
    this.state = {
      reg_email: '123',
      reg_idCard: '',
      URL: ''
    }
  }

  // 插入真实DOM
  componentDidMount(){}


  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }


  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    const rulesIdCard = [
      { required: true, message: '请输身份证号'},
      { type: 'IDcard', pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号出错啦!!!!'}
    ]

    return (
      <div>
        {/* 页面标题组件 */}
        <PageTitle type='collapse' title='输入框扩展组件'/>
        <Form>
          <Row>
            <Col span={8}>
              <InputExt
                label='邮箱'
                en_name='reg_email'
                value={this.state.reg_email}
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱!!!' }
                ]}
                onChange={this.handleChange}
              />
              <Phone
                label='注册手机'
                en_name='reg_phone'
                rules={[
                  { required: true, message: '请输入手机'}
                ]}
              />
              <IDcard
                value={this.state.reg_idCard}
                label='身份证'
                en_name='reg_idCard'
                rules={rulesIdCard}
                onChange={this.handleChange}
              />
              <IP
                value={this.state.ip}
                label='IP地址'
                en_name='IP'
                onChange={this.handleChange}
              />
              <Money
                value={this.state.money}
                label='金额'
                en_name='money'
                onChange={this.handleChange}
              />
              <URL
                value={this.state.url}
                label='URL'
                en_name='url'
                onChange={this.handleChange}
              />
              <CharValid
                value={this.state.charValid}
                label='字符集'
                en_name='CharValid'
                onChange={this.handleChange}
              />
              <EnNum
                value={this.state.enNum}
                label='英文数字字符集'
                en_name='enNum'
                onChange={this.handleChange}
              />
              <Chinese
                value={this.state.chinese}
                label='中文字符集'
                en_name='chinese'
                onChange={this.handleChange}
              />
              <Tel
                value={this.state.tel}
                label='中国区固定电话字符集'
                en_name='tel'
                onChange={this.handleChange}
              />
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

export default Form.create()(InputExtDemoView);