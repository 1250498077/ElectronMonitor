// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, Cascader, Col, Checkbox } from 'antd';
// 公共库
import { omit } from 'lodash';
// 数组转为tree结构
import arrayToTree from 'array-to-tree';
// 公共操作
import { getFieldsProps, getBoxList, getTreeLabel, getColProps } from './CardUtils';

// 表单项
const FormItem = Form.Item;

// 将打平的数据项，转换为递归层级
const getTreeData = (cmptItems) => {
  if(!cmptItems || 0 === cmptItems.length){
    return [];
  }
  // 已经是递归嵌套类型的数据，直接返回
  if(cmptItems[0].children){
    return cmptItems;
  }
  // 构造递归嵌套层级
  return arrayToTree(cmptItems, { parentProperty: 'pid'});
}

const renderCascader = (layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz) => {
  let cmptItems = getBoxList(eField, recordSet);
  cmptItems = getTreeData(cmptItems);
  return (
    <Col {...getColProps(eField)} key={eKey}>
      <FormItem {...layout} label={eField.zh_name}>
        {
          'detail' === '' + actType && <span>{getTreeLabel(cmptItems, eField, recordSet)}</span>
        }
        {
          'detail' !== '' + actType && getFieldDecorator(eField.en_name, {
            rules: eField.rules
          })
          (
            <Cascader options={ cmptItems } {...getFieldsProps(eField)}/>
          )
        }
      </FormItem>
    </Col>
  )
}

export { renderCascader };