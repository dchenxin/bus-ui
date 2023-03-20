<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="版本号" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入版本号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="系统" prop="appType">
        <el-select v-model="queryParams.appType">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
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
          v-hasPermi="['module:appVersion:add']"
        >发布
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:appVersion:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:appVersion:remove']"
        >删除
        </el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:appVersion:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="appVersionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--<el-table-column label="主键" align="center" prop="id" />-->
      <el-table-column type="index" align="center" label="序号" :index="indexMethod"/>
      <el-table-column label="版本号" align="center" prop="version"/>
      <el-table-column label="系统" align="center" prop="appType">
        <template slot-scope="scope">
          <span v-if="scope.row.appType ===1">安卓</span>
          <span v-else-if="scope.row.appType ===2">苹果</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="更新内容" align="center" prop="content" min-width="200px" show-overflow-tooltip/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:appVersion:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:appVersion:remove']"
          >删除
          </el-button>
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

    <!-- 添加或修改应用版本管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="版本号" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本号" maxlength="30"/>
        </el-form-item>
        <el-form-item label="系统" prop="apptype">
<!--          <el-input v-model="form.appType" placeholder="清输入系统" maxlength="30"/>-->
          <el-select v-model="form.appType">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新内容" prop="content">
          <rich-editor v-model="form.content" :height="300"/>
          <!--<el-input v-model="form.content" placeholder="请输入更新内容" />-->
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
import {
  listAppVersion,
  getAppVersion,
  delAppVersion,
  addAppVersion,
  updateAppVersion,
  exportAppVersion
} from "@/api/module/appVersion";
import RichEditor from "../../components/richEditor/index";

export default {
  name: "AppVersion",
  components: {RichEditor},
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
      // 应用版本管理表格数据
      appVersionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      options: [{
        value: '1',
        label: '安卓'
      }, {
        value: '2',
        label: '苹果'
      },],


      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        version: undefined,
        appType: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        version: [
          {required: true, message: "版本号不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /*列表number*/
    indexMethod(index) {
      return ++index;
    },
    /** 查询应用版本管理列表 */
    getList() {
      this.loading = true;
      listAppVersion(this.queryParams).then(response => {
        this.appVersionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
        createTime: undefined,
        updateTime: undefined,
        createBy: undefined,
        updateBy: undefined,
        delFlag: undefined,
        version: undefined,
        appType: undefined,
        content: undefined
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
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "发布应用版本";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAppVersion(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改应用版本";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateAppVersion(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addAppVersion(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("发布成功");
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
      this.$confirm('是否确认删除应用版本号为 "' + row.version + '" 的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delAppVersion(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有应用版本管理数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportAppVersion(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () {
      });
    }
  }
};
</script>
