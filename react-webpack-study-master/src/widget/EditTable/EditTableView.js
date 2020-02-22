// 引入React库
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
// 引入AntDesign组件
import {Table, Row, Col, Button, Select, Radio,  Checkbox, Input, Popconfirm} from 'antd';

// 单选按钮组
const RadioGroup = Radio.Group;
// 复选按钮组
const CheckboxGroup = Checkbox.Group;
// 显示多个样式类名
import cx from 'classnames';
// 引入lodash函数库
import {cloneDeep, isEmpty, isFunction, get, isArray} from 'lodash';
// 当前组件样式
import styles from './EditTableLess.less';

// 选项卡组件
class EditTable extends Component{
  // 构造函数
  constructor(props, context) {
    super(props, context)
    this.state = {
      // 业务类型
      bizType: 'edit_items',
      // 编辑状态
      editStatus: 'done',
      // 表格左边标题
      leftTitle: '',
      // 字段列表
      etFields: [],
      // 表头列表
      etColumns: [],
      // 右上按钮配置
      etButtons: [],
      // 业务数据列表
      etDataSource: [],
      // 确定函数回调
      onOk: null
    }
  }

  //准备：即将被重新渲染，状态未变化
  componentWillMount() {
  }

  // 已加载组件，收到新属性时调用
  componentWillReceiveProps(nextProps) {
    // 初始化可编辑
    this.initEditTable(nextProps)
  }

  // 已插入真实DOM
  componentDidMount() {
    // 初始化可编辑
    this.initEditTable(this.props)
  }

  //组件将被卸载
  componentWillUnmount(){
    //重写组件的setState方法，直接返回空
    this.setState = (state, callback)=>{
      return;
    };
  }

  // 初始化可编辑表格列表
  async initEditTable(props){
    let self = this
    // 获取父组件传来属性
    let {leftTitle, etFields, etDatas, etActions, etButtons, onOk, bizType} = props
    // 业务类型
    bizType = !bizType? self.state.bizType: bizType
    // 通过字段来算出表头列表 + 构件和字段的映射
    let {colsArr} = self.getEtColumns(etFields, etActions)

    // 设置到状态机
    self.setState({
      leftTitle,
      etFields,
      etColumns: colsArr,
      etButtons: isArray(etButtons) ? etButtons : ['edit', 'add'],
      etDataSource: etDatas,
      onOk: onOk
    })
  }

  // 单元格值变化
  onCellChange(colName, colVal, rowIdx){
    // 作用域提升
    let self = this

    // 取出数据列表
    let {etDataSource} = self.state

    if(!etDataSource) etDataSource = [];

    if(0 === etDataSource.length) return false;

    // 克隆一份
    let copyEtDataSource =  cloneDeep(etDataSource)

    copyEtDataSource.map((cel, i) => {
      if(i === rowIdx){
        cel[colName] = colVal
        return
      }
    })
    // 设置到状态机
    self.setState({etDataSource: copyEtDataSource})
    return false
  }

  // 添加数据行
  onAddItems(e){
    // 作用域提升
    let self = this
    // 阻止事件冒泡
    e.preventDefault()
    e.nativeEvent.stopImmediatePropagation()

    // 取出字段列表、数据列表
    let {etFields, etDataSource} = self.state

    if(!etDataSource){
      etDataSource = []
    }

    // 最大key值
    let maxKey = etDataSource.length
    // 克隆一份
    let copyEtDataSource =  cloneDeep(etDataSource)

    if(0 === etFields.length){
      return false
    }

    // 添加数据项
    let tmpObj = {}
    etFields.map((eField, i) => {
      tmpObj[eField.en_name] = ''
    })
    tmpObj['key'] = maxKey + 1
    // 加到数据列表
    copyEtDataSource.push(tmpObj)
    // 设置到状态机
    self.setState({etDataSource: copyEtDataSource, editStatus: 'add'})
    return false
  }

  // 删除数据行
  onRemoveItems(e, index){
    // 作用域提升
    let self = this
    // 阻止事件冒泡
    e.preventDefault()
    e.nativeEvent.stopImmediatePropagation()

    // 取出数据列表
    let {etDataSource} = self.state
    // 克隆一份
    let copyEtDataSource =  cloneDeep(etDataSource)
    // 移除一行
    copyEtDataSource.splice(index, 1)
    // 序号重排
    copyEtDataSource.map((e, i) => {
      e.key = i + 1
    })
    // 设置到状态机
    self.setState(
      {etDataSource: copyEtDataSource},
      () => self.state.onOk(self.state.etDataSource)
    )
    return false
  }

