import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, NavLink } from 'react-router-dom';

import { get, isArray } from 'lodash';
import { Layout, Menu, Icon, Input } from 'antd';
import config from 'config/Config';

const { Sider } = Layout;
const { SubMenu } = Menu;
const Search = Input.Search;

import styles from './SiderBarLess.less';
//自定义滚动条（解决ie、firefox自带滚动条难看的问题）
import { Scrollbars } from 'widget/ScrollBar/index';
// 异步请求
import request from 'utils/request';

// 存储整棵菜单树的数据
let storeMenuList = [];
// 一级菜单的key值
let rootSubmenuKeys = [];

// 递归渲染菜单项
const renderMenuItem = (menuArray) => {
  console.log('render item');
    // 遍历菜单列表
  return menuArray.map(item => {
    if(item.children){
      return(
        <SubMenu key={item.key} title={<span><Icon type={item.icon} /><span>{item.name}</span></span>}>
          { renderMenuItem(item.children) }
        </SubMenu>
      );
    }
    return (
      <Menu.Item key={item.key}>
        <NavLink to={item.url? item.url: '#'}>
          <Icon type={item.icon} />
          <span>{item.name}</span>
        </NavLink>
      </Menu.Item>
    )
  })
}


@withRouter
class SiderBarView extends Component {
  constructor(props){
    super(props);
    this.state = {
      // openKeys: [],
      // current: '',
      // 默认打开菜单
      openKeys: ['menu_item_2'],
      // 默认选中菜单的key
      current: 'menu_item_21',
      // 菜单列表
      menuList: []
    }
    this.stores = this.props.siderBarStore;
  }

  /**
   * 菜单点击处理
   * @param  {Object} e 事件源对象
   * @return {empty}   无
   */
  handleClick = (e) => {
    this.setState({
      current: e.key
    })
  }

  handleOpen = (openKeys) => {
   const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }

  // 设置一级菜单目录的keys
  setRootKeys(){
    if(0 === this.state.menuList.length){
      return false;
    }
    this.state.menuList.map((m, i) => {
      rootSubmenuKeys.push(m.key);
    })
  }

  // 查询菜单
  async getMenuList(){
    let self = this;
    let res = await request({
      url: 'menu/list',
      method: 'GET',
      data: {},
      app: 'ide-op-mgmt-application'
    });
    let menuList = get(res, 'data.list', []);
    // 设置一级菜单的keys
    self.setState({
      menuList
    }, () => {
      self.setRootKeys();
      storeMenuList = menuList;
    })
  }

  // 对菜单进行搜索筛选
  filterMenu = (value) => {
    let filterArr =  storeMenuList.filter(item=>{
      let str = JSON.stringify(item);
      if(str.indexOf(value) >= 0){
        return true
      }else{
        return false
      }
    })
    this.setState({
      menuList: filterArr
    })
  }

  componentDidMount(){
    this.getMenuList();
  }

  render(){
    console.log('sider bar render');
    const openKeys = this.state.openKeys;
    const current = this.state.current;
    // inlineIndent 菜单层级左侧空格大小，单位为px，空格量=左侧空格大小*层级level
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={this.props.collapsed}
        width='160'
      >
        <div className={styles.logo}/>
        <div className={styles.searchBlock}>
          <Search placeholder="请输入关键字" onSearch={this.filterMenu} style={{ width: "100%" }}/>
        </div>
        <div className={styles.menuWrap}>
          <div className={styles.menuCont}>
              {/*自定义滚动条组件*/}
              <Scrollbars
                ref={(e) => { this.scrollbar = e }}
                renderTrackVertical={props => <div {...props} className={styles.trackVertical} />}
                renderThumbVertical={props => <div {...props} className={styles.thumbVertical} />}
              >
                {/* 左侧菜单列表 */}
                <Menu
                  theme="dark"
                  mode="inline"
                  defaultSelectedKeys={[current]}
                  defaultOpenKeys={openKeys}
                  onClick={this.handleClick}
                  selectedKeys={[current]}
                  openKeys={openKeys}
                  onOpenChange={this.handleOpen}
                  inlineIndent={12}
                  inlineCollapsed={true}
                >
                { 0 !== this.state.menuList.length && renderMenuItem(this.state.menuList) }
                </Menu>
              </Scrollbars>

          </div>
        </div>
      </Sider>
    )
  }
}

export default SiderBarView;