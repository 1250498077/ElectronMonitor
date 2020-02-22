// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, Input, Col, Checkbox } from 'antd';
// 公共库
import { omit } from 'lodash';
// 公共操作
import { getFieldsProps, getBoxList, getDisplayLabel, getColProps } from './CardUtils';

// 表单项
const FormItem = Form.Item;
// 复选按钮组
const CheckboxGroup = Checkbox.Group;

const renderCheckboxGroup = (layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz) => {
  let cmptItems = getBoxList(eField, recordSet);
  return (
    <Col {...getColProps(eField)} key={eKey}>
      <FormItem {...layout} label={eField.zh_name}>
        {
          'detail' === '' + actType && <span>{getDisplayLabel(eField, recordSet, cmptItems)}</span>
        }
        {
          'detail' !== '' + actType && getFieldDecorator(eField.en_name, {
            rules: eField.rules
          })
          (
            <CheckboxGroup options={ cmptItems } {...getFieldsProps(eField)}/>
          )
        }
      </FormItem>
    </Col>
  )
}

export { renderCheckboxGroup };