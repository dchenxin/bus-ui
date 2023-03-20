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
          v-hasPermi="['module:mallSort:add']"
        >发布</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:mallSort:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:mallSort:remove']"
        >删除</el-button>
      </el-col>-->
      <!--<el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:mallSort:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="mallSortList" @selection-change="handleSelectionChange"
              rowKey="id"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column type="selection" width="55" align="center" />
      <!--<el-table-column type="index" label="序号" align="center" :index="indexMethod"/>-->


      <!--<el-table-column label="父id" align="center" prop="parentId" />-->
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="类型" align="center" prop="sortLevel" >
        <template slot-scope="scope">
          <span v-if="scope.row.sortLevel === '1'">一级分类</span>
          <span v-if="scope.row.sortLevel === '2'">二级分类</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" prop="image" >
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.image!=null && scope.row.image!=='[]' && scope.row.image!==''"
            style="width: 150px; height: 80px; padding: 0 20px; display: inline-flex; justify-content:center; align-items:center"
            :src="getFirstImage(scope.row)"
            fit="cover"
            :preview-src-list="getFirstImageAsArray(scope.row)">
          </el-image>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="关联商品" align="center" prop="productName" >
        <template slot-scope="scope">
          <span v-if="scope.row.productName!=null  && scope.row.productName!==''">{{scope.row.productName}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>-->
      <!--<el-table-column label="状态" align="center" prop="state" />-->
      <el-table-column label="浏览量" align="center" prop="viewNum" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" >
        <template slot-scope="scope">
          <span v-if="scope.row.sortLevel === '1'" style="color: #36a3f7; font-weight: bold;">{{scope.row.orderNum}} (一级)</span>
          <span v-else-if="scope.row.sortLevel === '2'" >{{scope.row.orderNum}} (二级)</span>
          <span v-else>-</span>
        </template>

      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:mallSort:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:mallSort:remove']"
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

    <!-- 添加或修改商城分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px"  :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="分类级别" prop="sortLevel">
          <el-select v-model="form.sortLevel" placeholder="请选择分类级别">
            <el-option label="一级分类" value="1" />
            <el-option label="二级分类" value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="父菜单" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择父菜单">
            <el-option
              v-for="item in mallSortList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input style="width: 200px" v-model="form.title" placeholder="请输入标题" maxlength="4" show-word-limit/>
        </el-form-item>
        <el-form-item label="图片" prop="image">
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
        <!--<el-form-item label="关联商品" prop="productId" v-show="form.sortLevel === '2'">
          <el-select v-model="form.productId" placeholder="请选择关联商品" filterable clearable>
            <el-option
              v-for="item in mallProductList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>-->

        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number v-model="form.orderNum" controls-position="right" :min="1" />
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
import {
  listMallSort, getMallSort, delMallSort, addMallSort, updateMallSort,
  exportMallSort, test
} from "@/api/module/mallSort";
import {
  listMallProduct,
} from "@/api/module/mallProduct";

export default {
  name: "MallSort",
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
      // 商城分类表格数据
      mallSortList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      // 所有商城商品
      mallProductList: [],

      // 图片对象数组
      picList: [],
      limit: 1,
      hideImageUploadEdit: false, // 上传限制 隐藏上传按钮
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: process.env.VUE_APP_BASE_API + "/api/file/upload",

      // 查询参数
      queryParams: {
        orderByColumn: "order_num",
        isAsc: "asc",
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        sortLevel: [
          { required: true, message: "类型不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "序号不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getMallProducts();
    this.getTest();
  },
  methods: {
    /** 查询商城分类列表 */
    getList() {
      this.loading = true;
      listMallSort(this.queryParams).then(response => {
        this.mallSortList = response.rows;
        this.total = response.total;
        this.loading = false;
          //console.log(response.rows);
      });
    },

    // 查询所有商城商品
    getMallProducts() {
      listMallProduct().then(response => {
        this.mallProductList = response.rows;

      });
    },

    // 查询所有商城商品
    getTest() {
      test().then(response => {
        //console.log(response);
      });
    },

    // 获取首张图片 url ----------------------------- 首页图片
    getFirstImage(row){
      var images=[];
      if (row.image!=null && row.image!=='[]'){
        images = JSON.parse(row.image);
        // console.log("----------");
        // console.log(images[0]);
        return images[0];
      }
      return null;
    },

    getFirstImageAsArray(row){
      var images=[];
      images.push(this.getFirstImage(row));
      return images;
    }, // ----------------------------------------

    // 加文件、上传成功和上传失败时都会被调用 --------------------------- 图片上传
    handleEditChange(file, fileList) {
      this.hideImageUploadEdit = fileList.length >= this.limit;
      // console.log("this.fileList:", this.fileList);
      // console.log("this.hideUploadEdit:", this.hideImageUploadEdit);
    },

    // 图片上传成功
    handleSuccess(response, file, fileList){
        //console.log(file);
        //console.log(fileList);
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
    }, // ------------------------------------------------------------------

      // 取消按钮
      cancel() {
          this.open = false;
          //this.form.image = [];
          //this.picList=[];
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
        sortLevel: undefined,
        parentId: undefined,
        title: undefined,
        image: undefined,
        productId: undefined,
        state: undefined,
        viewNum: undefined,
        orderNum: undefined
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
      this.title = "添加商城分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.picList=[];
      const id = row.id || this.ids
      getMallSort(id).then(response => {
        this.form = response.data;
          // 读取 图片数组 -> 图片对象数组
          if (this.form.image!=null)
          for (let j = 0; j <JSON.parse(this.form.image).length ; j++) {
              this.picList.push({
                  'url':JSON.parse(this.form.image)[j]
              })
          }
        this.open = true;
        this.title = "修改商城分类";
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      //console.log(this.form);
                      // 提交时保存为 json 格式
                      var images = [];
                      for (let i = 0; i <this.picList.length ; i++) {
                          images.push(this.picList[i].url)
                      }
                      this.form.image =JSON.stringify(images);
                      console.log()
                      updateMallSort(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.picList=[];
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
                      addMallSort(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("新增成功");
                              this.open = false;
                              this.picList=[];
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
      this.$confirm('是否确认删除商城分类为"' + row.title + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMallSort(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有商城分类数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportMallSort(queryParams);
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
