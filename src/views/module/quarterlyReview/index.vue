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
      <el-form-item label="乡村名" prop="ruralId">
        <el-select clearable filterable size="small" v-model="queryParams.ruralId" placeholder="请输入乡村名" filterable
                   clearable>
          <el-option
            v-for="item in ruralList"
            :label="resetRuralName(item)"
            :value="item.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="请选择考评任务" prop="groupId">
        <el-select v-model="queryParams.groupId" placeholder="请选择考评任务" clearable>
          <el-option
            v-for="item in taskList"
            :key="item.id"
            :label="item.title"
            :value="item.id"/>
        </el-select>
      </el-form-item>


      <el-form-item>

        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          style="margin-right: 10px;margin-top: 4px;"
          v-if="checkRole(['countyAdmin']) || checkRole(['cityAdmin']) || checkRole(['admin'])"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['module:quarterlyReview:add']"
        >发布
        </el-button>
      </el-col>
      <el-col :span="1.5" v-if="checkRole(['countyAdmin']) || checkRole(['cityAdmin']) || checkRole(['admin'])">
        <el-select @change="changeGroup" v-model="exportQueryParams.groupId" placeholder="请选择考评任务" clearable>
          <el-option
            v-for="item in taskList"
            :key="item.id"
            :label="item.title"
            :value="item.id"/>
        </el-select>
      </el-col>
      <el-col :span="1.5" v-if="checkRole(['countyAdmin']) || checkRole(['cityAdmin']) || checkRole(['admin'])">
        <el-select v-model="exportQueryParams.type" placeholder="请选择导出种类">
          <el-option v-for="item in exportType" :label="item.label" :value="item.value"/>
          <!--<el-option label="示范带导出" value="1"/>
          <el-option label="试点村导出" value="2"/>
          <el-option label="试点村统计" value="3"/>-->
        </el-select>
      </el-col>
      <!--<el-col :span="1.5">
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
      </el-col>-->
      <!--<el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module:quarterlyReview:export']"
        >导出</el-button>
      </el-col>-->
      <el-col :span="1.5" v-if="checkRole(['countyAdmin']) || checkRole(['cityAdmin']) || checkRole(['admin'])">
        <el-button
          style="margin-top: 4px;"
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5" v-if="(checkRole(['cityAdmin'])|| checkRole(['admin']))">
      <el-button
        style="margin-top: 4px;"
        size="mini"
        type="primary"
        icon="el-icon-back"
        @click="multiEvaluationGoBack()"
      >考评回退
      </el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExportVillage"
        >试点村导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="quarterlyReviewList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--<el-table-column label="标题" align="center" prop="id" />-->
      <el-table-column type="index" align="center" label="序号" :index="indexMethod"/>
      <!--<el-table-column label="发布人" width="100px" align="center" prop="nickName" />-->

      <el-table-column label="考评类型" width="120" align="center" prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 0">考评员村级考评</span>
          <span v-else-if="scope.row.type === 1">乡镇流程考评</span>
          <span v-else-if="scope.row.type === 2">试点村考评</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="标题" width="180px" align="center" prop="title" show-overflow-tooltip/>


      <el-table-column label="考评任务" width="180px" align="center" prop="groupName" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.groupName == null || scope.row.groupName === ''">-</span>
          <span v-else>{{scope.row.groupName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="考评地区" width="150px" align="center" prop="ruralName">
        <template slot-scope="scope">
          <!--<span v-if="scope.row.ruralName==null || scope.row.ruralName===''">-</span>
          <span v-else>{{scope.row.ruralName}}</span>-->
          {{formatVillageName(scope.row.rural)}}
        </template>
      </el-table-column>

      <el-table-column label="考评时间" align="center" prop="reviewTime" width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.reviewTime == null || scope.row.reviewTime === '' ">-</span>
          <span>{{ parseTime(scope.row.reviewTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="考评员" align="center" prop="examinerName">
        <template slot-scope="scope">
          <span v-if="scope.row.examinerName==null || scope.row.examinerName===''">-</span>
          <span v-else>{{scope.row.examinerName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="考评总分" align="center" prop="score">
        <template slot-scope="scope">
          <span v-if="scope.row.score !== '' && scope.row.score != null ">{{scope.row.score}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="考评状态" align="center" prop="state">
        <template slot-scope="scope">
          <span v-if="scope.row.state==='publish'" style="color: dodgerblue;">待考评</span>
          <span v-else-if="scope.row.state==='self'" style="color: green">自评完成</span>
          <span v-else-if="scope.row.state==='finish'" style="color: green">考评完成</span>
          <span v-else-if="scope.row.state==='cancel'" style="color: red">取消</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150px" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button
            v-if="scope.row.state==='publish' && checkRole(['admin'])"
            size="mini"
            type="text"
            icon="el-icon-s-claim"
            @click="handleScore(scope.row)"
          >评分</el-button>-->
          <el-button
            v-if="(scope.row.state==='finish' || scope.row.state==='publish' ) && (checkRole(['countyAdmin']) || checkRole(['cityAdmin']) || checkRole(['admin']))"
            size="mini"
            type="text"
            icon="el-icon-s-claim"
            @click="handleScoreResult(scope.row)"
          >评分结果
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
          >详情
          </el-button>
          <el-button
            v-if="((scope.row.state!=='finish' || scope.row.state!=='publish')&& (checkRole(['countyAdmin']) || checkRole(['cityAdmin'])))
            || checkRole(['admin'])"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:quarterlyReview:edit']"
          >修改
          </el-button>
          <el-button
            v-if="(scope.row.state==='finish' && (checkRole(['cityAdmin'])|| checkRole(['admin'])))"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="evaluationGoBack(scope.row)"
            v-hasPermi="['module:quarterlyReview:edit']"
          >考评回退
          </el-button>
          <el-button
            v-if="(scope.row.state!=='finish' && (checkRole(['countyAdmin']) || checkRole(['cityAdmin'])))
            || checkRole(['admin'])"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:quarterlyReview:remove']"
          >删除
          </el-button>
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

    <!-- 添加或修改季度考评对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" :close-on-click-modal="false" append-to-body>
      <div style="padding: 0 0 20px 100px;">
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="考评类型">
          <el-radio-group v-model="reviewType" @change="changeReviewType">
            <el-radio :label="0" border>考评员村级考评</el-radio>
            <el-radio v-if="title === '发布季度考评'" :label="1" border disabled>乡镇流程考评</el-radio>
            <el-radio v-else :label="1" border>乡镇流程考评</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="考评任务" prop="groupId">
          <el-select v-model="form.groupId" placeholder="请选择考评任务" @change="changeReviewGroup">
            <el-option
              v-for="item in taskList"
              :key="item.id"
              :label="item.title"
              :value="item.id"/>
          </el-select><!-- 可清空 -->
        </el-form-item>
        <el-form-item label="考评标题" prop="title">
          <el-input v-model="form.title" placeholder="例如：2021第一季度乡村振兴试点村考评" maxlength="200" show-word-limit/>
        </el-form-item>
        <!--<el-form-item label="地区类型" prop="ruralType">
          <el-select v-model="form.ruralType" @change="changeAOption" placeholder="请先选择地区类型">
            <el-option label="市级" :value="level.city" />
            <el-option label="县区" :value="level.county" />
            <el-option label="乡镇" :value="level.town" />
            <el-option label="村级" :value="level.village" />
          </el-select>
          <span v-if="!form.ruralType" style="padding: 0 10px; color: red;">(需要先选择地区类型)</span>
          <el-checkbox v-if="form.ruralType === level.county && this.title === '发布季度考评'" v-model="form.isAllTown" style="margin-left: 20px;">对该县区所有乡镇发布考评</el-checkbox>
          <el-checkbox v-if="form.ruralType === level.town && this.title === '发布季度考评'" v-model="form.isAllVillage" style="margin-left: 20px;">对该乡镇所有村发布考评</el-checkbox>
        </el-form-item>-->
        <el-form-item label="考评地区" prop="ruralId" v-if="title === '编辑季度考评'">
          <el-cascader :options="ruralOptions" v-model="currentValue" :show-all-levels="false"/>
        </el-form-item>
        <el-form-item label="地区多选" v-if="title === '发布季度考评'">
          <el-tree
            :data="treeOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"/>
        </el-form-item>

        <el-form-item v-if="reviewType === 0" label="考评员" prop="examinerId">
          <div v-if="form.examinerId != null && form.examinerId !==''"><i class="el-icon-user-solid"/> {{examinerName}}
          </div>
          <!--<span v-for="examiner in examinerList">
            <div style="margin-top: 0" v-if="form.examinerId === examiner.id"> {{examinerName}}</div>
          </span>-->
          <el-button type="primary" @click="examinerHandle">
            <span v-if="form.examinerId == null || form.examinerId ===''">选择考评员</span>
            <span v-else>重新选择考评员</span>
          </el-button>
        </el-form-item>
        <el-form-item label="考评时间" prop="reviewTime">
          <el-date-picker style="width: 200px"
                          @change="changeDate"
                          clearable size="small"
                          v-model="form.reviewTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"
                          placeholder="选择考评时间">
          </el-date-picker>
        </el-form-item>

      </el-form>
      <!--<el-form v-else ref="townReviewForm" :model="townReviewForm" :rules="townReviewRules" label-width="100px">
        乡镇考评
      </el-form>-->

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 季度考评信息 详情页 -->
    <el-dialog :title="title" :visible.sync="detailOpen" width="900px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="编号" prop="number">
          <span style="padding-left: 10px">{{form.number}}</span>
        </el-form-item>
        <el-form-item label="考评类型" prop="type">
          <span style="padding-left: 10px" v-if="form.type === 0">考评员村级考评</span>
          <span style="padding-left: 10px" v-else-if="form.type === 1">乡镇流程考评</span>
          <span style="padding-left: 10px" v-else>-</span>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <span style="padding-left: 10px">{{form.title}}</span>
        </el-form-item>
        <el-form-item label="考评任务" prop="groupName">
          <span style="padding-left: 10px">{{form.groupName}}</span>
        </el-form-item>
        <el-form-item label="考评地区" prop="ruralId">
          <span>{{formatVillageName(form.rural)}}</span>
          <!--<span style="padding: 0 10px;" v-if="form.ruralName==null || form.ruralName===''">-</span>
          <span style="padding: 0 10px;" v-else>{{form.ruralName}}</span>-->
        </el-form-item>
        <el-form-item label="发布时间" prop="createTime">
          <span style="padding-left: 10px">{{ parseTime(form.createTime, '{y}-{m}-{d} {h}:{i}') }}</span>
        </el-form-item>
        <el-form-item label="发布人" prop="title">
          <span style="padding-left: 10px">{{form.nickName}}</span>
        </el-form-item>
        <el-form-item label="考评时间" prop="reviewTime">
          <span style="padding-left: 10px">{{ parseTime(form.reviewTime, '{y}-{m}-{d}') }}</span>
        </el-form-item>

        <el-form-item label="考评员" prop="examinerId">
          <span style="padding: 0 10px;" v-if="form.examinerId==null || form.examinerId===''">-</span>
          <span v-for="examiner in examinerList">
            <span style="padding: 0 10px;" v-if="examiner.id ===form.examinerId">{{examiner.name}}</span>
          </span>
        </el-form-item>

        <el-form-item label="分数" prop="score">
          <div style="padding: 0 10px;">
            <span v-if="form.score!=null">{{form.score}}</span>
            <span v-else>暂未打分</span>
          </div>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 选择考评人对话框 -->
    <el-dialog title="选择考评员" :visible.sync="examinerOpen" width="900px" append-to-body>

      <!--<el-form :model="examinerQueryParams" ref="examinerQueryForm" :inline="true" label-width="68px">
        <el-form-item label="状态" prop="state">
          <el-select v-model="examinerQueryParams.state" placeholder="请选择状态">
            <el-option value="leisure" label="空闲"/>
            <el-option value="appoint" label="已指定"/>
            <el-option value="busy" label="考评中"/>
          </el-select>
          &lt;!&ndash;<el-input
            v-model="queryParams.number"
            placeholder="请输入编号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />&ndash;&gt;
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="examinerHandleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="examinerResetQuery">重置</el-button>
        </el-form-item>
      </el-form>-->

      <el-table v-loading="examinerLoading" :data="examinerList" @selection-change="examinerHandleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <!--<el-table-column label="id" align="center" prop="id" />-->
        <el-table-column label="编号" align="center" prop="number"/>
        <!--<el-table-column label="派往村" align="center" prop="ruralId">
          <template slot-scope="scope">
            <span v-if="scope.row.ruralId==null || scope.row.ruralId===''">-</span>
            <span v-for="rural in ruralList">
            <span v-if="rural.id ===scope.row.ruralId">{{rural.villageName}}</span>
          </span>
            &lt;!&ndash;<span v-if="scope.row.ruralId!=null && scope.row.ruralId!==''">{{scope.row.ruralId}}</span>
            <span v-else>-</span>&ndash;&gt;
          </template>
        </el-table-column>-->
        <el-table-column label="姓名" align="center" prop="name"/>
        <el-table-column label="联系方式" align="center" prop="phone">
          <template slot-scope="scope">
            <span v-if="scope.row.phone==null || scope.row.phone===''">-</span>
            <span v-else>{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column label="所在县市" align="center" prop="addressId">
          <template slot-scope="scope">
            <!--<span v-if="scope.row.addressId==null || scope.row.addressId===''">-</span>
            <span v-for="rural in ruralList">
              <span v-if="rural.id ===scope.row.addressId">{{rural.cityName}}{{rural.countyName}}</span>
            </span>-->
            <span>{{formatVillageName(scope.row.rural)}}</span>
          </template>
        </el-table-column>

        <!--<el-table-column label="状态" align="center" prop="state" >
          <template slot-scope="scope">
            <span style="color:green" v-if="scope.row.state==='leisure'">空闲</span>
            <span style="color:red" v-else-if="scope.row.state==='appoint'">已指定</span>
            <span style="color:red" v-else-if="scope.row.state==='busy'">考评中</span>
            <span v-else>-</span>
          </template>
        </el-table-column>-->
      </el-table>
      <pagination
        v-show="examinerTotal>0"
        :total="examinerTotal"
        :page.sync="examinerQueryParams.pageNum"
        :limit.sync="examinerQueryParams.pageSize"
        @pagination="getExaminerList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="examinerSubmitForm">确 定</el-button>
        <el-button @click="examinerCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看评分结果 对话框 -->
    <el-dialog :title="title" :visible.sync="resultOpen" width="900px" :close-on-click-modal="false" append-to-body>

      <el-table v-if="showScore" v-loading="resultLoading" :data="resultScoreList">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column type="index" label="序号" align="center" :index="indexMethodScore"/>
        <el-table-column label="评分编号" align="center" prop="itemName">
          <template slot-scope="scope">JD{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="指标项" align="center" prop="itemName"/>
        <!--        <el-table-column label="图片依据" width="150px" align="center" prop="image" >
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

        <el-table-column label="图片依据" width="150px" align="center" prop="image">
          <template slot-scope="scope">


            <el-image v-for="(image,index) in getFirstImage(scope.row)" :src="image"
                      :preview-src-list="getFirstImageArray(scope.row)">

            </el-image>
          </template>
        </el-table-column>


        <el-table-column label="单项得分" align="center" prop="score">
          <template slot-scope="scope">
            <span v-if="scope.row.score == null">-</span>
            <span v-else>{{scope.row.score}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdateScore(scope.row)"
              v-hasPermi="['module:quarterlyReviewScore:edit']"
            >修改
            </el-button>

          </template>
        </el-table-column>
      </el-table>
      <pagination v-if="showScore"
        v-show="resultScoreTotal>0"
        :total="resultScoreTotal"
        :page.sync="resultScoreQueryParams.pageNum"
        :limit.sync="resultScoreQueryParams.pageSize"
        @pagination="getResultScoreList"
      />
      <el-table v-if="showSave" v-loading="resultLoading" :data="resultScoreSaveList">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column type="index" label="序号" align="center" :index="indexMethodScore"/>
        <el-table-column label="评分编号" align="center" prop="itemTitle">
          <template slot-scope="scope">JD{{scope.row.itemId}}</template>
        </el-table-column>
        <el-table-column label="指标项" align="center" prop="itemTitle"/>
        <el-table-column label="图片依据" width="150px" align="center" prop="image">
          <template slot-scope="scope">


            <el-image v-for="(image,index) in getFirstImage(scope.row)" :src="image"
                      :preview-src-list="getFirstImageArray(scope.row)">

            </el-image>
          </template>
        </el-table-column>


        <el-table-column label="单项得分" align="center" prop="score">
          <template slot-scope="scope">
            <span v-if="scope.row.score == null">-</span>
            <span v-else>{{scope.row.score}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdateScoreSave(scope.row)"
              v-hasPermi="['module:quarterlyReviewScore:edit']"
            >修改
            </el-button>

          </template>
        </el-table-column>
      </el-table>
      <pagination v-if="showSave"
        v-show="resultScoreSaveTotal>0"
        :total="resultScoreSaveTotal"
        :page.sync="resultScoreQueryParams.pageNum"
        :limit.sync="resultScoreQueryParams.pageSize"
        @pagination="getResultScoreSaveList"
      />

      <div slot="footer" class="dialog-footer">
        <el-button v-if="save" style="margin-left: 10px" @click="saveQuarterlyReview()">提交</el-button>
        <el-button style="margin-left: 10px" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改评分明细对话框 -->
    <el-dialog :title="title" :visible.sync="scoreEditOpen" width="500px" append-to-body>
      <el-form ref="scoreEditForm" :model="scoreEditForm" :rules="rules" label-width="80px">
        <el-form-item label="考评标题">
          <span>{{scoreEditForm.reviewName}}</span>
        </el-form-item>
        <el-form-item label="考评项">
          <span>{{scoreEditForm.itemName}}</span>
        </el-form-item>
        <el-form-item label="图片依据" prop="image">
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
            :limit="9"
            :multiple="true"
            :file-list="picList">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="单项分数" prop="score">
          <el-input v-model="scoreEditForm.score" style="width: 150px;" placeholder="请输入单项分数" maxlength="5"/>
          分
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitScoreForm">确 定</el-button>
        <el-button @click="scoreFormCancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="scoreSaveEditOpen" width="500px" append-to-body>
      <el-form ref="scoreSaveEditForm" :model="scoreSaveEditForm" :rules="rules" label-width="80px">
        <el-form-item label="考评项">
          <span>{{scoreSaveEditForm.itemTitle}}</span>
        </el-form-item>
        <el-form-item label="图片依据" prop="image">
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
            :limit="9"
            :multiple="true"
            :file-list="picList">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="单项分数" prop="score">
          <el-input v-model="scoreSaveEditForm.score" style="width: 150px;" placeholder="请输入单项分数" maxlength="5"/>
          分
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitScoreSaveForm">确 定</el-button>
        <el-button @click="scoreFormCancel">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
    import {
        listQuarterlyReview, getQuarterlyReview,
        delQuarterlyReview, addQuarterlyReview,
        updateQuarterlyReview, exportQuarterlyReview,
        setScore, exportReviewCounty, exportReviewVillage, exportReviewStat, exportReviewExaminer, exportDetailScore,
        evaluationGoBack,multiEvaluationGoBack
    } from "@/api/module/quarterlyReview";
    import {
        optionRuralInfo, optionsByType, listAllRural,
        getCodeArray, getPersons, listRural, treeselect
    } from "@/api/module/ruralInfo";
    import {listExaminer, getExaminer, getLeisureExaminers, allExaminer} from "@/api/module/examiner";
    import {
        listQuarterlyReviewScore, getQuarterlyReviewScore, listQuarterlyReviewScoreSave, getQuarterlyReviewScoreSave,
        updateQuarterlyReviewScore,updateQuarterlyReviewScoreSave,createSaveData,SaveQuarterlyReview
    } from "@/api/module/quarterlyReviewScore";
    import {checkPermi, checkRole} from "@/utils/permission"; // 权限判断函数
    import {listQuarterlyReviewGroup} from "@/api/module/quarterlyReviewGroup";

    export default {
        name: "QuarterlyReview",
        data() {
            return {

                level: { // 各地区字面量
                    city: 20,
                    county: 30,
                    town: 40,
                    village: 50,
                },

                ruralList: [], // 所有乡村
                // 所有乡村option列表 label value
                ruralOptions: [],
                // 保存当前级联选择器的值 如：["N01000000", "N01M01000", "N01M01X01"]
                currentValue: [],
                taskList: [], // 所有考评任务
                // 树形列表
                treeOptions: [],

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
                // 季度考评表格数据
                quarterlyReviewList: [],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 考评详情
                detailOpen: false,
                // 详情图片数组
                detailImgs: [],
                // 查询参数
                queryParams: {
                    orderByColumn: "create_time",
                    isAsc: "desc",
                    pageNum: 1,
                    pageSize: 10,
                    title: undefined,
                    groupId: undefined,
                },

                reviewType: 0, // 考评类型 默认值
                examinerName: '',
                /*townReviewForm: {},
                // 表单校验
                townReviewRules: {
                  title: [
                    { required: true, message: "标题不能为空", trigger: "blur" }
                  ],
                },*/
                // ------------------------------------------- 选择考评员 ------------------------
                examinerOpen: false,    // 弹出控制
                examinerLoading: true,  // 加载状态
                examinerList: [],       // 所有考评人
                examinerIds: [],        // 选择的考评人
                examinerTotal: 0,       // 总条数
                examinerQueryParams: {  // 查询参数
                    orderByColumn: "create_time",
                    isAsc: "desc",
                    pageNum: 1,
                    pageSize: 10,
                    state: undefined,
                }, // ---------------------------------------------------------------------------

                // --------------------------------------------------- 地区的选择器 ----------------
                cityOptions: [], // 备选 Options
                countyOptions: [],
                villageOptions: [],
                townOptions: [],
                ruralOptions: [], // 当前的选择器
                currentValue: [], // 保存当前选择器的值 如：["N01000000", "N01M01000", "N01M01X01"]
                //-----------------------------------------

                currentValueExport: [], // 导出选择器
                // exportId: undefined,    // 导出 哪个市
                exportSelect: undefined,// 当前选择的导出种类
                exportQueryParams: { // 导出查询参数
                    orderByColumn: "score",
                    isAsc: "desc",
                    pageNum: 1,
                    pageSize: 1000000,
                    // state: undefined,
                    groupId: undefined, // 选中的任务
                    typeId: undefined, // 选中的种类
                    groupName: undefined, // 任务的标题
                    type: undefined, // 导出的种类
                },
                exportType: [ // 导出种类
                ],

                // 加载遮罩 -------------------- 打分结果 table页
                resultLoading: true,
                // 打分结果数据
                resultScoreList: [],
                resultScoreSaveList: [],
                // 结果数量
                resultScoreTotal: 0,

                resultScoreSaveTotal: 0,

                showSave: false,
                showScore: false,

                //是否可以保存（读取保存的数据）
                save: false,
                quarterlyReviewId: undefined,
                // 考评结果查询参数
                resultScoreQueryParams: {
                    /*orderByColumn: "create_time",
                    isAsc: "desc",*/
                    quarterlyReviewId: undefined,
                    pageNum: 1,
                    pageSize: 10,
                },
                // 考评保存数据查询参数
                resultScoreSaveQueryParams: {
                    group_id: undefined,
                    pageNum: 1,
                    pageSize: 10,
                },
                // --------------------------
                resultOpen: false, // 考评结果弹出控制

                scoreEditOpen: false, //分数编辑表单 弹框
                scoreSaveEditOpen: false,
                scoreEditForm: {}, // 分数编辑表单 参数
                scoreSaveEditForm: {}, // 分数编辑表单 参数

                // 图片对象数组
                picList: [],
                hideImageUploadEdit: false, // 上传限制 隐藏上传按钮
                limit: 1,
                limit1: 9,

                dialogImageUrl: '',
                dialogVisible: false,
                uploadUrl: process.env.VUE_APP_BASE_API + "/api/file/upload",

                // 表单参数
                form: {},
                defaultProps: {
                    children: "children",
                    label: "label"
                },
                // 表单校验
                rules: {
                    title: [
                        {required: true, message: "标题不能为空", trigger: "blur"}
                    ],
                    ruralId: [
                        {required: true, message: "地区不能为空", trigger: "blur"}
                    ],
                    examinerId: [
                        {required: true, message: "考评员不能为空", trigger: "blur"}
                    ],
                    groupId: [
                        {required: true, message: "考评任务不能为空", trigger: "blur"}
                    ],
                    score: [
                        {required: true, message: "考评打分不能为空", trigger: "blur"},
                        {pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/, message: '打分只能为数字及小数', trigger: 'blur'}
                    ],
                    reviewTime: [
                        {required: true, message: "考评时间不能为空", trigger: "blur"}
                    ],
                }
            };
        },
        created() {
            this.getExaminerList();
            this.getList();
            this.get3RuralOptions();
            this.getTaskList();
            this.getRuralList(); //
        },
        watch: {
            // 关闭新增和编辑 清空图片对象数组
            open(val) {
                if (val === false) {
                    // this.picList = [];
                    // this.hideImageUploadEdit = false;
                    this.currentValue = undefined;
                    this.reviewType = 0; // 关闭时恢复默认值
                    this.examinerName = null;
                }
            },

            // 关闭打分结果编辑 清空图片对象数组
            scoreEditOpen(val) {
                if (val === false) {
                    this.picList = [];
                    this.hideImageUploadEdit = false;
                }
            },
            scoreSaveEditOpen(val) {
                if (val === false) {
                    this.picList = [];
                    this.hideImageUploadEdit = false;
                }
            },


            // 关闭打分结果 table
            resultOpen(val) {
                if (val === false) {
                    this.resultScoreQueryParams.pageNum = 1;
                }
            },

            // 详情 关闭时清空图片对象数组
            detailOpen(val) {
                if (val === false) {
                    this.detailImgs = [];
                }
            },

            // 监听级联选择器 选择操作
            currentValue(val) {
                // console.log("级联选择器 变化");
                if (val != null) this.form.ruralId = val[val.length - 1];
                // console.log(this.form.ruralId)
            },
            /*currentValueExport(val){
              if (val!=null) this.exportId = val[val.length-1];
              // console.log(this.form.ruralId)
            },*/
        },
        methods: {
            checkRole,

            /*列表number*/
            /*indexMethod(index) {
              return ++index;
            },*/

            /** 连续序号 */
            indexMethod(index) {
                return (index + 1) + (this.queryParams.pageNum - 1) * this.queryParams.pageSize;
            },

            /** 连续序号 考评结果 */
            indexMethodScore(index) {
                return (index + 1) + (this.resultScoreQueryParams.pageNum - 1) * this.resultScoreQueryParams.pageSize;
            },

            /** 查询季度考评列表 */
            getList() {
                this.loading = true;
                listQuarterlyReview(this.queryParams).then(response => {
                    this.quarterlyReviewList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                });
            },

            // 获取所有的乡村列表
            getRuralList() {
                listAllRural().then(response => {
                    this.ruralList = response.data;
                });
            },

            /** 查询考评任务列表 */
            getTaskList() {
                this.loading = true;
                listQuarterlyReviewGroup(this.queryParams).then(response => {
                    this.taskList = response.rows;
                });
            },

            // 获取所有的考评人
            getExaminerList() {
                this.examinerLoading = true;
                allExaminer(this.examinerQueryParams).then(response => {
                    this.examinerList = response.rows;
                    this.examinerTotal = response.total;
                    this.examinerLoading = false;
                });
            },

            // 获取当前的打分结果
            getResultScoreList(state) {
                this.resultLoading = true;
                this.save = false;
                this.resultScoreQueryParams.quarterlyReviewId = this.quarterlyReviewId;
                listQuarterlyReviewScore(this.resultScoreQueryParams).then(response => {
                    console.log('___实际表数据')
                    console.log(response)
                    this.showScore = true;
                    this.resultScoreList = response.rows;
                    this.resultScoreTotal = response.total;
                    this.resultLoading = false;
                });
            },

            // 获取当前的保存结果
            getResultScoreSaveList(state) {
                this.resultLoading = true;
                this.save = true;
                this.resultScoreQueryParams.groupId = this.quarterlyReviewId;
                console.log(this.resultScoreQueryParams);
                listQuarterlyReviewScoreSave(this.resultScoreQueryParams).then(response => {
                    if(response.total>0){
                        console.log('___读取保存表数据')
                        console.log(response)
                        this.showSave = true;
                        this.resultScoreSaveList = response.rows;
                        this.resultScoreSaveTotal = response.total;
                        this.resultLoading = false;
                    }else {
                        createSaveData(this.resultScoreQueryParams.groupId).then(response => {
                            console.log('___生成数据')
                            console.log(response)
                            this.showSave = true;
                            this.resultScoreSaveList = response.rows;
                            this.resultScoreSaveTotal = response.total;
                            this.resultLoading = false;
                        });
                    }

                });
            },


            // 获取所有的乡村 选择器option
            get3RuralOptions() {
                optionsByType(this.level.city).then(response => { // 市级
                    this.cityOptions = response.data;
                    // console.log(this.level.city);
                    // .log(this.cityOptions);
                });
                optionsByType(this.level.county).then(response => { // 县区
                    this.countyOptions = response.data;
                    // console.log(this.level.county);
                    // console.log(this.countyOptions);
                });
                optionsByType(this.level.town).then(response => { // 乡镇
                    this.townOptions = response.data;
                    // console.log(this.level.town);
                    // console.log(this.townOptions);
                });
                optionsByType(this.level.village).then(response => { // 乡镇
                    this.villageOptions = response.data;
                    // console.log(this.level.village);
                    // console.log(this.villageOptions);
                });
            },

            /** 查询菜单树结构 */
            getMenuTreeselect(level) {
                treeselect(level).then(response => {
                    this.treeOptions = response.data;
                });
            },

            // 所有树形菜单节点数据(包括选中和半选中)
            getMenuAllCheckedKeys() {
                // 半选中的菜单节点 (-的)
                let checkedKeys = this.$refs.menu.getHalfCheckedKeys();
                // 目前被选中的菜单节点 (√的)
                let halfCheckedKeys = this.$refs.menu.getCheckedKeys();
                // let currentKey = this.$refs.menu.getCurrentKey();
                checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
                return checkedKeys;
            },


            /* 详情按钮*/
            handleDetail(row) {
                this.reset();
                const id = row.id;
                getQuarterlyReview(id).then(response => {
                    this.form = response.data;
                    /*if (this.form.image!=null && this.form.image!=='' && this.form.image!=='[]'){
                      this.detailImgs=JSON.parse(this.form.image);
                    }*/
                    this.detailOpen = true;
                    this.title = "季度考核详情";
                });
            },
            /* 考评回退（单个）*/
            evaluationGoBack(row) {
                const ids = row.id || this.ids;
                this.$confirm('是否确认回退季度考评的数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function () {
                    return evaluationGoBack(ids);
                }).then(() => {
                    this.getList();
                    this.msgSuccess("回退成功");
                }).catch(function () {
                });
            },
            /* 考评回退（多条）*/
            multiEvaluationGoBack() {
                var ids =  this.ids;
                console.log(ids);
                if(ids==null||ids.length==0){
                    this.msgError("请选择需要回退的考评任务！");
                    return;
                }
                this.$confirm('是否确认回退选中的季度考评的数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function () {
                    return multiEvaluationGoBack(ids);
                }).then(() => {
                    this.getList();
                    this.msgSuccess("回退成功");
                }).catch(function () {
                });
            },
            // 完整乡村名称
            resetRuralName(item) {
                var result = '';
                if (item.cityName != null && item.cityName !== '') result += item.cityName;
                if (item.countyName != null && item.countyName !== '') result += item.countyName;
                if (item.townName != null && item.townName !== '') result += item.townName;
                if (item.villageName != null && item.villageName !== '') result += item.villageName;
                return result;
            },

            // 获取首张 url ----------------------------------- 图片 --------------------------------
            getFirstImage(row) {
                var images = [];
                if (row.image != null && row.image !== '[]' && row.image != '') {
                    images = JSON.parse(row.image);
                    //console.log("----------");
                    //console.log(images);

                    return images;
                }
                return null;
            },

            getImgList(index) {
                let arr = []
                let i = 0;
                for (i; i < this.images.length; i++) {
                    arr.push(this.images[i + index])
                    if (i + index >= this.images.length - 1) {
                        index = 0 - (i + 1);
                    }
                }
                return arr;
            },

            getFirstImageArray(row) {
                var images = [];
                // images.push(this.getFirstImage(row));
                images = JSON.parse(row.image);

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
            // 图片上传失败
            handleError(err, file, fileList) {
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
                // const isLt10M = file.size / 1024 / 1024 < 10;

                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
                }
                /*if (!isLt10M) {
                  this.$message.error('上传图片大小不能超过 10MB!');
                }*/
                return isJPG;
            }, // -----------------------------------------------------------------------

            // -----------------------------------考评发布 -------------------------------
            // 考评类型改变事件
            changeReviewType() {
                // this.form.type = this.reviewType;
                if (this.reviewType === 1) {
                    this.form.examinerId = undefined;
                }
                this.changeOptions();
            },
            // 考评任务改变事件
            changeReviewGroup(groupId) {
                this.taskList.forEach(t => {
                    if (t.id === groupId) {
                        var now = new Date(); // 自动填充标题
                        this.form.title = t.title + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
                    }
                })
            },
            // 判断是哪一个 options 并返回
            changeAOption() {
                if (this.form.ruralType != null && this.form.ruralType !== '') {
                    if (this.form.ruralType === this.level.city) { // 市级
                        this.ruralOptions = this.cityOptions;
                    } else if (this.form.ruralType === this.level.county) { // 县区
                        this.ruralOptions = this.countyOptions;
                    } else if (this.form.ruralType === this.level.town) { // 乡镇
                        this.ruralOptions = this.townOptions;
                    } else { // 村级
                        this.ruralOptions = this.villageOptions;
                    }
                } else {
                    this.ruralOptions = null;
                }
                this.currentValue = null; // 清空选择器值
                this.form.ruralId = null; // 清空当前选中的地区
                this.form.isAllTown = null;
                this.form.isAllVillage = null;
            },
            // 考评时间改变事件
            changeDate() {
            },
            // 取消按钮 新增修改
            cancel() {
                // this.form.menuIds = this.getMenuAllCheckedKeys();

                this.open = false;
                this.detailOpen = false;
                this.resultOpen = false;
                this.save = false;
                this.showSave = false;
                this.showScore = false;
                this.reset();
            },
            // 显示选择的考评人
            changeExaminerName(id) {
                for (let i = 0; i < this.examinerList.length; i++) {
                    if (id === this.examinerList[i].id) {
                        this.examinerName = this.examinerList[i].name;
                        return;
                    }
                }
            },
            // 判断options给新增编辑
            changeOptions() {
                if (this.form.type === 0) { // 考评员村级考评
                    this.ruralOptions = this.villageOptions;
                } else if (this.form.type === 1) {
                    this.ruralOptions = this.townOptions;
                }
            },

            // ---------------------------------- 选择考评人 ---------------------------------
            // 考评人 多选框选中数据
            examinerHandleSelectionChange(selection) {
                if (selection.length > 1) this.msgError("只能指派一个考评人");
                this.examinerIds = selection.map(item => item.id);
            },
            /** 考评人 搜索按钮操作 */
            examinerHandleQuery() {
                this.examinerQueryParams.pageNum = 1;
                this.getExaminerList();
            },
            /** 考评人 重置按钮操作 */
            examinerResetQuery() {
                this.resetForm("examinerQueryForm");
                this.examinerHandleQuery();
            },
            // 选择考评人按钮
            examinerHandle() {
                this.examinerOpen = true;
                //this.resetForm("queryForm");
            },
            // 确认考评人
            examinerSubmitForm() {
                if (this.examinerIds.length > 1) {
                    this.msgError("只能指派一个考评人");
                    return;
                }
                this.form.examinerId = this.examinerIds[0];
                if (this.form.examinerId != null) {
                    this.changeExaminerName(this.form.examinerId);
                }
                this.examinerOpen = false;
                this.examinerResetQuery();
            },
            // 取消按钮 考评人
            examinerCancel() {
                this.examinerOpen = false;
            },

            // ---------------------------------- 打分结果 -----------------------------------
            // 关闭打分结果窗口
            scoreFormCancel() {
                this.scoreEditOpen = false;
                this.scoreSaveEditOpen = false;
                this.resetEditScore();
                this.resetSaveEditScore();
            },
            // 打分结果 表单重置
            resetEditScore() {
                this.scoreEditForm = {
                    id: undefined,
                    createBy: undefined,
                    createTime: undefined,
                    updateBy: undefined,
                    updateTime: undefined,
                    delFlag: undefined,
                    image: undefined,
                    quarterlyReviewId: undefined,
                    itemId: undefined,
                    score: undefined,
                    itemTitle: undefined,
                    guid: undefined
                };
                this.resetForm("scoreEditForm");
            },
            resetSaveEditScore() {
                this.scoreSaveEditForm = {
                    content: undefined,
                    groupId: undefined,
                    guid: undefined,
                    image: undefined,
                    itemId: undefined,
                    itemTitle: undefined,
                    image: undefined,
                    operand: undefined,
                    score: undefined
                };
                this.resetForm("scoreSaveEditForm");
            },


            // 打开考评结果框
            handleScoreResult(row) {
                this.resultOpen = true;
                this.showScore = false;
                this.showSave = false;
                this.resultScoreTotal = 0;
                this.resultScoreSaveTotal = 0;
                this.title = "评分结果";
                this.quarterlyReviewId = row.id;
                if (row.state == "finish") {
                    this.getResultScoreList(row.state)
                } else if (row.state == "publish") {
                    this.getResultScoreSaveList(row.state);
                }

            },

            /** 打分结果 修改按钮操作 */
            handleUpdateScore(row) {
                this.resetEditScore();
                console.log(row)

                const id = row.id || this.ids;
                getQuarterlyReviewScore(id).then(response => {
                    this.scoreEditForm = response.data;

                    this.scoreEditOpen = true;
                    this.title = "修改打分结果";

                    // 读取 图片数组 -> 图片对象数组
                    if (this.scoreEditForm.image == null || this.scoreEditForm.image === '[]' || this.scoreEditForm.image === '') return;
                    for (let j = 0; j < JSON.parse(this.scoreEditForm.image).length; j++) {
                        this.picList.push({
                            'url': JSON.parse(this.scoreEditForm.image)[j]
                        });
                        this.hideImageUploadEdit = this.picList.length >= this.limit;
                    }
                });

            },

            handleUpdateScoreSave(row) {
                this.resetSaveEditScore();
                let guid = row.guid;
                getQuarterlyReviewScoreSave(guid).then(response => {
                    this.scoreSaveEditForm = response.data;
                    this.scoreSaveEditOpen = true;
                    this.title = "修改打分结果";
                    // 读取 图片数组 -> 图片对象数组
                    if (this.scoreSaveEditForm.image == null || this.scoreSaveEditForm.image === '[]' || this.scoreSaveEditForm.image === '') return;
                    for (let j = 0; j < JSON.parse(this.scoreSaveEditForm.image).length; j++) {
                        this.picList.push({
                            'url': JSON.parse(this.scoreSaveEditForm.image)[j]
                        });
                        this.hideImageUploadEdit = this.picList.length >= this.limit;
                    }
                });

            },


            /** 打分结果 提交按钮 */
            submitScoreForm: function () {
                this.$refs["scoreEditForm"].validate(valid => {
                    if (valid) {
                        if (this.scoreEditForm.id != undefined) {

                            // 提交时保存为 json 格式
                            var images = [];
                            for (let i = 0; i < this.picList.length; i++) {
                                images.push(this.picList[i].url)
                            }
                            this.scoreEditForm.image = JSON.stringify(images);

                            updateQuarterlyReviewScore(this.scoreEditForm).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess("修改成功");
                                    this.scoreEditOpen = false;
                                    this.getResultScoreList();
                                    this.getList();
                                }
                            });
                        } /*else {

            // 提交时保存为 json 格式
            /!*var images = [];
            for (let i = 0; i <this.picList.length ; i++) {
              images.push(this.picList[i].url)
            }
            this.form.image =JSON.stringify(images);*!/

            addQuarterlyReview(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("发布成功");
                this.open = false;
                this.getExaminerList();
                this.getList();
              }
            });
          }*/
                    }
                });
            },
            submitScoreSaveForm: function () {
                this.$refs["scoreSaveEditForm"].validate(valid => {
                    if (valid) {
                        if (this.scoreSaveEditForm.guid != undefined) {
                            // 提交时保存为 json 格式
                            var images = [];
                            for (let i = 0; i < this.picList.length; i++) {
                                images.push(this.picList[i].url)
                            }
                            this.scoreSaveEditForm.image = JSON.stringify(images);
                            console.log(this.scoreSaveEditForm);

                            updateQuarterlyReviewScoreSave(this.scoreSaveEditForm).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess("修改成功");
                                    this.scoreSaveEditOpen = false;
                                    this.getResultScoreSaveList();
                                    this.getList();
                                }
                            });
                        }
                    }
                });
            },
            // -----------------------------------------------------------------------

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
                    userId: undefined,
                    title: undefined,
                    image: undefined,
                    ruralId: undefined,
                    content: undefined,
                    reviewTime: undefined,
                    examinerId: undefined,
                    originExaminerId: undefined,
                    score: undefined,
                    view: undefined,
                    state: undefined,
                    isAllVillage: undefined, // 是否对选中的乡镇下 所有的村 发布考评
                    isAllTown: undefined, // 是否对选中的县区下 所有的乡镇 发布考评
                    ruralType: undefined, // 地区类型
                    type: undefined, // 考评类型
                    menuIds: undefined
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
                console.log(this.ids);
            },
            /** 新增按钮操作 */
            handleAdd() {
                this.reset();
                this.open = true;
                this.title = "发布季度考评";
                // this.form.type = 1;
                this.changeOptions();
                this.getExaminerList();
                this.getMenuTreeselect();
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset();
                const id = row.id || this.ids;
                getQuarterlyReview(id).then(response => {
                    this.form = response.data;
                    this.open = true;
                    this.title = "修改季度考评";

                    // 读取 图片数组 -> 图片对象数组
                    /*if (this.form.image==null || this.form.image==='[]' || this.form.image==='') return;
                    for (let j = 0; j <JSON.parse(this.form.image).length ; j++) {
                      this.picList.push({
                        'url':JSON.parse(this.form.image)[j]
                      });
                      this.hideImageUploadEdit = this.picList.length >= this.limit;
                    }*/
                    this.getExaminerList(); // 获取考评员列表
                    // this.changeAOption(); // 获取选择器
                    this.changeOptions();
                    if (this.form.examinerId != null) {
                        this.changeExaminerName(this.form.examinerId);
                    }
                    this.reviewType = this.form.type; // 回显考评类型
                    this.currentValue = this.form.currentValue;
                });
            },

            // 评分按钮
            /*handleScore(row){
              const id = row.id;
              getQuarterlyReview(id).then(response => {
                this.form = response.data;
                console.log("--->");
                console.log(this.form);

                console.log(this.form.params)
                /!*if (this.form.image!=null){
                  this.detailImgs=JSON.parse(this.form.image);
                }*!/
                this.setScoreOpen = true;
              });
            },*/
            // 确认打分
            /*scoreSubmitForm(){
              if (this.form.score==null){
                this.msgError("请填写分数");
                return;
              }
              if (!(this.form.score>=0 && this.form.score<=100)){
                this.msgError("请正确填写分数");
                return;
              }
              setScore(this.form.id,this.form.score).then(response => {
                if (response.code === 200){
                  this.setScoreOpen=false;
                  this.getList();
                  this.msgSuccess("打分成功");
                }
              });
            },*/
            // 取消打分
            /*scoreCancel(){
              this.setScoreOpen=false;
            },*/

            /** 提交按钮 */
            submitForm: function () {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        if (this.form.id != undefined) {
                            updateQuarterlyReview(this.form).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess("修改成功");
                                    this.open = false;
                                    this.getExaminerList();
                                    this.getList();
                                }
                            });
                        } else {
                            this.form.menuIds = this.getMenuAllCheckedKeys();
                            this.form.type = this.reviewType;
                            // console.log(this.form);
                            addQuarterlyReview(this.form).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess("发布成功" + response.data + "条数据");
                                    this.open = false;
                                    this.getExaminerList();
                                    this.getList();
                                }
                            });
                        }
                    }
                });
            },
            /** 指标项保存至正式表，并更新总表数据 */
            saveQuarterlyReview() {
                if (this.quarterlyReviewId > 0) {
                    SaveQuarterlyReview(this.quarterlyReviewId).then(response => {
                        if (response.code === 200) {
                            this.getList();
                            this.msgSuccess("提交成功");
                            this.cancel();

                        }
                    });
                }

            },
            /** 删除按钮操作 */
            handleDelete(row) {
                const ids = row.id || this.ids;
                this.$confirm('是否确认删除季度考评标题为 "' + row.title + '" 的数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function () {
                    return delQuarterlyReview(ids);
                }).then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                }).catch(function () {
                });
            },

            // 改变任务 ------------------------------ 导出 --------------------------
            changeGroup(value) {
                var task = ""; // 当前选中的考评项的名称
                for (let i = 0; i < this.taskList.length; i++) {
                    if (this.taskList[i].id === value) {
                        task = this.taskList[i].title;
                        break;
                    }
                }
                this.exportType = [];
                this.exportType.push({
                        label: "考评员考评导出",
                        value: "1"
                    },
                    {
                        label: "打分细则导出",
                        value: "3"
                    },
                );
                // console.log(task);
                /*var reg1 = RegExp(/示范带/); // 规则
                var reg2 = RegExp(/试点村/);
                if (reg1.test(task)){ // 如果名称包含 '师范带'
                  this.exportType = [];
                  this.exportType.push({
                    label: "考评员考评导出",
                    value: "1"
                  });
                  this.exportQueryParams.groupName = task;
                }else if (reg2.test(task)){ // 如果名称包含 '试点村'
                  this.exportType = [];
                  this.exportType.push({
                      label: "考评员考评导出",
                      value: "1"
                    },
                    {
                      label: "打分细则导出",
                      value: "3"
                    },
                  );
                  this.exportQueryParams.groupName = task;
                }*/
                if (!value) {
                    this.exportQueryParams.groupName = null;
                    this.exportType = [];
                }
                this.exportQueryParams.type = null; // ?
            },
            /** 导出按钮操作 路由 */
            handleExport() {
                if (this.exportQueryParams.groupId == null) {
                    this.msgError("请选择要导出的任务");
                    return;
                }
                if (this.exportQueryParams.type == null) {
                    this.msgError("请选择要导出的种类");
                    return;
                }
                // console.log('选择的导出种类-> ' + this.exportQueryParams.type);
                if (this.exportQueryParams.type === '1')
                // this.handleExportCounty();
                    this.handleExportExaminer();
                /*else if (this.exportQueryParams.type === '2')
                  this.handleExportVillage();*/
                else if (this.exportQueryParams.type === '3')
                    this.handleExportDetailScore();
            },

            /** 导出按钮操作 导出考评员考评记录 */
            handleExportExaminer() {
                this.$confirm('是否确认导出考评员考评数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    return exportReviewExaminer(this.exportQueryParams);
                }).then(response => {
                    this.download(response.msg);
                }).catch(function () {
                });
            },

            /** 导出按钮操作 导出示范带 */
            /*handleExportCounty() {
              this.$confirm('是否确认导出季度考评示范带数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }).then(() => {
                return exportReviewCounty(this.exportQueryParams);
              }).then(response => {
                this.download(response.msg);
              }).catch(function() {});
            },*/
            /** 导出按钮操作 导出试点村 */
            /*handleExportVillage(){
              this.$confirm('是否确认导出季度考评试点村数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }).then(() => {
                return exportReviewVillage(this.exportQueryParams);
              }).then(response => {
                this.download(response.msg);
              }).catch(function() {});
            },*/
            /** 导出统计打分细则 */
            handleExportDetailScore() {
                const queryParams = this.exportQueryParams;
                this.$confirm('是否确认导出季度考评打分细则数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    // console.log("考评统计");
                    // console.log(this.exportQueryParams);
                    return exportDetailScore(queryParams);
                }).then(response => {
                    this.download(response.msg);
                }).catch(function () {
                });
            }, // --------------------------------------------

            // 时间格式化
            dateFormatter: function (row, column, cellValue, index) {
                if (cellValue == null || cellValue === '') return "-";
                let fs = cellValue.split(':');
                return fs[0] + ':' + fs[1];
            },
            // 格式化乡村名称
            formatVillageName(rural) {
                if (rural == null) return '-';
                let result = '';
                if (rural.countyName != null) {
                    result += rural.countyName;
                }
                if (rural.townName != null) {
                    result += rural.townName;
                }
                if (rural.villageName != null) {
                    result += rural.villageName;
                }
                return result;
            },
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

  p {
    margin: 10px;
  }

  .ql-container {
    height: 300px;
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: "14px";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
    content: "10px";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
    content: "18px";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
    content: "32px";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: "文本";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: "标题1";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: "标题2";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: "标题3";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: "标题4";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: "标题5";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: "标题6";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: "标准字体";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
    content: "衬线字体";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
    content: "等宽字体";
  }


</style>
