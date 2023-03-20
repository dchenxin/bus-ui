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
     <!-- <el-form-item label="文字内容" prop="content">
        <el-input
          v-model="queryParams.content"
          placeholder="请输入文字内容"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="图片内容" prop="img">
        <el-input
          v-model="queryParams.img"
          placeholder="请输入图片内容"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="视频内容" prop="video">
        <el-input
          v-model="queryParams.video"
          placeholder="请输入视频内容"
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
      <el-col :span="1.5">
        <el-button
          v-if="checkRole(['cityAdmin'])||checkRole(['countyAdmin'])||checkRole(['villageAdmin'])||checkRole(['admin'])"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['module:village:enterprisAdd']"
        >发布</el-button>
      </el-col>
     <!-- <el-col :span="1.5">
        <el-button
          v-hasRole="['villageAdmin']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:village:edit']"
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
          v-hasPermi="['module:village:remove']"
        >删除</el-button>
      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          icon="el-icon-download"-->
      <!--          size="mini"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['module:village:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="villageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column type="index" label="序号" >
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="文章分类" align="center" prop="articleType"/>-->
      <el-table-column label="发布人" width="100px" align="center" prop="userId" >
        <template slot-scope="scope">
          <span v-if="scope.row.user ===''||scope.row.user ===null">-</span>
          <span v-else>{{scope.row.user.nickName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="文章标题" align="center" prop="title" show-overflow-tooltip/>
      <el-table-column label="文章简介" align="center" prop="introduce" show-overflow-tooltip/>
      <el-table-column label="文字内容" align="center" prop="content" show-overflow-tooltip/>
      <el-table-column label="封面图片" align="center" prop="img">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.img!=null && scope.row.img!=='[]' && scope.row.img!==''"
            style="width: 150px; height: 80px; padding: 0 20px; display: inline-flex; justify-content:center; align-items:center"
            :src="firstImg1(scope.row)"
            fit="cover"
            :preview-src-list="firstImgArray1(scope.row)"
          >
          </el-image>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="文章视频" align="center" prop="video">
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

      <el-table-column label="发布时间" align="center" prop="createTime" :formatter="dateFormatter"/>
      <el-table-column label="状态" align="center" prop="state"  >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state" active-value="put" inactive-value="off" @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
     <!-- <el-table-column label="状态" align="center" prop="state" v-if="checkRole(['villageAdmin'])||checkRole(['admin'])" >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state" active-value="put" inactive-value="off" @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>-->
      <el-table-column label="浏览量" align="center" prop="count"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button
            v-if="scope.row.state==='off' && (checkRole(['villageAdmin']) || checkRole(['admin']))"
            size="mini"
            type="text"
            icon="el-icon-caret-top"
            @click="handlePut(scope.row)"
          >上架</el-button>
          <el-button
            v-if="scope.row.state==='put' && (checkRole(['villageAdmin']) || checkRole(['admin']))"
            size="mini"
            type="text"
            icon="el-icon-caret-bottom"
            @click="handleOff(scope.row)"
          >下架</el-button>-->
          <el-button type="text" icon="el-icon-tickets" size="mini" @click="catchDetail(scope.row)">详情</el-button>
          <el-button
            v-if="checkRole(['villageAdmin'])||checkRole(['cityAdmin'])||checkRole(['countyAdmin'])||checkRole(['admin'])"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:village:edit']"
          >修改
          </el-button>
          <el-button
            v-if="checkRole(['cityAdmin'])||checkRole(['admin'])"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:village:remove']"
          >删除</el-button>
          <el-button
            v-if="getLoginUser(scope.row)&&checkRole(['countyAdmin'])"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:village:remove']"
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

    <!-- 添加或修改文化振兴对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" maxlength="30" show-word-limit placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="简介" prop="introduce">
          <el-input v-model="form.introduce"
                    placeholder="请输入简介"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    maxlength="30"
                    show-word-limit/>
        </el-form-item>
        <el-form-item label="图片内容" prop="img">
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
        <el-form-item label="文字内容" prop="content">
        <!--  <el-upload
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
          <RichEditor :height="richHeight" v-model="form.content"/>
        </el-form-item>

        <el-form-item label="视频内容" prop="video">
          <el-upload
            :action="uploadVideoUrl"
            list-type="picture"
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

            <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">大小不能超过20MB，限传一个视频</div>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--  查看详情 对话框-->
    <el-dialog :title="title" customClass="customWidth" :visible.sync="openDetail"width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="编号" prop="number">
          <span style="padding-left: 10px">{{form.number}}</span>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <span style="padding-left: 10px">{{form.title}}</span>
        </el-form-item>
        <el-form-item label="图片内容" prop="img">
          <div v-if="form.img!=null && form.img !=='[]' && form.img !==''">
            <div style="display: flex; flex-wrap: wrap">
              <div v-for="item in imgList">
                <el-image
                  style="width: 200px; height: 200px; padding: 0 20px; "
                  :src="item"
                  fit="contain"
                  :preview-src-list="imgList"
                />
              </div>
            </div>
          </div>
          <span v-else style="padding: 0 10px;">暂无图片</span>
        </el-form-item>
        <el-form-item label="文字内容" prop="content">
          <div style="padding: 0 10px;">
            <span v-if="form.content!=null" v-html="form.content"/>
            <span v-else >暂未编辑内容</span>
          </div>
        </el-form-item>

        <el-form-item label="视频内容" prop="video">
          <div v-if="form.video!=null&&form.video !=='[]'&&form.video!=''">
            <video :src="VideoUrl" controls="controls" preload="auto" style="width: 654px;height: 368px"></video>
          </div>
          <span v-else style="padding: 0 10px;">暂未上传视频</span>
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
  /*const toolbarOptions = [
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


  ];*/
  import {changeNewStatus,offVillages,putVillages,enterprislist, getVillage, delVillage, enterprisAdd, updateVillage, cultureExport} from "@/api/module/village";
  import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
  import { getCurrent } from "@/api/module/userDetail";
  import RichEditor from "../../components/richEditor/index";
  export default {
    name: "Village",
    components: {RichEditor},
    data() {
      return {
        //富文本高度
        richHeight: 300,
        // 当前登录者
        currentUserDetail: {
          userType:'',
          userId: 0
        },
        //详情视频
        VideoUrl:'',
        //视频数组
        videoList:[],
        videoLimit: 1,
        hideVideoUploadEdit: false, // 上传限制 隐藏上传按钮
        detailVideo:'', //详情中视频url
        videoFlag:false , //是否显示进度条
        videoUploadPercent:"", //进度条的进度，
        isShowUploadVideo:false, //显示上传按钮
        uploadVideoUrl: process.env.VUE_APP_BASE_API + "/api/file/uploadvideo",

        options: [{
          value: '村容村貌',
          label: '村容村貌'
        }, {
          value: '环境整治',
          label: '环境整治'
        }, {
          value: '企业帮扶',
          label: '企业帮扶'
        }, {
          value: '三化管理',
          label: '三化管理'
        }],
        value: '',
        //详情
        openDetail: false,
        //图片详情数组
        imgList: [],

        // 图片对象数组
        picList: [],
        hideImageUploadEdit: false, // 上传限制 隐藏上传按钮
        limit: 3, //图片数量限制
        dialogImageUrl: '', //预览
        dialogVisible: false,
        uploadUrl: process.env.VUE_APP_BASE_API + "/api/file/upload",


        //富文本编辑
       /* editorOption: {
          placeholder: '请在此输入内容...',
          modules: {
            imageDrop: true, //开启拖拽,
            toolbar: {
              container: toolbarOptions,
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
        },*/
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
        // 一村一档信息表格数据
        villageList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          title: undefined,
          content: undefined,
          img: undefined,
          video: undefined,
          count: undefined,
          orderByColumn:"createTime",
          isAsc:"desc",
          articleType: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          createTime: [
            {required: true, message: "视频内容不能为空", trigger: "blur"}
          ],
          updateTime: [
            {required: true, message: "视频内容不能为空", trigger: "blur"}
          ],
          createBy: [
            {required: true, message: "视频内容不能为空", trigger: "blur"}
          ],
          updateBy: [
            {required: true, message: "视频内容不能为空", trigger: "blur"}
          ],
          title: [
            {required: true, message: "标题不能为空！", trigger: "blur"},
            // {max: 30, message: "标题字数不能超过30个字哦!", trigger: "blur"},
          ],
        }
      };
    },
    created() {
      this.getList();
    },
    computed: {
      editor() {
        // false禁止编辑  true语序编辑
        // this.$refs.myQuillEditor.quill.enable(false)
        return this.$refs.myQuillEditor.quill;
      }
    },
    watch: {
      open(val) {
        if (val === false) {
          this.picList = [];
          this.videoList = [];
          this.hideImageUploadEdit = false;
          this.hideVideoUploadEdit = false;
        }
      }
    },
    methods: {
      //县责不能删除市级
      getLoginUser(row) {
        // if (row.userType !=='3333')return true
        return row.userType !=='3333'?true:false;
      },
      checkRole,
      // 获得当前用户detail
      getCurrentUserDetail(){
        getCurrent().then(response => {
          this.currentUserDetail = response.data;
          // console.log(response.data)
        });
      },
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
      //=========================================
      // 富文本图片上传前
     /* quillBeforeUpload() {
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
      },*/
      //=========================================
      /** 上架 */
      handlePut(row) {
        const id = row.id;
        // console.log(id);
        this.$confirm('是否确认上架农产品：' + row.title , "上架", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        }).then(function() {
          return putVillages(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("上架成功");
        }).catch(function() {});
      },
      /** 下架 */
      handleOff(row) {
        const id = row.id;
        this.$confirm('是否确认下架：' + row.title , "下架", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        }).then(function() {
          return offVillages(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("下架成功");
        }).catch(function() {});
      },
      /*列表number*/
      indexMethod(index) {
        return ++index;
      },
      //=======================================================
      // 加文件、上传成功和上传失败时都会被调用
      handleEditVideoChange(file, fileList) {
        this.hideVideoUploadEdit = fileList.length >= this.videoLimit;
        // console.log("this.fileList:", this.fileList);
        // console.log("this.hideUploadEdit:", this.hideVideoUploadEdit);
      },
      //上传视频
      handleVideoSuccess(response, file, fileList) {
        file.url = response.data;
        this.videoList = fileList;
        // console.log(fileList)
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
        // console.log(this.hideVideoUploadEdit)
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
      },
//============================================================
      /** 查询一村一档信息列表 */
      getList() {
        this.loading = true;
        enterprislist(this.queryParams).then(response => {
          this.villageList = response.rows;
          // console.log("this.villageList-------------------------")
          // console.log(this.villageList)
          this.total = response.total;
          this.loading = false;
        });
      },
      //封面图片
      firstImg1(row){
        var images=[];
        if (row.img!=null){

          images = JSON.parse(row.img);
          // console.log("----------")
          // console.log(JSON.parse(row.img))
          return images[0];
        }
        return null;
      },
      firstImgArray1(row){
        var images=[];
        images.push(this.firstImg1(row));
        return images;
      },

      //封面视频
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
      // 取消按钮
      cancel() {
        this.open = false;
        this.openDetail = false;
        this.reset();
      },
      // 加文件、上传成功和上传失败时都会被调用
      handleEditChange(file, fileList) {
        this.hideImageUploadEdit = fileList.length >= this.limit;
        // console.log("this.fileList:", this.fileList);
        // console.log("this.hideUploadEdit:", this.hideImageUploadEdit);
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
      },

      //富文本编辑器
      /*onEditorReady(editor) {}, // 准备编辑器
      onEditorBlur() {}, // 失去焦点事件
      onEditorFocus(val, editor) {
        // console.log(val); // 富文本获得焦点时的内容
        // editor.enable(false); // 在获取焦点的时候禁用
      }, // 获得焦点事件
      onEditorChange() {}, // 内容改变事件
      saveQuillEditorValue: function(event) {
        alert(this.quillEidtorValue);
      },*/
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          createTime: undefined,
          updateTime: undefined,
          createBy: undefined,
          updateBy: undefined,
          delFlag: undefined,
          title: undefined,
          content: undefined,
          img: undefined,
          video: undefined,
          count: undefined
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
        this.title = "发布文化振兴信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.picList = []
        this.videoList = []
        this.reset();
        const id = row.id || this.ids
        getVillage(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改文化振兴信息";
          // 读取 图片数组 -> 图片对象数组
          if (this.form.img == null) return;
          for (let j = 0; j < JSON.parse(this.form.img).length; j++) {
            this.picList.push({
              'url': JSON.parse(this.form.img)[j]
            })
          }
          this.hideImageUploadEdit = this.picList.length >= this.limit;

          // 读取 视频数组 -> 视频对象数组
          if (this.form.video == null) return;
          for (let j = 0; j < JSON.parse(this.form.video).length; j++) {
            this.videoList.push({
              'url': JSON.parse(this.form.video)[j],
              'name': JSON.parse(this.form.video)[j].substring(JSON.parse(this.form.video)[j].lastIndexOf("/") + 1)
            })
          }
          this.hideVideoUploadEdit = this.videoList.length >= this.videoLimit;
        });
      },
      //查看详情
      catchDetail(row) {
        this.imgList = []
        this.reset();
        const id = row.id
        getVillage(id).then(response => {
          this.form = response.data;
          //浏览量增加
          // if (this.form.count==null){
          //   this.form.count=1;
          //   updateVillage(this.form)
          // }else{
          //   this.form.count++;
          //   updateVillage(this.form)
          // }
          //遍历循环图片
          if (this.form.img!=null && this.form.img!=='' && this.form.img!=='[]'){
            this.imgList=JSON.parse(this.form.img);
          }
          //遍历循环视频
          if (this.form.video!=null && this.form.video!=='' && this.form.video!=='[]'){
            this.VideoUrl = JSON.parse(this.form.video)[0]
          }
          this.openDetail = true;
          this.title = "查看详情";
        });
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {

              // 提交时保存为 json 格式
              var images = [];
              var videos= [];
              for (let i = 0; i < this.picList.length; i++) {
                images.push(this.picList[i].url)

              }for (let i = 0; i < this.videoList.length; i++) {
                videos.push(this.videoList[i].url)
              }
              this.form.img = JSON.stringify(images);
              this.form.video = JSON.stringify(videos);
              updateVillage(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              // 提交时保存为 json 格式
              var images = [];
              var videos= [];
              for (let i = 0; i < this.picList.length; i++) {
                images.push(this.picList[i].url)

              }for (let i = 0; i < this.videoList.length; i++) {
                videos.push(this.videoList[i].url)
              }
              this.form.img = JSON.stringify(images);
              this.form.video = JSON.stringify(videos);
              enterprisAdd(this.form).then(response => {
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
        this.$confirm('是否确认删除文化振兴信息为"' + row.title + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delVillage(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function () {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有文化振兴信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return cultureExport(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function () {
        });
      },
      //时间格式化
      dateFormatter: function (row, column, cellValue, index) {
        if (cellValue==null || cellValue==='') return "-";
        let fs = cellValue.split(':');
        return fs[0] + ':' + fs[1];
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
