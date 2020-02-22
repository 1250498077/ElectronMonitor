// 加载React
import React from 'react';
// 加载Component
import { Component } from 'react';
// 路由对象
import { withRouter } from 'react-router-dom';
// Cookie对象
import Cookie from 'js-cookie';

// 引入antd的组件
import { Menu, Icon, Dropdown, Select, message, Row, Col } from 'antd';
// 站点配置
import config from 'config/Config';
// 加载当前组件样式
import styles  from './HeaderBarLess.less';
// 静态资源CDN前缀
const CDN_BASE = config.CDN_BASE || '';

// 引入组织机构组件
import OrgList from 'widget/OrgList/OrgListView';
// 引入我的消息组件
import MsgList from 'widget/MsgList/MsgListView';
// 引入修改密码对话框
import UpdatePwd from 'widget/UpdatePwd/UpdatePwdView';
// 样式管理
import cx from 'classnames';
// Cookie localStorage等的存储管理
import { clearCookie } from 'utils/store';

// 是否已加载成功
let loadedSuccess = false

@withRouter
// 导出组件
export default class extends Component{

  // 构造函数
  constructor(props, context) {
    super(props, context);
    this.state = {
      updatePwdFlag: false,
    }
  }

  // 已插入DOM
  componentDidMount(){
    let self = this
    loadedSuccess = true
  }

  // 比较对话框状态，已确保是否需要重新渲染
  getPwdDlgFlag(nextState){
    if('' + this.state.updatePwdFlag === '' + nextState.updatePwdFlag){
      return false
    }else{
      return true
    }
  }

  // 执行退出
  async doLogout(){
    let self = this
    // // 注销登录
    // let { resultCode, resultMsg } = await delCacheUser({})

    // if('0' !== '' + resultCode){
    //   messageInform(resultMsg || '注销失败', 'error')
    //   return false
    // }

    // 清除Cookie
    clearCookie()
    // 注销成功提示
    message.success('注销成功')

    // 跳转到登录页
    this.props.history.push('/login')
  }

  // 打开密码对话框
  showPwdDlg(e){
    this.setState({
      updatePwdFlag: true
    }, () => {
      console.log('this.state.updatePwdFlag:', this.state.updatePwdFlag)
    })
  }

  // 关闭密码对话框
  hidePwdDlg(e, name){
    if (name === 'onOk') {
      // 清除Cookie
      clearCookie()
      this.setState({
        updatePwdFlag: false
      })
      // 跳转到登录页
      hashHistory.push('/login')
    } else {
      this.setState({
        updatePwdFlag: false
      })
    }
  }

  // 下拉菜单点击事件
  handleClickMenu(e){
    let self = this
    // 点击那一项
    switch('' + e.key){
      case 'logout':
        // 退出登录
        self.doLogout()
        break
      case 'forgetPassword':
        self.showPwdDlg(e)
        break
      default:
        console.log('unknown key')
    }
  }

  // 点击用户登录信息的下拉菜单
  getDropDownMenu(){
    return (
      <Menu onClick={ e => this.handleClickMenu(e) }>
        <Menu.Item key="forgetPassword">
          <a style={{'fontSize': '12px'}}>修改密码</a>
        </Menu.Item>
        <Menu.Item key="logout">
          <a style={{'fontSize': '12px'}}>注销</a>
        </Menu.Item>
      </Menu>
    )
  }

  // 渲染用户信息
  renderUserInfo(){
    return (
      <div className={styles.user}>
        <img src={`${CDN_BASE}/assets/imgs/avatar.jpg`}/>
        <Dropdown overlay={ this.getDropDownMenu() } trigger={['hover']} getPopupContainer={() => document.getElementById('routerApp_headRight')}>
          <a className="ant-dropdown-link" href="#" style={{display: 'inline-block'}}>
            <span style={{width: 120}}>{ Cookie.get(config.cookie.user_name) || '令狐冲'}</span><Icon type="caret-down" />
          </a>
        </Dropdown>
      </div>
    )
  }

  // 渲染内容
  render(){
    const collapsed = this.props.collapsed;
    return (
      <div>
        {/* 弹出的修改密码对话框 - 默认隐藏 */}
        {
          this.state.updatePwdFlag && <UpdatePwd
            titleName='修改密码'
            visible={ this.state.updatePwdFlag }
            onClose={ e => { this.hidePwdDlg(e) } }
            onOk={ e => {  this.hidePwdDlg(e, 'onOk') }}
          />
        }
        <div className={styles.tophead}>
          {/* 左侧header */}
          {/*
            <Icon className='trigger' type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={(e) => this.props.toggle(e)}/>
          */}
          <div className={styles.headLeft}>
            <div className={styles.headTitle}>
              <div className={styles.text}>
                {/* 这里显示系统名称 */}
                <span>{config.appName || ''}</span>&nbsp;&nbsp;&nbsp;
                {/* 这里显示商家信息 */}
                {/*<span className='text'>xxx商家</span>*/}
              </div>
            </div>
          </div>

          {/* 右侧header */}
          <div className={styles.headRight} id="routerApp_headRight">
            <div className={cx(styles.table, styles.right)}>
              <div className={styles.row}>
                <div className={styles.cell}>
                  {/* 消息列表 */}
                  <MsgList/>
                </div>
                <div className={cx(styles.cell, styles.padRight, styles.padLeft)}>
                  {/* 组织机构列表*/}
                  <OrgList />
                </div>
                <div className={cx(styles.cell, styles.padLeft)}>
                  {/* 用户登录信息 */}
                  { this.renderUserInfo() }
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}
