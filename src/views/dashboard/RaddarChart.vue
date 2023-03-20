<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { radarCount}  from "@/api/module/index";
const animationDuration = 3000

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
      default: '300px'
    }
  },
  data() {
    return {
      chart: null

    }
  },
  /*watch: {
    open(val) {
      if (val === false) {
        this.getRadarCount();
      }
    }
  },
  created() {
    this.getRadarCount();
  },*/
  mounted() {
    this.$nextTick(() => {
      // this.initChart()
      this.getRadarCount()
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
    //radar
    getRadarCount(){
      radarCount().then(response => {
        // console.log(response)
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        radar: {
          radius: '66%',
          center: ['50%', '42%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.3)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: [
            { name: '档案', max: 10000 },
            { name: '用户', max: 20000 },
            { name: '榜首', max: 20000 },
            { name: '乡村', max: 20000 },
            { name: '政策', max: 20000 },
            { name: '项目', max: 20000 }
          ]
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['增长指数', '平均值', '偏移指数']
        },
        series: [{
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1
            }
          },
          data: [
            {
              // value: [5000, 7000, 12000, 11000, 15000, 14000],
              value: response.data[0],
              name: '增长指数'
            },
            {
              value: response.data[1],
              name: '平均值'
            },
            {
              value: response.data[2],
              name: '偏移指数'
            }
          ],
          animationDuration: animationDuration
        }]
      })
        /*this.chart.setOption({
          series:[{
            data:[
              {
                // value: [5000, 7000, 12000, 11000, 15000, 14000],
                value: response.data[0],
                name: 'Allocated Budget'
              },
              {
                value: [5000, 7000, 12000, 11000, 15000, 14000],
                name: 'Expected Spending'
              },
              {
                value: [5000, 7000, 12000, 11000, 15000, 14000],
                name: 'Actual Spending'
              }
            ]
          }]
        })*/
      });
    },
    /*initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        radar: {
          radius: '66%',
          center: ['50%', '42%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.3)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: [
            { name: 'Sales', max: 10000 },
            { name: 'Administration', max: 20000 },
            { name: 'Information Techology', max: 20000 },
            { name: 'Customer Support', max: 20000 },
            { name: 'Development', max: 20000 },
            { name: 'Marketing', max: 20000 }
          ]
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Allocated Budget', 'Expected Spending', 'Actual Spending']
        },
        series: [{
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1
            }
          },
          data: [
            {
              // value: [5000, 7000, 12000, 11000, 15000, 14000],
              value: this.getRadarCount(),
              name: 'Allocated Budget'
            },
            {
              value: [4000, 9000, 15000, 15000, 13000, 11000],
              name: 'Expected Spending'
            },
            {
              value: [5500, 11000, 12000, 15000, 12000, 12000],
              name: 'Actual Spending'
            }
          ],
          animationDuration: animationDuration
        }]
      })
    }*/
  }
}
</script>
