// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, Col } from 'antd';
import DatePicker from './ext/DatePicker';
// 时间范围选择器
const { RangePicker } = DatePicker;
// 公共操作
import { getFieldsProps, getRecordSetValue, getColProps, getStrDate } from './CardUtils';
// 表单项
const FormItem = Form.Item;

const renderRangePicker = (layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz) => {
  let value = getStrDate(eField, getRecordSetValue(eField, recordSet));
  return (
    <Col {...getColProps(eField)} key={eKey}>
      <FormItem {...layout}  key={eKey} label={eField.zh_name}>
        {
          'detail' === '' + actType && <span>{value}</span>
        }
        {
          'detail' !== '' + actType && getFieldDecorator(eField.en_name, {
            rules: eField.rules
          })
          (<RangePicker {...getFieldsProps(eField)}/>)
        }
      </FormItem>
    </Col>
  )
}

export { renderRangePicker };