// lodash遍历对象的key键
import { keys } from 'lodash';
// mobx的公共方法
import { observable, action, useStrict, runInAction, autorun } from 'mobx';
// 请求路由配置项
import { getRouterTable } from './AppServ';
// 严格模式
useStrict(true);

class AppStore {
  // 监视状态
  @observable state = {
    isLoaded: false,
    routerCfg: {},
    hookCbf: null
  };

  // 构造函数
  constructor(){};

  // 设置路由配置
  @action setRouterCfg = async () => {
    // 请求路由表
    let res = await getRouterTable();
    // 设置到状态机 - 如果是异步，必须在runInAction
    runInAction(() => {
      this.state.isLoaded = true;
      this.state.routerCfg = res.data.list;
    });
    // 监控数据变化的回调,读取什么参数，即代表将要监控什么数据
    autorun(() => {
      // console.info("router table is isLoaded: ", this.state.isLoaded);
    })
  }

  @action hideLoading = async () => {
    runInAction(() => {
      this.state.isLoaded = true;
    });
  }

  // 设置关闭页签钩子配置
  @action setCloseHook = (hookCbf) => {
    runInAction(() => {
      this.state.hookCbf = hookCbf;
    });
  }

  // 设置页签标题等内容
  @action setTabsInfo = (titleObj) => {
    let k = keys(titleObj)[0];
    runInAction(() => {
      this.state.routerCfg[k] = titleObj[k];
    });
  }
}

const appStore = new AppStore();
export default appStore;
export { AppStore };