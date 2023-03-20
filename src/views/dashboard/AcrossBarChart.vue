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
            data: data.data
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
