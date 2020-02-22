// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, Input, Col } from 'antd';
// 文本域
const { TextArea } = Input;
// 公共操作
import { getFieldsProps, getRecordSetValue, getColProps } from './CardUtils';
// 表单项
const FormItem = Form.Item;

const renderTextArea = (layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz) => {
  return (
    <Col {...getColProps(eField)} key={eKey}>
      <FormItem {...layout}  key={eKey} label={eField.zh_name}>
        {
          'detail' === '' + actType && <div>{getRecordSetValue(eField, recordSet)}</div>
        }
        {
          'detail' !== '' + actType && getFieldDecorator(eField.en_name, {
            rules: eField.rules
          })
          (<TextArea autosize={{ minRows: 2, maxRows: 6 }} {...getFieldsProps(eField)} />)
        }
      </FormItem>
    </Col>
  )
}

export { renderTextArea };