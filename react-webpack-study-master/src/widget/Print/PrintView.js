/**
 * @(#)SoftKey.js 1.0 2017/9/20.
 * @author
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

import React, {cloneElement} from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';

const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
// 传入一个数组，一个函数，将这个数组的每一项都用fn执行以下
const arrayLikeMap = (arrayLike, fn) => {
  for (let i = 0; i < arrayLike.length; i++) {
    fn(arrayLike[i], i);
  }
};

// 只会缓存iframe，window模式自动缓存在新建窗口
const singletonCacheData = {
  iframe: null,
  update(iframe) {
    this.iframe = iframe;
  }
};

export default class Print extends React.Component {
  // static propTypes = {
  //   insertHead: PropTypes.bool, // 是否植入本页面的head标签
  //   ignoreHeadJs: PropTypes.bool, // 当insertHead启用时是否屏蔽JS文件
  //   bodyStyle: PropTypes.bool, // 是否植入body标签中的style，插入body底部
  //   otherStyle: PropTypes.string, // 附加的样式将直接插入head最底部
  //   isIframe: PropTypes.bool, // 是否使用iframe插入，否则将使用新窗口
  //   iframeStyle: PropTypes.string, // 将被应用到iframe或者new window
  //   winStyle: PropTypes.string, // 将被应用到iframe或者new window
  //   title: PropTypes.string, // iframe或者新窗口的标题，将会在打印页的页眉和新窗口的title
  //   preventDefault: PropTypes.bool, // 是否替换Ctrl+P
  //   lazyRender: PropTypes.bool, // 是否只渲染在iframe或者新窗口上
  //   clearIframeCache: PropTypes.bool, // 是否清理dom缓存。否的情况下，如props为改变将保留并直接使用上次打印留下的dom
  //   singletonCache: PropTypes.bool, // 当clearIframeCache关闭时生效。类单例模式，当界面有多个打印组件时，最多允许保留一个缓存
  //   onStart: PropTypes.func, // 组件开始打印渲染
  //   onEnd: PropTypes.func, // 组件打印渲染完成
  //   children: PropTypes.node.isRequired,
  //   backgroundImgMark:  PropTypes.string // 水印图片的url
  //   backgroundFontMark:  PropTypes.string
  //   scale: PropTypes.string  // 水印的大小  0-1
  //   opacity: PropTypes.string  // 水印的透明度
  // };

  static defaultProps = {
    insertHead: true,
    ignoreHeadJs: true,
    bodyStyle: false,
    otherStyle: undefined,
    isIframe: true,
    // 设置iframe不占页面空间
    iframeStyle: 'position:absolute;width:0px;height:0px;',
    winStyle: 'toolbar=no,menubar=no',
    title: undefined,
    preventDefault: false,
    lazyRender: false,
    clearIframeCache: false,
    singletonCache: true,
    backgroundImgMark: '',
    backgroundFontMark: '',
    backgroundRowMarkNum: 2,
    backgroundColumnMarkNum: 2,
    scale: '1',
    opacity: '0.2',
    onStart() {
      // 调起打印机前触发的函数-mwh
      // alert('onStart')
    },
    onEnd() {
      // 关闭打印机后触发的函数-mwh
      // alert('onEnd')
    },
  };

  constructor(props) {
    super(props);
    this.changed = true; // 不触发UI渲染
    this.state = {
      beginPrint:false
    }
    // 只在组件生命周期开始前或者（props或state更新前被调用）
    this.onPrint = () => {
      const {isIframe, clearIframeCache, singletonCache, onStart} = this.props;
      onStart();
      if (isIframe) {
        console.log('isIframe判断')
        if (clearIframeCache) { // 清理缓存模式
          this.createIframe(null, (iframe) => {
            // remove dom
            document.body.removeChild(iframe);
          });
        } else if (singletonCache) { // 单例模式缓存模式
          console.log('singletonCache方法')
          // 不管启动多少次iframe，都只有一个iframe
          if (this.changed || this.iframe !== singletonCacheData.iframe) { // 发生改变：1、数据改变；2、缓存对应的组件改变。
            this.createIframe(singletonCacheData.iframe, (iframe) => {
              this.iframe = iframe; // 保存本地用作对比
              singletonCacheData.update(iframe);
            });
          } else {
            this.iframePrint(singletonCacheData.iframe);
          }
        } else if (this.changed) { // 普通缓存模式发生改变
          this.createIframe(this.iframe, (iframe) => {
            this.iframe = iframe;
          });
        } else { // 普通缓存模式未改变
          this.iframePrint(this.iframe);
        }
      } else {
        this.winCreateAndPrint();
      }

      // // lazyRender的遗留临时渲染节点不保留
      // if (this.box) {
      //     document.body.removeChild(this.box);
      //     this.box = null;
      // }
    };
  }

  componentDidMount() {
    // 是使用浏览器自带的快捷键打开
    // 是否创建自定义事件函数
    if (this.props.preventDefault) {
      // 创建prevent函数
      this.prevent = (e) => {
        if (e.keyCode === 80 && (e.ctrlKey || e.metaKey)) {
          // 如果我们想自定义快捷键，就先必须取消默认行为
          e.preventDefault();
          this.onPrint();
        }
      };
      document.addEventListener('keydown', this.prevent);
    }
  }

  // Component WILL UPDATE!,外部更改了props的值，视图更新的时候会调用这个函数
  componentWillUpdate(nextProps){
    // 组件更新后获取到props的值
    console.log('组件更新')
    if (nextProps.beginPrint && nextProps.beginPrint != this.props.beginPrint) {
      this.onPrint()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      // this.setState({changed: true});
      this.changed = true;
    }
  }

  componentWillUnmount() {
    // this.iframe && document.body.removeChild(this.iframe);
    // this.box && document.body.removeChild(this.box); // 移除懒加载隐藏节点
    this.prevent && document.removeEventListener('keydown', this.prevent);
  }

  getHead = () => {
    const {insertHead, ignoreHeadJs, title, otherStyle} = this.props;
    const titleTemplate = title ? `<title>${title}</title>` : '';
    const otherStyleTemplate = otherStyle ? `<style>${otherStyle}</style>` : '';
    const headTagsTemplate = (() => {
      // 是否植入本页面的head标签
      if (insertHead) {
        const innerHTML = document.head.innerHTML;
        // 当insertHead启用时是否屏蔽JS文件
        return ignoreHeadJs ? innerHTML.replace(SCRIPT_REGEX, '') : innerHTML;
      }
      return '';
    })();
    return `${titleTemplate}${headTagsTemplate}${otherStyleTemplate}`;
  };

  getBodyStyle = () => {
    let inlineStyle = '';
    const stylesDom = document.body.getElementsByTagName('style');

    // stylesDom是一个数组，每一项都是style的dom，将所有的dom对象的innerHTML去除加一起，返回全部的style字符串
    arrayLikeMap(stylesDom, (item) => {
      inlineStyle += item.innerHTML;
    });

    return inlineStyle;
  };

  // 需要获取一个ifame，doc就是iframe
  writeTemplate = (doc) => {
    const {bodyStyle, lazyRender, backgroundImgMark, backgroundFontMark} = this.props;
    if (lazyRender) {
      doc.write('<html><head></head><body><div></div></body></html>');
      doc.head.innerHTML = this.getHead();
      ReactDOM.render(this.renderChild(), doc.body.getElementsByTagName('div')[0]); // React的未来版本可能会异步地呈现组件
      if (bodyStyle) {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = this.getBodyStyle();
        doc.body.appendChild(styleTag);
      }
    } else {
      const _dom = ReactDOM.findDOMNode(this);
      const dom = _dom ? _dom.innerHTML : null;

      let copyDom = dom;
      if (backgroundImgMark) {
        // 使用图片水印替换waterMarkSign字符
        copyDom = dom.replace(/waterMarkSign/g, this.getWaterImgList());
      } else if (backgroundFontMark) {
        // 使用文字水印替换waterMarkSign字符
        copyDom = dom.replace(/waterMarkSign/g, this.getWaterFontList());
      }

      doc.write(
        `<html>
          <head>${this.getHead()}</head>
          <body>
            ${copyDom}
            ${bodyStyle ? `<style>${this.getBodyStyle()}</style>` : ''}
          </body>
        </html>`
      );
    }

    doc.close();
  };

  // 获取水印图片列表
  getWaterImgList() {
    const { backgroundImgMark, scale, opacity, backgroundRowMarkNum, backgroundColumnMarkNum } = this.props;
    let imgList = ''
    for (let i = -1; i < backgroundRowMarkNum; i++) {
      for (let j = -1; j < backgroundColumnMarkNum; j++) {
        imgList = imgList + `<img src=${backgroundImgMark} style="opacity: ${opacity};position: absolute;left: ${i * 500 + 100}px;top: ${(j * 500) + 200}px;z-index: -100;-webkit-transform:rotate(-30deg);transform:rotate(-30deg) scale(${scale}, ${scale});"/>`
      }
    }
    imgList = `<div style="position: absolute;width: 0;height: 0">${imgList}</div>`
    return imgList
  }

  // 获取文字水印列表
  getWaterFontList() {
    const { backgroundFontMark, scale, opacity, backgroundRowMarkNum, backgroundColumnMarkNum } = this.props;
    let fontList = ''
    for (let i = -1; i < backgroundRowMarkNum; i++) {
      for (let j = 0; j < backgroundColumnMarkNum; j++) {
        fontList = fontList + `<h1 style="opacity: ${opacity};position: absolute;left: ${i * 500 + 100}px;top: ${(j * 500) + 200}px;z-index: -100;-webkit-transform:rotate(-30deg);transform:rotate(-30deg) scale(${scale}, ${scale});">${backgroundFontMark}</h1>`
      }
    }
    fontList = `<div style="position: absolute;width: 0;height: 0">${fontList}</div>`
    return fontList
  }

  // 只有在onPrint里面被调用
  createIframe = (iframeCache, callback) => {
    console.log('createIframe方法')
    const {iframeStyle} = this.props;
    let iframe;
    if (iframeCache) {
      iframe = iframeCache;
    } else {
      // 新建iframe节点并添加至页面
      iframe = document.createElement('IFRAME');
      // 设置默认的样式
      iframe.setAttribute('style', iframeStyle);
      document.body.appendChild(iframe);
    }
    // 等待iframe全部加载完在执行的代码
    iframe.onload = () => {
      this.iframePrint(iframe, callback);
    };
    // 把创建好的iframe传入到writeTemplate
    this.writeTemplate(iframe.contentWindow.document);
  };
  // 点击父页面的打印会触发 -mwh   iframe页面加载完成后触发
  iframePrint = (iframe, callback) => {

    // 通过contentWindow和contentDocument两个API获取iframe的window对象和document对象-mwh
    // 让当前iframe聚焦,Window.focus()让页面成为当前窗体  -mwh
    iframe.contentWindow.focus();
    // window自带一个打印方法 print()； 默认打印页面中body里的所有内容 -mwh
    iframe.contentWindow.print();
    callback && callback(iframe);

    // wait for a new change
    this.changed = false;
    this.props.onEnd();
  };

  winCreateAndPrint = () => {
    const win = window.open('', '', this.props.winStyle);
    this.writeTemplate(win.document);
    win.onload = () => {
      win.print();
      // wait for a new change
      this.changed = false;
      this.props.onEnd();
    };
  };

  renderChild = () => {
    const {children, ...restProps} = this.props;
    // return cloneElement(React.Children.only(children), {
    //   ...restProps,
    // });
    return children;
  };

  render() {
    return !this.props.lazyRender ? (this.renderChild() || null) : null;
  }
}
