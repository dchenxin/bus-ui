<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="申请人" prop="applyMen">
        <el-input
          v-model="queryParams.applyMen"
          placeholder="请输入申请人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="年龄" prop="age">
        <el-input
          v-model="queryParams.age"
          placeholder="请输入年龄"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="特派员状态" prop="state">
        <el-input
          v-model="queryParams.state"
          placeholder="请输入特派员状态"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="技术类型" prop="technologyType">
        <el-select v-model="queryParams.technologyType" placeholder="请选择技术类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>-->
      <!--<el-form-item label="档案编号" prop="number">
        <el-input
          v-model="queryParams.number"
          placeholder="请输入档案编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <!--<el-form-item label="发布人id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入发布人id"
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
          v-if="checkRole(['villageAdmin'])||checkRole(['admin'])"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['module:commissioner:add']"
        >申请</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:commissioner:edit']"
        >修改</el-button>
      </el-col>-->
      <!--<el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['module:commissioner:remove']"
        >删除</el-button>
      </el-col>-->
      <!--<el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['module:commissioner:import']"
        >导入
        </el-button>
      </el-col>-->
      <!-- <el-col :span="1.5">
         <el-button
           type="warning"
           icon="el-icon-download"
           size="mini"
           @click="handleExport"
           v-hasPermi="['module:commissioner:export']"
         >导出</el-button>
       </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="commissionerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column type="index" label="序号" :index="indexMethod"/>
      <el-table-column label="申请类型" align="center" prop="applyType"/>
      <el-table-column label="申请人" align="center" prop="applyMen">
