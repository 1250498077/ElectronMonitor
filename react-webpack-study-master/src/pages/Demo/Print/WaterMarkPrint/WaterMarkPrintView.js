import React, { Component } from 'react';
import styles from './WaterMarkPrintLess.less'
import { Row, Col } from 'antd';
export default class SeparatePrintView extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {

    }
  }

  // 组件已插入真实DOM
  componentDidMount(){

  }
  // 生成数据和dom
  getTableList() {
    let orderList = []
    for (let i = 0; i < 40; i++) {
      orderList.push(<tr style={{height: '30px'}}>
        <td> 123456789 </td>
        <td> 电脑 </td>
        <td> 5000元 </td>
        <td> 20 </td>
        <td> 无 </td>
      </tr>)
    }
    return orderList
  }

  // 创建dom
  getTableDom() {
    let tableList = [];
    // 生成三个订单
    for (let i = 0; i < 3; i++) {
      tableList.push(
        <div style={{margin: '0 10px 0 10px',position: 'relative'}}>
          <div className={styles.title}>
            <h1>订单{i + 1}</h1>
          </div>
          {/*每调用一次waterMarkSign就是打印一次水印，水印为两行3列*/}
          waterMarkSign
          <table className={styles.tableCon}>
            {/*展示头部信息*/}
            <thead>
            <tr>
              <td colSpan={2}  style={{border:'none',textAlign: 'left'}}>
                客户名称：xxx科技有限公司
              </td>
            </tr>
            <tr>
              <th> 商品编号 </th>
              <th> 物品名称 </th>
              <th> 单价金额 </th>
              <th> 数量 </th>
              <th> 备注 </th>
            </tr>
            </thead>

            {/*展示列表数据*/}
            <tbody style={{textAlign:'center'}}>
            {
              this.getTableList()
            }
            </tbody>
          </table>

        </div>);
    }
    return tableList;
  }

  render(){
    document.title = '订单'
    return (
      <div>
        {
          this.getTableDom()
        }
      </div>
    )
  }
};