  // 获得构件的列表 - 扩展函数
  getBoxListExt(eField){
    // 作用域提升
    let self = this
    // 下拉框内容
    let cmpt_items = []

    if(!!eField.cmpt_items){
      // 构件项
      cmpt_items = eField.cmpt_items
    }
    return cmpt_items
  }

  // 获取元素的值
  getElemVal(etDatas, index, en_name){

    if(!etDatas){
      return '';
    }

    if(!etDatas[index]){
      return '';
    }

    if(!etDatas[index][en_name]){
      return '';
    }

    // 元素的值
    let elemVal = etDatas[index][en_name];
    // 返回元素的值
    return elemVal
  }
  // 获得普通不可编辑表头
  getTableCol(eField){
    let self = this
    return {
      title: `${eField.zh_name}`,
      dataIndex: `${eField.en_name}`,
      key: `${eField.en_name}`,
      width: eField.width,
      render: isFunction(eField.render) ? eField.render : (text, record, index) => {
        let etDatas = self.state.etDataSource
        // 元素的值
        let elemVal = self.getElemVal(etDatas, index, eField.en_name)

        return <span>{elemVal}</span>
      }
    }
  }
  /* 获得输入框表头
  * etDatas 数据集列表
  * eField 字段元信息
  *
  */
  getInputCol(eField){
    // 作用域提升
    let self = this
    return {
      title: `${eField.zh_name}`,
      dataIndex: `${eField.en_name}`,
      key: `${eField.en_name}`,
      width: eField.width,
      render: (text, record, index) => {
        // 数据列表
        let etDatas = self.state.etDataSource
        // 可编辑状态
        let editStatus = self.state.editStatus
        // 元素的值
        let elemVal = self.getElemVal(etDatas, index, eField.en_name)

        if(('edit' === '' + editStatus) || ('add' === '' + editStatus && index === etDatas.length -1)){
          return (
            <div key={`${eField.en_name}_${index}`}>
              <Input value={elemVal} defaultValue = {elemVal} onChange={ e => {self.onCellChange(`${eField.en_name}`, e.target.value, index)}}/>
            </div>
          )
        }else if(('done' === '' + editStatus) || ('add' === '' + editStatus)){
          return (
            <div>{elemVal}</div>
          )
        }
      }
    }
  }

  /* 获得放大镜(数据参照)构件表头
  * etDatas 数据集列表
  * eField 字段元信息
  *
  */
  getZoomCol(eField){
    // 作用域提升
    let self = this

    return {
      title: `${eField.zh_name}`,
      dataIndex: `${eField.en_name}`,
      key: `${eField.en_name}`,
      width: eField.width,
      render: (text, record, index) => {
        // 数据列表
        let etDatas = self.state.etDataSource
        // 可编辑状态
        let editStatus = self.state.editStatus
        // 元素的值
        let elemVal = self.getElemVal(etDatas, index, eField.en_name)

        if(('edit' === '' + editStatus) || ('add' === '' + editStatus && index === etDatas.length -1)){
          return (
            <div key={`${eField.en_name}_${index}`}>
              <Input value={elemVal} addonAfter={<Icon type='search'  className={styles.btnHover} title='点击弹出选择' />} defaultValue = {elemVal} onChange={ e => {self.onCellChange(`${eField.en_name}`, e.target.value, index)}}/>
            </div>
          )
        }else if(('done' === '' + editStatus) || ('add' === '' + editStatus)){
          return (
            <div>{elemVal}</div>
          )
        }
      }
    }
  }

