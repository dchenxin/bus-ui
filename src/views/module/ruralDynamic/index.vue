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
          v-hasRole="['villageAdmin']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['module:ruralDynamic:add']"
        >发布</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasRole="['villageAdmin']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:ruralDynamic:edit']"
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
          v-hasPermi="['module:ruralDynamic:remove']"
        >删除</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:ruralDynamic:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="ruralDynamicList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--<el-table-column label="id" align="center" prop="id" />-->
      <el-table-column type="index" label="序号" :index="indexMethod"/>
      <el-table-column label="发布人" width="100px" align="center" prop="nickName" >
        <!--<template slot-scope="scope">
          <span v-for="user in userList">
            <span v-if="user.userId ===scope.row.userId">{{user.nickName}}</span>
          </span>
        </template>-->
      </el-table-column>
      <el-table-column label="发布时间" width="140px" align="center" prop="createTime" :formatter="dateFormatter"/>
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="图片" width="150px" align="center" prop="image" >
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.image!=null && scope.row.image!=='[]' && scope.row.image!==''"
            style="width: 150px; height: 80px; padding: 0 20px; display: inline-flex; justify-content:center; align-items:center"
            :src="firstImg(scope.row)"
            fit="cover"
            :preview-src-list="firstImgArray(scope.row)"
          >
            <!--<div slot="error"  class="image-slot">
              <i  class="el-icon-picture-outline"></i>
            </div>-->
          </el-image>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="视频" width="150px" align="center" prop="video" >
        <template slot-scope="scope">
          <video
            v-if="scope.row.video!=null && scope.row.video!=='[]' && scope.row.video!==''"
            style="width: 150px; height: 80px; padding: 0 20px; display: inline-flex; justify-content:center; align-items:center"
            controls="controls"
            :src="firstVideo(scope.row)"
            fit="cover"
            preload="auto"
            :preview-src-list="firstVideoArray(scope.row)"
          >
          </video>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="简介" align="center" prop="introduce" width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.introduce!=null && scope.row.introduce!==''">{{scope.row.introduce}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" align="center" prop="content" min-width="200px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.content!=null && scope.row.content!==''">{{scope.row.content}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="浏览量" align="center" prop="view" />
      <!--<el-table-column label="状态" align="center" prop="state" v-if="checkRole(['villageAdmin'])" >
        <template slot-scope="scope">
          <span v-if="scope.row.state==='put'" style="color: green">上架中</span>
          <span v-else-if="scope.row.state==='off'" style="color: red">已下架</span>
          <span v-else>-</span>
        </template>
      </el-table-column>-->
      <el-table-column label="状态" align="center" v-if="checkRole(['villageAdmin']) || checkRole(['admin'])">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state" active-value="put" inactive-value="off" @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
          >详情</el-button>
          <!--<el-button
            v-if="scope.row.state==='off' && checkRole(['villageAdmin'])"
            size="mini"
            type="text"
            icon="el-icon-caret-top"
            @click="handlePut(scope.row)"
          >上架</el-button>
          <el-button
            v-if="scope.row.state==='put' && checkRole(['villageAdmin'])"
            size="mini"
            type="text"
            icon="el-icon-caret-bottom"
            @click="handleOff(scope.row)"
          >下架</el-button>-->
          <el-button
            v-hasRole="['villageAdmin']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:ruralDynamic:edit']"
          >修改</el-button>
          <el-button
            v-hasRole="['villageAdmin']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:ruralDynamic:remove']"
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

    <!-- 添加或修改乡村动态对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入图文标题" maxlength="30"/>
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
        <el-form-item label="视频" prop="video">
          <!--<el-input v-model="form.video" placeholder="请输入视频内容" />-->
          <el-upload
            :action="uploadVideoUrl"
            list-type="picture-card"
            accept=".mp4"
            :limit="videoLimit"
            :class="{hide: hideVideoUploadEdit}"
            :on-change="handleEditVideoChange"
            :on-success="handleVideoSuccess"
            :before-upload="beforeUploadVideo"
            :on-progress="uploadVideoProcess"
            :on-remove="handleVideoRemove"
            :file-list="videoList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="简介" prop="introduce">
          <el-input type="textarea" :rows="2" v-model="form.introduce" maxlength="30" placeholder="请输入简介，30字以内" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!--<el-input v-model="form.content" placeholder="请输入图文内容" />-->

          <div class="edit_container">
            <quill-editor v-model="form.content"
                          class="quill-editor ql-editor"
                          ref="myQuillEditor"
                          :options="editorOption"
                          @blur="onEditorBlur($event)"
                          @focus="onEditorFocus($event)"
                          @change="onEditorChange($event)"
            />
          </div>
          <!-- 图片上传组件辅助-->
          <el-upload
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
            <div v-for="item in detailImgs">
              <el-image
                style="width: 200px; height: 150px; padding: 0 20px"
                :src="item"
                fit="contain"
                :preview-src-list="detailImgs"
              />
            </div>
          </div>
          <span style="padding: 0 10px;" v-if="detailImgs.length===0">暂未上传图片</span>
        </el-form-item>
        <el-form-item label="视频" prop="video">
          <div v-if="form.video!=null && form.video !=='' && form.video !=='[]'">
            <video :src="detailVideo" controls="controls" preload="auto" style="width: 654px;height: 368px" />
          </div>
          <span v-else style="padding: 0 10px;">暂未上传视频</span>
          <!--<el-input v-model="form.image" placeholder="请输入商品图片" disabled/>-->
        </el-form-item>
        <el-form-item label="简介" prop="introduce">
          <span v-if="form.introduce!=null && form.introduce!==''" style="padding-left: 10px">{{form.introduce}}</span>
          <span v-else style="padding-left: 10px">-</span>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <div style="padding: 0 5px;">
            <span v-if="form.content!=null" v-html="form.content"/>
            <span v-else >-</span>
          </div>
        </el-form-item>
        <!--<el-form-item label="相关内容" prop="content">
          &lt;!&ndash;<el-input v-model="form.content" placeholder="请输入相关内容" />&ndash;&gt;
          <div class="edit_container">
            <quill-editor v-model="form.content"
                          class="quill-editor ql-editor"
                          ref="myQuillEditor"
                          :options="editorOption"
                          @blur="onEditorBlur($event)"
                          @focus="onEditorFocus($event)"
                          @change="onEditorChange($event)"/>
          </div>
        </el-form-item>-->

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

  // 工具栏配置
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
    ['blockquote', 'code-block'],     //引用，代码块

    [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
    [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
    [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
    [{ 'direction': 'rtl' }],             // 文本方向

    [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题

    [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
    [{ 'font': [] }],     //字体
    [{ 'align': [] }],    //对齐方式

    ['clean'],    //清除字体样式
    ['image']    //上传图片、上传视频
  ];

import {
  listRuralDynamic, getRuralDynamic,
  delRuralDynamic, addRuralDynamic, updateRuralDynamic, exportRuralDynamic,
  putInformation, offInformation, changeNewStatus
}
from "@/api/module/ruralDynamic";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
import { getCurrent } from "@/api/module/userDetail";

export default {
  name: "RuralDynamic",
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
      // 乡村动态表格数据
      ruralDynamicList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      // 详情开关
      detailOpen: false,
      // 详情图片
      detailImgs: [],

      // 图片对象数组
      picList: [],
      hideImageUploadEdit: false, //隐藏上传按钮
      limit: 3, //图片数量限制
      dialogImageUrl: '', //预览
      dialogVisible: false,
      uploadUrl: process.env.VUE_APP_BASE_API + "/api/file/upload",

      //视频数组
      videoList:[],
      videoLimit: 1,
      hideVideoUploadEdit: false, // 上传限制 隐藏上传按钮
      detailVideo:'', //详情中视频url
      videoFlag:false , //是否显示进度条
      videoUploadPercent:"", //进度条的进度，
      isShowUploadVideo:false, //显示上传按钮
      uploadVideoUrl: process.env.VUE_APP_BASE_API + "/api/file/uploadvideo",

      //富文本编辑
      editorOption: {
        placeholder: '请在此输入内容...',
        modules: {
          imageDrop: true, //开启拖拽,
          toolbar: {
            container: toolbarOptions,
            // container: "#toolbar",
            handlers: {
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              },
            }
          }
        },
        theme:'snow',
      },

      // 查询参数
      queryParams: {
        orderByColumn: "create_time",
        isAsc: "desc",
        pageNum: 1,
        pageSize: 10,
        title: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          {required: true, message: "标题不能为空", trigger: "blur"}
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
        this.videoList = [];
        this.hideImageUploadEdit = false;
        this.hideVideoUploadEdit = false;
      }
    },
    // 详情 关闭时清空图片对象数组
    detailOpen(val){
      if (val===false) {
        this.detailImgs = [];
        this.detailVideo = null;
      }
    },
  },
  methods: {
    checkRole,

    /*列表number*/
    indexMethod(index) {
      return ++index;
    },

    // 获得当前用户detail
    /*getCurrentUserDetail(){
      getCurrent().then(response => {
        this.currentUserDetail = response.data;
        console.log(response.data)
      });
    },*/

    /** 查询乡村动态列表 */
    getList() {
      this.loading = true;
      listRuralDynamic(this.queryParams).then(response => {
        this.ruralDynamicList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 获取所有的用户
    /*getUserList(){
      listUser().then(response => {
        this.userList = response.rows;
      });
    },*/

    // 用户状态修改
    handleStatusChange(row) {
      let text = row.state === "put" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '" "' + row.title + '"资讯吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return changeNewStatus(row.id, row.state);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.state = row.state === "put" ? "off" : "put";
        });
    },

    //富文本编辑器---------------------------------------
    onEditorReady(editor) {}, // 准备编辑器
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus(val, editor) {
      // console.log(val); // 富文本获得焦点时的内容
      // editor.enable(false); // 在获取焦点的时候禁用
    }, // 获得焦点事件
    onEditorChange() {}, // 内容改变事件
    saveQuillEditorValue: function(event) {
      //alert(this.quillEidtorValue);
    }, //-----------------------------------------------

    // 获取首张图片 url =================================
    firstImg(row){
      var images=[];
      if (row.image!=null && row.image!=='[]'){
        images = JSON.parse(row.image);
        console.log("----------");
        console.log(images[0]);
        return images[0];
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
    }, // ================================================================

    //封面视频 ============================================================
    firstVideo(row){
      var videos=[];
      if (row.video!=null){

        videos = JSON.parse(row.video);
        // console.log("----------")
        // console.log(JSON.parse(row.img))
        return videos[0];
      }
      return null;
    },
    firstVideoArray(row){
      var videos=[];
      videos.push(this.firstVideo(row));
      return videos;
    },
    // 加文件、上传成功和上传失败时都会被调用
    handleEditVideoChange(file, fileList) {
      this.hideVideoUploadEdit = fileList.length >= this.videoLimit;
      console.log("this.fileList:", this.fileList);
      console.log("this.hideUploadEdit:", this.hideVideoUploadEdit);
    },
    //上传视频
    handleVideoSuccess(response, file, fileList) {
      file.url = response.data;
      this.videoList = fileList;
    },
    //进度条
    uploadVideoProcess (event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0) * 1;
    },
    // 视频移除事件
    handleVideoRemove(file, fileList) {
      //console.log(file, fileList);
      this.videoList = fileList;
      this.hideVideoUploadEdit = fileList.length >= this.videoLimit;
      console.log(this.hideVideoUploadEdit)
    },
    //上传前校验视频
    beforeUploadVideo(file) {
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (['video/mp4'].indexOf(file.type) == -1) { //'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'
        this.$message.error('请上传正确的视频格式');
        return false;
      }
      if (!isLt20M) {
        this.$message.error('上传视频大小不能超过20MB哦!');
        return false;
      }
      this.isShowUploadVideo = false;
    }, // =========================================================

    // 富文本图片上传前 ============================================
    quillBeforeUpload() {
      // 显示loading动画
      this.quillUpdateImg = true;
    },
    quillUploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      if (res.code == 200) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, "image", res.data);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
      // loading动画消失
      this.quillUpdateImg = false;
    },
    // 富文本图片上传失败
    quillUploadError() {
      // loading动画消失
      this.quillUpdateImg = false;
      this.$message.error("图片插入失败");
    }, // ======================================================

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
        number: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        delFlag: undefined,
        title: undefined,
        image: undefined,
        video: undefined,
        content: undefined,
        view: undefined,
        introduce: undefined
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
    // 详情页按钮操作
    handleDetail(row) {
      this.reset();
      const id = row.id;
      getRuralDynamic(id).then(response => {
        this.form = response.data;
        if (this.form.image!=null && this.form.image!=='' && this.form.image!=='[]'){
          this.detailImgs = JSON.parse(this.form.image); //详情的图片数组
        }
        if (this.form.video!=null && this.form.video!=='' && this.form.video!=='[]'){
          this.detailVideo = JSON.parse(this.form.video)[0]; //详情的视频 url
          console.log(this.detailVideo)
        }

        this.detailOpen = true;
        this.title = "乡村动态详情";
      });
    },
    /** 上架资讯按钮操作 */
    /*handlePut(row) {
      const id = row.id;
      this.$confirm('是否确认上架资讯：' + row.name , "上架", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(function() {
        return putInformation(id);
      }).then(() => {
        this.getList();
        this.msgSuccess("上架成功");
      }).catch(function() {});
    },*/
    /** 下架资讯按钮操作 */
    /*handleOff(row) {
      const id = row.id;
      this.$confirm('是否确认下架资讯：' + row.name , "下架", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(function() {
        return offInformation(id);
      }).then(() => {
        this.getList();
        this.msgSuccess("下架成功");
      }).catch(function() {});
    },*/
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "发布乡村动态";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRuralDynamic(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改乡村动态";

        // 读取 图片数组 -> 图片对象数组
        if (this.form.image!=null && this.form.image!=='[]' && this.form.image!=='') {
          for (let j = 0; j <JSON.parse(this.form.image).length ; j++) {
            this.picList.push({
              'url':JSON.parse(this.form.image)[j]
            })
          }
          this.hideImageUploadEdit = this.picList.length >= this.limit;
        }


        // 读取 视频数组 -> 视频对象数组
        if (this.form.video!=null && this.form.video!=='[]' && this.form.video!=='') {
          for (let j = 0; j < JSON.parse(this.form.video).length; j++) {
            this.videoList.push({
              'url': JSON.parse(this.form.video)[j]
            })
          }
          this.hideVideoUploadEdit = this.videoList.length >= this.videoLimit;
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
                    console.log("-------");
                    console.log(this.form.image);

                    // 提交时视频保存为 json 格式
                    var videos = [];
                    for (let i = 0; i <this.videoList.length ; i++) {
                      videos.push(this.videoList[i].url)
                    }
                    this.form.video =JSON.stringify(videos);
                    console.log("-------");
                    console.log(this.form.video);

                      updateRuralDynamic(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                    // 提交时保存为 json 格式
                    var images = [];
                    for (let i = 0; i <this.picList.length ; i++) {
                      images.push(this.picList[i].url)
                    }
                    this.form.image =JSON.stringify(images);
                    console.log("-------");
                    console.log(this.form.image);

                    // 提交时视频保存为 json 格式
                    var videos = [];
                    for (let i = 0; i <this.videoList.length ; i++) {
                      videos.push(this.videoList[i].url)
                    }
                    this.form.video =JSON.stringify(videos);
                    console.log("-------");
                    console.log(this.form.video);

                      addRuralDynamic(this.form).then(response => {
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
      this.$confirm('是否确认删除乡村动态编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRuralDynamic(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有乡村动态数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRuralDynamic(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },

    // 列表时间格式化
    dateFormatter: function (row, column, cellValue, index) {
      if (cellValue==null || cellValue==='') return "-";
      let fs = cellValue.split(':');
      return fs[0] + ':' + fs[1];
    },
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

  p {
    margin: 10px;
  }

  .ql-container{
    height: 300px;
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: "14px";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
    content: "10px";
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
    content: "18px";
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
    content: "32px";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: "文本";
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: "标题1";
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: "标题2";
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: "标题3";
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: "标题4";
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: "标题5";
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: "标题6";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: "标准字体";
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
    content: "衬线字体";
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
    content: "等宽字体";
  }


</style>
