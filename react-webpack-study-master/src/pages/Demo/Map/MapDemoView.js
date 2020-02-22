import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Icon, Button } from 'antd';
import config from 'config/Config';

// 引入地图轨迹组件
import TrackMap from 'widget/Track/TrackView';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';

// 在视图注入module层数据
@inject('MapDemoMod')
// 在组件中可通过this.props.history.push跳转路由
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class MapDemoView extends Component {
  constructor(props, context) {
    super(props, context);
    this.stores = this.props.MapDemoMod;
    this.state = {
      // 地图打开/关闭
      visible: false,
      // 位置信息
      location: {
        // 起点的经纬度
        start: [113.346583, 23.174173],
        // 当前点的经纬度
        current: [113.355166, 23.181905],
        // 终点的经纬度
        end: [113.363749, 23.187152],
      },
      // 轨迹的路径
      paths: [
        [113.355938, 23.182339],
        [113.361045, 23.184351],
        [113.361603, 23.184628]
      ]
    }
  }

  // 点击打开弹窗
  openTrack(){
    this.setState({
      visible: true
    })
  }

  // 点击关闭弹窗
  closeTrack(){
    this.setState({
      visible: false
    })
  }

  render() {
    return (
      <div>
        <PageTitle title='地图组件演示'/>
        <p>
          <span>点击“打开轨迹”按钮，打开地图</span><br/><br/>
          <Button type='primary' onClick={ e => this.openTrack(e) }>打开轨迹</Button>
        </p>
        <TrackMap location={this.state.location} paths={this.state.paths} visible={this.state.visible} onClose={ e => this.closeTrack(e)}/>
      </div>
    )
  }

}

// 注入antd的Form对象，以便可以在组件中使用 this.props.form
export default Form.create()(MapDemoView);