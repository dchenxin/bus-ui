<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="车牌号" prop="carNo">
        <el-input
          v-model="queryParams.carNo"
          placeholder="请输入车牌号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属公司" prop="companyId">
        <el-select v-model="queryParams.companyId" placeholder="请选择所属公司" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属线路" prop="lineId">
        <el-select v-model="queryParams.lineId" placeholder="请选择所属线路" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属车队" prop="fleetId">
        <el-select v-model="queryParams.fleetId" placeholder="请选择所属车队" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="车辆状态" prop="carStatusId">
        <el-select v-model="queryParams.carStatusId" placeholder="请选择车辆状态" clearable size="small">
          <el-option
            v-for="dict in carStatusIdOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="随车电话" prop="carTel">
        <el-input
          v-model="queryParams.carTel"
          placeholder="请输入随车电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['ruoyi:car:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ruoyi:car:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['ruoyi:car:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ruoyi:car:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="carList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="车牌号" align="center" prop="carNo" />
      <el-table-column label="车牌颜色" align="center" prop="carColor" />
      <el-table-column label="车身颜色" align="center" prop="carBodyColor" />
      <el-table-column label="购买日期" align="center" prop="buyDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.buyDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发动机功率(单位/kw)" align="center" prop="enginePower" />
      <el-table-column label="车辆型号" align="center" prop="carModel" />
<!--      <el-table-column label="燃油类型" align="center" prop="fuelType" />-->
      <el-table-column label="燃油类型" align="center" prop="fuelTypeId" :formatter="fuelTypeIdFormat" />
      <el-table-column label="车架号" align="center" prop="frameNo" />
      <el-table-column label="座位数" align="center" prop="seats" />
      <el-table-column label="核载数" align="center" prop="realLoadNum" />
      <el-table-column label="发动机排量" align="center" prop="engineDisplacementId" :formatter="engineDisplacementIdFormat" />
<!--      <el-table-column label="发动机排量" align="center" prop="engineDisplacement" />-->
      <el-table-column label="生产商" align="center" prop="producer" />
      <el-table-column label="车辆长度(单位/米)" align="center" prop="carLength" />
      <el-table-column label="驱动型号" align="center" prop="driveModelId" :formatter="driveModelIdFormat" />
<!--      <el-table-column label="驱动型号" align="center" prop="driveModel" />-->
      <el-table-column label="出厂日期" align="center" prop="produceDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.produceDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="变速器类型" align="center" prop="transmissionTypeId" :formatter="transmissionTypeIdFormat" />
<!--      <el-table-column label="变速器类型" align="center" prop="transmissionType" />-->
      <el-table-column label="发动机编号" align="center" prop="engineNo" />
      <el-table-column label="价格(单位/万)" align="center" prop="price" />
      <el-table-column label="注册地" align="center" prop="registerPlace" />
      <el-table-column label="是否双层" align="center" prop="isBilayer" :formatter="isBilayerFormat" />
      <el-table-column label="是否空调车" align="center" prop="isAircondition" :formatter="isAirconditionFormat" />
      <el-table-column label="道路运输编号" align="center" prop="roadTransportNo" />
      <el-table-column label="所属公司id" align="center" prop="companyId" />
<!--      <el-table-column label="所属公司名称" align="center" prop="companyName" />-->
      <el-table-column label="所属线路" align="center" prop="lineId" />
<!--      <el-table-column label="所属线路名称" align="center" prop="lineName" />-->
      <el-table-column label="所属车队" align="center" prop="fleetId" />
<!--      <el-table-column label="所属车队名" align="center" prop="fleetName" />-->
      <el-table-column label="车辆状态" align="center" prop="carStatusId" :formatter="carStatusIdFormat" />
