// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, Input, Col, Checkbox } from 'antd';
// 公共库
import { omit } from 'lodash';
// 公共操作
import { getFieldsProps, getBoxList, getRecordSetValue, getColProps } from './CardUtils';

// 表单项
const FormItem = Form.Item;

const getDisplayText = (eField, recordSet) => {
  let value = getRecordSetValue(eField, recordSet);
  return value? '是': '否';
}

const renderCheckbox = (layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz) => {
  return (
    <Col {...getColProps(eField)} key={eKey}>
      <FormItem {...layout} label={eField.zh_name}>
        {
          'detail' === '' + actType && <span>{getDisplayText(eField, recordSet)}</span>
        }
        {
          'detail' !== '' + actType && getFieldDecorator(eField.en_name, {
            rules: eField.rules
          })
          (
            <Checkbox {...getFieldsProps(eField)} checked={form.getFieldValue(eField.en_name)}/>
          )
        }
      </FormItem>
    </Col>
  )
}

export { renderCheckbox };