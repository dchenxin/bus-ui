<template>
  <div class="dashboard-editor-container">
    <model-drop-down></model-drop-down>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <div>
            <span class="title-text">模块点击次数统计</span>
            <el-radio-group v-model="defaultValue05" @change="modelClickBtnClick" size="small" style="float: right" fill="#63aff5">
              <el-radio-button label="昨日"></el-radio-button>
              <el-radio-button label="近七日"></el-radio-button>
              <el-radio-button label="本月"></el-radio-button>
              <el-radio-button label="本年"></el-radio-button>
            </el-radio-group>
          </div>
          <across-bar-chart :across-bar-chart-data="acrossBarChartData"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <div>
            <span class="title-text">实载率数据统计</span>
            <el-radio-group v-model="defaultValue06" @change="realLoadBtnClick" size="small" style="float: right" fill="#63aff5">
              <el-radio-button label="昨日"></el-radio-button>
              <el-radio-button label="今日"></el-radio-button>
            </el-radio-group>
          </div>
          <across-bar-chart :across-bar-chart-data="acrossBarChartData02" :unit="`%`"/>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import {getModelClickStatistics,getRealLoadStatistics} from "@/api/module/index";
  import AcrossBarChart from '@/views/dashboard/AcrossBarChart'
  import ModelDropDown from '@/views/dashboard/ModelDropDown'

  export default {
    name: 'ModelAndRealLoadStatistics',
    components: {
      AcrossBarChart,
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
        defaultValue05: '昨日',
        defaultValue06: '昨日',
        acrossBarChartData: {
          yAxisData: [],
          data: []
        },
        acrossBarChartData02: {
          yAxisData: [],
          data: []
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getModelClick();
        this.getRealLoad();
      })
    },
    created() {
    },
    methods: {
      //--------------模块点击----------------
      getModelClick(){
        getModelClickStatistics(this.defaultValue05).then(response => {
          this.acrossBarChartData.yAxisData = response.data.aaxisData;
          this.acrossBarChartData.data = response.data.data;
        })
      },
      modelClickBtnClick() {
        this.getModelClick();
      },
      //--------------实载率----------------
      getRealLoad(){
        getRealLoadStatistics(this.defaultValue06).then(response => {
          this.acrossBarChartData02.yAxisData = response.data.aaxisData;
          this.acrossBarChartData02.data = response.data.data;
        })
      },
      realLoadBtnClick() {
        this.getRealLoad();
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
