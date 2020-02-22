import React from 'react';

const {Component} = React;

import cx from 'classnames';
import {Input, message} from 'antd';
import styles from './EmailLess.less';

export default class extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context);
    this.state = {}
  }

  componentWillUpdate(nextProps, nextState) {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {}

  checkEmail(email){

    // 设置input是否为必传
    if (this.props.isNecessary && this.props.value === '') {
      return false
    } else if (this.props.value === '') {
      return true
    }

    // 判断输入字符长度
    if (email.length > 127) {
      message.warning('字符个数超出限制')
      return false
    }

    let reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if (reg.test(email)) {
      return true
    } else {
      return false
    }
  }

  render() {
    // 判断输入的内容是否合规
    const isTrue = this.checkEmail(this.props.value)
    const { props } = this
    return (
      <div className={cx(styles.container)}>
        <div className={cx(styles.input_container)}>
          <Input
            {...props}
            name='email'
            style={{border: isTrue ? "solid 1px #00CC33" : "solid 1px red"}}
          />
        </div>
      </div>
    )
  }
}