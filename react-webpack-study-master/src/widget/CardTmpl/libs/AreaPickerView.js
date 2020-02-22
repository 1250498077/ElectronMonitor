// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, Input, Col } from 'antd';
import { isArray } from 'lodash';
// 公共操作
import { getFieldsProps, getRecordSetValue, getColProps } from './CardUtils';
// 四级行政区域选择器 - 省、市、区、街道
import AreaPicker from 'widget/AreaPicker';
// 表单项
const FormItem = Form.Item;

// 地址校验规则
const addrRules = {
  validator: (rule, value, callback) => {
    if (!item.required){
      callback();
      return;
    }
    let checkkState = value && Object.keys(value).every((item, idx) => {
      let attrs = ["provinceCode", "cityCode", "districtCode", "streetCode", "address", "countyCode"]
      if(attrs.indexOf(item) < 0){
        return true;
      }
      if(attrs.indexOf(item) <= (item.levelNum - 1)){
        if ("streetCode" == item){
          return true;
        }
        let val = value[item];
        return !!val && val.length > 0 && val != "undefined" && val != "null";
      }
      return true;
    })
    if(checkkState){
      callback();
    }else{
      callback("地址信息必须都填");
    }
  }
}

const renderAreaPicker = (layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz) => {
  // 加上限制表情输入校验
  if(eField.rules && isArray(eField.rules)){
    eField.rules.push(addrRules);
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
          (<AreaPicker {...getFieldsProps(eField)}/>)
        }
      </FormItem>
    </Col>
  )
}

export { renderAreaPicker };