<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="订单状态" prop="state">
        <el-input
          v-model="queryParams.state"
          placeholder="请输入订单状态"
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
      <!--<el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['module:mallOrder:add']"
        >新增</el-button>
      </el-col>-->
      <!--<el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:mallOrder:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:mallOrder:remove']"
        >删除</el-button>
      </el-col>-->
      <!--<el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:mallOrder:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="mallOrderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" :index="indexMethod"/>
<!--      <el-table-column label="订单编号" align="center" prop="orderNumber" />-->
      <el-table-column label="买家姓名" align="center" prop="userId" >
        <template slot-scope="scope">
          <span>{{scope.row.nickName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="买家电话" align="center" prop="userId" >
        <template slot-scope="scope">
          <span>{{scope.row.phonenumber}}</span>
        </template>
      </el-table-column>

      <el-table-column label="商品名称" align="center" prop="productId" >
        <template slot-scope="scope">
          <span v-if="scope.row.mallProduct != null && scope.row.mallProduct.name != null">{{scope.row.mallProduct.name}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="150px" align="center" >
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.mallProduct != null && scope.row.mallProduct.image!=null && scope.row.mallProduct.image!=='[]'
            && scope.row.mallProduct.image!==''"
            style="width: 150px; height: 80px; padding: 0 20px; display: inline-flex; justify-content:center; align-items:center"
            :src="getFirstImage(scope.row)"
            fit="cover"
            :preview-src-list="getFirstImageAsArray(scope.row)">
          </el-image>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="合计金额" align="center" prop="totalAmount" />
      <el-table-column label="订单状态" align="center" prop="state" >
        <template slot-scope="scope">
          <span v-if="scope.row.state === 'cart'">购物车</span>
          <span v-else-if="scope.row.state === 'unpaid'">待支付</span>
          <span v-else-if="scope.row.state === 'paid'">待发货</span>
          <span style="color: red;" v-else-if="scope.row.state === 'overtime'">订单超时</span>
          <span style="color: red;" v-else-if="scope.row.state === 'cancel'">订单取消</span>
          <span v-else-if="scope.row.state === 'deliver'">已发货</span>
          <span style="color: green;" v-else-if="scope.row.state === 'finish'">订单完成</span>
          <span v-else-if="scope.row.state === 'examine'">退款审核中</span>
          <span style="color: blue;" v-else-if="scope.row.state === 'refund'">退款成功</span>
          <span v-else >-</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="浏览量" align="center" prop="viewNum" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:mallOrder:edit']"
          >更多</el-button>
          <!--<el-button
            v-if="scope.row.state==='paid'"
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleRefund(scope.row)"
          >申请退款</el-button>-->
          <el-button
            v-if="scope.row.state==='paid'"
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleSendOut(scope.row)"
          >发货</el-button>
          <!--<el-button
            v-if="scope.row.state==='deliver'"
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleConfirm(scope.row)"
          >确认收货</el-button>-->
          <el-button
            v-if="scope.row.state==='examine'"
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleExamine(scope.row)"
          >审核</el-button>
          <el-button
            v-if="scope.row.state==='unpaid' || scope.row.state==='cart'"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:mallOrder:remove']"
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

    <!-- 修改商城订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="编号">
          <span>{{form.number}}</span>
        </el-form-item>
        <el-form-item label="支付单号">
          <span v-if="form.orderNumber != null && form.orderNumber !== '' ">{{form.orderNumber}}</span>
          <span v-else>暂未生成支付单号</span>
        </el-form-item>
        <el-form-item label="买家姓名" prop="nickName">
          <span v-if="form.state !=='cart' && form.state !=='unpaid'">{{form.nickName}}</span>
          <el-input v-else v-model="form.nickName" placeholder="请输入买家姓名" maxlength="10"/>
        </el-form-item>
        <el-form-item label="买家电话" prop="phonenumber" maxlength="11">
          <span v-if="form.state !=='cart' && form.state !=='unpaid'">{{form.phonenumber}}</span>
          <el-input v-else v-model="form.phonenumber" placeholder="请输入买家电话" />
        </el-form-item>
        <el-form-item label="商品名称" >
          <span v-if="form.mallProduct == null || form.mallProduct.name == null">-</span>
          <span v-else>{{form.mallProduct.name}}</span>
        </el-form-item>
        <el-form-item label="单价">
          <span v-if="form.mallProduct == null || form.mallProduct.unitPrice == null">-</span>
          <span v-else>{{form.mallProduct.unitPrice}} 元</span>
        </el-form-item>
        <el-form-item label="计量单位">
          <span v-if="form.mallProduct ==null || form.mallProduct.saleUnit == null || form.mallProduct.saleUnit ===''">暂无</span>
          <span v-else>{{form.mallProduct.saleUnit}} / 份</span>
        </el-form-item >
        <el-form-item label="数量" prop="quantity">
          <!--<span><el-input-number v-model="form.quantity" @change="handleNumberChange" :min="1" :max="999" label="数量" /></span>-->
          <span>{{form.quantity}}</span>
        </el-form-item>
        <!--<el-form-item label="合计金额" prop="totalAmount">
          <el-input v-model="form.totalAmount" placeholder="请输入合计金额" />
        </el-form-item>-->
        <el-form-item label="合计" >
          <span style="font-size: 28px;">{{form.totalAmount}}</span> 元
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="form.state === 'unpaid'" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listMallOrder, getMallOrder, delMallOrder, addMallOrder, updateMallOrder, exportMallOrder,
  refund, examineOk, sendOut, confirmReceipt
}
from "@/api/module/mallOrder";

export default {
  name: "MallOrder",
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
      // 商城订单表格数据
      mallOrderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        orderByColumn: "create_time",
        isAsc: "desc",
        pageNum: 1,
        pageSize: 10,
        state: undefined,
      },
      // 表单参数
      form: {
        /*buyUser: {
          nickName: undefined,
          phonenumber: undefined
        },*/
        mallProduct: {
          name: undefined,
          saleUnit: undefined,
          unitPrice: undefined,
        }
      },
      // 表单校验
      rules: {
        /*quantity: [
          { required: true, message: "数量不能为空", trigger: "blur" }
        ],*/
        nickName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        phonenumber: [
          {required: true, message: "不能为空", trigger: "blur"},
          { pattern: /^1.{10}$/, message: '请正确填写11位手机号', trigger: 'blur' }
        ],

      }
    };
  },
  created() {
    this.getList();
  },
  methods: {

    /*列表number*/
    indexMethod(index) {
      return ++index;
    },

    /** 查询商城订单列表 */
    getList() {
      this.loading = true;
      listMallOrder(this.queryParams).then(response => {
        this.mallOrderList = response.rows;
        console.log(this.mallOrderList);
        this.total = response.total;
        this.loading = false;
      });
    },

    // 获取首张图片 url ----------------------------- 首页图片
    getFirstImage(row){
      var images=[];
      console.log("----------");
      console.log(row.mallProduct);
      if (row.mallProduct.image != null && row.mallProduct.image !== '[]'){
        images = JSON.parse(row.mallProduct.image);
        console.log("----------");
        console.log(images[0]);
        return images[0];
      }
      return null;
    },

    // 获取所有图片 url
    getFirstImageAsArray(row){
      var images=[];
      images.push(this.getFirstImage(row));
      return images;
    }, // ----------------------------------------

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    // 数量变化
    handleNumberChange(){
      console.log(this.form.quantity);
      console.log("数量变化");
      if (this.form.quantity != null)
        this.form.totalAmount = this.form.quantity * this.form.mallProduct.unitPrice;

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
        userId: undefined,
        productId: undefined,
        quantity: undefined,
        totalAmount: undefined,
        state: undefined,
        viewNum: undefined,
        /*buyUser: {
          nickName: undefined,
          phonenumber: undefined
        },*/
        mallProduct: {
          name: undefined,
          saleUnit: undefined,
          unitPrice: undefined,
        }
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

    /** 退款申请 */
    handleRefund(row) {
      const id = row.id;
      // console.log(id);
      this.$confirm('是否确认退款申请, 编号：' + row.number , "退款申请", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(function() {
        return refund(id);
      }).then(() => {
        this.getList();
        this.msgSuccess("退款申请成功");
      });
    },

    /** 退款审核通过 */
    handleExamine(row) {
      const id = row.id;
      // console.log(id);
      this.$confirm('是否确认通过退款审核, 编号：' + row.number , "退款申请审核", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(function() {
        return examineOk(id);
      }).then(() => {
        this.getList();
        this.msgSuccess("退款审核已通过");
      });
    },

    /** 发货 */
    handleSendOut(row) {
      const id = row.id;
      // console.log(id);
      this.$confirm('是否确认发货商品：' + row.mallProduct.name + '', "发货确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(function() {
        return sendOut(id);
      }).then(() => {
        this.getList();
        this.msgSuccess("发货成功");
      });
    },

    /** 确认收货 */
    handleConfirm(row) {
      const id = row.id;
      // console.log(id);
      this.$confirm('是否确认收货, 编号：' + row.number , "收货确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(function() {
        return confirmReceipt(id);
      }).then(() => {
        this.getList();
        this.msgSuccess("已确认收货");
      });
    },


    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加商城订单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMallOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改订单";
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      updateMallOrder(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                      addMallOrder(this.form).then(response => {
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
      this.$confirm('是否确认删除订单商品:"' + row.mallProduct.name + '"?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMallOrder(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有商城订单数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportMallOrder(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
