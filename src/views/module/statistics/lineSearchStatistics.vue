<template>
  <div class="dashboard-editor-container">
    <model-drop-down></model-drop-down>
<!--    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
<!--      <el-col>-->
<!--        <div class="chart-wrapper">-->
<!--          <div>-->
<!--            <span class="title-text">班次查询频次统计</span>-->
<!--            <el-radio-group v-model="defaultValue03" size="small" style="float: right" fill="#63aff5">-->
<!--              <el-radio-button label="昨日"></el-radio-button>-->
<!--              <el-radio-button label="本月"></el-radio-button>-->
<!--              <el-radio-button label="本年"></el-radio-button>-->
<!--            </el-radio-group>-->
<!--          </div>-->
<!--          <bar-chart :bar-chart-data="barChartData"/>-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->
  </div>
</template>

<script>
  import ModelDropDown from '@/views/dashboard/ModelDropDown'

  export default {
    name: 'LineSearchStatistics',
    components: {
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

      }
    },
    mounted() {
      this.$nextTick(() => {

      })
    },
    created() {
    },
    methods: {

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
