import React from 'react'
import Bundle from './Bundle';
import Loading from 'widget/Loading/Loading';

//懒加载
export const createBundle = (component) => () => (
  <Bundle load={component}>
    {
      (Component) => Component ? <Component/> : <Loading/>
    }
  </Bundle>
);