// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, Col, Button } from 'antd';
// 排除元素
import { omit, keys, isEmpty, has, isFunction } from 'lodash';
// 表单项
const FormItem = Form.Item;
// 跳转路由
import { goToUrl } from './CardUtils';
// 布局配置
import layoutCfg from '../CardTmplConf';
// 搜索表单布局，缓存变量
const searchFormLayout = layoutCfg.searchFormLayout;

// 获得按钮的属性
const getButtonProps = (btn, k) => {
  // 排除 label, api_url, url back_url属性
  let obj = omit(btn, ['label', 'url', 'url_params']);
  // 如果包含了返回URL，则给按钮添加onClick事件，当点击的时候跳转
  if(has(btn, 'url')){
    obj.onClick = (e) => {
      goToUrl(e, btn.url);
    };
  }
  return obj;
}

// 获取包裹的布局
const getContLayout = (searchFormFlag) => {
  if(searchFormFlag){
    return searchFormLayout.colItem;
  }
  return { span: 24 };
}

// 获取表单元素的布局
const getFormLayout = (searchFormFlag, tailFormItemLayout) => {
  if(searchFormFlag){
    return searchFormLayout.formItem;
  }
  return tailFormItemLayout;
}

const renderActionBar = (tailFormItemLayout, buttons, actType, searchFormFlag) => {
  if(!buttons){
    return <div></div>
  }

  if(isFunction(buttons)){
    return buttons();
  }

  return (
    <Col {...getContLayout(searchFormFlag)} className={`${searchFormFlag? 'yx-right-btn': ''}`}>
      <FormItem {...getFormLayout(searchFormFlag, tailFormItemLayout)}>
        <div className='yx-func-button'>
          {
            keys(buttons).map((k, i) => {
              // 按钮元素
              let btn = buttons[k];
              if('detail' === '' + actType && 'onCancel' !== '' + k){
                return <div></div>
              }else{
                return <Button {...getButtonProps(btn, k, actType)} key={`button_${i}`} className='mg2r'>{btn.label}</Button>
              }
            })
          }
        </div>
      </FormItem>
    </Col>
  )
}

export { renderActionBar };