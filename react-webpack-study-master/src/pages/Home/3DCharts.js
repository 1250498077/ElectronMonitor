import config from 'config/Config';
const CDN_BASE = config.CDN_BASE || '';

const start3DCarts = (domId) => {
  var dom = document.getElementById(domId);
  var myChart = echarts.init(dom);
  var option = {
    backgroundColor: '#000',
    globe: {
      baseTexture: `${document.origin + config.publicPath}/assets/chart/3d/earth.jpg`,
      heightTexture: `${document.origin + config.publicPath}/assets/chart/3d/bathymetry_bw_composite_4k.jpg`,
      displacementScale: 0.1,
      shading: 'lambert',
      environment: `${document.origin + config.publicPath}/assets/chart/3d/starfield.jpg`,
      light: {
        ambient: {
          intensity: 0.1
        },
        main: {
          intensity: 1.5
        }
      },

      layers: [{
        type: 'blend',
        blendTo: 'emission',
        texture: `${document.origin + config.publicPath}/assets/chart/3d/night.jpg`
      }, {
        type: 'overlay',
        texture: `${document.origin + config.publicPath}/assets/chart/3d/clouds.png`,
        shading: 'lambert',
        distance: 5
      }]
    },
    series: []
  }
  if (option && typeof option === "object") {
    myChart.setOption(option, true);
  }
}

export { start3DCarts };