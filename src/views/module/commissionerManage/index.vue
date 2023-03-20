<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
     <!-- <el-form-item label="工号" prop="number">
        <el-input
          v-model="queryParams.number"
          placeholder="请输入工号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="特派员名字" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入特派员名字"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--
      <el-form-item label="联系电话" prop="telephone">
        <el-input
          v-model="queryParams.telephone"
          placeholder="请输入联系电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="技术类型" prop="technologyType">
        <el-select v-model="queryParams.technologyType" placeholder="请选择技术类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="擅长类型" prop="goodType">
        <el-select v-model="queryParams.goodType" placeholder="请选择擅长类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="特派员状态" prop="state">
        <el-input
          v-model="queryParams.state"
          placeholder="请输入特派员状态"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-if="!checkRole(['villageAdmin'])"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['module:commissionerManage:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="!checkRole(['villageAdmin'])"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:commissionerManage:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="!checkRole(['villageAdmin'])"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:commissionerManage:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="!checkRole(['villageAdmin'])"
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
        >导入
        </el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:commissionerManage:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="commissionerManageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index"  :index="indexMethod" label="序号" />
      <el-table-column label="工号" align="center" prop="number" />
      <el-table-column label="特派员名字" align="center" prop="name" />
<!--      <el-table-column label="所在村" align="center" prop="ruralId" >-->
<!--        <template slot-scope="scope">-->
<!--          <span v-if="scope.row.ruralId==null || scope.row.ruralId===''">-</span>-->
<!--          <span v-for="rural in ruralList">-->
<!--            <span v-if="rural.id ===scope.row.ruralId">{{rural.cityName}}{{rural.countryName}}{{rural.villageName}}</span>-->
<!--          </span>-->
<!--          &lt;!&ndash;<span v-if="scope.row.ruralId!=null && scope.row.ruralId!==''">{{scope.row.ruralId}}</span>-->
<!--          <span v-else>-</span>&ndash;&gt;-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="联系电话" align="center" prop="telephone" />
      <el-table-column label="技术类型" align="center" prop="technologyType" />
      <el-table-column label="擅长方向" align="center" prop="goodType" show-overflow-tooltip />
      <el-table-column label="特派员状态" align="center" prop="manageState" >
        <template slot-scope="scope">
          <span v-if="scope.row.manageState ==='free'">空闲中</span>
          <span v-if="scope.row.manageState ==='accepted'" style="color: red">已接单</span>
          <span v-if="scope.row.manageState ===''">-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-if="!checkRole(['villageAdmin'])">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:commissionerManage:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:commissionerManage:remove']"
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

    <!-- 添加或修改特派员人员管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="特派员名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入特派员名字" />
        </el-form-item >
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="form.telephone" placeholder="请输入联系电话" />
        </el-form-item>
<!--        <el-form-item label="所在村" prop="ruralId">-->
<!--          &lt;!&ndash;<el-input v-model="form.ruralId" placeholder="请输入考评村编号" />&ndash;&gt;-->
<!--          <el-cascader :options="ruralOptions" v-model="currentValue" :show-all-levels="false" />-->
<!--        </el-form-item>-->
        <el-form-item label="技术类型">
          <el-select v-model="form.technologyType" placeholder="请选择技术类型">
            <el-option
              v-for="item in Typeoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="擅长方向">
          <el-input v-model="form.goodType" placeholder="请输入擅长方向"/>
        </el-form-item>
<!--        <el-form-item label="特派员状态" prop="manageState">-->
<!--          <el-select v-model="form.manageState" placeholder="请选择特派员状态">-->
<!--            <el-option-->
<!--              v-for="item in manageoptions"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
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
import {
  listCommissionerManage,
  getCommissionerManage,
  delCommissionerManage,
  addCommissionerManage,
  updateCommissionerManage,
  exportCommissionerManage,
  importTemplate,
} from "@/api/module/commissionerManage";
import { listRural, optionRuralInfo, getCodeArray, getPersons } from "@/api/module/ruralInfo";
import {optionsByType} from "@/api/module/ruralInfo"; // 权限判断函数
import {getToken} from '@/utils/auth';
import {isIntegerNotMust} from "../../../utils/validate";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
export default {
  name: "CommissionerManage",
  data() {
    return {
      // 所有乡村
      ruralList: [],
      // 所有乡村option列表 label value
      ruralOptions: [],
      // 保存当前级联选择器的值 如：["N01000000", "N01M01000", "N01M01X01"]
      currentValue: [],
      //特派员状态
      manageoptions: [{
        value: 'free',
        label: '空闲中'
      }, {
        value: 'accepted',
        label: '已派员'
      }],
      //技术类型
      Typeoptions: [{
        value: '软件故障',
        label: '软件故障'
      }, {
        value: '设备故障',
        label: '设备故障'
      }, {
        value: '农业生产',
        label: '农业生产'
      }],
      value: '',
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
      // 特派员人员管理表格数据
      commissionerManageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        number: undefined,
        name: undefined,
        telephone: undefined,
        technologyType: undefined,
        goodType: undefined,
        orderState: undefined,
        manageState: undefined,
        applyMen: undefined,
        orderByColumn:"createTime",
        isAsc:"desc",
      },
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
        url: process.env.VUE_APP_BASE_API + "/module/commissionerManage/importData",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "特派员名字不能为空", trigger: "blur" }
        ],
        telephone:[
          {required:true,message:"联系电话不能为空",trigger:"blur"},
          {
            // pattern:/^-?\d+(\.\d+)?$/,
            pattern:/^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message:"请输入正确的手机号",
            trigger: "blur"
          },
          {
            //整数验证
            validator:isIntegerNotMust,
            trigger: 'blur'
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
        this.picList = [];
        this.hideImageUploadEdit = false;
        this.currentValue = undefined;
      }
    },
    // 监听级联选择器 选择操作
    currentValue(val){
      // console.log("级联选择器 变化");
      if (val!=null) this.form.ruralId = val[2];
      // console.log(this.form.ruralId)
    }
  },
  methods: {
    checkRole,
    /*列表number*/
    indexMethod(index) {
      return ++index;
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "特派员导入";
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
    /** 查询特派员人员管理列表 */
    getList() {
      this.loading = true;
      listCommissionerManage(this.queryParams).then(response => {
        this.commissionerManageList = response.rows;
        // console.log("this.commissionerManageList")
        // console.log(this.commissionerManageList)
        this.total = response.total;
        this.loading = false;
      });
    },
    // 获取所有的乡村列表
    /*getRuralList(){
      listRural().then(response => {
        this.ruralList = response.rows;
        console.log("ruralList")
        console.log(this.ruralList)
      });
    },*/
    // 获取所有的乡村 选择器option
    getRuralOptions(){
      optionsByType('50').then(response => {
        this.ruralOptions = response.data;
        // console.log(response);
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
        number: undefined,
        name: undefined,
        telephone: undefined,
        technologyType: undefined,
        goodType: undefined,
        state: undefined,
        ruralId: undefined,
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
      this.title = "添加特派员人员信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCommissionerManage(id).then(response => {
        this.form = response.data;
        // console.log(this.form);
        this.currentValue = row.currentValue;
        this.open = true;
        this.title = "修改特派员人员信息";
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      updateCommissionerManage(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                      addCommissionerManage(this.form).then(response => {
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
      this.$confirm('是否确认删除特派员人员管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCommissionerManage(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有特派员人员管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCommissionerManage(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
