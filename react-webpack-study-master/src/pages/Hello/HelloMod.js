// 状态管理方法
import { observable, action, useStrict, runInAction, autorun } from 'mobx';
// 工具方法
import { isEmpty, isArray, cloneDeep, filter, merge, get, includes, has, pick, isUndefined, isNull } from 'lodash';
// 引入Serv
import Serv from './HelloServ';

// 严格模式
useStrict(true);
/**
 * mod层 - 业务逻辑，数据逻辑应该存储于此
 */
class HelloMod {
  // 监视状态
  @observable state = {
    visible: false,
    imgList: []
  };

  // 构造函数
  constructor(){

  };

  // 如果设定了useStrict严格模式，那么所有observable的值的修改必须在action定义的方法内，否则可以直接修改
  // 设置内容可视性
  @action setVisible = async (payload) => {
    // 设置到状态机 - 如果是异步，必须在runInAction
    runInAction(() => {
      this.state.visible = payload.visible;
    });
    // Mod中跳转使用  window.app.router.push(url);
    // 监控数据变化的回调,读取什么参数，即代表将要监控什么数据
    autorun(() => {
      // console.info("visible: ", this.state.visible);
    })
  }

  // 获取图片列表
  @action getImgList = async (payload) => {
    // 请求参数
    let params = {}
    // 异步请求方法
    let { resultCode, resultMsg, data } = await Serv.getImgs(params);
    // 使用lodash的get方法获取嵌套对象属性，避免当data为null时导致的data.list为undefined报错
    let imgList = get(data, 'list', []);
    // 设置到状态机 - 如果是异步，必须在runInAction
    runInAction(() => {
      this.state.imgList = imgList;
    });
  }

}

// 将组件实例化，这意味着组件将不能从别处实例化
const helloMod = new HelloMod();
export default helloMod;