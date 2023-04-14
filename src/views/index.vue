<template>
  <div class="dashboard-editor-container">
    <!--    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
    <!--      <el-col style="height: 500px">-->
    <!--        <div class="chart-wrapper">-->
    <!--          <chart-map />-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
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
              <one-line-chart :chart-data="lineChartData" :unit="unit" :height="`480px` "/>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-col style="height: 430px">
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
              <!--              <el-button size="small" round>交易金额</el-button>-->
              <!--              <el-button size="small" round>交易笔数</el-button>-->
              <!--              <el-button size="small" round>交易人数</el-button>-->
              <!--              <el-button size="small" round>首次交易人数</el-button>-->
            </div>
          </div>
          <one-line-chart :chart-data="lineChartData02" :smooth="true" :unit="unit"/>
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px; height: 480px">
      <el-col>
        <div class="chart-wrapper">
          <div>
            <span class="title-text">提前购票时间统计</span>
            <el-radio-group v-model="defaultValue02" @change="buyEarlyBtnClick" size="small" style="float: right" fill="#63aff5">
              <el-radio-button label="昨日"></el-radio-button>
              <el-radio-button label="近七日"></el-radio-button>
              <el-radio-button label="本月"></el-radio-button>
              <el-radio-button label="本年"></el-radio-button>
            </el-radio-group>
          </div>
          <total-table v-on:table-select-change="tableChange" :table-data="tableData"></total-table>
          <!--          <line-chart :chart-data="lineChartData03"/>-->
        </div>
      </el-col>
    </el-row>
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
    <el-row :gutter="32">
      <el-col>
        <div class="chart-wrapper">
          <div>
            <span class="title-text">起终点站查询频次统计</span>
            <el-radio-group v-model="defaultValue04" @change="stationBtnClick" size="small" style="float: right" fill="#63aff5">
              <el-radio-button label="昨日"></el-radio-button>
              <el-radio-button label="近七日"></el-radio-button>
              <el-radio-button label="本月"></el-radio-button>
              <el-radio-button label="本年"></el-radio-button>
            </el-radio-group>
          </div>
          <bar-chart :bar-chart-data="barChartData"/>
<!--          <ManyBarChart :many-bar-chart-data="manyBarChartData"></ManyBarChart>-->
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <div class="title-text">用户性别分布</div>
          <pie-chart :name="pieTitleValue01" :pie-chart-data="pieChartData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <div class="title-text">用户年龄分布</div>
          <pie-chart :name="pieTitleValue02" :pie-chart-data="pieChartData02"/>
        </div>
      </el-col>
    </el-row>
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
      <el-col :xs="24" :sm="30" :lg="12">
        <div class="chart-wrapper">
          <div>
            <span class="title-text">实载率数据统计</span>
            <el-radio-group v-model="defaultValue06" @change="realLoadBtnClick" size="small" style="float: right" fill="#63aff5">
              <el-radio-button label="昨日"></el-radio-button>
              <el-radio-button label="今日"></el-radio-button>
            </el-radio-group>
          </div>
            <one-bar-chart :bar-chart-data="oneBarChartData"/>
