<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
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
      <el-form-item label="联系电话" prop="tel">
        <el-input
          v-model="queryParams.tel"
          placeholder="请输入联系电话"
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
      <el-form-item label="在岗状态" prop="onDutyStatus">
        <el-select v-model="queryParams.onDutyStatus" placeholder="请选择在岗状态" clearable size="small">
          <el-option
            v-for="dict in onDutyStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="监测点" prop="monitorId">
        <el-select v-model="queryParams.monitorId" placeholder="请选择监测点" clearable size="small">
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
          v-hasPermi="['ruoyi:inspector:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ruoyi:inspector:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['ruoyi:inspector:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ruoyi:inspector:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="inspectorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属公司" align="center" prop="companyId" />
<!--      <el-table-column label="所属公司名称" align="center" prop="companyName" />-->
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="联系电话" align="center" prop="tel" />
      <el-table-column label="性别" align="center" prop="sex" :formatter="sexFormat" />
      <el-table-column label="身份证号" align="center" prop="idCard" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="在岗状态" align="center" prop="onDutyStatus" :formatter="onDutyStatusFormat" />
      <el-table-column label="监测点" align="center" prop="monitorId" />
<!--      <el-table-column label="监测点名" align="center" prop="monitorName" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ruoyi:inspector:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ruoyi:inspector:remove']"
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

    <!-- 添加或修改趟检员信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属公司">
          <el-select v-model="form.companyId" placeholder="请选择所属公司">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
<!--        <el-form-item label="所属公司名称" prop="companyName">-->
<!--          <el-input v-model="form.companyName" placeholder="请输入所属公司名称" />-->
<!--        </el-form-item>-->
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.sex" placeholder="请选择性别">
              <el-option
                  v-for="dict in sexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
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
        <el-form-item label="监测点">
          <el-select v-model="form.monitorId" placeholder="请选择监测点">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
<!--        <el-form-item label="监测点名" prop="monitorName">-->
<!--          <el-input v-model="form.monitorName" placeholder="请输入监测点名" />-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInspector, getInspector, delInspector, addInspector, updateInspector, exportInspector } from "@/api/module/inspector";

export default {
  name: "Inspector",
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
      // 趟检员信息表格数据
      inspectorList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 性别(0男 1女)字典
      sexOptions: [],
      // 在岗状态字典
      onDutyStatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyId: undefined,
        companyName: undefined,
        name: undefined,
        tel: undefined,
        sex: undefined,
        idCard: undefined,
        address: undefined,
        onDutyStatus: undefined,
        monitorId: undefined,
        monitorName: undefined
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
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    this.getDicts("on_duty_status").then(response => {
      this.onDutyStatusOptions = response.data;
    });
  },
  methods: {
    /** 查询趟检员信息列表 */
    getList() {
      this.loading = true;
      listInspector(this.queryParams).then(response => {
        this.inspectorList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 性别(0男 1女)字典翻译
    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.sex);
    },
    // 在岗状态字典翻译
    onDutyStatusFormat(row, column) {
      return this.selectDictLabel(this.onDutyStatusOptions, row.onDutyStatus);
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
        tel: undefined,
        sex: undefined,
        idCard: undefined,
        address: undefined,
        onDutyStatus: undefined,
        monitorId: undefined,
        monitorName: undefined
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
      this.title = "添加趟检员信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInspector(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改趟检员信息";
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      updateInspector(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                      addInspector(this.form).then(response => {
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
      this.$confirm('是否确认删除趟检员信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInspector(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有趟检员信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportInspector(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
