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
          v-hasPermi="['module:projectSupervision:add']"
        >发布</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:projectSupervision:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:projectSupervision:remove']"
        >删除</el-button>
      </el-col>-->
      <!--<el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:projectSupervision:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="projectSupervisionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />

      <el-table-column type="index" label="序号" :index="indexMethod"/>
      <el-table-column label="发布人" width="100px" align="center" prop="nickName" />

      <el-table-column label="发布时间" width="140px" align="center" prop="createTime" :formatter="dateFormatter"/>
      <el-table-column label="标题" width="140px" align="center" prop="title" />
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

      <!--<el-table-column label="视频" width="150px" align="center" prop="video" >
        <template slot-scope="scope">
          <video
            v-if="scope.row.video!=null && scope.row.video!=='[]' && scope.row.video!==''"
            style="width: 150px; height: 80px; padding: 0 20px; display: flex; justify-content:center; align-items:center"
            controls="controls"
            :src="firstVideo(scope.row)"
            fit="cover"
            preload="auto"
            :preview-src-list="firstVideoArray(scope.row)"
          >
          </video>
          <span v-else>-</span>
        </template>
      </el-table-column>-->

      <el-table-column label="相关文件" width="100px" align="center" prop="pdfFile" show-overflow-tooltip >
        <template slot-scope="scope">
          <div v-if="scope.row.pdfFile!=null && scope.row.pdfFile!=='[]' && scope.row.pdfFile!==''" style="color: #00afff">
            <!--<a download :href="downloadpdf(scope.row.pdfFile)" target="_blank" ><u>预览</u></a>-->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-document"
              @click="handlePdfs(scope.row)"
            >预览</el-button>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="村名" width="120px" align="center" prop="ruralId" >
        <template slot-scope="scope">
          <span v-if="scope.row.ruralName==null || scope.row.ruralName===''">-</span>
          <span v-else>{{scope.row.ruralName}}</span>
          <!--<span v-for="rural in ruralList">
            <span v-if="rural.id ===scope.row.ruralId">{{rural.villageName}}</span>
          </span>-->
          <!--<span v-if="scope.row.ruralId!=null && scope.row.ruralId!==''">{{scope.row.ruralId}}</span>
          <span v-else>-</span>-->
        </template>
      </el-table-column>

      <el-table-column label="项目负责人" width="100px" align="center" prop="projectLeader" >
        <template slot-scope="scope">
          <span v-if="scope.row.projectLeader==null || scope.row.projectLeader===''">-</span>
          <span v-else>{{scope.row.projectLeader}}</span>
        </template>
      </el-table-column>

      <el-table-column label="项目进度" align="center" prop="projectSchedule" >
        <template slot-scope="scope">
          <span v-if="scope.row.projectSchedule==null || scope.row.projectSchedule===''">-</span>
          <span v-else>{{scope.row.projectSchedule}}%</span>
        </template>
      </el-table-column>

      <el-table-column label="总投资额" width="120px" align="center" prop="totalInvestment" >
        <template slot-scope="scope">
          <span v-if="scope.row.totalInvestment==null || scope.row.totalInvestment===''">-</span>
          <span v-else>{{sumFormat(scope.row.totalInvestment)}}元</span>
        </template>
      </el-table-column>

      <el-table-column label="已投资额" width="120px" align="center" prop="readyInvestment" >
        <template slot-scope="scope">
          <span v-if="scope.row.readyInvestment==null || scope.row.readyInvestment===''">-</span>
          <span v-else>{{sumFormat(scope.row.readyInvestment)}}元</span>
        </template>
      </el-table-column>

      <el-table-column label="简介" align="center" prop="introduce" width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.introduce!=null && scope.row.introduce!==''">{{scope.row.introduce}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="内容" align="center" prop="content" min-width="200px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.content!=null && scope.row.content!==''">{{scope.row.content}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>-->


      <el-table-column label="警告次数" align="center" prop="warnNum" />
      <el-table-column label="警告等级" align="center" prop="warnNum" >
        <template slot-scope="scope">
          <span v-if="scope.row.warnNum<=3" style="color:#13ce66;">绿</span>
          <span style="color: #ffba00" v-else-if="scope.row.warnNum<=6">黄</span>
          <span style="color: red" v-else>红</span>
        </template>
      </el-table-column>

      <el-table-column label="浏览量" align="center" prop="viewNum" />
      <el-table-column label="状态" align="center" v-if="checkRole(['villageAdmin']) || checkRole(['admin'])">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state" active-value="put" inactive-value="off" @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" fixed="right" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
          >详情</el-button>
          <el-button
            v-if="(checkRole(['countryAdmin']) || checkRole(['cityAdmin']) || checkRole(['admin']))
            && scope.row.isWarn === false"
            size="mini"
            type="text"
            icon="el-icon-warning"
            @click="handleWarn(scope.row)"
          >警告</el-button>
          <el-button
            v-if="(checkRole(['countryAdmin']) || checkRole(['cityAdmin']) || checkRole(['admin']))
            && scope.row.isWarn === true"
            size="mini"
            type="text"
            icon="el-icon-warning"
            @click="cancelWarn(scope.row)"
          >撤销警告</el-button>
          <el-button
            v-hasRole="['villageAdmin']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:projectSupervision:edit']"
          >修改</el-button>
          <el-button
            v-hasRole="['villageAdmin']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:projectSupervision:remove']"
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

    <!-- 添加或修改项目监督信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">

        <!--<el-form-item label="发布人id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入发布人id" />
        </el-form-item>-->
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" maxlength="30" show-word-limit/>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <!--<el-input v-model="form.image" placeholder="请输入商品图片" />-->
          <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            multiple
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


        <!--<el-form-item label="视频" prop="video">
          &lt;!&ndash;<el-input v-model="form.video" placeholder="请输入视频内容" />&ndash;&gt;
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
        </el-form-item>-->

        <el-form-item label="文档上传" prop="pdfFile">
          <el-upload
            :file-list="pdfList"
            multiple
            list-type="text"
            :before-upload="pFileBeforeUpload"
            :on-success="handlepdfSuccess"
            :on-remove="handlepdfRemove"
            :action="uploadUrl">

            <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
