import React from 'react'
import { DatePicker } from 'antd';
import moment from 'moment'
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

function withSubscription(WrappedComponent) {
  return class extends React.Component {
    constructor(props, context) {
      super(props);
      let value = this.initValue(props.value);

      this.state = {
        value,
        params: this.getExitAttr()
      }
    }
    componentWillReceiveProps(nexprops) {
      if ('value' in nexprops) {
        let value = this.initValue(nexprops.value);
        this.setState({
          value,
          params: this.getExitAttr()
        });
      }
    }
    //对value值进行处理
    initValue = (value)=>{
      if(!value){
        return null;
      }
      if(moment.isMoment(value)){
        return value
      }else if(moment.isDate(value)){
        return moment(value)
      }else if(Array.isArray(value)){
        return value.map(item=>moment(item))
      }else{
        return moment(value)
      }
    }
    /**
     * 获取额外参数
     */
    getExitAttr = () => {
      let exitAttr = ["value", "onChange"];
      let attr = this.props;
      let attrs = {}
      Object.keys(attr).forEach((item) => {
        if (exitAttr.indexOf(item) > -1) {
          //啥都不处理
        } else {
          attrs[item] = this.props[item]
        }
      });
      return attrs;
    }
    onChange = (date, dateString) => {
      if (!('value' in this.props)) {
        this.setState({ value: date });
      }
      const onChange = this.props.onChange;
      if (onChange) {
        onChange(dateString);
      }
    }
    render() {
      let { params, value } = this.state;
      return (
        <WrappedComponent value={value} {...params} onChange={this.onChange} />
      )
    }
  }
}

let DatePickerCus = withSubscription(DatePicker);
let MonthPickerCus = withSubscription(MonthPicker);
let RangePickerCus = withSubscription(RangePicker);
let WeekPickerCus = withSubscription(WeekPicker);

class DatePickerS extends React.Component{
  static MonthPicker=MonthPickerCus;
  static RangePicker=RangePickerCus;
  static WeekPicker=WeekPickerCus;
  render() {
    return <DatePickerCus {...this.props}/>
  }
}

export default DatePickerS