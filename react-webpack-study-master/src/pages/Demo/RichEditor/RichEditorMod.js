import { observable, action, useStrict, runInAction, autorun } from 'mobx';

// 严格模式
useStrict(true);

class RichEditorMod {
  // 监视状态
  @observable state = {
    html: ''
  };

  // 构造函数
  constructor(){};

  // 设置路由配置
  @action 
  setHtml = async (payload) => {
    runInAction(() => {
      this.state.html = payload.html;
    });
    // 监控数据变化的回调,读取什么参数，即代表将要监控什么数据
    autorun(() => {
      // console.info("router table is isLoaded: ", this.state.html);
    })
  }
}

const richEditorMod = new RichEditorMod();
export default richEditorMod;