<!--        <template slot-scope="scope">-->
<!--          <span v-if="scope.row.applyMen !==''&& scope.row.applyMen !==null" style="color: red">{{scope.row.applyMen}}</span>-->
<!--&lt;!&ndash;          <span v-else>{{scope.row.user.nickName}}</span>&ndash;&gt;-->
<!--        </template>-->
      </el-table-column>
      <el-table-column label="所在村" align="center" prop="detailVillage" >
        <!--<template slot-scope="scope">
          <span v-if="scope.row.ruralId==null || scope.row.ruralId===''">-</span>
          <span v-for="rural in ruralList">
            <span v-if="rural.id ===scope.row.ruralId">{{rural.cityName}}{{rural.countyName}}{{rural.villageName}}</span>
          </span>
          &lt;!&ndash;<span v-if="scope.row.ruralId!=null && scope.row.ruralId!==''">{{scope.row.ruralId}}</span>
          <span v-else>-</span>&ndash;&gt;
        </template>-->
      </el-table-column>
      <el-table-column label="联系电话" align="center" prop="telephone">
      </el-table-column>
      <el-table-column label="问题图片" align="center" prop="image">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.image!=null && scope.row.image!=='[]' && scope.row.image!==''"
            style="width: 150px; height: 80px; padding: 0 20px; display: flex; justify-content:center; align-items:center"
            :src="firstImg(scope.row)"
            fit="cover"
            :preview-src-list="firstImgArray(scope.row)"
          >
            <!--<div slot="error"  class="image-slot">
              <i  class="el-icon-picture-outline"></i>
            </div>-->
          </el-image>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="问题内容" align="center" prop="context"/>
      <el-table-column label="指派人员" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.manage===''||scope.row.manage===null">-</span>
          <span v-else>{{scope.row.manage.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="orderState">
        <template slot-scope="scope">
          <span v-if="scope.row.orderState ==='applying'" style="color:green;">申请中</span>
          <span v-if="scope.row.orderState ==='dispatched'">已派员</span>
          <span v-if="scope.row.orderState ==='finished'">已完成</span>
          <span v-if="scope.row.orderState ==='error'" style="color:red;">申请失败</span>
          <span v-if="scope.row.orderState ==='cancel'" style="color:gray;">已取消</span>
          <span v-if="scope.row.orderState ===''">-</span>
        </template>
      </el-table-column>
      <el-table-column label="审批人" align="center" prop="userId" v-if="checkRole(['countyAdmin'])||checkRole(['admin'])" >
        <template slot-scope="scope">
          <span v-if="scope.row.user ===''||scope.row.user ===null">-</span>
          <span v-else>{{scope.row.user.nickName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span v-if="scope.row.orderState=='applying'&& checkRole(['countyAdmin'])" style="padding: 0 10px;">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-circle-check"
              @click="handleDataScope(scope.row)"
            >审核</el-button>
          </span>
          <span v-if="scope.row.orderState=='applying'&& checkRole(['admin'])" style="padding: 0 10px;">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-circle-check"
              @click="handleDataScope(scope.row)"
            >审核</el-button>
          </span>
          <span v-if="scope.row.orderState=='applying'&& checkRole(['villageAdmin'])" style="padding: 0 10px;">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-circle-close"
              @click="handleCancelScope(scope.row)"
            >取消申请</el-button>
          </span>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
          >详情</el-button>

          <el-button
            v-if="scope.row.orderState=='dispatched' && checkRole(['countyAdmin'])"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:commissioner:edit']"
          >修改</el-button>
          <el-button
            v-if="scope.row.orderState=='dispatched'&&checkRole(['admin'])"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:commissioner:edit']"
          >修改</el-button>
          <el-button
            v-if="checkRole(['villageAdmin'])"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:commissioner:edit']"
          >修改</el-button>
         <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:commissioner:remove']"
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

    <!-- 添加或修改科技特派员对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="申请类型" prop="applyType">
          <el-select v-model="form.applyType" placeholder="请选择申请类型">
            <el-option
              v-for="item in technologyTypeoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="form.telephone" placeholder="请输入联系电话"/>
        </el-form-item>
        <el-form-item label="所在村" prop="ruralId">
          <!--<el-input v-model="form.ruralId" placeholder="请输入考评村编号" />-->
          <el-cascader :options="ruralOptions" v-model="currentValue" :show-all-levels="false" />
        </el-form-item>
        <el-form-item label="申请人" prop="applyMen">
          <el-input v-model="form.applyMen" placeholder="请输入申请人"/>
        </el-form-item>
        <el-form-item label="问题图片" prop="image">
          <!--<el-input v-model="form.image" placeholder="请输入商品图片" />-->
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
        <el-form-item label="问题内容" prop="context">
          <el-input v-model="form.context"
                    placeholder="请输入内容"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"/>
        </el-form-item>
        <el-form-item label="指派人员" prop="commissionerManageId" v-if="checkRole(['countyAdmin'])||checkRole(['admin'])">
          <span v-for="manage in commissionerManageList" >
            <p style="margin-top: 0" v-if="form.commissionerManageId == manage.id"><i class="el-icon-user-solid"></i> {{manage.name}}</p>
          </span>

          <el-button type="primary" @click="examinerHandle" v-if="form.orderState ==='applying'||form.orderState ==='dispatched'">
            <span v-if="form.commissionerManageId === null || form.commissionerManageId ===''">选择特派员</span>
            <span v-else>重新选择特派员</span>
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--详情对话框-->
    <el-dialog :title="title" :visible.sync="detailOpen" width="900px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="申请类型" prop="applyType">
          <span style="padding-left: 10px">{{form.applyType}}</span>
        </el-form-item>
        <el-form-item label="申请人" >
          <span v-if="form.applyMen!==null && form.applyMen!==''" style="padding-left: 10px; color: red" >{{form.applyMen}}</span>
          <span v-for="item in UserList">
            <span v-if="form.userId ===item.userId " style="padding-left: 10px;"  >
              <span v-if="form.applyMen===null || form.applyMen===''">
                {{item.nickName}}
              </span>
            </span>
          </span>
        </el-form-item>
        <el-form-item label="申请人电话" prop="telephone">
          <span v-if="form.telephone!=null" style="padding-left: 10px">{{form.telephone}}</span>
          <span v-else style="padding-left: 10px">-</span>
        </el-form-item>
        <el-form-item label="问题图片" prop="image">
          <div style="display: flex; flex-wrap: wrap;">
            <div v-for="item in detailImgs">
              <el-image
                style="width: 200px; height: 150px; padding: 0 20px"
                :src="item"
                fit="contain"
                :preview-src-list="detailImgs"
              />
            </div>
          </div>
          <span style="padding: 0 10px;" v-if="detailImgs.length===0">暂未上传图片</span>
        </el-form-item>
        <el-form-item label="问题内容" prop="context">
          <div style="padding: 0 10px;">
            <span v-if="form.context!=null" v-html="form.context"/>
            <span style="padding: 0 10px;" v-else>-</span>
          </div>
        </el-form-item>

        <el-form-item label="指派人员" prop="commissionerManageId">
          <span style="padding: 0 10px;" v-if="form.commissionerManageId==null || form.commissionerManageId===''">-</span>
          <span v-for="item in commissionerManageList" v-if="item.id==form.commissionerManageId" style="padding-left: 10px">{{item.name}}</span>
        </el-form-item>
        <el-form-item label="指派人员电话" prop="commissionerManageId">
          <span style="padding: 0 10px;" v-if="form.commissionerManageId==null || form.commissionerManageId===''">-</span>
          <span v-for="item in commissionerManageList" v-if="item.id==form.commissionerManageId" style="padding-left: 10px">{{item.telephone}}</span>
        </el-form-item>
        <el-form-item label="订单状态" prop="orderState">
          <span v-if="form.orderState ==='dispatched'&& form.orderState !==null" style="padding-left: 10px">已派员</span>
          <span v-if="form.orderState ==='applying'&& form.orderState !==null" style="padding-left: 10px">申请中</span>
          <span v-if="form.orderState ==='finished'&& form.orderState !==null" style="padding-left: 10px">已完成</span>
          <span v-if="form.orderState ==='error'&& form.orderState !==null" style="padding-left: 10px">申请失败</span>
          <span v-else-if="form.orderState ===null||form.orderState ===''" style="padding-left: 10px">-</span>
        </el-form-item>

        <el-form-item label="处理结果" prop="result">
          <span style="padding-left: 10px" v-if="form.result!=null">{{form.result}}</span>
          <span style="padding-left: 10px" v-else>-</span>
        </el-form-item>
        <el-form-item label="失败原因" prop="failError">
          <span v-if="form.failError!=null" style="padding-left: 10px">{{form.failError}}</span>
          <span v-else style="padding-left: 10px">-</span>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload"
                 :limit="1"
                 accept=".xlsx, .xls"
                 :headers="upload.headers"
                 :action="upload.url + '?updateSupport=' + upload.updateSupport"
                 :disabled="upload.isUploading"
                 :on-progress="handleFileUploadProgress"
                 :on-success="handleFileSuccess"
                 :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 审核对话详情框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="900px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="申请类型" prop="applyType">
          <span style="padding-left: 10px">{{form.applyType}}</span>
        </el-form-item>
        <el-form-item label="申请人" prop="userId">
          <span v-if="form.applyMen!==null && form.applyMen!==''" style="padding-left: 10px; color: red" >{{form.applyMen}}</span>
          <span v-for="item in UserList">
            <span v-if="form.userId ===item.userId " style="padding-left: 10px;"  >
              <span v-if="form.applyMen===null || form.applyMen===''">
                {{item.nickName}}
              </span>
            </span>
          </span>
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <span v-if="form.telephone!=null" style="padding-left: 10px">{{form.telephone}}</span>
          <span v-else style="padding-left: 10px">-</span>
        </el-form-item>
        <el-form-item label="问题图片" prop="image">
          <div style="display: flex; flex-wrap: wrap;">
            <div v-for="item in detailImgs">
              <el-image
                style="width: 200px; height: 150px; padding: 0 20px"
                :src="item"
                fit="contain"
                :preview-src-list="detailImgs"
              />
            </div>
          </div>
          <span style="padding: 0 10px;" v-if="detailImgs.length===0">暂未上传图片</span>
        </el-form-item>
        <el-form-item label="问题内容" prop="context">
          <div style="padding: 0 10px;">
            <span v-if="form.context!=null" v-html="form.context"/>
            <span style="padding: 0 10px;" v-else>-</span>
          </div>
        </el-form-item>

        <el-form-item label="指派人员" prop="commissionerManageId">
          <span style="padding: 0 10px;" v-if="form.commissionerManageId==null || form.commissionerManageId===''">-</span>
          <span v-for="item in commissionerManageList" v-if="item.id==form.commissionerManageId" style="padding-left: 10px">{{item.name}}</span>
        </el-form-item>
        <el-form-item label="订单状态" prop="orderState">
          <span v-if="form.orderState!=null&&form.orderState=='applying'" style="padding-left: 10px">申请中</span>
          <span v-else style="padding-left: 10px">-</span>
        </el-form-item>

        <!--        <el-form-item label="负责人" prop="personId">-->
        <!--          <span style="padding: 0 10px;" v-if="form.personId==null || form.personId===''">-</span>-->
        <!--          <span v-for="user in userList">-->
        <!--            <span style="padding: 0 10px;" v-if="user.userId ===form.personId">{{user.nickName}}</span>-->
        <!--          </span>-->
        <!--        </el-form-item>-->

        <el-form-item label="处理结果" prop="result">
          <span v-if="form.result!=null" style="padding-left: 10px">{{form.result}}</span>
          <span v-else style="padding-left: 10px">-</span>
        </el-form-item>
        <el-form-item label="失败原因" prop="failError">
          <span v-if="form.failError!=null" style="padding-left: 10px">{{form.failError}}</span>
          <span v-else style="padding-left: 10px">-</span>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="examinedScope">指派人员</el-button>
<!--        <el-button type="primary" @click="submitDataScope">确 定</el-button>-->
        <el-button type="danger" @click="cancelFailDataScope">审核失败</el-button>
      </div>
    </el-dialog>


    <!-- 审核选择指派人员对话框 -->
    <el-dialog title="选择指派人员" :visible.sync="examinerOpen" width="900px" append-to-body>
      <el-form :model="examinerQueryParams" ref="examinerQueryForm" :inline="true" label-width="68px">
        <el-form-item label="状态" prop="manageState">
          <el-select v-model="examinerQueryParams.manageState" placeholder="请选择状态">
            <el-option value="free" label="空闲中"/>
            <el-option value="accepted" label="已派员"/>
          </el-select>
        </el-form-item>
        <el-form-item label="技术类型" prop="technologyType">
          <el-select v-model="examinerQueryParams.technologyType" placeholder="请选择技术类型">
            <el-option value="软件故障" label="软件故障"/>
            <el-option value="设备故障" label="设备故障"/>
            <el-option value="农业生产" label="农业生产"/>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="examinerHandleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="examinerResetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="examinerLoading" :data="examinerList" @selection-change="examinerHandleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="编号" align="center" prop="number" />
        <el-table-column label="特派员姓名" align="center" prop="name" />
        <!--        <el-table-column label="所在村" align="center" prop="ruralId" >-->
        <!--          <template slot-scope="scope">-->
        <!--            <span v-if="scope.row.ruralId==null || scope.row.ruralId===''">-</span>-->
        <!--            <span v-for="rural in ruralList">-->
        <!--              <span v-if="rural.id ===scope.row.ruralId">{{rural.villageName}}</span>-->
        <!--            </span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="技术类型" align="center" prop="technologyType" />
        <el-table-column label="特派员状态" align="center" prop="manageState" >
          <template slot-scope="scope">
            <span v-if="scope.row.manageState==='free'">空闲中</span>
            <span v-else-if="scope.row.manageState==='accepted'" style="color: red">已派员</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="examinerTotal>0"
        :total="examinerTotal"
        :page.sync="examinerQueryParams.pageNum"
        :limit.sync="examinerQueryParams.pageSize"
        @pagination="getExaminerList"
      />
      <div slot="footer" class="dialog-footer">
        <span v-if="this.open" style="padding: 0 10px">
              <el-button type="primary" @click="restartSubmitForm">确 定</el-button>
          </span>
          <span v-else style="padding: 0 10px">
            <el-button type="primary" @click="examinerSubmitForm">确 定</el-button>
        </span>
        <el-button @click="examinerCancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 审核失败框 -->
    <el-dialog :title="title" :visible.sync="ExamineFailScope" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item label="失败原因">
          <el-input v-model="form.failError"
                    placeholder="请填写失败原因"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">

        <el-button type="primary" @click="submitFailErrorDataScope">确 定</el-button>
        <el-button type="danger" @click="cancelExamineFailDataScope">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCommissioner,
  getCommissioner,
  delCommissioner,
  cancelOne,
  addCommissioner,
  updateCommissioner,
  exportCommissioner,
  importTemplate,
  listUser,
  ExamineFail,
  ExamineOne,
  restartExamineOne
} from "@/api/module/commissioner";
import {getToken} from '@/utils/auth';
// import {listUser} from '@/api/system/user';
import {isIntegerNotMust} from "../../../utils/validate";
import { listCommissionerManageAll} from "@/api/module/commissionerManage";
import { checkPermi, checkRole } from "@/utils/permission";
import {optionsByType} from "@/api/module/ruralInfo"; // 权限判断函数
export default {
  name: "Commissioner",
  data() {
    return {
      checkRole,
      //选择人员框start------------------------------------

      //选择指派人员框
      // 总条数
      examinerTotal: 0,
      examinerLoading: true,
      examinerOpen:false,
      // 查询参数
      examinerQueryParams: {
        pageNum: 1,
        pageSize: 10,
        manageState: undefined,
        name: undefined,
        technologyType: undefined,
        orderByColumn:"createTime",
        isAsc:"desc",
      },
      examinerLoading: true,
      // 所有可选派人员
      examinerList: [],
      examinerIds: [],
      //选择人员框end-----------------------------
      // 所有乡村
      ruralList: [],
      // 所有乡村option列表 label value
      ruralOptions: [],
      // 保存当前级联选择器的值 如：["N01000000", "N01M01000", "N01M01X01"]
      currentValue: [],
      //审核对话详情框
      openDataScope:false,
      //审核失败框
      ExamineFailScope:false,
      //指派人员
      commissionerManageList:[],
      // 详情图片
      detailImgs: [],
      // 详情开关
      detailOpen: false,
      // 详情图片
      detailImgs: [],

      // 图片对象数组
      picList: [],
      hideImageUploadEdit: false, // 上传限制 隐藏上传按钮
      limit: 3, //图片数量限制
      dialogImageUrl: '', //预览
      dialogVisible: false,
      uploadUrl: process.env.VUE_APP_BASE_API + "/api/file/upload",


      //技术类型
      technologyTypeoptions: [{
        value: '软件故障',
        label: '软件故障'
      }, {
        value: '设备故障',
        label: '设备故障'
      }, {
        value: '农业生产',
        label: '农业生产'
      }],
      value: '',
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
      // 科技特派员表格数据
      commissionerList: [],
      //用户数据
      UserList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 用户性别字典
      sexOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        number: undefined,
        image: undefined,
        orderState: undefined,
        context: undefined,
        result: undefined,
        ruralId: undefined,
        userId: undefined,
        originExaminerId: undefined,
        failError: undefined,
        user: undefined,
        applyMen: undefined,
        commissionerManageId: undefined,
        applyType: undefined,
        orderByColumn:"createTime",
        isAsc:"desc",
      },
      // 用户导入参数s
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/module/commissioner/importData",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        applyMen: [
          { required: true, message: "申请人不能为空", trigger: "blur" }
        ],
        telephone:[
          {required:true,message:"联系电话不能为空",trigger:"blur"},
          {
            // pattern:/^-?\d+(\.\d+)?$/,
            pattern:/^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message:"请输入正确的手机号",
            trigger: "blur"
          },
          {
            //整数验证
            validator:isIntegerNotMust,
            trigger: 'blur'
          },
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getUserList();
    this.getRuralOptions();
    // this.getRuralList();
    this.getCommissionerManageList();
    this.getExaminerList();
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
  },
  watch: {
    // 新增和编辑 关闭时清空图片对象数组
    open(val) {
      if (val === false) {
        this.picList = [];
        this.hideImageUploadEdit = false;
        this.currentValue = undefined;
      }

    },
    // 详情 关闭时清空图片对象数组
    detailOpen(val){
      if (val===false) {
        this.detailImgs = [];
      }
    },
    // 监听级联选择器 选择操作
    currentValue(val){
      // console.log("级联选择器 变化");
      if (val!=null) this.form.ruralId = val[2];
      // console.log(this.form.ruralId)
    }
  },
  methods: {
    //从新选择指派人员
    restartSubmitForm() {
      if (this.examinerIds.length > 1) {
        this.msgError("只能指派一个特派员");
        return;
      }
      this.form.commissionerManageId = this.examinerIds[0];
      this.examinerOpen = false;
      this.examinerResetQuery();
    },
    // 选择指派人员按钮
    examinerHandle() {
      this.examinerOpen = true;
      //刷新特派员名单
      this.getCommissionerManageList();
      this.resetForm("queryForm");
    },
    // 确认指派人员
    examinerSubmitForm: function () {
      if (this.examinerIds.length > 1) {
        this.msgError("只能指派一个特派员");
        return;
      }
      ExamineOne(this.form.id,this.examinerIds[0]).then(response => {
        if (response.code === 200) {
          this.msgSuccess("审核成功");
          //刷新特派员名单
          this.getCommissionerManageList();
          this.openDataScope = false;
          this.examinerOpen = false;
          this.getList();
        }
      });
      this.examinerResetQuery();
    },
    // 取消按钮 指派人员
    examinerCancel(){
      this.examinerOpen = false;
      this.examinerResetQuery();
    },
    /*列表number*/
    indexMethod(index) {
      return ++index;
    },
    /** 查询空闲状态科技特派员信息 */
    getCommissionerManageList() {
      listCommissionerManageAll().then(response => {
        this.commissionerManageList = response.rows;
        // console.log("this.commissionerManageList")
        // console.log(this.commissionerManageList)
      });
    },
    /** 查询科技特派员订单 */
    getList() {
      this.loading = true;
      listCommissioner(this.queryParams).then(response => {
        this.commissionerList = response.rows;
        // console.log("commissionerList")
        // console.log(this.commissionerList)
        this.total = response.total;
        this.loading = false;
      });
    },
    // 获取所有的可选派人员
    getExaminerList(){
      this.examinerLoading = true;
      listCommissionerManageAll(this.examinerQueryParams).then(response => {
        this.examinerList = response.rows;
        this.examinerTotal = response.total;
        this.examinerLoading = false;
        // console.log("this.examinerList")
        // console.log(this.examinerList)
        // console.log("this.examinerTotal" )
      });
    },
    // 获取所有的乡村列表
    /*getRuralList(){
      listRural().then(response => {
        this.ruralList = response.rows;
      });
    },*/
    // 获取所有的用户
    getUserList(){
      listUser().then(response => {
        this.UserList = response.rows;
        // console.log("this.UserList")
        // console.log(this.UserList)
      });
    },
    // 获取所有的乡村 选择器option
    getRuralOptions(){
      optionsByType('50').then(response => {
        this.ruralOptions = response.data;
        // console.log(response);
      });
    },
    // 用户性别字典翻译
    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.sex);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.detailOpen = false;
      this.reset();
    },
    // 审核失败按钮（审核失败框）
    cancelFailDataScope() {
      this.ExamineFailScope = true;
    },

    // 审核失败取消按钮（审核失败框）
    cancelExamineFailDataScope() {
      this.ExamineFailScope = false;
      this.reset();
    },

    // 指派派员按钮（审核）
    examinedScope() {
      // this.ExamineScope = true;
      this.examinerOpen = true;
      this.resetForm("queryForm");

      this.title='特派人员'
    },


    // 获取首张图片 url
    firstImg(row) {
      var images = [];
      if (row.image != null && row.image !== '[]') {
        images = JSON.parse(row.image);
        return images[0];
      }
      return null;
    },

    firstImgArray(row) {
      var images = [];
      images.push(this.firstImg(row));
      return images;
    },

    // 加文件、上传成功和上传失败时都会被调用
    handleEditChange(file, fileList) {
      this.hideImageUploadEdit = fileList.length >= this.limit;
    },
    // 图片上传成功
    handleSuccess(response, file, fileList) {
      file.url = response.data;
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
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!');
      }
      return isJPG && isLt10M;
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "特派员导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },

    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        age: undefined,
        sex: undefined,
        state: undefined,
        technologyType: undefined,
        number: undefined,
      };
      this.resetForm("form");
    },
    /** 指派人员 重置按钮操作 */
    examinerResetQuery() {
      this.resetForm("examinerQueryForm");
      this.examinerHandleQuery();
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
    // 指派 多选框选中数据
    examinerHandleSelectionChange(selection) {
      if (selection.length > 1) this.msgError("只能指派一个科技特派员");
      this.examinerIds = selection.map(item => item.id);
    },
    /** 搜索按钮操作 */
    examinerHandleQuery() {
      this.examinerQueryParams.pageNum = 1;
      this.getExaminerList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "申请科技特派员";
    },
    /** 审核权限操作 */
    handleDataScope(row) {
      this.reset();
      const id = row.id || this.ids
      getCommissioner(id).then(response => {
        this.form = response.data;
        if (this.form.image!=null && this.form.image!=='' && this.form.image!=='[]'){
          this.detailImgs = JSON.parse(this.form.image); //详情的图片数组
        }
        this.openDataScope = true;
        this.title = "审核特派员";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCommissioner(id).then(response => {
        this.form = response.data;
        // console.log("this.form")
        // console.log(this.form)
        this.currentValue = row.currentValue;
        this.open = true;
        this.title = "修改科技特派员";
        // 读取 图片数组 -> 图片对象数组
        if (this.form.image != null && this.form.image !== '[]' && this.form.image !== '') {
          for (let j = 0; j < JSON.parse(this.form.image).length; j++) {
            this.picList.push({
              'url': JSON.parse(this.form.image)[j]
            })
          }
          this.hideImageUploadEdit = this.picList.length >= this.limit;
        }
      });
    },
    // 详情页按钮操作
    handleDetail(row) {
      this.reset();
      const id = row.id;
      getCommissioner(id).then(response => {
        this.form = response.data;
        if (this.form.image!=null && this.form.image!=='' && this.form.image!=='[]'){
          this.detailImgs = JSON.parse(this.form.image); //详情的图片数组
        }
        this.detailOpen = true;
        this.title = "科技特派员详情";
      });
    },
      /** 提交按钮 */
    submitForm: function() {
          this.$refs["form"].validate(valid => {
              if (valid) {
                  if (this.form.id != undefined) {
                    // 提交时图片保存为 json 格式
                    var images = [];
                    for (let i = 0; i < this.picList.length; i++) {
                      images.push(this.picList[i].url)
                    }
                    this.form.image = JSON.stringify(images);
                    updateCommissioner(this.form).then(response => {
                      if (response.code === 200) {
                        this.msgSuccess("修改成功");
                        this.open = false;
                        //刷新特派员名单
                        this.getExaminerList();
                        this.getList();
                      }
                    });
                  } else {
                      addCommissioner(this.form).then(response => {
                          if (response.code === 200) {
                              this.msgSuccess("新增成功");
                              this.open = false;
                              //刷新特派员名单
                            this.getExaminerList();
                              this.getList();
                          }
                      });
                  }
              }
          });
    },
    /** 提交按钮（审核失败） */
    submitFailErrorDataScope: function() {
      ExamineFail(this.form).then(response => {
        if (response.code === 200) {
          this.msgSuccess("审核成功");
          this.openDataScope = false;
          this.ExamineFailScope = false;
          this.getList();
        }
      });

    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除科技特派员编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCommissioner(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /*取消申请操作*/
    handleCancelScope(row) {
      const id = row.id || this.ids
      this.$confirm('是否确认取消科技特派员为"' + row.applyType + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return cancelOne(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("取消申请成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有科技特派员数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCommissioner(queryParams);
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
