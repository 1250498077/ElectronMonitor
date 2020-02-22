import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Button} from 'antd';

import config from 'config/Config';
const CDN_BASE = config.CDN_BASE || '';
// 图片裁剪组件
import ImgCutting from 'widget/ImgCutting/ImgCuttingView';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';
// 样式工具
import cx from 'classnames';

// 在视图注入module层数据
@inject('ImgCuttingDemoMod')
// 在组件中可通过this.props.history.push跳转路由
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class ImgCuttingDemoView extends Component {
  constructor(props, context){
    super(props, context);
    this.stores = this.props.ImgCuttingDemoMod;
    this.state = {
      visible: false,
      imgUrl: `${CDN_BASE}/assets/imgs/desktop.png`
    }
  }

  // 插入真实DOM
  componentDidMount(){}

  // 处理确定事件
  handleOk(imgUrl){
    console.log('裁剪后上传的图片地址为：', imgUrl);
    this.toggleDialog(false);
  }

  // 处理关闭事件
  handleClose(e){
    this.toggleDialog(false);
  }

  // 打开/关闭裁剪对话框
  toggleDialog(visible){
    this.setState({
      visible
    });
  }

  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    return (
      <div>
        {/* 页面标题组件 */}
        <PageTitle type='collapse' title='图片裁剪'/>
        <p>点击“裁剪图片”进行裁剪</p>
        <Button type='primary' onClick={(e) => this.toggleDialog(true)}>裁剪图片</Button>
        <ImgCutting 
          okCbk={e => this.handleOk(e)} 
          closeCbk={e => this.handleClose(e)}
          minCropBoxWidth={400}
          minCropBoxHeight={300}
          aspectRatio={4/3}
          imgUrl={this.state.imgUrl}
          visible={this.state.visible}
        />
      </div>
    )
  }
}

export default Form.create()(ImgCuttingDemoView);