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
    },
    unit: {
      type: String,
      default: "万元"
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
      let legendData = [];
      let series = [];
      if(data.data !=null && data.data.length > 0 ){
        legendData = data.data.map(obj => obj.name);
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
            markPoint: {
              data: [
                { type: 'max', name: 'Max' ,label:{formatter:'最大值：' + '{c}'}},
                { type: 'min', name: 'Min',label:{formatter:'最小值：' + '{c}'} }
              ]
            },
            markLine:{
              data:[
                {type:"average",name:"Avg",label:{formatter:'平均值：' + '{c}',position:"middle",fontWeight: "normal",fontSize:14,}}
                ]
            },
            data: obj.data,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },)
        })
      }
      this.chart.setOption({
        xAxis: {
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
          },
          axisLabel: {
            formatter: '{value}' + this.unit
          }
        },
        legend: {
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
