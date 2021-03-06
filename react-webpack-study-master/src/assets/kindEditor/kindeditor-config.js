window.KIND_EDITOR_ITEMS_CONFIG = [
  "source",
  "|",
  "undo",
  "redo",
  "|",
  "preview",
  "print",
  // "template",
  // "code",
  "cut",
  "copy",
  "paste",
  "plainpaste",
  "wordpaste",
  "|",
  "justifyleft",
  "justifycenter",
  "justifyright",
  "justifyfull",
  "insertorderedlist",
  "insertunorderedlist",
  "indent",
  "outdent",
  "subscript",
  "superscript",
  "clearhtml",
  "quickformat",
  "selectall",
  "|",
  "fullscreen",
  "/",
  "formatblock",
  "fontname",
  "fontsize",
  "|",
  "forecolor",
  "hilitecolor",
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "lineheight",
  "removeformat",
  "|",
  "image",
  // "multiimage",
  // "flash",
  "media",
  // "insertfile",
  "table",
  "hr",
  "emoticons",
  "baidumap",
  "pagebreak",
  "anchor",
  "link",
  "unlink",
  "|",
  "about"
]

function random_string(len) {
　　len = len || 32;
　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
　　var maxPos = chars.length;
　　var pwd = '';
　　for (var i = 0; i < len; i++) {
  　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

function get_suffix(filename) {
  var pos = filename.lastIndexOf('.')
  var suffix = ''
  if (pos != -1) {
      suffix = filename.substring(pos)
  }
  return suffix;
}

function calculate_object_name(g_dirname, group, filename) {
  if(!filename){
    return '';
  }
  var suffix = get_suffix(filename)
  var g_object_name = g_dirname + random_string(10) + suffix
  if(!!group){
    if(g_dirname.indexOf('/') == -1){
      g_dirname += '/'
    }
    g_object_name = decodeURIComponent(g_dirname + group + '/' + random_string(10) + suffix)
  }
  return g_object_name;
}

// 获取OSS上传配置
function getUploadCfg(policyUrl, auth, file, group){

  return $.ajax({
    url: policyUrl,
    type: "GET",
    headers: { auth: auth }

  }).then(function(res) {
    var uploadCfg = {}

    uploadCfg.uploadImgServer = res.data.host
    uploadCfg.uploadImgParams = {
      OSSAccessKeyId: res.data.accessid,
      policy: res.data.policy,
      signature: res.data.signature,
      key: calculate_object_name(res.data.dir, group || 'home', file && file.name),
      name: file && file.name,
      size: file && file.size,
      success_action_status: '200'
    }
    uploadCfg.file = file

    return uploadCfg

  }).fail(function(err) {
    return err
  })
}

// 上传对象到OSS
function postObject2OSS(uploadCfg, file){
  // FormData对象
  var formData = new FormData()

  // 附加参数
  var ump = uploadCfg.uploadImgParams
  Object.keys(ump).map((k, i) => {
    formData.append(k, ump[k])
  })
  formData.append('file', uploadCfg.file)

  // 上传文件
  return $.ajax({
    url: uploadCfg.uploadImgServer,
    type: 'POST',
    cache: false,
    data: formData,
    processData: false,
    contentType: false
  }).then(function(res) {
    var tmpKey = ump.key

    if(!!file.client_width || !!file.client_height){
      tmpKey += '?x-oss-process=image/resize'

      if(!!file.client_width){
        tmpKey += `,w_${file.client_width}`
      }

      if(!!file.client_height){
        tmpKey += `,h_${file.client_height}`
      }
    }
    return uploadCfg.uploadImgServer + '/' + tmpKey
  }).fail(function(err) {
    return err
  })
}

// 图片上传前触发
function beforeUpload(file, attachType) {
  var defer= $.Deferred()
  // 限制的大小
  var limitObj = {
    'image/jpeg': 2,
    'video/mp4': 10
  }
  var limitKeys = Object.keys(limitObj)
  // 不支持的格式
  if(-1 === $.inArray('' + file.type, limitKeys)){
    if('image' === '' + attachType){
      defer.reject('你只能上传jpg格式的文件!')
    }else{
      defer.reject('你只能上传mp4格式的文件!')
    }
  }else{
    const isLtSize = file.size / 1024 / 1024 < limitObj['' + file.type]
    if('image/jpeg' === '' + file.type){
      if (!isLtSize) {
        defer.reject(`图片必须小于${ limitObj['' + file.type] }MB!`)
      }else{
        defer.resolve(true)
      }
    }else if('video/mp4' === '' + file.type){
      if (!isLtSize) {
        defer.reject(`mp4必须小于${ limitObj['' + file.type] }MB!`)
      }else{
        defer.resolve(true)
      }
    }
  }
  // console.log('file.type:', file.type, 'file.size:', file.size)

  // const isJPG = file.type === 'image/jpeg'
  // if (!isJPG) {
  //   defer.reject('你只能上传JPG格式的文件!')
  // }
  // const isLt2M = file.size / 1024 / 1024 < 2
  // if (!isLt2M) {
  //   defer.reject('图片必须小与于2MB!')
  // }
  // if(isJPG && isLt2M){
  //   defer.resolve(true)
  // }
  // 返回校验结果
  return defer
}

// 执行上传文件到OSS
function uploadObject2OSS(policyUrl, auth, file, group, attachType){
  return beforeUpload(file, attachType)
  .then((flag) => {
    return getUploadCfg(policyUrl, auth, file, group)
  })
  .then((uploadCfg) => {
    return postObject2OSS(uploadCfg, file)
  })
  .fail((err) => {
    return err
  })
}