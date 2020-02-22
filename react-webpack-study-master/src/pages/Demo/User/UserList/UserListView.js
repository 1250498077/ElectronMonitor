import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { isEmpty, cloneDeep, merge } from 'lodash';

import { Form, message } from 'antd';
// 引入列表组件
import QueryPage from 'widget/QueryPage/QueryPageView';
// 业务页面的布局、表单元素、组件属性、页面接口等的配置信息，这些信息都应是静态的json，可存储到数据库的，不能写函数类型。
import pageConf from './UserListConf';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';

// 站点配置
import config from 'config/Config';
// 静态资源CDN前缀，页面中的图片img的src属性必须加上它
const CDN_BASE = config.CDN_BASE || '';

// 注入在config/Stores.js中注册的UserListMod，以便获取store中的状态state或调用方法
@inject('UserListMod')
// 注入全局Store，用于调用关闭页签回调等
@inject('AppStore')
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
// 在组件中可通过this.props.history.push跳转路由
@withRouter
class UserListView extends  Component {
 constructor(props, context){
    super(props, context);
    this.store = this.props.UserListMod;
    this.appStore = this.props.AppStore;
    this.state = {
      title: '',
      biz: {
        name: {
          value: '张三'
        },
        // activeKey: '1',
        // tabs: {
        //   '1': {
        //     table: {
        //       current: 1,
        //       pageSize: 10,
        //       total: 0,
        //       pagination: true,
        //       dataSource: []
        //     }
        //   },
        //   '2': {
        //     table: {
        //       current: 1,
        //       pageSize: 10,
        //       total: 0,
        //       pagination: true,
        //       dataSource: []
        //     }
        //   },
        //   '3': {
        //     table: {
        //       current: 1,
        //       pageSize: 10,
        //       total: 0,
        //       pagination: true,
        //       dataSource: []
        //     }
        //   }
        // },
        table: {
          current: 1,
          pageSize: 10,
          total: 0,
          pagination: true,
          dataSource: []
        }
      }
    }
  }

  //准备：即将被重新渲染，状态未变化
  componentWillMount() {
    // 设置页面标题
    this.setState({ title: '用户列表' });
  }

  componentDidMount (){
    // 设置关闭页签时触发的回调函数，清空状态机的值
    this.appStore.setCloseHook(() => {
      this.store.clearState();
      console.log('关闭页签时触发');
    })
    // 自定义设置页签标题 - 非必须，根据需要调用
    this.appStore.setTabsInfo({
      "/user_list": {
        name: this.state.title
      }
    });
  }

  componentWillUnmount(){
    console.log('组件即将卸载');
  }

  /* 处理列表组件的值变更，可以设置到状态机 */
  handleQueryPageChange = (biz) => {
    console.log('biz:', biz);
    this.setState({ biz });
  }

  render() {
    // 业务开发者可配置页面自定义的配置属性，比如如按钮的自定义处理事件、自定义提交表单等
    let customProps = {
      // 业务数据 -  必须要有
      biz: this.state.biz,
      // 界面配置部分 - 不是必须配置的，根据情况需要取舍，不配置此项时，卡片模板会根据配置提交表单
      ui: {
        // 覆盖页面标题，不是必须的
        page_title: this.state.title,
        search_bar: {
          buttons: {
            // 覆盖onSearch
            onSearch: {
              onClick: (e) => {
                message.info('你点击了查询');
              }
            },
            onReset: {
              onClick: (e) => {
                message.warn('你点击了重置');
              }
            }
          }
        },
        // 覆盖默认配置
        tabs: {}
      }
    };
    // 合并静态的配置信息与开发者自定义信息
    let pageProps = merge(pageConf, customProps);

    return (
      <div>
        {/* 页面子标题 */}
        <PageTitle title={this.state.title}/>
        {/* 
          卡片模板需要传入页面描述信息，如布局、表单元素、组件属性、页面接口等
          onChange 用于同步卡片模板组件的状态到当前组件 
        */}
        <QueryPage {...pageProps} onChange={this.handleQueryPageChange}>
          {/* <div>这里是自定义内容</div> */}
        </QueryPage>
      </div>
    )
  }
}

// 注入antd的Form对象，以便可以在组件中使用 this.props.form
export default Form.create()(UserListView);