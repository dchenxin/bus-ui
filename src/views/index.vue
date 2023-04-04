<template>
  <div class="dashboard-editor-container">
    <model-drop-down></model-drop-down>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-col style="height: 580px">
        <div class="chart-wrapper">
          <div>
            <span class="title-text">业务运营情况数据统计</span>
            <el-radio-group v-model="defaultValue" @change="businessBtnClick" size="small" style="float: right"
                            fill="#63aff5">
              <el-radio-button label="昨日"></el-radio-button>
              <el-radio-button label="近七日"></el-radio-button>
              <el-radio-button label="本月"></el-radio-button>
              <el-radio-button label="本年"></el-radio-button>
            </el-radio-group>
          </div>
          <div style="margin-top: 1%;height: 35px">
            <el-col :span="3">
              <div>
                <span class="title-text-02">订座数 <span class="number-span" v-text="bookNum"></span></span>
              </div>
            </el-col>
            <el-col :span="3">
              <div>
                <span class="title-text-02">退订数 <span class="number-span" v-text="cancelNum"></span></span>
              </div>
            </el-col>
            <el-col :span="3">
              <div>
                <span class="title-text-02">退订金额 <span class="number-span" v-text="cancelAmount"></span></span>
              </div>
            </el-col>
            <el-col :span="3">
              <div>
                <span class="title-text-02">撤销数 <span class="number-span" v-text="revokeNum"></span></span>
              </div>
            </el-col>
            <el-col :span="3">
              <div>
                <span class="title-text-02">成交金额 <span class="number-span" v-text="successAmount"></span></span>
              </div>
            </el-col>
          </div>
          <div>
            <div style="width: 36%;float: left">
              <chart-map ref="chartMap" v-on:select-change="change" :map-data="mapData"/>
            </div>
            <div style="width: 64%;float: right">
              <line-chart :chart-data="lineChartData" :height="`480px` "/>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import {getBusinessStatistics} from "@/api/module/index";
  import LineChart from './dashboard/LineChart'
  import ChartMap from './dashboard/ChartMap'
  import ModelDropDown from './dashboard/ModelDropDown'

  export default {
    name: 'Index',
    components: {
      LineChart,
      ChartMap,
      ModelDropDown
    },
    watch: {
      clickStatus: {
        deep: true,
        handler() {
          this.getOperation();
        }
      }
    },
    data() {
      return {
        defaultValue: '昨日',
        bookNum: 0,
        cancelNum: 0,
        cancelAmount: 0,
        revokeNum: 0,
        successAmount: 0,
        //地图
        mapData: [],
        //折线图
        lineChartData: {
          xAxisData: [],
          data: [],
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getBusiness();
        this.initMapData();
      })
    },
    created() {
    },
    methods: {
      //------------业务统计----------
      initMapData() {
        //取本地缓存
        let cacheData = JSON.parse(localStorage.getItem("businessData"))
        let arr = []
        cacheData.forEach(data => {
          arr.push({
            name: data.name,
            value: data.data[0]
          })
        })
        this.$nextTick(() => {
          this.$refs.chartMap.setMapData(arr);
        })
      },
      change(val) {
        //取本地缓存
        let cacheData = JSON.parse(localStorage.getItem("businessData"))
        let arr = []
        if (val === '1') {
          cacheData.forEach(data => {
            arr.push({
              name: data.name,
              value: data.data[0]
            })
          })
        } else if (val === '2') {
          cacheData.forEach(data => {
            arr.push({
              name: data.name,
              value: data.data[1]
            })
          })
        } else if (val === '3') {
          cacheData.forEach(data => {
            arr.push({
              name: data.name,
              value: data.data[2]
            })
          })
        } else if (val === '4') {
          cacheData.forEach(data => {
            arr.push({
              name: data.name,
              value: data.data[3]
            })
          })
        } else {
          cacheData.forEach(data => {
            arr.push({
              name: data.name,
              value: data.data[4]
            })
          })
        }
        this.$refs.chartMap.setMapData(arr);
      },
      //获取业务统计数据
      getBusiness() {
        getBusinessStatistics(this.defaultValue).then(response => {
          this.lineChartData.xAxisData = response.data.xaxisData;
          this.lineChartData.data = response.data.data;
          this.bookNum = response.data.totalVo.bookNum
          this.cancelNum = response.data.totalVo.cancelNum
          this.cancelAmount = response.data.totalVo.cancelAmount
          this.revokeNum = response.data.totalVo.revokeNum
          this.successAmount = response.data.totalVo.successAmount
          //存本地缓存
          localStorage.setItem("businessData", JSON.stringify(response.data.data))
        });
      },
      businessBtnClick() {
        this.getBusiness();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
      height: 360px;
    }
  }

  .title-text {
    line-height: 18px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 18px;
    margin-bottom: 12px;
  }

  .title-text-02 {
    line-height: 18px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    margin-bottom: 12px;
  }

  .number-span {
    font-weight: bolder;
    font-size: 16px;
  }

  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
