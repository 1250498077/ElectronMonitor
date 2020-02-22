import React, { Component } from 'react';
import ReactDom from 'react-dom';

import classNames from 'classnames';
import { observer, inject } from 'mobx-react';
import { withRouter } from "react-router-dom";
import { Tag, Dropdown, Icon, Tooltip, Menu } from 'antd';
const { SubMenu } = Menu;

import config from 'config/Config';
import styles from './PageTabsLess.less';

const webConfig = { indexPath: config.homePath || '/' }

/*
// 模拟全局路由配置对象，
const routerCfg = {
  '/': { name: '首页' },
  '/product': { name: '产品列表' },
  '/search': { name: '产品搜索' },
  '/user': { name: '用户列表' },
  '/info': { name: '用户详情' }
};

// 通过 pathname 获取 pathname 对应到路由描述信息对象
const getTitleByPathname = (pathname) => {
  return routerCfg[pathname];
}
*/

@withRouter
@inject('AppStore')
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
export default class PageTabs extends Component {
  static unListen = null;
  static defaultProps = {
    initialValue: [],
  };
  constructor(props) {
    super(props);
    this.state = {
      // 当前路由对应到 pathname 如/user /product
      currentPageName: [],
      // tabs所有到所有页签  如['/user', '/product']
      refsTag: [],
      // 每个页签对应的路由参数 如{'/user': '?a=1&b=2'}
      searchMap: {},
    };
    this.stores = this.props.AppStore;
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  // 通过路径，获取标题name，如{'/': {name: '首页'}, ...}
  getTitleByPathname(pathname){
    let tabTitle = this.stores.state.routerCfg[pathname];
    return tabTitle;
  }

  // 组件挂载，已插入真实DOM
  componentDidMount() {
    if (this.unListen) {
      this.unListen();
      this.unListen = null;
    }
    // 监听路由切换事件
    this.unListen = this.props.history.listen((_location) => {
      if (this.didUnMounted) {
        return;
      }
      if (this.notListenOnce) {
        this.notListenOnce = false;
        return;
      }
      const { pathname } = _location;
      if (pathname === '/' || !this.getTitleByPathname(pathname)) {
        this.setState({
          currentPageName: '',
        });
        return;
      }
      const newRefsTag = [...this.state.refsTag];
      const currentPathname = pathname;
      if (newRefsTag.indexOf(currentPathname) === -1) {
        newRefsTag.push(currentPathname);
      }
      this.state.searchMap[pathname] = _location.search;
      this.setState({
        currentPageName: pathname,
        refsTag: newRefsTag,
      });
      // 假如是新的 导航item 添加进来,需要在 添加完成后调用 scrollIntoTags
      clearTimeout(this.tagChangeTimerId);
      this.tagChangeTimerId = setTimeout(() => {
        this.scrollIntoTags(pathname);
      }, 100);
    });
    const { pathname } = this.props.location;

    // 解决刷新后的默认显示问题
    if(0 === this.state.refsTag.length){
      let tSearchMap = {};
      tSearchMap[pathname] = this.props.location.search;
      this.setState({
        currentPageName: pathname,
        refsTag: [pathname],
        searchMap: tSearchMap
      })
    }
    this.scrollIntoTags(pathname);
  }

  componentWillUnmount() {
    this.didUnMounted = true;
    if (this.unListen) {
      this.unListen();
      this.unListen = null;
    }
  }

  scrollIntoTags(pathname) {
    let dom;
    try {
      // eslint-disable-next-line react/no-find-dom-node
      dom = ReactDom.findDOMNode(this).querySelector(`[data-key="${pathname}"]`);
      if (dom === null) {
        // 菜单 还没有加入 导航条(横)
      } else {
        // 菜单 已经加入 导航条(横)
        dom.scrollIntoView(false);
      }
    } catch (e) {
      // console.error(e);
    }
  }

  handleClose = (e, tag) => {
    if(!!e){
      // 阻止事件冒泡
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    const { pathname } = this.props.location;
    const { history } = this.props;
    let { currentPageName } = this.state;
    const { searchMap } = this.state;
    // const newRefsTag = [...this.state.refsTag.filter(t => t !== tag)];
    // if (currentPageName === tag) {
    //   currentPageName = this.state.refsTag[this.state.refsTag.indexOf(tag) - 1];
    // }
    // this.setState({
    //   currentPageName,
    //   refsTag: newRefsTag,
    // });
    // if (pathname !== currentPageName) {
    //   this.notListenOnce = true;
    //   history.push({
    //     pathname: currentPageName,
    //     search: searchMap[currentPageName],
    //   });
    // }

    // 首先尝试激活左边的, 再尝试激活右边的
    let nextTabKey = this.state.currentPageName;

    if ('' + this.state.currentPageName === '' + tag) {

      let currentTabIndex = -1
      this.state.refsTag.forEach((pane, i) => {
        if (pane === tag) {
          currentTabIndex = i
        }
      })

      // 如果当前tab左边还有tab, 就激活左边的
      if (currentTabIndex > 0) {
        nextTabKey = this.state.refsTag[currentTabIndex - 1]
      }
      // 否则就激活右边的tab
      else if (currentTabIndex === 0 && this.state.refsTag.length > 1) {
        nextTabKey = this.state.refsTag[currentTabIndex + 1]
      }
      // 其实还有一种情况, 就是只剩最后一个tab, 但这里不用处理
    }
    const newRefsTag = [...this.state.refsTag.filter(t => t !== tag)];
    this.setState({
      currentPageName: nextTabKey,
      refsTag: newRefsTag,
    }, () => {
      // 如果设置了关闭页签的钩子回调函数，则页签关闭时调用
      if(this.stores.state.hookCbf){
        this.stores.state.hookCbf();
      }
    });

    if (pathname !== nextTabKey) {
      this.notListenOnce = true;
      history.push({
        pathname: nextTabKey,
        search: searchMap[nextTabKey],
      });
    }else{
      this.notListenOnce = true;
      history.push({
        pathname: '/',
        search: searchMap['/'],
      });
    }

  };

  handleClickTag = (tag, e) => {
    if (e && e.target.tagName.toLowerCase() === 'i') {
      return;
    }
    if (tag !== this.state.currentPageName) {
      this.props.history.push({
        pathname: tag,
        search: this.state.searchMap[tag] ? this.state.searchMap[tag].replace(/from=[^&]+&?/, '') : undefined,
      });
    }
  }

  handleMenuClick = (e) => {
    const eKey = e.key;
    let currentPathname = this.props.location.pathname;
    const { refsTag } = this.state;

    if(0 === refsTag.length){
      return false;
    }

    let newRefsTag;
    if (eKey === '1') {
      newRefsTag = '/';
      currentPathname = '/';
      this.props.history.push({
        pathname: currentPathname,
        search: this.state.searchMap[currentPathname],
      });
      newRefsTag = [webConfig.indexPath];
      if (currentPathname !== webConfig.indexPath) {
        newRefsTag.push(currentPathname);
      }
    } else if (eKey === '2') {
      newRefsTag = [webConfig.indexPath];
      if (currentPathname !== webConfig.indexPath) {
        newRefsTag.push(currentPathname);
      }
    } else {
      this.handleClickTag(eKey);
      return;
    }
    if (currentPathname !== this.state.currentPageName) {
      this.props.history.push({
        pathname: currentPathname,
        search: this.state.searchMap[currentPathname],
      });
    }
    this.setState({
      refsTag: newRefsTag,
    });
  }

  render() {
    let { currentPageName, refsTag } = this.state;
    const { className, style } = this.props;
    const cls = classNames(styles['router-tabs'], className);
    const checkIsIe10 = () => {
      if (window.ActiveXObject) {
        var reg = /10\.0/;
        var str = navigator.userAgent;
        //reg.test(str);
        if (reg.test(str)) {
            return true;
        };
      }
      return false;   
    }
    const isIe10 = checkIsIe10();
    const tags = refsTag.map((pathname, index) => {
      if(!pathname){
        console.error('your page has incorrect syntax！')
        return <span>&nbsp;</span>
      }
      currentPageName = currentPageName? currentPageName: webConfig.indexPath;
      const routeInfo = this.getTitleByPathname(pathname); // 这里假设每个pathname都能获取到指定到页面名称
      let title = routeInfo ? routeInfo.name : '404';
      const isLongTag = title.length > 30;

      const tagElem = (
        <Tag
          key={pathname}
          data-key={pathname}
          className={classNames(styles.tag, { [styles.active]: pathname === currentPageName })}
          onClick={e => this.handleClickTag(pathname, e)}
          // closable={index !== 0}
          closable={true}
          afterClose={(e) => this.handleClose(e, pathname)}
        >
          <span className={styles.icon} />{isLongTag ? `${title.slice(0, 30)}...` : title}
        </Tag>
      );
      return isLongTag? <Tooltip title={title} key={`tooltip_${pathname}`}>{tagElem}</Tooltip>: tagElem;
    });

    console.log('isIe10:', isIe10);
    this.tags = tags;
    /* eslint-disable */
    return (
      <div className={cls} style={{
        ...style,
        height: '40px',
        maxHeight: '40px',
        lineHeight: '40px',
        // marginRight: '-12px',
      }}>
        <div style={{
          flex: '1',
          height: '40px',
          position: 'relative',
          overflow: 'hidden',
          padding: '0px 0px',
        }}>
          <div style={{
            position: `${isIe10? 'inline-block': 'absolute'}`,
            whiteSpace: 'nowrap',
            marginRight: `${isIe10? '-3px': 0}`,
            width: '100%',
            top: '0px',
            padding: '0px 10px 0px 10px',
            overflowX: 'auto',
            overflowY: 'hidden',
            clear: 'both'
          }}>
            {tags}
          </div>
        </div>
        <div style={{
          width: '106px',
          padding: '0 0 0 12px',
          height: '100%',
          borderTop: 'solid 2px #EEE',
          background: '#fff',
          boxShadow: '-3px 0 15px 3px rgba(0,0,0,.1)',
        }}>
          <Dropdown overlay={<Menu onClick={this.handleMenuClick}>
            <Menu.Item key="1">关闭所有</Menu.Item>
            <Menu.Item key="2">关闭其他</Menu.Item>
            <SubMenu title="切换标签">
              { tags.map(item => (<Menu.Item key={item.key}>{item.props.children}</Menu.Item>)) }
            </SubMenu>
          </Menu>}
          >
            <Tag size={'small'} color="#2d8cf0"
              style={{ marginLeft: 0 }}>
              标签选项 <Icon type="down" />
            </Tag>
          </Dropdown>
        </div>
      </div>
    );
  }
}