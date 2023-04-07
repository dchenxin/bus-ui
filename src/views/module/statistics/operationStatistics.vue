<template>
  <div class="dashboard-editor-container">
    <model-drop-down></model-drop-down>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-col style="height: 500px">
        <div class="chart-wrapper">
          <div>
            <span class="title-text">小程序运营数据统计</span>
            <el-radio-group v-model="defaultValue01" @change="operationBtnClick" size="small" style="float: right" fill="#63aff5">
              <el-radio-button label="近七日"></el-radio-button>
              <el-radio-button label="本月"></el-radio-button>
              <el-radio-button label="本年"></el-radio-button>
            </el-radio-group>
            <div style="text-align: center;margin-top: 2%">

              <el-button size="small" type="primary" round
                         @click="changeType(item.value)"
                         v-for="(item,index) in buttons"
                         :key="index"
                         :plain="item.value !== clickStatus"
              >{{item.text}}</el-button>
            </div>
          </div>
          <one-line-chart :chart-data="lineChartData02" :smooth="true" :unit="unit"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {formatDate,getOperationStatistics} from "@/api/module/index";
  import OneLineChart from '@/views/dashboard/OneLineChart'
  import ModelDropDown from "@/views/dashboard/ModelDropDown";

  export default {
    name: 'OperationStatistics',
    components: {
      OneLineChart,
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
        defaultValue01: '近七日',
        buttons: [
          { value: '1', text: '交易金额'},
          { value: '2', text: '交易笔数'},
          { value: '3', text: '交易人数'},
          { value: '4', text: '首次交易人数'},
        ],
        //点击值
        clickStatus: '1',
        unit:"",
        lineChartData02: {
          xAxisData: [],
          data: []
        },
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getOperation();
      })
    },
    created() {
    },
    methods: {
      //--------小程序业务统计--------
      getOperation(){
        getOperationStatistics(this.defaultValue01).then(response => {
          //x轴
          if(this.defaultValue01 === '本年' ){
            this.lineChartData02.xAxisData = response.data.map(val=> val.statisticsDate)
          }else{
            this.lineChartData02.xAxisData = response.data.map(val=> formatDate({date:val.statisticsDate,formatStr:'MM-dd'}));
          }
          //y轴
          this.lineChartData02.data.splice(0,this.lineChartData02.data.length)
          if(this.clickStatus === '2'){
            this.lineChartData02.data.push({
              name:"",
              data: response.data.map(val=> val.tradeCount)
            })
            this.unit = "笔";
          }else if (this.clickStatus === '3'){
            this.lineChartData02.data.push({
              name:"",
              data: response.data.map(val=> val.tradeNum)
            })
            this.unit = "人";
          }else if(this.clickStatus === '4'){
            this.lineChartData02.data.push(
              {
                name:"",
                data: response.data.map(val=> val.tradeNumFirst)
              })
            this.unit = "人";
          }else {
            this.lineChartData02.data.push({
              name:"",
              data: response.data.map(val=> val.tradeAmount)
            })
            this.unit = "万元";
          }
        });
      },
      changeType(val){
        this.clickStatus = val;
      },
      operationBtnClick() {
        this.getOperation();
      },
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
