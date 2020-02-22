import React, { Component } from 'react';
import styles from './SinglePrintLess.less'
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
    // waterMarkSign
    let tableList = [];
    // 生成三个订单
    for (let i = 0; i < 3; i++) {
      tableList.push(
        <div style={{margin: '0 10px 0 10px',position: 'relative'}}>

          <div className={styles.title}>
            <h1>订单{i + 1}</h1>
          </div>

          <div className={styles.orderInfo}>
            <div className={styles.orderInfoItem}>
              <span>订单编号：</span>
              <span>13245641235421324</span>
            </div>
            <div className={styles.orderInfoItem}>
              <span>商家：</span>
              <span>广州市xxx电脑购物商场</span>
            </div>
            <div className={styles.orderInfoItem}>
              <span>订单时间：</span>
              <span>2019年3月27日</span>
            </div>
            <div className={styles.orderInfoItem}>
              <span>支付方式：</span>
              <span>微信支付</span>
            </div>
            <div className={styles.orderInfoItem}>
              <span>客户地址：</span>
              <span>广东省广州市鱼珠智谷</span>
            </div>
            <div className={styles.orderInfoItem}>
              <span>配送方式：</span>
              <span>圆通快递</span>
            </div>
            <div className={styles.orderInfoItem}>
              <span>客户电话：</span>
              <span>137****7894</span>
            </div>
            <div className={styles.orderInfoItem}>
              <span>运费：</span>
              <span>1800元</span>
            </div>
          </div>
          <table className={styles.tableCon}>
            {/*展示头部信息*/}
            <thead>
            <tr>
              <td colSpan={2}  style={{border:'none',textAlign: 'left'}}>
                客户名称xxx科技有限公司
              </td>
              <td colSpan={2}  style={{border:'none',textAlign: 'left'}}>
                2018-11-20 至 2018-11-21
              </td>
              <td colSpan={1}  style={{border:'none',textAlign: 'left'}}>
                币别：人民币
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

            {/*脚注*/}
            <tfoot>
            <tr>
              <td colSpan={10}  style={{border:'none',textAlign:'right'}}  align="right">
                总金额：1000000元
              </td>
            </tr>
            <tr>
              <td colSpan={10}  style={{border:'none',textAlign:'left'}}  align="left">
                备注： 以上数据均为虚构数据
              </td>
            </tr>
            </tfoot>
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