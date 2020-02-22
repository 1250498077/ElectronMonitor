// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, Rate, Col } from 'antd';
// 公共操作
import { getFieldsProps, getRecordSetValue, getColProps } from './CardUtils';
// 表单项
const FormItem = Form.Item;

const renderRate = (layout, eKey, eField, getFieldDecorator, recordSet, actType) => {
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
          (<Rate style={{width: "100%"}} {...getFieldsProps(eField)}/>)
        }
      </FormItem>
    </Col>
  )
}

export { renderRate };