<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="用户类型" prop="userType">
        <el-select v-model="queryParams.userType" placeholder="请选择用户类型" clearable size="small">
          <el-option label="普通用户" value="0000" />
          <el-option label="村级职责人员" value="1111" />
          <el-option label="乡镇职责人员" value="1155" />
          <el-option label="县级职责人员" value="2222" />
          <el-option label="市级职责人员" value="3333" />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
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
          v-hasPermi="['module:userDetail:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:userDetail:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:userDetail:remove']"
        >删除</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:userDetail:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="userDetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" :index="indexMethod"/>
      <!--<el-table-column label="用户id" align="center" prop="userId" />-->
      <el-table-column label="用户姓名" width="200px" align="center" prop="nickName" >
        <!--<template slot-scope="scope">
          <span v-for="user in userList">
            <span v-if="user.userId ===scope.row.userId">{{user.nickName}}</span>
          </span>
        </template>-->
      </el-table-column>
      <el-table-column label="手机号" width="200px" align="center" prop="phone" >
      </el-table-column>
      <el-table-column label="用户类型" align="center" prop="userType" >
        <template slot-scope="scope">
          <span v-if="scope.row.userType === '0000'">普通用户</span>
          <span v-else-if="scope.row.userType === '1111'">村级职责人员</span>
          <span v-else-if="scope.row.userType === '1155'">乡镇职责人员</span>
          <span v-else-if="scope.row.userType === '2222'">县级职责人员</span>
          <span v-else-if="scope.row.userType === '3333'">市级职责人员</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="绑定市县" align="left" prop="ruralName" >
        <template slot-scope="scope">
          <span v-if="scope.row.ruralName==null || scope.row.ruralName===''">-</span>
          <span v-else-if="scope.row.userType === '2222'" style="color: #1c84c6">{{scope.row.ruralName}}</span>
          <span v-else-if="scope.row.userType === '3333'" style="color: #13ce66">{{scope.row.ruralName}}</span>
          <span v-else>{{scope.row.ruralName}}</span>
          <!--<span v-for="rural in ruralList">
            <span v-if="rural.id === scope.row.ruralId && rural.cityName != null && rural.cityName !== ''">{{rural.cityName}}</span>
            <span v-if="rural.id === scope.row.ruralId && rural.countyName != null && rural.countyName !== ''">{{rural.countyName}}</span>
            <span v-if="rural.id === scope.row.ruralId && rural.villageName != null && rural.villageName !== ''">{{rural.villageName}}</span>
          </span>-->
          <!--<span v-if="scope.row.ruralId!=null && scope.row.ruralId!==''">{{scope.row.ruralId}}</span>
          <span v-else>-</span>-->
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:userDetail:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:userDetail:remove']"
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

    <!-- 修改用户详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户" prop="userId">
          <el-input style="width: 200px;" v-model="form.nickName" placeholder="请输入用户名" disabled/>
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
          <el-select v-model="form.userType" @change="getOptions" placeholder="请选择用户类型">
            <el-option label="普通用户" value="0000" />
            <el-option label="村级职责人员" value="1111" />
            <el-option label="县级职责人员" value="2222" />
            <el-option label="市级职责人员" value="3333" />
          </el-select>
        </el-form-item>
        <el-form-item label="所在县市" prop="ruralId">
          <!--<el-input v-model="form.ruralId" placeholder="请输入地区id" />-->
          <el-cascader :options="ruralOptions" v-model="currentValue" :show-all-levels="false" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加用户详情对话框 -->
    <el-dialog :title="title" :visible.sync="addOpen" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户" prop="userId">
          <!--<el-input v-model="form.nickName" placeholder="请输入用户名" disabled/>-->
          <el-select v-model="form.userId">
            <el-option
              v-for="item in noDetailList"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"/>

          </el-select>
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
          <el-select v-model="form.userType" @change="getOptions" placeholder="请选择用户类型">
            <el-option label="普通用户" value="0000" />
            <el-option label="村级职责人员" value="1111" />
            <el-option label="县级职责人员" value="2222" />
            <el-option label="市级职责人员" value="3333" />
          </el-select>
        </el-form-item>
        <el-form-item label="所在县市" prop="ruralId">
          <!--<el-input v-model="form.ruralId" placeholder="请输入地区id" />-->
          <el-cascader :options="ruralOptions" v-model="currentValue" :show-all-levels="false" />
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
import { listUserDetail, getUserDetail, getNoDetails,
  delUserDetail, addUserDetail, updateUserDetail, exportUserDetail,
} from "@/api/module/userDetail";
import { listRuralInfo, optionRuralInfo,optionsByType, optionRuralByUserType, getCodeArray, getPersons, listRural } from "@/api/module/ruralInfo";

