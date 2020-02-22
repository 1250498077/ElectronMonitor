export default {
  ui: {
    api_url: 'emp/list',
    api_params: 'pageNum=1&pageSize=10',
    api_method: 'GET',
    api_app: '',
    search_bar: {
      fields: {
        name: {
          en_name: 'name',
          zh_name: '姓名',
          elem_type: 'Input',
          rules: []
        },
        age: {
          en_name: 'age',
          zh_name: '年龄',
          placeholder: '请输入年龄',
          elem_type: 'Input'
        },
        sex: {
          en_name: 'sex',
          zh_name: '性别',
          placeholder: '请选择性别',
          elem_type: 'Select'
        },
        zw: {
          en_name: 'zw',
          zh_name: '职务',
          placeholder: '请选择职务',
          elem_type: 'Select'
        },
        gw: {
          en_name: 'gw',
          zh_name: '岗位',
          placeholder: '请选择岗位',
          elem_type: 'Select'
        },
      },
      buttons: {
        onSearch: {
          label: '查询',
          type: 'primary',
          icon: 'search'
        },
        onReset: {
          label: '重置',
          type: 'default',
          icon: 'reload'
        }
      }
    },
    action_bar: {
      onAdd: {
        func_name: 'onAdd',
        label: '新增',
        type: 'primary',
        icon: 'plus',
        url: '/user_edit?actType=add'
      }
    },
    // tabs: {
    //   '1': {
    //     key: '1',
    //     tab: '待激活',
    //     table: {
    //       api_url: 'https://www.easy-mock.com/mock/5c7fb4286498b753ed1f9cd9/example/api/user/list',
    //       api_params: '',
    //       api_method: '',
    //       api_app: '',
    //       get_data_path: 'data.list',
    //       // fields里面的值会转成table的columns
    //       fields: {
    //         name: {
    //           en_name: 'name',
    //           zh_name: '姓名'
    //         },
    //         income: {
    //           en_name: 'income',
    //           zh_name: '收入',
    //           width: 168,
    //           align: 'right'
    //         },
    //         age: {
    //           en_name: 'age',
    //           zh_name: '年龄'
    //         },
    //         sex: {
    //           en_name: 'sex',
    //           zh_name: '性别',
    //           // 取内容项路径
    //           get_item_path: '',
    //           width: 68
    //         },
    //       },
    //       actions: {
    //         onDetail: {
    //           label: '查看',
    //           url: '/user_edit?actType=detail&id='
    //         },
    //         onEdit: {
    //           label: '编辑',
    //           url: '/user_edit?actType=edit&id='
    //         }
    //       }
    //     }
    //   },
    //   '2': {
    //     key: '2',
    //     tab: '已激活',
    //     table: {
    //       api_url: 'https://www.easy-mock.com/mock/5c7fb4286498b753ed1f9cd9/example/api/user/query'
    //     }
    //   },
    //   '3': {
    //     key: '3',
    //     tab: '已过期'
    //   }
    // },
    table: {
      api_url: 'https://www.easy-mock.com/mock/5c7fb4286498b753ed1f9cd9/example/api/user/list',
      api_params: '',
      api_method: '',
      api_app: '',
      fields: {
        name: {
          en_name: 'name',
          zh_name: '姓名'
        },
        income: {
          en_name: 'income',
          zh_name: '收入',
          width: 168,
          align: 'right'
        },
        age: {
          en_name: 'age',
          zh_name: '年龄'
        },
        sex: {
          en_name: 'sex',
          zh_name: '性别',
          width: 68
        },
      },
      actions: {
        onDetail: {
          label: '查看',
          url: 'user_edit?actType=detail&id='
        },
        onEdit: {
          label: '编辑',
          url: 'user_edit?actType=edit&id='
        }
      }
    }
  }
}