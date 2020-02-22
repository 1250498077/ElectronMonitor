import React from 'react';
import { Modal, Form, message, Icon } from 'antd';

import { get } from 'lodash';
import cx from 'classnames';
import styles from './TrackLess.less';

const FormItem = Form.Item;
const { Component } = React
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
  },
};

export default class Track extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      map: null,
      address: []
    }
  }

  // 已加载组件，收到新属性时调用
  componentWillReceiveProps(nextProps){
    if(nextProps.visible){
      this.loadMap();
    }
  }

  componentDidMount(prevProps, prevState) {
    this.loadMap();
  }

  loadMap(){
    let self = this;
    try{
      let map = new AMap.Map('track_map_container', {
        resizeEnable: true, 
        zoom: 13  
      });
      self.setState({map});
      AMapUI.loadUI(['overlay/SimpleMarker'], function (SimpleMarker) {
        self.initMarker(SimpleMarker, map);
      });
      AMapUI.load(['ui/misc/PathSimplifier'], function (PathSimplifier) {
        if (!PathSimplifier.supportCanvas) {
          return message.warning('当前环境不支持 Canvas！');
        }
        self.initPage(PathSimplifier, map);
      });

      if(this.props.location && this.props.location.start){
        self.getAddrByPointer();
      }

    }catch(e){
      console.warn('高德地图无法加载！' + e);
    }
  }

  initMarker(SimpleMarker, map) {
    let { paths } = this.props;
    if (paths && paths.length > 0) {
      new SimpleMarker({
        iconLabel: {
          innerHTML: '起',
          style: { color: '#fff' }
        },
        iconTheme: 'default',
        iconStyle: 'blue',
        map: map,
        position: paths && paths[0]
      });
      new SimpleMarker({
        iconLabel: {
          innerHTML: '终',
          style: { color: '#fff' }
        },
        iconTheme: 'default',
        iconStyle: 'blue',
        map: map,
        position: paths && paths.length > 0 ? paths[paths.length - 1] : ''
      });
    }
  }

  componentWillUnmount(){
    console.log('组件即将消失');
  }

  initPage(PathSimplifier, map) {
    let { paths } = this.props;
    let pathSimplifierIns = new PathSimplifier({
      zIndex: 100,
      map: map,
      getPath: function (pathData, pathIndex) {
        //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
        return pathData.path;
      },
      getHoverTitle: function (pathData, pathIndex, pointIndex) {
        //返回鼠标悬停时显示的信息
        if (pointIndex >= 0) {
          //鼠标悬停在某个轨迹节点上
          return pathData.name + '，点:' + pointIndex + '/' + pathData.path.length;
        }
        //鼠标悬停在节点之间的连线上
        return pathData.name + '，点数量' + pathData.path.length;
      },
      renderOptions: {
        //轨迹线的样式
        pathLineStyle: {
          strokeStyle: 'red',
          lineWidth: 6,
          dirArrowStyle: true
        }
      }
    });
    pathSimplifierIns.setData([{
      name: '物流轨迹',
      path: paths || []
    }]);
  }

  // 处理关闭事件
  handleClose(e){
    self = this;
    e.stopPropagation();
    if(!!self.props.onClose){
      self.setState({map: null}, () => {
        self.props.onClose(e);
      })
    }
  }

  // 获取经纬度对应的地址
  getAddrByPointer(){
    let lnglats = [], self = this;
    lnglats.push(this.props.location.start);
    lnglats.push(this.props.location.current);
    lnglats.push(this.props.location.end);

    let geocoder = null;
    if(!geocoder){
      geocoder = new AMap.Geocoder({
        // city: "010", // 城市设为北京，默认：“全国”
        radius: 1000 //范围，默认：500
      });
    }

    // 批量通过经纬度获取地址
    geocoder.getAddress(lnglats, function(status, result) {
      var address = []
      if (status === 'complete'&&result.regeocodes.length) {
        for(var i=0;i< result.regeocodes.length;i+=1){
          address.push(result.regeocodes[i].formattedAddress);
        }
      }else{
        console.warn(JSON.stringify(result))
      }
      self.setState({address})
    });
  }

  render() {
    const { location, visible } = this.props;
    const current = get(location, 'current', '');
    const startAddress = get(this.state.address, '[0]', '');
    const currentAddress = get(this.state.address, '[1]', '');
    const endAddress = get(this.state.address, '[2]', '');

    return (
      <div>
        <div className={visible? 'ant-modal-mask': styles.hide} onClick={e => this.handleClose(e)}></div>
        <div className={cx(styles.trackInfo, visible? styles.visible: styles.hide)}>
          <div className={styles.title}>
            <h3 className={styles.leftText}>{this.props.title || '轨迹'}</h3>
            <span className={styles.rightBtn} onClick={e => this.handleClose(e)}><Icon type="close" /></span>
          </div>
          <div id="track_map_container" style={{ width: 650, height: 400, marginTop: '38px', ...this.props.style }} className={'iblock'}></div>
          <div className={styles.right}>
            <Form autoComplete="off" className="auto-wrap">
              <FormItem {...formItemLayout} label="起点">
                {startAddress}
              </FormItem>
              <FormItem {...formItemLayout} label={current ? '当前位置' : '终点'}>
                {currentAddress || endAddress}
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}