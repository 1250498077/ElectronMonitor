import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Icon, message, Input } from 'antd';
// 深拷贝、合并对象的属性
import { cloneDeep, merge } from 'lodash';

import utils from 'utils';
import config from 'config/Config';

// 引入卡片模板组件
import CardTmpl from 'widget/CardTmpl/CardTmplView';
// 页面样式
import styles from './UserEditLess.less';
// 业务页面的布局、表单元素、组件属性、页面接口等的配置信息，这些信息都应是静态的json，可存储到数据库的，不能写函数类型。
import pageConf from './UserEditConf';

// 在视图注入module层数据
@inject('UserEditMod')
// 注入全局Store
@inject('AppStore')
// 在组件中可通过this.props.history.push跳转路由
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class UserView extends Component {
  constructor(props, context) {
    super(props, context);
    this.stores = this.props.UserEditMod;
    this.appStore = this.props.AppStore;
    this.state = {
      // 页面标题
      title: '',
      // 页面数据
      biz: {
        user_name: {
          value: '令狐冲'
        },
        // user_name: {
        //   value: '令狐冲',
        // },
        tip: {
          value: '注意必须填完组件的内容'
        },
        safe: {
          value: '这里是安全注意事项的内容'
        }
      }
    }
  }

  //准备：即将被重新渲染，状态未变化
  componentWillMount() {
    // 标题的映射
    let titleMap = {
      'add': '用户新增',
      'edit': '用户编辑',
      'detail': '用户详情'
    }
    // 从地址栏取出参数对象（键和值）
    let actType = utils.getQueryString('actType') || 'add';
    this.setState({ title: titleMap[actType] });
  }

  // 已插入真实DOM
  componentDidMount(){
    // 设置关闭页签时触发的回调函数
    this.appStore.setCloseHook(() => {
      console.log('关闭页签时触发');
    })
    // 自定义设置页签标题
    this.appStore.setTabsInfo({
      "/user_edit": {
        name: this.state.title
      }
    });
  }

  /* 处理表单元素的值变更，可以设置到状态机 */
  handleFormChange = (biz) => {
    console.log('xxx:', biz);
    this.setState({ biz });
  }

  // 初始状态或状态变化会触发render
  render() {
    // 业务开发者可配置页面自定义的配置属性，比如如按钮的自定义处理事件、自定义提交表单等
    let customProps = {
      // 业务数据 - 必须要有
      biz: this.state.biz,
      // 界面配置部分 - 不是必须配置的，根据情况需要取舍，不配置此项时，卡片模板会根据配置提交表单
      ui: {
        // 覆盖页面标题，不是必须的
        page_title: this.state.title,
        // 可覆盖默认配置中的字段，show、disabled属性可以是布尔型，函数型
        fields: {
          age: {
            // 不设置show时，默认为true
            show: false
          },
          height: {
            disabled: true
          },
          weight: {
            // 不设置disabled时，默认为false
            disabled: () => {
              return true;
            }
          }
        },
        // 可给按钮加自定义按钮
        buttons: {
          onAudit: {
            onClick: (e) => {
              message.info('你点击了审核');
            }
          }
        },
        /**
         * 组件会自动查找按钮栏中htmlType类型为submit的提交按钮
         * 表单提交前的处理，可以进行数据格式处理、自定义校验等，需要返回处理结果或者false进行下一步处理
         * @param  {Object} err    表单校验的出错信息
         * @param  {Object} values 表单输入的值
         * @return {Boolean}       是否继续提交表单
         * @description 注意这里的async关键字，就是暗示你，里面可以使用await
         * @todo 不建议这里写太多逻辑，这里只是调用一下Mod层的逻辑
         */
        beforeSubmit: async (err, values) => {
          // 表单校验通过
          if(!err){
            let newValues = values;
            // 这里写你的自定义业务校验，不通过要 return false;
            // 这里处理values的值，并通过newValues返回给下一步处理
            return newValues;
          }
          return false;
        },
        /**
         * 自定义提交表单，这里你可以为所欲为
         * @param  {Object} values 表单输入的值
         * @return {Void}        无
         * @description 注意这里的async关键字，就是暗示你，里面可以使用await
         * @todo 不建议这里写太多逻辑，这里只是调用一下Mod层的逻辑
         */
        //customSubmit: async (values) => {

        //},
        /**
         * 表单提交后的处理，可在这里自定义处理，比如加埋点、跳转页面
         * @param  {Object} result 表单提交的结果
         * @return {Void}              无
         * @description 注意这里的async关键字，就是暗示你，里面可以使用await
         * @todo 不建议这里写太多逻辑，这里只是调用一下Mod层的逻辑
         */
        //afterSubmit: async (result) => {

        //}
      },
    };
    // 合并静态的配置信息与开发者自定义信息
    let pageProps = merge(pageConf, customProps);

    return (
      <div className={styles.userEdit}>
        {/* 
          卡片模板需要传入页面描述信息，如布局、表单元素、组件属性、页面接口等
          onChange 用于同步卡片模板组件的状态到当前组件 
        */}
        <CardTmpl {...pageProps} onChange={this.handleFormChange}>
          <div className='content'>可自定义的内容专区，会放在表单中，按钮（若设置了buttons的话）的前面</div>
        </CardTmpl>
      </div>
    )
  }
}

// 注入antd的Form对象，以便可以在组件中使用 this.props.form
export default Form.create()(UserView);