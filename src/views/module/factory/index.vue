<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="厂家名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入厂家名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="contact">
        <el-input
          v-model="queryParams.contact"
          placeholder="请输入联系方式"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="厂家地址" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入厂家地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="企业编号" prop="enterpriseNo">
        <el-input
          v-model="queryParams.enterpriseNo"
          placeholder="请输入企业编号"
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
          v-hasPermi="['ruoyi:factory:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ruoyi:factory:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['ruoyi:factory:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ruoyi:factory:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="factoryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="厂家名称" align="center" prop="name" />
      <el-table-column label="联系方式" align="center" prop="contact" />
      <el-table-column label="厂家地址" align="center" prop="address" />
      <el-table-column label="企业编号" align="center" prop="enterpriseNo" />
      <el-table-column label="服务器地址" align="center" prop="serveAdress" />
      <el-table-column label="服务器端口" align="center" prop="servePort" />
      <el-table-column label="内网服务器地址" align="center" prop="intranetServeAdress" />
      <el-table-column label="内网服务器端口" align="center" prop="intranetServePort" />
      <el-table-column label="是否通过网闸" align="center" prop="isGatekeeper" :formatter="isGatekeeperFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ruoyi:factory:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ruoyi:factory:remove']"
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

    <!-- 添加或修改设备厂商信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="厂家名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入厂家名称" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="厂家地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入厂家地址" />
        </el-form-item>
        <el-form-item label="企业编号" prop="enterpriseNo">
          <el-input v-model="form.enterpriseNo" placeholder="请输入企业编号" />
        </el-form-item>
        <el-form-item label="服务器地址" prop="serveAdress">
          <el-input v-model="form.serveAdress" placeholder="请输入服务器地址" />
        </el-form-item>
        <el-form-item label="服务器端口" prop="servePort">
          <el-input v-model="form.servePort" placeholder="请输入服务器端口" />
        </el-form-item>
        <el-form-item label="内网服务器地址" prop="intranetServeAdress">
          <el-input v-model="form.intranetServeAdress" placeholder="请输入内网服务器地址" />
        </el-form-item>
        <el-form-item label="内网服务器端口" prop="intranetServePort">
          <el-input v-model="form.intranetServePort" placeholder="请输入内网服务器端口" />
        </el-form-item>
        <el-form-item label="是否通过网闸">
          <el-radio-group v-model="form.isGatekeeper">
              <el-radio
                  v-for="dict in isGatekeeperOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
              >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
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
import { listFactory, getFactory, delFactory, addFactory, updateFactory, exportFactory } from "@/api/module/factory";

export default {
  name: "Factory",
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
      // 设备厂商信息表格数据
      factoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否通过网闸(0否 1是)字典
      isGatekeeperOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        contact: undefined,
        address: undefined,
        enterpriseNo: undefined,
        serveAdress: undefined,
        servePort: undefined,
        intranetServeAdress: undefined,
        intranetServePort: undefined,
        isGatekeeper: undefined
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
    this.getDicts("sys_yes_no").then(response => {
      this.isGatekeeperOptions = response.data;
    });
  },
  methods: {
    /** 查询设备厂商信息列表 */
    getList() {
      this.loading = true;
      listFactory(this.queryParams).then(response => {
        this.factoryList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 是否通过网闸(0否 1是)字典翻译
    isGatekeeperFormat(row, column) {
      return this.selectDictLabel(this.isGatekeeperOptions, row.isGatekeeper);
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
        name: undefined,
        contact: undefined,
        address: undefined,
        enterpriseNo: undefined,
        serveAdress: undefined,
        servePort: undefined,
        intranetServeAdress: undefined,
        intranetServePort: undefined,
        isGatekeeper: "0"
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
      this.title = "添加设备厂商信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFactory(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备厂商信息";
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      updateFactory(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                      addFactory(this.form).then(response => {
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
      this.$confirm('是否确认删除设备厂商信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFactory(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有设备厂商信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportFactory(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
