<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="用户类别" prop="userType">
        <el-select v-model="queryParams.userType" placeholder="请选择用户类别" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户性别(0男 1女 2未知)" prop="sex">
        <el-select v-model="queryParams.sex" placeholder="请选择用户性别(0男 1女 2未知)" clearable size="small">
          <el-option
            v-for="dict in sexOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户身份证" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入用户身份证"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户电话" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入用户电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户是否本人(0否 1是)" prop="defaultSelf">
        <el-input
          v-model="queryParams.defaultSelf"
          placeholder="请输入用户是否本人(0否 1是)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否设置为紧急联系人(0否 1是)" prop="emergencyContact">
        <el-input
          v-model="queryParams.emergencyContact"
          placeholder="请输入是否设置为紧急联系人(0否 1是)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="证件类型" prop="codeType">
        <el-select v-model="queryParams.codeType" placeholder="请选择证件类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>-->
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
          v-hasPermi="['module:passenger:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:passenger:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:passenger:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:passenger:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
        >导入
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="passengerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column type="index" label="序号" :index="indexMethod"/>
      <el-table-column label="姓名" align="center" prop="name"/>
      <el-table-column label="类别" align="center" prop="userType"/>
      <el-table-column label="性别" align="center" prop="sex" :formatter="sexFormat"/>
      <el-table-column label="身份证" align="center" prop="code"/>
      <el-table-column label="电话" align="center" prop="phone"/>
      <el-table-column label="是否本人" align="center" prop="defaultSelf">
        <template slot-scope="scope">
          <span>{{ format(scope.row.defaultSelf) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否为紧急联系人" align="center" prop="emergencyContact">
        <template slot-scope="scope">
          <span>{{ format(scope.row.emergencyContact) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="证件类型" align="center" prop="codeType"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:passenger:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:passenger:remove']"
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

    <!-- 添加或修改乘客对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="form.userType" placeholder="请选择类别">
            <el-option
              v-for="item in userTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
        <el-form-item label="身份证" prop="code">
          <el-input v-model="form.code" placeholder="请输入身份证"/>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话"/>
        </el-form-item>
        <el-form-item label="证件类型">
          <el-select v-model="form.codeType" placeholder="请选择证件类型">
            <el-option
              v-for="item in codeTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否本人" prop="defaultSelf">
          <!--              <el-checkbox v-model="form.defaultSelf">是</el-checkbox>-->
          <el-radio-group v-model="form.defaultSelf">
            <el-radio :label="true" >是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否设置为紧急联系人" prop="emergencyContact">
<!--          <el-checkbox v-model="form.emergencyContact">是</el-checkbox>-->
          <el-radio-group v-model="form.emergencyContact">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
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
import { listPassenger, getPassenger, delPassenger, addPassenger, updatePassenger, exportPassenger,importTemplate } from "@/api/module/passenger";
import {isIntegerNotMust} from "../../../utils/validate";
import {getToken} from "../../../utils/auth";

export default {
  name: "Passenger",
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
        url: process.env.VUE_APP_BASE_API + "/module/passenger/importData",
      },
      //用户类别
      userTypeOptions: [{
        value: '成人',
        label: '成人'
      }, {
        value: '半票儿童',
        label: '半票儿童'
      }],
      //证件类型
      codeTypeOptions: [{
        value: '身份证',
        label: '身份证'
      }, {
        value: '护照',
        label: '护照'
      }, {
        value: '港澳通行证',
        label: '港澳通行证'
      }, {
        value: '台胞证',
        label: '台胞证'
      }],
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
      // 乘客表格数据
      passengerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 用户性别(0男 1女 2未知)字典
      sexOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        userType: undefined,
        sex: undefined,
        code: undefined,
        phone: undefined,
        defaultSelf: undefined,
        emergencyContact: undefined,
        userId: undefined,
        codeType: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        phone:[
          {required:true,message:"联系电话不能为空",trigger:"blur"},
          {
            pattern:/^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message:"请输入正确的手机号",
            trigger: "blur"
          },
          {
            //整数验证
            validator:isIntegerNotMust,
            trigger: 'blur'
          },
        ],
        code:[
          {required:true,message:"身份证不能为空",trigger:"blur"},
          {
            pattern:
              /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message:"请输入正确的身份证",
            trigger: "blur"
          },
        ],
        name:[
          {required:true,message:"姓名不能为空",trigger:"blur"}
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
  },
  methods: {
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "乘客信息导入";
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
    //是否转换
    format(value) {
      if (value)
        return '√';
      else
        return '';
    },
    /*列表number*/
    indexMethod(index) {
      return ++index;
    },
    /** 查询乘客列表 */
    getList() {
      this.loading = true;
      listPassenger(this.queryParams).then(response => {
        this.passengerList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 用户性别(0男 1女 2未知)字典翻译
    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.sex);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        name: undefined,
        userType: undefined,
        sex: undefined,
        code: undefined,
        phone: undefined,
        defaultSelf: true,
        emergencyContact: true,
        codeType: undefined
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
      this.title = "添加乘客";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPassenger(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改乘客";
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      updatePassenger(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                      addPassenger(this.form).then(response => {
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
      this.$confirm('是否确认删除乘客编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPassenger(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有乘客数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPassenger(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
