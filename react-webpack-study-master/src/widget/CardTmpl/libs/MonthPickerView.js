// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, Col } from 'antd';
import DatePicker from './ext/DatePicker';
// 月份选择器
const { MonthPicker } = DatePicker;
// 对象取值
import { get } from 'lodash';
// 公共操作
import { getFieldsProps, getRecordSetValue, getColProps, getStrDate } from './CardUtils';
// 表单项
const FormItem = Form.Item;

const renderMonthPicker = (layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz) => {
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
          (<MonthPicker {...getFieldsProps(eField)}/>)
        }
      </FormItem>
    </Col>
  )
}

export { renderMonthPicker };