<!--      <el-table-column label="车辆状态" align="center" prop="carStatus" />-->
      <el-table-column label="随车电话" align="center" prop="carTel" />
      <el-table-column label="上牌日期" align="center" prop="registrationDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.registrationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报废日期" align="center" prop="cancelDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.cancelDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="超速预报值" align="center" prop="speedPrediction" />
      <el-table-column label="超速值" align="center" prop="speed" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ruoyi:car:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ruoyi:car:remove']"
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

    <!-- 添加或修改车辆信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="车牌号" prop="carNo">
          <el-input v-model="form.carNo" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="车牌颜色" prop="carColor">
          <el-input v-model="form.carColor" placeholder="请输入车牌颜色" />
        </el-form-item>
        <el-form-item label="车身颜色" prop="carBodyColor">
          <el-input v-model="form.carBodyColor" placeholder="请输入车身颜色" />
        </el-form-item>
        <el-form-item label="购买日期" prop="buyDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.buyDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择购买日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发动机功率(单位/kw)" prop="enginePower">
          <el-input v-model="form.enginePower" placeholder="请输入发动机功率(单位/kw)" />
        </el-form-item>
        <el-form-item label="车辆型号" prop="carModel">
          <el-input v-model="form.carModel" placeholder="请输入车辆型号" />
        </el-form-item>
<!--        <el-form-item label="燃油类型" prop="fuelType">-->
<!--          <el-input v-model="form.fuelType" placeholder="请输入燃油类型" />-->
<!--        </el-form-item>-->
        <el-form-item label="燃油类型">
          <el-select v-model="form.fuelTypeId" placeholder="请选择燃油类型">
              <el-option
                  v-for="dict in fuelTypeIdOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车架号" prop="frameNo">
          <el-input v-model="form.frameNo" placeholder="请输入车架号" />
        </el-form-item>
        <el-form-item label="座位数" prop="seats">
          <el-input v-model="form.seats" placeholder="请输入座位数" />
        </el-form-item>
        <el-form-item label="核载数" prop="realLoadNum">
          <el-input v-model="form.realLoadNum" placeholder="请输入核载数" />
        </el-form-item>
        <el-form-item label="发动机排量">
          <el-select v-model="form.engineDisplacementId" placeholder="请选择发动机排量">
              <el-option
                  v-for="dict in engineDisplacementIdOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
              ></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="发动机排量" prop="engineDisplacement">-->
<!--          <el-input v-model="form.engineDisplacement" placeholder="请输入发动机排量" />-->
<!--        </el-form-item>-->
        <el-form-item label="生产商" prop="producer">
          <el-input v-model="form.producer" placeholder="请输入生产商" />
        </el-form-item>
        <el-form-item label="车辆长度(单位/米)" prop="carLength">
          <el-input v-model="form.carLength" placeholder="请输入车辆长度(单位/米)" />
        </el-form-item>
        <el-form-item label="驱动型号">
          <el-select v-model="form.driveModelId" placeholder="请选择驱动型号">
              <el-option
                  v-for="dict in driveModelIdOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
              ></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="驱动型号" prop="driveModel">-->
<!--          <el-input v-model="form.driveModel" placeholder="请输入驱动型号" />-->
<!--        </el-form-item>-->
        <el-form-item label="出厂日期" prop="produceDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.produceDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择出厂日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="变速器类型">
          <el-select v-model="form.transmissionTypeId" placeholder="请选择变速器类型">
              <el-option
                  v-for="dict in transmissionTypeIdOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
              ></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="变速器类型" prop="transmissionType">-->
