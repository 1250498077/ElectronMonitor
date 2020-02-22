 import React from 'react';
 import { Button } from 'antd';
 import { keys,  } from 'lodash';
// 哈希路由，地址栏#后面的参数
import { HashRouter } from 'react-router-dom';

// 跳转URL
const goToUrl = (e, url) => {
  if(e){
    // 阻止冒泡
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
  }

  if(window.app.router){
    // 跳转到新的路由
    window.app.router.push(url);
  }else{
    HashRouter.push(url);
  }
}

const getActionProps = (act) => {
  if(act.url){
    act.onClick = (e) => {
      goToUrl(e, act.url);
    }
  }
  return act;
}

const renderActionBar = (actionBar) => {
  let actionsKeys = keys(actionBar);
  if(0 === actionsKeys.length){
    return null;
  }

  let act, tmpKey;
  return (
    <div className="funcButtonBox">
    {
      actionsKeys.map((k, i) => {
        act = actionBar[k];
        return <Button key={'act_' + i} type={act.type} icon={act.icon}  {...getActionProps(act)}>{act.label}</Button>
      })
    }
    </div>
  )
} 

export { renderActionBar };