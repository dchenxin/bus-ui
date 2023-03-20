<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="景区ID" prop="ticketId">
        <el-input
          v-model="queryParams.ticketId"
          placeholder="请输入景区ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="优惠券ID" prop="couponId">
        <el-input
          v-model="queryParams.couponId"
          placeholder="请输入优惠券ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品ID" prop="ticketProductId">
        <el-input
          v-model="queryParams.ticketProductId"
          placeholder="请输入产品ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="账号ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入账号ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户ID" prop="passengerId">
        <el-input
          v-model="queryParams.passengerId"
          placeholder="请输入用户ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="使用时间" prop="ticketDate">
        <el-input
          v-model="queryParams.ticketDate"
          placeholder="请输入使用时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="优惠券标题" prop="couponTitle">
        <el-input
          v-model="queryParams.couponTitle"
          placeholder="请输入优惠券标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="优惠券价格" prop="couponPrice">
        <el-input
          v-model="queryParams.couponPrice"
          placeholder="请输入优惠券价格"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="价格门槛" prop="couponCondition">
        <el-input
          v-model="queryParams.couponCondition"
          placeholder="请输入价格门槛"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="下单日期" prop="orderDate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.orderDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择下单日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否购买保险" prop="isInsure">
        <el-input
          v-model="queryParams.isInsure"
          placeholder="请输入是否购买保险"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户性别" prop="userSex">
        <el-select v-model="queryParams.userSex" placeholder="请选择用户性别" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否本人" prop="userIsdefault">
        <el-input
          v-model="queryParams.userIsdefault"
          placeholder="请输入是否本人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否设置紧急联系人" prop="userEmergencycontact">
        <el-input
          v-model="queryParams.userEmergencycontact"
          placeholder="请输入是否设置紧急联系人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="保险金额" prop="insurePrice">
        <el-input
          v-model="queryParams.insurePrice"
          placeholder="请输入保险金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单金额" prop="orderPrice">
        <el-input
          v-model="queryParams.orderPrice"
          placeholder="请输入订单金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="售票类型" prop="ticketContain">
        <el-input
          v-model="queryParams.ticketContain"
          placeholder="请输入售票类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="端口标识" prop="ticketPort">
        <el-input
          v-model="queryParams.ticketPort"
          placeholder="请输入端口标识"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户类别" prop="userType">
        <el-select v-model="queryParams.userType" placeholder="请选择用户类别" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证" prop="identityNum">
        <el-input
          v-model="queryParams.identityNum"
          placeholder="请输入身份证"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户电话" prop="userPhone">
        <el-input
          v-model="queryParams.userPhone"
          placeholder="请输入用户电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNumber">
        <el-input
          v-model="queryParams.orderNumber"
          placeholder="请输入订单编号"
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
          v-hasPermi="['module:ticketOrder:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:ticketOrder:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:ticketOrder:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:ticketOrder:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="ticketOrderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="订单编号" align="center" prop="id" />
      <el-table-column label="景区ID" align="center" prop="ticketId" />
      <el-table-column label="优惠券ID" align="center" prop="couponId" />
      <el-table-column label="产品ID" align="center" prop="ticketProductId" />
      <el-table-column label="账号ID" align="center" prop="userId" />
      <el-table-column label="用户ID" align="center" prop="passengerId" />
      <el-table-column label="购票须知" align="center" prop="ticketSecurity" />
      <el-table-column label="退改规则" align="center" prop="rule" />
      <el-table-column label="免票政策" align="center" prop="policy" />
      <el-table-column label="使用时间" align="center" prop="ticketDate" />
      <el-table-column label="使用方法" align="center" prop="way" />
      <el-table-column label="预定说明" align="center" prop="ticketExplain" />
      <el-table-column label="优惠券标题" align="center" prop="couponTitle" />
      <el-table-column label="优惠券价格" align="center" prop="couponPrice" />
      <el-table-column label="价格门槛" align="center" prop="couponCondition" />
      <el-table-column label="下单日期" align="center" prop="orderDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否购买保险" align="center" prop="isInsure" />
      <el-table-column label="用户性别" align="center" prop="userSex" />
      <el-table-column label="是否本人" align="center" prop="userIsdefault" />
      <el-table-column label="是否设置紧急联系人" align="center" prop="userEmergencycontact" />
      <el-table-column label="保险金额" align="center" prop="insurePrice" />
      <el-table-column label="订单金额" align="center" prop="orderPrice" />
      <el-table-column label="售票类型" align="center" prop="ticketContain" />
      <el-table-column label="端口标识" align="center" prop="ticketPort" />
      <el-table-column label="用户类别" align="center" prop="userType" />
      <el-table-column label="用户姓名" align="center" prop="userName" />
      <el-table-column label="身份证" align="center" prop="identityNum" />
      <el-table-column label="用户电话" align="center" prop="userPhone" />
      <el-table-column label="订单编号" align="center" prop="orderNumber" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:ticketOrder:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:ticketOrder:remove']"
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

    <!-- 添加或修改门票订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单编号" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入订单编号" />
        </el-form-item>
        <el-form-item label="景区ID" prop="ticketId">
          <el-input v-model="form.ticketId" placeholder="请输入景区ID" />
        </el-form-item>
        <el-form-item label="优惠券ID" prop="couponId">
          <el-input v-model="form.couponId" placeholder="请输入优惠券ID" />
        </el-form-item>
        <el-form-item label="产品ID" prop="ticketProductId">
          <el-input v-model="form.ticketProductId" placeholder="请输入产品ID" />
        </el-form-item>
        <el-form-item label="账号ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入账号ID" />
        </el-form-item>
        <el-form-item label="用户ID" prop="passengerId">
          <el-input v-model="form.passengerId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="购票须知" prop="ticketSecurity">
          <el-input v-model="form.ticketSecurity" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="退改规则" prop="rule">
          <el-input v-model="form.rule" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="免票政策" prop="policy">
          <el-input v-model="form.policy" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="使用时间" prop="ticketDate">
          <el-input v-model="form.ticketDate" placeholder="请输入使用时间" />
        </el-form-item>
        <el-form-item label="使用方法" prop="way">
          <el-input v-model="form.way" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="预定说明" prop="ticketExplain">
          <el-input v-model="form.ticketExplain" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="优惠券标题" prop="couponTitle">
          <el-input v-model="form.couponTitle" placeholder="请输入优惠券标题" />
        </el-form-item>
        <el-form-item label="优惠券价格" prop="couponPrice">
          <el-input v-model="form.couponPrice" placeholder="请输入优惠券价格" />
        </el-form-item>
        <el-form-item label="价格门槛" prop="couponCondition">
          <el-input v-model="form.couponCondition" placeholder="请输入价格门槛" />
        </el-form-item>
        <el-form-item label="下单日期" prop="orderDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.orderDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择下单日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否购买保险" prop="isInsure">
          <el-input v-model="form.isInsure" placeholder="请输入是否购买保险" />
        </el-form-item>
        <el-form-item label="用户性别">
          <el-select v-model="form.userSex" placeholder="请选择用户性别">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否本人" prop="userIsdefault">
          <el-input v-model="form.userIsdefault" placeholder="请输入是否本人" />
        </el-form-item>
        <el-form-item label="是否设置紧急联系人" prop="userEmergencycontact">
          <el-input v-model="form.userEmergencycontact" placeholder="请输入是否设置紧急联系人" />
        </el-form-item>
        <el-form-item label="保险金额" prop="insurePrice">
          <el-input v-model="form.insurePrice" placeholder="请输入保险金额" />
        </el-form-item>
        <el-form-item label="订单金额" prop="orderPrice">
          <el-input v-model="form.orderPrice" placeholder="请输入订单金额" />
        </el-form-item>
        <el-form-item label="售票类型" prop="ticketContain">
          <el-input v-model="form.ticketContain" placeholder="请输入售票类型" />
        </el-form-item>
        <el-form-item label="端口标识" prop="ticketPort">
          <el-input v-model="form.ticketPort" placeholder="请输入端口标识" />
        </el-form-item>
        <el-form-item label="用户类别">
          <el-select v-model="form.userType" placeholder="请选择用户类别">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户姓名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户姓名" />
        </el-form-item>
        <el-form-item label="身份证" prop="identityNum">
          <el-input v-model="form.identityNum" placeholder="请输入身份证" />
        </el-form-item>
        <el-form-item label="用户电话" prop="userPhone">
          <el-input v-model="form.userPhone" placeholder="请输入用户电话" />
        </el-form-item>
        <el-form-item label="订单编号" prop="orderNumber">
          <el-input v-model="form.orderNumber" placeholder="请输入订单编号" />
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
import { listTicketOrder, getTicketOrder, delTicketOrder, addTicketOrder, updateTicketOrder, exportTicketOrder } from "@/api/module/ticketOrder";

