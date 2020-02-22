import React, { Component } from 'react';
import ReactDom from 'react-dom';

import styles from './PageTitleLess.less';

export default class PageTabs extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <h3>
        <span className={styles.title}>{this.props.title || ''}</span>
      </h3>
    );
  }
}