<!--            <div slot="tip" class="el-upload__tip">只能上传不超过 20MB 的.pdf或.doc或.docx文件，限三个</div>-->
          </el-upload>
          <!--          <el-input v-model="form.pdfFile" placeholder="请输入pdf" />-->
        </el-form-item>

        <el-form-item label="村名" prop="ruralId">
          <!--<el-input v-model="form.ruralId" placeholder="请输入村编号" />-->
          <el-cascader style="width: 200px" :options="ruralOptions" v-model="currentValue" @change="cascaderChange" :show-all-levels="false" />
        </el-form-item>
        <el-form-item label="项目负责人" prop="projectLeader">
          <!--<el-input v-model="form.personId" placeholder="请输入负责人id" />-->
          <!--<el-select v-model="form.personId" clearable filterable placeholder="请选择负责人">
            <el-option
              v-for="item in personList"
              :key="item.id"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>-->
          <el-input style="width: 200px" v-model="form.projectLeader" placeholder="请输入项目负责人姓名" maxlength="15"/>
        </el-form-item>
        <el-form-item label="项目进度" prop="projectSchedule">
          <el-input style="width: 200px" v-model="form.projectSchedule" placeholder="请输入项目进度百分比" maxlength="15"/><span>  %</span>
        </el-form-item>
        <el-form-item label="总投资额" prop="totalInvestment" >
          <el-input style="width: 200px" v-model="form.totalInvestment" placeholder="请输入项目总投资额" maxlength="15"/><span>  元</span>
        </el-form-item>
        <el-form-item label="已投资额" prop="readyInvestment">
          <el-input style="width: 200px" v-model="form.readyInvestment" placeholder="请输入项目已投资额" maxlength="15"/><span>  元</span>
        </el-form-item>

        <el-form-item label="简介" prop="introduce">
          <el-input type="textarea" :rows="2" v-model="form.introduce" maxlength="30" placeholder="请输入简介，30字以内" show-word-limit/>
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

        <!--<el-form-item label="警告次数" prop="warnNum">
          <el-input v-model="form.warnNum" placeholder="请输入警告次数" />
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 项目监督信息 详情 对话框 -->
    <el-dialog :title="title" :visible.sync="detailOpen" width="900px" append-to-body>
      <el-form ref="form" :model="form" label-width="90px">
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
        <!--<el-form-item label="视频" prop="video">
          <div style="padding: 0 10px;" v-if="form.video!=null && form.video !=='[]'">
            <video :src="detailVideo" controls="controls" preload="auto" style="width: 654px;height: 368px" />
          </div>
          <span v-else style="padding: 0 10px;">暂未上传视频</span>
          &lt;!&ndash;<el-input v-model="form.image" placeholder="请输入商品图片" disabled/>&ndash;&gt;
        </el-form-item>-->
        <el-form-item label="简介" prop="introduce">
          <span v-if="form.introduce!=null && form.introduce!==''" style="padding-left: 10px">{{form.introduce}}</span>
          <span v-else style="padding-left: 10px">-</span>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <div style="">
            <span v-if="form.content!=null" v-html="form.content"/>
            <span style="padding: 0 10px;" v-else >-</span>
          </div>
        </el-form-item>

        <el-form-item label="村名" prop="ruralId">
          <span style="padding: 0 10px;" v-if="form.ruralName==null || form.ruralName===''">-</span>
          <span style="padding: 0 10px;" v-else>{{form.ruralName}}</span>
          <!--<span v-for="rural in ruralList">
            <span style="padding: 0 10px;" v-if="rural.id ===form.ruralId">{{rural.villageName}}</span>
          </span>-->
        </el-form-item>

        <!--<el-form-item label="负责人" prop="personId">
          <span style="padding: 0 10px;" v-if="form.personId==null || form.personId===''">-</span>
          <span v-for="user in userList">
            <span style="padding: 0 10px;" v-if="user.userId ===form.personId">{{user.nickName}}</span>
          </span>
        </el-form-item>-->
        <el-form-item label="项目负责人" prop="projectLeader">
          <span v-if="form.projectLeader!=null" style="padding-left: 10px">{{form.projectLeader}}</span>
          <span v-else style="padding-left: 10px">-</span>
        </el-form-item>
        <el-form-item label="项目进度" prop="projectSchedule">

          <span v-if="form.projectSchedule!=null" >
            <el-progress style="padding: 0 20px" :text-inside="true" :stroke-width="26" :percentage="form.projectSchedule" />
          </span>
          <!--<span v-if="form.projectSchedule!=null" style="padding-left: 10px">{{form.projectSchedule}}</span>-->
          <span v-else style="padding-left: 10px">-</span>
        </el-form-item>
        <el-form-item label="总投资额" prop="totalInvestment">
          <span v-if="form.totalInvestment!=null" style="padding-left: 10px">{{sumFormat(form.totalInvestment)}} 元</span>
          <span v-else style="padding-left: 10px">-</span>
        </el-form-item>
        <el-form-item label="已投资额" prop="readyInvestment">
          <span v-if="form.readyInvestment!=null" style="padding-left: 10px">{{sumFormat(form.readyInvestment)}} 元</span>
          <span v-else style="padding-left: 10px">-</span>
        </el-form-item>


        <el-form-item label="浏览量" prop="viewNum">
          <span v-if="form.viewNum!=null" style="padding-left: 10px">{{form.viewNum}} 次</span>
          <span v-else style="padding-left: 10px">-</span>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 文件预览列表 -->
    <el-dialog title="pdf 预览列表" :visible.sync="pdfOpen" width="900px" append-to-body>
      <div style="padding: 5px 0" v-for="item in pdfList">
        <el-tag style="font-size: 17px">
          <i class="el-icon-notebook-2"/>
          <a :href="item.url" target="_blank"> {{item.name}}</a>
        </el-tag>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  listProjectSupervision,
  getProjectSupervision,
  delProjectSupervision,
  addProjectSupervision,
  updateProjectSupervision,
  exportProjectSupervision,
  warn, cancelWarn, changeNewStatus
} from "@/api/module/projectSupervision";
import { listRuralInfo, optionRuralInfo, optionsByType, optionRuralByUserType, getCodeArray, getPersons, listRural } from "@/api/module/ruralInfo";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数

