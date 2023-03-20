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
          v-hasPermi="['module:quarterlyReviewGroup:add']"
        >发布</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:quarterlyReviewGroup:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:quarterlyReviewGroup:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:quarterlyReviewGroup:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="quarterlyReviewGroupList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />

      <el-table-column type="index" label="序号" align="center" :index="indexMethod"/>
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="备注" align="center" prop="content" >
        <template slot-scope="scope">
          <span v-if="scope.row.content == null || scope.row.content === ''">-</span>
          <span v-else>{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column label="分数合计" align="center" prop="totalScore" >
        <template slot-scope="scope">
          <span v-if="scope.row.totalScore == null">-</span>
          <span v-else>{{scope.row.totalScore}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="状态" align="center" prop="state" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleItemShow(scope.row)"
          >设置分值</el-button>
          <!--<el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:quarterlyReviewGroup:edit']"
          >修改</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:quarterlyReviewGroup:remove']"
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

    <!-- 添加或修改考评任务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="950px" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" maxlength="200" show-word-limit/>
        </el-form-item>
        <el-form-item label="备注" prop="content">
          <el-input v-model="form.content"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 4}"
                    placeholder="请输入备注"
                    maxlength="50"
                    show-word-limit/>
        </el-form-item>
        <el-form-item label="指标项" prop="items">
          <!-- 左右选择器 -->
          <el-transfer v-model="form.items" :data="this.itemData" :titles="['备选指标', '已选指标']"/>
        </el-form-item>

        <!--<el-form-item label="状态" prop="state">
          <el-input v-model="form.state" placeholder="请输入状态" />
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 设置指标项分数 对话框 -->
    <el-dialog :title="title" :visible.sync="scoreOpen" width="700px" :close-on-click-modal="false" append-to-body>

      <el-table v-loading="taskItemLoading" :data="taskItemList">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" align="center" :index="indexMethod"/>
        <el-table-column label="标题" align="center" prop="itemName" />
        <el-table-column label="单项分值" width="80px" align="center" prop="maxScore" >
          <template slot-scope="scope">
            <span v-if="(scope.row.status == null || scope.row.status === '0') && scope.row.maxScore !== 0">{{scope.row.maxScore}}</span>
            <span style="color: #ff4949" v-if="(scope.row.status == null || scope.row.status === '0') && scope.row.maxScore === 0">{{scope.row.maxScore}}</span>
            <el-input size="mini" v-if="scope.row.status === '1'" v-model="scope.row.newScore" maxlength="3"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == null || scope.row.status === '0'"
              size="mini"
              type="text"
              icon="el-icon-setting"
              @click="handleSet(scope.row)"
            >设置</el-button>
            <span v-else>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-check"
                @click="handleSetOK(scope.row)"
              >确定</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-close"
              @click="handleSetCancel(scope.row)"
            >取消</el-button>
            </span>



          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="taskItemTotal>0"
        :total="taskItemTotal"
        :page.sync="taskItemQueryParams.pageNum"
        :limit.sync="taskItemQueryParams.pageSize"
        @pagination="getTaskItemList"
      />

      <div slot="footer" class="dialog-footer">
        合计：<span>{{totalScore}}</span> 分
        <el-button style="margin-left: 10px" @click="scoreCancel">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import {
  listQuarterlyReviewGroup, getQuarterlyReviewGroup, resetTotalScore,
  delQuarterlyReviewGroup, addQuarterlyReviewGroup, updateQuarterlyReviewGroup,
  exportQuarterlyReviewGroup
} from "@/api/module/quarterlyReviewGroup";
import { listQuarterlyReviewItem } from "@/api/module/quarterlyReviewItem";
import { listReviewGrpItemRela, getReviewGrpItemRela, setScoreById,
  delReviewGrpItemRela, addReviewGrpItemRela, updateReviewGrpItemRela,
  exportReviewGrpItemRela
} from "@/api/module/reviewGrpItemRela";

export default {
  name: "QuarterlyReviewGroup",
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
      // 考评任务表格数据
      quarterlyReviewGroupList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      // 是否显示分数设置对话框
      scoreOpen: false,

      totalScore: 0,

      // 记录任务id
      groupId: undefined,

      // 所有任务考评项
      taskItemList: [],
      itemData: [],
      // 任务考评项 table遮罩
      taskItemLoading: true,
      // 考评项总条数
      taskItemTotal: 0,
      // 考评项查询参数
      taskItemQueryParams: {
        /*orderByColumn: "create_time",
        isAsc: "desc",*/

        groupId: undefined,
        pageNum: 1,
        pageSize: 10,
      },
      allItemQueryParams: {
        orderByColumn: "order_num",
        isAsc: "asc",
        pageNum: 1,
        pageSize: 10000000,
      },

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
    this.getItemList();
  },
  methods: {
    /** 序号 */
    indexMethod(index) {
      return ++index;
    },
    /** 查询考评任务列表 */
    getList() {
      this.loading = true;
      listQuarterlyReviewGroup(this.queryParams).then(response => {
        this.quarterlyReviewGroupList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 获取所有考评项
    getItemList(){
      // this.itemLoading = true;

      listQuarterlyReviewItem(this.allItemQueryParams).then(response => {
        console.log(response.rows);
        response.rows.forEach(row => {
          this.itemData.push({
            key: row.id,
            label: row.title,
            disabled: false
          });
        });
        // this.itemList = response.rows;
        // this.itemTotal = response.total;
        // this.itemLoading = false;
      });
    },

    // 获取关联的考评项 参数: 任务id
    getTaskItemList(){
      this.taskItemLoading = true;
      this.taskItemQueryParams.groupId = this.groupId;
      listReviewGrpItemRela(this.taskItemQueryParams).then(response => {
        this.taskItemList = response.rows;
        console.log("-------------");
        console.log(this.taskItemList);
        this.taskItemTotal = response.total;
        this.taskItemLoading = false;
      });

    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.scoreOpen = false;
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
        title: undefined,
        content: undefined,
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
      this.ids = selection.map(item => item.id);
      this.single = selection.length!=1
      this.multiple = !selection.length
    },

    // 打开设置评分面板
    handleItemShow(row){
      this.scoreOpen = true;
      this.title = "设置考评分数";
      console.log(row);
      this.groupId = row.id; // 设置任务id
      this.getTaskItemList();
      if (row.totalScore != null)
        this.totalScore = row.totalScore;
    },

    // 关闭设置评分面板
    scoreCancel(){
      this.cancel();
      this.getList();
    },

    // 开启输入框 操作
    handleSet(row){
      row.status = '1';
      if (row.maxScore != null){
        row.newScore = row.maxScore;
      }
      console.log(row);
    },

    // 关闭输入框 操作
    handleSetCancel(row){
      row.status = '0';
    },

    // 设置分数
    handleSetOK(row){
      // 如果分数不规范 return
      if (!(row.newScore <= 100 && row.newScore >=0)){
        this.msgError("请正确输入格式");
        return;
      }

      setScoreById(row.id, row.newScore).then(response => {
        if (response.code === 200) {
          this.msgSuccess("设置成功");
          row.maxScore = parseInt(row.newScore);
          row.status = '0'; //关闭输入框
          // 重置分数
          resetTotalScore(row.groupId).then(response => {
            // 返回合计分数
            this.totalScore = response.data;
            // console.log(response);
          });
        }
      });


    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "发布考评任务";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getQuarterlyReviewGroup(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考评任务";
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      updateQuarterlyReviewGroup(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                    this.open = false;
                    this.loading = true;
                      addQuarterlyReviewGroup(this.form).then(response => {

                          if (response.code === 200) {
                              this.msgSuccess("新增成功");

                              var id = response.data;

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
      this.$confirm('是否确认删除考评任务编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delQuarterlyReviewGroup(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有考评任务数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportQuarterlyReviewGroup(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style>
  .el-transfer-panel{
    width: 300px;

  }
  .el-transfer-panel__list.is-filterable{
    height: 400px;
  }
</style>
