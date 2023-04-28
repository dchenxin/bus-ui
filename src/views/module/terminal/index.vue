<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="终端号" prop="terminalNo">
        <el-input
          v-model="queryParams.terminalNo"
          placeholder="请输入终端号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌号" prop="carNo">
        <el-input
          v-model="queryParams.carNo"
          placeholder="请输入车牌号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="sim卡号" prop="simNo">
        <el-input
          v-model="queryParams.simNo"
          placeholder="请输入sim卡号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="sim类型" prop="simType">
        <el-select v-model="queryParams.simType" placeholder="请选择sim类型" clearable size="small">
          <el-option
            v-for="dict in simTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="终端型号" prop="terminalType">
        <el-select v-model="queryParams.terminalType" placeholder="请选择终端型号" clearable size="small">
          <el-option
            v-for="dict in terminalTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属线路" prop="lineId">
        <el-select v-model="queryParams.lineId" placeholder="请选择所属线路" clearable size="small">
          <el-option label="请选择字典生成" value="" />
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
          v-hasPermi="['ruoyi:terminal:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ruoyi:terminal:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['ruoyi:terminal:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ruoyi:terminal:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="terminalList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="终端号" align="center" prop="terminalNo" />
      <el-table-column label="车牌号" align="center" prop="carNo" />
      <el-table-column label="sim卡号" align="center" prop="simNo" />
      <el-table-column label="sim密码" align="center" prop="simPassword" />
      <el-table-column label="sim类型" align="center" prop="simType" :formatter="simTypeFormat" />
      <el-table-column label="终端型号" align="center" prop="terminalType" :formatter="terminalTypeFormat" />
      <el-table-column label="终端厂家" align="center" prop="terminalFactory" />
      <el-table-column label="所属线路" align="center" prop="lineId" />
      <el-table-column label="所属公司" align="center" prop="companyId" />
      <el-table-column label="3G终端号" align="center" prop="threeNo" />
      <el-table-column label="3G设备厂家" align="center" prop="threeFactory" />
      <el-table-column label="3G设备SIM卡号" align="center" prop="threeSimNo" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ruoyi:terminal:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ruoyi:terminal:remove']"
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

    <!-- 添加或修改终端信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="终端号" prop="terminalNo">
          <el-input v-model="form.terminalNo" placeholder="请输入终端号" />
        </el-form-item>
        <el-form-item label="车牌号" prop="carNo">
          <el-input v-model="form.carNo" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="sim卡号" prop="simNo">
          <el-input v-model="form.simNo" placeholder="请输入sim卡号" />
        </el-form-item>
        <el-form-item label="sim密码" prop="simPassword">
          <el-input v-model="form.simPassword" placeholder="请输入sim密码" />
        </el-form-item>
        <el-form-item label="sim类型">
          <el-select v-model="form.simType" placeholder="请选择sim类型">
              <el-option
                  v-for="dict in simTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终端型号">
          <el-select v-model="form.terminalType" placeholder="请选择终端型号">
              <el-option
                  v-for="dict in terminalTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终端厂家" prop="terminalFactory">
          <el-input v-model="form.terminalFactory" placeholder="请输入终端厂家" />
        </el-form-item>
        <el-form-item label="所属线路">
          <el-select v-model="form.lineId" placeholder="请选择所属线路">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属公司">
          <el-select v-model="form.companyId" placeholder="请选择所属公司">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="3G终端号" prop="threeNo">
          <el-input v-model="form.threeNo" placeholder="请输入3G终端号" />
        </el-form-item>
        <el-form-item label="3G设备厂家" prop="threeFactory">
          <el-input v-model="form.threeFactory" placeholder="请输入3G设备厂家" />
        </el-form-item>
        <el-form-item label="3G设备SIM卡号" prop="threeSimNo">
          <el-input v-model="form.threeSimNo" placeholder="请输入3G设备SIM卡号" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" />
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
import { listTerminal, getTerminal, delTerminal, addTerminal, updateTerminal, exportTerminal } from "@/api/module/terminal";

export default {
  name: "Terminal",
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
      // 终端信息表格数据
      terminalList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // sim类型字典
      simTypeOptions: [],
      // 终端型号字典
      terminalTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        terminalNo: undefined,
        carNo: undefined,
        simNo: undefined,
        simPassword: undefined,
        simType: undefined,
        terminalType: undefined,
        terminalFactory: undefined,
        lineId: undefined,
        lineName: undefined,
        companyId: undefined,
        companyName: undefined,
        remark: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
        delFlag: undefined
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
    this.getDicts("sim_type").then(response => {
      this.simTypeOptions = response.data;
    });
    this.getDicts("terminal_type").then(response => {
      this.terminalTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询终端信息列表 */
    getList() {
      this.loading = true;
      listTerminal(this.queryParams).then(response => {
        this.terminalList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // sim类型字典翻译
    simTypeFormat(row, column) {
      return this.selectDictLabel(this.simTypeOptions, row.simType);
    },
    // 终端型号字典翻译
    terminalTypeFormat(row, column) {
      return this.selectDictLabel(this.terminalTypeOptions, row.terminalType);
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
        terminalNo: undefined,
        carNo: undefined,
        simNo: undefined,
        simPassword: undefined,
        simType: undefined,
        terminalType: undefined,
        terminalFactory: undefined,
        lineId: undefined,
        lineName: undefined,
        companyId: undefined,
        companyName: undefined,
        threeNo: undefined,
        threeFactory: undefined,
        threeSimNo: undefined,
        remark: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
        delFlag: undefined
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
      this.title = "添加终端信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTerminal(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改终端信息";
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      updateTerminal(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                      addTerminal(this.form).then(response => {
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
      this.$confirm('是否确认删除终端信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTerminal(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有终端信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTerminal(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
