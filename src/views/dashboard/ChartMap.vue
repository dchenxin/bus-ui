<template>
  <div>
    <el-select v-model="value" placeholder="请选择" size="small" @change="selectChange">
      <el-option
        v-for="item in selectOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <div id="sc-map" ref="mapBox" :style="{height:height,width:width}"></div>
  </div>
</template>
<script>
  import echarts from "echarts";
  import '@/assets/chartMap/nanping.js';

  export default {
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
        default: '480px'
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      mapData: {
        type: Array,
        required: true
      }
    },
    name: 'EchartsMap', data() {
      return {
        chart: null,
        options: {},
        selectOptions: [{
          value: '1',
          label: '订座数',
        }, {
          value: '2',
          label: '退订数'
        }, {
          value: '3',
          label: '退订金额'
        }, {
          value: '4',
          label: '撤销数'
        }, {
          value: '5',
          label: '成交金额'
        }],
        value: '1',
        countType: '订座数',
      }
    },
    mounted() {
      // this.initMap(JSON.parse(JSON.stringify(this.mapData)));
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose();
      this.chart = null
    },
    methods: {
      initMap(data) {
        this.chart = echarts.init(this.$refs.mapBox);
        this.setOption(data);
      },
      setOption(data){
        this.chart.setOption(
          {
            title: {
              text: '',
              subtext: '',
              padding: [15, 15],
              textStyle: {fontFamily: '宋体', fontSize: 16, fontWeight: 'normal', color: '#55aaff'}
            },
            tooltip: {
              trigger: 'item',
              formatter: '{b}<br />统计数：{c}'
            },
            dataset: {
              source: data,
                // [
                //   {name: '光泽县', value: 12},
                //   {name: '武夷山市', value: 17},
                //   {name: '浦城县', value: 13},
                //   {name: '邵武市', value: 11},
                //   {name: '建阳区', value: 14},
                //   {name: '政和县', value: 6},
                //   {name: '松溪县', value: 4},
                //   {name: '顺昌县', value: 10},
                //   {name: '建瓯市', value: 14},
                //   {name: '延平区', value: 8},
                // ]
            },
            series: [{
              map: '南平',
              type: 'map',
              aspectScale: 0.9,
              roam: false,
              label: {show: true, textStyle: {color: '#fff', fontSize: 12,}},
              itemStyle: {
                normal: {
                  borderColor: '#55aaff',
                  borderWidth: 1,
                  borderType: 'solid',
                  areaColor: '#f1f1f1',
                  shadowBlur: 5,
                  shadowColor: '#cecece',
                  shadowOffsetX: 5,
                  shadowOffsetY: 5,
                  label: {
                    show: true, textStyle: {color: '#000000', fontSize: 10,},
                    formatter: '{b} \n' + this.countType + '：{@value}'
                  }
                },
                emphasis: {
                  borderColor: '#2378f7',
                  borderWidth: '1',
                  areaColor: '#55aaff',
                  label: {show: true, textStyle: {color: '#000000', fontSize: 10,}}
                },
                effect: {show: true, shadowBlur: 10, loop: true,}
              },
            }]
          }
        );
      },
      selectChange(val) {
        if(val === '1'){
          this.countType = "订座数";
        }else if (val === '2'){
          this.countType = "退订数";
        }else if (val === '3'){
          this.countType = "退订金额";
        }else if (val === '4'){
          this.countType = "撤销数";
        }else if (val === '5'){
          this.countType = "成交金额";
        }
        this.initMap(JSON.parse(JSON.stringify(this.mapData)));
        this.$emit('select-change', val)
      },
      setMapData(data){
        this.initMap(JSON.parse(JSON.stringify(data)));
      }
    }
  }
</script>
<style scoped>
  #sc-map {
    width: 60%;
    height: 600px;
  }
</style>
