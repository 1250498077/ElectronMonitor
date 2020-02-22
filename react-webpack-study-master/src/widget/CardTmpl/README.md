# 卡片模板组件 - 编辑表单
## 介绍
卡片模板是一个新增、编辑表单信息的单据模板，用于对数据库记录的新增、编辑。 它通过JSON来描述界面元素，从而渲染出界面。

## 使用方法
-UserEditConf.js

```javascript
export default {
  ui: {
    // 页面配置信息接口地址 - 元数据
    // page_api_url: '',
    // 页面配置信息接口参数 - 元数据
    // page_api_params: '',

    // 查询单条记录的业务api接口
    api_url: 'api/user/get',
    // 查询单条记录的业务api参数，id为地址栏的参数的key，可附加其它值
    api_params: 'id=&shopId=',
    // 单条记录的应用
    api_app: '',
    // 页面标题
    page_title: '用户信息',
    // 表单行布局，每一个数组元素为fields中对应的key
    rows: [
      'user_name', // 第一行
      'sex', // 第二行
      'hoby',
      'dept',
      ['age', 'height', 'weight'], // 第5行排三列，需要表单成数组
      ['avatar'],
      'birth_date',
      ['resume', 'orgName', 'isParty'],
      ['isRead', 'groups'],
      ['inYearMonth', 'projectPeriod'],
      'tip',
      'remark',
      'safe',
      // 'delivery_address'
    ],
    // 表单元素
    fields: {
      user_name: {
        en_name: 'user_name',
        zh_name: '用户名', // 中文名
        display_name: 'xxx用户名', // 多语言时，将label作为标签翻译
        elem_type: 'Input', // 元素类型
        rules: [ // 输入校验规则
          {
            required: true,
            message: '请输入用户名'
          },
          {
            max: 128,
            message: '不能超过128个字符'
          }
        ],
        col: 12,
        formItemLayout: {}
      },
      sex: {
        en_name: 'sex', // 英文名
        zh_name: '性别', // 中文名
        elem_type: 'RadioGroup', // 元素类型
        // show显示/隐藏
        rules: [ // 输入校验规则
          {
            required: false,
            message: '请选择性别'
          }
        ],
        api_url: 'api/sex/get', // 构件接口地址
        api_params: '', // 构件接口参数
        cmpt_items: [ // 构件项
          {
            label: '男',
            value: '1'
          }, {
            label: '女',
            value: '2'
          }, {
            label: '不明',
            value: '3'
          }
        ]
      },
      hoby: {
        en_name: 'hoby', // 英文名
        zh_name: '爱好', // 中文名
        elem_type: 'CheckboxGroup', // 元素类型
        rules: [ // 输入校验规则
          {
            required: false,
            message: '请选择爱好'
          }
        ],
        /**
         * 若设置了get_value_path，在表单编辑、详情时，则从业务系统API接口的结果集中，对应的路径中取出值，来填充表单元素
         * 比如，结果集为 {resultCode: 0, resultMsg: '', data: {user:{ basic: {hoby: '1,2,3'} }}}
         * 则get_value_path需要设置为user.basic.hoby，默认为hoby，即假定了data的结构为 { hoby: '1,2,3'}
         */
        // get_value_path: 'user.basic.hoby',

        /**
         * 表单元素的可选项来自业务系统API接口，则需要设置api_url跟api_params，组件会根据这个接口地址执行Ajax，
         * 取出可选项，渲染出来。比如下拉框、单选框、复选框的option可选项。
         * 同样的，get_items_path指明了可选项的取值路径，支持嵌套的json，比如，结果集为 
         * {resultCode: 0, resultMsg: '', data: {list: [{label: '旅游', value: '1'}, {label: '高尔夫', value: '7'}]}
         * 则get_items_path需要设置为list
         */
        api_url: 'api/hoby/get', // 内容可选项的接口地址
        api_params: '', // 数据构件接口参数
        // get_items_path： 'list',
        // 若设置了 get_items_path 则内容项从结果集对应的字段的路径中取值

        /**
         * 表单元素的内容项列表，来自元数据系统预先设置的值，或者是开发者自己定义的列表项
         */
        // cmpt_items: [ // 构件项
        //   {
        //     label: '旅游',
        //     value: '1'
        //   }, {
        //     label: '足球',
        //     value: '2'
        //   }, {
        //     label: '兵兵球',
        //     value: '3'
        //   }, {
        //     label: '橄榄球',
        //     value: '4'
        //   }, {
        //     label: '羽毛球',
        //     value: '5'
        //   }
        // ]
      },
      dept: {
        en_name: 'dept', // 英文名
        zh_name: '部门', // 中文名
        elem_type: 'Select', // 元素类型
        rules: [ // 输入校验规则
          {
            required: true,
            message: '请选择部门'
          }
        ],
        cmpt_items: [ // 构件项
          {
            label: '请选择',
            value: ''
          }, {
            label: '产品中心',
            value: '1'
          }, {
            label: 'GDC交付中心',
            value: '2'
          }, {
            label: '人事部',
            value: '3'
          }, {
            label: '财务部',
            value: '4'
          }
        ]
      },
      age: {
        en_name: 'age', // 英文名
        zh_name: '年龄', // 中文名
        elem_type: 'InputNumber', // 元素类型
        rules: [ // 输入校验规则
          {
            required: false,
            message: '请输入年龄'
          }
        ]
      },
      height: {
        en_name: 'height', // 英文名
        zh_name: '身高', // 中文名
        elem_type: 'InputNumber', // 元素类型
        disabled: false,
        rules: [ // 输入校验规则
          {
            required: false,
            message: '请输入身高'
          }
        ]
      },
      weight: {
        en_name: 'weight', // 英文名
        zh_name: '体重', // 中文名
        elem_type: 'InputNumber', // 元素类型
        rules: [ // 输入校验规则
          {
            required: false,
            message: '请输入体重'
          }
        ]
      },
      avatar: {
        en_name: 'avatar', // 英文名
        elem_type: 'Uploader',
        zh_name: '头像', // 中文名
        rules: [ // 输入校验规则
          {
            required: false,
            message: '请输入体重'
          }
        ]
      },
      birth_date: {
        en_name: 'birth_date', // 英文名
        zh_name: '出生日期', // 中文名
        elem_type: 'DatePicker',
        rules: [ // 输入校验规则
          {
            required: true,
            message: '请输入出生日期'
          }
        ]
      },
      resume: {
        en_name: 'resume', // 英文名
        zh_name: '自我介绍', // 中文名
        elem_type: 'TextArea',
        rules: [ // 输入校验规则
          {
            required: false,
            message: '请输入自我介绍'
          }
        ]
      },
      orgName: {
        en_name: 'orgName', // 英文名
        zh_name: '组织机构', // 中文名
        elem_type: 'TreeSelect',
        rules: [ // 输入校验规则
          {
            required: true,
            message: '请输入组织机构'
          }
        ],
        // 设置树的节点的文本的字段名为label，默认是title
        treeNodeLabelProp: 'label',
        // 树目录支持两种数据模式，简单模式，treeDataSimpleMode需要设置为true
        treeDataSimpleMode: true,
        cmpt_items: [
          { id: 1, pId: 0, value:'0-0', label:"广州xxx" },
          { id: 2, pId: 1, value:'0-0-1', label:"产品中心" },
          { id: 3, pId: 1, value:'0-0-2', label:"GDC全球交付中心" },
          { id: 3, pId: 0, value:'0-1', label:"杭州xxxx" }
        ],
        // // 树目录支持两种数据模式，复杂嵌套模式
        // cmpt_items: [{
        //   label: '广州xxx',
        //   value: '0-0',
        //   key: '0-0',
        //   children: [{
        //     label: '产品中心',
        //     value: '0-0-1',
        //     key: '0-0-1',
        //   },
        //   {
        //     label: 'GDC全球交付中心',
        //     value: '0-0-2',
        //     key: '0-0-2',
        //   }]},
        //   {
        //     label: '杭州xxx',
        //     value: '0-1',
        //     key: '0-1',
        //   }]
      },
      isParty: {
        en_name: 'isParty', // 英文名
        zh_name: '是否党员', // 中文名
        elem_type: 'Switch',
        rules: [ // 输入校验规则
          {
            required: true,
            message: '请勾选是否党员'
          }
        ]
      },
      isRead: {
        en_name: 'isRead', // 英文名
        zh_name: '阅读协议', // 中文名
        elem_type: 'Checkbox',
        rules: [ // 输入校验规则
          {
            required: true,
            message: '请勾选阅读协议'
          }
        ]
      },
      isActive: {
        en_name: 'isActive', // 英文名
        zh_name: '激活', // 中文名
        elem_type: 'Radio',
        rules: [ // 输入校验规则
          {
            required: true,
            message: '请勾选激活'
          }
        ]
      },
      groups: {
        en_name: 'groups', // 英文名
        zh_name: '群组', // 中文名
        elem_type: 'Cascader',
        cmpt_items: [
          { id: 1, pid: 0, value: 'zhejiang', label: '浙江' },
          { id: 2, pid: 0, value: 'jiangsu', label: '江苏' },
          { id: 3, pid: 1, value: 'hangzhou', label: '杭州' },
          { id: 4, pid: 3, value: 'xihu', label: '西湖' },
          { id: 5, pid: 2, value: 'nanjing', label: '南京' },
          { id: 6, pid: 5, value: 'zhonghuamen', label: '中华门' }
        ],
        // cmpt_items: [{
        //   value: 'zhejiang',
        //   label: '浙江',
        //   children: [{
        //     value: 'hangzhou',
        //     label: '杭州',
        //     children: [{
        //       value: 'xihu',
        //       label: '西湖',
        //     }],
        //   }],
        // }, {
        //   value: 'jiangsu',
        //   label: '江苏',
        //   children: [{
        //     value: 'nanjing',
        //     label: '南京',
        //     children: [{
        //       value: 'zhonghuamen',
        //       label: '中华门',
        //     }],
        //   }],
        // }],
        rules: [ // 输入校验规则
          {
            required: true,
            message: '请选择群组'
          }
        ]
      },
      inYearMonth: {
        en_name: 'inYearMonth', // 英文名
        zh_name: '入职年月', // 中文名
        format: 'YYYY-MM',
        elem_type: 'MonthPicker',
        rules: [ // 输入校验规则
          {
            required: false,
            message: '请选择入职年月'
          }
        ]
      },
      projectPeriod: {
        en_name: 'projectPeriod', // 英文名
        zh_name: '项目周期', // 中文名
        elem_type: 'RangePicker',
        rules: [ // 输入校验规则
          {
            required: false,
            message: '请选择项目周期'
          }
        ]
      },
      tip: {
        en_name: 'tip', // 英文名
        zh_name: '注意事项', // 中文名
        elem_type: 'Text'
      },
      remark: {
        en_name: 'remark', // 英文名
        zh_name: '备注', // 中文名
        elem_type: 'Editor',
        col: 24,
        rules: [ // 输入校验规则
          {
            required: true,
            message: '请输入备注'
          }
        ]
      },
      safe: {
        en_name: 'safe',
        zh_name: '安全事项',
        elem_type: 'FormItem'
      },
      delivery_address: {
        en_name: 'delivery_address',
        zh_name: '收货地址',
        elem_type: 'AreaPicker',
        levelNum: 5,
        col: 24,
        required: true,
        insideRequest: true,
        fieldNames: { label: "label", code: "value" }
      }
    },
    // 成功后跳转的页面
    success_url: '/user_list',
    // 表单底部操作按钮，按钮可使用render函数自定义
    buttons: {
      onSave: {
        api: {
          url: 'api/user/save',
          // data: '',
          // app: '',
          method: 'GET'
        }
      },
      onCancel: {
        url: '/user_list',
        // url_params: '?a=1&b=2'
      },
      onAudit: {}
    },
  }
}
```

- UserEditView.js
```javascript
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
          value: '令狐冲',
        },
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
    this.setState({ biz });
  }

  // 初始状态或状态变化会触发render
  render() {
    // 业务开发者可配置页面自定义的配置属性，比如如按钮的自定义处理事件、自定义提交表单等
    let customProps = {
      // 业务数据
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
      <div>
        {/* 
          卡片模板需要传入页面描述信息，如布局、表单元素、组件属性、页面接口等
          onChange 用于同步卡片模板组件的状态到当前组件 
        */}
        <CardTmpl {...pageProps} onChange={this.handleFormChange}>
          <div style={{marginLeft: '200px', height: '50px', color: 'green', fontWeight: 'bold'}}>可自定义的内容专区，会放在表单中，按钮（若设置了buttons的话）的前面</div>
        </CardTmpl>
      </div>
    )
  }
}

// 注入antd的Form对象，以便可以在组件中使用 this.props.form
export default Form.create()(UserView);
```