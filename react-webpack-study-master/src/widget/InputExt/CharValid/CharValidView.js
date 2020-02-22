import React from 'react';

const {Component} = React;

import InputExt from '../InputExtView'

export default class extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context)
  }

  componentWillUpdate(nextProps, nextState) {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {}

  render() {
    // 这里定义的type必须和RuleList里面的变量名一致
    return (
      <InputExt {...this.props} type='CharValid' />
    )
  }
}