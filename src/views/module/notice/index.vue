<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="景区名" prop="scenicId">
        <el-select v-model="queryParams.scenicId" clearable filterable  placeholder="请输入景区名">
          <el-option
            v-for="item in scenicList"
            :label="item.title"
            :value="item.id"
          /></el-select>
      </el-form-item>
      <!--<el-form-item label="景区id" prop="scenicId">
        <el-input
          v-model="queryParams.scenicId"
          placeholder="请输入景区id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预定说明" prop="explain">
        <el-input
          v-model="queryParams.explain"
          placeholder="请输入预定说明"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="使用方法" prop="way">
        <el-input
          v-model="queryParams.way"
          placeholder="请输入使用方法"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="使用时间" prop="date">
        <el-input
          v-model="queryParams.date"
          placeholder="请输入使用时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="免票政策" prop="policy">
        <el-input
          v-model="queryParams.policy"
          placeholder="请输入免票政策"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="退改规则" prop="rule">
        <el-input
          v-model="queryParams.rule"
          placeholder="请输入退改规则"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="购票须知" prop="security">
        <el-input
          v-model="queryParams.security"
          placeholder="请输入购票须知"
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['module:notice:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:notice:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:notice:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:notice:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="景区id" align="center" prop="scenicId" />-->
      <el-table-column label="景区名" align="center" prop="scenicId" >
        <template slot-scope="scope">
          <span v-for="(item, index) in scenicList">
            <span v-if="item.id == scope.row.scenicId">{{item.title}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="预定说明" align="center" prop="reserveExplain" />
      <el-table-column label="使用方法" align="center" prop="way" />
      <el-table-column label="使用时间" align="center" prop="date" />
      <el-table-column label="免票政策" align="center" prop="policy" />
      <el-table-column label="退改规则" align="center" prop="rule" />
      <el-table-column label="购票须知" align="center" prop="security" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:notice:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:notice:remove']"
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

    <!-- 添加或修改须知对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="景区名" prop="scenicId">
<!--          <el-input v-model="form.scenicId" placeholder="请输入景区id" />-->
          <el-select v-model="form.scenicId" clearable filterable  placeholder="请输入景区名">
            <el-option
              v-for="item in scenicList"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="预定说明" prop="reserveExplain">
          <el-input type="textarea" v-model="form.reserveExplain" autosize placeholder="请输入预定说明" />
        </el-form-item>

        <el-form-item label="使用方法" prop="way">
          <el-input type="textarea" v-model="form.way" autosize placeholder="请输入使用方法" />
        </el-form-item>
        <el-form-item label="免票政策" prop="policy">
          <el-input type="textarea" v-model="form.policy" autosize placeholder="请输入免票政策" />
        </el-form-item>
        <el-form-item label="退改规则" prop="rule">
          <el-input type="textarea" v-model="form.rule" autosize placeholder="请输入退改规则" />
        </el-form-item>
        <el-form-item label="购票须知" prop="security">
          <el-input type="textarea" v-model="form.security" autosize placeholder="请输入购票须知" />
        </el-form-item>
        <el-form-item label="使用时间" prop="date">
          <el-input type="textarea" v-model="form.date" autosize placeholder="请输入使用时间" />
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
import { listNotice, getNotice, delNotice, addNotice, updateNotice, exportNotice } from "@/api/module/notice";
import { listScenic, getScenic, delScenic, addScenic, updateScenic, exportScenic } from "@/api/module/scenic";

export default {
  name: "Notice",
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
      // 须知表格数据
      noticeList: [],

      scenicList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        scenicId: undefined,
        reserveExplain: undefined,
        way: undefined,
        date: undefined,
        policy: undefined,
        rule: undefined,
        security: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        createBy: [
          { required: true, message: "购票须知不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "购票须知不能为空", trigger: "blur" }
        ],
        updateBy: [
          { required: true, message: "购票须知不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "购票须知不能为空", trigger: "blur" }
        ],
        delFlag: [
          { required: true, message: "购票须知不能为空", trigger: "blur" }
        ],
        /*date: [
          { required: true, message: "使用时间不能为空", trigger: "blur" }
        ],*/
      }
    };
  },
  created() {
    this.getList();
    this.getScenicList();
  },
  methods: {
    /** 查询须知列表 */
    getList() {
      this.loading = true;
      listNotice(this.queryParams).then(response => {
        this.noticeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getScenicList(){
      listScenic().then(response => {
        this.scenicList = response.rows;
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
        scenicId: undefined,
        reserveExplain: undefined,
        way: undefined,
        date: undefined,
        policy: undefined,
        rule: undefined,
        security: undefined
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
      this.title = "添加须知";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getNotice(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改须知";
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      updateNotice(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                      addNotice(this.form).then(response => {
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
      this.$confirm('是否确认删除须知编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delNotice(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有须知数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportNotice(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
