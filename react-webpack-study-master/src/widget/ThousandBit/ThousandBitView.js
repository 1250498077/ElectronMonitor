/*
 * jwx 2018-11-29
 * 千分位组件，传入金额，返回千分位数字
 * number {number} 需要格式化的数字 默认0
 * precision {number} 需要保留的小数位，默认0
 * prefix {string} 是否需要加金额前缀，默认false
 * */

import React, { PropTypes, Component } from 'react'

class ThousandBit extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  numberFormat({ number = 0, precision = 0, prefix = false }) {
    let isPlus = true;
    if (String(number).indexOf('-') > -1) {
      isPlus = false;
      number = Number(String(number).replace(/-/g, ''));
    }
    let displayPrefix = prefix ? prefix : '';
    number = String(number).replace(/(^\s*)|(\s*$)/g, "");
    if (isNaN(number) || !number) {
      return displayPrefix + parseFloat(0).toFixed(precision);
    } else {
      number = parseFloat(number).toFixed(precision)
    }
    number = number + '';
    if (number) {
      let nums = number.split('.')
      let num = nums[0].slice(nums[0].length % 3)
      let numBegin = nums[0].slice(0, nums[0].length % 3)
      number = numBegin + ((numBegin && num) ? ',' : '') + (num ? num.match(/\d{3}/g).join(',') : '') + (nums[1] ? '.' + nums[1] : '')
    }
    if (!isPlus) {
      number = '-' + number;
    }
    return displayPrefix + number;
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const style = this.props.style || {};
    return (
      <div style={style}>
        {
          this.numberFormat({ 
            number:this.props.number,
            precision:this.props.precision,
            prefix:this.props.prefix
          })
        }
      </div>
    )
  }
}

module.exports = ThousandBit;