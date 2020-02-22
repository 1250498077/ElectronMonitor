/**
 * 点状 步骤
 */
import React, { Component } from 'react'
import styles from "./StepPointLess.less";
import {
  Button, Row, Col, Modal, Input, InputNumber, Card, Icon,
  Form, Select, Radio, Checkbox, DatePicker, Cascader, message,
  Steps
} from 'antd'

import cx from "classnames";

class StepPiont extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stepsList: this.props.stepsList || [],
      currentStep: this.props.currentStep || 1,
    }
  }
  //组件卸载时解绑键盘事件
  componentWillUnmount() {

  }
  //组件挂载时绑定键盘事件
  componentDidMount() {

  }

  render() {
    const stepsList = this.props.stepsList || [];
    const  currentStep = this.props.currentStep || 1;

    return (
      <div className={styles.stepWrap}>
        {
          stepsList && stepsList.map((item, index) => {
            return (
              // <Col key={item.id} span={parseInt(24 / stepsList.length)} >
              <Col key={item.id} >
                <div className={cx('iflex', currentStep >= item.id ? styles.stepsActive : '')}>
                  <span style={{ minWidth: "32px" }} className={cx(styles.steps, currentStep > item.id ? styles.svgActive : currentStep == item.id ? styles.currentStep : '')}>
                    {currentStep > item.id ? <Icon type="check" className={cx(styles.icon)} /> :
                      <Icon >{index + 1} </Icon>
                    }
                  </span>
                  <div style={{ minWidth: "56px" }}>
                    <span className={cx(styles.stepTitle)}>{item.title}</span>
                    <span className={cx(styles.description)}>{item.description}</span>
                  </div>

                  {item.id !== stepsList.length &&
                    <ul className={cx(styles.ul)}>
                      {Array(3).fill('').map((item, index) => {
                        return <li key={index}></li>
                      })
                      }
                    </ul>
                  }
                </div>
              </Col>
            )
          })
        }

      </div>


    )
  }
}

export default StepPiont
