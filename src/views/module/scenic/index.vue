<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="景区标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入景区标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="景区名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入景区名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="景区英文名" prop="englishName">-->
<!--        <el-input-->
<!--          v-model="queryParams.englishName"-->
<!--          placeholder="请输入景区英文名"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <!--<el-form-item label="景区服务" prop="comment">
        <el-input
          v-model="queryParams.comment"
          placeholder="请输入景区服务"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <!--<el-form-item label="景区图片" prop="image">
        <el-input
          v-model="queryParams.image"
          placeholder="请输入景区图片"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
<!--      <el-form-item label="门票销量" prop="sales">-->
<!--        <el-input-->
<!--          v-model="queryParams.sales"-->
<!--          placeholder="请输入门票销量"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="开放时间" prop="openUp">-->
<!--        <el-input-->
<!--          v-model="queryParams.openUp"-->
<!--          placeholder="请输入开放时间"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <!--<el-form-item label="产品ID" prop="admissionTicketId">
        <el-input
          v-model="queryParams.admissionTicketId"
          placeholder="请输入产品ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
<!--      <el-form-item label="费用包含" prop="contain">-->
<!--        <el-input-->
<!--          v-model="queryParams.contain"-->
<!--          placeholder="请输入费用包含"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
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
          v-hasPermi="['module:scenic:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:scenic:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:scenic:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:scenic:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="scenicList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="景区标题" align="center" prop="title" />
      <el-table-column label="景区名" align="center" prop="name" />
      <el-table-column label="景区英文名" align="center" prop="englishName" />
<!--      <el-table-column label="景区服务" align="center" prop="comment" />-->
<!--      <el-table-column label="景区图片" align="center" prop="image" >-->
<!--        <template  slot-scope="scope" >-->
<!--          <el-image :src="item.url" v-for="item in picList" min-width="70" height="70" />-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="景区介绍" align="center" prop="scenicContent" />-->
      <el-table-column label="门票销量" align="center" prop="sales" />
      <el-table-column label="开放时间" align="center" prop="openUp" />
      <el-table-column label="费用包含" align="center" prop="contain" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:scenic:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:scenic:remove']"
          >删除</el-button>
          <el-button type="text" icon="el-icon-edit" size="mini" @click="catchDetail(scope.row)">查看详情</el-button>
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
    <!--  查看详情 对话框-->
    <el-dialog title="查看详情"  customClass="customWidth" :visible.sync="openDetail" :close-on-click-modal="false" width="70%"  append-to-body>
      <el-form ref="form" :model="form" :rules="rules"  label-width="80px">
        <el-form-item label="景区标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入景区标题" />
        </el-form-item>
        <el-form-item label="景区名" prop="name">
          <el-input v-model="form.name" placeholder="请输入景区名" />
        </el-form-item>
        <el-form-item label="景区英文名" prop="englishName">
          <el-input v-model="form.englishName" placeholder="请输入景区英文名" />
        </el-form-item>
        <el-form-item label="景区服务" prop="comment">
          <el-input v-model="form.comment" placeholder="请输入景区服务" />
        </el-form-item>
        <el-form-item label="景区图片" prop="image">
          <el-image
            src="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg"
            style="padding: 10px;width: 30%; height: 30%"
            :preview-src-list="srcList"
            alt=""/>
          <span>点击图片可预览大图</span>

          <!-- <div>
             <div class="edit_container">
           <quill-editor v-model="form.image"
                         class="quill-editor ql-editor"
                         ref="myQuillEditor"
                         :options="editorOption"
                         @blur="onEditorBlur($event)"
                         @focus="onEditorFocus($event)"
                         @change="onEditorChange($event)"
           />
             </div>
           </div>-->
        </el-form-item>
        <el-form-item label="景区介绍" prop="scenicContent">
          <el-input v-model="form.scenicContent" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="门票销量" prop="sales">
          <el-input v-model="form.sales" placeholder="请输入门票销量" />
        </el-form-item>
        <el-form-item label="开放时间" prop="openUp">
          <el-input v-model="form.openUp" placeholder="请输入开放时间" />
        </el-form-item>
        <el-form-item label="费用包含" prop="contain">
          <el-input v-model="form.contain" placeholder="请输入费用包含" />
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加或修改景区信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="景区标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入景区标题" />
        </el-form-item>
        <el-form-item label="景区名" prop="name">
          <el-input v-model="form.name" placeholder="请输入景区名" />
        </el-form-item>
        <el-form-item label="景区英文名" prop="englishName">
          <el-input v-model="form.englishName" placeholder="请输入景区英文名" />
        </el-form-item>
        <el-form-item label="景区服务" prop="comment">
          <el-checkbox v-model="form.comment"
                       v-for="item in commentList"
                       :label="item.comment"
                       :value="item.comment"
                       placeholder="请输入景区服务"/>
        </el-form-item>
        <el-form-item label="景区图片" prop="image">
            <el-upload
              :action="uploadUrl"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleExceed"
              :before-upload="beforeAvatarUpload"
              multiple
              :file-list="picList"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
