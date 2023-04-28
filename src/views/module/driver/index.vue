<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="128px">
      <el-form-item label="所属公司" prop="companyId">
        <el-select v-model="queryParams.companyId" placeholder="请选择所属公司" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard">
        <el-input
          v-model="queryParams.idCard"
          placeholder="请输入身份证号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="驾驶证号" prop="driveNo">
        <el-input
          v-model="queryParams.driveNo"
          placeholder="请输入驾驶证号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="tel">
        <el-input
          v-model="queryParams.tel"
          placeholder="请输入联系电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属线路" prop="lineId">
        <el-select v-model="queryParams.lineId" placeholder="请选择所属线路" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="车牌号" prop="carNumber">
        <el-input
          v-model="queryParams.carNumber"
          placeholder="请输入车牌号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车辆类型" prop="vehicleType">
        <el-select v-model="queryParams.vehicleType" placeholder="请选择车辆类型" clearable size="small">
          <el-option
            v-for="dict in vehicleTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
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
          v-hasPermi="['ruoyi:driver:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ruoyi:driver:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['ruoyi:driver:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ruoyi:driver:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="driverList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属公司" align="center" prop="companyId" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="档案号" align="center" prop="fileNo" />
      <el-table-column label="身份证号" align="center" prop="idCard" />
      <el-table-column label="驾驶证类型" align="center" prop="driveTypeId" :formatter="driveTypeIdFormat" />
      <el-table-column label="驾驶证号" align="center" prop="driveNo" />
      <el-table-column label="出生年月" align="center" prop="birthday" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.birthday, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="籍贯" align="center" prop="nativePlace" />
      <el-table-column label="联系地址" align="center" prop="address" />
      <el-table-column label="联系电话" align="center" prop="tel" />
      <el-table-column label="学历" align="center" prop="education" :formatter="educationFormat" />
      <el-table-column label="婚姻状况" align="center" prop="isMarry" />
      <el-table-column label="性别" align="center" prop="sex" :formatter="sexFormat" />
      <el-table-column label="初次领证时间" align="center" prop="firstCertificateDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.firstCertificateDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="驾驶有效起始日期" align="center" prop="driveEffectiveStartDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.driveEffectiveStartDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="驾驶有效终止日期" align="center" prop="driveEffectiveEndDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.driveEffectiveEndDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="驾驶员归属地" align="center" prop="driveBelong" />
      <el-table-column label="运输类型" align="center" prop="transportType" />
      <el-table-column label="运输性质" align="center" prop="transportNature" />
      <el-table-column label="从业资格证url" align="center" prop="qualificationCertificate" />
      <el-table-column label="从业资格有效起始日期" align="center" prop="qualificationCertificateStartDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.qualificationCertificateStartDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="从业资格有效终止日期" align="center" prop="qualificationCertificateEndDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.qualificationCertificateEndDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内部上岗证url" align="center" prop="workLicense" />
      <el-table-column label="内部上岗有效起始日期" align="center" prop="workLicenseStartDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.workLicenseStartDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内部上岗有效终止日期" align="center" prop="workLicenseEndDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.workLicenseEndDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属线路" align="center" prop="lineId" />
      <el-table-column label="在岗状态" align="center" prop="onDutyStatus" :formatter="onDutyStatusFormat" />
      <el-table-column label="车牌号" align="center" prop="carNumber" />
      <el-table-column label="车辆类型" align="center" prop="vehicleType" :formatter="vehicleTypeFormat" />
      <el-table-column label="所属班别" align="center" prop="classId" />
      <el-table-column label="是否停驶" align="center" prop="isStop" :formatter="isStopFormat" />
      <el-table-column label="是否黑名单" align="center" prop="isBlack" :formatter="isBlackFormat" />
      <el-table-column label="安全知识情况" align="center" prop="safetyKnowledgeSituation" />
      <el-table-column label="考核情况" align="center" prop="examineSituation" />
      <el-table-column label="历史记录" align="center" prop="history" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ruoyi:driver:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ruoyi:driver:remove']"
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

    <!-- 添加或修改驾驶员信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="所属公司">
          <el-select v-model="form.companyId" placeholder="请选择所属公司">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
<!--        <el-form-item label="所属公司名" prop="companyName">-->
<!--          <el-input v-model="form.companyName" placeholder="请输入所属公司名" />-->
<!--        </el-form-item>-->
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="档案号" prop="fileNo">
          <el-input v-model="form.fileNo" placeholder="请输入档案号" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" placeholder="请输入身份证号" />
        </el-form-item>
