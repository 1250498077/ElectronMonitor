import React from 'react';

const {Component} = React;

import cx from 'classnames';
import {Input, message} from 'antd';
import styles from './ChinseLess.less';

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

  checkChinse =(chinse) => {

    // 设置input是否为必传
    if (this.props.isNecessary && this.props.value === '') {
      return false
    } else if (this.props.value === '') {
      return true
    }
    let reg = /[^\u4e00-\u9fa5]+/g
    // 包括所有的中文全角字符
    let regSign = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]+/g
    // 获取除中文全角符号的其他字符
    chinse = chinse.replace(regSign, '')
    if (reg.test(chinse)) {
      return false
    }
    return true
  }

  render() {
    // 判断输入的内容是否合规
    const isTrue = this.checkChinse(this.props.value)
    const { props } = this
    return (
      <div className={cx(styles.container)}>
        <div className={cx(styles.input_container)}>
          <Input
            {...props}
            name='chinse'
            style={{border: isTrue ? "solid 1px #00CC33" : "solid 1px red"}}
          />
        </div>
      </div>
    )
  }
}