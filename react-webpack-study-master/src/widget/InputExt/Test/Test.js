import React from 'react';

const {Component} = React;
import { f } from './utils'


class Test extends Component {
  // 构造函数
  constructor(props) {
    super(props)
    console.log(props)
  }

  componentWillUpdate(nextProps, nextState) {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {}

  render() {
    return (
      <div>
        我是谁
      </div>
    )
  }
}

export default f()(Test);