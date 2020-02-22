import qs from 'qs';
import axios from 'axios';
import Cookie from 'js-cookie';
import { cloneDeep } from 'lodash';

import { AppStore } from 'config/Stores';
import siteConfig from 'config/Config';

axios.defaults.timeout = 180000;
//axios.defaults.baseURL = '';
axios.defaults.withCredentials = true;

/**
 * token过期或者未登录
 * */
const redirectToLogin = () => {
	window.localStorage.clear();
	window.location.href = '/login';
};

/**
 * 如果登录了，就把token写入header
 * */
// 请求拦截
axios.interceptors.request.use(
	config => {
		// url配置
		config.url = siteConfig.apiAppName(config.url, config.app);
    // 设置响应类型为json
		config.responseType = 'json';
    // 取出headers
    let headers = cloneDeep(config.headers);

    const isLoginded = window.localStorage.getItem('isLogined');
    let auth = Cookie.get(siteConfig.cookie.auth_name) || window.localStorage.getItem('token');

    // 不传入，则默认为空对象
    headers = headers ? headers : {}
    // 解决ie不重新请求问题
    headers = {
      ...headers,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': -1
    }

    if(!auth){
      headers.auth = auth;
    }

    // Content-type默认为表单提交
    if(!headers['Content-type']){
      headers['Content-type'] = 'application/x-www-form-urlencoded';
    }

    // 请求headers中增加Application-Key
    if(!headers["Application-Key"]){
      headers["Application-Key"] = Cookie.get(siteConfig.cookie.appKey) || siteConfig.appKey;
    }

		config.withCredentials = true;
    config.headers = headers;
		// console.log('request config: ', config, 'request data: ', config.data);
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

//响应拦截
axios.interceptors.response.use(
	response => {
		// 非路由初始化，才立即隐藏loading
		if(!response.config.headers.router_init){
			AppStore.hideLoading();
		}
		return response.data;
	},
	error => {
		AppStore.hideLoading();
		const errRes = error.response && error.response.data ? error.response.data : error;
		console.error('请求出错啦', errRes);
	}
);

export default axios;