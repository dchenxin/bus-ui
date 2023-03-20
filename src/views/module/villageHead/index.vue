<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="名字" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名字"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
     <!-- <el-form-item label="年龄" prop="age">
        <el-input
          v-model="queryParams.age"
          placeholder="请输入年龄"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input
          v-model="queryParams.telephone"
          placeholder="请输入联系电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="头像地址" prop="avatar">
        <el-input
          v-model="queryParams.avatar"
          placeholder="请输入头像地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="乡村id" prop="ruralId">
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
          v-hasPermi="['module:villageHead:add']"
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
          v-hasPermi="['module:villageHead:edit']"
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
          v-hasPermi="['module:villageHead:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:villageHead:export']"
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

    <el-table v-loading="loading" :data="villageHeadList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column type="index" label="序号" :index="indexMethod"/>
      <el-table-column label="所在乡村" align="center" prop="detailVillage">
        <!--<template slot-scope="scope">
          <span v-if="scope.row.ruralId==null || scope.row.ruralId===''">-</span>
          <span v-for="rural in ruralList">
            <span v-if="rural.id ===scope.row.ruralId">{{rural.cityName}}{{rural.countyName}}{{rural.villageName}}</span>
          </span>
        </template>-->
      </el-table-column>
      <el-table-column label="名字" align="center" prop="name"/>
      <el-table-column label="年龄" align="center" prop="age"/>
      <el-table-column label="任职年数" align="center" prop="dutyYear"/>
      <el-table-column label="联系电话" align="center" prop="telephone"/>
      <el-table-column label="头像" align="center" prop="avatar">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.avatar!=null && scope.row.avatar!=='[]' && scope.row.avatar!==''"
            style="width: 150px; height: 80px; padding: 0 20px; display: inline-flex; justify-content:center; align-items:center"
            :src="scope.row.avatar"
            fit="cover"
          >
          </el-image>
          <span v-else>-</span>
        </template>
      </el-table-column>
     <!-- <el-table-column label="图片" align="center" prop="image">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.image!=null && scope.row.image!=='[]' && scope.row.image!==''"
            style="width: 150px; height: 80px; padding: 0 20px; display: inline-flex; justify-content:center; align-items:center"
            :src="scope.row.image"
            fit="cover"
          >
          </el-image>
          <span v-else>-</span>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-if="checkRole(['villageAdmin']) || checkRole(['admin'])">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:villageHead:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:villageHead:remove']"
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

    <!-- 添加或修改村长信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入名字"/>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="form.age" placeholder="请输入年龄"/>
        </el-form-item>
        <el-form-item label="任职年数" prop="dutyYear">
          <el-input v-model="form.dutyYear" placeholder="请输入任职年数"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="form.telephone" placeholder="请输入联系电话"/>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload
            :action="avatarUploadUrl"
            list-type="picture-card"
            :class="{Hide: hideAvatar}"
            :on-change="avatarChange"
            :before-upload="beforeAvatarUpload"
            :on-success="avatarSuccess"
            :on-remove="avatarRemove"
            :limit="avatarlimit"
            :file-list="avatarList">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogAvatar">
            <img width="100%" :src="dialogAvatarUrl" alt="">
          </el-dialog>
        </el-form-item>
        <!--<el-form-item label="乡村图片" prop="image">
          <el-upload
            :action="imageUploadUrl"
            list-type="picture-card"
            :class="{Hide: hideImage}"
            :on-change="imageChange"
            :before-upload="beforeImageUpload"
            :on-success="imageSuccess"
            :on-remove="imageRemove"
            :limit="imagelimit"
            :file-list="imageList">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogImage">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>

        </el-form-item>-->
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
import { listVillageHead, getVillageHead, delVillageHead, addVillageHead, updateVillageHead, exportVillageHead,importTemplate, } from "@/api/module/villageHead";
import {isIntegerNotMust} from "../../../utils/validate";
import { optionsByType } from "@/api/module/ruralInfo";
import {getToken} from '@/utils/auth';
import {checkRole} from "../../../utils/permission";

