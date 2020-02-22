// 加载React
import React from 'react'
// 加载Component
import { Component } from 'react'

import { parse } from 'qs'
// 引入antd的组件
import { Carousel, Badge, message, Menu, Row, Col } from 'antd'

// 站点配置
import config from 'config/Config';

import styles from './MsgListLess.less'
import { myList } from './MsgListServ'

// 导出组件
export default class extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context)
    this.state = {
      // 我的消息列表
      myMsgList: []
    }
  }

  //准备：即将被重新渲染，状态未变化
  componentWillMount() {}

  //准备：即将被重新渲染，状态未变化
  componentWillUpdate(nextProps, nextState) {}

  //完成：正在被重新渲染，状态已变化
  componentDidUpdate(prevProps, prevState) {}

  // 已加载组件，收到新属性时调用
  componentWillReceiveProps(nextProps) {}

  // 已插入真实DOM
  componentDidMount() {
    let self = this
    self.getMsgList()
  }

  // 是否触发render函数
  shouldComponentUpdate(nextProps, nextState) {
    let self = this
    // 若不配置消息开关，则不渲染
    if(!config.isMsgNotify){
      return false
    }else{
      return true
    }
  }

  //组件将被卸载
  componentWillUnmount(){}

  // 获取消息列表
  async getMsgList(){
    try{
      if(!config.isMsgNotify) return false
      // 查询我的消息
      let result = await myList(parse({ status: 0, pageNum: 1, pageSize: 5}))

      if('0' === '' + result.resultCode){
        // 设置到状态机
        this.setState({ myMsgList: result.data.list })
      }

    }catch(e){
      message.error(e || '未知的查询消息异常')
    }
  }

  // 消息点击
  msgChange(key){
    console.log('key:', key);
  }

  // 渲染消息列表
  renderMsgList(){
    // 消息列表不为空时
    if(0 !== this.state.myMsgList.length){
      return (
        <div>
          <div className={styles.notice}>
            <Row>
              <Col span={12} className={styles.icon}>
                <i className="iconfont icon-xiaoxi"></i>
                <Badge count={ this.state.myMsgList.length } style={{backgroundColor:'#FFB840',right:'-13px',top:'-6px',width:'30px',boxShadow: 'none'}}/>
              </Col>
              <Col span={12}>
                <span className={styles.txt}>新消息</span>
              </Col>
            </Row>
          </div>
          {/*
          <Carousel vertical autoplay>
            {
              this.state.myMsgList && this.state.myMsgList.length > 0 && (
                this.state.myMsgList.map((item,i) => {
                  return <div key={'msg_'+i}><a href="/messageManage/myMessage">{item.title}</a></div>
                })
              )
            }
          </Carousel>
          */}
        </div>
      )

    }else{
      if(config.isMsgNotify){
        return (
          <div className={styles.notice} style={{width:51}}>
            <i className="iconfont icon-xiaoxi"></i>
            <Badge count={ this.state.myMsgList.length } style={{backgroundColor:'#FFB840',right:'-13px',top:'-19px',width:'30px',boxShadow: 'none'}}/>
          </div>
        )
      }else{
        return ''
      }
    }
  }

  // 初始状态或状态变化会触发render
  render(ReactElement, DOMElement, callback) {
    return (
      <div>{ this.renderMsgList() }</div>
    )
  }
}
