<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="产品名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入产品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="来源地" prop="originRegion">
        <el-input
          v-model="queryParams.originRegion"
          placeholder="请输入来源地"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="state">
        <el-input
          v-model="queryParams.state"
          placeholder="请输入审核状态"
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
          v-hasRole="['commonUser']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['module:farmProducts:add']"
        >发布</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:farmProducts:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:farmProducts:remove']"
        >删除</el-button>
      </el-col>-->
      <!--<el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:farmProducts:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="farmProductsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" :index="indexMethod"/>
      <!--<el-table-column label="id" align="center" prop="id" />-->
      <el-table-column label="发布人" width="100px" align="center" prop="nickName" >
        <!--<template slot-scope="scope">
          <span v-for="user in userList">
            <span v-if="user.userId ===scope.row.userId">{{user.nickName}}</span>
          </span>
        </template>-->
      </el-table-column>
      <el-table-column label="发布时间" min-width="140px" align="center" prop="createTime" :formatter="dateFormatter"/>
      <el-table-column label="产品名称" width="140px" align="center" prop="name" >
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
          <span style="color:#ff4949;" v-if="scope.row.state === 'examine'">(审核中)</span>
          <span style="color:#ff4949;" v-if="scope.row.state === 'fail'">(审核下架)</span>
        </template>
      </el-table-column>


      <el-table-column label="图片" min-width="140px" align="center" prop="image" >
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.image!=null && scope.row.image!=='[]' && scope.row.image!==''"
            style="width: 150px; height: 80px; padding: 0 10px; display: flex; justify-content:center; align-items:center"
            :src="firstImg(scope.row)"
            fit="cover"
            :preview-src-list="firstImgArray(scope.row)">
          </el-image>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="来源地" align="center" prop="originRegion" >
        <template slot-scope="scope">
          <span v-if="scope.row.originRegion!=null">{{scope.row.originRegion}}</span>
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
      <el-table-column label="价格" align="center" prop="price" >
        <template slot-scope="scope">
          <span v-if="scope.row.price!=null">{{scope.row.price}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="浏览量" align="center" prop="view" />

      <el-table-column label="状态" align="center" prop="state" v-if="checkRole(['villageAdmin']) || checkRole(['admin'])" >
        <template slot-scope="scope">
          <span v-if="scope.row.state==='examine'" style="color: dodgerblue;">审核</span>
          <span v-else-if="scope.row.state==='put'" style="color: green">上架</span>
          <span v-else-if="scope.row.state==='off'" style="color: red">下架</span>
          <span v-else-if="scope.row.state==='fail'" style="color: red">审核下架</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150px" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.state==='fail' && ((checkRole(['commonUser'])
            && currentUserDetail.userId === scope.row.userId) || checkRole(['admin']))"
            size="mini"
            type="text"
            icon="el-icon-refresh-right"
            @click="handleResubmit(scope.row)"
          >提交审核</el-button>
          <el-button
            v-if="scope.row.state==='examine' && (checkRole(['villageAdmin']) || checkRole(['admin']))"
            size="mini"
            type="text"
            icon="el-icon-s-check"
            @click="handleExamine(scope.row)"
          >审核</el-button>
          <el-button
            v-if="scope.row.state==='off' && checkRole(['commonUser'])
            && currentUserDetail.userId === scope.row.userId"
            size="mini"
            type="text"
            icon="el-icon-caret-top"
            @click="handlePut(scope.row)"
          >上架</el-button>
          <el-button
            v-if="scope.row.state==='put' && checkRole(['commonUser'])
            && currentUserDetail.userId === scope.row.userId"
            size="mini"
            type="text"
            icon="el-icon-caret-bottom"
            @click="handleOff(scope.row)"
          >下架</el-button>
          <el-button
            v-if="(scope.row.state==='put' || scope.row.state==='off') && (checkRole(['villageAdmin']) || checkRole(['admin']))"
            size="mini"
            type="text"
            icon="el-icon-caret-bottom"
            @click="handleForceOff(scope.row)"
          >强制下架</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
          >详情</el-button>
          <el-button
            v-if="checkRole(['villageAdmin']) || checkRole(['admin']) || currentUserDetail.userId === scope.row.userId"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:farmProducts:edit']"
          >修改</el-button>
          <el-button
            v-if="checkRole(['villageAdmin']) || checkRole(['admin']) || currentUserDetail.userId === scope.row.userId"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:farmProducts:remove']"
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

    <!-- 添加或修改 农产品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="农产品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入农产品名称" maxlength="30" show-word-limit/>
        </el-form-item>
        <el-form-item label="商品图片" prop="image">
          <!--<el-input v-model="form.image" placeholder="请输入商品图片" />-->
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
          <!--<el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>-->
        </el-form-item>
        <el-form-item label="来源地" prop="originRegion">
          <el-input style="width: 200px;" v-model="form.originRegion" placeholder="请输入来源地" maxlength="10" show-word-limit/>
        </el-form-item>

        <el-form-item label="简介" prop="introduce">
          <el-input type="textarea" :rows="2" v-model="form.introduce" maxlength="30" placeholder="请输入简介" show-word-limit/>
        </el-form-item>
        <el-form-item label="相关内容" prop="content">
          <!--<el-input v-model="form.content" placeholder="请输入相关内容" />-->
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

        <el-form-item label="价格" prop="price">
          <el-input style="width: 200px;" v-model="form.price" placeholder="请输入价格" maxlength="8"/> 元
        </el-form-item>
        <!--<el-form-item label="审核状态" prop="state">
          <el-input v-model="form.state" placeholder="请输入审核状态" />
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 农产品 详情 对话框 -->
    <el-dialog :title="title" :visible.sync="detailOpen" width="900px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="编号" prop="number">
          <span style="padding-left: 10px">{{form.number}}</span>
        </el-form-item>
        <el-form-item label="农产品名称" prop="name">
          <span style="padding-left: 10px">{{form.name}}</span>
        </el-form-item>
        <el-form-item label="商品图片" prop="image">
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
          <!--<el-input v-model="form.image" placeholder="请输入商品图片" disabled/>-->
        </el-form-item>
        <el-form-item label="简介" prop="introduce">
          <span v-if="form.introduce!=null && form.introduce!==''" style="padding-left: 10px">{{form.introduce}}</span>
          <span v-else style="padding-left: 10px">-</span>
        </el-form-item>
        <el-form-item label="相关内容" prop="content">
          <div style="padding: 0 10px;">
            <span v-if="form.content!=null && form.content!==''" v-html="form.content"/>
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
        <el-form-item label="来源地" prop="originRegion">
          <span v-if="form.originRegion!=null" style="padding-left: 10px">{{form.originRegion}}</span>
          <span v-else style="padding-left: 10px">-</span>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <span v-if="form.price!=null" style="padding-left: 10px">{{form.price}}</span>
          <span v-else style="padding-left: 10px">-</span>
        </el-form-item>
        <!--<el-form-item label="审核状态" prop="state">
          <span v-if="form.state==='put'" style="padding-left: 10px">已上架</span>
          <span v-else-if="form.state==='off'" style="padding-left: 10px">已下架</span>
          <span v-else-if="form.state==='examine'" style="padding-left: 10px">审核中</span>
          <span v-else-if="form.state==='fail'" style="padding-left: 10px">审核未通过</span>
          <span v-else style="padding-left: 10px">-</span>
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

    <!-- 审核农产品 -->
    <el-dialog :title="title" :visible.sync="examineOpen" width="400px">
      <div>农产品名称：{{form.name}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="examineSuccess">审核通过</el-button>
        <el-button type="danger" @click="examineFail">审核不通过</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import
{
  listFarmProducts, getFarmProducts,
  delFarmProducts, addFarmProducts, updateFarmProducts, exportFarmProducts,
  examineFarmProducts, failFarmProducts,
  putFarmProducts, offFarmProducts, forceOffFarmProducts, resubmitFarmProducts
}
from "@/api/module/farmProducts";
import { getCurrent } from "@/api/module/userDetail";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数

export default {
  name: "FarmProducts",
  data() {
    return {

      // 当前登录者
      currentUserDetail: {
        userType:'',
        userId: 0
      },

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
      // 农产品表格数据
      farmProductsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      // 审核弹出框
      examineOpen: false,
      // farmProductId

      // 详情
      detailOpen: false,
      // 详情图片数组
      detailImgs: [],

      // 图片对象数组
      picList: [],
      hideImageUploadEdit: false, // 隐藏上传按钮
      limit: 3, // 上传限制
      dialogImageUrl: '',
      dialogVisible: false,
      // 图片上传地址
      uploadUrl: process.env.VUE_APP_BASE_API + "/api/file/upload",

      //富文本编辑
      editorOption: {
        placeholder: '请在此输入内容...',
        modules: {
          imageDrop: true, //开启拖拽,
          toolbar: {
            container: [
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
            ],
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
        name: undefined,
        originRegion: undefined,
        state: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          {required: true, message: "产品名称不能为空", trigger: "blur"}
        ],
        price: [
          {required: true, message: "价格不能为空", trigger: "blur"},
          { pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/, message: '价格只能为数字或小数', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getCurrentUserDetail(); //当前登录用户detail
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
        this.detailImgs = [];

      }
    }
  },
  methods: {
    checkRole,

    /*列表number*/
    indexMethod(index) {
      return ++index;
    },

    // 获得当前用户detail
    getCurrentUserDetail(){
      getCurrent().then(response => {
        this.currentUserDetail = response.data;
        console.log(response.data)
      });
    },

    /** 查询农产品列表 */
    getList() {
      this.loading = true;
      listFarmProducts(this.queryParams).then(response => {
        this.farmProductsList = response.rows;
        this.total = response.total;
        this.loading = false;
        console.log(this.farmProductsList);
      });
    },

    // 获取首张图片 url ==================================== start
    firstImg(row){
      var images=[];
      if (row.image!=null && row.image!=='[]'){
        images = JSON.parse(row.image);
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

    //富文本编辑器
    onEditorReady(editor) {}, // 准备编辑器
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus(val, editor) {
      // console.log(val); // 富文本获得焦点时的内容
      // editor.enable(false); // 在获取焦点的时候禁用
    }, // 获得焦点事件
    onEditorChange() {}, // 内容改变事件
    saveQuillEditorValue: function(event) {
      alert(this.quillEidtorValue);
    },

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
      this.detailOpen =false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        number: undefined,
        userId: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        delFlag: undefined,
        name: undefined,
        image: undefined,
        content: undefined,
        originRegion: undefined,
        price: undefined,
        state: undefined,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "发布农产品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFarmProducts(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改农产品";

        // 读取 图片数组 -> 图片对象数组
        if (this.form.image==null || this.form.image==='[]' || this.form.image==='') return;
        for (let j = 0; j <JSON.parse(this.form.image).length ; j++) {
          this.picList.push({
            'url':JSON.parse(this.form.image)[j]
          });
          this.hideImageUploadEdit = this.picList.length >= this.limit;
        }
      });
    },
    /* 详情按钮*/
    handleDetail(row) {
      this.reset();
      const id = row.id;
      getFarmProducts(id).then(response => {
        this.form = response.data;
        if (this.form.image!=null){
          this.detailImgs=JSON.parse(this.form.image);
        }

        this.detailOpen = true;
        this.title = "农产品详情";
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {

                      // 提交时保存为 json 格式
                      var images = [];
                      for (let i = 0; i <this.picList.length ; i++) {
                        images.push(this.picList[i].url)
                      }
                      this.form.image =JSON.stringify(images);


                      updateFarmProducts(this.form).then(response => {
                          console.log(this.form)
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

                      addFarmProducts(this.form).then(response => {
                          console.log(this.form)
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

    // 审核失败后 重新提交审核
    handleResubmit(row){
      const id = row.id;
      this.$confirm('是否重新提交审核：' + row.name , "上架", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(function() {
        return resubmitFarmProducts(id);
      }).then(() => {
        this.getList();
        this.msgSuccess("提交成功");
      }).catch(function() {});
    },
    /** 上架农产品 */
    handlePut(row) {
      const id = row.id;
      this.$confirm('是否确认上架农产品：' + row.name , "上架", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(function() {
        return putFarmProducts(id);
      }).then(() => {
        this.getList();
        this.msgSuccess("上架成功");
      }).catch(function() {});
    },
    /** 下架农产品 */
    handleOff(row) {
      const id = row.id;
      this.$confirm('是否确认下架农产品：' + row.name , "下架", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(function() {
        return offFarmProducts(id);
      }).then(() => {
        this.getList();
        this.msgSuccess("下架成功");
      }).catch(function() {});
    },
    /** 强制下架农产品 */
    handleForceOff(row) {
      const id = row.id;
      this.$confirm('是否确认强制下架农产品：' + row.name , "强制下架", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(function() {
        return forceOffFarmProducts(id);
      }).then(() => {
        this.getList();
        this.msgSuccess("强制下架成功");
      }).catch(function() {});
    },
    /** 审核农产品 */
    handleExamine(row) {
      this.form.id = row.id;
      this.form.name = row.name;
      this.title='农产品上架审核';
      this.examineOpen = true;
    },

    /** 农产品审核成功 */
    examineSuccess(){
      examineFarmProducts(this.form.id).then(response => {
        this.getList();
        this.msgSuccess("审核完成");
      });
      this.examineOpen = false;
    },

    /** 农产品审核失败事件 */
    examineFail(){
      failFarmProducts(this.form.id).then(response => {
        this.getList();
        this.msgSuccess("审核完成");
      });
      this.examineOpen = false;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除农产品名称为"' + row.name + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFarmProducts(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有农产品数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportFarmProducts(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    // 时间格式化
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
