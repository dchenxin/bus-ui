<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

      <el-form-item label="姓名" prop="secretaryName">
        <el-input
          v-model="queryParams.secretaryName"
          placeholder="请输入村支书姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--
      <el-form-item label="村主任姓名" prop="leaderName">
          <el-input
            v-model="queryParams.leaderName"
            placeholder="请输入村主任姓名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
      <el-form-item label="乡村图片" prop="imageAddress">
          <el-input
            v-model="queryParams.imageAddress"
            placeholder="请输入乡村图片"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="乡村视频" prop="videoAddress">
          <el-input
            v-model="queryParams.videoAddress"
            placeholder="请输入乡村视频"
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
        <el-form-item label="发布人id" prop="userId">
          <el-input
            v-model="queryParams.userId"
            placeholder="请输入发布人id"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
      <el-form-item label="上任日期" prop="tenureTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="queryParams.tenureTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择上任日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="荣誉" prop="honor">
          <el-input
            v-model="queryParams.honor"
            placeholder="请输入荣誉"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="村庄类型" prop="villageType">
          <el-select v-model="queryParams.villageType" placeholder="请选择村庄类型" clearable size="small">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否位于政府驻地(0否 1是)" prop="isGovernmentRegion">
          <el-input
            v-model="queryParams.isGovernmentRegion"
            placeholder="请输入是否位于政府驻地(0否 1是)"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="村集体自主经营性收入" prop="collectiveIncome">
          <el-input
            v-model="queryParams.collectiveIncome"
            placeholder="请输入村集体自主经营性收入"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="农村居民人均可支配收入" prop="averageIncome">
          <el-input
            v-model="queryParams.averageIncome"
            placeholder="请输入农村居民人均可支配收入"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="户籍户数" prop="householdsCount">
          <el-input
            v-model="queryParams.householdsCount"
            placeholder="请输入户籍户数"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="户籍人口数" prop="inhabitantCount">
          <el-input
            v-model="queryParams.inhabitantCount"
            placeholder="请输入户籍人口数"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="常住人口数" prop="alwaysLiveCount">
          <el-input
            v-model="queryParams.alwaysLiveCount"
            placeholder="请输入常住人口数"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="16—60岁常住人口" prop="smallSixtyCount">
          <el-input
            v-model="queryParams.smallSixtyCount"
            placeholder="请输入16—60岁常住人口"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="60岁以上常住人口" prop="largeSixtyCount">
          <el-input
            v-model="queryParams.largeSixtyCount"
            placeholder="请输入60岁以上常住人口"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="地形地貌" prop="terrainLandforms">
          <el-input
            v-model="queryParams.terrainLandforms"
            placeholder="请输入地形地貌"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="村域面积" prop="space">
          <el-input
            v-model="queryParams.space"
            placeholder="请输入村域
  面积"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="耕地面积" prop="landSpace">
          <el-input
            v-model="queryParams.landSpace"
            placeholder="请输入耕地面积"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="林地面积" prop="forestSpace">
          <el-input
            v-model="queryParams.forestSpace"
            placeholder="请输入林地面积"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="山垅田面积" prop="mountainSpace">
          <el-input
            v-model="queryParams.mountainSpace"
            placeholder="请输入山垅田面积"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="村庄建设用地面积" prop="availableSpace">
          <el-input
            v-model="queryParams.availableSpace"
            placeholder="请输入村庄建设用地面积"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="自然村数量" prop="naturalCount">
          <el-input
            v-model="queryParams.naturalCount"
            placeholder="请输入自然村数量"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="农村住房总户数" prop="housingCount">
          <el-input
            v-model="queryParams.housingCount"
            placeholder="请输入农村住房总户数"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="常年无人居住住房户数" prop="noHousingCount">
          <el-input
            v-model="queryParams.noHousingCount"
            placeholder="请输入常年无人居住住房户数"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="省级以上农民专业合作示范社数量" prop="cooperationCount">
          <el-input
            v-model="queryParams.cooperationCount"
            placeholder="请输入省级以上农民专业合作示范社数量"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="省级以上家庭农场数量" prop="farmCount">
          <el-input
            v-model="queryParams.farmCount"
            placeholder="请输入省级以上家庭农场数量"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="集中供水率(%)" prop="waterRate">
          <el-input
            v-model="queryParams.waterRate"
            placeholder="请输入集中供水率(%)"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="垃圾收集处理率(%)" prop="garbageRate">
          <el-input
            v-model="queryParams.garbageRate"
            placeholder="请输入垃圾收集处理率(%)"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="污水处理率(%)" prop="badWaterRate">
          <el-input
            v-model="queryParams.badWaterRate"
            placeholder="请输入污水处理率(%)"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="通自然村道路硬化数" prop="roadHardenCount">
          <el-input
            v-model="queryParams.roadHardenCount"
            placeholder="请输入通自然村道路硬化数"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="通光纤宽带自然村数" prop="bandwidthCount">
          <el-input
            v-model="queryParams.bandwidthCount"
            placeholder="请输入通光纤宽带自然村数"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="年垃圾处理费" prop="handleGarbage">
          <el-input
            v-model="queryParams.handleGarbage"
            placeholder="请输入年垃圾处理费"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="公共垃圾收集桶" prop="garbageBarrel">
          <el-input
            v-model="queryParams.garbageBarrel"
            placeholder="请输入公共垃圾收集桶"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="公共路灯" prop="publicLamp">
          <el-input
            v-model="queryParams.publicLamp"
            placeholder="请输入公共路灯"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="公共厕所(个)" prop="publicToilet">
          <el-input
            v-model="queryParams.publicToilet"
            placeholder="请输入公共厕所(个)"
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
          v-if="checkRole(['cityAdmin'])||checkRole(['countyAdmin'])||checkRole(['villageAdmin'])||checkRole(['admin'])"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['module:villageDetail:add']"
        >发布
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
        >导入
        </el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['module:villageDetail:edit']"
        >修改
        </el-button>
      </el-col>-->
      <!-- <el-col :span="1.5">
         <el-button
           type="danger"
           icon="el-icon-delete"
           size="mini"
           :disabled="multiple"
           @click="handleDelete"
           v-hasPermi="['module:villageDetail:remove']"
         >删除
         </el-button>
       </el-col>-->
      <!--  <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['module:villageDetail:export']"
          >导出
          </el-button>
        </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="villageDetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column fixed type="index" label="#">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed label="所在乡村" align="center" prop="detailVillage" width="150px">
        <template slot-scope="scope">
          <span>{{formatVillageName(scope.row.rural)}}</span>
          <!--<span v-if="scope.row.detailVillage==null && scope.row.detailVillage===''">-</span>
          <span v-else>{{scope.row.detailVillage}}</span>-->
        </template>
      </el-table-column>
      <el-table-column fixed label="村支书姓名" width="100px" align="center" prop="secretaryName">
        <template slot-scope="scope">
          <span v-if="scope.row.secretaryName===null">-</span>
          <span v-else>{{scope.row.secretaryName}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="村主任姓名" align="center" prop="leaderName">
         <template slot-scope="scope">
           <span v-if="scope.row.leaderName===null">-</span>
           <span v-else>{{scope.row.leaderName}}</span>
         </template>
       </el-table-column>-->
      <el-table-column fixed width="150" label="乡村图片" align="center" prop="imageAddress">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.imageAddress!=null && scope.row.imageAddress!=='[]' && scope.row.imageAddress!==''"
            style="width: 150px; height: 80px; padding: 0 20px; display: inline-block; justify-content:center; align-items:center"
            :src="firstImg(scope.row)"
            fit="cover"
            />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column fixed width="150" label="乡村视频" align="center" prop="videoAddress">
        <template slot-scope="scope">
          <video
            v-if="scope.row.videoAddress!=null && scope.row.videoAddress!=='[]' && scope.row.videoAddress!==''"
            style="width: 150px; height: 80px; padding: 0 20px; display: inline-block; justify-content:center; align-items:center"
            controls="controls"
            :src="firstVideo(scope.row)"
            fit="cover"
            preload="auto"
            :preview-src-list="firstVideoArray(scope.row)"
          >
          </video>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column fixed width="150" label="任职年限" align="center" prop="year">
        <!--<template slot-scope="scope">
          <span>{{ parseTime(scope.row.tenureTime, '{y}-{m}-{d}') }}</span>
        </template>-->
      </el-table-column>
      <el-table-column label="基本情况">
        <el-table-column label="荣誉" align="center" prop="honor" show-overflow-tooltip/>
        <el-table-column label="村庄类型" align="center" prop="villageType"/>
        <el-table-column label="是否位于政府驻地" align="center" prop="isGovernmentRegion">
          <template slot-scope="scope">
            <span>{{ format(scope.row.isGovernmentRegion) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="村集体自主经营性收入" align="center" prop="collectiveIncome">
          <!--<template slot-scope="scope">
            <span>{{ scope.row.collectiveIncome }}元</span>
          </template>-->
        </el-table-column>
        <el-table-column label="农村居民人均可支配收入" align="center" prop="averageIncome"/>
        <el-table-column label="户籍户数" align="center" prop="householdsCount"/>
        <el-table-column label="户籍人口数" align="center" prop="inhabitantCount"/>
        <el-table-column label="常住人口数" align="center" prop="alwaysLiveCount"/>
        <el-table-column label="16—60岁常住人口" align="center" prop="smallSixtyCount"/>
        <el-table-column label="60岁以上常住人口" align="center" prop="largeSixtyCount"/>
        <el-table-column label="地形地貌" align="center" prop="terrainLandforms"/>
        <el-table-column label="村域面积" align="center" prop="space"/>
        <el-table-column label="耕地面积" align="center" prop="landSpace"/>
        <el-table-column label="林地面积" align="center" prop="forestSpace"/>
        <el-table-column label="山垅田面积" align="center" prop="mountainSpace"/>
        <el-table-column label="村庄建设用地面积" align="center" prop="availableSpace"/>
        <el-table-column label="自然村数量" align="center" prop="naturalCount"/>
        <el-table-column label="农村住房总户数" align="center" prop="housingCount"/>
        <el-table-column label="常年无人居住住房户数" align="center" prop="noHousingCount"/>
        <el-table-column label="省级以上农民专业合作示范社数量" align="center" prop="cooperationCount"/>
        <el-table-column label="省级以上家庭农场数量" align="center" prop="farmCount"/>
        <el-table-column label="基本设施">
          <el-table-column label="集中供水率(%)" align="center" prop="waterRate"/>
          <el-table-column label="垃圾收集处理率(%)" align="center" prop="garbageRate"/>
          <el-table-column label="污水处理率(%)" align="center" prop="badWaterRate"/>
          <el-table-column label="通自然村道路硬化数" align="center" prop="roadHardenCount"/>
          <el-table-column label="通光纤宽带自然村数" align="center" prop="bandwidthCount"/>
        </el-table-column>
        <el-table-column label="公共环境">
          <el-table-column label="年垃圾处理费(元)" align="center" prop="handleGarbage"/>
          <el-table-column label="公共垃圾收集桶(个)" align="center" prop="garbageBarrel"/>
          <el-table-column label="公共路灯(个)" align="center" prop="publicLamp"/>
          <el-table-column label="公共厕所(个)" align="center" prop="publicToilet"/>
        </el-table-column>
      </el-table-column>

      <!--<el-table-column label="荣誉" align="center" prop="honor"/>
      <el-table-column label="村庄类型" align="center" prop="villageType"/>
      <el-table-column label="是否位于政府驻地" align="center" prop="isGovernmentRegion"/>
      <el-table-column label="村集体自主经营性收入" align="center" prop="collectiveIncome"/>
      <el-table-column label="农村居民人均可支配收入" align="center" prop="averageIncome"/>
      <el-table-column label="户籍户数" align="center" prop="householdsCount"/>
      <el-table-column label="户籍人口数" align="center" prop="inhabitantCount"/>
      <el-table-column label="常住人口数" align="center" prop="alwaysLiveCount"/>
      <el-table-column label="16—60岁常住人口" align="center" prop="smallSixtyCount"/>
      <el-table-column label="60岁以上常住人口" align="center" prop="largeSixtyCount"/>
      <el-table-column label="地形地貌" align="center" prop="terrainLandforms"/>
      <el-table-column label="村域面积" align="center" prop="space"/>
      <el-table-column label="耕地面积" align="center" prop="landSpace"/>
      <el-table-column label="林地面积" align="center" prop="forestSpace"/>
      <el-table-column label="山垅田面积" align="center" prop="mountainSpace"/>
      <el-table-column label="村庄建设用地面积" align="center" prop="availableSpace"/>
      <el-table-column label="自然村数量" align="center" prop="naturalCount"/>
      <el-table-column label="农村住房总户数" align="center" prop="housingCount"/>
      <el-table-column label="常年无人居住住房户数" align="center" prop="noHousingCount"/>
      <el-table-column label="省级以上农民专业合作示范社数量" align="center" prop="cooperationCount"/>
      <el-table-column label="省级以上家庭农场数量" align="center" prop="farmCount"/>
      <el-table-column label="集中供水率(%)" align="center" prop="waterRate"/>
      <el-table-column label="垃圾收集处理率(%)" align="center" prop="garbageRate"/>
      <el-table-column label="污水处理率(%)" align="center" prop="badWaterRate"/>
      <el-table-column label="通自然村道路硬化数" align="center" prop="roadHardenCount"/>
      <el-table-column label="通光纤宽带自然村数" align="center" prop="bandwidthCount"/>
      <el-table-column label="年垃圾处理费" align="center" prop="handleGarbage"/>
      <el-table-column label="公共垃圾收集桶" align="center" prop="garbageBarrel"/>
      <el-table-column label="公共路灯" align="center" prop="publicLamp"/>
      <el-table-column label="公共厕所(个)" align="center" prop="publicToilet"/>-->
      <el-table-column fixed="right" label="操作" width="150px" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-tickets" size="mini"
           @click="catchDetail(scope.row)"
          >详情</el-button>
          <el-button
            v-if="checkRole(['villageAdmin'])||checkRole(['cityAdmin'])||checkRole(['countyAdmin'])||checkRole(['admin'])"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module:villageDetail:edit']"
          >修改
          </el-button>
          <el-button
            v-if="checkRole(['cityAdmin'])||checkRole(['admin'])"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:villageDetail:remove']"
          >删除
          </el-button>
          <el-button
            v-if="getLoginUser(scope.row)&&checkRole(['countyAdmin'])"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module:villageDetail:remove']"
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

    <!-- 添加或修改村档信息档案对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-collapse v-model="activeName">
          <el-collapse-item name="1">
            <template slot="title">
              乡村信息<i class="header-icon el-icon-info" style="color: #409EFF; padding-left: 3px;" />
            </template>
            <div style="display: inline-block; margin-left: 50px">

              <el-form-item label="所在乡村" label-width="97px" prop="ruralId">
                <el-cascader :options="ruralOptions" v-model="currentValue" :show-all-levels="false"/>
              </el-form-item>
              <el-form-item label="乡村图片" label-width="97px" prop="imageAddress">
                <!--                <el-input v-model="form.imageAddress" placeholder="请输入乡村图片"  style="width: 300px"/>-->
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
              <el-form-item label="乡村视频" label-width="97px" prop="videoAddress">
                <!--                <el-input v-model="form.videoAddress" placeholder="请输入乡村视频"  style="width: 300px"/>-->
                <el-upload
                  :action="uploadVideoUrl"
                  list-type="picture"
                  accept=".mp4"
                  :limit="videoLimit"
                  :class="{hide: hideVideoUploadEdit}"
                  :on-change="handleEditVideoChange"
                  :on-success="handleVideoSuccess"
                  :before-upload="beforeUploadVideo"
                  :on-progress="uploadVideoProcess"
                  :on-remove="handleVideoRemove"
                  :file-list="videoList"
                >
                  <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">大小不能超过200MB，限传一个视频</div>
                </el-upload>
              </el-form-item>

            </div>

            <div style="display: inline-block;float:right;margin-right: 50px">
              <el-form-item label="村支书" label-width="97px" prop="secretaryName">
                <el-input v-model="form.secretaryName" placeholder="请输入村支书姓名" style="width: 300px;"/>
              </el-form-item>
              <!--  <el-form-item label="村主任" label-width="97px" prop="leaderName">
                  <el-input v-model="form.leaderName" placeholder="请输入村主任姓名" style="width: 300px;"/>
                </el-form-item>-->
              <el-form-item label="上任日期" label-width="97px" prop="tenureTime">
                <el-date-picker clearable size="small" style="width: 300px"
                                v-model="form.tenureTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择上任日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="乡村荣誉" label-width="97px" prop="honor">
                <el-input v-model="form.honor"
                          placeholder="请输入乡村荣誉"
                          type="textarea"
                          :autosize="{ minRows: 4, maxRows: 4}"
                          maxlength="30"
                          show-word-limit
                          style="width: 300px"/>
              </el-form-item>
            </div>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              收入面积<i class="header-icon el-icon-info" style="color: #409EFF; padding-left: 3px;" />
            </template>
            <div style="display: inline-block; margin-left: 50px">
              <el-form-item label="村庄类型" label-width="130px">
                <el-input v-model="form.villageType" placeholder="请输入村庄类型" style="width: 300px;"/>
              </el-form-item>
              <el-form-item label="村集体自主经营性收入" label-width="130px" prop="collectiveIncome">
                <el-input v-model="form.collectiveIncome" placeholder="村集体自主经营性收入"
                          style="width: 300px;margin-top: 16px"/>
                元
              </el-form-item>
              <el-form-item label="农村居民人均可支配收入" label-width="130px" prop="averageIncome">
                <el-input v-model="form.averageIncome" placeholder="农村居民人均可支配收入" style="width: 300px;margin-top: 16px"/>
                元
              </el-form-item>
              <el-form-item label="地形地貌" label-width="130px" prop="terrainLandforms">
                <el-input v-model="form.terrainLandforms" placeholder="请输入地形地貌" style="width: 300px"/>
              </el-form-item>
              <el-form-item label="是否位于政府驻地" prop="isGovernmentRegion" label-width="130px">
                <el-radio-group v-model="form.isGovernmentRegion">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>

            <div style="display: inline-block; float:right; margin-right: 50px">
              <el-form-item label="村域面积" label-width="150px" prop="space">
                <el-input v-model="form.space" placeholder="请输入村域面积" style="width: 300px"/>
                KM²
              </el-form-item>
              <el-form-item label="耕地面积" label-width="150px" prop="landSpace">
                <el-input v-model="form.landSpace" placeholder="请输入耕地面积" style="width: 300px"/>
                亩
              </el-form-item>
              <el-form-item label="林地面积" label-width="150px" prop="forestSpace">
                <el-input v-model="form.forestSpace" placeholder="请输入林地面积" style="width: 300px"/>
                亩
              </el-form-item>
              <el-form-item label="山垅田面积" label-width="150px" prop="mountainSpace">
                <el-input v-model="form.mountainSpace" placeholder="请输入山垅田面积" style="width: 300px"/>
                亩
              </el-form-item>
              <el-form-item label="村庄建设用地面积" label-width="150px" prop="availableSpace">
                <el-input v-model="form.availableSpace" placeholder="请输入村庄建设用地面积" style="width: 300px"/>
                亩
              </el-form-item>
            </div>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title">
              人口住房<i class="header-icon el-icon-info" style="color: #409EFF; padding-left: 3px;" />
            </template>
            <div style="display: inline-block; margin-left: 50px">
              <el-form-item label="户籍户数" label-width="150px" prop="householdsCount">
                <el-input v-model="form.householdsCount" placeholder="请输入户籍户数" style="width: 300px;"/>
                个
              </el-form-item>
              <el-form-item label="户籍人口数" label-width="150px" prop="inhabitantCount">
                <el-input v-model="form.inhabitantCount" placeholder="请输入户籍人口数" style="width: 300px"/>
                个
              </el-form-item>
              <el-form-item label="常住人口数" label-width="150px" prop="alwaysLiveCount">
                <el-input v-model="form.alwaysLiveCount" placeholder="请输入常住人口数" style="width: 300px"/>
                个
              </el-form-item>
              <el-form-item label="16-60岁常住人口" label-width="150px" prop="smallSixtyCount">
                <el-input v-model="form.smallSixtyCount" placeholder="请输入16-60岁常住人口" style="width: 300px;"/>
                个
              </el-form-item>
              <el-form-item label="60岁以上常住人口" label-width="150px" prop="largeSixtyCount">
                <el-input v-model="form.largeSixtyCount" placeholder="请输入60岁以上常住人口" style="width: 300px;"/>
                个
              </el-form-item>
              <el-form-item label="常年无人居住住房户数" label-width="150px" prop="noHousingCount">
                <el-input v-model="form.noHousingCount" placeholder="请输入常年无人居住住房户数"
                          style="width: 300px;margin-top: 16px"/>
                个
              </el-form-item>
            </div>

            <div style="display: inline-block; float:right; margin-right: 50px">
              <el-form-item label="自然村数量" label-width="150px" prop="naturalCount">
                <el-input v-model="form.naturalCount" placeholder="请输入自然村数量" style="width: 300px"/>
                个
              </el-form-item>
              <el-form-item label="农村住房总户数" label-width="150px" prop="housingCount">
                <el-input v-model="form.housingCount" placeholder="请输入农村住房总户数" style="width: 300px"/>
                个
              </el-form-item>
              <el-form-item label="省级以上农民专业合作示范社数量" label-width="150px" prop="cooperationCount">
                <el-input v-model="form.cooperationCount" placeholder="请输入省级以上农民专业合作示范社数量"
                          style="width: 300px;margin-top: 16px"/>
                个
              </el-form-item>
              <el-form-item label="省级以上家庭农场数量" label-width="150px" prop="farmCount">
                <el-input v-model="form.farmCount" placeholder="请输入省级以上家庭农场数量" style="width: 300px;margin-top: 16px"/>
                个
              </el-form-item>
            </div>
          </el-collapse-item>
          <el-collapse-item name="4">
            <template slot="title">
              基础设施<i class="header-icon el-icon-info" style="color: #409EFF; padding-left: 3px;"></i>
            </template>
            <el-col :span="12">
              <el-form-item label="集中供水率" label-width="120px" prop="waterRate">
                <el-input v-model="form.waterRate" placeholder="集中供水率" style="width: 300px;"/>
                %
              </el-form-item>
              <el-form-item label="垃圾收集处理率" label-width="120px" prop="garbageRate">
                <el-input v-model="form.garbageRate" placeholder="垃圾收集处理率" style="width: 300px;"/>
                %
              </el-form-item>
              <el-form-item label="污水处理率" label-width="120px" prop="badWaterRate">
                <el-input v-model="form.badWaterRate" placeholder="污水处理率" style="width: 300px;"/>
                %
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="通自然村道路硬化数" label-width="97px" prop="roadHardenCount">
                <el-input v-model="form.roadHardenCount" placeholder="通自然村道路硬化数" style="width: 300px;margin-top: 16px"/>
                个
              </el-form-item>
              <el-form-item label="通光纤宽带自然村数" label-width="97px" prop="bandwidthCount">
                <el-input v-model="form.bandwidthCount" placeholder="通光纤宽带自然村数" style="width: 300px;margin-top: 16px"/>
                个
              </el-form-item>
            </el-col>
          </el-collapse-item>
          <el-collapse-item name="5">
            <template slot="title">
              公共环境<i class="header-icon el-icon-info" style="color: #409EFF; padding-left: 3px;"></i>
            </template>
            <el-col :span="12">
              <el-form-item label="年垃圾处理费" label-width="120px" prop="handleGarbage">
                <el-input v-model="form.handleGarbage" placeholder="年垃圾处理费" style="width: 132px;"/>
                元
              </el-form-item>
              <el-form-item label="公共垃圾收集桶" label-width="120px" prop="garbageBarrel">
                <el-input v-model="form.garbageBarrel" placeholder="公共垃圾收集桶" style="width: 132px;"/>
                个
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公共路灯" prop="publicLamp">
                <el-input v-model="form.publicLamp" placeholder="请输入公共路灯" style="width: 132px"/>
                盏
              </el-form-item>
              <el-form-item label="公共厕所" prop="publicToilet">
                <el-input v-model="form.publicToilet" placeholder="请输入公共厕所" style="width: 132px"/>
                个
              </el-form-item>
            </el-col>
          </el-collapse-item>
        </el-collapse>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--  查看详情 对话框-->
    <el-dialog :title="title" :visible.sync="openDetail" width="1000px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <div style="padding:10px;">
            <el-col :span="24">
              <el-card :body-style="{ padding: '10px' }" shadow="always" header="乡村信息">
                <el-form-item label="村支书" prop="secretaryName">
                  <span style="padding-left: 20px" v-if="form.secretaryName!=null && form.secretaryName !==''">{{form.secretaryName}}</span>
                  <span style="padding-left: 20px" v-else>暂无村支书</span>
                </el-form-item>
                <el-form-item label="上任日期" prop="tenureTime">
                  <span style="padding-left: 20px" v-if="form.tenureTime!=null && form.tenureTime !==''">{{form.tenureTime}}</span>
                  <span style="padding-left: 20px" v-else>暂无</span>
                </el-form-item>
                <el-form-item label="所在乡村" prop="detailVillage">
                  <!--<span style="padding-left: 20px" v-if="form.detailVillage!=null && form.detailVillage !==''">{{form.detailVillage}}</span>
                  <span style="padding-left: 20px" v-else>暂无乡村</span>-->
                  <span style="padding-left: 20px">{{formatVillageName(form.rural)}}</span>
                </el-form-item>
                <el-form-item label="所获荣誉" prop="honor">
                  <span style="padding-left: 20px" v-if="form.honor!=null && form.honor !==''">{{form.honor}}</span>
                  <span style="padding-left: 20px" v-else>暂无</span>
                </el-form-item>
              </el-card>
            </el-col>
          </div>

          <el-col :span="24">
            <div style="padding: 10px;margin-top: 10px;">
              <el-card :body-style="{ padding: '10px' }" shadow="always" header="人口住房">
                <div style="display: inline-block">
                  <el-form-item label="户籍户数" label-width="130px" prop="householdsCount">
                    <span style="padding-left: 20px" v-if="form.householdsCount!=null && form.householdsCount !==''">{{form.householdsCount}}</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                  <el-form-item label="户籍人口数" label-width="130px" prop="inhabitantCount">
                    <span style="padding-left: 20px" v-if="form.inhabitantCount!=null && form.inhabitantCount !==''">{{form.inhabitantCount}}</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                  <el-form-item label="常住人口数" label-width="130px" prop="alwaysLiveCount">
                    <span style="padding-left: 20px" v-if="form.alwaysLiveCount!=null && form.alwaysLiveCount !==''">{{form.alwaysLiveCount}}</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                  <el-form-item label="16-60岁常住人口" label-width="130px" prop="smallSixtyCount">
                    <span style="padding-left: 20px" v-if="form.smallSixtyCount!=null && form.smallSixtyCount !==''">{{form.smallSixtyCount}}</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                  <el-form-item label="60岁以上常住人口" label-width="130px" prop="largeSixtyCount">
                    <span style="padding-left: 20px" v-if="form.largeSixtyCount!=null && form.largeSixtyCount !==''">{{form.largeSixtyCount}}</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                </div>

                <div style="display: inline-block;float: right;margin-right: 265px">
                  <el-form-item label="自然村数量" label-width="160px" prop="naturalCount">
                    <span style="padding-left: 20px" v-if="form.naturalCount!=null && form.naturalCount !==''">{{form.naturalCount}}</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                  <el-form-item label="农村住房总户数" label-width="160px" prop="housingCount">
                    <span style="padding-left: 20px" v-if="form.housingCount!=null && form.housingCount !==''">{{form.housingCount}}</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                  <el-form-item label="常年无人居住住房户数" label-width="160px" prop="noHousingCount">
                <span style="padding-left: 20px"
                      v-if="form.noHousingCount!=null && form.noHousingCount !==''">{{form.noHousingCount}}</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                  <el-form-item label="省级以上农民专业合作示范社数量" label-width="160px" prop="cooperationCount">
                    <span style="padding-left: 20px" v-if="form.cooperationCount!=null && form.cooperationCount !==''">{{form.cooperationCount}}</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                  <el-form-item label="省级以上家庭农场数量" label-width="160px" prop="farmCount">
                    <span style="padding-left: 20px" v-if="form.farmCount!=null && form.farmCount !==''">{{form.farmCount}}</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                </div>
              </el-card>
            </div>
          </el-col>

          <el-col :span="24">
            <div style="padding: 10px;margin-top: 10px;">
              <el-card :body-style="{ padding: '10px' }" shadow="always" header="面积收入">
                <div style="display: inline-block">
                  <el-form-item label="村庄类型" label-width="130px" prop="villageType">
                    <span style="padding-left: 20px" v-if="form.villageType!=null && form.villageType !==''">{{form.villageType}}</span>
                    <span style="padding-left: 20px" v-else>暂无村庄类型</span>
                  </el-form-item>
                  <el-form-item label="是否位于政府驻地" label-width="130px" prop="isGovernmentRegion">
                    <span style="padding-left: 20px"
                          v-if="form.isGovernmentRegion!=null && form.isGovernmentRegion !==''">{{format(form.isGovernmentRegion)}}</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                  <el-form-item label="村集体自主经营性收入" label-width="130px" prop="collectiveIncome">
                    <span style="padding-left: 20px" v-if="form.collectiveIncome!=null && form.collectiveIncome !==''">{{form.collectiveIncome}}  元</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                  <el-form-item label="农村居民人均可支配收入" label-width="130px" prop="averageIncome">
                    <span style="padding-left: 20px" v-if="form.averageIncome!=null && form.averageIncome !==''">{{form.averageIncome}}  元</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                  <el-form-item label="地形地貌" label-width="130px" prop="terrainLandforms">
                    <span style="padding-left: 20px" v-if="form.terrainLandforms!=null && form.terrainLandforms !==''">{{form.terrainLandforms}}</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                </div>
                <div style="display: inline-block;float: right;margin-right: 265px">
                  <el-form-item label="村域面积" prop="space">
                    <span style="padding-left: 20px"
                          v-if="form.space!=null && form.space !==''">{{form.space}} KM²</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                  <el-form-item label="耕地面积" prop="landSpace">
                <span style="padding-left: 20px"
                      v-if="form.landSpace!=null && form.landSpace !==''">{{form.landSpace}}  亩</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                  <el-form-item label="林地面积" prop="forestSpace">
                    <span style="padding-left: 20px" v-if="form.forestSpace!=null && form.forestSpace !==''">{{form.forestSpace}}  亩</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                  <el-form-item label="山垅田面积" prop="mountainSpace">
                    <span style="padding-left: 20px" v-if="form.mountainSpace!=null && form.mountainSpace !==''">{{form.mountainSpace}}  亩</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                  <el-form-item label="村庄建设用地面积" prop="availableSpace">
                    <span style="padding-left: 20px" v-if="form.availableSpace!=null && form.availableSpace !==''">{{form.availableSpace}}  亩</span>
                    <span style="padding-left: 20px" v-else>暂无</span>
                  </el-form-item>
                </div>
              </el-card>
            </div>
          </el-col>

          <el-col :span="24">
            <div style="padding: 10px;margin-top: 10px;">
              <el-card :body-style="{ padding: '10px' }" shadow="always" header="基础设施">
                <el-form-item label="集中供水率" label-width="150px" prop="waterRate">
                  <span style="padding-left: 20px" v-if="form.waterRate!=null && form.waterRate !==''">{{form.waterRate}}  %</span>
                  <span style="padding-left: 20px" v-else>暂无</span>
                </el-form-item>
                <el-form-item label="垃圾收集处理率" label-width="150px" prop="garbageRate">
                  <span style="padding-left: 20px" v-if="form.garbageRate!=null && form.garbageRate !==''">{{form.garbageRate}}  %</span>
                  <span style="padding-left: 20px" v-else>暂无</span>
                </el-form-item>
                <el-form-item label="污水处理率" label-width="150px" prop="badWaterRate">
                <span style="padding-left: 20px"
                      v-if="form.badWaterRate!=null && form.badWaterRate !==''">{{form.badWaterRate}}  %</span>
                <span style="padding-left: 20px" v-else>暂无</span>
                </el-form-item>
                <el-form-item label="通自然村道路硬化数" label-width="150px" prop="roadHardenCount">
                  <span style="padding-left: 20px" v-if="form.roadHardenCount!=null && form.roadHardenCount !==''">{{form.roadHardenCount}}</span>
                  <span style="padding-left: 20px" v-else>暂无</span>
                </el-form-item>
                <el-form-item label="通光纤宽带自然村数" label-width="150px" prop="bandwidthCount">
                  <span style="padding-left: 20px" v-if="form.bandwidthCount!=null && form.bandwidthCount !==''">{{form.bandwidthCount}}</span>
                  <span style="padding-left: 20px" v-else>暂无</span>
                </el-form-item>
              </el-card>
            </div>
          </el-col>

          <el-col :span="24">
            <div style="padding: 10px;margin-top: 10px;">
              <el-card :body-style="{ padding: '10px' }" shadow="always" header="公共环境">
                <el-form-item label="年垃圾处理费" label-width="130px" prop="handleGarbage">
                  <span style="padding-left: 20px" v-if="form.handleGarbage!=null && form.handleGarbage !==''">{{form.handleGarbage}}  元</span>
                  <span style="padding-left: 20px" v-else>暂无</span>
                </el-form-item>
                <el-form-item label="公共垃圾收集桶" label-width="130px" prop="garbageBarrel">
                  <span style="padding-left: 20px" v-if="form.garbageBarrel!=null && form.garbageBarrel !==''">{{form.garbageBarrel}}  个</span>
                  <span style="padding-left: 20px" v-else>暂无</span>
                </el-form-item>
                <el-form-item label="公共路灯" label-width="130px" prop="publicLamp">
                <span style="padding-left: 20px"
                      v-if="form.publicLamp!=null && form.publicLamp !==''">{{form.publicLamp}}  盏</span>
                  <span style="padding-left: 20px" v-else>暂无</span>
                </el-form-item>
                <el-form-item label="公共厕所" label-width="130px" prop="publicToilet">
                  <span style="padding-left: 20px" v-if="form.publicToilet!=null && form.publicToilet !==''">{{form.publicToilet}}  个</span>
                  <span style="padding-left: 20px" v-else>暂无</span>
                </el-form-item>
              </el-card>
            </div>
          </el-col>

          <el-col :span="24">
            <div style="padding: 10px;margin-top: 10px;">
              <el-card :body-style="{ padding: '10px' }" shadow="always">
                <el-form-item label="乡村图片" prop="imageAddress">
                  <div style="position: relative" v-if="form.imageAddress!=null && form.imageAddress !=='[]' && form.imageAddress !==''">
                    <!--<div style="display: flex; flex-wrap: wrap">
                      <div v-for="item in imgList">
                        <el-image
                          style="width: 200px; height: 200px; padding: 0 20px"
                          :src="item"
                          fit="contain"
                          :preview-src-list="imgList"
                        />
                    </div>
                  </div>-->
                    <el-carousel style="width: 80%;">
                      <el-carousel-item v-for="item in imgList" :key="item">
                        <el-image
                          :src="item"
                          fit="cover"
                        />
                      </el-carousel-item>
                    </el-carousel>
                    <el-image
                      style="width: 40px;height: 40px; border-radius: 5px; position: absolute; right: 180px; top: 10px; z-index: 2;"
                      src="http://8.135.49.179:8081/2edb74fc483849ebbe46a0118816b047.png"
                      :preview-src-list="imgList"
                    />
                  </div>
                  <span v-else style="padding: 0 20px;">暂无图片</span>
                </el-form-item>

                <el-form-item label="乡村视频" prop="videoAddress">
                  <div v-if="form.videoAddress!=null&&form.videoAddress !=='[]'&&form.videoAddress!==''">
                    <video :src="VideoUrl" controls="controls" preload="auto"
                           style="width: 654px;height: 368px"></video>
                  </div>
                  <span v-else style="padding: 0 10px;">暂未上传视频</span>
                </el-form-item>
              </el-card>
            </div>
          </el-col>
        </el-row>
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
          <!--          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据-->
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listVillageDetail,
    getVillageDetail,
    delVillageDetail,
    addVillageDetail,
    updateVillageDetail,
    exportVillageDetail, importTemplate,
    getLoginUser
  } from "@/api/module/villageDetail";
  import {optionsByType} from "@/api/module/ruralInfo";
  import {checkRole} from "../../../utils/permission";
  import {getToken} from '@/utils/auth';

  export default {
    name: "VillageDetail",
    data() {
      return {
        activeName: '1',

        //当前登录用户类型
        LoginUserType: [],
        //图片详情数组
        imgList: [],
        //详情视频
        VideoUrl: '',
        //详情
        openDetail: false,
        // 所有乡村option列表 label value
        ruralOptions: [],
        // 保存当前级联选择器的值 如：["N01000000", "N01M01000", "N01M01X01"]
        currentValue: [],
        //视频数组
        videoList: [],
        videoName: '',
        videoLimit: 1,
        hideVideoUploadEdit: false, // 上传限制 隐藏上传按钮
        detailVideo: '', //详情中视频url
        videoFlag: false, //是否显示进度条
        videoUploadPercent: "", //进度条的进度，
        isShowUploadVideo: false, //显示上传按钮
        uploadVideoUrl: process.env.VUE_APP_BASE_API + "/api/file/uploadvideo",

        // 用户导入参数
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
          url: process.env.VUE_APP_BASE_API + "/module/villageDetail/importData",
        },

        // 图片对象数组
        picList: [],
        hideImageUploadEdit: false, // 上传限制 隐藏上传按钮
        limit: 2, //图片数量限制
        dialogImageUrl: '', //预览
        dialogVisible: false,
        uploadUrl: process.env.VUE_APP_BASE_API + "/api/file/upload",

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
        // 村档信息档案表格数据
        villageDetailList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          imageAddress: undefined,
          videoAddress: undefined,
          ruralId: undefined,
          userId: undefined,
          secretaryName: undefined,
          leaderName: undefined,
          tenureTime: undefined,
          honor: undefined,
          villageType: undefined,
          isGovernmentRegion: undefined,
          collectiveIncome: undefined,
          averageIncome: undefined,
          householdsCount: undefined,
          inhabitantCount: undefined,
          alwaysLiveCount: undefined,
          smallSixtyCount: undefined,
          largeSixtyCount: undefined,
          terrainLandforms: undefined,
          space: undefined,
          landSpace: undefined,
          forestSpace: undefined,
          mountainSpace: undefined,
          availableSpace: undefined,
          naturalCount: undefined,
          housingCount: undefined,
          noHousingCount: undefined,
          cooperationCount: undefined,
          farmCount: undefined,
          waterRate: undefined,
          garbageRate: undefined,
          badWaterRate: undefined,
          roadHardenCount: undefined,
          bandwidthCount: undefined,
          handleGarbage: undefined,
          garbageBarrel: undefined,
          publicLamp: undefined,
          publicToilet: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          collectiveIncome: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "村集体自主经营性收入格式错误",
              trigger: "blur"
            },
          ],
          ruralId: [
            {required: true, message: "所在乡村不能为空", trigger: "blur"},

          ],
          tenureTime: [
            {required: true, message: "上任日期不能为空", trigger: "blur"},

          ],
          averageIncome: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "农村居民人均可支配收入格式错误",
              trigger: "blur"
            },
          ],
          householdsCount:[
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "户籍户数格式错误",
              trigger: "blur"
            },
          ],
          inhabitantCount: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "户籍人口数格式错误",
              trigger: "blur"
            },
          ],
          alwaysLiveCount: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "常住人口数格式错误",
              trigger: "blur"
            },
          ],
          smallSixtyCount: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "常住人口格式错误",
              trigger: "blur"
            },
          ],
          largeSixtyCount: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "常住人口格式错误",
              trigger: "blur"
            },
          ],
          space: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "村域面积格式错误",
              trigger: "blur"
            },
          ],
          landSpace: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "耕地面积格式错误",
              trigger: "blur"
            },
          ],
          forestSpace: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "林地面积格式错误",
              trigger: "blur"
            },
          ],
          mountainSpace: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "山垅田面积格式错误",
              trigger: "blur"
            },
          ],
          availableSpace: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "村庄建设用地面积格式错误",
              trigger: "blur"
            },
          ],
          naturalCount: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "自然村数量格式错误",
              trigger: "blur"
            },
          ],
          housingCount: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "农村住房总户数格式错误",
              trigger: "blur"
            },
          ],
          noHousingCount: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "常年无人居住住房户数格式错误",
              trigger: "blur"
            },
          ],
          cooperationCount: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "省级以上农民专业合作示范社数量格式错误",
              trigger: "blur"
            },
          ],
          farmCount: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "省级以上家庭农场数量格式错误",
              trigger: "blur"
            },
          ],
          waterRate: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "集中供水率格式错误",
              trigger: "blur"
            },
          ],
          garbageRate: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "垃圾收集处理率格式错误",
              trigger: "blur"
            },
          ],
          badWaterRate: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "污水处理率格式错误",
              trigger: "blur"
            },
          ],
          roadHardenCount: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "通自然村道路硬化数格式错误",
              trigger: "blur"
            },
          ],
          bandwidthCount: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "通光纤宽带自然村数格式错误",
              trigger: "blur"
            },
          ],
          handleGarbage: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "年垃圾处理费格式错误",
              trigger: "blur"
            },
          ],
          garbageBarrel: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "公共垃圾收集桶格式错误",
              trigger: "blur"
            },
          ],
          publicLamp: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "公共路灯格式错误",
              trigger: "blur"
            },
          ],
          publicToilet: [
            // {required:true,message:"任职年数不能为空",trigger:"blur"},
            {
              // pattern:/^-?\d+(\.\d+)?$/,
              pattern: /(^[0-9]{1,12}$)|(^[0-9]{1,12}[\.]{1}[0-9]{1,2}$)/,
              message: "公共厕所格式错误",
              trigger: "blur"
            },
          ],
        }
      };
    },
    created() {
      this.getList();
      this.getRuralOptions();
      // this.getLoginUser();
    },
    watch: {
      open(val) {
        if (val === false) {
          this.picList = [];
          this.videoList = [];
          this.hideImageUploadEdit = false;
          this.hideVideoUploadEdit = false;
          this.currentValue = undefined;
        }
      },
      // 详情 关闭时清空图片对象数组
      openDetail(val) {
        if (val === false) {
          this.VideoUrl = '';
        }
      },
      // 监听级联选择器 选择操作
      currentValue(val) {
        // console.log("级联选择器 变化");
        if (val != null) this.form.ruralId = val[val.length-1];
        // console.log(this.form.ruralId)
      }
    },
    methods: {
      //县责不能删除市级
      getLoginUser(row) {
        // if (row.userType !=='3333')return true
        return row.userType !=='3333'?true:false;
      },
      checkRole,

      /** 查询村档信息档案列表 */
      getList() {
        this.loading = true;
        listVillageDetail(this.queryParams).then(response => {
          this.villageDetailList = response.rows;
          console.log(this.villageDetailList)
          this.total = response.total;
          this.loading = false;
        });
      },

      //是否转换
      format(value) {
        if (value)
          return '√';
        else
          return '';
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
      /*列表number*/
      indexMethod(index) {
        return ++index;
      },
      // 获取首张图片 url
      firstImg(row) {
        var images = [];
        if (row.imageAddress != null && row.imageAddress !== '[]') {
          images = JSON.parse(row.imageAddress);
          // console.log("----------");
          // console.log(images[0]);
          return images[0];
        }
        return null;
      },

      firstImgArray(row) {
        var images = [];
        images.push(this.firstImg(row));
        return images;
      },
      //封面视频
      firstVideo(row) {
        var videos = [];
        if (row.videoAddress != null) {

          videos = JSON.parse(row.videoAddress);
          // console.log("----------")
          // console.log(JSON.parse(row.img))
          return videos[0];
        }
        return null;
      },
      firstVideoArray(row) {
        var videos = [];
        videos.push(this.firstVideo(row));
        return videos;
      },
      // 获取所有的乡村 选择器option
      getRuralOptions() {
        optionsByType('50').then(response => {
          this.ruralOptions = response.data;
          // console.log(response);
        });
      },
      // 加文件、上传成功和上传失败时都会被调用
      handleEditVideoChange(file, fileList) {
        this.hideVideoUploadEdit = fileList.length >= this.videoLimit;
        // console.log("this.fileList:", this.fileList);
        // console.log("this.hideUploadEdit:", this.hideVideoUploadEdit);
      },
      //上传视频
      handleVideoSuccess(response, file, fileList) {
        file.url = response.data;
        this.videoList = fileList;
      },
      //进度条
      uploadVideoProcess(event, file, fileList) {
        this.videoFlag = true;
        this.videoUploadPercent = file.percentage.toFixed(0) * 1;
      },
      // 视频移除事件
      handleVideoRemove(file, fileList) {
        //console.log(file, fileList);
        this.videoList = fileList;
        this.hideVideoUploadEdit = fileList.length >= this.videoLimit;
        // console.log(this.hideVideoUploadEdit)
      },
      //上传前校验视频
      beforeUploadVideo(file) {
        const isLt20M = file.size / 1024 / 1024 < 200;
        if (['video/mp4'].indexOf(file.type) == -1) { //'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'
          this.$message.error('请上传正确的视频格式');
          return false;
        }
        if (!isLt20M) {
          this.$message.error('上传视频大小不能超过200MB哦!');
          return false;
        }
        this.isShowUploadVideo = false;
      },
      // 加文件、上传成功和上传失败时都会被调用
      handleEditChange(file, fileList) {
        this.hideImageUploadEdit = fileList.length >= this.limit;
        // console.log("this.fileList:", this.fileList);
        // console.log("this.hideUploadEdit:", this.hideImageUploadEdit);
      },
      // 图片上传成功
      handleSuccess(response, file, fileList) {
        file.url = response.data;
        this.picList = fileList;
      },
      // 图片移除事件
      handleRemove(file, fileList) {

        console.log(file);
        /* if (file.status ==='success'){
           delImgUrl(file.url);
           /!*this.$confirm('确认删除吗?', "警告", {
             confirmButtonText: "确定",
             cancelButtonText: "取消",
             type: "warning"
           }).then(function () {
             // return delImgUrl(file.url);
             // return process.env.VUE_APP_BASE_API + "/api/file/delFile/"+file.url;
             return request(process.env.VUE_APP_BASE_API + "/api/file/delFile/"+file.url);
           }).then(() => {
             // this.getList();
             // this.msgSuccess("删除成功");
           }).catch(function () {
           });*!/
         }*/
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
        const isLt5M = file.size / 1024 / 1024 < 5;

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB!');
        }
        return isJPG && isLt5M;
      },

      /** 导入按钮操作 */ //===========================================
      handleImport() {
        this.upload.title = "导入乡村信息";
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
      }, // ===============================================



      // 取消按钮
      cancel() {
        this.open = false;
        this.openDetail = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          imageAddress: undefined,
          videoAddress: undefined,
          ruralId: undefined,
          userId: undefined,
          secretaryName: undefined,
          leaderName: undefined,
          tenureTime: undefined,
          honor: undefined,
          villageType: undefined,
          isGovernmentRegion: true,
          collectiveIncome: undefined,
          averageIncome: undefined,
          householdsCount: undefined,
          inhabitantCount: undefined,
          alwaysLiveCount: undefined,
          smallSixtyCount: undefined,
          largeSixtyCount: undefined,
          terrainLandforms: undefined,
          space: undefined,
          landSpace: undefined,
          forestSpace: undefined,
          mountainSpace: undefined,
          availableSpace: undefined,
          naturalCount: undefined,
          housingCount: undefined,
          noHousingCount: undefined,
          cooperationCount: undefined,
          farmCount: undefined,
          waterRate: undefined,
          garbageRate: undefined,
          badWaterRate: undefined,
          roadHardenCount: undefined,
          bandwidthCount: undefined,
          handleGarbage: undefined,
          garbageBarrel: undefined,
          publicLamp: undefined,
          publicToilet: undefined,
          delFlag: undefined,
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined
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
        this.title = "添加村档信息档案";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getVillageDetail(id).then(response => {
          this.form = response.data;
          this.currentValue = response.data.currentValue;
          console.log(this.currentValue);
          this.open = true;
          this.title = "修改村档信息档案";
          // 读取 图片数组 -> 图片对象数组
          if (this.form.imageAddress === null && this.form.imageAddress === '[]' && this.form.imageAddress === '') return;
          for (let j = 0; j < JSON.parse(this.form.imageAddress).length; j++) {
            this.picList.push({
              'url': JSON.parse(this.form.imageAddress)[j]
            })
          }
          this.hideImageUploadEdit = this.picList.length >= this.limit;

          // 读取 视频数组 -> 视频对象数组
          if (this.form.videoAddress != null && this.form.videoAddress !== '[]' && this.form.videoAddress !== '') {
            for (let j = 0; j < JSON.parse(this.form.videoAddress).length; j++) {
              this.videoList.push({
                'url': JSON.parse(this.form.videoAddress)[j],
                'name': JSON.parse(this.form.videoAddress)[j].substring(JSON.parse(this.form.videoAddress)[j].lastIndexOf("/") + 1)
              })
            }
            this.hideVideoUploadEdit = this.videoList.length >= this.videoLimit;
          }
        });
      },
      //查看详情
      catchDetail(row) {
        this.picList = []
        this.pFilefileList = []
        this.reset();
        const id = row.id
        getVillageDetail(id).then(response => {
          this.form = response.data;
          if (this.form.imageAddress != null && this.form.imageAddress !== '' && this.form.imageAddress !== '[]') {
            this.imgList = JSON.parse(this.form.imageAddress);
          }
          //遍历循环视频
          if (this.form.videoAddress != null && this.form.videoAddress !== '' && this.form.videoAddress !== '[]') {
            this.VideoUrl = JSON.parse(this.form.videoAddress)[0]
          }
          this.openDetail = true;
          this.title = "查看详情";
        });
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              // 提交时保存为 json 格式
              var images = [];
              var videos = [];
              for (let i = 0; i < this.picList.length; i++) {
                images.push(this.picList[i].url)

              }
              for (let i = 0; i < this.videoList.length; i++) {
                videos.push(this.videoList[i].url)
              }
              this.form.imageAddress = JSON.stringify(images);
              this.form.videoAddress = JSON.stringify(videos);
              updateVillageDetail(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              // 提交时保存为 json 格式
              var images = [];
              var videos = [];
              for (let i = 0; i < this.picList.length; i++) {
                images.push(this.picList[i].url)

              }
              for (let i = 0; i < this.videoList.length; i++) {
                videos.push(this.videoList[i].url)
                /* if (this.videoName != null){
                   this.form.videoName = this.videoList[i].name
                 }else {
                   this.form.videoName = '未命名文档' + i++;
                 }*/
              }
              this.form.imageAddress = JSON.stringify(images);
              this.form.videoAddress = JSON.stringify(videos);
              //相同村只给添加一次
              for (let i = 0; i <this.villageDetailList.length ; i++) {
                if(this.form.ruralId ==this.villageDetailList[i].ruralId){
                  this.msgError("已经存在该村档案了，请修改！");
                  return;
                }
              }
              addVillageDetail(this.form).then(response => {
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
        this.$confirm('是否确认删除村档信息档案为"' + row.detailVillage + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delVillageDetail(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function () {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有村档信息档案数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportVillageDetail(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function () {
        });
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
