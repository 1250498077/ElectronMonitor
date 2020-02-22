import React from 'react';

const {Component} = React;

import InputExt from '../InputExtView'
import {Select} from "antd";
const { Option } = Select;
export default class extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context)
  }

  componentWillUpdate(nextProps, nextState) {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {

  }

  render() {

    const { getFieldDecorator } = this.props.form;
    const { selectArray, defaultSelect } = this.props
    // 这里说明一下代码，首先判断用户有没有传selectArray，没有则使用默认数组，有就使用用户传过来的数组
    // 当用户传过来数组的时候，如果用户也传了默认值defaultSelect，那么默认值就使用用户传过来的，否则将使用数组的第一个元素
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: selectArray ?
        (defaultSelect ? defaultSelect : selectArray[0]) : '86',
    })(
      <Select
        style={{ width: 70 }}
        onChange={this.props.onSelectChange}
      >
        {
          !selectArray ?
          (
            [
              <Option value='86'>86</Option>,
              <Option value='87'>87</Option>
            ]
          )
          :
          (
            selectArray.map((item) => {
              return (
                <Option value={item}>{item}</Option>
              )
            })
          )
        }
      </Select>
    );

    return (
      <InputExt {...this.props} type='phone' addonBefore={prefixSelector}/>
    )
  }
}