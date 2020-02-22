import React, { Component } from 'react';

/**
 * 剪贴板粘贴事件拦截处理组件
 * 拦截对指定输入框的粘贴操作, 进行相应的处理后输出
 *
 * 多浏览器支持参考 https://www.everythingfrontend.com/posts/insert-text-into-textarea-at-cursor-position.html
 *
 * @prop {Array[id{String}] || Object{id{String}: Function}} targetList [必填, 指定输入框id列表, 需与对应输入框的id一致]
 * @prop {Function} onPasteCbk(@param {name: String, value: String}) [非必填, 数据处理后的回调函数]
 * @prop {Function} processFunc(@param {String}) [非必填, 自定义处理函数, 必须有返回值]
 */

/**
 * 组件使用示例一
 * 使用默认处理函数: 将字符串开头结尾的空格、制表符、换行符去掉, 行中的换行符替换为逗号
 * <PasteFromClipboard
 *  targetList={['itemCode']}
 * />
 *
 * 组件使用示例二
 * 使用自定义处理函数, 处理函数必须有返回值
 * <PasteFromClipboard
 *  targetList={['itemCode']}
 *  onPasteCbk={(name, value) => {
 *    console.log(name, value)
 *  }
 *  processFunc={str => {
 *    let newStr = str + '1'
 *    return newStr
 *  }}
 * />
 *
 * 组件使用示例三
 * 对不同输入框采用不同的处理函数, 同时设置通用的缺省处理函数
 * <PasteFromClipboard
 *  targetList={{
 *    'itemCode': str => {
 *      return 'CN' + str
 *    },
 *    'itemName': str => {
 *      return 'Name' + str
 *    },
 *    'number': null
 *  }}
 *  onPasteCbk={(name, value) => {
 *    console.log(name, value)
 *  }
 *  processFunc={str => {
 *    let newStr = str + '1'
 *    return newStr
 *  }}
 * />
 */

export default class extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context)
    this.state = {
      targetList: [],
      targetToFuncMap: {}
    }
    this.pasteCallback = this.pasteCallback.bind(this)
  }

  componentDidMount() {
    document.addEventListener('paste', this.pasteCallback)
  }

  componentWillReceiveProps(nextProps) {
    let { targetList } = nextProps

    if (Object.prototype.toString.call(targetList) === "[object Array]") {
      this.setState({ targetList })
    } else if (Object.prototype.toString.call(targetList) === "[object Object]") {
      let keys = Object.keys(targetList)
      this.setState({ targetList: keys, targetToFuncMap: targetList })
    } else {
      console.error('PasteFromClipboard组件的targetList参数为必填参数, 类型需为数组或对象!')
    }
  }

  pasteCallback(event) {
    let self = this
    let target = event.target;

    if (self.props.targetList.includes(target.id)) {
      event.preventDefault()

      let clipboardData = event.clipboardData || window.clipboardData
      let str = clipboardData.getData('text')
      let newStr = undefined

      let processFunc = self.state.targetToFuncMap[target.id] || self.props.processFunc
      if (!!processFunc) {
        newStr = processFunc(str)
      } else {
        let reg = self.generateReg()
        let tmpArr = str.trim().split(reg)
        // console.log('clip board work', tmpArr)

        let newArr = tmpArr.map(str => {
          return str.trim()
        })
        newStr = newArr.join(',')
      }

      if (newStr === undefined) {
        console.error('PasteFromClipboard组件的processFunc参数必须有返回值!')
      }

      self.insertAtCursor(target, newStr)

      if (!!self.props.onPasteCbk) {
        self.props.onPasteCbk(target.id, assembleStr)
      }
    }
  }

  canManipulateViaTextNodes(input) {
    if (input.nodeName !== "TEXTAREA") {
      return false;
    }
    if (typeof browserSupportsTextareaTextNodes === "undefined") {
      const textarea = document.createElement("textarea");
      textarea.value = 1;
      browserSupportsTextareaTextNodes = !!textarea.firstChild;
    }
    return browserSupportsTextareaTextNodes;
  }

  // 在光标处插入字符串
  insertAtCursor(input, text) {
    // IE 8-10
    if (document.selection) {
      const ieRange = document.selection.createRange();
      ieRange.text = text;

      // Move cursor after the inserted text
      ieRange.collapse(false /* to the end */);
      ieRange.select();

      return;
    }

    const isSuccess = document.execCommand("insertText", false, text);

    if (!isSuccess) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      // Firefox (non-standard method)
      if (typeof input.setRangeText === "function") {
        input.setRangeText(text);
      } else {
        if (this.canManipulateViaTextNodes(input)) {
          const textNode = document.createTextNode(text);
          let node = input.firstChild;

          // If textarea is empty, just insert the text
          if (!node) {
            input.appendChild(textNode);
          } else {
            // Otherwise we need to find a nodes for start and end
            let offset = 0;
            let startNode = null;
            let endNode = null;

            // To make a change we just need a Range, not a Selection
            const range = document.createRange();

            while (node && (startNode === null || endNode === null)) {
              const nodeLength = node.nodeValue.length;

              // if start of the selection falls into current node
              if (start >= offset && start <= offset + nodeLength) {
                range.setStart((startNode = node), start - offset);
              }

              // if end of the selection falls into current node
              if (end >= offset && end <= offset + nodeLength) {
                range.setEnd((endNode = node), end - offset);
              }

              offset += nodeLength;
              node = node.nextSibling;
            }

            // If there is some text selected, remove it as we should replace it
            if (start !== end) {
              range.deleteContents();
            }

            // Finally insert a new node. The browser will automatically
            // split start and end nodes into two if necessary
            range.insertNode(textNode);
          }
        } else {
          // For the text input the only way is to replace the whole value :(
          const value = input.value;
          input.value = value.slice(0, start) + text + value.slice(end);
        }
      }

      // Correct the cursor position to be at the end of the insertion
      input.setSelectionRange(start + text.length, start + text.length);

      // Notify any possible listeners of the change
      const e = document.createEvent("UIEvent");
      e.initEvent("input", true, false);
      input.dispatchEvent(e);
    }
  }

  // 根据浏览器生成换行符正则
  generateReg() {
    let navigatorStr = this.isBrowser()
    if (navigatorStr === 'Firefox') {
      return /\n/
    } else {
      return /\r\n/
    }
  }

  // 浏览器判断
  isBrowser() {
    var userAgent = navigator.userAgent;
    //微信内置浏览器
    if(userAgent.match(/MicroMessenger/i) == 'MicroMessenger') {
        return "MicroMessenger";
    }
    //QQ内置浏览器
    else if(userAgent.match(/QQ/i) == 'QQ') {
        return "QQ";
    }
    //Chrome
    else if(userAgent.match(/Chrome/i) == 'Chrome') {
        return "Chrome";
    }
    //Opera
    else if(userAgent.match(/Opera/i) == 'Opera') {
        return "Opera";
    }
    //Firefox
    else if(userAgent.match(/Firefox/i) == 'Firefox') {
        return "Firefox";
    }
    //Safari
    else if(userAgent.match(/Safari/i) == 'Safari') {
        return "Safari";
    }
    //IE
    else if(!!window.ActiveXObject || "ActiveXObject" in window) {
        return "IE";
    }
    else {
        return "未定义:"+userAgent;
    }
  }

  render() {
    return (
      <div></div>
    )
  }

  componentWillUnmount() {
    document.removeEventListener('paste', this.pasteCallback)
  }
}
