<template>
  <div class="dashboard-editor-container">
    <model-drop-down></model-drop-down>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <div class="title-text">用户性别分布</div>
          <pie-chart :pie-chart-data="pieChartData"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <div class="title-text">用户年龄分布</div>
          <pie-chart :pie-chart-data="pieChartData02"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {getUserSexSpreadStatistics,getUserAgeSpreadStatistics} from "@/api/module/index";
  import PieChart from '@/views/dashboard/PieChart'
  import ModelDropDown from "@/views/dashboard/ModelDropDown";

  export default {
    name: 'SpreadStatistics',
    components: {
      PieChart,
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
        //饼图
        pieChartData: {
          legendData: ["男", "女"],
          data: [],
        },
        pieChartData02: {
          legendData: ["17岁以下", "18~24岁", "25～29岁", "30～39岁", "40~49岁", "50岁以上",],
          data: [],
        },
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getSex();
        this.getAge();
      })
    },
    created() {
    },
    methods: {
      //-------------性别分布----------------
      getSex(){
        getUserSexSpreadStatistics().then(response => {
          this.pieChartData.data = response.data.data;
        })
      },
      //-------------年龄分布----------------
      getAge(){
        getUserAgeSpreadStatistics().then(response=>{
          this.pieChartData02.data = response.data.data;
        })
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
