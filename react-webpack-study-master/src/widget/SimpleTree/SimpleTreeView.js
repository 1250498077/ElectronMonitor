import React, { Component } from 'react';
import { Tree, Button } from 'antd';
// 站点配置信息
import config from 'config/Config';
// 样式工具
import cx from 'classnames';
import { get, omit } from 'lodash';

const TreeNode = Tree.TreeNode;

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

class SimpleTreeView extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {
      autoExpandParent: false,
      selectedKeys: [],
      checkedKeys: [],
      parentKey: ''
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
        let parentKey =  getParentKey(selectedKeys[0], that.props.treeData);
        that.props.onSelectNode(selectedKeys, parentKey);
      }
    })
  }

  // 勾选复选框处理
  handleCheck(checkedKeys, e){
    let that = this;
    console.log('e:', e);
    this.setState({
      checkedKeys
    }, () => {
      // 勾选节点的key、父节点的key通过onCheckNode函数回传
      if(!!that.props.onCheckNode){
        let parentKey =  getParentKey(checkedKeys[0], that.props.treeData);
        that.props.onCheckNode(checkedKeys, parentKey);
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

  // 递归遍历树目录
  loop(data){
    let self = this;
    return data.map((item) => {
      // 临时的key
      let tmpKey = item.id + '';
      // 临时的名称
      let name = (item.name || item.title) + '';

      // 附加key
      item.key = tmpKey;
      // 如果有叶子节点，继续递归调用自己
      if(item.children){
        return (
          <TreeNode key={tmpKey} title={<span>{name}</span>}>
            {self.loop(item.children)}
          </TreeNode>
        );
      }
      // 没有子节点，则返回树的内容
      return <TreeNode key={tmpKey} title={<span>{name}</span>}/>;
    })
  }

  // 点击“确定”的处理
  handleConfirm(e){
    e.stopPropagation();
  }

  // 获取扩展的树属性
  getExtTreeProps(props){
    return omit(props, ['onSelectNode', 'onCheckNode'])
  }

  render(){
    const { treeData = [], selectedKeys = [], checkedKeys = [], checkable = false }  = this.props;
    return (
      <div>
        <Tree
          defaultExpandAll={true}
          onSelect={keys => this.handleSelect(keys)}
          onCheck={(keys, e) => this.handleCheck(keys, e)}
          autoExpandParent={this.state.autoExpandParent}
          selectedKeys={selectedKeys}
          checkedKeys={checkedKeys}
          onExpand={keys => this.onExpand(keys)}
          showLine={true}
          checkable
        >
          {this.loop(treeData)}
        </Tree>
      </div>
    )
  }
}

export default SimpleTreeView;