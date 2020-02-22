import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import { isEmpty } from 'lodash';

import { Form } from 'antd';
// 引入列表组件
import ListPage from 'widget/ListPage/ListPageView';
// 页面标题
import PageTitle  from 'widget/PageTitle/PageTitleView';

// 站点配置
import config from 'config/Config';
// 静态资源CDN前缀，页面中的图片img的src属性必须加上它
const CDN_BASE = config.CDN_BASE || '';
// 千分位组件
import ThousandBit from 'widget/ThousandBit/ThousandBitView';

// 注入在config/Stores.js中注册的EmpListMod，以便获取store中的状态state或调用方法
@inject('EmpListMod')
// 注入全局Store，用于调用关闭页签回调等
@inject('AppStore')
// 将组件设置为响应式组件，成为观察者，以便响应被观察数据的变化
@observer
// 在组件中可通过this.props.history.push跳转路由
@withRouter
class EmpListView extends  Component {
 constructor(props, context) {
    super(props, context);
    this.store = this.props.EmpListMod;
    this.appStore = this.props.AppStore;
    this.state = {
      // 列表复选框的值
      checkedValues: [],
      // 过滤
      filteredInfo: null,
      // 排序
      sortedInfo: null,
    }
  }

  // 勾选框回调
  checkHandle(checkedValues){
    this.store.checkedAll({checkedValues});
  }

  // 排序处理
  handleChange(pagination, filters, sorter){
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  componentDidMount (){
    // 设置关闭页签时触发的回调函数，清空状态机的值
    this.appStore.setCloseHook(() => {
      this.store.clearState();
      console.log('关闭页签时触发');
    })
  }

  componentWillUnmount(){
    console.log('组件即将卸载');
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    let pageProps = {
      ui: {
        api_url: 'emp/list', // 接口地址
        method: 'GET', // 接口请求方式
        params: 'pageNum=1&pageSize=10', // 接口默认参数
        mockData: null, // 模拟数据
        search_bar:{ // 查询栏
          pasteTargetList: ['name'], // 拦截name输入框剪贴板粘贴事件，把多行的数据，转换为逗号分割
          fields: [
            {
              en_name: 'name', // 字段英文名
              zh_name: '姓名', // 字段中文名
              elem_type: 'Input', // 页面元素类型
              elem_valid_type: 'string', // 页面元素校验类型，使用antd的校验类型，支持正则表达式
              required: true,
            },
            {
              en_name: 'age',
              zh_name: '年龄',
              placeholder: '请输入年龄',
              elem_type: 'Input',
              elem_valid_type: 'string'
            },
            {
              en_name: 'sex',
              zh_name: '性别',
              placeholder: '请选择性别',
              elem_type: 'Select',
              elem_valid_type: 'string'
            },
            {
              en_name: 'zw',
              zh_name: '职务',
              placeholder: '请选择职务',
              elem_type: 'Select',
              elem_valid_type: 'string'
            },
            {
              en_name: 'gw',
              zh_name: '岗位',
              placeholder: '请选择岗位',
              elem_type: 'Select',
              elem_valid_type: 'string'
            },
          ],
        },
        action_bar: [ // 顶部操作栏
          {
            func_name: 'onAdd', // 按钮的函数名称，约定为on开头的驼峰
            label: '新增', // 按钮名称
            type: 'primary', // 高亮按钮
            icon: 'plus', // 图标为加号
            onClick: (e, rows) => { // 自定义点击事件，第二个参数rows为当rowSelection: '1'时，返回选中行的数据
                console.log('e:', e, 'rows:', rows)
            }
          },
        ],
        // 表格配置项
        table: {
          // 显示复选框
          extProps: {
            rowSelection: true,
          },
          // 不显示分页条
          // pagination: false,
          fields: [ // 表头字段列，兼容antd的其它字段
            {
              en_name: 'name', // 字段英文名
              zh_name: '姓名', // 字段中文名
              filters: [{
                text: '蓝凤凰',
                value: '蓝凤凰',
              }, {
                text: '任我行',
                value: '任我行',
              }],
              onFilter: (value, record) => record.name.indexOf(value) === 0,
              sorter: (a, b) => a.name.length - b.name.length,
              sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
            },
            {
              en_name: 'income',
              zh_name: '收入',
              width: 168,
              align: 'right',
              render: (text, record, index) => {
                let tbProps = {
                  // 需要格式化的数字，默认0
                  number: record.income,
                  // 需要保留的小数位，默认0
                  precision: 2,
                  // 是否需要加金额前缀，默认false
                  prefix: '￥',
                  // 千分位的样式
                  style: {
                    color: '#333',
                    fontWeight: 'bold'
                  }
                }
                return <ThousandBit {...tbProps}/>
              }
            },
            {
              en_name: 'age',
              zh_name: '年龄',
              onFilter: (value, record) => record.age.indexOf(value) === 0,
              sorter: (a, b) => a.age - b.age,
              sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
              width: 88,
              // 数字一般右对齐
              align: 'right'
            },
            {
              en_name: 'sex',
              zh_name: '性别',
              width: 68
            },
          ],
          actions: [ // 表格操作
            {
              func_name: 'onDetail',
              label: '查看',
              render: (record) => { // 自定义渲染操作
                return <Link to={'#/?id=' + record.id}>&nbsp;查看</Link>
              }
            },
            {
              func_name: 'onEdit',
              label: '编辑',
              render: (record) => {
                return <Link to={'#/?id=' + record.id}>&nbsp;编辑</Link>                 
              }
            }
          ]
        }
      }
    }

    // 同步表单输入的值到状态机
    if(!!this.store.state.biz){
      pageProps.biz = this.store.state.biz;
      pageProps.biz.syncBackCbf = (payload) => {
        this.store.setFormVal(payload);
      }
    }

    return (
      <div>
        <PageTitle title='员工列表'/>
        {
          pageProps && (
            <ListPage pageProps={pageProps} onCheck={ checkedValues => this.checkHandle(checkedValues)} handleChange={this.handleChange.bind(this)}/>
          )
        }
      </div>
    )
  }
}

// 注入antd的Form对象，以便可以在组件中使用 this.props.form
export default Form.create()(EmpListView);