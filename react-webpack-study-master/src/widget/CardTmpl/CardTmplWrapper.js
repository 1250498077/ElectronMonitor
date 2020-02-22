import { Form } from 'antd';
// 引入lodash
import { get, keys, merge } from 'lodash';

/**
 * 组件包装
 * @type {Object}
 */
const CardTmplWrapper = {
  // 表单域有值变更时，调用父组件的回调函数，把变更后的值传到父组件中
  /**
   * [onFieldsChange description]
   * @param  {Object} props         父组件传来的属性
   * @param  {Object} changedFields 表单域变更后的值 { user_name: { value: '' ...}}
   * @return {Void}               无
   */
  onFieldsChange(props, changedFields) {
    // 字段的业务值
    let oldBiz = get(props, 'biz', {});
    let newBiz = merge(oldBiz, changedFields);
    props.onChange && props.onChange(newBiz);
  },

  /**
   * 取出父组件传来的业务值，设置到表单域
   * @param  {Object} props 父组件传来的属性
   * @return {Object}       表单对象 { user_name: { value: '' ...}}
   */
  mapPropsToFields(props) {
    // 字段的业务数据值
    let biz = get(props, 'biz', {});
    // 字段对象
    let fields = get(props, 'ui.fields', {});
    // 字段包含的键
    let fKeys = keys(fields);
    // 返回的表单对象
    let formObj = {};
    fKeys.map((k, i) => {
      formObj[k] = Form.createFormField({
        ...biz[k],
        value: get(biz, `${k}.value`, ''),
      })
    })
    // 表单对象
    return formObj;
  },

  /**
   * 所有的表单域的值有变化时的处理
   * @param  {Object} _      父组件传来的属性
   * @param  {Object} values 表单域变更后的值
   * @return {Void}        无
   */
  onValuesChange(_, values) {
    // console.log('_:', _,  'values:', values);
  }

}

export default CardTmplWrapper;