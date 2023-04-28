<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="线路名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入线路名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="线路类型" prop="typeId">
        <el-select v-model="queryParams.typeId" placeholder="请选择线路类型" clearable size="small">
          <el-option
            v-for="dict in typeIdOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属公司" prop="companyId">
        <el-select v-model="queryParams.companyId" placeholder="请选择所属公司" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['ruoyi:line:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ruoyi:line:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['ruoyi:line:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ruoyi:line:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="lineList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="线路编号" align="center" prop="no" />
      <el-table-column label="线路名" align="center" prop="name" />
      <el-table-column label="线路类型" align="center" prop="typeId" :formatter="typeIdFormat" />
<!--      <el-table-column label="线路类型" align="center" prop="type" />-->
      <el-table-column label="起始站" align="center" prop="startStation" />
      <el-table-column label="终点站" align="center" prop="endStation" />
      <el-table-column label="所属公司" align="center" prop="companyId" />
<!--      <el-table-column label="所属公司" align="center" prop="companyName" />-->
      <el-table-column label="空驶里程数(单位/km)" align="center" prop="emptyDriveMileage" />
      <el-table-column label="日均趟次" align="center" prop="dayAverageNum" />
      <el-table-column label="是否发送发班时间" align="center" prop="isSendClassTime" :formatter="isSendClassTimeFormat" />
      <el-table-column label="是否发送间隔报警" align="center" prop="isIntervalSendAlarm" :formatter="isIntervalSendAlarmFormat" />
      <el-table-column label="是否取消首末班补贴" align="center" prop="isCancelSubsidy" :formatter="isCancelSubsidyFormat" />
      <el-table-column label="上行夏令早班" align="center" prop="upSummerEarly" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.upSummerEarly, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上行夏令晚班" align="center" prop="upSummerLate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.upSummerLate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上行起始站编号" align="center" prop="upStartStationNo" />
      <el-table-column label="上行终点站编号" align="center" prop="upEndStationNo" />
      <el-table-column label="上行冬令早班" align="center" prop="upWinterEarly" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.upWinterEarly, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上行冬令晚班" align="center" prop="upWinterLate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.upWinterLate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上行大间隔站数" align="center" prop="upIntervalStationMax" />
      <el-table-column label="上行小间隔站数" align="center" prop="upIntervalStationMin" />
      <el-table-column label="上行里程数(单位/km)" align="center" prop="upMileages" />
      <el-table-column label="上行运行时间(单位/分钟)" align="center" prop="upRunTime" />
      <el-table-column label="上行排班计划编号" align="center" prop="upSchedulePlanNo" />
      <el-table-column label="上行允许误差分钟数(单位/分钟)" align="center" prop="upAllowMistake" />
      <el-table-column label="上行价格描述" align="center" prop="upPriceDescribe" />
      <el-table-column label="下行夏令早班" align="center" prop="downSummerEarly" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.downSummerEarly, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下行夏令晚班" align="center" prop="downSummerLate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.downSummerLate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下行起始站编号" align="center" prop="downStartStationNo" />
      <el-table-column label="下行终点站编号" align="center" prop="downEndStationNo" />
      <el-table-column label="下行冬令早班" align="center" prop="downWinterEarly" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.downWinterEarly, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下行冬令晚班" align="center" prop="downWinterLate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.downWinterLate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下行大间隔站数" align="center" prop="downIntervalStationMax" />
      <el-table-column label="下行小间隔站数" align="center" prop="downIntervalStationMin" />
      <el-table-column label="下行里程数(单位/km)" align="center" prop="downMileages" />
      <el-table-column label="下行运行时间(单位/分钟)" align="center" prop="downRunTime" />
      <el-table-column label="下行排班计划编号" align="center" prop="downSchedulePlanNo" />
      <el-table-column label="下行允许误差分钟数(单位/分钟)" align="center" prop="downAllowMistake" />
      <el-table-column label="下行价格描述" align="center" prop="downPriceDescribe" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ruoyi:line:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ruoyi:line:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改线路信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="线路编号" prop="no">
          <el-input v-model="form.no" placeholder="请输入线路编号" />
        </el-form-item>
        <el-form-item label="线路名" prop="name">
          <el-input v-model="form.name" placeholder="请输入线路名" />
        </el-form-item>
        <el-form-item label="线路类型">
          <el-select v-model="form.typeId" placeholder="请选择线路类型">
              <el-option
                  v-for="dict in typeIdOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
              ></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="线路类型" prop="type">-->
<!--          <el-input v-model="form.type" placeholder="请输入线路类型" />-->
<!--        </el-form-item>-->
        <el-form-item label="起始站" prop="startStation">
          <el-input v-model="form.startStation" placeholder="请输入起始站" />
        </el-form-item>
        <el-form-item label="终点站" prop="endStation">
          <el-input v-model="form.endStation" placeholder="请输入终点站" />
        </el-form-item>
        <el-form-item label="所属公司">
          <el-select v-model="form.companyId" placeholder="请选择所属公司">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
<!--        <el-form-item label="所属公司" prop="companyName">-->
<!--          <el-input v-model="form.companyName" placeholder="请输入所属公司" />-->
<!--        </el-form-item>-->
        <el-form-item label="空驶里程数(单位/km)" prop="emptyDriveMileage">
          <el-input v-model="form.emptyDriveMileage" placeholder="请输入空驶里程数(单位/km)" />
        </el-form-item>
        <el-form-item label="日均趟次" prop="dayAverageNum">
          <el-input v-model="form.dayAverageNum" placeholder="请输入日均趟次" />
        </el-form-item>
        <el-form-item label="是否发送发班时间(0否 1是)">
          <el-radio-group v-model="form.isSendClassTime">
              <el-radio
                  v-for="dict in isSendClassTimeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
              >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否发送间隔报警">
          <el-radio-group v-model="form.isIntervalSendAlarm">
              <el-radio
                  v-for="dict in isIntervalSendAlarmOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
              >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否取消首末班补贴(0否 1是)">
          <el-radio-group v-model="form.isCancelSubsidy">
              <el-radio
                  v-for="dict in isCancelSubsidyOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
              >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上行夏令早班" prop="upSummerEarly">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.upSummerEarly"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择上行夏令早班">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上行夏令晚班" prop="upSummerLate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.upSummerLate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择上行夏令晚班">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上行起始站编号" prop="upStartStationNo">
          <el-input v-model="form.upStartStationNo" placeholder="请输入上行起始站编号" />
        </el-form-item>
        <el-form-item label="上行终点站编号" prop="upEndStationNo">
          <el-input v-model="form.upEndStationNo" placeholder="请输入上行终点站编号" />
        </el-form-item>
        <el-form-item label="上行冬令早班" prop="upWinterEarly">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.upWinterEarly"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择上行冬令早班">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上行冬令晚班" prop="upWinterLate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.upWinterLate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择上行冬令晚班">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上行大间隔站数" prop="upIntervalStationMax">
          <el-input v-model="form.upIntervalStationMax" placeholder="请输入上行大间隔站数" />
        </el-form-item>
        <el-form-item label="上行小间隔站数" prop="upIntervalStationMin">
          <el-input v-model="form.upIntervalStationMin" placeholder="请输入上行小间隔站数" />
        </el-form-item>
        <el-form-item label="上行里程数(单位/km)" prop="upMileages">
          <el-input v-model="form.upMileages" placeholder="请输入上行里程数(单位/km)" />
        </el-form-item>
        <el-form-item label="上行运行时间(单位/分钟)" prop="upRunTime">
          <el-input v-model="form.upRunTime" placeholder="请输入上行运行时间(单位/分钟)" />
        </el-form-item>
        <el-form-item label="上行排班计划编号" prop="upSchedulePlanNo">
          <el-input v-model="form.upSchedulePlanNo" placeholder="请输入上行排班计划编号" />
        </el-form-item>
        <el-form-item label="上行允许误差分钟数(单位/分钟)" prop="upAllowMistake">
          <el-input v-model="form.upAllowMistake" placeholder="请输入上行允许误差分钟数(单位/分钟)" />
        </el-form-item>
        <el-form-item label="上行价格描述" prop="upPriceDescribe">
          <el-input v-model="form.upPriceDescribe" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="下行夏令早班" prop="downSummerEarly">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.downSummerEarly"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择下行夏令早班">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下行夏令晚班" prop="downSummerLate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.downSummerLate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择下行夏令晚班">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下行起始站编号" prop="downStartStationNo">
          <el-input v-model="form.downStartStationNo" placeholder="请输入下行起始站编号" />
        </el-form-item>
        <el-form-item label="下行终点站编号" prop="downEndStationNo">
          <el-input v-model="form.downEndStationNo" placeholder="请输入下行终点站编号" />
        </el-form-item>
        <el-form-item label="下行冬令早班" prop="downWinterEarly">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.downWinterEarly"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择下行冬令早班">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下行冬令晚班" prop="downWinterLate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.downWinterLate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择下行冬令晚班">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下行大间隔站数" prop="downIntervalStationMax">
          <el-input v-model="form.downIntervalStationMax" placeholder="请输入下行大间隔站数" />
        </el-form-item>
        <el-form-item label="下行小间隔站数" prop="downIntervalStationMin">
          <el-input v-model="form.downIntervalStationMin" placeholder="请输入下行小间隔站数" />
        </el-form-item>
        <el-form-item label="下行里程数(单位/km)" prop="downMileages">
          <el-input v-model="form.downMileages" placeholder="请输入下行里程数(单位/km)" />
        </el-form-item>
        <el-form-item label="下行运行时间(单位/分钟)" prop="downRunTime">
          <el-input v-model="form.downRunTime" placeholder="请输入下行运行时间(单位/分钟)" />
        </el-form-item>
        <el-form-item label="下行排班计划编号" prop="downSchedulePlanNo">
          <el-input v-model="form.downSchedulePlanNo" placeholder="请输入下行排班计划编号" />
        </el-form-item>
        <el-form-item label="下行允许误差分钟数(单位/分钟)" prop="downAllowMistake">
          <el-input v-model="form.downAllowMistake" placeholder="请输入下行允许误差分钟数(单位/分钟)" />
        </el-form-item>
        <el-form-item label="下行价格描述" prop="downPriceDescribe">
          <el-input v-model="form.downPriceDescribe" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listLine, getLine, delLine, addLine, updateLine, exportLine } from "@/api/module/line";

