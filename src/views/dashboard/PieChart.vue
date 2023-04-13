<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { pieCount}  from "@/api/module/index";
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
    pieChartData: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      default: '',
      required: true
    },
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    pieChartData: {
      deep: true,
      handler(val) {
        this.initChart(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart(this.pieChartData)
      // this.getPieCount()
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
    //pieChart
    // getPieCount(){
    //   pieCount().then(response => {
    //     console.log(response.data)
    //     this.chart = echarts.init(this.$el, 'macarons')
    //
    //     this.chart.setOption({
    //       tooltip: {
    //         trigger: 'item',
    //         formatter: '{a} <br/>{b} : {c} ({d}%)'
    //       },
    //       legend: {
    //         left: 'center',
    //         bottom: '10',
    //         data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
    //       },
    //       series: [
    //         {
    //           name: '比重',
    //           type: 'pie',
    //           roseType: 'radius',
    //           radius: [15, 95],
    //           center: ['50%', '38%'],
    //           data: [
    //             { value: response.data[0], name: '一村一档' },
    //             { value: response.data[1], name: '乡村动态' },
    //             { value: response.data[2], name: '政策发布' },
    //             { value: response.data[3], name: '生态银行' },
    //             { value: response.data[4], name: '水美经济' }
    //           ],
    //           animationEasing: 'cubicInOut',
    //           animationDuration: 2600
    //         }
    //       ]
    //     })
    //
    //   });
    // },
    initChart(data) {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: data.legendData
        },
        series: [
          {
            name: this.name,
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: data.data,
            label:{
              formatter: '{b}\n {d}%'
            },
            animationEasing: 'cubicInOut',
            animationDuration: 2000
          }
        ]
      })
    }
  }
}
</script>