<!--          <across-bar-chart :across-bar-chart-data="acrossBarChartData02" :unit="`%`" />-->
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import {formatDate,getBusinessStatistics,getOperationStatistics,getBuyEarlyStatistics,getSearchRateStatistics,getUserSexSpreadStatistics,getUserAgeSpreadStatistics,getModelClickStatistics,getRealLoadStatistics} from "@/api/module/index";
  import PanelGroup from './dashboard/PanelGroup'
  import LineChart from './dashboard/LineChart'
  import OneLineChart from './dashboard/OneLineChart'
  import RaddarChart from './dashboard/RaddarChart'
  import PieChart from './dashboard/PieChart'
  import BarChart from './dashboard/BarChart'
  import AcrossBarChart from './dashboard/AcrossBarChart'
  import ChartMap from './dashboard/ChartMap'
  import TotalTable from './dashboard/TotalTable'
  import OneBarChart from './dashboard/OneBarChart'
  import ManyBarChart from './dashboard/ManyBarChart'

  export default {
    name: 'Index',
    components: {
      PanelGroup,
      LineChart,
      RaddarChart,
      PieChart,
      BarChart,
      OneLineChart,
      AcrossBarChart,
      ChartMap,
      TotalTable,
      ManyBarChart,
      OneBarChart
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
        // 服务器信息
        server: [],
        series: [],
        defaultValue: '昨日',
        defaultValue01: '近七日',
        defaultValue02: '昨日',
        defaultValue03: '昨日',
        defaultValue04: '昨日',
        defaultValue05: '昨日',
        defaultValue06: '昨日',
        bookNum: 0,
        cancelNum: 0,
        cancelAmount: 0,
        revokeNum: 0,
        successAmount: 0,
        buttons: [
          { value: '1', text: '交易金额'},
          { value: '2', text: '交易笔数'},
          { value: '3', text: '交易人数'},
          { value: '4', text: '首次交易人数'},
        ],

        //点击值
        clickStatus: '1',
        //地图
        mapData: [],
        selectValue: "",
        //折线图
        lineChartData: {
          xAxisData: [],
          data: [],
        },
        lineChartData02: {
          xAxisData: [],
          data: []
        },
        unit:"",
        tableData: [],
        tableSelectValue:1,
        //柱状图
        barChartData:{
          aAxisData:[],
          startData:[],
          endData:[],
        },
        // //多统计柱状图
        // manyBarChartData:{
        //   aAxisData:[],
        //   startData:[],
        //   endData:[],
        // },
        //饼图
        pieChartData: {
          legendData: ["男", "女"],
          data: [],
        },
        pieChartData02: {
          legendData: ["17岁以下", "18~24岁", "25～29岁", "30～39岁", "40~49岁", "50岁以上",],
          data: [],
        },
        pieTitleValue01: "用户性别分布",
        pieTitleValue02: "用户年龄分布",
        //柱状图
        // barChartData: {
        //   xAxisData: ["建阳", "武夷山", "南平", "延平", "浦城", "邵武", "光泽", "顺昌", "建瓯", "政和", "松溪"],
        //   data: [22, 23, 34, 56, 47, 28, 21, 25, 28, 26, 25]
        // },
        acrossBarChartData: {
          yAxisData: [],
          data: []
        },
        // acrossBarChartData02: {
        //   yAxisData: [],
        //   data: []
        // }
        oneBarChartData:{
          // xAxisData: ["建阳", "武夷山", "南平", "延平", "浦城", "邵武", "光泽", "顺昌", "建瓯", "政和", "松溪"],
          // data: [22, 23, 34, 56, 47, 28, 21, 25, 28, 26, 25],
          xAxisData: [],
          data: []
        },
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getBusiness();
        this.initMapData();
        this.getOperation();
        this.getBuyEarly();
        this.getStation();
        this.getSex();
        this.getAge();
        this.getModelClick();
        this.getRealLoad();
      })
    },
    created() {
    },
    methods: {
      //------------业务统计----------
      initMapData() {
        this.getBusiness();
      },
      change(val) {
        this.selectValue = val;
        this.getBusiness();
      },
      changeMap(val,data){
        //取本地缓存
        let arr = []
        if (val === '1') {
          data.forEach(data => {
            arr.push({
              name: data.name,
              value: data.bookNumData
            })
          })
        } else if (val === '2') {
          data.forEach(data => {
            arr.push({
              name: data.name,
              value: data.cancelNumData
            })
          })
        } else if (val === '3') {
          data.forEach(data => {
            arr.push({
              name: data.name,
              value: data.cancelAmountData
            })
          })
        } else if (val === '4') {
          data.forEach(data => {
            arr.push({
              name: data.name,
              value: data.revokeNumData
            })
          })
        } else {
          data.forEach(data => {
            arr.push({
              name: data.name,
              value: data.successAmountData
            })
          })
        }
        this.$refs.chartMap.setMapData(arr);
      },
      //获取业务统计数据
      getBusiness() {
        getBusinessStatistics(this.defaultValue).then(response => {
          this.lineChartData.xAxisData = response.data.xaxisData;

          this.lineChartData.data.splice(0,this.lineChartData.data.length);
          this.unit = "%";
          if (this.selectValue === '1') {
            this.lineChartData.data.push({
              data: response.data.data.map(obj => obj.bookNumData)
            })
          } else if (this.selectValue === '2') {
            this.lineChartData.data.push({
              data: response.data.data.map(obj => obj.cancelNumData)
            })
          } else if (this.selectValue === '3') {
            this.lineChartData.data.push({
              data: response.data.data.map(obj => obj.cancelAmountData)
            })
          } else if (this.selectValue === '4') {
            this.lineChartData.data.push({
              data: response.data.data.map(obj => obj.revokeNumData)
            })
          } else {
            this.lineChartData.data.push({
              data: response.data.data.map(obj => obj.successAmountData)
            })
          }
          this.bookNum = response.data.totalVo.bookNum
          this.cancelNum = response.data.totalVo.cancelNum
          this.cancelAmount = response.data.totalVo.cancelAmount
          this.revokeNum = response.data.totalVo.revokeNum
          this.successAmount = response.data.totalVo.successAmount
          this.changeMap(this.selectValue === "" ? '1' : this.selectValue,response.data.data)
        });
      },
      businessBtnClick() {
        this.getBusiness();
      },

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

      //---------提前购票统计----------
      getBuyEarly(){
        getBuyEarlyStatistics({type:this.defaultValue02,selectType:this.tableSelectValue}).then(response => {
          this.tableData = response.data
        })
      },
      buyEarlyBtnClick() {
        this.getBuyEarly();
      },
      tableChange(val) {
        this.tableSelectValue = val;
        this.getBuyEarly();
      },

      //---------起终站搜索频率统计---------
      getStation(){
        getSearchRateStatistics(this.defaultValue04).then(response => {
          this.barChartData.aAxisData = response.data.aaxisData;
          this.barChartData.startData = response.data.startData;
          this.barChartData.endData = response.data.endData;
        })
      },
      stationBtnClick() {
        this.getStation();
      },
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
          console.log(response)
          this.oneBarChartData.xAxisData = response.data.aaxisData;
          this.oneBarChartData.data = response.data.data;
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
      height: 410px;
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