export default {
  name: "TicketOrder",
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
      // 门票订单表格数据
      ticketOrderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ticketId: undefined,
        couponId: undefined,
        ticketProductId: undefined,
        userId: undefined,
        passengerId: undefined,
        ticketSecurity: undefined,
        rule: undefined,
        policy: undefined,
        ticketDate: undefined,
        way: undefined,
        ticketExplain: undefined,
        couponTitle: undefined,
        couponPrice: undefined,
        couponCondition: undefined,
        orderDate: undefined,
        isInsure: undefined,
        userSex: undefined,
        userIsdefault: undefined,
        userEmergencycontact: undefined,
        insurePrice: undefined,
        orderPrice: undefined,
        ticketContain: undefined,
        ticketPort: undefined,
        userType: undefined,
        userName: undefined,
        identityNum: undefined,
        userPhone: undefined,
        orderNumber: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        createBy: [
          { required: true, message: "订单编号不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "订单编号不能为空", trigger: "blur" }
        ],
        updateBy: [
          { required: true, message: "订单编号不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "订单编号不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询门票订单列表 */
    getList() {
      this.loading = true;
      listTicketOrder(this.queryParams).then(response => {
        this.ticketOrderList = response.rows;
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
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        delFlag: undefined,
        ticketId: undefined,
        couponId: undefined,
        ticketProductId: undefined,
        userId: undefined,
        passengerId: undefined,
        ticketSecurity: undefined,
        rule: undefined,
        policy: undefined,
        ticketDate: undefined,
        way: undefined,
        ticketExplain: undefined,
        couponTitle: undefined,
        couponPrice: undefined,
        couponCondition: undefined,
        orderDate: undefined,
        isInsure: undefined,
        userSex: undefined,
        userIsdefault: undefined,
        userEmergencycontact: undefined,
        insurePrice: undefined,
        orderPrice: undefined,
        ticketContain: undefined,
        ticketPort: undefined,
        userType: undefined,
        userName: undefined,
        identityNum: undefined,
        userPhone: undefined,
        orderNumber: undefined
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
      this.title = "添加门票订单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTicketOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改门票订单";
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      updateTicketOrder(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                      addTicketOrder(this.form).then(response => {
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
      this.$confirm('是否确认删除门票订单编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTicketOrder(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有门票订单数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTicketOrder(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>