<!--            <el-dialog :visible.sync="dialogVisible">-->
<!--              <img width="100%" :src="dialogImageUrl" v-model="form.image" alt="">-->
<!--            </el-dialog>-->
 <!--           <div class="edit_container">
                   <quill-editor v-model="form.image"
                                 class="quill-editor ql-editor"
                                 ref="myQuillEditor"
                                 :options="editorOption"
                                 @blur="onEditorBlur($event)"
                                 @focus="onEditorFocus($event)"
                                 @change="onEditorChange($event)"
                   />
                     </div>
                   </div>-->
        </el-form-item>
        <el-form-item label="景区介绍" prop="scenicContent">
          <el-input v-model="form.scenicContent" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="门票销量" prop="sales">
          <el-input v-model="form.sales" placeholder="请输入门票销量" />
        </el-form-item>
        <el-form-item label="开放时间" prop="openUp">
          <el-input v-model="form.openUp" placeholder="请输入开放时间" />
        </el-form-item>
        <el-form-item label="费用包含" prop="contain">
          <el-input v-model="form.contain" placeholder="请输入费用包含" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listScenic, getScenic, delScenic, addScenic, updateScenic, exportScenic } from "@/api/module/scenic";

export default {
  name: "Scenic",
  data() {
    return {
      //景区服务
      commentList: [],
      picList: [],
      srcList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      //富文本编辑
      editorOption: {
        placeholder: '最多输入1000字。',
        modules: {
          imageDrop: true, //开启拖拽,
          toolbar: [
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
        },
        theme:'snow',
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
      // 景区信息表格数据
      scenicList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openDetail: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        name: undefined,
        englishName: undefined,
        comment: undefined,
        image: undefined,
        scenicContent: undefined,
        sales: undefined,
        openUp: undefined,
        admissionTicketId: undefined,
        contain: undefined
      },
      //上传的地址
      url: process.env.VUE_APP_BASE_API + "/api/file/download?fileName=",
      uploadUrl: process.env.VUE_APP_BASE_API + "/api/file/upload",
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        createTime: [
          { required: true, message: "费用包含不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "费用包含不能为空", trigger: "blur" }
        ],
        createBy: [
          { required: true, message: "费用包含不能为空", trigger: "blur" }
        ],
        updateBy: [
          { required: true, message: "费用包含不能为空", trigger: "blur" }
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
    open(val){
      if (val===false) {
        this.picList = []
        this.srcList = []
        this.commentList = []
      }
    }
  },
  methods: {

    //文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      console.log("fileList------")
      console.log(fileList)
      // var  uid = file.uid
      // console.log(uid)
      // uid.splice()
      this.picList = fileList
      console.log(this.picList)
    },
    //点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      // this.dialogImageUrl = file.url;
      // this.dialogVisible = true;
    },
    //文件上传成功时的钩子
    handleExceed(response, file, fileList) {
      //添加新的图片给后台
      file.url= response.data
      console.log("success-----------")
      //获取最新的list
      this.picList = fileList
    },
    //上传文件之前的钩子
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!');
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

    /** 查询景区信息列表 */
    getList() {
      this.loading = true;
      listScenic(this.queryParams).then(response => {
        this.scenicList = response.rows;
        console.log("scenicList----------------------")
        console.log(this.scenicList)
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
        createTime: undefined,
        updateTime: undefined,
        createBy: undefined,
        updateBy: undefined,
        delFlag: undefined,
        title: undefined,
        name: undefined,
        englishName: undefined,
        comment: undefined,
        image: undefined,
        scenicContent: undefined,
        sales: undefined,
        openUp: undefined,
        admissionTicketId: undefined,
        contain: undefined
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
      this.picList = [];
      this.title = "添加景区信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.picList=[]
      this.srcList = []
      this.commentList = [];
      this.reset();
      const id = row.id || this.ids
      getScenic(id).then(response => {
        this.form = response.data;
        console.log("form------------")
        console.log(this.form)
        if (this.form.image!=null)
        // this.picList = this.form.image;
        for (let i = 0; i < this.form.image.length; i++) {
          this.picList.push({
            'url': this.form.image[i],
          })
        }
        if (this.form.comment!=null)
        for (let j = 0; j < this.form.comment.length; j++) {
          this.commentList.push({
            'comment': this.form.comment[j]
          })
        }
        console.log("commentList----")
        console.log(this.commentList)
        console.log("piclist----")
        console.log(this.picList)
        // console.log(this.commentList[0].comment)

        this.open = true;
        this.title = "修改景区信息";
      });
    },
    //查看详情
    catchDetail(row) {
      this.picList=[]
      this.srcList = []
      this.commentList = []
      this.reset();
      const id = row.id || this.ids
      getScenic(id).then(response => {
        this.form = response.data;
        //遍历循环图片
        for (let j = 0; j <this.form.image.length ; j++) {
          //展示图
          this.picList.push({
            'url':this.form.image[0]
          })
          this.srcList.push(this.form.image[j])
          // this.srcList += this.form.image[j]+',';
        }
        // this.srcList =this.srcList.split(",");
        // //移除最后一个逗号带来的空数组
        // this.srcList.pop()
        console.log(this.srcList)
        this.openDetail =true;
        this.title = "查看详情";
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                    //把最新的图片数组提交
                    var images = [];
                    for (let i = 0; i < this.picList.length; i++) {
                      images.push(this.picList[i].url)
                    }
                    let parse = JSON.stringify(images);
                    //转换景区服务
                    var comments = [];
                    for (let j = 0; j < this.commentList.length; j++) {
                      console.log(this.commentList[j])
                      comments.push(this.commentList[j].comment)
                    }
                    let parse1 = JSON.stringify(comments);
                    this.form.image = parse
                    this.form.comment = parse1
                    // console.log(parse)
                    updateScenic(this.form).then(response => {
                      if (response.code === 200) {
                        this.msgSuccess("修改成功");
                        this.open = false;
                        this.getList();
                      }
                    });
                  } else {
                      addScenic(this.form).then(response => {
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
      this.$confirm('是否确认删除景区信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delScenic(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有景区信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportScenic(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>

<style type="text/css">
  p {
    margin: 10px;
  }
  .edit_container,
  .quill-editor {
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

