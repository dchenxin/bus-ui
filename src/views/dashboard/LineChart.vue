<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    },
    smooth: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chart: null,
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions(data) {
      let xAxisData = data.xAxisData;
      let legendData = data.data.map(obj => obj.name);
      let series = [];
      if(data.data !=null && data.data.length > 0 ){
        data.data.forEach(obj => {
          series.push({
            name: obj.name,
            smooth: this.smooth,
            type: 'line',
            itemStyle: {
              normal: {
                color: this.color16(),
                lineStyle: {
                  color: this.color16(),
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: obj.data,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },)
        })
      }
      this.chart.setOption({
        xAxis: {
          // data: ['1月','2月', '3月','4月', '5月','6月', '7月','8月', '9月', '10月', '11月','12月'],
          data: xAxisData,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          // data: ['建阳','武夷山','南平','延平','浦城','邵武','光泽','顺昌','建瓯','政和']
          data: legendData
        },
        series: series
      })
    },
    color16(){//十六进制颜色随机
      const r = Math.floor(Math.random()*256);
      const g = Math.floor(Math.random()*256);
      const b = Math.floor(Math.random()*256);
      const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
      return color;
    }
  }
}
</script>