<!--        <el-form-item label="驾驶证类型" prop="driveType">-->
<!--          <el-input v-model="form.driveType" placeholder="请输入驾驶证类型" />-->
<!--        </el-form-item>-->
        <el-form-item label="驾驶证类型">
          <el-select v-model="form.driveTypeId" placeholder="请选择驾驶证类型ID">
              <el-option
                  v-for="dict in driveTypeIdOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="驾驶证号" prop="driveNo">
          <el-input v-model="form.driveNo" placeholder="请输入驾驶证号" />
        </el-form-item>
        <el-form-item label="出生年月" prop="birthday">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.birthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择出生年月">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="籍贯" prop="nativePlace">
          <el-input v-model="form.nativePlace" placeholder="请输入籍贯" />
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入联系地址" />
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="学历" prop="education">
          <el-input v-model="form.education" placeholder="请输入学历" />
        </el-form-item>
        <el-form-item label="婚姻状况" prop="isMarry">
          <el-input v-model="form.isMarry" placeholder="请输入婚姻状况" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.sex" placeholder="请选择性别(0男 1女)">
              <el-option
                  v-for="dict in sexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="初次领证时间" prop="firstCertificateDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.firstCertificateDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择初次领证时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="驾驶有效起始日期" prop="driveEffectiveStartDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.driveEffectiveStartDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择驾驶有效起始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="驾驶有效终止日期" prop="driveEffectiveEndDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.driveEffectiveEndDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择驾驶有效终止日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="驾驶员归属地" prop="driveBelong">
          <el-input v-model="form.driveBelong" placeholder="请输入驾驶员归属地" />
        </el-form-item>
        <el-form-item label="运输类型" prop="transportType">
          <el-input v-model="form.transportType" placeholder="请输入运输类型" />
        </el-form-item>
        <el-form-item label="运输性质" prop="transportNature">
          <el-input v-model="form.transportNature" placeholder="请输入运输性质" />
        </el-form-item>
        <el-form-item label="从业资格证url" prop="qualificationCertificate">
          <el-input v-model="form.qualificationCertificate" placeholder="请输入从业资格证url" />
        </el-form-item>
        <el-form-item label="从业资格有效起始日期" prop="qualificationCertificateStartDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.qualificationCertificateStartDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择从业资格有效起始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="从业资格有效终止日期" prop="qualificationCertificateEndDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.qualificationCertificateEndDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择从业资格有效终止日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="内部上岗证url" prop="workLicense">
          <el-input v-model="form.workLicense" placeholder="请输入内部上岗证url" />
        </el-form-item>
        <el-form-item label="内部上岗有效起始日期" prop="workLicenseStartDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.workLicenseStartDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择内部上岗有效起始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="内部上岗有效终止日期" prop="workLicenseEndDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.workLicenseEndDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择内部上岗有效终止日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属线路">
          <el-select v-model="form.lineId" placeholder="请选择所属线路">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
<!--        <el-form-item label="所属线路名称" prop="lineName">-->
<!--          <el-input v-model="form.lineName" placeholder="请输入所属线路名称" />-->
<!--        </el-form-item>-->
        <el-form-item label="在岗状态">
          <el-select v-model="form.onDutyStatus" placeholder="请选择在岗状态">
              <el-option
                  v-for="dict in onDutyStatusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号" prop="carNumber">
          <el-input v-model="form.carNumber" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="车辆类型">
          <el-select v-model="form.vehicleType" placeholder="请选择车辆类型">
              <el-option
                  v-for="dict in vehicleTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属班别">
          <el-select v-model="form.classId" placeholder="请选择所属班别id">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
<!--        <el-form-item label="班别名" prop="className">-->
<!--          <el-input v-model="form.className" placeholder="请输入班别名" />-->
<!--        </el-form-item>-->
        <el-form-item label="是否停驶">
          <el-radio-group v-model="form.isStop">
              <el-radio
                  v-for="dict in isStopOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
              >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否黑名单">
          <el-radio-group v-model="form.isBlack">
              <el-radio
                  v-for="dict in isBlackOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
              >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="安全知识情况" prop="safetyKnowledgeSituation">
          <el-input v-model="form.safetyKnowledgeSituation" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="考核情况" prop="examineSituation">
          <el-input v-model="form.examineSituation" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="历史记录" prop="history">
          <el-input v-model="form.history" type="textarea" placeholder="请输入内容" />
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
import { listDriver, getDriver, delDriver, addDriver, updateDriver, exportDriver } from "@/api/module/driver";