  /* 获得下拉框表头
  * etDatas 数据集列表
  * eField 字段元信息
  *
  */
  getSelectCol(eField){
    // 作用域提升
    let self = this

    return {
      title: `${eField.zh_name}`,
      dataIndex: `${eField.en_name}`,
      key: `${eField.en_name}`,
      width: eField.width,
      render: (text, record, index) => {
        // 数据列表
        let etDatas = self.state.etDataSource
        // 可编辑状态
        let editStatus = self.state.editStatus
        // 元素的值
        let elemVal = self.getElemVal(etDatas, index, eField.en_name)

        if(('edit' === '' + editStatus) || ('add' === '' + editStatus && index === etDatas.length -1)){
          return (
            <div key={`${eField.en_name}_${index}`}>
              <Select showSearch placeholder={`请选择${eField.zh_name}`} optionFilterProp='children'
                onChange={ e => {self.onCellChange(`${eField.en_name}`, e, index)}}
                defaultValue = {'' + elemVal}
                value= {'' + elemVal}
                filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Select.Option key='' value=''>请选择</Select.Option>
                {
                  self.getBoxListExt(eField).map((cItem, i) => {
                    return (
                      <Select.Option key={`${eField.en_name}_${i}`} value={cItem.value}>{cItem.label}</Select.Option>
                    )
                  })
                }
              </Select>
            </div>
          )
        }else if(('done' === '' + editStatus) || ('add' === '' + editStatus)){
          let item = self.getBoxListExt(eField).filter(cItem => cItem.value === elemVal.toString())[0]
          return (<div>{get(item, 'label', '')}</div>)
        }
      }
    }
  }

  /* 获得单选框表头
  * etDatas 数据集列表
  * eField 字段元信息
  *
  */
  getRadioCol(eField){
    // 作用域提升
    let self = this

    return {
      title: `${eField.zh_name}`,
      dataIndex: `${eField.en_name}`,
      key: `${eField.en_name}`,
      width: eField.width,
      render: (text, record, index) => {
        // 数据列表
        let etDatas = self.state.etDataSource
        // 可编辑状态
        let editStatus = self.state.editStatus
        // 元素的值
        let elemVal = self.getElemVal(etDatas, index, eField.en_name)

        if(('edit' === '' + editStatus) || ('add' === '' + editStatus && index === etDatas.length -1)){
          return (
            <div key={`${eField.zh_name}_${index}`}>
              <RadioGroup value = {'' + elemVal} defaultValue = {'' + elemVal} onChange={e => {self.onCellChange(`${eField.en_name}`, e.target.value, index)}}>
                {
                  this.getBoxListExt(eField).map((cItem, i) => {
                    return (
                      <Radio key={`${eField.en_name}_${i}`} value={cItem.value}>{cItem.label}</Radio>
                    )
                  })
                }
              </RadioGroup>
            </div>
          )
        }else if(('done' === '' + editStatus) || ('add' === '' + editStatus)){
          return (
            <div>{elemVal}</div>
          )
        }
      },
    }
  }

  /* 获得复选框表头
  * etDatas 数据集列表
  * eField 字段元信息
  *
  */
  getCheckBoxCol(eField){
    // 作用域提升
    let self = this

    return {
      title: `${eField.zh_name}`,
      dataIndex: `${eField.en_name}`,
      key: `${eField.en_name}`,
      width: eField.width,
      render: (text, record, index) => {
        // 数据列表
        let etDatas = self.state.etDataSource
        // 可编辑状态
        let editStatus = self.state.editStatus
        // 元素的值
        let elemVal = self.getElemVal(etDatas, index, eField.en_name)

        // 选中的值
        let checkedList = []
        if(-1 !== elemVal.indexOf(',')){
          checkedList.split(',')
        }
        // 复选框选项
        let checkboxOptions = eField.cmpt_items

        if(('edit' === '' + editStatus) || ('add' === '' + editStatus && index === etDatas.length -1)){
          return (
            <div key={`${eField.zh_name}_${index}`}>
              <CheckboxGroup options={checkboxOptions} value={checkedList} defaultValue = {checkedList} onChange={e => {self.onCellChange(`${eField.en_name}`, e.target.value, index)}}/>
            </div>
          )
        }else if(('done' === '' + editStatus) || ('add' === '' + editStatus)){
          return (
            <div>{elemVal}</div>
          )
        }
      },
    }
  }

  /* 获得操作栏
  * etDatas 数据集列表
  * eField 字段元信息
  *
  */
  getActionsCol(actions){
    // 作用域提升
    let self = this

    return {
      title: '操作',
      width: 170,
      // fixed: 'right',
      render: (text, record, index) => (
        <div className="tableAction">
          { self.getListLinks(record, actions, index) }
        </div>
      ),
    }
  }

