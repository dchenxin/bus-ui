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
      <!--<el-form-item label="相关内容" prop="content">
        <el-input
          v-model="queryParams.content"
          placeholder="请输入相关内容"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="图片" prop="img">
        <el-input
          v-model="queryParams.img"
          placeholder="请输入图片"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文章分类" prop="elseContent">
        <el-input
          v-model="queryParams.elseContent"
          placeholder="请输入文章分类"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="pdf" prop="pdfFile">
        <el-input
          v-model="queryParams.pdfFile"
          placeholder="请输入pdf"
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
          v-if="checkRole(['cityAdmin']) || checkRole(['countyAdmin'])||checkRole(['admin'])"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['module:policy:add']"
        >发布</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:policy:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:policy:remove']"
        >删除</el-button>
      </el-col>-->
      <!--<el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:policy:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="policyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" >
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="政策编号" align="center" prop="number" />
      <el-table-column label="政策类型" align="center" prop="policyType" show-overflow-tooltip >
      <template slot-scope="scope">
        <span v-if="scope.row.policyType===1">省级</span>
        <span v-else-if="scope.row.policyType===2">市级</span>
        <span v-else>未知</span>
      </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="title" show-overflow-tooltip />
      <el-table-column label="简介" align="center" prop="introduce" show-overflow-tooltip >
        <template slot-scope="scope">
          <span v-if="scope.row.introduce!==null && scope.row.introduce!==''">{{scope.row.introduce}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="相关内容" align="center" prop="content" show-overflow-tooltip />
      <el-table-column label="封面图片" align="center" prop="img" >
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.img!=null && scope.row.img!=='[]' && scope.row.img!==''"
            style="width: 110px; height: 80px;"
            :src="firstImg1(scope.row)"
            fit="cover"
            :preview-src-list="firstImgArray1(scope.row)">
          </el-image>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="相关文件" align="center" prop="pdfFile" show-overflow-tooltip >
        <template slot-scope="scope">
          <div v-if="scope.row.pdfFile!=null && scope.row.pdfFile!=='[]' && scope.row.pdfFile!==''" style="color: #00afff">
<!--            <a  target="_blank" :href="downloadpdf(scope.row.pdfFile)" ><u>预览</u></a>-->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-document"
              @click="pdfDetail(scope.row)"
            >预览
            </el-button>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="state" v-if="!checkRole(['commonUser']) && !checkRole(['villageAdmin'])" >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state" active-value="put" inactive-value="off" @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-tickets" size="mini" @click="catchDetail(scope.row)">详情</el-button>
          <el-button
            v-if="!checkRole(['commonUser']) && !checkRole(['villageAdmin'])"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:policy:edit']"
          >修改</el-button>
          <el-button
            v-if="!checkRole(['commonUser']) && !checkRole(['villageAdmin'])"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:policy:remove']"
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

    <!-- 添加或修改政策发布信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" maxlength="30" show-word-limit placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="类型" prop="policyType">
          <el-select v-model="form.policyType" placeholder="请选择政策类型" >
            <el-option
              v-for="item in policyTypeList"
              :key="item.key"
              :label="item.value"
              :value="item.key"/>
          </el-select><!-- 可清空 -->
        </el-form-item>
        <el-form-item label="简介" prop="introduce">
          <el-input v-model="form.introduce"
                    placeholder="请输入简介"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    maxlength="30"
                    show-word-limit/>
        </el-form-item>
        <el-form-item label="相关内容" prop="content">

          <!--<div class="edit_container">
            <quill-editor v-model="form.content"
                          class="quill-editor ql-editor"
                          ref="myQuillEditor"
                          :options="editorOption"
                          @blur="onEditorBlur($event)"
                          @focus="onEditorFocus($event)"
                          @change="onEditorChange($event)"
            />
          </div>
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
          </el-upload>-->
          <RichEditor :height="richHeight" v-model="form.content"/>
        </el-form-item>
        <el-form-item label="上传图片" prop="img">
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
        <el-form-item label="上传文件" prop="pdfFile">
            <el-upload
                       :file-list="pFilefileList"
                       multiple
                       list-type="text"
                       :before-upload="pFileBeforeUpload"
                       :on-success="handlepdfSuccess"
                       :on-remove="handlepdfRemove"
                       :action="uploadUrl"
                       :limit="limit"
                        >

            <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传不超过 20MB 的.pdf或.doc或.docx文件</div>
            </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--  文件详情 对话框-->
    <el-dialog title="文件详情" :visible.sync="pdfsDetail" width="700px" append-to-body>
      <div style="padding: 5px 0;display: flex; flex-wrap: wrap" v-for="item in pFilefileList">
        <el-tag style="font-size: 17px">
          <i class="el-icon-notebook-2" />
            <a  target="_blank" :href="item.url" >{{ item.name}}</a>
        </el-tag>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pdfcancel">关 闭</el-button>
      </div>
    </el-dialog>
    <!--  查看详情 对话框-->
    <el-dialog :title="title" customClass="customWidth" :visible.sync="openDetail"
               width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="编号" prop="number">
          <span style="padding-left: 20px">{{form.number}}</span>
        </el-form-item>
        <el-form-item label="标题" prop="title">

          <span style="padding-left: 20px" v-if="form.title!=null && form.title !==''">{{form.title}}</span>
          <span style="padding-left: 20px" v-else>暂无标题</span>

        </el-form-item>
        <el-form-item label="介绍" prop="introduce">
          <div style="padding: 0 20px;">
            <span v-if="form.introduce!=null" v-html="form.introduce"/>
            <span v-else>暂无介绍</span>
          </div>
        </el-form-item>
        <el-form-item label="图片内容" prop="img">
          <div v-if="form.img!=null && form.img !=='[]' && form.img !==''">
            <div style="display: flex; flex-wrap: wrap">
              <div v-for="item in imgList">
                <el-image
                  style="width: 200px; height: 200px; padding: 0 20px"
                  :src="item"
                  fit="contain"
                  :preview-src-list="imgList"
                />
              </div>
            </div>
          </div>
          <span v-else style="padding: 0 20px;">暂无图片</span>
        </el-form-item>
        <el-form-item label="相关内容" prop="content">
          <div style="padding: 0 10px;">
            <span v-if="form.content!=null" v-html="form.content"/>
            <span v-else >暂无内容</span>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {changeNewStatus,listPolicy, getPolicy, delPolicy, addPolicy, updatePolicy, exportPolicy } from "@/api/module/policy";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
import RichEditor from "../../components/richEditor/index";
export default {
  name: "Policy",
  components: {RichEditor},
  data() {
    return {
      //富文本高度
      richHeight: 300,
      //pdf文件数组
      pFilefileList:[],

      policyTypeList:[{key:1,value:'省级'},{key:2,value:'市级'}],
      //详情
      openDetail: false,
      //文件详情
      pdfsDetail: false,
      //pdf文件名数组
      pdfNameList:[],
      //图片数组
      imgList: [],

      //=============================================
      // 图片对象数组
      picList: [],
      hideImageUploadEdit: false, // 上传限制 隐藏上传按钮
      limit: 3, //图片数量限制
      dialogImageUrl: '', //预览
      dialogVisible: false,
      uploadUrl: process.env.VUE_APP_BASE_API + "/api/file/upload",

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
      // 政策发布信息表格数据
      policyList: [],
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
        number: undefined,
        pdfFile: undefined,
        introduce: undefined,
        orderByColumn:"createTime",
        isAsc:"desc",
          policyType:undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
          policyType: [
              { required: true, message: "政策类型不能为空", trigger: "blur" }
          ],

      }
    };
  },
  created() {
    this.getList();
  },
  watch: {
    open(val) {
      if (val === false) {
        this.picList = []
        this.hideImageUploadEdit = false;
        this.pFilefileList = []
        this.pdfNameList = []
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
    /*getCurrentUserDetail(){
      getCurrent().then(response => {
        this.currentUserDetail = response.data;
        console.log(response.data)
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
    //=========================================

    //=========================================
   //预览文件
    downloadpdf(fileName) {
      if (fileName==null||fileName=='[]'||fileName=='') return '';
      return  JSON.parse(fileName)[0];

    },
    //=============================================

    //=============================================
    // 图片上传成功
    handlepdfSuccess(response, file, fileList) {
      file.url = response.data;
      this.pFilefileList = fileList;
    },
    // 图片移除事件
    handlepdfRemove(file, fileList) {
      //console.log(file, fileList);
      this.pFilefileList = fileList;
      // this.pdfNameList = fileList;
    },
    //上传前校验pdf,doc,docx
    pFileBeforeUpload(file) {
      // console.log(file)
      const isPDF = file.type === 'application/pdf';
      const isdoc = file.type ==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'||
        file.type ==='application/msword';
      const isLt20M = file.size / 1024 / 1024 < 10;

      if (!isPDF&&!isdoc) {
        this.$message.error('上传文件只能是 pdf,doc,docx文件!');
      }
      if (!isLt20M) {
        this.$message.error('上传文件大小不能超过 10MB!');
      }

      return isPDF||isdoc && isLt20M;
    },
    //==============================================

    //=============================================
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
    //=============================================


    //=============================================
    // 图片上传成功
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
    //==============================================
    /** 查询政策发布信息列表 */
    getList() {
      this.loading = true;
      listPolicy(this.queryParams).then(response => {
        this.policyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openDetail = false;
      this.reset();
    },
    // pdf文件详情 取消按钮
    pdfcancel() {
      this.open = false;
      this.pdfsDetail = false;
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
        delFlag: undefined,
        title: undefined,
        content: undefined,
        img: undefined,
        elseContent: undefined,
        pdfFile: undefined,
          policyType:undefined
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
      this.title = "添加政策发布信息";
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.picList = []
      this.pFilefileList = []
      this.reset();
      const id = row.id || this.ids
      getPolicy(id).then(response => {
        this.form = response.data;
        // console.log("this.form")
         console.log(this.form)
        this.open = true;
        this.title = "修改政策发布信息";
        // 读取 图片数组 -> 图片对象数组
        if (this.form.img==null && this.form.img ==='[]' && this.form.img ==='') return;
        for (let j = 0; j < JSON.parse(this.form.img).length; j++) {
          this.picList.push({
            'url': JSON.parse(this.form.img)[j]
          })
        }

        this.hideImageUploadEdit = this.picList.length >= this.limit;
        // 读取 PDF数组 -> PDF对象数组
        if (this.form.pdfFile != null && this.form.pdfFile !== '[]' && this.form.pdfFile !== ''){
          var pdfArray = JSON.parse(this.form.pdfFile);
          //console.log(this.form.pdfName);
          var patt = /^\[.*\]$/ ;
          //console.log(patt.test(this.form.pdfName));

          if (this.form.pdfName != null && this.form.pdfName !== '[]'
            && this.form.pdfName !== '' && patt.test(this.form.pdfName))
            var pdfNameArray = JSON.parse(this.form.pdfName);

          for (let j = 0; j < pdfArray.length; j++) {
            this.pFilefileList.push({
              'url': pdfArray[j],
              'name': pdfNameArray == null || pdfNameArray[j] == null ? '未命名文档 ' + ++j : pdfNameArray[j]
            })
          }
        }
      });
    },
    //查看详情
    catchDetail(row) {
      this.picList = []
      this.pFilefileList = []
      this.reset();
      const id = row.id
      getPolicy(id).then(response => {
        this.form = response.data;
        //遍历循环图片
        if (this.form.img!=null && this.form.img !=='[]' && this.form.img !==''){
          this.imgList=JSON.parse(this.form.img);
        }
        this.openDetail = true;
        this.title = "查看详情";
      });
    },
    //pdf文件详情
    pdfDetail(row) {
      this.pFilefileList = []
      this.pdfsDetail = true
      // 读取 PDF数组 -> PDF对象数组
      if (row.pdfFile != null && row.pdfFile !== '[]' && row.pdfFile !== ''){
        var pdfArray = JSON.parse(row.pdfFile);
        var patt = /^\[.*\]$/ ;
        if (row.pdfName != null && row.pdfName !== '[]'
          && row.pdfName !== '' && patt.test(row.pdfName))
          var pdfNameArray = JSON.parse(row.pdfName);
        for (let j = 0; j < pdfArray.length; j++) {
          this.pFilefileList.push({
            'url': pdfArray[j],
            'name': pdfNameArray == null || pdfNameArray[j] == null ? '未命名文档 ' + ++j : pdfNameArray[j]
          })
        }
      }
    },
      /** 提交按钮 */
    submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                    // 提交时保存为 json 格式
                    var images = [];
                    for (let i = 0; i < this.picList.length; i++) {
                      images.push(this.picList[i].url)
                    }
                    this.form.img = JSON.stringify(images);

                    // 提交时保存为 json 格式
                    // 提交时保存为 json 格式
                    var pdfs = [];
                    var pdfNames = [];
                    for (let i = 0; i < this.pFilefileList.length; i++) {
                      pdfs.push(this.pFilefileList[i].url);
                      pdfNames.push(this.pFilefileList[i].name);
                    }
                    this.form.pdfFile = JSON.stringify(pdfs);
                    this.form.pdfName = JSON.stringify(pdfNames);

                      updatePolicy(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                    // 提交时保存为 json 格式
                    var images = [];

                    for (let i = 0; i < this.picList.length; i++) {
                      images.push(this.picList[i].url)

                    }
                    this.form.img = JSON.stringify(images);

                    // 提交时保存为 json 格式
                    var pdfs = [];
                    var pdfNames = [];
                    for (let i = 0; i < this.pFilefileList.length; i++) {
                      pdfs.push(this.pFilefileList[i].url);
                      pdfNames.push(this.pFilefileList[i].name);
                    }
                    this.form.pdfFile = JSON.stringify(pdfs);
                    this.form.pdfName = JSON.stringify(pdfNames);

                      addPolicy(this.form).then(response => {
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
      this.$confirm('是否确认删除政策发布信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPolicy(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有政策发布信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPolicy(queryParams);
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
