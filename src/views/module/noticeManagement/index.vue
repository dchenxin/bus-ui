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
          v-hasPermi="['module:noticeManagement:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:noticeManagement:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:noticeManagement:remove']"
        >删除</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:noticeManagement:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="noticeManagementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" :index="indexMethod"/>
      <el-table-column label="发布时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{m}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="title" />

      <el-table-column label="图片" width="150px" align="center" prop="image" >
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.image!=null && scope.row.image!=='[]' && scope.row.image!==''"
            style="width: 150px; height: 80px; padding: 0 20px; display: flex; justify-content:center; align-items:center"
            :src="getFirstImage(scope.row)"
            fit="cover"
            :preview-src-list="getFirstImageAsArray(scope.row)"
          >
            <!--<div slot="error"  class="image-slot">
              <i  class="el-icon-picture-outline"></i>
            </div>-->
          </el-image>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" align="center" prop="content" min-width="200px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.content!=null && scope.row.content!==''">{{scope.row.content}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="谁可以看" align="center" prop="visibility" >
        <template slot-scope="scope">
          <span v-if="scope.row.visibility ==='common'">所有人</span>
          <span v-else-if="scope.row.visibility ==='village'">村级及以上</span>
          <span v-else-if="scope.row.visibility ==='county'">县级及以上</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="浏览量" align="center" prop="view" />
      <!--<el-table-column label="资讯状态" align="center" prop="state" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:noticeManagement:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:noticeManagement:remove']"
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

    <!-- 添加或修改公告管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" maxlength="30" show-word-limit/>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <!--<el-input v-model="form.image" placeholder="请输入商品图片" />-->
          <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :class="{hide: hideImageUploadEdit}"
            :on-change="handleEditChange"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeAvatarUpload"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :limit="limit"
            :file-list="picList">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!--<el-input v-model="form.content" placeholder="请输入图文内容" />-->
          <!-- 图片上传组件辅助-->
          <!--<el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            name="file"
            :show-file-list="false"
            list-type="picture"
            :multiple="false"
            :on-success="quillUploadSuccess"
            :on-error="quillUploadError"
            :before-upload="quillBeforeUpload">
          </el-upload>
          <div class="edit_container">
            <quill-editor v-model="form.content"
                          class="quill-editor ql-editor"
                          ref="myQuillEditor"
                          :options="editorOption"
                          @blur="onEditorBlur($event)"
                          @focus="onEditorFocus($event)"
                          @change="onEditorChange($event)"
            />
          </div>-->
          <rich-editor :height="300" v-model="form.content" />
        </el-form-item>
        <el-form-item label="谁能看到" prop="visibility">
          <el-select v-model="form.visibility" placeholder="请选择谁能看到" clearable>
            <el-option label="县级及以上" value="county"/>
            <el-option label="村级及以上" value="village"/>
            <el-option label="所有人" value="common"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 乡村动态 详情 对话框 -->
    <el-dialog :title="title" :visible.sync="detailOpen" width="900px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="编号" prop="number">
          <span style="padding-left: 10px">{{form.number}}</span>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <span style="padding-left: 10px">{{form.title}}</span>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <div style="display: flex; flex-wrap: wrap;">
            <div v-for="img in detailImages">
              <el-image
                style="width: 200px; height: 150px; padding: 0 20px"
                :src="img"
                fit="contain"
                :preview-src-list="detailImages"
              />
            </div>
          </div>
          <span style="padding: 0 10px;" v-if="detailImages.length===0">暂未上传图片</span>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <div style="">
            <span v-if="form.content!=null" v-html="form.content"/>
            <span v-else >-</span>
          </div>
        </el-form-item>

        <el-form-item label="谁能看到" prop="visibility">
          <span v-if="form.visibility ==='common'">所有人可见</span>
          <span v-else-if="form.visibility ==='village'">村级及以上</span>
          <span v-else-if="form.visibility ==='county'">县级及以上</span>
          <span v-else>-</span>
        </el-form-item>

        <el-form-item label="浏览量" prop="view">
          <span v-if="form.view!=null" style="padding-left: 10px">{{form.view}}</span>
          <span v-else style="padding-left: 10px">-</span>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listNoticeManagement, getNoticeManagement, delNoticeManagement, addNoticeManagement, updateNoticeManagement, exportNoticeManagement } from "@/api/module/noticeManagement";
import RichEditor from "../../components/richEditor/index";

export default {
  name: "NoticeManagement",
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
      // 公告管理表格数据
      noticeManagementList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      // 详情开关
      detailOpen: false,
      // 详情图片
      detailImages: [],

      // 图片对象数组
      picList: [],
      hideImageUploadEdit: false, //隐藏上传按钮
      limit: 3, //图片数量限制
      dialogImageUrl: '', //预览
      dialogVisible: false,
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
        visibility: [
          { required: true, message: "谁能看到不能为空", trigger: "blur" }
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
    detailOpen(val){
      if (val===false) {
        this.detailImages = [];
      }
    },
  },
  methods: {
    /*列表number*/
    indexMethod(index) {
      return ++index;
    },

    /** 查询公告管理列表 */
    getList() {
      this.loading = true;
      listNoticeManagement(this.queryParams).then(response => {
        this.noticeManagementList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 获取首张图片 url =================================
    getFirstImage(row){
      var images=[];
      if (row.image!=null && row.image!=='[]'){
        images = JSON.parse(row.image);
        return images[0];
      }
      return null;
    },

    // 返回包含一张图片的数组 => 照片墙
    getFirstImageAsArray(row){
      var images=[];
      images.push(this.getFirstImage(row));
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
      /*if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!');
      }*/
      return isJPG;
    }, // ================================================================

    // 详情页按钮操作
    handleDetail(row) {
      this.reset();
      const id = row.id;
      getNoticeManagement(id).then(response => {
        this.form = response.data;
        if (this.form.image!=null && this.form.image!=='' && this.form.image!=='[]'){
          this.detailImages = JSON.parse(this.form.image); //详情的图片数组
        }
        this.detailOpen = true;
        this.title = "公告详情";
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.detailOpen= false;
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
        image: undefined,
        content: undefined,
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
      this.title = "添加公告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getNoticeManagement(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公告";

        // 读取 图片数组 -> 图片对象数组
        if (this.form.image!=null && this.form.image!=='[]' && this.form.image!=='') {
          for (let j = 0; j <JSON.parse(this.form.image).length ; j++) {
            this.picList.push({
              'url':JSON.parse(this.form.image)[j]
            })
          }
          this.hideImageUploadEdit = this.picList.length >= this.limit;
        }
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {

                    // 提交时图片保存为 json 格式
                    var images = [];
                    for (let i = 0; i <this.picList.length ; i++) {
                      images.push(this.picList[i].url)
                    }
                    this.form.image =JSON.stringify(images);

                      updateNoticeManagement(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {

                    // 提交时图片保存为 json 格式
                    var images = [];
                    for (let i = 0; i <this.picList.length ; i++) {
                      images.push(this.picList[i].url)
                    }
                    this.form.image =JSON.stringify(images);

                      addNoticeManagement(this.form).then(response => {
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
      this.$confirm('是否确认删除公告标题为 "' + row.title + '" 的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delNoticeManagement(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有公告管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportNoticeManagement(queryParams);
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
