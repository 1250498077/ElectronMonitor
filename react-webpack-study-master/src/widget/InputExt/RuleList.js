
// 当你想扩展的时候请在这里写你的正则表达式
const rulesMap =  {
  email: {
    // 邮箱验证
    type: 'email',
    verification: {
      type: 'email',
      message: '不是合法的邮箱地址'
    }
  },
  phone: {
    // 国内11位号码验证
    pattern: /^1[3|5|8]\d{9}$/,
    message: '不是合法的手机号码'
  },
  IdCard: {
    // 国内身份证号验证
    pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    message: '不是合法的身份证号码'
  },
  IP: {
    // IP地址验证，如：192.168.12.96
    pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/g,
    message: '不是合法IP'
  },
  money: {
    // 必须输入后两位验证
    pattern: /^\d+\.\d{2}$/,
    message: '必须输入小数点后两位验证'
  },
  url: {
    // 域名验证
    pattern: new RegExp('^((https|http|ftp|rtsp|mms)?://)'
      +'?(([0-9a-z_!~*().&=+$%-]+: )?[0-9a-z_!~*().&=+$%-]+@)?' //ftp的user@
      + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
      + '|' // 允许IP和DOMAIN（域名）
      + '([0-9a-z_!~*()-]+.)*' // 域名- www.
      + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
      + '[a-z]{2,6})' // first level domain- .com or .museum
      + '(:[0-9]{1,4})?' // 端口- :80
      + '((/?)|' // a slash isn't required if there is no file name
      + '(/[0-9a-z_!~*().;?:@&=+$,%#-]+)+/?)$'),
    message: '不合法的url'
  },
  CharValid: {
    // 只能输入 中文，英文，数字，下划线，空格
    pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9 ]*$/,
    message: '仅限输入中文，英文，数字，下划线，空格'
  },
  EnNum: {
    // 只能输入英文，数字
    pattern: /^[0-9a-zA-Z]*$/,
    message: '仅限英文、数字'
  },
  chinese: {
    // 只能输入中文，和2字节符号（如： ，、“”？等中文符号）
    pattern: /^[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5\u4e00-\u9fa5]*$/,
    message: '只能输入中文'
  },
  tel: {
    // 固定电话号码验证，如：020-1234567
    pattern: /^0\d{2,3}-\d{7,8}(-\d{1,6})?$/,
    message: '请输入正确固定电话号码，如020-1234567'
  }
}

export { rulesMap };