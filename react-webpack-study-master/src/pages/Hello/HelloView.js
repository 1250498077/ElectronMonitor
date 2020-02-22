import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';
import { Form, Icon, Button } from 'antd';

// 站点配置
import config from 'config/Config';
// 静态资源CDN前缀，页面中的图片img的src属性必须加上它
const CDN_BASE = config.CDN_BASE || '';

// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';
// 引入当前页样式 - 模块化
import styles from './HelloLess.less';
// 多类名样式管理工具
import cx from 'classnames';

// 在视图注入module层数据
@inject('HelloMod')
// 注入全局Store
@inject('AppStore')
// 在组件中可通过this.props.history.push跳转路由789
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class HelloView extends Component {
  // 构造函数，组件的实例创建时，最先执行
  constructor(props, context){
    super(props, context);
    // 注入的HelloMod
    this.stores = this.props.HelloMod;
    this.appStore = this.props.AppStore;
    this.state = {}
  }

  // 已插入真实DOM
  componentDidMount(){
    // 设置关闭页签时触发的回调函数
    this.appStore.setCloseHook(() => {
      console.log('关闭页签时触发');
    })
    // 自定义设置页签标题
    this.appStore.setTabsInfo({
      "/hello": {
        name: "哈哈"
      }
    });
    this.stores.getImgList();
  }

  // 显示/隐藏 "你好，世界"
  toggleHelloWord(e){
    this.stores.setVisible({
      visible: !this.stores.state.visible
    })
  }

  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const { visible, imgList } = this.stores.state;
    console.log('info render');

    // jsx中避免写大量的if else 逻辑，可以写个函数来做处理
    return (
      <div>
        <PageTitle title='示例页面'/>

        {/* 内容块1 */}
        <div className={cx(styles.hello, styles.text)}>样式中引入图片，必须加@{'{CDN_BASE}'}前缀</div>
        <p>&nbsp;</p>


        {/* 内容块3 */}
        <p>页面加载的钩子函数componentDidMount异步请求图片，返回的图片列表</p>
        <ol>
          {
            imgList && imgList.length > 0 && imgList.map((img, i) => {
              return <li><img src={img.url} title={img.name} width='128' height='128'/></li>
            })
          }
        </ol>
        <p>&nbsp;</p>

        {/* 内块3*/}
        <p>点击“点我”按钮，切换显示/隐藏“你好，世界！”
          <Button type='primary' icon='save' onClick={e => this.toggleHelloWord(e)}>点我</Button>
          {
            visible && <h1>你好，世界！</h1>
          }
          {
            !visible && <p>&nbsp;</p>
          }
        </p>
      </div>
    )
  }
}

// 使用AntDesign的Form.create()包裹，以便可以在组件中使用this.props.form获得form对象
export default Form.create()(HelloView);