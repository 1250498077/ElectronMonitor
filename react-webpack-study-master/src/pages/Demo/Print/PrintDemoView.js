import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Icon, Button, Row, Col } from 'antd';

import config from 'config/Config';
// 打印组件
import Print from 'widget/Print/PrintView';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';
// 引入页面样式
import styles from 'widget/Print/PrintLess.less';
// 多个样式工具函数
import cx from 'classnames';

import SeparatePrint from './SeparatePrint/SeparatePrintView'
import SinglePrint from './SinglePrint/SinglePrintView'
import WaterMarkPrint from './WaterMarkPrint/WaterMarkPrintView'


// 在视图注入module层数据
@inject('PrintDemoMod')
// 在组件中可通过this.props.history.push跳转路由
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class PrintDemoView extends Component {
  constructor(props, context){
    super(props, context);
    this.stores = this.props.PrintDemoMod;
    this.state = {
      beginPrint: false,
      printIframe: ''
    }
  }

  // 延迟N秒执行
  delay(t){
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1);
      }, t || 2000);
    })
  }

  // 设置到状态
  setBeginPrint(beginPrint){
    // this作用域提升
    let that = this;
    return new Promise((resolve, reject) => {
      that.setState({
        beginPrint
      }, () => {
        resolve(1);
      });
    });
  }

  // 分离打印
  async handleSeparatePrint () {
    const printIframe = (
      <div  className={styles.printIframe} style={{opacity:0, display: 'none'}}>
        <SeparatePrint />
      </div>
    )
    this.setState({ printIframe }, async () => {
      // 打开打印机
      await this.setBeginPrint(true);
      // 延迟2秒
      await this.delay(2000);
      // 恢复回默认状态
      await this.setBeginPrint(false);
    })
  }
  // 通用打印
  async handleSinglePrint() {
    const printIframe = (
      <div  className={styles.printIframe} style={{opacity:0, display: 'none'}}>
        <SinglePrint />
      </div>
    )
    this.setState({ printIframe }, async () => {
      // 打开打印机
      await this.setBeginPrint(true);
      // 延迟2秒
      await this.delay(2000);
      // 恢复回默认状态
      await this.setBeginPrint(false);
    })
  }
  // 水印打印
  async handleWaterMarkPrint() {
    const printIframe = (
      <div  className={styles.printIframe} style={{opacity:0, display: 'none'}}>
        <WaterMarkPrint />
      </div>
    )
    this.setState({ printIframe }, async () => {
      // 打开打印机
      await this.setBeginPrint(true);
      // 延迟2秒
      await this.delay(2000);
      // 恢复回默认状态
      await this.setBeginPrint(false);
    })
  }

  // 组件已插入真实DOM
  componentDidMount(){
    console.log('componentDidMount')
  }

  render(){

    return (
      <div>
        {/* 页面标题组件 */}
        <PageTitle type='collapse' title='打印组件'/>
        <span>点击“打印预览”按钮，打开打印机</span><br/><br/>
        <Button type='primary' onClick={ e => {this.handleSeparatePrint(e)} }>分页打印</Button>
        <Button type='primary' onClick={ e => {this.handleSinglePrint(e)} } style={{marginLeft: '20px'}}>连续通用打印</Button>
        <Button type='primary' onClick={ e => {this.handleWaterMarkPrint(e)} } style={{marginLeft: '20px'}}>水印打印</Button>
        <Print
          isIframe={true}
          inserHead
          beginPrint={this.state.beginPrint}
          backgroundImgMark='./watermark.PNG'
          backgroundFontMark='xxx科技'
          scale='0.5'
          opacity='0.1'
          backgroundRowMarkNum={2}
          backgroundColumnMarkNum={2}
        >
          {this.state.printIframe}
        </Print>
      </div>
    )
  }
}

export default Form.create()(PrintDemoView);