  // 获取链接数组
  getListLinks(record, links, index){
    // 作用域提升
    let self = this
    // 链接列表
    let linkDomArr = []
    //  临时链接
    // let tmpLink = null

    if(isArray(links) && links.length > 0){
      links.map((link, i) => {
        if('onDelete' === '' + link.func_name){
          if (!isFunction(link.render)) {
            linkDomArr.push(
              <Popconfirm key={'link1_' + i} Collapse title='确定要删除吗？' okText='确定' cancelText='取消' onConfirm={(e) => {self.onRemoveItems(e, index)}}>
                <Link to='#'>删除</Link>
              </Popconfirm>
            )
          } else {
            linkDomArr.push(React.cloneElement(link.render(record, (e) => {self.onRemoveItems(e, index)}), {key: 'link1_' + i}))
          }
        }else{
          // if(has(link, 'render')){
            linkDomArr.push(React.cloneElement(link.render(record), {key: 'link1_' + i}))
          // }else{
          //   linkDomArr.push(<Link key={'link1_' + i} to={tmpLink}>{link.label}</Link>)
          // }
        }
        // linkDomArr.push(<Link key={'link1_' + i} to={tmpLink}>{link.label}</Link>)
        if(links.length > 1 && i !== links.length-1){
          linkDomArr.push(<span key={'link2_' + i} className={cx("ant-divider")}/>)
        }
      })
    }
    return linkDomArr
  }

  // 获取表头字段
  getEtColumns(etFields, etActions){
    // 作用域提升
    let self = this
    // 表头属性列表
    let colsArr = []
    // 字段为空，则表头属性列表为空
    if(!etFields || 0 === etFields.length) return []

    // 临时对象
    let tmpObj = null
    // 遍历字段列表
    etFields.map((eField, idx) => {
      if (eField.non_editable) {
        tmpObj = self.getTableCol(eField)
      } else {
        let types = {
          'input': self.getInputCol.bind(self),      // 输入框
          'select': self.getSelectCol.bind(self),    // 下拉框
          'radio': self.getRadioCol.bind(self),      // 单选框
          'zoom': self.getZoomCol.bind(self),        // 放大镜
          'checkbox': self.getCheckBoxCol.bind(self) // 复选框
        }
        tmpObj = types['' + eField.elem_type](eField)
      }

      // 为空则不渲染
      if(null !== tmpObj){
        colsArr.push(tmpObj)
      }
    })
    // 添加操作栏
    colsArr.push(self.getActionsCol(etActions))

    return {colsArr}
  }

  // 开始编辑列表
  onEditItems(e){
    // 作用域提升
    let self = this
    self.setState({editStatus: 'edit'})
  }

  // 确定编辑结果
  onSubmitItems(e){
    // 作用域提升
    let self = this
    self.setState({editStatus: 'done'}, () => {
      if(!!self.state.onOk && !!self.state.etDataSource){
        self.state.onOk(self.state.etDataSource)
      }
    })
  }

  // 渲染函数
  render(ReactElement, DOMElement, callback) {
    const buttons = this.state.etButtons
    return (
      <div className='publicListTable'>
      {/*内容区域*/}
      <div className={styles.subPages}>
        <Row className={styles.actionNavBar}>
          <Col span={12} className={styles.leftTitle}>{this.state.leftTitle}</Col>
          <Col span={12} className={styles.rightBtn}>
            {
              buttons.some(e => e === 'edit') ? 'done' === '' +  this.state.editStatus && (
                <span>
                  <Button type="primary" size="normal" onClick={e => this.onEditItems(e)} icon="edit">编辑</Button>
                  <span>&nbsp;</span>
                </span>
              ) : ''
            }
            {
              (('edit' ===  '' +  this.state.editStatus) || ('add' ===  '' +  this.state.editStatus)) && (
                <span>
                  <Button type="primary" size="normal" onClick={e => this.onSubmitItems(e)} icon="check">确定</Button>
                  <span>&nbsp;</span>
                </span>
              )
            }
            {
              buttons.some(e => e === 'add') ? <Button
                type="primary"
                size="normal"
                icon="plus"
                onClick={e => this.onAddItems(e)}
              >
                添加
              </Button> : ''
            }
          </Col>
        </Row>
        {/* 可编辑表格 */}
        <Table columns={this.state.etColumns} scroll={{ x: 1500}} dataSource={this.state.etDataSource} pagination={false}/>
      </div>
      </div>
    )
  }
}

export default EditTable;