export default {
  name: "Driver",
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
      // 驾驶员信息表格数据
      driverList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 驾驶证类型ID字典
      driveTypeIdOptions: [],
      // 学历字典
      educationOptions: [],
      // 性别(0男 1女)字典
      sexOptions: [],
      // 在岗状态字典
      onDutyStatusOptions: [],
      // 车辆类型字典
      vehicleTypeOptions: [],
      // 是否停驶字典
      isStopOptions: [],
      // 是否黑名单字典
      isBlackOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyId: undefined,
        companyName: undefined,
        name: undefined,
        fileNo: undefined,
        idCard: undefined,
        driveType: undefined,
        driveTypeId: undefined,
        driveNo: undefined,
        birthday: undefined,
        nativePlace: undefined,
        address: undefined,
        tel: undefined,
        education: undefined,
        isMarry: undefined,
        sex: undefined,
        firstCertificateDate: undefined,
        driveEffectiveStartDate: undefined,
        driveEffectiveEndDate: undefined,
        driveBelong: undefined,
        transportType: undefined,
        transportNature: undefined,
        qualificationCertificate: undefined,
        qualificationCertificateStartDate: undefined,
        qualificationCertificateEndDate: undefined,
        workLicense: undefined,
        workLicenseStartDate: undefined,
        workLicenseEndDate: undefined,
        lineId: undefined,
        lineName: undefined,
        onDutyStatus: undefined,
        carNumber: undefined,
        vehicleType: undefined,
        classId: undefined,
        className: undefined,
        isStop: undefined,
        isBlack: undefined,
        safetyKnowledgeSituation: undefined,
        examineSituation: undefined,
        history: undefined
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
    this.getDicts("drive_type").then(response => {
      this.driveTypeIdOptions = response.data;
    });
    this.getDicts("education").then(response => {
      this.educationOptions = response.data;
    });
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    this.getDicts("on_duty_status").then(response => {
      this.onDutyStatusOptions = response.data;
    });
    this.getDicts("car_type").then(response => {
      this.vehicleTypeOptions = response.data;
    });
    this.getDicts("sys_yes_no").then(response => {
      this.isStopOptions = response.data;
    });
    this.getDicts("sys_yes_no").then(response => {
      this.isBlackOptions = response.data;
    });
  },
  methods: {
    /** 查询驾驶员信息列表 */
    getList() {
      this.loading = true;
      listDriver(this.queryParams).then(response => {
        this.driverList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 驾驶证类型ID字典翻译
    driveTypeIdFormat(row, column) {
      return this.selectDictLabel(this.driveTypeIdOptions, row.driveTypeId);
    },
    // 学历字典翻译
    educationFormat(row, column) {
      return this.selectDictLabel(this.educationOptions, row.education);
    },
    // 性别(0男 1女)字典翻译
    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.sex);
    },
    // 在岗状态字典翻译
    onDutyStatusFormat(row, column) {
      return this.selectDictLabel(this.onDutyStatusOptions, row.onDutyStatus);
    },
    // 车辆类型字典翻译
    vehicleTypeFormat(row, column) {
      return this.selectDictLabel(this.vehicleTypeOptions, row.vehicleType);
    },
    // 是否停驶字典翻译
    isStopFormat(row, column) {
      return this.selectDictLabel(this.isStopOptions, row.isStop);
    },
    // 是否黑名单字典翻译
    isBlackFormat(row, column) {
      return this.selectDictLabel(this.isBlackOptions, row.isBlack);
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
        companyId: undefined,
        companyName: undefined,
        name: undefined,
        fileNo: undefined,
        idCard: undefined,
        driveType: undefined,
        driveTypeId: undefined,
        driveNo: undefined,
        birthday: undefined,
        nativePlace: undefined,
        address: undefined,
        tel: undefined,
        education: undefined,
        isMarry: undefined,
        sex: undefined,
        firstCertificateDate: undefined,
        driveEffectiveStartDate: undefined,
        driveEffectiveEndDate: undefined,
        driveBelong: undefined,
        transportType: undefined,
        transportNature: undefined,
        qualificationCertificate: undefined,
        qualificationCertificateStartDate: undefined,
        qualificationCertificateEndDate: undefined,
        workLicense: undefined,
        workLicenseStartDate: undefined,
        workLicenseEndDate: undefined,
        lineId: undefined,
        lineName: undefined,
        onDutyStatus: undefined,
        carNumber: undefined,
        vehicleType: undefined,
        classId: undefined,
        className: undefined,
        isStop: "0",
        isBlack: "0",
        safetyKnowledgeSituation: undefined,
        examineSituation: undefined,
        history: undefined
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
      this.title = "添加驾驶员信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDriver(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改驾驶员信息";
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      updateDriver(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                      addDriver(this.form).then(response => {
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
      this.$confirm('是否确认删除驾驶员信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDriver(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有驾驶员信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDriver(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
