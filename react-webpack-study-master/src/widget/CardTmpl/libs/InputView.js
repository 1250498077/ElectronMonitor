// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, Input, Col } from 'antd';
import { isArray } from 'lodash';
// 公共操作
import { getFieldsProps, getRecordSetValue, getColProps } from './CardUtils';
// 表单项
const FormItem = Form.Item;

// 限制表情符输入
const limitEmojiRule = {
  message: "输入的字符里有表情符号",
  validator: (rule, value, callback) => {
    let emojiRegRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
    if(value && value.toString().match(emojiRegRule)) {
      callback("输入的字符里有表情符号");
    }else{
      callback();
    }
  }
}

const renderInput = (layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz) => {
  // 加上限制表情输入校验
  if(eField.rules && isArray(eField.rules)){
    eField.rules.push(limitEmojiRule);
  }

  return (
    <Col {...getColProps(eField)} key={eKey}>
      <FormItem {...layout}  key={eKey} label={eField.zh_name}>
        {
          'detail' === '' + actType && <span>{getRecordSetValue(eField, recordSet)}</span>
        }
        {
          'detail' !== '' + actType && getFieldDecorator(eField.en_name, {
            rules: eField.rules || []
          })
          (<Input {...getFieldsProps(eField)}/>)
        }
      </FormItem>
    </Col>
  )
}

export { renderInput };