<template>
  <div>
    <el-row style="padding:16px 16px 0;margin-bottom:12px;">
      <el-col :span="4">
          <el-dropdown @command="areaHandleCommand" size="small" split-button type="primary">
            {{areaName === "" ? `请选择统计地区` : areaName}}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item  v-for="item in selectOptions" :command="{value:item.value,label:item.label}" v-model="item.value">{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      </el-col>
      <el-col :span="4">
        <el-dropdown @command="handleCommand" size="small" split-button type="primary">
          {{modelName === "" ? `请选择统计模块` : modelName}}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-s-order" :command="{value:1,label:'业务运营情况'}">业务运营情况</el-dropdown-item>
            <el-dropdown-item icon="el-icon-s-order" :command="{value:2,label:'小程序运营情况'}">小程序运营情况</el-dropdown-item>
            <el-dropdown-item icon="el-icon-s-platform" :command="{value:3,label:'提前购票时间'}">提前购票时间</el-dropdown-item>
            <el-dropdown-item icon="el-icon-s-operation" :command="{value:4,label:'起终点站查询频次'}">起终点站查询频次</el-dropdown-item>
            <el-dropdown-item icon="el-icon-s-custom" :command="{value:5,label:'用户性别年龄'}">用户性别年龄</el-dropdown-item>
            <el-dropdown-item icon="el-icon-s-promotion" :command="{value:6,label:'模块点击及实载率'}">模块点击及实载率</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  export default {
    name: 'ModelDropDown',
    data() {
      return {
        areaName:"所有地区",
        modelName:"",
        selectOptions: [
          {
            value: '0',
            label: '所有',
          },{
          value: '1',
          label: '福州',
        }, {
          value: '2',
          label: '莆田'
        }, {
          value: '3',
          label: '泉州'
        }, {
          value: '4',
          label: '厦门'
        }, {
          value: '5',
          label: '漳州'
        }, {
          value: '6',
          label: '龙岩'
        }, {
          value: '7',
          label: '宁德'
        }, {
          value: '8',
          label: '三明'
        }, {
          value: '9',
          label: '南平'
        }],
        value: '1',
      }
    },
    mounted() {
      let areaName = localStorage.getItem("areaName");
      this.areaName = areaName === null || areaName === undefined ? "所有" : areaName;

      let modelName = localStorage.getItem("modelName");
      this.modelName = modelName === null || modelName === undefined ? "" : modelName;
    },
    methods: {
      areaHandleCommand(command) {
        this.areaName = command.label
        localStorage.setItem("areaName",command.label);
      },
      handleCommand(command) {
        this.modelName = command.label
        //添加模块名缓存 便于各个页面展示
        localStorage.setItem("modelName",command.label);
        switch (command.value) {
          case 1:
            this.$router.push('/index');
            break;
          case 2:
            this.$router.push('/operationStatistics');
            break;
          case 3:
            this.$router.push('/buyEarlyStatistics');
            break;
          case 4:
            this.$router.push('/stationStatistics');
            break;
          case 5:
            this.$router.push('/spreadStatistics');
            break;
          case 6:
            this.$router.push('/modelAndRealLoadStatistics');
            break;
            default:
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
