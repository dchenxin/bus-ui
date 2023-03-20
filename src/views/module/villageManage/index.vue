<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="名字" prop="ruralId">
      <!--  <el-input
          v-model="queryParams.ruralId"
          placeholder="请输入乡村名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />-->
        <el-select clearable filterable size="small" v-model="queryParams.ruralId" placeholder="请输入乡村名">
          <el-option
            v-for="item in ruralList"
            :label="item.cityName+item.countyName+item.villageName"
            :value="item.id"
          ></el-option>
        </el-select>

      </el-form-item>
     <!-- <el-form-item label="年龄" prop="age">
        <el-input
          v-model="queryParams.age"
          placeholder="请输入年龄"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input
          v-model="queryParams.telephone"
          placeholder="请输入联系电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任职年数" prop="dutyYear">
        <el-input
          v-model="queryParams.dutyYear"
          placeholder="请输入任职年数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="乡村图片" prop="image">
        <el-input
          v-model="queryParams.image"
          placeholder="请输入乡村图片"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="村长id" prop="headId">
        <el-input
          v-model="queryParams.headId"
          placeholder="请输入村长id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="街道id" prop="roadInfoId">
        <el-input
          v-model="queryParams.roadInfoId"
          placeholder="请输入街道id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="职责id" prop="dutyId">
        <el-input
          v-model="queryParams.dutyId"
          placeholder="请输入职责id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="乡村id" prop="ruralId">
        <el-input
          v-model="queryParams.ruralId"
          placeholder="请输入乡村id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="村挡编号" prop="number">
        <el-input
          v-model="queryParams.number"
          placeholder="请输入村挡编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">刷新</el-button>
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
          v-hasPermi="['module:villageManage:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasRole="['villageAdmin']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:villageManage:edit']"
        >修改</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
         <el-button
           type="danger"
           icon="el-icon-delete"
           size="mini"
           :disabled="multiple"
           @click="handleDelete"
           v-hasPermi="['module:villageManage:remove']"
         >删除</el-button>
       </el-col>-->
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['module:villageManage:export']"
          >导出</el-button>
        </el-col>
    </el-row>

    <el-table v-loading="loading" :data="villageManageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column type="index" label="序号" :index="indexMethod"/>
      <el-table-column label="所在乡村" align="center" prop="detailVillage">
        <template slot-scope="scope">
          <span v-if="scope.row.detailVillage==null && scope.row.detailVillage===''">-</span>
          <span v-else>{{scope.row.detailVillage}}</span>
        </template>
      </el-table-column>
      <el-table-column label="村长" align="center" prop="name">
        <template slot-scope="scope">
          <span v-if="scope.row.leader ==null || scope.row.leader==''">-</span>
          <!--          <span v-else-if="scope.row.ruralId ===scope.row.leader.ruralId">-->
          <span v-else>{{scope.row.leader.name}}</span>
          <!--          </span>-->
        </template>
      </el-table-column>
      <el-table-column label="年龄" align="center" prop="age">
        <!-- <template slot-scope="scope">
           <span v-if="scope.row.headId==null || scope.row.headId===''">-</span>
           <span v-for="head in HeadersList">
             <span v-if="head.id ===scope.row.headId">{{head.age}}</span>
           </span>
         </template>-->
        <template slot-scope="scope">
          <span v-if="scope.row.leader==null || scope.row.leader===''">-</span>
          <!--          <span v-else-if="scope.row.ruralId ===scope.row.leader.ruralId">-->
          <span v-else>{{scope.row.leader.age}}</span>
          <!--          </span>-->
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center" prop="telephone">
        <!-- <template slot-scope="scope">
           <span v-if="scope.row.headId==null || scope.row.headId===''">-</span>
           <span v-for="head in HeadersList">
             <span v-if="head.id ===scope.row.headId">{{head.telephone}}</span>
           </span>
         </template>-->
        <template slot-scope="scope">
          <span v-if="scope.row.leader==null || scope.row.leader===''">-</span>
          <!--          <span v-else-if="scope.row.ruralId ===scope.row.leader.ruralId">-->
          <span v-else>{{scope.row.leader.telephone}}</span>
          <!--          </span>-->
        </template>
      </el-table-column>
      <!-- <el-table-column label="职责" align="center" prop="dutyId" >
         <template slot-scope="scope">
           <span v-if="scope.row.dutyId==null || scope.row.dutyId===''">-</span>
           <span v-for="duty in dutyList">
             <span v-if="duty.id ===scope.row.dutyId">{{duty.duty}}</span>
           </span>
         </template>
       </el-table-column>-->
      <el-table-column label="任职年数" align="center" prop="dutyYear">
        <!--<template slot-scope="scope">
          <span v-if="scope.row.headId==null || scope.row.headId===''">-</span>
          <span v-for="head in HeadersList">
            <span v-if="head.id ===scope.row.headId">{{head.dutyYear}}</span>
          </span>
        </template>-->
        <template slot-scope="scope">
          <span v-if="scope.row.leader==null || scope.row.leader===''">-</span>
          <!--          <span v-else-if="scope.row.ruralId ===scope.row.leader.ruralId">-->
          <span v-else>{{scope.row.leader.dutyYear}}</span>
          <!--          </span>-->
        </template>
      </el-table-column>
      <el-table-column label="乡村图片" align="center" prop="image" >
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.image!=null && scope.row.image!=='[]' && scope.row.image!==''"
            style="width: 150px; height: 80px; padding: 0 20px; display: inline-flex; justify-content:center; align-items:center"
            :src="scope.row.image"
            fit="cover"
          >
          </el-image>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="街道" align="center" prop="detailRoad">
        <template slot-scope="scope">
          <span v-if="scope.row.detailRoad===null || scope.row.detailRoad===''">-</span>
          <span v-else>{{scope.row.detailRoad}}</span>
        </template>
      </el-table-column>

      <el-table-column label="总人口" align="center" prop="totalCount">
        <template slot-scope="scope">
          <span v-if="scope.row.totalCount===null || scope.row.totalCount===''">-</span>

          <span v-else>{{sumFormat(scope.row.totalCount)}}</span>

        </template>
      </el-table-column>
      <!--      <el-table-column label="村挡编号" align="center" prop="number" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-tickets" size="mini" @click="catchDetail(scope.row)">详情</el-button>
          <el-button
            v-if="checkRole(['villageAdmin']) || checkRole(['admin'])"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:villageManage:edit']"
          >修改
          </el-button>
          <!-- <el-button
             size="mini"
             type="text"
             icon="el-icon-delete"
             @click="handleDelete(scope.row)"
             v-hasPermi="['module:villageManage:remove']"
           >删除</el-button>-->
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

    <!-- 添加或修改村档信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="乡村图片" prop="image">
          <el-upload
            :action="avatarUploadUrl"
            list-type="picture-card"
            :class="{Hide: hideAvatar}"
            :on-change="avatarChange"
            :before-upload="beforeAvatarUpload"
            :on-success="avatarSuccess"
            :on-remove="avatarRemove"
            :limit="avatarlimit"
            :file-list="avatarList">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogAvatar">
            <img width="100%" :src="dialogAvatarUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="所在乡村" prop="ruralId">
          <el-cascader :options="ruralOptions" v-model="currentValue" :show-all-levels="false"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--  查看详情 对话框-->
    <el-dialog :title="title" :visible.sync="openDetail" width="900px" append-to-body :close-on-click-modal="false">
      <el-tabs  v-model="activeName" @tab-click="tabClick">
        <!--<el-tab-pane class="mytab" label="村长信息" name="1">
          <el-form :model="form" size="mini">
            <el-row>
              <el-col :span="12">
                <el-form-item label="名字:">{{form.leaderName }}</el-form-item>
                <el-form-item label="年龄:">{{form.leaderAge }}</el-form-item>
                <el-col :span="12">
                  <el-form-item label="任职年龄:">{{form.leaderDutyAge }}</el-form-item>
                </el-col>
              </el-col>
              <el-col :span="12">
                <el-form-item label="头像:">
                  <div v-if="form.leaderAvatar!=null && form.leaderAvatar !=='[]' && form.leaderAvatar !==''">
                    <el-image
                      style="width: 200px; height: 200px;"
                      :src="form.leaderAvatar"
                      fit="contain"
                    />
                  </div>
                  <span v-else>暂无头像</span>
                </el-form-item>
              </el-col>

            </el-row>
          </el-form>
        </el-tab-pane>-->
        <el-tab-pane class="mytab" label="职责信息" name="1">
          <el-form :model="dutyQueryParams" ref="dutyQueryForm" :inline="true" label-width="68px">
            <el-form-item label="名字" prop="name">
              <el-input clearable size="small" v-model="dutyQueryParams.name" placeholder="请输入名字"/>
            </el-form-item>
            <el-form-item label="职务" prop="duty">
              <el-input clearable size="small" v-model="dutyQueryParams.duty" placeholder="请输入职务"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="dutyHandleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="dutyResetQuery">刷新</el-button>
            </el-form-item>
          </el-form>
          <el-table v-loading="dutyloading" :data="dutyList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column type="index" label="#" :index="indexMethod"/>
            <el-table-column label="乡村" align="center" prop="detailVillage" />
            <el-table-column label="名字" align="center" prop="name" />
            <el-table-column label="年龄" align="center" prop="age" />
            <el-table-column label="出生日期" align="center" prop="birthTime" >
              <template slot-scope="scope">
                <span v-if="scope.row.birthTime==null || scope.row.birthTime===''">-</span>
                <span v-else>{{scope.row.birthTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="上任日期" align="center" prop="tenureTime">
              <template slot-scope="scope">
                <span v-if="scope.row.tenureTime==null || scope.row.tenureTime===''">-</span>
                <span v-else>{{scope.row.tenureTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="联系电话" align="center" prop="telephone" />
            <el-table-column label="职务" align="center" prop="duty" />
          </el-table>
          <pagination
            v-show="dutyTotal>0"
            :total="dutyTotal"
            :page.sync="dutyQueryParams.pageNum"
            :limit.sync="dutyQueryParams.pageSize"
            @pagination="getDutyList"
          />
        </el-tab-pane>
        <el-tab-pane class="mytab" label="街道信息" name="2">
          <el-form :model="roadQueryParams" ref="roadQueryForm" :inline="true" label-width="68px">
            <el-form-item label="街道" prop="road">
              <el-select clearable filterable size="small" v-model="roadQueryParams.road" placeholder="请输入街道">
                <el-option
                  v-for="item in roadInfoList"
                  :label="item.road"
                  :value="item.road"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="roadHandleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="roadResetQuery">刷新</el-button>
            </el-form-item>
          </el-form>
          <el-table v-loading="roadloading" :data="roadInfoList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column type="index" label="#" :index="indexMethod"/>
            <el-table-column label="乡村" align="center" prop="detailVillage" />
            <el-table-column label="街道" align="center" prop="road" />
            <el-table-column label="街道户数" align="center" prop="roadCount">
              <template slot-scope="scope">
                <span >{{sumFormat(scope.row.roadCount)}}</span>
              </template>
            </el-table-column>

            <el-table-column label="总人口" align="center" prop="count" >
              <template slot-scope="scope">
                <span >{{sumFormat(scope.row.count)}}</span>
              </template>
            </el-table-column>

          </el-table>
          <pagination
            v-show="roadTotal>0"
            :total="roadTotal"
            :page.sync="roadQueryParams.pageNum"
            :limit.sync="roadQueryParams.pageSize"
            @pagination="getRoadList"
          />
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    listVillageManage, getVillageManage,
    delVillageManage, addVillageManage,
    updateVillageManage, exportVillageManage,
    listRuralDuty,listRuralRoad,listRuralInfo
  } from "@/api/module/villageManage";
  import { optionsByType } from "@/api/module/ruralInfo";
  import {checkRole} from "../../../utils/permission";

  export default {
  name: "VillageInfo",
  data() {
      return {
        //头像
        avatarList: [],
        hideAvatar: false, // 上传限制 隐藏上传按钮
        avatarlimit: 1, //图片数量限制
        dialogAvatarUrl: '', //预览
        dialogAvatar: false,
        avatarUploadUrl: process.env.VUE_APP_BASE_API + "/api/file/upload",

        //tab
        activeName: '1',
        // 所有乡村
        ruralList: [],
        //所有村长
        HeadersList: [],
        //所有街道
        roadInfoList: [],
        //所有职责
        dutyList: [],
        //详情
        openDetail: false,
        //所有街道
        listVillageInfo: [],
        // 所有乡村option列表 label value
        ruralOptions: [],
        // 保存当前级联选择器的值 如：["N01000000", "N01M01000", "N01M01X01"]
        currentValue: [],
        // 遮罩层
      loading: true,
      dutyloading: true,
      roadloading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      dutyTotal: 0,
      roadTotal: 0,
      tabIndex:0,
      // 村档信息表格数据
      villageManageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 职责查询参数
      dutyQueryParams: {
        pageNum: 1,
        pageSize: 10,
        duty: undefined,
        name: undefined,
        telephone: undefined,
        orderByColumn:"createTime",
        isAsc:"desc",
      },
      // 街道查询参数
      roadQueryParams: {
        pageNum: 1,
        pageSize: 10,
        road: undefined,
        orderByColumn:"createTime",
        isAsc:"desc",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        age: undefined,
        telephone: undefined,
        dutyYear: undefined,
        image: undefined,
        headId: undefined,
        roadInfoId: undefined,
        dutyId: undefined,
        ruralId: undefined,
        number: undefined,
        leaderName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        ruralId:[
          {required:true,message:"乡村不能为空",trigger:"blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getRuralOptions();
    this.getRuralList();

  },
  watch: {
    open(val) {
      if (val === false) {
        this.hideAvatar = false;
        this.currentValue = undefined;
      }
    },
    // 监听级联选择器 选择操作
    currentValue(val) {
      // console.log("级联选择器 变化");
      if (val != null) this.form.ruralId = val[2];
      // console.log(this.form.ruralId)
    }
  },
  methods: {
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
    checkRole,
    //==图片
    avatarChange(file, fileList) {
      this.hideAvatar = fileList.length >= this.avatarlimit;
    },
    // 图片上传成功
    avatarSuccess(response, file, fileList) {
      file.url = response.data;
      this.avatarList = fileList;
    },
    // 图片移除事件
    avatarRemove(file, fileList) {
      this.avatarList = fileList;
      this.hideAvatar = fileList.length >= this.avatarlimit;
    },

    //上传前校验图片
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!');
      }
      return isJPG && isLt10M;
    },


    // 获取所有的乡村列表
    getRuralList() {
      listRuralInfo().then(response => {
        this.ruralList = response.rows;
        // console.log("this.ruralList")
        // console.log(this.ruralList)
      });
    },
    /** 职责详情搜索按钮操作 */
    dutyHandleQuery() {
      this.dutyQueryParams.pageNum = 1;
      this.getDutyList();
    },
    /** 职责详情重置按钮操作 */
    dutyResetQuery() {
      this.resetForm("dutyQueryForm");
      this.dutyHandleQuery();
    },
    /** 街道详情搜索按钮操作 */
    roadHandleQuery() {
      this.dutyQueryParams.pageNum = 1;
      this.getRoadList();
    },
    /** 街道详情重置按钮操作 */
    roadResetQuery() {
      this.resetForm("roadQueryForm");
      this.roadHandleQuery();
    },
    //tab点击
    tabClick(tab, event) {
      // console.log("tab.index")
      // console.log(tab.index)
      this.tabIndex = tab.index;
      if (this.tabIndex == '1' && this.roadloading == true) {
        this.getRoadList();
      }

    },
    //查看详情
    catchDetail(row) {
      this.reset();
      const id = row.id
      this.roadloading = true;
      getVillageManage(id).then(response => {
        this.form = response.data;
        //相关职责列表
        listRuralDuty(this.form.id, this.dutyQueryParams).then(response => {
          this.dutyList = response.rows;
          this.dutyTotal = response.total
          this.dutyloading = false;
        });
        //相关街道列表
        listRuralRoad(this.form.id, this.roadQueryParams).then(response => {
          this.roadInfoList = response.rows;
          this.roadTotal = response.total
          this.roadloading = false;
        });
        this.openDetail = true;
        this.title = "查看详情";
      });

    },
    // 获取所有的街道
    getRoadList() {
      this.roadloading = true;
      if (this.form.id != undefined) {
        listRuralRoad(this.form.id, this.roadQueryParams).then(response => {
          this.roadInfoList = response.rows;
          this.roadTotal = response.total
          this.roadloading = false;
          // console.log("road")
          // console.log(this.roadInfoList)
        });
      }
    },

    // 获取相关职责列表
    getDutyList() {
      this.dutyloading = true;
      if (this.form.id != undefined) {
        listRuralDuty(this.form.id, this.dutyQueryParams).then(response => {
          this.dutyList = response.rows;
          this.dutyTotal = response.total
          this.dutyloading = false;
        });

      }
    },
    // 获取所有的乡村 选择器option
    getRuralOptions() {
      optionsByType('50').then(response => {
        this.ruralOptions = response.data;
        // console.log(response);
      });
    },
    // 获取所有的乡村列表
    /*getRuralList(){
      listRural().then(response => {
        this.ruralList = response.rows;
        console.log(this.ruralList)
      });
    },*/
    // 获取所有的村长
    /* getHeaderList(){
      listVillageHead().then(response => {
        this.HeadersList = response.rows;
        // console.log("headId")
        // console.log(this.HeadersList)
      });
    },*/

    /*列表number*/
    indexMethod(index) {
      return ++index;
    },
    /** 查询村档信息列表 */
    getList() {
      this.loading = true;
      listVillageManage(this.queryParams).then(response => {
        this.villageManageList = response.rows;
        // console.log("villageManageList")
        // console.log(this.villageManageList)
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.dutyList = []
      this.roadInfoList = []
      this.activeName = '1';
      this.open = false;
      this.openDetail = false;

      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        age: undefined,
        telephone: undefined,
        dutyYear: undefined,
        image: undefined,
        headId: undefined,
        roadInfoId: undefined,
        dutyId: undefined,
        ruralId: undefined,
        number: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
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
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加村档信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.avatarList = []
      this.reset();
      const id = row.id || this.ids
      getVillageManage(id).then(response => {
        this.form = response.data;
        console.log(this.form)
        this.currentValue = row.currentValue;
        this.open = true;
        this.title = "修改村档信息";
        //头像
        if (this.form.image !== null && this.form.image !== '') {
          this.avatarList.push({
            'url': this.form.image
          })
        }
        this.hideAvatar = this.avatarList.length >= this.avatarlimit;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            if (this.avatarList.length <= 0)
              this.form.image = '';
            else {
              //乡村图片
              for (let i = 0; i < this.avatarList.length; i++) {
                this.form.image = this.avatarList[i].url
              }
            }
            updateVillageManage(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            //相同村只给添加一次
            for (let i = 0; i < this.villageManageList.length; i++) {
              if (this.form.ruralId == this.villageManageList[i].ruralId) {
                this.msgError("已经存在该村档案了，请修改！");
                return;
              }
            }
            addVillageManage(this.form).then(response => {
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
      this.$confirm('是否确认删除村档信息编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delVillageManage(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有村档信息数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportVillageManage(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () {
      });
    }
  }
};
</script>
<style>
  .mytab {
    padding-bottom: 10px;
  }

  .Hide .el-upload--picture-card {
    display: none;
  }

  .Hide .el-upload--picture-card {
    display: none;
  }

  .el-upload-list__item {
    transition: none !important;
  }
</style>
