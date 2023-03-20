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
    manyBarChartData: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      chart: null,
      // appConfig:{
      //   rotate: 90,
      //   align: 'left',
      //   verticalAlign: 'middle',
      //   position: 'insideBottom',
      //   distance: 15,
      // },
      // labelOption:{
      //   show: true,
      //   position: this.appConfig.position,
      //   distance: this.appConfig.distance,
      //   align: this.appConfig.align,
      //   verticalAlign: this.appConfig.verticalAlign,
      //   rotate: this.appConfig.rotate,
      //   formatter: '{c}  {name|{a}}',
      //   fontSize: 16,
      //   rich: {
      //     name: {}
      //   }
      // }
    }
  },
  watch: {
    manyBarChartData: {
      deep: true,
      handler() {
        this.initChart()
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

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['起始站', '终点站']
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: this.manyBarChartData.aAxisData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '起始站',
            type: 'bar',
            barGap: 0,
            // label: this.labelOption,
            emphasis: {
              focus: 'series'
            },
            data: this.manyBarChartData.startData
          },
          {
            name: '终点站',
            type: 'bar',
            // label: this.labelOption,
            emphasis: {
              focus: 'series'
            },
            data: this.manyBarChartData.endData
          }
        ]
      })
    }
  }
}
</script>