<!--          <el-input v-model="form.transmissionType" placeholder="请输入变速器类型" />-->
<!--        </el-form-item>-->
        <el-form-item label="发动机编号" prop="engineNo">
          <el-input v-model="form.engineNo" placeholder="请输入发动机编号" />
        </el-form-item>
        <el-form-item label="价格(单位/万)" prop="price">
          <el-input v-model="form.price" placeholder="请输入价格(单位/万)" />
        </el-form-item>
        <el-form-item label="注册地" prop="registerPlace">
          <el-input v-model="form.registerPlace" placeholder="请输入注册地" />
        </el-form-item>
        <el-form-item label="是否双层">
          <el-radio-group v-model="form.isBilayer">
              <el-radio
                  v-for="dict in isBilayerOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
              >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否空调车">
          <el-radio-group v-model="form.isAircondition">
              <el-radio
                  v-for="dict in isAirconditionOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
              >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="道路运输编号" prop="roadTransportNo">
          <el-input v-model="form.roadTransportNo" placeholder="请输入道路运输编号" />
        </el-form-item>
        <el-form-item label="所属公司">
          <el-select v-model="form.companyId" placeholder="请选择所属公司">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
<!--        <el-form-item label="所属公司名称" prop="companyName">-->
<!--          <el-input v-model="form.companyName" placeholder="请输入所属公司名称" />-->
<!--        </el-form-item>-->
        <el-form-item label="所属线路">
          <el-select v-model="form.lineId" placeholder="请选择所属线路">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
<!--        <el-form-item label="所属线路名称" prop="lineName">-->
<!--          <el-input v-model="form.lineName" placeholder="请输入所属线路名称" />-->
<!--        </el-form-item>-->
        <el-form-item label="所属车队">
          <el-select v-model="form.fleetId" placeholder="请选择所属车队">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
<!--        <el-form-item label="所属车队名" prop="fleetName">-->
<!--          <el-input v-model="form.fleetName" placeholder="请输入所属车队名" />-->
<!--        </el-form-item>-->
        <el-form-item label="车辆状态">
          <el-select v-model="form.carStatusId" placeholder="请选择车辆状态">
              <el-option
                  v-for="dict in carStatusIdOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
              ></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="车辆状态" prop="carStatus">-->
<!--          <el-input v-model="form.carStatus" placeholder="请输入车辆状态" />-->
<!--        </el-form-item>-->
        <el-form-item label="随车电话" prop="carTel">
          <el-input v-model="form.carTel" placeholder="请输入随车电话" />
        </el-form-item>
        <el-form-item label="上牌日期" prop="registrationDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.registrationDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择上牌日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报废日期" prop="cancelDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.cancelDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择报废日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="超速预报值" prop="speedPrediction">
          <el-input v-model="form.speedPrediction" placeholder="请输入超速预报值" />
        </el-form-item>
        <el-form-item label="超速值" prop="speed">
          <el-input v-model="form.speed" placeholder="请输入超速值" />
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
import { listCar, getCar, delCar, addCar, updateCar, exportCar } from "@/api/module/car";

