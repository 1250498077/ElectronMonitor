import React, { Component } from 'react';
import { Row, Col, Checkbox } from 'antd';

import { isEmpty } from "lodash";
import styles from './RadioTableLess.less';

const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}

export default class extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context);
    this.state = {
      modelList: this.props.modelList,
      userAuthList: this.props.userAuthList
    }
  }

  // 单选
  checkOne(val, childIdx, fatherIdx) {
    const oldList = this.props.modelList;
    const modelList = this.props.modelList;
    let arr = []
    modelList[fatherIdx].list[childIdx].childCk = val;
    modelList[fatherIdx].list.map((item, idx) => {
      arr = arr.concat(item.childCk);
    })
    modelList[fatherIdx].ck = arr;
    this.props.sendReq(oldList, modelList)
  }

  //点击全选 第一级
  checkAll(e, val, idx) {
    e.stopPropagation();
    const oldList = this.props.modelList;
    const modelList = this.props.modelList;
    const self = this;
    let arr = [];
    let arr2 = [];
    if (val.ck.length < val.list.length) {
      val.list.map((item, childIdx) => {
        item.childList.map((event) => {
          arr.push(event.value)
          arr2.push(event.value)
        })
        modelList[idx].list[childIdx].childCk = arr;
        modelList[idx].ck = arr2;

        self.props.sendReq(oldList, modelList)
        arr = [];

      });
    } else {
      val.list.map((item, childIdx) => {
        modelList[idx].list[childIdx].childCk = arr;
        modelList[idx].ck = arr2;
        self.props.sendReq(oldList, modelList)
        arr = [];
      });
    }
  }

  //点击全选 第二级
  checkChildAll(val, childIdx, fatherIdx) {
    let arr = [];
    const oldList = this.props.modelList;
    const modelList = this.props.modelList;
    const temp = this.props.modelList[fatherIdx].list[childIdx]
    if (temp.childCk.length < temp.childList.length) {
      temp.childList.map(e => {
        arr.push(e.value)
      });
    }
    let arr2 = []
    modelList[fatherIdx].list[childIdx].childCk = arr;
    modelList[fatherIdx].list.map((item, idx) => {
      arr2 = arr2.concat(item.childCk);
    })
    modelList[fatherIdx].ck = arr2;
    this.props.sendReq(oldList, modelList)
  }

  getAllCheck(obj) {
    let n = 0;
    obj.list.map((event) => {
      n = n + event.childList.length;
    })
    return obj.ck.length == n;
  }
  getAllIndeter(obj) {
    let n = 0;
    obj.list.map((event) => {
      n = n + event.childList.length;
    })
    return obj.ck.length > 0 && obj.ck.length < n
  }
  render() {
    let list = [];
    if (!isEmpty(this.props.userAuthList)) {
      list = this.props.userAuthList
    } else {
      list = this.props.modelList
    }

    return (
      <div> 
        {
          list && list.map((obj, idx) => {                
            return (
              <div style={{ maring: '20px' }} className={styles.radioDiv} key={idx}>
                <Checkbox 
                    indeterminate={this.getAllIndeter(obj)} 
                    className={styles.tableHeader}
                    checked={this.getAllCheck(obj)}
                    onChange={(e)=>this.checkAll(e, obj, idx)}
                >
                  {obj.name} 
                </Checkbox>
                {
                  obj.list.map((item,index)=> {
                    return (
                      <Row key={index}>
                        <Col span={4}>
                            <Checkbox 
                            indeterminate={item.childCk.length > 0 && item.childCk.length < item.childList.length} 
                            checked={item.childCk.length == item.childList.length}
                            onChange={(e)=>this.checkChildAll(e, index, idx)}
                            className={styles.boxChildHead}
                            > 
                                {item.name} 
                            </Checkbox>
                        </Col>

                        <Col span={20}>
                            <CheckboxGroup className={styles.boxGroup} options={item.childList} value={item.childCk} 
                            onChange={(e) =>this.checkOne(e,index,idx)} />
                        </Col>
                      </Row>
                    )
                  })
                }
              </div>
              )
          })
        }
      </div>
    )
  }

  /* 装载之前 */
  componentWillMount() {

  }
  // 插入真实 DOM
  componentDidMount() {

  }

  //准备：即将被重新渲染，状态未变化
  componentWillUpdate(nextProps, nextState) {}

  //完成：正在被重新渲染，状态已变化
  componentDidUpdate(prevProps, prevState) {}

  // 已加载组件，收到新属性时调用
  componentWillReceiveProps(nextProps) {

    // console.log('nextProps: ',nextProps)
  }

}