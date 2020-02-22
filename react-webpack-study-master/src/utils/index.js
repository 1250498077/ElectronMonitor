import { parse } from 'qs';
import { isArray, pick, map } from 'lodash';

class Utils {
  // 从url取值 name可以参数的key，或者多个key的数组
  static getQueryString(name) {
    let after = window.location.hash.split('?')[1] || '';
    if(!after || !name){
      return null;
    }

    if(isArray(name)){
      // 去空格
      let obj = parse(after.trim());
      // 每一项都解码
      map(obj, (v) => {
        return decodeURIComponent(v);
      })
      return pick(obj, name);
    }

    let reg = new RegExp('(^|&)' + name.trim() + '=([^&]*)(&|$)');
    let r = after.trim().match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    } else {
      return null;
    }
  }
}
export default Utils;