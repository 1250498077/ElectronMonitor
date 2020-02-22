// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, Col, Radio } from 'antd';
// 公共库
import { omit } from 'lodash';
// 公共操作
import { getFieldsProps, getBoxList, getDisplayLabel, getColProps } from './CardUtils';

// 表单项
const FormItem = Form.Item;
// 单选按钮组
const RadioGroup = Radio.Group;

const renderRadioGroup = (layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz) => {
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
            <RadioGroup {...getFieldsProps(eField)}>
              {
                cmptItems.map((item, j) => {
                  return <Radio key={`${eField.en_name}_${j}`} value={'' + item.value} {...omit(item, ['value', 'label'])}>{item.label}</Radio>
                })
              }
            </RadioGroup>
          )
        }
      </FormItem>
    </Col>
  )
}

export { renderRadioGroup };