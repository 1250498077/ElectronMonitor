// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, Row, Col } from 'antd';
// 公共操作
import { getFieldsProps, getBizValue, getColProps } from './CardUtils';
// 表单项
const FormItem = Form.Item;

const renderFormItem = (layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz) => {
  return (
    <Col {...getColProps(eField)} key={eKey}>
      <FormItem {...layout}  key={eKey} label={eField.zh_name} {...getFieldsProps(eField)}>
        <Row>
          { getBizValue(biz, eField) }
        </Row>
      </FormItem>
    </Col>
  )
}

export { renderFormItem };