export default {
  name: "ProjectSupervision",
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
      // 项目监督信息表格数据
      projectSupervisionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      //  pdf列表弹出
      pdfOpen: false,

      // 详情开关
      detailOpen: false,

      // 所有乡村option列表 label value
      ruralOptions: [],
      // 保存当前选择器的值 如：["N01000000", "N01M01000", "N01M01X01"]
      currentValue: [],
      // 所有的村负责人
      // personList: [],

      // 详情图片
      detailImages: [],

      // 图片对象数组, 用于编辑
      picList: [],
      hideImageUploadEdit: false, // 上传限制 隐藏上传按钮
      limit: 3, //图片数量限制
      dialogImageUrl: '', //预览路径
      dialogVisible: false, //预览开关
      uploadUrl: process.env.VUE_APP_BASE_API + "/api/file/upload", //上传路径

      //视频数组
      /*videoList:[],
      videoLimit: 1,
      hideVideoUploadEdit: false, // 上传限制 隐藏上传按钮
      detailVideo:'', //详情中视频url
      videoFlag:false , //是否显示进度条
      videoUploadPercent:"", //进度条的进度，
      isShowUploadVideo:false, //显示上传按钮
      uploadVideoUrl: process.env.VUE_APP_BASE_API + "/api/file/uploadvideo",*/

      // pdf文件数组
      /*efileLpFilist:[],*/
      // pdf弹出列表展示
      pdfList: [],

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
        title: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          {required: true, message: "标题不能为空", trigger: "blur"}
        ],
        ruralId: [
          {required: true, message: "村名不能为空", trigger: "blur"}
        ],
        projectSchedule: [
          {pattern: /^(0|[1-9]\d?|100)$/, message: '项目进度在0-100之间', trigger: 'blur'}
        ],
        totalInvestment: [
          {pattern: /^[1-9]\d*$/, message: '总投资额必须为数字', trigger: 'blur'}
        ],
        readyInvestment: [
          {pattern: /^[1-9]\d*$/, message: '已投资额必须为数字', trigger: 'blur'}
        ],
      }
    };
  },
  created() {
    this.getRuralOptions();
    // this.getRuralList();
    this.getList();
  },
  watch: {
    // 新增和编辑 关闭时清空图片对象数组
    open(val){
      if (val===false) {
        this.picList = [];
        // this.videoList = [];
        this.pdfList = [];
        this.hideImageUploadEdit = false;
        // this.hideVideoUploadEdit = false;
        this.currentValue = undefined;
        // this.personList = [];
      }
    },
    // 详情 关闭时清空图片对象数组
    detailOpen(value){
      if (value===false) {
        this.detailImages = [];
        // this.detailVideo = '';
        this.pdfList = [];
      }
    },
    // pdf列表 关闭时清空数组
    pdfOpen(value){
      if (value===false) {
        this.pdfList = [];
      }
    },
    // 监听选择器 => ruralId
    currentValue(values){
      // console.log("级联选择器 变化");
      if (values!=null) this.form.ruralId = values[ values.length - 1];
      // 刷新村负责人列表
      /*if (this.form.ruralId != null){
        getPersons(this.form.ruralId).then(response => {
          // this.personList = response.data;
        });

      }*/
    }
  },
  methods: {
    checkRole,

    /*列表number*/
    indexMethod(index) {
      return ++index;
    },

    /** 查询项目监督信息列表 */
    getList() {
      this.loading = true;
      listProjectSupervision(this.queryParams).then(response => {
        this.projectSupervisionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 获取所有的乡村列表
    /*getRuralList(){
      listRural().then(response => {
        this.ruralList = response.rows;
      });
    },*/

    // 获取所有的乡村 给选择器option
    getRuralOptions(){
      optionsByType('50').then(response => {
        this.ruralOptions = response.data;
        // console.log(response);
      });
    },

    // 级联选择器change监听
    cascaderChange(){
      // this.form.personId = null;
      // console.log(this.form)
    },

    /* 千分位显示金额 */
    sumFormat(cellValue) {
      if (cellValue) {
        cellValue += "";
        if (!cellValue.includes(".")) cellValue += ".";
        return cellValue
          .replace(/(\d)(?=(\d{3})+\.)/g, ($0, $1) => {
            return $1 + ",";
          })
          .replace(/\.$/, "");
      }
    },

    //富文本编辑器---------------
    onEditorReady(editor) {}, // 准备编辑器
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus(val, editor) {
      // console.log(val); // 富文本获得焦点时的内容
      // editor.enable(false); // 在获取焦点的时候禁用
    }, // 获得焦点事件
    onEditorChange() {}, // 内容改变事件
    saveQuillEditorValue: function(event) {
      alert(this.quillEidtorValue);
    }, //-----------------------

    // 获取首张图片 url =========================================image
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
      // const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
      }
      /*if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!');
      }*/
      return isJPG;
    },

    /*//封面视频 ==============================================video
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
      console.log(fileList)
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
    }, // ===============================================================================*/

    // pdf预览 ===============================================================pdf
    downloadpdf(fileName) {
      if (fileName==null||fileName=='[]'||fileName=='') return '';
      return  JSON.parse(fileName)[0];

    },
    // pdf上传成功
    handlepdfSuccess(response, file, fileList) {
      file.url = response.data;
      console.log("pdf上传成功");
      console.log(fileList);
      this.pdfList = fileList;
    },
    // pdf移除事件
    handlepdfRemove(file, fileList) {
      //console.log(file, fileList);
      this.pdfList = fileList;
    },
    // 点击pdf事件
    handlePdfPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //上传前校验pdf,doc,docx
    pFileBeforeUpload(file) {
      //console.log(file)
      const isPDF = file.type === 'application/pdf';
      const isdoc = file.type ==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'||
        file.type ==='application/msword';
      const isLt20M = file.size / 1024 / 1024 < 20;

      if (!isPDF&&!isdoc) {
        this.$message.error('上传文件只能是 pdf,doc,docx文件!');
      }
      /*if (!isLt20M) {
        this.$message.error('上传文件大小不能超过 20MB!');
      }*/

      return isPDF||isdoc;
    },
    //==============================================

    // 富文本图片上传前 ============================================富文本
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

    // 资讯状态修改
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

    // 取消按钮
    cancel() {
      this.open = false;
      this.detailOpen= false;
      this.pdfOpen = false;
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
        userId: undefined,
        title: undefined,
        image: undefined,
        pdfFile: undefined,
        content: undefined,
        // video: undefined,
        ruralId: undefined,
        personId: undefined,
        projectLeader: undefined,
        projectSchedule: undefined,
        totalInvestment: undefined,
        readyInvestment: undefined,
        viewNum: undefined,
        warnNum: undefined
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

    // 展示pdf列表按钮
    handlePdfs(row){
      this.pdfOpen = true;
      /*if (row.pdfFile!=null && row.pdfFile!=='' && row.pdfFile!=='[]'){
        this.pdfList = JSON.parse(row.pdfFile); //详情的图片数组
      }*/

      // 读取 PDF数组 -> PDF对象数组
      if (row.pdfFile != null && row.pdfFile !== '[]' && row.pdfFile !== ''){
        var pdfArray = JSON.parse(row.pdfFile);
        var patt = /^\[.*\]$/ ;
        if (row.pdfName != null && row.pdfName !== '[]'
          && row.pdfName !== '' && patt.test(row.pdfName))
          var pdfNameArray = JSON.parse(row.pdfName);

        for (let j = 0; j < pdfArray.length; j++) {
          this.pdfList.push({
            'url': pdfArray[j],
            'name': pdfNameArray == null || pdfNameArray[j] == null ? '未命名文档 ' + ++j : pdfNameArray[j]
          })
        }
        console.log(this.pdfList);
      }
    },
    // 警告一次
    handleWarn(row){
      const id = row.id;
      this.$confirm('是否确认警告项目 "' + row.title + '" 的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return warn(id);
      }).then(() => {
        this.getList();
        this.msgSuccess("警告成功");
      }).catch(function() {});

    },
    // 取消警告
    cancelWarn(row){
      const id = row.id;
      this.$confirm('是否确认撤销警告项目 "' + row.title + '" 的数据项?', "撤销警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return cancelWarn(id);
      }).then(() => {
        this.getList();
        this.msgSuccess("撤销成功");
      }).catch(function() {});

    },
    // 详情页按钮操作
    handleDetail(row) {
      this.reset();
      const id = row.id;
      getProjectSupervision(id).then(response => {
        this.form = response.data;
        if (this.form.image!=null && this.form.image!=='' && this.form.image!=='[]'){
          this.detailImages = JSON.parse(this.form.image); //详情的图片数组
        }
        /*if (this.form.video!=null && this.form.video!=='' && this.form.video!=='[]'){
          this.detailVideo = JSON.parse(this.form.video)[0]; //详情的视频 url
        }*/

        this.detailOpen = true;
        this.title = "资讯详情";
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "发布项目资讯";
    },
    /** 修改按钮操作 */
    handleUpdate: function (row) {
      this.reset();
      const id = row.id || this.ids
      getProjectSupervision(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改项目资讯";
        this.currentValue = this.form.currentValue;

        // 读取 图片数组 -> 图片对象数组
        if (this.form.image != null && this.form.image !== '[]' && this.form.image !== '') {
          for (let j = 0; j < JSON.parse(this.form.image).length; j++) {
            this.picList.push({
              'url': JSON.parse(this.form.image)[j]
            })
          }
          this.hideImageUploadEdit = this.picList.length >= this.limit;
        }

        // 读取 视频数组 -> 视频对象数组
        /*if (this.form.video != null && this.form.video !== '[]' && this.form.video !== '') {
          for (let j = 0; j < JSON.parse(this.form.video).length; j++) {
            this.videoList.push({
              'url': JSON.parse(this.form.video)[j],
              'name': JSON.parse(this.form.video)[j]
            })
          }
          this.hideVideoUploadEdit = this.videoList.length >= this.videoLimit;
        }*/

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
            this.pdfList.push({
              'url': pdfArray[j],
              'name': pdfNameArray == null || pdfNameArray[j] == null ? '未命名文档 ' + ++j : pdfNameArray[j]
            })
          }
        }

      });
      // 获取级联选择器数组 回显
      /*const code = row.ruralId;
      if (code != null) {
        getCodeArray(code).then(response => {
          this.currentValue = response.data;
        });
        // 刷新村负责人列表
        /!*getPersons(code).then(response => {
          // this.personList = response.data;
        });*!/
      }*/

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
                    /*var videos = [];
                    for (let i = 0; i <this.videoList.length ; i++) {
                      videos.push(this.videoList[i].url)
                    }
                    this.form.video =JSON.stringify(videos);
                    console.log("-------");
                    console.log(this.form.video);*/

                    // 提交时保存为 json 格式
                    var pdfs = [];
                    var pdfNames = [];
                    for (let i = 0; i < this.pdfList.length; i++) {
                      pdfs.push(this.pdfList[i].url);
                      pdfNames.push(this.pdfList[i].name);
                    }
                    this.form.pdfFile = JSON.stringify(pdfs);
                    this.form.pdfName = JSON.stringify(pdfNames);

                      updateProjectSupervision(this.form).then(response => {
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
                    console.log("-------");
                    console.log(this.form.image);

                    // 提交时视频保存为 json 格式
                    /*var videos = [];
                    for (let i = 0; i <this.videoList.length ; i++) {
                      videos.push(this.videoList[i].url)
                    }
                    this.form.video =JSON.stringify(videos);
                    console.log("-------");
                    console.log(this.form.video);*/

                    // 提交时保存为 json 格式
                    var pdfs = [];
                    var pdfNames = [];
                    for (let i = 0; i < this.pdfList.length; i++) {
                      pdfs.push(this.pdfList[i].url);
                      pdfNames.push(this.pdfList[i].name);
                    }
                    this.form.pdfFile = JSON.stringify(pdfs);
                    this.form.pdfName = JSON.stringify(pdfNames);

                      addProjectSupervision(this.form).then(response => {
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
      this.$confirm('是否确认删除项目 "' + row.title + '" 的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delProjectSupervision(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有项目监督信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportProjectSupervision(queryParams);
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
