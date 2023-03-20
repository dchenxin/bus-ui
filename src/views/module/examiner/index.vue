<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <!--<el-form-item label="编号" prop="number">
        <el-input
          v-model="queryParams.number"
          placeholder="请输入编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <!--<el-form-item label="地区id" prop="ruralId">
        <el-input
          v-model="queryParams.ruralId"
          placeholder="请输入地区id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="姓名" label-width="100px" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入考评人姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="考评人状态" prop="state">
        <el-input
          v-model="queryParams.state"
          placeholder="请输入考评人状态"
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
          v-hasPermi="['module:examiner:add']"
        >新增</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:examiner:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:examiner:remove']"
        >删除</el-button>
      </el-col>-->
      <!--<el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:examiner:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="examinerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--<el-table-column label="id" align="center" prop="id" />-->
      <!--<el-table-column label="编号" align="center" prop="number" />-->
      <el-table-column type="index" label="序号" :index="indexMethod"/>
      <!--<el-table-column label="派往村" align="center" prop="taskRuralName" >
        <template slot-scope="scope">
          <span v-if="scope.row.taskRuralName==null || scope.row.taskRuralName===''">-</span>
          <span v-else>{{scope.row.taskRuralName}}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="联系方式" align="center" prop="phone" >
        <template slot-scope="scope">
          <span v-if="scope.row.phone==null || scope.row.phone===''">-</span>
          <span v-else>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column label="居住县市" align="center" prop="addressRuralName" >
        <template slot-scope="scope">
          <!--<span v-if="scope.row.addressRuralName==null || scope.row.addressRuralName===''">-</span>
          <span v-else>{{scope.row.addressRuralName}}</span>-->
          <span>{{formatVillageName(scope.row.rural)}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="当前任务数" align="center" prop="taskNum" >
        <template slot-scope="scope">
          <span v-if="scope.row.taskNum == null ">-</span>
          <span v-else>{{scope.row.taskNum}}</span>
        </template>
      </el-table-column>-->
      <!--<el-table-column label="状态" align="center" prop="state" >
        <template slot-scope="scope">
          <span style="color:green" v-if="scope.row.state==='leisure'">空闲</span>
          <span style="color:red" v-else-if="scope.row.state==='appoint'">已指定</span>
          <span style="color:red" v-else-if="scope.row.state==='busy'">考评中</span>
          <span v-else>-</span>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:examiner:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:examiner:remove']"
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

    <!-- 添加或修改考评人对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!--<el-form-item label="编号" prop="number">
          <el-input v-model="form.number" placeholder="请输入编号" />
        </el-form-item>-->
        <!--<el-form-item label="地址" prop="ruralId">
          &lt;!&ndash;<el-input v-model="form.ruralId" placeholder="请输入地区id" />&ndash;&gt;
          <el-cascader :options="ruralOptions" v-model="currentValue" :show-all-levels="false" />
        </el-form-item>-->
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入考评人姓名" clearable/>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="居住县市" prop="addressId">
          <!--<el-input v-model="form.ruralId" placeholder="请输入考评村编号" />-->
          <el-cascader :options="ruralOptions" v-model="currentValue" :show-all-levels="false" :props="{ checkStrictly: true }" clearable/>
        </el-form-item>
        <!--<el-form-item label="考评人状态" prop="state">
          <el-input v-model="form.state" placeholder="请输入考评人状态" />
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listExaminer, getExaminer, delExaminer, addExaminer, updateExaminer, exportExaminer } from "@/api/module/examiner";
import { optionsByType, listRuralInfo, optionRuralInfo, getCodeArray, getPersons, listRural } from "@/api/module/ruralInfo";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数

export default {
  name: "Examiner",
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
      // 考评人表格数据
      examinerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      // 详情开关
      detailOpen: false,

      // 所有乡村
      ruralList: [],
      // 所有乡村option列表 label value
      ruralOptions: [],
      // 保存当前级联选择器的值 如：["N01000000", "N01M01000", "N01M01X01"]
      currentValue: [],
      // 所有的村负责人
      personList: [],

      // 查询参数
      queryParams: {
        orderByColumn: "create_time",
        isAsc: "desc",
        pageNum: 1,
        pageSize: 10,
        number: undefined,
        ruralId: undefined,
        addressId: undefined,
        name: undefined,
        state: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        /*name: [
          { required: true, message: "考评人姓名不能为空", trigger: "blur" }
        ],*/
        phone: [
          { required: true, message: "考评人联系方式不能为空", trigger: "blur" }
        ],
        /*addressId: [
          { required: true, message: "所在县区不能为空", trigger: "blur" }
        ],*/

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
        this.currentValue = undefined;
      }
    },
    //选择操作 改变form
    currentValue(array){
      console.log("级联选择器 变化");
      if (array!=null){
        this.form.addressId = array[array.length -1];
      } else {
        this.form.addressId = null;
      }
    }
  },
  methods: {
    checkRole,

    /*列表number*/
    indexMethod(index) {
      return ++index;
    },

    /** 查询考评人列表 */
    getList() {
      this.loading = true;
      listExaminer(this.queryParams).then(response => {
        this.examinerList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 获取所有的乡村列表
    /*getRuralList(){
      listRural().then(response => {
        this.ruralList = response.rows;
        console.log(this.ruralList)
      });
    },*/
    // 获取所有的乡村 选择器option
    getRuralOptions(){
      optionsByType('50').then(response => {
        this.ruralOptions = response.data;
        console.log(response);
      });
    },

    // 格式化乡村名称
    formatVillageName(rural){
      if (rural == null) return '-';
      let result = '';
      if (rural.countyName != null){
        result += rural.countyName;
      }
      if (rural.townName != null){
        result += rural.townName;
      }
      if (rural.villageName != null){
        result += rural.villageName;
      }
      return result;
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
        number: undefined,
        ruralId: undefined,
        addressId: undefined,
        currentValue: undefined,
        phone: undefined,
        name: undefined,
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加考评人";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getExaminer(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考评人";
        this.currentValue = row.currentValue;

      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      updateExaminer(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                      addExaminer(this.form).then(response => {
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
      this.$confirm('是否确认删除考评人 "' + row.name + '" 的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delExaminer(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有考评人数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportExaminer(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
