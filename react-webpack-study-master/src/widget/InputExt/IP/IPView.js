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
    return (
      <InputExt {...this.props} type='IP' />
    )
  }
}