export default {
  name: "UserDetail",
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
      // 用户详情表格数据
      userDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 添加
      addOpen: false,

      // 所有没注册详情的用户
      noDetailList: [],

      // 所有乡村
      ruralList: [],
      // 所有乡村option列表 label value
      ruralOptions: [],
      // 临时数据
      cityOptions: [],
      countyOptions: [],
      villageOptions: [],
      // 保存当前级联选择器的值 如：["N01000000", "N01M01000", "N01M01X01"]
      currentValue: [],

        // 查询参数
        queryParams: {
            pageNum: 1,
            pageSize: 10,
            userType: undefined,
            phone: undefined,
        },
        // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          {required: true, message: "用户不能为空", trigger: "blur"}
        ],
        userType: [
          {required: true, message: "用户类型不能为空", trigger: "blur"}
        ],
        ruralId: [
          {required: true, message: "所在县市不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    // this.getRuralList();
    this.getNoDetails();
    this.getList();
    this.get3RuralOptions();
  },
  watch: {
    // 新增和编辑 关闭时清空图片对象数组
    open(val){
      if (val===false) {
        this.currentValue = undefined;
      }
    },
    // 监听级联选择器
    currentValue(vals){
      console.log("级联选择器 变化");
      console.log(this.currentValue);
      if (vals!=null){
        if (vals[2]!=null) this.form.ruralId = vals[2];
        else if (vals[1]!=null) this.form.ruralId = vals[1];
        else this.form.ruralId = vals[0];
      } else {
        this.form.ruralId = null;
      }
    }
  },
  methods: {
    /*列表number*/
    indexMethod(index) {
      return ++index;
    },
    /** 查询用户详情列表 */
    getList() {
      this.loading = true;
      listUserDetail(this.queryParams).then(response => {
        this.userDetailList = response.rows;
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
    // 获取所有的乡村 选择器option
    /*getRuralOptions(){
      optionRuralByUserType(this.form.userType).then(response => {
        this.ruralOptions = response.data;
        console.log('获取对应的option');

      });
    },*/

    // 获取所有没有详情的用户
    getNoDetails(){
      getNoDetails().then(response => {
        this.noDetailList = response.data;
      });
    },

    // 判断是哪一个 options
    getOptions(){
      if (this.form.userType != null && this.form.userType !== ''){
        if (this.form.userType === '3333'){
          this.ruralOptions = this.cityOptions;
        }else if(this.form.userType === '2222'){
          this.ruralOptions = this.countyOptions;
        }else {
          this.ruralOptions = this.villageOptions;
        }
      }else {
        this.ruralOptions = null;
      }
      this.currentValue = null;
      console.log('判断是哪一个 options');
    },
    // 获取所有的乡村 选择器option
    get3RuralOptions(){
      optionsByType('20').then(response => {
        this.cityOptions = response.data;
        console.log('20');
      });
      optionsByType('30').then(response => {
        this.countyOptions = response.data;
        console.log('30');
      });
      optionsByType('50').then(response => {
        this.villageOptions = response.data;
        console.log('50');
      });

    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.addOpen = false;
      this.currentValue = [];
      this.ruralOptions = [];
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
        userId: undefined,
        userType: undefined,
        ruralId: undefined
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
      this.addOpen = true;
      this.title = "添加用户详情";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getUserDetail(id).then(response => {
        this.form = response.data;

        console.log(this.currentValue)
        this.title = "修改用户详情";

        // 点击修改按钮就刷新选择器
        this.getOptions();
        this.currentValue = this.form.currentValue;
        // 获取级联选择器数组 回显
        /*const ruralId = row.ruralId;
        if (ruralId!=null){
          getCodeArray(ruralId).then(response => {
            this.currentValue = response.data;

            console.log('回显')
          });
        }*/
        this.open = true;
      });

    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      updateUserDetail(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                      addUserDetail(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("新增成功");
                              this.addOpen = false;
                              this.getNoDetails();
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
      this.$confirm('是否确认删除用户详情编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delUserDetail(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有用户详情数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportUserDetail(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
