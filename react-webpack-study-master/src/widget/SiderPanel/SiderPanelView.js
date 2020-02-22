import React, { Component } from 'react'
import styles from './SiderPanelLess.less'
import PropTypes from 'prop-types'

/**
 *  侧边栏
 * 
 * @author 周瑜
 * @date 2018-6-22
 */
export default class SliderPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: this.props.show || false,
      style: this.props.style || {},
    }
  }

  changeShow = (e) => {
    this.props.changeShow();
  }

  render(){
    const { children } = this.props
    return (
      <div className={`${this.props.show?styles.backbg:{}}`}  onClick={(e)=>this.changeShow(e)}>
        <div
          className={`${this.props.show?styles.crowdShow:styles.crowd}`}     
          style={this.props.style}  
          onClick={(e)=>e.stopPropagation()}
          >
          {children}
        </div>
      </div>
    )
  }
}

SliderPanel.propTypes = {
  show: PropTypes.bool,
  style: PropTypes.object,
}