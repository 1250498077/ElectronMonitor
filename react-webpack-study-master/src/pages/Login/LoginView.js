import React from 'react';
import { Component } from 'react';
import { parse } from 'qs';
import { get } from 'lodash';
import cx from 'classnames';
import Cookie from 'js-cookie';
import { withRouter } from 'react-router-dom';
import { Button, Row, Form, Input, Popover, Modal, Col, Spin, message } from 'antd';

import config from 'config/Config';
const { homePath } = config;
import { rstr2b64 } from 'utils/md5';
import styles from './LoginLess.less';

import { queryValidateImg, reqLogin } from './LoginServ';

const CDN_BASE = config.CDN_BASE || '';


import UpdatePwd from 'widget/UpdatePwd/UpdatePwdView'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 0
  },
  wrapperCol: {
    span: 24
  },
}

@withRouter
class loginView extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      uniqueId: '',
      //登录验证码
      validateImgUrl: '',
      loginButtonLoading: false,
      updatePwdFlag: false,
    }
  }

  //准备：即将被重新渲染，状态未变化
  componentWillMount() { }
  //准备：即将被重新渲染，状态未变化
  componentWillUpdate(nextProps, nextState) { }
  //完成：正在被重新渲染，状态已变化
  componentDidUpdate(prevProps, prevState) { }
  // 已加载组件，收到新属性时调用
  componentWillReceiveProps(nextProps) { }
  // 已插入真实DOM
  componentDidMount() {
    let self = this
    // 请求图形验证码
    self.getValidateImg()
    // 监听键盘敲击事件
    self.regKeyDown()
  }

  //组件将被卸载
  componentWillUnmount() {
    //重写组件的setState方法，直接返回空
    this.setState = (state, callback) => {
      return
    }
  }

  // 登录按钮点击
  handleOk(e) {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      this.doLogin(values)
    })
  }

  // 设置登录按钮的loading
  setButtonLoading(flag) {
    // 设置按钮加载中
    this.setState({
      loginButtonLoading: flag
    })
  }

  // 存储登录结果到Cookie
  saveResToCookie(data) {
    Object.keys(data).forEach((key) => {
      Cookie.set(key, data[key], { expires: config.loginTimeout || 1 })
    })
  }

  // 执行登录处理
  async doLogin(payload) {
    let self = this
    let { password, validateCode, username } = payload
    let loginParam = {
      //用户名
      userCode: username,
      //密码MD5加密
      userPassword: rstr2b64(password),
      // 登录类型 用户名+密码登录 name、手机短信登录 mobile
      loginType: 'name',
      loginSource: "cube",
      // 登录渠道
      trench: 'pc',
      verifyCode: validateCode,
      uniqueId: self.state.uniqueId,
      loginFlag: 3,
      userType: "1",
    }

    // 登录加载中
    self.setButtonLoading(true)

    try {
      // 登录结果 - 调用登录接口
      let resp = await reqLogin(parse(loginParam));
      if ('0' === '' + resp.data.code || '0' === '' + resp.resultCode) {
        // 存储登录结果到Cookie
        self.saveResToCookie({
          [config.cookie.user_name]: username,
          [config.cookie.auth_name]: resp.data.auth || resp.data.admin || resp.data.accessToken,
        });

        // 指定了登录之后跳转
        if (!!homePath) {
          this.props.history.push(homePath);
          // 默认跳转到首页
        } else {
          this.props.history.push('/');
        }
        // window.location.reload();
      } else {
        message.error(resp.resultMsg || '未知的登录异常', 'error');
        self.getValidateImg();
      }
    } catch (e) {
      message.error(e || '未知的登录异常', 'error')
      self.getValidateImg()
    }
    // 关闭登录加载中
    self.setButtonLoading(false)
  }

  // 注册键盘监听事件
  regKeyDown() {
    document.onkeydown = (e) => {
      let self = this
      // 兼容FF和IE和Opera
      var theEvent = e || window.event
      // 键盘的二进制编码
      var code = theEvent.keyCode || theEvent.which || theEvent.charCode
      // 13 回车键
      if (code == 13) {
        self.handleOk(e)
      }
    }
  }
  // 请求验证码
  async getValidateImg() {
    let self = this
    let time = Math.random()
    let result = await queryValidateImg({ time })

    if ('0' === '' + result.resultCode) {
      self.setState({
        validateImgUrl: ('data:image/jpeg;base64,' + result.data.image),
        uniqueId: result.data.uniqueId
      })
    }
  }

  // 打开密码对话框
  showPwdDlg(e) {
    this.setState({
      updatePwdFlag: true
    })
  }

  // 关闭密码对话框
  hidePwdDlg(e) {
    this.setState({
      updatePwdFlag: false
    })
  }

  // 初始状态或状态变化会触发render
  render(ReactElement, DOMElement, callback) {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        {
          this.state.updatePwdFlag && <UpdatePwd titleName='重置密码' visible={this.state.updatePwdFlag} onClose={e => { this.hidePwdDlg(e) }} />
        }
        <div className={cx(styles.spin)}>
          <Spin tip="加载用户信息..." spinning={false} size="large">
            <div className={styles.bgColor}>
              <div className={styles.containerStyle}>
                <div className={styles.contentStyle}>
                  <div className={styles.logo}>
                    <div className={styles.logoWrapper}>
                      <img src={`${CDN_BASE}/assets/imgs/login/logo.png`}/>
                      <div className={styles.line2}></div>
                      <span>RMA框架</span>
                    </div>
                    <p className={styles.appName}>{config.appName}</p>
                  </div>
                  <div className={styles.form}>
                    <form className="formItemNone">
                      <FormItem {...formItemLayout} hasFeedback>
                        {
                          getFieldDecorator('username', {
                            rules: [
                              {
                                required: true,
                                message: '请填写用户名',
                              },
                            ],
                          })(
                            <Input size="large" onPressEnter={e => this.handleOk(e)} placeholder="请输入用户名" 
                            prefix={<div className={styles.leftIcon}><img src={`${CDN_BASE}/assets/imgs/login/yonghu_icon.png`} className={styles.icon} /></div>} />
                          )}
                      </FormItem>
                      <FormItem  {...formItemLayout} hasFeedback>
                        {
                          getFieldDecorator('password', {
                            rules: [
                              {
                                required: true,
                                message: '请填写密码',
                              },
                            ],
                          })(
                            <Input size="large" type="password" onPressEnter={e => this.handleOk(e)} placeholder="请输入密码" 
                              prefix={<div className={styles.leftIcon}><img src={`${CDN_BASE}/assets/imgs/login/mima_icon.png`} className={styles.icon} /></div>} 
                            />
                          )}
                      </FormItem>
                      <div className={styles.validateCode}>
                        <FormItem  {...formItemLayout}>
                          {
                            getFieldDecorator('validateCode', {
                              rules: [
                                {
                                  required: true,
                                  message: '请填写验证码',
                                },
                              ],
                            })(<Input size="large" placeholder="请输入验证码" prefix={<div className={styles.leftIcon}><img src={`${CDN_BASE}/assets/imgs/login/yanzhengma_icon.png`} className={styles.icon} /></div>}  />)}
                          <div className={styles.line}/>
                          <img className={styles.imgStyle} src={this.state.validateImgUrl} onClick={e => this.getValidateImg(e)} />
                        </FormItem>
                      </div>

                      <Row>
                        <Button className={styles.buttonStyle} type="primary" size="large" onClick={e => this.handleOk(e)} loading={this.state.loginButtonLoading}>登录</Button>
                      </Row>
                      {/* <div className={cx('txtcenter', 'mg2t')}>
                        <a href="javascript:;" onClick={e => this.showPwdDlg(e)}>忘记密码？</a>
                      </div> */}
                    </form>
                  </div>
                </div>
                <div className={styles.copyright}>
                  <p>Copyright © 2018xxx科技有限公司</p>
                  <p>All Rights Reserved 浙ICP备16028793号</p>
                </div>
              </div>
            </div>
          </Spin>
        </div>
      </div>
    )
  }
}

export default Form.create()(loginView)
