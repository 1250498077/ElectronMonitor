import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Icon, Button, DatePicker, Row, Col } from 'antd';

// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';

// 圆柱图
import { startCirChats } from './CirChats';
// 折线图
import { startLineCharts } from './LineChats';
// 饼图
import { startPieChats } from './PieChats';
// 雷达图
import { startLeiChats } from './LeiChats';
// 3D地球
import { start3DCarts } from './3DCharts';

@withRouter
class HomeView extends Component {


  componentDidMount(){
    startCirChats('showCir');
    startLineCharts('showLine');
    startPieChats('showPie');
    startLeiChats('showLei');
    // start3DCarts('show3D');
  }

  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    console.log('info render');

    return (
      <div>
        <PageTitle title='默认首页'/>
        <p>图表示例</p>
{/*        <Row>
          <Col span={24}>
            <div id='show3D' style={{width: '100%', height: '600px'}}></div>
          </Col>
        </Row>*/}
        <p>&nbsp;</p>
        <Row>
          <Col span={12}>
            <div id='showCir' style={{width: '100%', height: '400px'}}></div>
          </Col>
          <Col span={12}>
            <div id='showLine' style={{width: '100%', height: '400px'}}></div>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <div id='showPie' style={{width: '100%', height: '400px'}}></div>
          </Col>
          <Col span={12}>
            <div id='showLei' style={{width: '100%', height: '400px'}}></div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <p>左侧菜单列表说明:</p>
            <ol>
              <li>支持无限级</li>
              <li>嵌套子菜单，使用children关键字</li>
              <li>建议最大层级为三级，可以避免因递归遍历产生的渲染卡慢问题</li>
            </ol>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Form.create()(HomeView);