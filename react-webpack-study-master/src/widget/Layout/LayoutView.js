import React, { Component } from 'react';
// 路由对象
import { withRouter } from 'react-router-dom';

import { Layout, Menu, Icon } from 'antd';
// 代码热更新插件
import { hot } from 'react-hot-loader';
import { getRouter } from 'router';

import SiderBar from 'widget/SiderBar/SiderBarView';
import FooterBar from 'widget/FooterBar/FooterBarView';
import HeaderBar from 'widget/HeaderBar/HeaderBarView';

import styles from './LayoutLess.less';
const { Header, Footer, Content } = Layout;
import PageTabs from 'widget/PageTabs/PageTabsView';

@withRouter
class LayoutView extends Component {

  constructor(props){
    super(props);
    // 设置全局router对象，用于在Mod中的跳转
    window.app.router = this.props.history;

    this.state = {
      // false展开，true折叠
      collapsed: false
    }
  }

  // 菜单折叠、展开切换
  toggle(){
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    console.log('layout render',  getRouter());
    const collapsed = this.state.collapsed;
    return (
      <div className={styles.layout}>
        <Layout>
          <SiderBar collapsed={collapsed} style={{'width': '160px', 'flex': '0 0 160px', 'maxWidth': '160px', 'minWidth': '160px'}}/>
          <Layout>
            <HeaderBar collapsed={collapsed} toggle={e => this.toggle()}/>
            <Content>
              <PageTabs/>
              <div className={styles.content}>
                {getRouter()}
              </div>
            </Content>
            <FooterBar/>
          </Layout>
        </Layout>
      </div>
    )
  }
}

// 使用热更新插件，代码改动时更新视图
export default hot(module)(LayoutView);