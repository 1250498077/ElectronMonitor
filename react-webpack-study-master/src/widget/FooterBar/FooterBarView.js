import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';

const { Footer } = Layout;

import styles from './FooterBarLess.less';
import { NavLink } from 'react-router-dom';

export default class FooterBarView extends Component {
  render(){

    return (
      <Footer className='footer'>
        xxx科技 版权所有 © 2017
      </Footer>
    )
  }
}
