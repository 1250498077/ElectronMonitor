// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, Col } from 'antd';
// 对象取值
import { get } from 'lodash';
// 富文本编辑器
import Editor from 'widget/Editor/KingEditor';
// 公共操作
import { getFieldsProps, getRecordSetValue, getColProps } from './CardUtils';
// 表单项
const FormItem = Form.Item;

const renderEditor = (layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz) => {
  return (
    <Col {...getColProps(eField)} key={eKey}>
      <FormItem {...layout}  key={eKey} label={eField.zh_name} className='editor' style={{height: '405px'}}>
        {
          'detail' === '' + actType && <div dangerouslySetInnerHTML={{ __html: getRecordSetValue(eField, recordSet) }} className='editor-content' style={{ height: eField.height || "300px", overflowY: "auto" }}></div>
        }
        {
          'detail' !== '' + actType && getFieldDecorator(eField.en_name, {
            rules: eField.rules
          })
          (<Editor {...getFieldsProps(eField)} html={form.getFieldValue(eField.en_name)} inputChange={(data) => form.setFieldsValue({ [eField.en_name]: data })} />)
        }
      </FormItem>
    </Col>
  )
}

export { renderEditor };