export default {
  name: "Line",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 线路信息表格数据
      lineList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 线路类型id字典
      typeIdOptions: [],
      // 是否发送发班时间(0否 1是)字典
      isSendClassTimeOptions: [],
      // 是否发送间隔报警字典
      isIntervalSendAlarmOptions: [],
      // 是否取消首末班补贴(0否 1是)字典
      isCancelSubsidyOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        no: undefined,
        name: undefined,
        typeId: undefined,
        type: undefined,
        startStation: undefined,
        endStation: undefined,
        companyId: undefined,
        companyName: undefined,
        emptyDriveMileage: undefined,
        dayAverageNum: undefined,
        isSendClassTime: undefined,
        isIntervalSendAlarm: undefined,
        isCancelSubsidy: undefined,
        upSummerEarly: undefined,
        upSummerLate: undefined,
        upStartStationNo: undefined,
        upEndStationNo: undefined,
        upWinterEarly: undefined,
        upWinterLate: undefined,
        upIntervalStationMax: undefined,
        upIntervalStationMin: undefined,
        upMileages: undefined,
        upRunTime: undefined,
        upSchedulePlanNo: undefined,
        upAllowMistake: undefined,
        upPriceDescribe: undefined,
        downSummerEarly: undefined,
        downSummerLate: undefined,
        downStartStationNo: undefined,
        downEndStationNo: undefined,
        downWinterEarly: undefined,
        downWinterLate: undefined,
        downIntervalStationMax: undefined,
        downIntervalStationMin: undefined,
        downMileages: undefined,
        downRunTime: undefined,
        downSchedulePlanNo: undefined,
        downAllowMistake: undefined,
        downPriceDescribe: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("line_type").then(response => {
      this.typeIdOptions = response.data;
    });
    this.getDicts("sys_yes_no").then(response => {
      this.isSendClassTimeOptions = response.data;
    });
    this.getDicts("sys_yes_no").then(response => {
      this.isIntervalSendAlarmOptions = response.data;
    });
    this.getDicts("sys_yes_no").then(response => {
      this.isCancelSubsidyOptions = response.data;
    });
  },
  methods: {
    /** 查询线路信息列表 */
    getList() {
      this.loading = true;
      listLine(this.queryParams).then(response => {
        this.lineList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 线路类型id字典翻译
    typeIdFormat(row, column) {
      return this.selectDictLabel(this.typeIdOptions, row.typeId);
    },
    // 是否发送发班时间(0否 1是)字典翻译
    isSendClassTimeFormat(row, column) {
      return this.selectDictLabel(this.isSendClassTimeOptions, row.isSendClassTime);
    },
    // 是否发送间隔报警字典翻译
    isIntervalSendAlarmFormat(row, column) {
      return this.selectDictLabel(this.isIntervalSendAlarmOptions, row.isIntervalSendAlarm);
    },
    // 是否取消首末班补贴(0否 1是)字典翻译
    isCancelSubsidyFormat(row, column) {
      return this.selectDictLabel(this.isCancelSubsidyOptions, row.isCancelSubsidy);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        no: undefined,
        name: undefined,
        typeId: undefined,
        type: undefined,
        startStation: undefined,
        endStation: undefined,
        companyId: undefined,
        companyName: undefined,
        emptyDriveMileage: undefined,
        dayAverageNum: undefined,
        isSendClassTime: "0",
        isIntervalSendAlarm: "0",
        isCancelSubsidy: "0",
        upSummerEarly: undefined,
        upSummerLate: undefined,
        upStartStationNo: undefined,
        upEndStationNo: undefined,
        upWinterEarly: undefined,
        upWinterLate: undefined,
        upIntervalStationMax: undefined,
        upIntervalStationMin: undefined,
        upMileages: undefined,
        upRunTime: undefined,
        upSchedulePlanNo: undefined,
        upAllowMistake: undefined,
        upPriceDescribe: undefined,
        downSummerEarly: undefined,
        downSummerLate: undefined,
        downStartStationNo: undefined,
        downEndStationNo: undefined,
        downWinterEarly: undefined,
        downWinterLate: undefined,
        downIntervalStationMax: undefined,
        downIntervalStationMin: undefined,
        downMileages: undefined,
        downRunTime: undefined,
        downSchedulePlanNo: undefined,
        downAllowMistake: undefined,
        downPriceDescribe: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加线路信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getLine(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改线路信息";
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      updateLine(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                      addLine(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("新增成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  }
              }
          });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除线路信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delLine(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有线路信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportLine(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
