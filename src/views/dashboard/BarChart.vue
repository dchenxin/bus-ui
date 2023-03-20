<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { barCount}  from "@/api/module/index";
const animationDuration = 6000

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
    },
    barChartData: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart(this.barChartData)
      // this.getBarCount()
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
    // getBarCount(){
    //   barCount().then(response => {
    //     console.log(response.data)
    //     this.chart = echarts.init(this.$el, 'macarons')
    //
    //     this.chart.setOption({
    //       tooltip: {
    //         trigger: 'axis',
    //         axisPointer: { // 坐标轴指示器，坐标轴触发有效
    //           type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    //         }
    //       },
    //       grid: {
    //         top: 10,
    //         left: '2%',
    //         right: '2%',
    //         bottom: '3%',
    //         containLabel: true
    //       },
    //       xAxis: [{
    //         type: 'category',
    //         data: ['一村一档', '乡村动态', '政策发布', '生态银行', '水美经济', '项目监督', '产品数量'],
    //         axisTick: {
    //           alignWithLabel: true
    //         }
    //       }],
    //       yAxis: [{
    //         type: 'value',
    //         axisTick: {
    //           show: false
    //         }
    //       }],
    //       series: [{
    //         name: '上架数',
    //         type: 'bar',
    //         stack: 'vistors',
    //         barWidth: '60%',
    //         data: response.data[0],
    //         animationDuration
    //       }, {
    //         name: '下架数',
    //         type: 'bar',
    //         stack: 'vistors',
    //         barWidth: '60%',
    //         data: response.data[1],
    //         animationDuration
    //       }]
    //     })
    //
    //   });
    // },
    initChart(data) {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b}<br />频次：{c}'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: data.xAxisData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '频次',
            type: 'bar',
            barWidth: '60%',
            data: data.data
          }
        ]
      })
    }
  }
}
</script>