export default {
  name: "Car",
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
      // 车辆信息表格数据
      carList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 燃油类型id字典
      fuelTypeIdOptions: [],
      // 发动机排量id字典
      engineDisplacementIdOptions: [],
      // 驱动型号id字典
      driveModelIdOptions: [],
      // 变速器类型id字典
      transmissionTypeIdOptions: [],
      // 是否双层字典
      isBilayerOptions: [],
      // 是否空调车字典
      isAirconditionOptions: [],
      // 车辆状态id字典
      carStatusIdOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        carNo: undefined,
        carColor: undefined,
        carBodyColor: undefined,
        buyDate: undefined,
        enginePower: undefined,
        carModel: undefined,
        fuelType: undefined,
        fuelTypeId: undefined,
        frameNo: undefined,
        seats: undefined,
        realLoadNum: undefined,
        engineDisplacementId: undefined,
        engineDisplacement: undefined,
        producer: undefined,
        carLength: undefined,
        driveModelId: undefined,
        driveModel: undefined,
        produceDate: undefined,
        transmissionTypeId: undefined,
        transmissionType: undefined,
        engineNo: undefined,
        price: undefined,
        registerPlace: undefined,
        isBilayer: undefined,
        isAircondition: undefined,
        roadTransportNo: undefined,
        companyId: undefined,
        companyName: undefined,
        lineId: undefined,
        lineName: undefined,
        fleetId: undefined,
        fleetName: undefined,
        carStatusId: undefined,
        carStatus: undefined,
        carTel: undefined,
        registrationDate: undefined,
        cancelDate: undefined,
        speedPrediction: undefined,
        speed: undefined,
        remark: undefined
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
    this.getDicts("fuel_type").then(response => {
      this.fuelTypeIdOptions = response.data;
    });
    this.getDicts("engine_displacement").then(response => {
      this.engineDisplacementIdOptions = response.data;
    });
    this.getDicts("drive_model").then(response => {
      this.driveModelIdOptions = response.data;
    });
    this.getDicts("transmission_type").then(response => {
      this.transmissionTypeIdOptions = response.data;
    });
    this.getDicts("sys_yes_no").then(response => {
      this.isBilayerOptions = response.data;
    });
    this.getDicts("sys_yes_no").then(response => {
      this.isAirconditionOptions = response.data;
    });
    this.getDicts("car_status").then(response => {
      this.carStatusIdOptions = response.data;
    });
  },
  methods: {
    /** 查询车辆信息列表 */
    getList() {
      this.loading = true;
      listCar(this.queryParams).then(response => {
        this.carList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 燃油类型id字典翻译
    fuelTypeIdFormat(row, column) {
      return this.selectDictLabel(this.fuelTypeIdOptions, row.fuelTypeId);
    },
    // 发动机排量id字典翻译
    engineDisplacementIdFormat(row, column) {
      return this.selectDictLabel(this.engineDisplacementIdOptions, row.engineDisplacementId);
    },
    // 驱动型号id字典翻译
    driveModelIdFormat(row, column) {
      return this.selectDictLabel(this.driveModelIdOptions, row.driveModelId);
    },
    // 变速器类型id字典翻译
    transmissionTypeIdFormat(row, column) {
      return this.selectDictLabel(this.transmissionTypeIdOptions, row.transmissionTypeId);
    },
    // 是否双层字典翻译
    isBilayerFormat(row, column) {
      return this.selectDictLabel(this.isBilayerOptions, row.isBilayer);
    },
    // 是否空调车字典翻译
    isAirconditionFormat(row, column) {
      return this.selectDictLabel(this.isAirconditionOptions, row.isAircondition);
    },
    // 车辆状态id字典翻译
    carStatusIdFormat(row, column) {
      return this.selectDictLabel(this.carStatusIdOptions, row.carStatusId);
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
        carNo: undefined,
        carColor: undefined,
        carBodyColor: undefined,
        buyDate: undefined,
        enginePower: undefined,
        carModel: undefined,
        fuelType: undefined,
        fuelTypeId: undefined,
        frameNo: undefined,
        seats: undefined,
        realLoadNum: undefined,
        engineDisplacementId: undefined,
        engineDisplacement: undefined,
        producer: undefined,
        carLength: undefined,
        driveModelId: undefined,
        driveModel: undefined,
        produceDate: undefined,
        transmissionTypeId: undefined,
        transmissionType: undefined,
        engineNo: undefined,
        price: undefined,
        registerPlace: undefined,
        isBilayer: "0",
        isAircondition: "0",
        roadTransportNo: undefined,
        companyId: undefined,
        companyName: undefined,
        lineId: undefined,
        lineName: undefined,
        fleetId: undefined,
        fleetName: undefined,
        carStatusId: undefined,
        carStatus: undefined,
        carTel: undefined,
        registrationDate: undefined,
        cancelDate: undefined,
        speedPrediction: undefined,
        speed: undefined,
        remark: undefined
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
      this.title = "添加车辆信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCar(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改车辆信息";
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      updateCar(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                      addCar(this.form).then(response => {
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
      this.$confirm('是否确认删除车辆信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCar(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有车辆信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCar(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
