// 状态管理方法
import { observable, action, useStrict, runInAction, autorun } from 'mobx';
// 工具方法
import { isEmpty, isArray, cloneDeep, filter, merge, get, includes, has, pick, isUndefined, isNull } from 'lodash';
// 请求路由配置项
import { getEmp } from './EmpListServ';

// 默认状态
const defState = {
  // 列表
  list: [],
  // 业务部分，查询表单输入内容
  biz: {
    queryForm: {}
  }
}

// 严格模式
useStrict(true);

class EmpListMod {
  // 监视状态
  @observable state = cloneDeep(defState);

  // 构造函数
  constructor(){};

  // 获取会员列表
  @action getEmpList = async () => {
    console.log('emp list ok');
    return false;
    // 请求路由表
    let res = await getEmp();
    // 设置到状态机 - 如果是异步，必须在runInAction
    runInAction(() => {
      this.state.list = res.data.list;
    });
    // 监控数据变化的回调,读取什么参数，即代表将要监控什么数据
    autorun(() => {
      // console.info("router table is isLoaded: ", this.state.isLoaded);
    })
  }

  // 设置表单的值到状态机
  @action setFormVal = (payload) => {
    // 设置到状态机 - 如果是异步，必须在runInAction
    runInAction(() => {
      this.state.biz = payload;
    });
    // 监控数据变化的回调,读取什么参数，即代表将要监控什么数据
    autorun(() => {
      console.info("setFormVal");
    })
  }

  // 设置所有复选框选中
  @action checkedAll = (payload) => {
    // 设置到状态机 - 如果是异步，必须在runInAction
    runInAction(() => {
      this.state.biz.checkedValues = payload;
    });
    // 监控数据变化的回调,读取什么参数，即代表将要监控什么数据
    autorun(() => {
      console.info("checkedAll");
    })
  }

  // 清空状态机
  @action clearState = () => {
    // 设置到状态机 - 如果是异步，必须在runInAction
    runInAction(() => {
      // 恢复回默认状态
      this.state = defState;
    });
  }
}

const empListMod = new EmpListMod();
export default empListMod;