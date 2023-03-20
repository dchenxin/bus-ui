<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="行政等级" prop="parentLevel">
        <el-select v-model="queryParams.parentLevel" placeholder="请选择行政等级" clearable>
          <el-option label="市级" value="20"/>
          <el-option label="县区" value="30"/>
          <el-option label="乡镇" value="40"/>
          <el-option label="村级" value="50"/>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="地区市级" prop="cityName">
        <el-input
          v-model="queryParams.cityName"
          placeholder="请输入地区市级"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地区县名" prop="countyName">
        <el-input
          v-model="queryParams.countyName"
          placeholder="请输入地区县名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地区村名" prop="villageName">
        <el-input
          v-model="queryParams.villageName"
          placeholder="请输入地区村名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地区校验码" prop="checkCode">
        <el-input
          v-model="queryParams.checkCode"
          placeholder="请输入地区校验码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <!--<el-form-item label="父级等级" prop="parentLevel">
        <el-input
          v-model="queryParams.parentLevel"
          placeholder="请输入父级等级"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <!--<el-form-item label="父id" prop="parentId">
        <el-input
          v-model="queryParams.parentId"
          placeholder="请输入父id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--<el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['module:ruralInfo:add']"
        >新增</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
        >导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:ruralInfo:export']"
        >导出</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-sort"
          size="mini"
          @click="handleUpdateRela"
        >更新(开发人员使用)</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="ruralInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--<el-table-column label="id" align="center" prop="id" />-->
      <el-table-column type="index" label="序号" align="center" :index="indexMethod"/>
      <el-table-column label="行政等级" align="center" prop="parentLevel" >
        <template slot-scope="scope">
          <span v-if="scope.row.parentLevel === 20" style="color: deepskyblue;">市级</span>
          <span v-else-if="scope.row.parentLevel === 30" style="color: limegreen">县级</span>
          <span v-else-if="scope.row.parentLevel === 40" style="color: coral">乡镇</span>
          <span v-else-if="scope.row.parentLevel === 50">村级</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="市级名称" align="center" prop="cityName" />
      <el-table-column label="县级名称" align="center" prop="countyName" >
        <template slot-scope="scope">
          <span v-if="scope.row.countyName!=null && scope.row.countyName!==''">{{scope.row.countyName}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="乡镇名称" align="center" prop="townName" >
        <template slot-scope="scope">
          <span v-if="scope.row.townName!=null && scope.row.townName!==''">{{scope.row.townName}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="村名" align="center" prop="villageName" >
        <template slot-scope="scope">
          <span v-if="scope.row.villageName!=null && scope.row.villageName!==''">{{scope.row.villageName}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="地区校验码" align="center" prop="checkCode" v-if="checkRole(['admin'])" width="200"/>

      <!--<el-table-column label="父id" align="center" prop="parentId" />-->

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="checkRole(['admin'])"
            size="mini"
            type="text"
            icon="el-icon-refresh-left"
            @click="handleReset(scope.row)"
          >重置校验码</el-button>
          <!--<el-button
            v-if="scope.row.parentLevel === 0"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:ruralInfo:edit']"
          >修改</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:ruralInfo:remove']"
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

    <!-- 添加或修改乡村信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="行政等级" >
          <el-select v-model="form.parentLevel" placeholder="请选择行政等级" :disabled="title ==='修改乡村信息'" clearable>
            <el-option label="市级" :value="2"/>
            <el-option label="县级" :value="1"/>
            <el-option label="村级" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="地区市级" prop="cityName">
          <el-input v-model="form.cityName" placeholder="请输入地区市级" :disabled="title ==='修改乡村信息'"/>
        </el-form-item>
        <el-form-item label="地区县名" prop="countyName"  v-show="form.parentLevel != 2">
          <el-input v-model="form.countyName" placeholder="请输入地区县名" :disabled="title ==='修改乡村信息'"/>
        </el-form-item>
        <el-form-item label="地区村名" prop="villageName" v-show="form.parentLevel == 0">
          <el-input v-model="form.villageName" placeholder="请输入地区村名" />
        </el-form-item>
        <!--<el-form-item label="地区校验码" prop="checkCode">
          <el-input v-model="form.checkCode" placeholder="请输入地区校验码" />
        </el-form-item>
        <el-form-item label="父级等级" prop="parentLevel">
          <el-input v-model="form.parentLevel" placeholder="请输入父级等级" />
        </el-form-item>
        <el-form-item label="父id" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入父id" />
        </el-form-item>-->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload"
                 :limit="1"
                 accept=".xlsx, .xls"
                 :headers="upload.headers"
                 :action="upload.url + '?updateSupport=' + upload.updateSupport"
                 :disabled="upload.isUploading"
                 :on-progress="handleFileUploadProgress"
                 :on-success="handleFileSuccess"
                 :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <!--          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据-->
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listRuralInfo, getRuralInfo,
  delRuralInfo, addRuralInfo, updateRuralInfo,
  exportRuralInfo, importTemplate, resetRuralInfo, updateRela } from "@/api/module/ruralInfo";
import {getToken} from '@/utils/auth';
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数

export default {
  name: "RuralInfo",
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
      // 乡村信息表格数据
      ruralInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/module/ruralInfo/importData",
      },

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cityName: undefined,
        countyName: undefined,
        townName: undefined,
        villageName: undefined,
        checkCode: undefined,
        parentLevel: undefined,
        parentId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        cityName: [
          { required: true, message: "地区市级不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    checkRole,

    /*列表number*/
    indexMethod(index) {
      return ++index;
    },
    /** 查询乡村信息列表 */
    getList() {
      this.loading = true;
      listRuralInfo(this.queryParams).then(response => {
        this.ruralInfoList = response.rows;
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
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        delFlag: undefined,
        cityName: undefined,
        countyName: undefined,
        villageName: undefined,
        checkCode: undefined,
        parentLevel: undefined,
        parentId: undefined
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


    /** 导入按钮操作 */ //===========================================
    handleImport() {
      this.upload.title = "导入乡村信息";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }, // ===============================================

    // 重置校验码
    handleReset(row){
      const ids = row.id || this.ids;
      this.$confirm('是否确认重置校验码："' + row.checkCode + '"?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return resetRuralInfo(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("成功");
      }).catch(function() {});
    },

    // 更新乡村层级
    handleUpdateRela(){
      updateRela().then(response => {
        this.getList();
      });
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.form.parentLevel = 0;
      this.title = "添加乡村信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getRuralInfo(id).then(response => {
        this.form = response.data;
        if (this.form.parentLevel == null){
          this.form.parentLevel = 0;
        }
        this.open = true;
        this.title = "修改乡村信息";
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      updateRuralInfo(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                      addRuralInfo(this.form).then(response => {
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
      this.$confirm('是否确认删除乡村校验码为 "' + row.checkCode + '" 的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRuralInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有乡村信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRuralInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
