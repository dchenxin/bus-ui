<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'

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
      acrossBarChartData: {
        type: Object,
        required: true
      },
      unit: {
        type: String,
        default: ""
      },
    },
    data() {
      return {
        chart: null
      }
    },
    watch: {
      acrossBarChartData: {
        deep: true,
        handler(val) {
          this.initChart(val)
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart(this.acrossBarChartData)
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
      initChart(data) {
        this.chart = echarts.init(this.$el, 'macarons')

        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: 10,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLabel: {
              formatter: '{value} ' + this.unit
            }
          },
          yAxis: {
            type: 'category',
            data: data.yAxisData
          },
          series: [{
            name: '',
            type: 'bar',
            data: data.data,
            label: {
              show: true,
              position: 'right'
            },
          }
            // {
            //   name: '2012',
            //   type: 'bar',
            //   data: [19325, 23438, 31000, 121594, 134141, 681807]
            // }
            ]
        })
      }
    }
  }
</script>
