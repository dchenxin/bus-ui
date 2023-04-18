<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'
  import {barCount} from "@/api/module/index";

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
    watch: {
      barChartData: {
        deep: true,
        handler() {
          this.initChart()
        }
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
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.chart.setOption({
          legend: {},
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar', 'stack']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          dataset: {
            source: [
              this.barChartData.aAxisData,
              this.barChartData.startData,
              this.barChartData.endData
              // ['product', '松溪县', '南平市', '浦城县', '政和县', '顺昌县', '光泽县', '建阳区', '延平区', '邵武市', '建瓯市', '武夷山市'],
              // ['起始站', 16, 35, 41, 64, 31, 28, 26, 29, 36, 32, 56],
              // ['终点站', 21, 39, 31, 54, 47, 58, 29, 21, 30, 42, 36],
            ]
          },
          xAxis: {type: 'category'},
          yAxis: {},
          series: [
            {
              type: 'bar',
              label: {
                show: true,
                position: 'top',
              },
            },
            {
              type: 'bar', label: {
                show: true,
                position: 'top',
              },
            },
            {
              type: 'bar', label: {
                show: true,
                position: 'top',
              },
            },
            {
              type: 'bar', label: {
                show: true,
                position: 'top',
              },
            },
            {
              type: 'bar', label: {
                show: true,
                position: 'top',
              },
            },
            {
              type: 'bar', label: {
                show: true,
                position: 'top',
              },
            },
            {
              type: 'bar', label: {
                show: true,
                position: 'top',
              },
            },
            {
              type: 'bar', label: {
                show: true,
                position: 'top',
              },
            },
            {
              type: 'bar', label: {
                show: true,
                position: 'top',
              },
            },
            {
              type: 'bar', label: {
                show: true,
                position: 'top',
              },
            },
            {
              type: 'bar', label: {
                show: true,
                position: 'top',
              },
            }]
        })
      }
    }
  }
</script>
