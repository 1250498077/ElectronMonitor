import React from 'react';
import {Icon} from 'antd';
const { Component } = React;

import { has, get } from 'lodash';
import cx from 'classnames';

import styles from './PanelLess.less';

export default class extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context);
    this.state = {
      collapse: false
    }
  }

  componentWillUpdate(nextProps, nextState) {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillReceiveProps(nextProps){}

  componentDidMount(){}

  // 面板展开、折叠
  changeStatus() {
    this.setState({ collapse:!this.state.collapse })
  }

  render() {
    // 是否显示可折叠按钮
    let hasHideUpDownBtn = has(this.props, 'hideUpDownBtn', false);
    let panelType = get(this.props, 'type', 'collapse');

    return <div>

      {/* 可折叠面板 */}
      {
        'collapse' === '' + panelType && (
          <div style={{marginTop: '16px', ...this.props.style}} className={this.props.className}>
            <dl className={cx(styles.collapsePanel, 'dropdownShadow')}>
              { /* 面板头部 */ }
              <dt className={`${!this.state.collapse ? 'slideHide' : ''}`} style={ this.props.titleBarStyle }>
                { this.props.title }
                {
                  !hasHideUpDownBtn && (
                    <span onClick={() => this.changeStatus()} > { this.state.collapse? '收起': '展开' }&nbsp;
                      <Icon type="up"/>
                    </span>
                  )
                }
              </dt>
              { /* 面板内容 */ }
              <dd className={`${this.state.collapse ? 'slideHide' : ''}`}>
                <div style={{padding: '16px'}}>
                  {this.props.children}
                </div>
              </dd>
            </dl>
          </div>
        )
      }

      {/* 信息展示面板 */}
      {
        'info' === '' + panelType && (
          <div style={{marginTop: 16}} className={cx(styles.infoPanel, styles.pad16)}>
            <a className={cx('txtleft', styles.button)} onClick={() => this.changeStatus()}>
              {
                this.state.collapse? <i className={styles.zhankai} />: <i className={styles.shouqi} />
              }
            </a>
            <div className={this.state.collapse ? styles.content: ''}>
              {this.props.children}
            </div>
          </div>
        )
      }

      {/* 卡片面板 */}
      {
        'card' === '' + panelType && (
          <div className={cx(styles.cardPanel, this.props.className)}>
            <div className={styles.title}>{this.props.title}</div>
            <div className={styles.pad16}>
              {this.props.children}
            </div>
          </div>
        )
      }

    </div>
  }
}