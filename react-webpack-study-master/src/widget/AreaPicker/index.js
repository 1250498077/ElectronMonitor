/*
 * @author:随云
 * @since 0.1.0
 * @description 省市区街道详细地址五级
 * @modify 
 * @modify-time 
 */
// 引入React库
import React, { Component } from 'react';
import { Row, Col, Input, Select, Form, DatePicker, Button } from 'antd';
import { debounce } from "lodash";

import styles from './index.less';
import { getAreaList, getAllList } from './indexServ';

const Option = Select.Option;

class AreaPicker extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    const areaData = props.areaData || [];
    const fieldNames = props.fieldNames || { value: "value", label: "label", children: "children" }

    this.insideRequest = props.insideRequest || false; // 不需要外部传入数据，内部直接处理
    this.requestFlag = true; // 允许请求设置setState

    this.num = 1;
    this.state = {
      provinceCode: value.provinceCode,
      cityCode: value.cityCode,
      districtCode: value.districtCode,
      streetCode: value.streetCode,
      address: value.address, //详细地址
      async: props.async || false, //是分布加载请求还是一次加载请求
      fieldNames, //自定义label和code,children字段
      levelNum: props.levelNum || 5
    };

    if (!this.insideRequest) {
      this.state = Object.assign(this.state, {
        provinceData: areaData,
        cityData: props.cityData || null,
        districtData: props.districtData || null,
        streetData: props.streetData || null
      })
    }

  }
  //额外属性
  extAttr = () => {
    let excludeAttr = ["value", "areaData", "cityData", "districtData",
      "streetData", "async", "fieldNames", "reqData", "onChange", "id", "size", "data-__meta", "insideRequest", "levelNum"
    ];
    let extAttr = {};
    Object.keys(this.props).forEach((item, idx) => {
      if (excludeAttr.indexOf(item) > -1) {
        //存在不属于额外属性，啥都不干
      } else {
        extAttr[item] = this.props[item]
      }
    })
    return extAttr;
  }

  getCountryData = async () => {
    try {
      const { data, resultCode, resultMsg } = await getAllList();
      if (resultCode == 0) {
        this.requestFlag && this.setState({
          provinceData: data
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  getAreaList = async (code, name) => {
    if (!code) return;
    const { fieldNames } = this.state;
    let codeName = fieldNames.value || "value", labelName = fieldNames.label || "label";

    try {
      const { data, resultCode, resultMsg } = await getAreaList({ parentCode: code });
      if (resultCode == 0) {
        this.requestFlag && this.setState({
          [name]: data.map((item) => {
            return {
              [labelName]: item.name, [codeName]: item.code }
          })
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  init = debounce(() => {
    let { provinceData, cityData, districtData, streetData, provinceCode, cityCode, districtCode, streetCode, fieldNames, async } = this.state;

    let codeName = fieldNames.value || "value",
      labelName = fieldNames.label || "label",
      childrenName = fieldNames.children || "children";
    //判断有无初始化数据
    let cityStatus = Array.isArray(cityData) && cityData.length > 0,
      districtStatus = Array.isArray(districtData) && districtData.length > 0,
      streetStatus = Array.isArray(streetData) && streetData.length > 0;
    if (!cityStatus && provinceCode) {
      let slectProvinceData = Array.isArray(provinceData) && (provinceData.filter((item, idx) => {
        return item[codeName] == provinceCode;
      })[0])
      cityData = slectProvinceData && slectProvinceData[childrenName];
    }
    if (!districtStatus && cityCode) {
      let slectCityData = Array.isArray(cityData) && (cityData.filter((item, idx) => {
        return item[codeName] == cityCode;
      })[0])
      if (slectCityData && slectCityData[childrenName]) {
        districtData = slectCityData && slectCityData[childrenName];
      } else {
        //this.num++
        // this.num<4&&async && this.props.reqData && this.props.reqData(cityCode, "districtData");
      }
      // districtData = slectCityData&&slectCityData[childrenName];
    }
    if (!streetStatus && districtCode) {

      let slectstreetData = Array.isArray(districtData) && (districtData.filter((item, idx) => {
        return item[codeName] == districtCode;
      })[0])
      if (slectstreetData && districtData[childrenName]) {
        streetData = slectstreetData && slectstreetData[childrenName];
      } else {
        this.num++
        if (this.insideRequest) {
          this.num < 4 && async &&this.getAreaList(districtCode, "streetData")
        } else {
          this.num < 4 && async &&this.props.reqData && this.props.reqData(districtCode, "streetData");
        }
      }
    }
    this.setState({
      cityData,
      districtData,
      streetData
    })
  }, 100);

  insideRequestInit = async () => {
    const { districtCode } = this.state;
    await this.getCountryData();
    await this.getAreaList(districtCode, "streetData");
    this.init();
  }

  componentDidMount() {
    if (this.insideRequest) {
      this.insideRequestInit()
    } else {
      this.init()
    }
  }
  componentWillReceiveProps(nextProps) {

    if ('value' in nextProps) {
      const value = nextProps.value || {};
      let areaData = nextProps.areaData || [];
      if (areaData.length <= 0) {
        if(this.state.provinceData && this.state.provinceData.length > 0){
          areaData = this.state.provinceData
        }else{
          // return null
        }
      }

      this.setState({
        provinceCode: value.provinceCode,
        provinceName: value.provinceName,
        cityCode: value.cityCode,
        cityName: value.cityName,
        districtCode: value.districtCode,
        districtName: value.districtName,
        streetCode: value.streetCode,
        streetName: value.streetName,
        address: value.address, //详细地址   
        levelNum: nextProps.levelNum || 5
      });

      if (this.state.async) {
        let streetData = (nextProps.streetData && nextProps.streetData.length > 0) ? nextProps.streetData : this.state.streetData;
        this.setState({
          provinceData: areaData,
          streetData: streetData,
        }, () => {
          this.init()
        })
      }
    }
  }
  levelObj = (data) => {
    let { levelNum = 5 } = this.state
    let { provinceCode, cityCode, districtCode, streetCode, address, provinceName, cityName, districtName, streetName } = data;
    if (levelNum == 5) {
      return { provinceCode, cityCode, districtCode, streetCode, address, provinceName, cityName, districtName, streetName, }
    } else if (levelNum == 4) {
      return { provinceCode, cityCode, districtCode, streetCode, provinceName, cityName, districtName, streetName }
    } else if (levelNum == 3) {
      return { provinceCode, cityCode, districtCode, provinceName, cityName, districtName }
    } else if (levelNum == 2) {
      return { provinceCode, cityCode, provinceName, cityName }
    } else {
      return { provinceCode, provinceName }
    }
  }

  triggerChange = (changedValue) => {
    let obj = this.levelObj(this.state);
    const onChange = this.props.onChange;
    if (onChange) {
      let newObj = this.levelObj(Object.assign({}, obj, changedValue));
      onChange(newObj);
    }
  }

  componentWillUnmount() {
    this.requestFlag = false
    this.setState = (state, callback) => {
      return
    }
  }

  AreaPicker = (value, option, currentCode, nextData) => {
    let { provinceData, cityData, districtData, streetData, async, cityCode, districtCode, streetCode, address } = this.state;
    let { childrenData = [], dataItem, children } = option.props;
    let obj = {};

    if (currentCode == "provinceCode") {
      obj = { provinceCode: value, provinceName: children, cityCode: null, districtCode: null, streetCode: null }
    } else if (currentCode == "cityCode") {
      obj = { cityCode: value, cityName: children, districtCode: null, streetCode: null }
    } else if (currentCode == "districtCode") {
      obj = { districtCode: value, districtName: children, streetCode: null }
    } else {
      if (Array.isArray(children)) {
        obj = { streetCode: value, streetName: children[1] }
      } else {
        obj = { streetCode: value, streetName: children }
      }

    }
    if (async &&nextData && childrenData && childrenData.length <= 0) {
      if (this.insideRequest) {
        this.getAreaList(value, nextData, dataItem)
      } else {
        this.props.reqData && this.props.reqData(value, nextData, dataItem);
      }

    }
    if (nextData && childrenData && childrenData.length > 0) {
      this.setState({
        [nextData]: childrenData
      })
    }
    if (!('value' in this.props)) {
      this.setState(obj)
    }
    this.triggerChange(obj);
  }

  inputValue = (e) => {
    let value = e.target.value;
    if (!('value' in this.props)) {
      this.setState({ "address": value })
    }
    this.triggerChange({ "address": value });
  }

  selectChange = (val, option) => {
    console.log("val,option", val, option)
  }

  render() {

    let { provinceData, provinceCode, cityCode, districtCode, streetCode, cityData, districtData, streetData, fieldNames, address, levelNum = 5 } = this.state;
    let codeName = fieldNames.value || "value", labelName = fieldNames.label || "label", childrenName = fieldNames.children || "children";
    let extAttr = this.extAttr(); //扩展属性

    return (
      <div className={styles.AreaPicker}>
        <Select onSelect={(value, option) => this.AreaPicker(value, option, "provinceCode", "cityData")}
          className={styles.select}
          value={provinceCode}
          {...extAttr}
          placeholder="请选择"
        >
          {
            provinceData && provinceData.map((item, idx) => {
              return <Option value={item[codeName]} key={item[codeName] || idx} childrenData={item[childrenName] || item.children} dataItem={item}>{item[labelName] || item.label}</Option>
            })
          }
        </Select>
          { 
            levelNum >= 2 && (
              <Select
                onSelect={(value, option) => this.AreaPicker(value, option, "cityCode", "districtData")}
                className={styles.select}
                value={cityCode}
                {...extAttr}
                placeholder="请选择"
              >
                {
                  cityData && cityData.map((item, idx) => {
                    return <Option value={item[codeName]} key={item[codeName] || idx} childrenData={item[childrenName] || item.children} dataItem={item}>{item[labelName] || item.label}</Option>
                  })
                }
              </Select>
            )
          }
          {
            levelNum >=3 && (
              <Select onSelect={(value, option) => this.AreaPicker(value, option, "districtCode", "streetData")}
                className={styles.select}
                value={districtCode}
                {...extAttr}
                placeholder="请选择"
              >
              {
                districtData && districtData.map((item, idx) => {
                  return <Option value={item[codeName]} key={item[codeName] || idx} childrenData={item[childrenName] || item.children} dataItem={item}>{item[labelName] || item.label}</Option>
              }
            )
          }
          </Select>)}
          {
            levelNum >= 4 && (
              <Select onSelect={(value, option) => this.AreaPicker(value, option, "streetCode")}
                value={streetCode}
                {...extAttr}
                className={styles.select} placeholder="请选择"
              >
                {
                  streetData && streetData.map((item, idx) => {
                    return <Option value={item[codeName]} key={idx}> {item[labelName] || item.label}</Option>
                  })
                }
              </Select>
            )
          }
          { levelNum >= 5 && <Input className={styles.input} onChange={this.inputValue} placeholder="请输入详细地址" defaultValue={address} {...extAttr} /> }
      </div>
    )
  }
}

export default AreaPicker;