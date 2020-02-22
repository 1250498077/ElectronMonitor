 //列表页一些配置
const cfg = {
  //表格是否添加滚动条td上限
  scrollTd: 5,
  //表格滚动配置
  tableScroll: { x: 1200 },
  //处理表格是否有滚动条 
  tableTdLength: e => {
    let scroll = {};
    if (e.length > cfg.scrollTd) {
      scroll = { x: 1200 };
    }
    //return scroll;
    return {};
  },
  //处理表格头部信息
  columns: e => {
    let widthName = {
      //日期
      time: '150px',
      //手机
      phone: '115px',
    };
    e.map(item => {
      //如果是日期，宽度100
      for (let i in widthName) {
        if (item['name'] == i) {
          item.width = widthName[i];
        }
      };
      if (item['title'] == '序号') {
        item.width = '65px';
      }
    });
    return e;
  },
  //搜索框布局
  searchCol: {
    xs: { span: 24 },
    md: { span: 12 },
    lg: { span: 8 },
    xl: { span: 6 }
  },
  searchFormItem: {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  },
  searchChoiceItem: {
    labelCol: { span: 4 },
    wrapperCol: { span: 10 },
    searchCol: { span: 10 }
  }
}

export default cfg;