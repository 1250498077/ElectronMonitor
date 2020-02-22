import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Row, Col, Form, TreeSelect, Select, Table, Input, Button, Icon, Checkbox, Popconfirm, message } from 'antd';

import $ from 'jquery';
import cx from 'classnames';
import { cloneDeep, get } from 'lodash';

import request from 'utils/request';
import config from 'config/Config';
import styles  from './PopupSelectLess.less';
import ListPage from 'widget/ListPage/ListPageView';

const FormItem = Form.Item;

/*
* 产品选择组件
*/
export default class extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context);
    this.state = {
      checkedValues: []
    }
  }

  //Modal初始化
  componentWillMount() {

  }

  //准备：即将被重新渲染，状态未变化
  componentWillUpdate(nextProps, nextState) {

  }

  //完成：正在被重新渲染，状态已变化
  componentDidUpdate(prevProps, prevState) {}

  // 已加载组件，收到新属性时调用
  componentWillReceiveProps(nextProps) {

  }

  // 插入真实 DOM
  componentDidMount() {}

  //弹窗的确定按钮
  handleConfirm(){
    if(this.props.handleOk){
      this.props.handleOk(this.state.checkedValues);
    }
  }

  //弹窗的取消按钮
  handleCancel(e){
    if(this.props.handleCancel){
      this.props.handleCancel(e);
    }
  }

  //弹窗的查询按钮
  handleSearch() {

  }

  //弹窗的重置按钮
  handleReset() {

  }

  // 列表的选择按钮
  handleSelect(item) {

  }

  handleSelectAll() {

  }


  render() {
    let { pageProps } = this.props;

    return (
      <div>
        <Modal
          title={this.props.title || '选择'}
          visible={this.props.visible}
          onOk={this.handleConfirm.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          width={this.props.width || 520}
        >
          <ListPage pageProps={pageProps} onCheck={ checkedValues => this.setState({checkedValues})}/>
        </Modal>
      </div>
    )
  }
}