export default {
  name: "VillageHead",
  data() {
    return {
      // 所有乡村option列表 label value
      ruralOptions: [],
      // 保存当前级联选择器的值 如：["N01000000", "N01M01000", "N01M01X01"]
      currentValue: [],
      // 所有乡村
      ruralList: [],
      //头像
      avatarList: [],
      hideAvatar: false, // 上传限制 隐藏上传按钮
      avatarlimit: 1, //图片数量限制
      dialogAvatarUrl: '', //预览
      dialogAvatar: false,
      avatarUploadUrl: process.env.VUE_APP_BASE_API + "/api/file/upload",


      //图片
      imageList: [],
      hideImage: false, // 上传限制 隐藏上传按钮
      imagelimit: 1, //图片数量限制
      dialogImageUrl: '', //预览
      dialogImage: false,
      imageUploadUrl: process.env.VUE_APP_BASE_API + "/api/file/upload",

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
      // 村长信息表格数据
      villageHeadList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        image: undefined,
        age: undefined,
        telephone: undefined,
        avatar: undefined,
        ruralId: undefined,
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
        url: process.env.VUE_APP_BASE_API + "/module/villageHead/importData",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name:[
          {required:true,message:"名字不能为空",trigger:"blur"}
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
        ],
        age:[
          {required:true,message:"年龄不能为空",trigger:"blur"},
          {
            pattern:/^(?:[1-9][0-9]?|1[01][0-9]|120)$/,
            message:"年龄超出范围了哦！",
            trigger: "blur"
          }
        ],
        dutyYear:[
          {required:true,message:"任职年数不能为空",trigger:"blur"},
          {
            // pattern:/^-?\d+(\.\d+)?$/,
            pattern: /^\d+$|^\d+[.]?\d+$/,
            message:"任职年数必须为数字值",
            trigger: "blur"
          },
        ],
        ruralId:[
          {required:true,message:"乡村不能为空",trigger:"blur"},
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getRuralOptions();
    // this.getRuralList();
  },
  watch: {
    open(val) {
      if (val === false) {
        this.hideAvatar = false;
        this.hideImage = false;
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
    // 获取所有的乡村列表
    /*getRuralList(){
      listRuralInfo().then(response => {
        this.ruralList = response.rows;
        // console.log(this.ruralList)
      });
    },*/
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "村长信息导入";
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
    /*列表number*/
    indexMethod(index) {
      return ++index;
    },
    // 获取所有的乡村 选择器option
    getRuralOptions(){
      optionsByType('50').then(response => {
        this.ruralOptions = response.data;
        // console.log(response);
      });
    },
    //图片=============
    imageChange(file, fileList) {
      this.hideImage = fileList.length >= this.imagelimit;
    },
    // 图片上传成功
    imageSuccess(response, file, fileList) {
      file.url = response.data;
      this.imageList = fileList;
    }, // 点击图片事件
    handleImagePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 图片移除事件
    imageRemove(file, fileList) {
      this.imageList = fileList;
      this.hideImage = fileList.length >= this.imagelimit;
    },

    //上传前校验图片
    beforeImageUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!');
      }
      return isJPG && isLt10M;
    },
    //头像===========================
    avatarChange(file, fileList) {
      this.hideAvatar = fileList.length >= this.avatarlimit;
    },
    // 图片上传成功
    avatarSuccess(response, file, fileList) {
      file.url = response.data;
      this.avatarList = fileList;
    },
    // 图片移除事件
    avatarRemove(file, fileList) {
      this.avatarList = fileList;
      this.hideAvatar = fileList.length >= this.avatarlimit;
    },

    //上传前校验图片
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!');
      }
      return isJPG && isLt10M;
    },
    /** 查询村长信息列表 */
    getList() {
      this.loading = true;
      listVillageHead(this.queryParams).then(response => {
        this.villageHeadList = response.rows;
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
        name: undefined,
        age: undefined,
        telephone: undefined,
        avatar: undefined,
        ruralId: undefined,
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
      this.title = "添加村长信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.avatarList = []
      this.imageList = []
      /*console.log("row")
      console.log(row)*/
      this.reset();
      const id = row.id || this.ids
      getVillageHead(id).then(response => {
        this.form = response.data;
        this.currentValue = row.currentValue;
        // console.log(this.form)
        this.open = true;
        this.title = "修改村长信息";
        //头像
        if (this.form.avatar!==null&&this.form.avatar!=='')
        this.avatarList.push({
          'url':this.form.avatar
        })
        this.hideAvatar = this.avatarList.length >= this.avatarlimit;
        // console.log("hideAvatar")
        // console.log(this.hideAvatar)
        //图片
        if (this.form.image!==null&&this.form.image!=='')
        this.imageList.push({
          'url':this.form.image
        })
        // console.log(this.imageList)
        this.hideImage = this.imageList.length >= this.imagelimit;
        // console.log("hideImage")
        // console.log(this.hideImage)


      });
    },
    /** 提交按钮 */
    submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                    if (this.avatarList.length<=0)
                      this.form.avatar = '';
                    else {
                      //头像
                      for (let i = 0; i < this.avatarList.length; i++) {
                        this.form.avatar = this.avatarList[i].url
                      }
                    }
                    if (this.imageList.length<=0)
                      this.form.image = '';
                    else {
                      //乡村图片
                      for (let i = 0; i < this.imageList.length; i++) {
                        this.form.image = this.imageList[i].url
                      }
                    }

                    updateVillageHead(this.form).then(response => {
                      if (response.code === 200) {
                        this.msgSuccess("修改成功");
                        this.open = false;
                        this.getList();
                      }
                    });
                  } else {
                    for (let i = 0; i < this.avatarList.length; i++) {
                      this.form.avatar = this.avatarList[i].url
                    }
                    for (let i = 0; i < this.imageList.length; i++) {
                      this.form.image = this.imageList[i].url
                    }
                    //相同村只给添加一次
                    for (let i = 0; i <this.villageHeadList.length ; i++) {
                      if(this.form.ruralId ==this.villageHeadList[i].ruralId){
                        this.msgError("已经存在该村档案了，请修改！");
                        return;
                      }
                    }
                    addVillageHead(this.form).then(response => {
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
      this.$confirm('是否确认删除村长信息为"' + row.name + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delVillageHead(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有村长信息数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportVillageHead(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () {
      });
    }
  }
};
</script>
<style type="text/css">
  .Hide .el-upload--picture-card {
    display: none;
  }
  .Hide .el-upload--picture-card {
    display: none;
  }
  .el-upload-list__item {
    transition: none !important;
  }

</style>
