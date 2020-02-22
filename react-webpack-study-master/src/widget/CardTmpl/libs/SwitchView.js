// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, Switch, Col } from 'antd';
// 对象取值
import { has } from 'lodash';
// 公共操作
import { getFieldsProps, getRecordSetValue, getColProps } from './CardUtils';
// 表单项
const FormItem = Form.Item;

const getDisplayText = (eField, recordSet) => {
  let value = getRecordSetValue(eField, recordSet);
  if(value){
    if(!has(eField, 'checkedChildren')){
      return '是';
    }
    return eField.checkedChildren;
  }else{
    if(!has(eField, 'unCheckedChildren')){
      return '否';
    }
    return eField.unCheckedChildren;
  }
}

const renderSwitch = (layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz) => {
  return (
    <Col {...getColProps(eField)} key={eKey}>
      <FormItem {...layout}  key={eKey} label={eField.zh_name}>
        {
          'detail' === '' + actType && <span>{getDisplayText(eField, recordSet)}</span>
        }
        {
          'detail' !== '' + actType && getFieldDecorator(eField.en_name, {
            valuePropName: 'checked',
            rules: eField.rules
          })
          (<Switch {...getFieldsProps(eField)} checked={getRecordSetValue(eField, recordSet)}/>)
        }
      </FormItem>
    </Col>
  )
}

export { renderSwitch };