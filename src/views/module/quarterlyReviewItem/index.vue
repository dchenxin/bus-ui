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
          v-hasPermi="['module:quarterlyReviewItem:add']"
        >发布</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:quarterlyReviewItem:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:quarterlyReviewItem:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:quarterlyReviewItem:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="quarterlyReviewItemList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" align="center" :index="indexMethod"/>
      <!--<el-table-column label="编号" align="center" prop="number" />-->
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="指标分类" align="center" prop="type">
        <template slot-scope="scope">
          <span v-for="dict in sortOptions">
            <span v-if="scope.row.type === dict.dictValue">{{dict.dictLabel}}</span>
          </span>
          <!--<span v-if="scope.row.type === '1'">“三大创新”集成情况"</span>
          <span v-else-if="scope.row.type === '2'">农村人居环境整治“四化”集成情况</span>
          <span v-else-if="scope.row.type === '3'">“五大振兴”集成情况</span>
          <span v-else>其他</span>-->
        </template>
      </el-table-column>
      <el-table-column label="评分规则" align="center" prop="content" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.content == null || scope.row.content === ''">-</span>
          <span v-else>{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column label="参考分值" align="center" prop="score" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <!--<el-table-column label="状态" align="center" prop="state" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:quarterlyReviewItem:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:quarterlyReviewItem:remove']"
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

    <!-- 添加或修改考评项对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" maxlength="200" show-word-limit/>
        </el-form-item>
        <el-form-item label="指标分类" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option
              v-for="dict in sortOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
            <!--<el-option label="“三大创新”集成情况" value="1" />
            <el-option label="农村人居环境整治“四化”集成情况" value="2" />
            <el-option label="“五大振兴”集成情况" value="3" />
            <el-option label="其他" value="0" />-->
          </el-select>
        </el-form-item>

        <el-form-item label="参考分值" prop="score">
          <el-input style="width: 200px" v-model="form.score" placeholder="请输入参考分值" maxlength="3"/> 分
        </el-form-item>
        <el-form-item label="评分规则" prop="content">
          <rich-editor height="300" v-model="form.content"/>
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number v-model="form.orderNum" controls-position="right" />
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
import { listQuarterlyReviewItem, getQuarterlyReviewItem, delQuarterlyReviewItem, addQuarterlyReviewItem, updateQuarterlyReviewItem, exportQuarterlyReviewItem } from "@/api/module/quarterlyReviewItem";
import RichEditor from "../../components/richEditor/index";

export default {
  name: "QuarterlyReviewItem",
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


      sortOptions: [], // 指标类别

      // 总条数
      total: 0,
      // 考评项表格数据
      quarterlyReviewItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        orderByColumn: "order_num",
        isAsc: "asc",
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
        type: [
          { required: true, message: "类别不能为空", trigger: "blur" }
        ],
        score: [
          {required: true, message: "不能为空", trigger: "blur"},
          { pattern: /^[1-9]\d*$/, message: '必须为数字', trigger: 'blur' }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getSort();
  },
  methods: {
    indexMethod(index) {
      return ++index;
    },

    /** 查询考评项列表 */
    getList() {
      this.loading = true;
      listQuarterlyReviewItem(this.queryParams).then(response => {
        this.quarterlyReviewItemList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    getSort(){
      this.getDicts("t_review_item_type").then(response => {
        this.sortOptions = response.data;
        console.log(this.sortOptions)
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
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        delFlag: undefined,
        number: undefined,
        title: undefined,
        content: undefined,
        score: undefined,
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
      console.log(selection);
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加考评指标";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getQuarterlyReviewItem(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考评指标";
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      updateQuarterlyReviewItem(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                      addQuarterlyReviewItem(this.form).then(response => {
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
      this.$confirm('是否确认删除考评标题为 "' + row.title + '" 的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delQuarterlyReviewItem(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有考评项数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportQuarterlyReviewItem(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
