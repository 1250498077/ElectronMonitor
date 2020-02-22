// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, Input, Col, Select } from 'antd';
// 公共操作
import { getFieldsProps, getBoxList, getRecordSetValue, getColProps } from './CardUtils';

import { find } from 'lodash';
// 表单项
const FormItem = Form.Item;
// 下拉选项
const Option = Select.Option;

const getSelectLabel = (eField, recordSet, cmptItems) => {
  let value = getRecordSetValue(eField, recordSet);
  let label = value? find(cmptItems, ['value', value]).label: '';
  return label;
}

const renderSelect = (layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz) => {
  let cmptItems = getBoxList(eField, recordSet);

  return (
    <Col {...getColProps(eField)} key={eKey}>
      <FormItem {...layout} label={eField.zh_name}>
        {/* 修复下拉框的bug */}
        <Input type='hidden'/>
        {
          'detail' === '' + actType && <span>{getSelectLabel(eField, recordSet, cmptItems)}</span>
        }
        {
          'detail' !== '' + actType && getFieldDecorator(eField.en_name, {
            rules: eField.rules
          })
          (
            <Select {...getFieldsProps(eField)}>
              {
                cmptItems.map((item, j) => {
                  return <Option key={`${eField.en_name}_option_${j}`} value={'' + item.value}>{item.label}</Option>
                })
              }
            </Select>
          )
        }
      </FormItem>
    </Col>
  )
}

export { renderSelect };