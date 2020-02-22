import React, {Component, PropTypes} from 'react';
import { Tree, Input, Button, Row, Col, Form, Modal, Popconfirm, Select, Icon, Upload, message, Checkbox, Pagination } from 'antd';

import cx from 'classnames';
import { get, trim } from 'lodash';

import styles from './CategoryTreeLess.less';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;
// 树目录的所有节点的信息打平成一维数组，以便检索
let dataList = [];

// 设置扁平的节点信息列表
const setDataList = (arr) => {
  for (var i = 0; i < arr.length; i++) {
    arr[i].key = arr[i].id;
    dataList.push({...arr[i]});
    if(arr[i].children){
      setDataList(arr[i].children);
    }
  }
}

// 通过当前节点的key去检索父级节点key
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

export default class CategoryTreeView extends Component{
  constructor(props, context){
    super(props, context);
    this.state = {
      searchValue: '',
      selectedKeys: [],
      expandedKeys: [],
      autoExpandParent: false
    }
  }

  // 选中处理
  handleSelect(selectedKeys){
    let that = this;
    this.setState({
      selectedKeys
    }, () => {
      // 选中节点的key、父节点的key通过onSelectNode函数回传
      if(!!that.props.onSelectNode){
        let parentKey =  getParentKey(selectedKeys[0], that.props.categoryList);
        that.props.onSelectNode(selectedKeys, parentKey);
      }
    })
  }

  // 展开树目录
  onExpand(expandedKeys){
    this.setState({
      expandedKeys,
      autoExpandParent: false
    })
  }

  // 处理新增按钮点击
  handleAddBtn(e, item){
    // 阻止事件冒泡
    e.stopPropagation();
    if(!!this.props.onAddNode){
      let parentKey =  getParentKey(item.key, this.props.categoryList);
      this.props.onAddNode(item, parentKey);
    }
  }

  // 处理删除按钮
  handleDeleteBtn(e, item){
    // 阻止事件冒泡
    e.stopPropagation();
  }

  // 处理删除树节点请求
  deleteItem(e, item){
    // 阻止事件冒泡
    e.stopPropagation();
    if(!!this.props.onRemoveNode){
      let parentKey =  getParentKey(item.key, this.props.categoryList);
      this.props.onRemoveNode(item, parentKey);
    }
  }

  // 计算类目树的文本
  getTextTitle(item){
    const name = item.name;
    let { searchValue } = this.state;
    // 空值判断
    if(!name){
      return <span>&nbsp;</span>
    }
    let index = -1, beforeStr = '', afterStr = '';
    if(searchValue){
      index = name.search(searchValue);
      beforeStr = name.substr(0, index);
      afterStr = name.substr(index + searchValue.length);
    }
    let text = null;
    if(index > -1){
      text = <span>
        {beforeStr}
        <span style={{color: '#f50'}}>{searchValue}</span>
        {afterStr}
      </span>
    }else{
      text = <span>{name}</span>
    }
    return text
  }

  // 树目录的标题，包含浮层操作栏 item节点的数据对象
  getTreeTitle(item) {
    // 是否根节点
    let isRootNode = '0' === '' + item.id;
    let title = this.getTextTitle(item);
    return (
      <div  className={styles.treeTitle}>
        <span>{title}</span>
        {/* 树目录的浮层操作栏 */}
        <div  className={styles.treeTitleHover}>

          {/* 如果是跟节点，则只显示新增（子节点）按钮 */}
          {
            isRootNode && <span  onClick={(e) => this.handleAddBtn(e, item)}>新增</span>
          }

          {/* 非根节点，则显示新增（子节点）+删除按钮 */}
          { 
            !isRootNode && (
              <div>
                <span  onClick={(e) => this.handleAddBtn(e, item)}>新增</span>
                <Popconfirm Collapse title={`确定要删除吗？`} okText='确定' cancelText='取消' onConfirm={(e) => this.deleteItem(e, item)}>
                  <span onClick={(e) => this.handleDeleteBtn(e, item)}>删除</span>
                </Popconfirm>
              </div>
            )
          }
        </div>
      </div>
    )
  }

