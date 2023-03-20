<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="街道" prop="road">
        <el-input
          v-model="queryParams.road"
          placeholder="请输入街道"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
     <!-- <el-form-item label="人数" prop="count">
        <el-input
          v-model="queryParams.count"
          placeholder="请输入人数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <!--<el-form-item label="乡村id" prop="ruralId">
        <el-input
          v-model="queryParams.ruralId"
          placeholder="请输入乡村id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">刷新</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasRole="['villageAdmin']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['module:villageInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasRole="['villageAdmin']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:villageInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasRole="['villageAdmin']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:villageInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:villageInfo:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasRole="['villageAdmin']"
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
        >导入
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="villageInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="用户ID" align="center" prop="id" />-->
      <el-table-column type="index" label="序号" :index="indexMethod"/>
      <el-table-column label="乡村" align="center" prop="detailVillage" >
        <!--<template slot-scope="scope">
          <span v-if="scope.row.ruralId==null || scope.row.ruralId===''">-</span>
          <span v-for="rural in ruralList">
            <span v-if="rural.id ===scope.row.ruralId">{{rural.cityName}}{{rural.countyName}}{{rural.villageName}}</span>
          </span>
        </template>-->
      </el-table-column>
      <el-table-column label="街道" align="center" prop="road" />
      <el-table-column label="街道户数" align="center" prop="roadCount" >
        <template slot-scope="scope">
          <span >{{sumFormat(scope.row.roadCount)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="总人口" align="center" prop="count" >
        <template slot-scope="scope">
          <span >{{sumFormat(scope.row.count)}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-if="checkRole(['villageAdmin']) || checkRole(['admin'])">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:villageInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:villageInfo:remove']"
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

    <!-- 添加或修改乡村档案对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="街道" prop="road">
          <el-input v-model="form.road" placeholder="请输入街道" />
        </el-form-item>
        <el-form-item label="人数" prop="count">
          <el-input v-model="form.count" placeholder="请输入人数" />
        </el-form-item>
        <el-form-item label="街道户数" prop="roadCount">
          <el-input v-model="form.roadCount" placeholder="请输入街道户数" />
        </el-form-item>
        <el-form-item label="所在乡村" prop="ruralId">
          <!--<el-input v-model="form.ruralId" placeholder="请输入考评村编号" />-->
          <el-cascader :options="ruralOptions" v-model="currentValue" :show-all-levels="false" />
        </el-form-item>
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
import { listVillageInfo, getVillageInfo,
  delVillageInfo, addVillageInfo, updateVillageInfo,
  exportVillageInfo, importTemplate} from "@/api/module/villageInfo";
import { optionsByType } from "@/api/module/ruralInfo";
import {getToken} from "../../../utils/auth";
import {checkRole} from "../../../utils/permission";
import {isIntegerNotMust} from "../../../utils/validate";
export default {
  name: "VillageInfo",
  data() {
    return {
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
        url: process.env.VUE_APP_BASE_API + "/module/villageInfo/importData",
      },
      // 所有乡村option列表 label value
      ruralOptions: [],
      // 保存当前级联选择器的值 如：["N01000000", "N01M01000", "N01M01X01"]
      currentValue: [],
      // 所有乡村
      ruralList: [],
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
      // 乡村档案表格数据
      villageInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        road: undefined,
        count: undefined,
        roadCount: undefined,
        ruralId: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        roadCount:[
          {required:true,message:"街道户数不能为空",trigger:"blur"},
          {
            // pattern:/^-?\d+(\.\d+)?$/,
            pattern: /^\d+$|^\d+[.]?\d+$/,
            message:"街道户数必须为数字值",
            trigger: "blur"
          },
        ],
        road:[
          {required:true,message:"街道不能为空",trigger:"blur"},
        ],
        ruralId:[
          {required:true,message:"乡村不能为空",trigger:"blur"},
        ],
        count:[
          {required:true,message:"总人口不能为空",trigger:"blur"},
          {
            // pattern:/^-?\d+(\.\d+)?$/,
            pattern: /^\d+$|^\d+[.]?\d+$/,
            message:"总人口必须为数字值",
            trigger: "blur"
          },
        ]
      }
    };
  },
  created() {
    this.getList();
    // this.getRuralList();
    this.getRuralOptions();

  },
  watch: {
    // 新增和编辑 关闭时清空图片对象数组
    open(val){
      if (val===false) {
        this.currentValue = undefined;
      }
    },
    //选择操作 改变form
    currentValue(val){
      console.log("级联选择器 变化");
      if (val!=null) this.form.ruralId = val[2];
    }
  },
  methods: {
    /* 千分位显示金额 */
    sumFormat(cellValue) {
      if (cellValue) {
        cellValue += "";
        if (!cellValue.includes(".")) cellValue += ".";
        return cellValue
          .replace(/(\d)(?=(\d{3})+\.)/g, ($0, $1) => {
            return $1 + ",";
          })
          .replace(/\.$/, "");
      }
    },
    /*列表number*/
    indexMethod(index) {
      return ++index;
    },
    checkRole,
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "街道信息导入";
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
    },
    // 获取所有的乡村 选择器option
    getRuralOptions(){
      optionsByType('50').then(response => {
        this.ruralOptions = response.data;
        // console.log(response);
      });
    },
    // 获取所有的乡村列表
    /*getRuralList(){
      listRuralInfo().then(response => {
        this.ruralList = response.rows;
        // console.log(this.ruralList)
      });
    },*/
    /** 查询乡村档案列表 */
    getList() {
      this.loading = true;
      listVillageInfo(this.queryParams).then(response => {
        this.villageInfoList = response.rows;
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
        road: undefined,
        count: undefined,
        ruralId: undefined,
        currentValue: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
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
      this.title = "添加乡村档案";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getVillageInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改乡村街道信息";
        this.currentValue = row.currentValue;
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      updateVillageInfo(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                      addVillageInfo(this.form).then(response => {
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
      this.$confirm('是否确认删除乡村档案为"' + row.road + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delVillageInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有乡村档案数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportVillageInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
