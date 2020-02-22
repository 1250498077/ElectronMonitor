// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, TreeSelect, Col } from 'antd';
// 公共操作
import { getFieldsProps, getTreeLabel, getColProps, getBoxList } from './CardUtils';
// 表单项
const FormItem = Form.Item;

// 递归树目录，将label替换为title
const getNewItems = (items) => {
  items.map((item, i) => {
    if(item.children){
      getNewItems(item.children);
    }else{
      item.title = item.label || item.title;
    }
  })
}

// 将label替换为title
const getLabelTree = (cmptItems) => {
  // 空值判断
  if(!cmptItems || 0 === cmptItems.length){
    return [];
  }

  // 嵌套层级的数据，需要递归将label替换为title
  if(cmptItems[0].children){
    cmptItems = getNewItems(cmptItems);
  // 单层级的数据，直接遍历将label替换为title
  }else{
    cmptItems.map((item, i) => {
      item.title = item.label || item.title;
    })
  }
  return cmptItems;
}

const renderTreeSelect = (layout, eKey, eField, getFieldDecorator, recordSet, actType, form, biz) => {
  let cmptItems = getBoxList(eField, recordSet);
  cmptItems = getLabelTree(cmptItems);
  return (
    <Col {...getColProps(eField)} key={eKey}>
      <FormItem {...layout}  key={eKey} label={eField.zh_name}>
        {
          'detail' === '' + actType && <span>{getTreeLabel(cmptItems, eField, recordSet)}</span>
        }
        {
          'detail' !== '' + actType && getFieldDecorator(eField.en_name, {
            rules: eField.rules
          })
          (<TreeSelect {...getFieldsProps(eField)} treeData={cmptItems} />)
        }
      </FormItem>
    </Col>
  )
}

export { renderTreeSelect };