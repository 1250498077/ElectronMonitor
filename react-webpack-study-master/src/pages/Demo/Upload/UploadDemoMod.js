// 状态管理方法
import { observable, action, useStrict, runInAction, autorun } from 'mobx';
// 工具方法
import { isEmpty, isArray, cloneDeep, filter, merge, get, includes, has, pick, isUndefined, isNull } from 'lodash';


// 严格模式
useStrict(true);

class UploadDemoMod {
  // 监视状态
  @observable state = {
    url: []
  };

  // 构造函数
  constructor(){};

  // 设置上传URL
  @action setUploadUrl = async (payload) => {
    // 设置到状态机 - 如果是异步，必须在runInAction
    runInAction(() => {
      this.state.url = payload.url;
    });
    // 监控数据变化的回调,读取什么参数，即代表将要监控什么数据
    autorun(() => {
      // console.info("url: ", this.state.url);
    })
  }
}

const uploadDemoMod = new UploadDemoMod();
export default uploadDemoMod;