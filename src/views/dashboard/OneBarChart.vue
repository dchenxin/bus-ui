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
        default: '350px'
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
          this.initChart(this.barChartData)
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
      initChart(data) {
        this.chart = echarts.init(this.$el, 'macarons')

        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{b}<br />实载率：{c}'
          },
          grid: {
            top:10,
            left: '3%',
            right: '4%',
            bottom: '-50%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: data.xAxisData,
              axisTick: {
                alignWithLabel: true
              },
              axisLabel:{
                interval:0,
                rotate:-20   //值>0向右倾斜，值<0则向左倾斜
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: '{value}' + '%'
              }
            },
          ],
          series: [
            {
              name: '实载率',
              type: 'bar',
              barWidth: '60%',
              data: data.data,
              label: {
                show: true,
                position: 'top',
                formatter:'{c}' + '%'
              },
            }
          ]
        })
      }
    }
  }
</script>
