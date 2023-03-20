<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
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
          v-hasPermi="['module:imageManagement:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:imageManagement:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:imageManagement:remove']"
        >删除</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:imageManagement:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="imageManagementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" :index="indexMethod"/>
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="分类" align="center" prop="sort" >
        <template slot-scope="scope">
          <!--<span v-if="scope.row.sort == null || scope.row.sort === ''">-</span>-->
          <span v-for="item in sortList">
            <span v-if="item.value===scope.row.sort">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="160px" align="center" prop="path" >
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.path!=null && scope.row.path!=='[]' && scope.row.path!==''"
            style="width: 150px; height: 80px; padding: 0 10px; display: inline-flex; justify-content:center; align-items:center"
            :src="firstImg(scope.row)"
            fit="cover"
            :preview-src-list="firstImgArray(scope.row)">
          </el-image>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="图片路径" min-width="150px" align="center" prop="path" />
      <el-table-column label="修改时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{m}') }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="浏览量" align="center" prop="view" />-->
      <!--<el-table-column label="资讯状态" align="center" prop="state" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:imageManagement:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:imageManagement:remove']"
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

    <!-- 添加或修改图片管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <!--<el-form-item label="编号" prop="number">
          <el-input v-model="form.number" placeholder="请输入编号" />
        </el-form-item>-->
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="分类" prop="sort">
          <el-select v-model="form.sort" placeholder="请选择分类">
            <el-option
              v-for="item in sortList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!--<el-input v-model="form.sort" placeholder="请输入分类" />-->
        </el-form-item>
        <!--<el-form-item label="图片路径" prop="path">
          <el-input v-model="form.path" placeholder="请输入图片路径" />
        </el-form-item>-->
        <el-form-item label="图片" prop="path">
          <!--<el-input v-model="form.path" placeholder="请输入商品图片" />-->
          <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :class="{hide: hideImageUploadEdit}"
            :on-change="handleEditChange"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeAvatarUpload"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-remove="handleRemove"
            :limit="limit"
            :file-list="picList">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <!--<el-form-item label="浏览量" prop="view">
          <el-input v-model="form.view" placeholder="请输入浏览量" />
        </el-form-item>
        <el-form-item label="资讯状态" prop="state">
          <el-input v-model="form.state" placeholder="请输入资讯状态" />
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listImageManagement, getImageManagement, delImageManagement, addImageManagement, updateImageManagement, exportImageManagement } from "@/api/module/imageManagement";

export default {
  name: "ImageManagement",
  data() {
    return {
      // 图片分类
      sortList: [
        {
          label: '首页轮播',
          value: '1'
        },
        {
          label: '首页banner',
          value: '2'
        },
        {
          label: '服务banner',
          value: '3'
        },
        {
          label: '个人中心banner',
          value: '4'
        },
        {
          label: '季度考评banner',
          value: '5'
        },
        {
          label: '其他',
          value: '0'
        }
      ],
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
      // 图片管理表格数据
      imageManagementList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      // 图片对象数组
      picList: [],
      hideImageUploadEdit: false, //隐藏上传按钮
      limit: 1, //上传限制
      dialogImageUrl: '',
      dialogVisible: false,
      // 图片上传地址
      uploadUrl: process.env.VUE_APP_BASE_API + "/api/file/upload",

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  watch: {
    // 新增和编辑 关闭时清空图片对象数组
    open(val){
      if (val===false) {
        this.picList = [];
        this.hideImageUploadEdit = false;
      }
    },
    // 详情 关闭时清空图片对象数组
    /*detailOpen(val){
      if (val===false) {
        this.detailImgs = [];

      }
    }*/
  },
  methods: {

    /*列表number*/
    indexMethod(index) {
      return ++index;
    },

    /** 查询图片管理列表 */
    getList() {
      this.loading = true;
      listImageManagement(this.queryParams).then(response => {
        this.imageManagementList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 获取首张图片 url ==================================== start
    firstImg(row){
      if (row.path!=null && row.path!==''){
        return row.path;
      }
      return null;
    },

    firstImgArray(row){
      var images=[];
      images.push(this.firstImg(row));
      return images;
    },

    // 加文件、上传成功和上传失败时都会被调用
    handleEditChange(file, fileList) {
      this.hideImageUploadEdit = fileList.length >= this.limit;
      console.log("this.fileList:", this.fileList);
      console.log("this.hideUploadEdit:", this.hideImageUploadEdit);
    },
    // 图片上传成功
    handleSuccess(response, file, fileList){
      file.url= response.data;
      this.picList = fileList;
    },
    // 图片上传失败
    handleError(err, file, fileList){
      console.log(err);
    },
    // 图片移除事件
    handleRemove(file, fileList) {
      //console.log(file, fileList);
      this.picList = fileList;
      this.hideImageUploadEdit = fileList.length >= this.limit;
    },
    // 点击图片事件
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
    }, // ============================================================== end

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
        number: undefined,
        title: undefined,
        sort: undefined,
        path: undefined,
        view: undefined,
        state: undefined
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
      this.title = "添加图片";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getImageManagement(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改图片";

        // 读取 图片 -> 图片对象数组
        if (this.form.path==null || this.form.path==='[]' || this.form.path==='') return;
        this.picList.push({
          'url':this.form.path
        });
        this.hideImageUploadEdit = this.picList.length >= this.limit;
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {

                    // 提交时保存为 json 格式
                    if (this.picList.length>0){
                      for (let i = 0; i <this.picList.length ; i++) {
                        this.form.path = this.picList[0].url
                      }
                    }

                      updateImageManagement(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {

                    // 提交时保存为 json 格式
                    if (this.picList.length>0){
                      for (let i = 0; i <this.picList.length ; i++) {
                        this.form.path = this.picList[0].url
                      }
                    }


                      addImageManagement(this.form).then(response => {
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
      this.$confirm('是否确认删除图片标题为 "' + row.title + '" 的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delImageManagement(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有图片管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportImageManagement(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style type="text/css">

  .hide .el-upload--picture-card {
    display: none;
  }

  .el-upload-list__item {
    transition: none !important;
  }
</style>
