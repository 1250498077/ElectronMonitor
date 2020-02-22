// 加载React
import React, { Component } from 'react';
// 选项卡、表格、弹出确认框
import { Form, Tabs, Table, Pagination, Button, Row, message } from 'antd';
// 样式管理器
import cx from 'classnames';
// 引入lodash
import { get, pick, isArray, isString, cloneDeep, isBoolean, isEmpty, isPlainObject, isFunction, has, omit } from 'lodash';

// 地址栏参数获取
import utils from 'utils';
// 当前组件样式
import styles  from './QueryPageLess.less';
// 引入卡片模板组件 - 用于显示搜索栏的部分
import CardTmpl from 'widget/CardTmpl/CardTmplView';
import { renderActionBar } from './ActionBar';

import { fetchTableDatas, getTabsTable, getTableProps, syncDatasToParent } from './QueryUtils';

const TabPane = Tabs.TabPane;
// 表单项
const FormItem = Form.Item;

// 导出组件
class QueryPage extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  validForm = (e, form) => {
    return new Promise((resolve, reject) => {
      form.validateFieldsAndScroll((err, values) => {
        resolve({err, values});
      });
    })
  }

  handleSubmit = async (e, ui, buttons, form) => {

  }

  //准备：即将被重新渲染，状态未变化
  componentWillMount() {}
  //准备：即将被重新渲染，状态未变化
  componentWillUpdate(nextProps, nextState) {}
  //完成：正在被重新渲染，状态已变化
  componentDidUpdate(prevProps, prevState) {}
  // 已加载组件，收到新属性时调用
  async componentWillReceiveProps(nextProps) {}
  //组件将被卸载
  componentWillUnmount(){
    //重写组件的setState方法，直接返回空
    this.setState = (state, callback) => {
      return
    }
  }
  // 已插入真实DOM
  async componentDidMount(){
    // 获取已填充了dataSource的table
    let bizTabs = await fetchTableDatas(this.props);
    // 同步数据到父组件
    syncDatasToParent(bizTabs, this.props);
  }

  getUITabs(){
    return get(this.props, 'ui.tabs', {});
  }

  getTabsKeyArray(tabs){
    if(!tabs){
      return {};
    }
    if(tabs){
      return Object.keys(tabs);
    }
    return Object.keys(this.getUITabs());
  }

  getUITable(){
    return get(this.props, 'ui.table', {});
  }

  onTabChange = (activeKey) => {
    let copyBiz = this.props.biz;
    copyBiz.activeKey = activeKey;
    this.props.onChange && this.props.onChange(copyBiz);
  }

  // 初始状态或状态变化会触发render
  render(ReactElement, DOMElement, callback) {
    // 先使用默认的布局
    let pageProps = {
      ui: {
        fields: get(this.props, 'ui.search_bar.fields', {}),
        buttons: get(this.props, 'ui.search_bar.buttons', {})
      },
      biz: this.props.biz
    }

    let actionBar = get(this.props, 'ui.action_bar', {});
    let uiTabs = this.getUITabs(), tabsKeyArr = this.getTabsKeyArray(uiTabs), uiTable = this.getUITable();

    return (
      <div className='yx-list-table'>
        {/* 查询表单 */}
        <CardTmpl {...pageProps} onChange={this.props.onChange}>
          { this.props.children }
        </CardTmpl>

        {/* 操作栏 */}
        { renderActionBar(actionBar) }


        {/* 数据表格 - 多选项卡 */}
        {
          0 !== tabsKeyArr.length && (
            <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
              {
                tabsKeyArr.map((k, i) => {
                  let tmpTable = getTabsTable(uiTabs, tabsKeyArr, k, i);
                  return (
                    <TabPane {...uiTabs[k]}>
                      {
                        !isEmpty(tmpTable) && (
                          <Table {...getTableProps(tmpTable, k, this.props)}/>
                        )
                      }
                    </TabPane>
                  )
                })
              }
            </Tabs>
          )
        }

        {/* 数据表格 - 无选项卡单表 */}
        {
          !isEmpty(uiTable) && (
            <Table {...getTableProps(uiTable, null, this.props)}/>
          )
        }

      </div>
    )
  }
}

export default Form.create()(QueryPage);