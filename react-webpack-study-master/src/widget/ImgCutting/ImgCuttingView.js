/**
 * Created by MACHENIKE on 2018/11/7.
 * 上传图片后的展示框
 * imgUrl {string} 默认需要裁剪的图片
 * props.visible {boole} 显示隐藏弹出层
 * minCropBoxWidth {Number}  裁剪区域最小宽度  默认200
 * minCropBoxHeight {Number}  裁剪区域最小高度  默认 200
 * aspectRatio {Number} 裁剪区宽高比   如  4/3     默认 宽高相乘比例，一般不用传
 * 裁剪区的宽高要和宽高比配合使用， 比如宽400  高300   那么宽高比就必须设置为  4/3
 * modalWidth {Number}  弹出层宽度， 默认1000
 * closeCbk {function}  弹出层关闭时的回调函数
 * okCbk {function} 点击确认时回调函数  return {img url  上传后的图片路径}
 * imgType {string} 图片的格式类型   默认image/jpeg
 * 例子
 * import ImgCutting from 'widget/ImgCutting/ImgCuttingView';
 * <ImgCutting 
 *   okCbk={e=>{console.log(e)}} 
 *   closeCbk={e=>{updateModel(false,"imgCuttingVis");}}
 *   minCropBoxWidth={400}
 *   minCropBoxHeight={300}
 *   aspectRatio={4/3}
 *   imgUrl={detailObj.imgUrl}
 *   visible={userInfoModel.imgCuttingVis} 
 *  />
 */
// 引入React库
import React, { Component } from 'react';
import { Modal, message, Button } from 'antd';

// 当前组件样式
import styles from './ImgCuttingLess.less';

import $ from 'jquery';
import cx from 'classnames';
import { get } from 'lodash';
import uploadUtils from 'utils/upload';
const uploadObject2OSS = uploadUtils.uploadObject2OSS;

import cutting from './cutting';

