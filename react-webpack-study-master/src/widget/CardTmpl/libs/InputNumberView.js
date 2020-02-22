// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, InputNumber, Col } from 'antd';
// 公共操作
import { getFieldsProps, getRecordSetValue, getColProps } from './CardUtils';
// 表单项
const FormItem = Form.Item;

const renderInputNumber = (layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz) => {
  return (
    <Col {...getColProps(eField)} key={eKey}>
      <FormItem {...layout}  key={eKey} label={eField.zh_name}>
        {
          'detail' === '' + actType && <span>{getRecordSetValue(eField, recordSet)}</span>
        }
        {
          'detail' !== '' + actType && getFieldDecorator(eField.en_name, {
            rules: eField.rules
          })
          (<InputNumber style={{width: "100%"}} min={0} max={Infinity} {...getFieldsProps(eField)}/>)
        }
      </FormItem>
    </Col>
  )
}

export { renderInputNumber };