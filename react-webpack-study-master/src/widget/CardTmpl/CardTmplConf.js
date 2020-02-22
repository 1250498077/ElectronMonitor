export default {
  // 表单布局
  formItemLayout: {
    '24': {
      wrapperCol: {
        span: 21
      },
      labelCol: {
        span: 3
      }
    },
    '18': {
      wrapperCol: {
        span: 20
      },
      labelCol: {
        span: 4
      }
    },
    '12': {
      wrapperCol: {
        span: 18
      },
      labelCol: {
        span: 6
      }
    },
    '8': {
      labelCol: {
        span: 9
      },
      wrapperCol: {
        span: 15
      },    
    },
    '6': {
      wrapperCol: {
        span: 12
      },
      labelCol: {
        span: 12
      }
    }
  },

  // 搜索表单布局
  searchFormLayout: {
    colItem: {
      xs: { span: 24 },
      md: { span: 12 },
      lg: { span: 8 },
      xl: { span: 6 }
    },
    formItem: {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    }
  },

  // 表单底部布局
  tailFormItemLayout: {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 10,
      },
    }
  } 
}