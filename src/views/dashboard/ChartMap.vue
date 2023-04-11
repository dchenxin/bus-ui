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
        minMaxValue:[],
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
            tooltip: {
              trigger: 'item',
              formatter: '{b}<br />统计数：{c}'
            },
            visualMap:{
              show: false,
              type: 'piecewise',
              left: 50,
              bottom: 50,
              showLabel: true,
              itemWidth: 10,
              itemHeight: 10,
              inverse: true,
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
                    // formatter: '{b} \n' + this.countType + '：{@value}'
                    formatter: (param)=>{
                      if(param.value === this.minMaxValue[0]){
                          return '{green|' + param.name +'\n' + this.countType + '：' + param.value + '%' + '}'
                      }
                      if(param.value === this.minMaxValue[1]){
                        return '{red|' + param.name +'\n' + this.countType + '：' + param.value + '%' + '}'
                      }
                      return  param.name +'\n' + this.countType + '：' + param.value + '%'
                    },
                    rich:{
                      red:{
                        color:'red',
                        fontWeight: 'bolder',
                        fontSize: 12
                      },
                      green:{
                        color:'green',
                        fontWeight: 'bolder',
                        fontSize: 12
                      }
                    }
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
        this.setMinMaxValue(this.mapData);
        this.initMap(JSON.parse(JSON.stringify(this.mapData)));
        this.$emit('select-change', val)
      },
      setMapData(data){
        this.setMinMaxValue(data);
        this.initMap(JSON.parse(JSON.stringify(data)));
      },
      setMinMaxValue(data){
        let values =  data.map(obj => obj.value)
        this.minMaxValue.splice(0,this.minMaxValue.length)
        this.minMaxValue.push(Math.min.apply(null, values),Math.max.apply(null, values))
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
