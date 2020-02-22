import React from 'react';
import { Popconfirm } from 'antd';

import cx from 'classnames';
import { parse, stringify } from 'qs';
import { isEmpty, omit, keys, get, isArray, has } from 'lodash';

  // 单页应用链接
import { Link } from 'react-router-dom';

// 获取链接URL
const getLinkUrl = (record, linkObj) => {
  let linkUrl = '', linkParams = {}, tmpObj = {};
  // 参数转为对象
  if(!!linkObj.params){
    linkParams = parse(linkObj.params);
  }

  let tmpVal = '';
  // 参数合并
  if(!isEmpty(linkParams)){
    Object.keys(linkParams).map((key, i) => {
      tmpVal = get(record, '' + key,  null);
      if(!!tmpVal){
        tmpObj[key] = tmpVal;
      }else{
        tmpObj[key] = linkParams[key];
      }
    })
  }

  // 拼接成完整的URL
  if(!isEmpty(tmpObj)){
    linkUrl = `${linkObj.url}?${stringify(tmpObj)}`;
  }else{
    linkUrl = linkObj.url;
  }
  return linkUrl;
}

  // 获取链接数组
const getListLinks = (record, actions) => {
  // 操作的键key的列表
  let actKeys = keys(actions);

  if(!isArray(actKeys) || 0 === actKeys.length){
    return null;
  }

  // 链接对象
  let tmpLink, linkObj, linkDomArr = [];
  actKeys.map((k, i) => {
    linkObj = actions[k];
    tmpLink = getLinkUrl(record, linkObj)

    if('onDelete' == '' + linkObj.func_name){
      linkDomArr.push(
        <Popconfirm key={'link1_' + i} Collapse title='确定要删除吗？' okText='确定' cancelText='取消' onConfirm={(e) => { console.log('do delete record') }}>
          <Link >删除</Link>
        </Popconfirm>
      )
    }else{
      if(has(linkObj, 'onClick')){
        linkDomArr.push(<a key={'link1_' + i} href='javascript:;' onClick={ e => linkObj.onClick(e, record) }>{linkObj.label}</a>)
      }else if(has(linkObj, 'render')){
        linkDomArr.push(React.cloneElement(linkObj.render(record), {key: 'link1_' + i}))
      }else{
        linkDomArr.push(<Link key={'link1_' + i} to={tmpLink}>{linkObj.label}</Link>)
      }
    }
    // linkDomArr.push(<Link key={'link1_' + i} to={tmpLink}>{link.label}</Link>)
    linkDomArr.push(<span key={'link2_' + i} className={cx("ant-divider")}/>)
  })
  return linkDomArr;
}

  // 列表页面操作
const getListActions = (uiTable) => {
  let actions = get(uiTable, 'actions', {});
  // 操作栏对象
  return {
    title: "操作",
    width: get(actions, 'width', 170),
    fixed: get(actions, 'fixed', false),
    // ...omit(actions, ['width', 'fixed']),
    render: (text, record, index) => {
      // 以下jsx语法
      return (
        <div className="tableAction">
          { getListLinks(record, actions) }
        </div>
      )
    }
  }
}

export { getListActions };