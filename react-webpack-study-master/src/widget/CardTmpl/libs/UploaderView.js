// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, Col } from 'antd';
// 引入上传组件
import Uploader from 'widget/Upload/UploadView';
// 公共操作
import { getFieldsProps, getRecordSetValue, getColProps } from './CardUtils';
// 表单项
const FormItem = Form.Item;

const renderUploader = (layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz) => {
  return (
    <Col {...getColProps(eField)} key={eKey}>
      <FormItem {...layout} style={{height: '180px'}} key={eKey} label={eField.zh_name}>
        {
          'detail' === '' + actType && <img width='144' height='144' src={getRecordSetValue(eField, recordSet)}></img>
        }
        {
          'detail' !== '' + actType && getFieldDecorator(eField.en_name, {
            rules: eField.rules
          })
          (<Uploader {...getFieldsProps(eField)} uploadedUrls={form.getFieldValue(eField.en_name)}/>)
        }
      </FormItem>
    </Col>
  )
}

export { renderUploader };