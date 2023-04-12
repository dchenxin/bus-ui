<template>
  <div style="margin-top: 1%">
    <el-select v-model="value" placeholder="请选择" size="small" @change="selectChange">
      <el-option
        v-for="item in selectOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  <el-table
    ref="table"
    height="300"
    :data="tableData"
    border
    :header-cell-style="setHeaderCellStyle"
    style="width: 100%;margin-top: 30px">
    <el-table-column
      type="index"
      label="排名"
      width="50">
      <template scope="scope">
        <span class="index_common" v-bind:class="[scope.$index + 1 === 1 ? 'index_one' : scope.$index + 1 === 2 ? 'index_two' : scope.$index + 1 === 3 ? 'index_three' : '']">
          {{scope.$index + 1}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="lineName"
      label="线路名"
      width="210">
    </el-table-column>
    <el-table-column
      prop="regionName"
      label="地区"
      width="90">
    </el-table-column>
    <el-table-column
      prop="statisticsDate"
      label="统计时间"
      width="130">
    </el-table-column>
    <el-table-column
      prop="earlyOneHour"
      sortable
      label="提前1小时人数">
    </el-table-column>
    <el-table-column
      prop="earlyEight"
      sortable
      label="提前8小时人数">
    </el-table-column>
    <el-table-column
      prop="earlySixteen"
      sortable
      label="提前16小时人数">
    </el-table-column>
    <el-table-column
      prop="earlyOneDay"
      sortable
      label="提前1天人数">
    </el-table-column>
    <el-table-column
      prop="earlyTwoDay"
      sortable
      label="提前2天人数">
    </el-table-column>
    <el-table-column
      prop="earlyTwoDayOver"
      sortable
      label="提前2天以上人数">
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
  export default {
    props: {
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '350px'
      },
      tableData: {
        type: Array,
        required: true
      },
    },
    data() {
      return {
        selectOptions: [{
          value: 1,
          label: '提前1小时',
        }, {
          value: 2,
          label: '提前8小时'
        }, {
          value: 3,
          label: '提前16小时'
        }, {
          value: 4,
          label: '提前1天'
        }, {
          value: 5,
          label: '提前2天'
        }, {
          value: 6,
          label: '提前2天以上'
        }],
        value: 1,
        sort:{prop:'earlyOneHour',order:'descending'},
      };
    },
    mounted() {
        this.scrollFun(this.$refs.table);
    },
    methods: {
      //table滚动
      scrollFun(ref){
       const divData = ref.bodyWrapper;
        let t;
        function start() {
          t=setInterval(()=>{
            divData.scrollTop += 2;
            if(divData.clientHeight + divData.scrollTop >= divData.scrollHeight){
              divData.scrollTop = 0;
            }
          },100)
        }
        divData.onmouseover = function () {
          clearInterval(t);
        };
        divData.onmouseout = function () {
            start();
        }
        start();
      },
      selectChange(val) {
        this.$emit('table-select-change', val)
      },

      // 高亮错误信息
      setHeaderCellStyle({row, column, rowIndex, columnIndex}) {
        if(this.value  === 1 && column.label === "提前1小时人数"){
          return 'background:#55aaff'
        }
        if(this.value  === 2 && column.label === "提前8小时人数"){
          return 'background:#55aaff'
        }
        if(this.value  === 3 && column.label === "提前16小时人数"){
          return 'background:#55aaff'
        }
        if(this.value  === 4 && column.label === "提前1天人数"){
          return 'background:#55aaff'
        }
        if(this.value  === 5 && column.label === "提前2天人数"){
          return 'background:#55aaff'
        }
        if(this.value  === 6 && column.label === "提前2天以上人数"){
          return 'background:#55aaff'
        }
        return ''
      }
    }
  };
</script>

<style>
  .index_one {
    font-weight: bold;
    font-size: 25px;
    color: #f6c325;
  }
  .index_two {
    font-weight: bold;
    font-size: 22px;
    color: #b4c0c7;
  }
  .index_three {
    font-weight: bold;
    font-size: 19px;
    color: #d9a07f;
  }
</style>