  // 递归遍历树目录
  loop(data){
    let self = this;
    return data.map((item) => {
      // 临时的key
      let tmpKey = item.id + '';
      // 附加key
      item.key = tmpKey;
      // 如果有叶子节点，继续递归调用自己
      if(item.children){
        return (
          <TreeNode key={tmpKey} title={self.getTreeTitle(item)}>
            {this.loop(item.children)}
          </TreeNode>
        );
      }
      // 没有子节点，则返回树的内容
      return <TreeNode key={tmpKey} title={self.getTreeTitle(item)}/>;
    })
  }

  // 搜索框变化
  onChange = (e) => {
    let self = this;
    const value = e.target.value;
    const expandedKeys = dataList.map((item) => {
      if (item.name.indexOf(value) > -1) {
        return getParentKey(item.key, self.props.categoryList);
      }
      return [];
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true
    })
  }

  // 处理上移
  hanleMoveUp = (e) => {
    // 阻止事件冒泡
    e.stopPropagation();
    if(this.props.onMoveUp){
      this.props.onMoveUp()
    }
  }

  // 处理下移
  handMoveDown = (e) => {
    // 阻止事件冒泡
    e.stopPropagation();
    if(this.props.onMoveDown){
      this.props.onMoveDown()
    }
  }

  // 处理置顶
  handleMoveTop = (e) => {
    // 阻止事件冒泡
    e.stopPropagation();
    if(this.props.onMoveTop){
      this.props.onMoveTop()
    }
  }

  // 处理置底
  handleMoveBottom = (e) => {
    // 阻止事件冒泡
    e.stopPropagation();
    if(this.props.onMoveBottom){
      this.props.onMoveBottom()
    }
  }


  render(){
    const { categoryList } = this.props;
    const { selectedKeys, expandedKeys, autoExpandParent } = this.state;
    const showTree = categoryList && categoryList.length > 0;
    const expandedAll = !expandedKeys || (expandedKeys && expandedKeys.length === 0);

    // 设置扁平的节点信息列表
    if(0 === dataList.length && 0 !== categoryList.length){
      setDataList(categoryList);
    }

    return (
      <div className={styles.treeWrap}>
        <Row style={{width: '100%'}} className={cx(styles.content, 'iblock', 'txtleft')}>
          {/* 左侧树目录 */}
          <Col span={6} className={styles.contentLeft}>
            {/* 搜索栏 */}
            <div className={styles.area1}>
              <Search style={{width: '100%'}} placeholder="搜索" onChange={this.onChange}/>
              <div className="mg1t text-info">
                {/*<Icon type="exclamation-circle fsize14" />  请选中节点后再进行以下操作*/}
                <Button type='default' className='mg1r' onClick={e => this.hanleMoveUp(e)}><Icon type="arrow-up" />上移</Button>
                <Button type='default' className='mg1r' onClick={e => this.handMoveDown(e)}><Icon type="arrow-down" />下移</Button>
                <Button type='default' className='mg1r' onClick={e => this.handleMoveTop(e)}><i className="iconfont icon-shu-zhiding"></i>置顶</Button>
                <Button type='default' className='mg1r' onClick={e => this.handleMoveBottom(e)}><i className="iconfont icon-shu-zhidi-copy"></i>置底</Button>
              </div>
            </div>

            {/* 树目录内容 */}
            <div className={styles.area2}>
              <div className={styles.tree} style={{height: '500px'}} >
                {/* 部分展开 */}
                {
                  showTree && !expandedAll && (
                    <Tree
                      defaultExpandAll={true}
                      onSelect={keys => this.handleSelect(keys)} 
                      autoExpandParent={autoExpandParent} 
                      selectedKeys={selectedKeys}
                      onExpand={keys => this.onExpand(keys)}
                      expandedKeys={expandedKeys}
                      showLine
                    >
                      {this.loop(categoryList)}
                    </Tree>
                  )
                }

                {/* 全部展开 */}
                {
                  showTree && expandedAll && (
                    <Tree
                      defaultExpandAll={true}
                      onSelect={keys => this.handleSelect(keys)} 
                      autoExpandParent={autoExpandParent} 
                      selectedKeys={selectedKeys}
                      onExpand={keys => this.onExpand(keys)}
                      showLine
                    >
                      {this.loop(categoryList)}
                    </Tree>
                  )
                }
              </div>
            </div>
          </Col>

          {/* 右侧自定义内容 */}
          <Col span={18}>
            {this.props.children}
          </Col>
        </Row>
      </div>
    )
  }
}