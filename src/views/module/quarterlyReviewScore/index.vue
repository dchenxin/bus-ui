<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <!-- tab页1 -->
      <el-tab-pane label="考评榜" name="first">
        <el-form :model="reviewQueryParams" ref="reviewQueryForm" :inline="true" label-width="68px">

          <!--<el-form-item label="编号" prop="number">
            <el-input
              v-model="queryParams.number"
              placeholder="请输入编号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>-->
          <el-form-item label="考评标题" prop="title">
            <el-input
              v-model="reviewQueryParams.title"
              placeholder="请输入考评标题"
              clearable
              size="small"
            />
          </el-form-item>
          <el-form-item label="请选择考评任务" prop="groupId">
            <el-select  v-model="reviewQueryParams.groupId" placeholder="请选择考评任务" clearable>
              <el-option
                v-for="item in taskList"
                :key="item.id"
                :label="item.title"
                :value="item.id" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryReview">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQueryReview">重置</el-button>
          </el-form-item>
        </el-form>

        <!--<el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-hasRole="['countyAdmin']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['module:quarterlyReview:add']"
            >发布</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-trophy"
              size="mini"
              @click="handleTop"
              v-hasPermi="['module:quarterlyReview:add']"
            >排行榜</el-button>
          </el-col>
          &lt;!&ndash;<el-col :span="1.5">
            <el-button
              v-hasRole="['countyAdmin']"
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['module:quarterlyReview:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-hasRole="['countyAdmin']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['module:quarterlyReview:remove']"
            >删除</el-button>
          </el-col>&ndash;&gt;
          &lt;!&ndash;<el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['module:quarterlyReview:export']"
            >导出</el-button>
          </el-col>&ndash;&gt;
        </el-row>-->

        <el-table v-loading="reviewLoading" :data="quarterlyReviewList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <!--<el-table-column label="标题" align="center" prop="id" />-->

          <el-table-column type="index" label="序号" :index="indexMethodReview"/>
          <!--<el-table-column label="发布人" width="100px" align="center" prop="nickName" />-->


          <el-table-column label="考评标题" width="200px" align="center" prop="title" />
          <!--<el-table-column label="图片" width="150px" align="center" prop="image" >
            <template slot-scope="scope">
              <el-image
                v-if="scope.row.image!=null && scope.row.image!=='[]' && scope.row.image!==''"
                style="width: 150px; height: 80px; padding: 0 20px; display: inline-flex; justify-content:center; align-items:center"
                :src="getFirstImage(scope.row)"
                fit="cover"
                :preview-src-list="getFirstImageArray(scope.row)"
              >
                &lt;!&ndash;<div slot="error"  class="image-slot">
                  <i  class="el-icon-picture-outline"></i>
                </div>&ndash;&gt;
              </el-image>
              <span v-else>-</span>
            </template>
          </el-table-column>-->
          <!--<el-table-column label="考评内容" align="center" prop="content" min-width="200px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.content!=null && scope.row.content!==''">{{scope.row.content}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>-->

          <!--<el-table-column label="发布时间"  align="center" prop="createTime">
            <template slot-scope="scope">
              <span v-if="scope.row.createTime == null || scope.row.createTime === '' ">-</span>
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>-->

          <el-table-column label="考评时间" width="170px" align="center" prop="reviewTime" >
            <template slot-scope="scope">
              <span v-if="scope.row.reviewTime == null || scope.row.reviewTime === '' ">-</span>
              <span>{{ parseTime(scope.row.reviewTime, '{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>

          <el-table-column label="考评任务" align="center" prop="groupName" >
            <template slot-scope="scope">
              <span v-if="scope.row.groupName == null || scope.row.groupName === ''">-</span>
              <span v-else>{{scope.row.groupName}}</span>
            </template>
          </el-table-column>

          <el-table-column label="考评地区" width="150px" align="center" prop="ruralName" >
            <template slot-scope="scope">
              <!--<span v-if="scope.row.ruralName==null || scope.row.ruralName===''">-</span>
              <span v-else>{{scope.row.ruralName}}</span>-->
              {{formatVillageName(scope.row.rural)}}
            </template>
          </el-table-column>


          <el-table-column label="考评人" width="150px" align="center" prop="examinerName" />
          <el-table-column label="考评总分" width="150px" align="center" prop="score" >
            <template slot-scope="scope">
              <span v-if="scope.row.score !== '' && scope.row.score != null ">{{scope.row.score}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>

          <!--<el-table-column label="浏览量" align="center" prop="viewNum" />-->
          <!--<el-table-column label="考评状态" align="center" prop="state" >
            <template slot-scope="scope">
              <span v-if="scope.row.state==='publish'" style="color: dodgerblue;">待考评</span>
              <span v-else-if="scope.row.state==='finish'" style="color: green">考评完成</span>
              <span v-else-if="scope.row.state==='cancel'" style="color: red">取消</span>
              <span v-else>-</span>
            </template>
          </el-table-column>-->
        </el-table>

        <pagination
          v-show="reviewTotal>0"
          :total="reviewTotal"
          :page.sync="reviewQueryParams.pageNum"
          :limit.sync="reviewQueryParams.pageSize"
          @pagination="getReviewList"
        />

      </el-tab-pane>

      <!-- tab页2 -->
      <el-tab-pane label="指标榜" name="second">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <!--<el-form-item label="考评项id" prop="itemId">
            <el-input
              v-model="queryParams.itemId"
              placeholder="请输入考评项id"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="单项分数" prop="score">
            <el-input
              v-model="queryParams.score"
              placeholder="请输入单项分数"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>-->

          <el-form-item label="指标项" prop="itemId">
            <el-select v-model="queryParams.itemId" placeholder="请选择指标项" filterable clearable>
              <el-option
                v-for="item in itemList"
                :key="item.id"
                :label="item.title"
                :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <!--<el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['module:quarterlyReviewScore:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['module:quarterlyReviewScore:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['module:quarterlyReviewScore:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['module:quarterlyReviewScore:export']"
            >导出</el-button>
          </el-col>
        </el-row>-->

        <el-table v-loading="loading" :data="quarterlyReviewScoreList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column type="index" label="序号" align="center" :index="indexMethod"/>
          <el-table-column label="评分编号" width="150" align="center" prop="id">
            <template slot-scope="scope">JD{{scope.row.id}}</template>
          </el-table-column>
          <el-table-column label="考评指标" width="250" align="center" prop="itemName" />
          <el-table-column label="考评任务" align="center" prop="groupName" />
          <el-table-column label="考评标题" align="center" prop="reviewName" />

          <!--<el-table-column label="id" align="center" prop="id" />-->
          <el-table-column label="评分时间" width="140px" align="center" prop="reviewTime" >
            <template slot-scope="scope">
              <span v-if="scope.row.createTime == null || scope.row.createTime === '' ">-</span>
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>

          <el-table-column label="乡村名" align="center" prop="ruralName" />

          <el-table-column label="依据图片" width="150px" align="center" prop="image" >
            <template slot-scope="scope">
              <el-image
                v-if="scope.row.image!=null && scope.row.image!=='[]' && scope.row.image!==''"
                style="width: 150px; height: 80px; padding: 0 20px; display: inline-flex; justify-content:center; align-items:center"
                :src="getFirstImage(scope.row)"
                fit="cover"
                :preview-src-list="getFirstImageArray(scope.row)">
              </el-image>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="单项分数" align="center" prop="score" />
          <!--<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['module:quarterlyReviewScore:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['module:quarterlyReviewScore:remove']"
              >删除</el-button>
            </template>
          </el-table-column>-->
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>

    </el-tabs>


    <!-- 添加或修改评分明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="del" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入del" />
        </el-form-item>
        <el-form-item label="图片依据" prop="image">
          <el-input v-model="form.image" placeholder="请输入图片依据" />
        </el-form-item>
        <el-form-item label="考评记录id" prop="quarterlyReviewId">
          <el-input v-model="form.quarterlyReviewId" placeholder="请输入考评记录id" />
        </el-form-item>
        <el-form-item label="考评项id" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入考评项id" />
        </el-form-item>
        <el-form-item label="单项分数" prop="score">
          <el-input v-model="form.score" placeholder="请输入单项分数" />
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
import { listQuarterlyReviewScore, getQuarterlyReviewScore, delQuarterlyReviewScore, addQuarterlyReviewScore, updateQuarterlyReviewScore, exportQuarterlyReviewScore } from "@/api/module/quarterlyReviewScore";
import {
  listQuarterlyReviewItem,
} from "@/api/module/quarterlyReviewItem";
import { listQuarterlyReview, getQuarterlyReview, } from "@/api/module/quarterlyReview";
/*cy添加*/
import {
  delQuarterlyReview, addQuarterlyReview,
  updateQuarterlyReview, exportQuarterlyReview,
  setScore, exportReviewCounty, exportReviewVillage, exportReviewStat, exportReviewExaminer, exportDetailScore
} from "@/api/module/quarterlyReview";
import {
  optionRuralInfo, optionsByType, listAllRural,
  getCodeArray, getPersons, listRural, treeselect
} from "@/api/module/ruralInfo";
import { listExaminer, getExaminer, getLeisureExaminers, allExaminer } from "@/api/module/examiner";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
import { listQuarterlyReviewGroup } from "@/api/module/quarterlyReviewGroup";


export default {
  name: "QuarterlyReviewScore",
  data() {
    return {
      activeName: 'first', // 当前 tab页
      itemList: [], // 所有指标项
      taskList: [], // 所有考评任务


      reviewLoading: true, // --------------- 考评榜
      quarterlyReviewList: [],
      reviewTotal: 0,
      reviewQueryParams: { // reviewQueryForm
        orderByColumn: "score",
        isAsc: "desc",
        pageNum: 1,
        pageSize: 10,
        itemId: undefined,
        state: undefined,
        groupId: undefined,
      },

      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 评分明细表格数据
      quarterlyReviewScoreList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        orderByColumn: "score",
        isAsc: "desc",
        pageNum: 1,
        pageSize: 10,
        itemId: undefined,
        score: undefined,
        groupId: undefined,
      },
      // 考评任务列表查询参数
      queryParams2: {
        orderByColumn: "create_time",
        isAsc: "desc",
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        groupId: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getReviewList();
    // this.getList();
    this.getItemList();
    this.getTaskList();
    this.getRuralList(); //


  },
  methods: {
    /** 本页序号 */
    indexMethod(index) {
      return ++index;
    },

    /** 本页序号 */
    indexMethodReview(index) {
      return (index+1) + (this.reviewQueryParams.pageNum-1)*this.reviewQueryParams.pageSize;
    },

    handleClick(tab, event) {
      console.log(tab, event);
    },

    /** 查询指标榜列表 */
    getList() {
      this.loading = true;
      listQuarterlyReviewScore(this.queryParams).then(response => {
        this.quarterlyReviewScoreList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 查询指标项列表 查询用 */
    getItemList() {
      var params = {
        orderByColumn: "order_num",
        isAsc: "desc",
        pageNum: 1,
        pageSize: 10000000,
      };
      listQuarterlyReviewItem(params).then(response => {
        this.itemList = response.rows;
      });
    },

    // 查询考评榜数据 ---------------------------------------------------
    getReviewList(){
      this.reviewLoading = true;
      this.reviewQueryParams.state = 'finish';
      listQuarterlyReview(this.reviewQueryParams).then(response => {
        this.quarterlyReviewList = response.rows;
        this.reviewTotal = response.total;
        this.reviewLoading = false;
      });
    },

    /** 搜索按钮操作 */
    handleQueryReview() {
      this.reviewQueryParams.pageNum = 1;
      this.getReviewList();
    },
    /** 重置按钮操作 */
    resetQueryReview() {
      this.resetForm("reviewQueryForm");
      this.handleQueryReview();
    }, // -------------------------------------------------------------
    /** 查询考评任务列表 */
    getTaskList() {
      this.loading = true;
      listQuarterlyReviewGroup(this.queryParams2).then(response => {
        this.taskList = response.rows;
      });
    },
    // 考评任务改变事件
    changeReviewGroup(groupId){
      this.taskList.forEach(t => {
        if (t.id === groupId){
          var now = new Date(); // 自动填充标题
          this.form.title = t.title + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
        }
      })
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
    // 获取所有的乡村列表
    getRuralList() {
      listAllRural().then(response => {
        this.ruralList = response.data;
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
        image: undefined,
        quarterlyReviewId: undefined,
        itemId: undefined,
        groupId: undefined,
        score: undefined
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
      // this.handleQuery();
      this.quarterlyReviewScoreList = [];
      this.total = 0;
      this.loading = false;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },

    // 获取首张图片 url ----------------------------------
    getFirstImage(row){
      var images=[];
      if (row.image!=null && row.image!=='[]'){
        images = JSON.parse(row.image);
        console.log("----------");
        console.log(images[0]);
        return images[0];
      }
      return null;
    },

    // 获取图片数组 首张
    getFirstImageArray(row){
      var images=[];
      images.push(this.getFirstImage(row));
      return images;
    }, // ------------------------------------------------


    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加评分明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getQuarterlyReviewScore(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改评分明细";
      });
    },
      /** 提交按钮 */
      submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                      updateQuarterlyReviewScore(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("修改成功");
                              this.open = false;
                              this.getList();
                          }
                      });
                  } else {
                      addQuarterlyReviewScore(this.form).then(response => {
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
      this.$confirm('是否确认删除评分明细编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delQuarterlyReviewScore(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有评分明细数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportQuarterlyReviewScore(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
