import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Form, Icon } from 'antd';
import config from 'config/Config';

// 引入面板组件
import Panel from 'widget/Panel/PanelView';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';

// 在视图注入module层数据
@inject('PanelDemoMod')
// 在组件中可通过this.props.history.push跳转路由
@withRouter
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
class PanelDemoView extends Component {
  constructor(props, context) {
    super(props, context);
    this.stores = this.props.PanelDemoMod;
  }

  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    return (
      <div>
        {/* 页面标题组件 */}
        <PageTitle type='collapse' title='面板组件'/>

        {/* 可折叠面板 */}
        <Panel title="可折叠面板" marginTop='0'>
          这里是可折叠面板内容
        </Panel>

        {/* 卡片面板 */}
        <Panel type='card' title='卡片面板'>
          这里是卡片面板的内容
        </Panel>

        {/* 信息面板 */}
        <Panel type='info' title='信息面板'>
          <div className={`text-normal`}>
            <p><span><i className="mg1r"><Icon type="exclamation-circle" /></i>&nbsp;&nbsp;规则说明：</span>1、规则优先级：渠道、数量、单价。如：先按渠道规则分配物流公司，没有分配物流公司时才按数量规则分配物流公司，依次类推。</p>
            <p>2、收货人地址不在物流公司的配送范围内时不分配物流公司。（由运价规则配置决定）</p>
            <p>3、若是系统分配的物流公司没有启用或者是仓库没有配置该物流公司则不分配物流公司。（由物流公司配置决定）</p>
            <p>4、按数量分配说明：数量指的是主计量单位的数量。</p>
            <p>5、按单价分配说明：一个发货单中的货品单价都在同一个区间内时自动分配物流公司，若是一个发货单中的货品不在同一单价区间内则不分配物流公司。</p>
          </div>
        </Panel>

      </div>
    )
  }
}

export default Form.create()(PanelDemoView);