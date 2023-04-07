<template>
  <div class="dashboard-editor-container">
    <model-drop-down></model-drop-down>
    <el-row style="background:#fff;padding:5px 5px 0;margin-bottom:32px;">
      <el-col style="height: 500px">
        <div class="chart-wrapper">
          <div style="margin-bottom: 50px">
            <span class="title-text">起终点站查询频次统计</span>
            <el-radio-group v-model="defaultValue04" @change="stationBtnClick" size="small" style="float: right" fill="#63aff5">
              <el-radio-button label="昨日"></el-radio-button>
              <el-radio-button label="近七日"></el-radio-button>
              <el-radio-button label="本月"></el-radio-button>
              <el-radio-button label="本年"></el-radio-button>
            </el-radio-group>
          </div>
<!--          <bar-chart :bar-chart-data="barChartData"/>-->
          <ManyBarChart :many-bar-chart-data="manyBarChartData"></ManyBarChart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {getSearchRateStatistics} from "@/api/module/index";
  import ManyBarChart from '@/views/dashboard/ManyBarChart'
  import ModelDropDown from '@/views/dashboard/ModelDropDown'

  export default {
    name: 'StationStatistics',
    components: {
      ManyBarChart,
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
        defaultValue04: '昨日',
        //多统计柱状图
        manyBarChartData:{
          aAxisData:[],
          startData:[],
          endData:[],
        },
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getStation();
      })
    },
    created() {
    },
    methods: {
      //---------起终站搜索频率统计---------
      getStation(){
        getSearchRateStatistics(this.defaultValue04).then(response => {
          this.manyBarChartData.aAxisData = response.data.aaxisData;
          this.manyBarChartData.startData = response.data.startData;
          this.manyBarChartData.endData = response.data.endData;
        })
      },
      stationBtnClick() {
        this.getStation();
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