class ImgCutting extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context)
    this.state = {
      one: false,//是否第一次初始化过，初始化后将不再进行初始化
    }
  }

  //将远程图片转换为base64
  getBase64Image(img, width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width ? width : img.width;
    canvas.height = height ? height : img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    var dataURL = canvas.toDataURL();
    return dataURL;
  }

  //创建图片对象，获取远程图片
  getCanvasBase64(img) {
    var that = this;
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.src = img+"?timestamp="+Math.random();
    //至关重要
    var deferred = $.Deferred();
    if (img) {
      image.onload = function () {
        deferred.resolve(that.getBase64Image(image));//将base64传给done上传处理
      }
      return deferred.promise();//问题要让onload完成后再return sessionStorage['imgTest']
    }
  }


  //将base64转换为文件
  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  }



  //选择图片
  selectImg(file) {
    let that = this;
    if (!file.files || !file.files[0]) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function (evt) {
      var replaceSrc = evt.target.result;
      //更换cropper的图片
      $('#tailoringImg').cropper('replace', replaceSrc, false);// 默认false，适应高度，不失真
      that.cuttingTop();
    }
    reader.readAsDataURL(file.files[0]);
  }

  //将图片上传到oss
  oss(base64) {
    let b = this.dataURLtoFile(base64, 'aaa.jpg');
    uploadObject2OSS(b).then((data)=> {
      //成功后调用回调函数返回img路径
      this.props.okCbk(data);
    }).fail((data)=> {
      message.error(data);
    });
  }


  //根据新参数改版裁剪区域大小和宽高比
  cuttingTop(nextProps){
    let obj = {
      top:0,
    };
    let height = get(nextProps,'minCropBoxHeight');
    let width = get(nextProps,'minCropBoxWidth');
    let aspectRatio = get(nextProps,'aspectRatio');

    if(height){
      obj.height = height - 52;
    }
    if(width){
      obj.width = width;
    }
    if(!get(nextProps,'aspectRatio')){
      aspectRatio = obj.width/obj.height;
    }
    setTimeout(()=>{
      $('#tailoringImg').cropper("setAspectRatio",aspectRatio);
      $('#tailoringImg').cropper("setCropBoxData",obj);
    },50);
  }

  //组件卸载，关闭委托事件
  componentWillUnmount() {
    $("body").off("change");
    $("body").off("click");
  }

  //准备：即将被重新渲染，状态未变化
  componentWillMount() {
  }

  // 已加载组件，收到新属性时调用
  componentWillReceiveProps(nextProps) {
    let that = this;
    console.log(nextProps);
    if (nextProps.visible) {
      if (this.state.one) {
        //将图片转为base64进行更改裁剪区域图片
        if(get(nextProps,"imgUrl")){
          this.getCanvasBase64(nextProps.imgUrl).then((img)=>{
            $('#tailoringImg').cropper('replace', img, false);
            that.cuttingTop(nextProps);
          },(err)=>{
            message.error(err);
          });
        }
      } else {
        //初始化后将不再进行初始化
        this.setState({one: true});
        let width = this.props.minCropBoxWidth - 10;
        let height = this.props.minCropBoxHeight - 52.3;
        setTimeout(()=> {
          $('#tailoringImg').cropper({
            aspectRatio: this.props.aspectRatio || width / height,//默认宽高相乘比例，一般不用传
            preview: '.previewImg',//预览视图
            guides: true,  //裁剪框的虚线(九宫格)
            autoCropArea: 0.8,  //0-1之间的数值，定义自动剪裁区域的大小，默认0.8
            dragCrop: false,  //是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
            movable: true,  //是否允许移动剪裁框
            resizable: false,  //是否允许改变裁剪框的大小
            dragMode: "move",//也许拖拽背后的图片
            center: false,//裁剪区域不显示在中间
            minCropBoxWidth: width || 200, //裁剪框最小宽度
            minCropBoxHeight: height || 200, //裁剪框最小高度,
            cropBoxResizable: false,//是否允许改变裁剪框大小
            zoomable: true,  //是否允许缩放图片大小
            mouseWheelZoom: false,  //是否允许通过鼠标滚轮来缩放图片
            touchDragZoom: true,  //是否允许通过触摸移动来缩放图片
            rotatable: true,  //是否允许旋转图片
            crop: function (e) {
            }
          });
          that.cuttingTop();
        }, 500);
      }
    }
  }

  // 已插入真实DOM
  componentDidMount() {
    let that = this;
    //选择图片
    $("body").on("change", "#file_chooseImg", function () {
      that.selectImg(this);
    });
    //旋转
    $("body").on("click", "#file_rotate", function () {
      $('#tailoringImg').cropper("rotate", 45);
    });
    //换向
    $("body").on("click", "#file_scaleX", function () {
      $('#tailoringImg').cropper("scaleX", -1);
    });
    //复位
    $("body").on("click", "#file_reset", function () {
      $('#tailoringImg').cropper("reset");
    });
  }

  // 渲染函数
  render(ReactElement, DOMElement, callback) {
    return (<div>
      <Modal title="图片展示"
        visible={this.props.visible}
        width={this.props.modalWidth || 1000}
        onOk={()=>{
          var cas = $('#tailoringImg').cropper('getCroppedCanvas');//获取被裁剪后的canvas
          var base64url = cas.toDataURL(this.props.imgType || "image/jpeg"); //转换为base64地址形式
          this.oss(base64url);
        }}
        onCancel={()=>{this.props.closeCbk('btnClose')}}
      >
        <div className={styles.imgMain}>
          <div className="bottomList">
            <Button type="primary" className="btn1">选择图片</Button>
            <label title="上传图片" htmlFor="chooseImg" className="labelFile">
              <input type="file" accept="image/jpg,image/jpeg,image/png" name="file" id="file_chooseImg"/>
            </label>

            <Button type="danger" id="file_rotate">旋转</Button>
            <Button type="danger" id="file_scaleX">换向</Button>
            <Button type="danger" id="file_reset">复位</Button>
          </div>

          <div><img id="tailoringImg" src={this.props.imgUrl}/></div>
        </div>
      </Modal>
    </div>)
  }
}

export default ImgCutting;