let baseConfig = {
  appName: 'Admin管理端',
  isLogin: false,
  isB2BLogin: false,
  isMultiOrg: true,
  sysType: 'entCenter',
  isMsgNotify: true,
  // homePath: '/',
  // 统一配置Cookie，所有的Cookie的键名均放在这个节点下
  cookie: {
    auth_name: 'sso.login.account.operation.auth',
    user_name: 'user_name_mgmt_operation',
    appKey: '',
  },
  // 环境变量
  ENV: ENV,
  // 静态资源CDN前缀
  CDN_BASE: CDN_BASE,
  // 后端接口基础地址
  BACKEND_BASE: BACKEND_BASE,
  // 前端静态资源发布路径
  publicPath: publicPath,
  // 上传组件的默认显示图片
  uploadImgdefault: CDN_BASE + '/assets/imgs/upload_default.png'
}

// 根据不同环境变量，不同的配置
let envConfig = {
  loc: {
    mock: true,
    publicPath: '',
    host: '',
  },
  dev: {
    mock: true,
    publicPath: '/cloud/dev/huieryun-arm-web-admin',
    host: ''
  },
  test: {
    mock: true,
    publicPath: '/cloud/test/huieryun-arm-web-admin',
    host: ''
  },
  pre: {
    mock: true,
    publicPath: '/cloud/pre/huieryun-arm-web-admin',
    host: ''
  },
  prod: {
    mock: true,
    publicPath: '',
    host: ''
  }
}

// 合并配置
let config = Object.assign(baseConfig, envConfig[baseConfig.ENV])


// js获取项目根地址，如： http://localhost:8083
const getRootPath = () => {
  var curPath = window.document.location.href;
  var pathName= window.document.location.pathname;
  var pos = curPath.indexOf(pathName);
  //获取主机地址，如： http://localhost:8083
  var locPath = curPath.substring(0,pos);
  return locPath;
}

/**
 * 获得api接口地址
 * @param  {String} url    接口地址
 * @param  {Object} config 基础配置信息
 * @return {String}        转换过的接口地址
 */
const getApiAppName = function(url, app = '') {
  if(!url) {
    return
  } else if(url.indexOf("http") >= 0) {
    return url
  }

  let str = ""
  // 本机开发环境，则当前assets/mock下面的json
  if(config.mock){
    return getRootPath() + config.publicPath + "/assets/mock/" + url.replace(/\//g, "-") + '.json'
  // 其它环境，则读取真实应用的接口
  }else{
    let version = 'api/v1'
    let host = config.host;
    let res = `${host}/${version}/${url}`;
    return res;
  }
}

// 拼接接口所需域名和服务名，只需要输入接口名即可  如 yundt/mgmt/item/list-by-page，也不要加斜杆开始，
// 如果接口以http开头，则不会进拼接，而是保留原样
// 如果是mock，则会去assets/mock请求同名json，但/会被替换为-   如  yundt-mgmt-item-list-by-page.js
config.apiAppName = getApiAppName;

export default config;