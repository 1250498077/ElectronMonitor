const startCirChats = (domId) => {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById(domId));

  // 指定图表的配置项和数据
  var option = {
    title: {
      text: '柱状图'
    },
    tooltip: {},
    legend: {
      data: ['销量']
    },
    xAxis: {
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
    },
    yAxis: {},
    series: [{
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }]
  };

  // 使用刚指定的配置项和数据显示图表。
  if (option && typeof option === "object") {
    myChart.setOption(option, true);
  }
}

export { startCirChats };