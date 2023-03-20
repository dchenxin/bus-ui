<template>
  <div>
  <el-table
    ref="table"
    height="300"
    :data="tableData"
    border
    show-summary
    style="width: 100%;margin-top: 30px">
    <el-table-column
      prop="regionName"
      label="地区"
      width="180">
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
      label="提前1天">
    </el-table-column>
    <el-table-column
      prop="earlyTwoDay"
      sortable
      label="提前2天">
    </el-table-column>
    <el-table-column
      prop="earlyTwoDayOver"
      sortable
      label="提前2天以上">
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
      }
    }
  };
</script>
