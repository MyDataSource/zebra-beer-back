<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="default" v-on:click="updateBanner">保存</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table
        :data="bannerList"
        highlight-current-row
        v-loading="listLoading"
        @selection-change="selsChange"
        style="width: 100%;"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="serial" label="排序编号" width="100"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <img :src="imgBaseUrl+scope.row.img" class="image">
          </template>
        </el-table-column>
        <el-table-column prop="url" label="链接地址" min-width="180"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="排序操作" width="200">
          <template slot-scope="scope">
            <el-button
              @click="moveUp(scope.$index, scope.row)"
              icon="el-icon-top"
              v-if="scope.$index > 0"
            >上移</el-button>
            <el-button
              @click="moveDown(scope.$index, scope.row)"
              icon="el-icon-bottom"
              v-if="!(scope.$index+1 == bannerList.length)"
            >下移</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteBanner(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
    </el-col>
    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="排序号" prop="serial">
          <el-input-number v-model="addForm.serial" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="addForm.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片上传">
          <!-- <el-upload
            class="avatar-uploader"
            action="http://localhost:8080/BeerApp/oss/uploadFile"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarFail"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>-->

          <el-upload
            action="/BeerApp/oss/uploadFile"
            list-type="picture-card"
            accept="image/*"
            :limit="imgLimit"
            :file-list="productImgs"
            :multiple="isMultiple"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-exceed="handleExceed"
            :on-error="handleAvatarFail"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addBanner" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </section>
</template>

<script>
import { getBannerList, updateBannerList } from "../../api/api";
import { Message } from "element-ui";
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      productImgs: [],
      isMultiple: false,
      imgLimit: 1,

      sels: [], //列表选中列
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        serial: [{ required: true, message: "请输入排序号", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        id: 1,
        img: "",
        url: "",
        serial: "",
        createTime: ""
      },
      imgBaseUrl: "/BeerApp/oss/getFile?id=",
      listLoading: false,
      //初始表格数据
      bannerList: [
        {
          id: 1,
          img: "d9662feecf464731820632ba0e231f6f",
          url: "aaa/aaa",
          serial: 1,
          createTime: "2019-10-10 19:00:00"
        },
        {
          id: 2,
          img: "d9662feecf464731820632ba0e231f6f",
          url: "bbb/bbb",
          serial: 2,
          createTime: "2019-10-10 19:00:00"
        },
        {
          id: 3,
          img: "d9662feecf464731820632ba0e231f6f",
          url: "ccc/ccc",
          serial: 3,
          createTime: "2019-10-10 19:00:00"
        }
      ]
    };
  },
  methods: {
    //获取轮播图
    getBanner() {
      this.listLoading = true;
      getBannerList().then(res => {
        this.listLoading = false;
        console.log(res.data);
        this.bannerList = res.data;
      });
    },
    //显示新增界面
    handleAdd: function() {
      let dates = this.formats(new Date());
      this.addFormVisible = true;
      this.addForm = {
        id: this.bannerList.length + 1,
        img: "",
        url: "",
        serial: this.bannerList.length + 1,
        createTime: dates
      };
    },
    //添加一项
    addBanner() {
      this.bannerList.push(this.addForm);
      console.log(this.bannerList);
      this.addFormVisible = false;
    },
    //删除一项
    deleteBanner(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          // this.listLoading = true;
          let para = { id: row.id };
          console.log(index, row.id);
          this.bannerList.splice(index, 1);
          //重新排序
          this.sortSerial();
        })
        .catch(() => {});
    },
    //点击确认更新
    updateBanner() {
      console.log(this.bannerList);
      this.$confirm("确认提交吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          updateBannerList(JSON.stringify(this.bannerList)).then(res => {
            console.log(res);
            this.$message({
              message: "提交成功！",
              type: "success"
            });
            this.getBanner();
          });
        })
        .catch(() => {});
    },
    //对bannerList进行排序
    sortSerial() {
      let arr = this.bannerList;
      for (let i = 0; i < arr.length; i++) {
        arr[i].id = i + 1;
        arr[i].serial = i + 1;
      }
    },
    //上移
    moveUp: function(index, row) {
      let arr = this.bannerList;
      let currentItem = arr[index]; //选中项
      let lastItem = arr[index - 1]; //上一项
      arr.splice(index - 1, 2, currentItem, lastItem);
      this.sortSerial();
    },
    //下移
    moveDown: function(index, row) {
      let arr = this.bannerList;
      let currentItem = arr[index]; //选中项
      let lastItem = arr[index + 1]; //下一项
      arr.splice(index, 2, lastItem, currentItem);
      this.sortSerial();
    },
    //选中复选框事件
    selsChange: function(sels) {
      this.sels = sels;
      console.log(this.sels);
    },
    //批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          let arr = ids.split(",");
          console.log(arr); //1,2,3格式
          for (let i = 0; i < this.bannerList.length; i++) {
            for (let j = 0; j < arr.length; j++) {
              if (this.bannerList[i].id == arr[j]) {
                this.bannerList.splice(i, 1);
              }
            }
          }
          //重新排序
          this.sortSerial();
        })
        .catch(() => {});
    },
    //date转YYYY-MM-DD hh:mm:ss
    formats(dates) {
      var o = {
        Y: dates.getFullYear(),
        M: dates.getMonth() + 1, //月份
        d: dates.getDate(), //日
        h: dates.getHours(), //小时
        m: dates.getMinutes(), //分
        s: dates.getSeconds() //秒
      };
      return o.Y + "-" + o.M + "-" + o.d + " " + o.h + ":" + o.m + ":" + o.s;
    },
    //上传成功回调
    handleAvatarSuccess(res, file) {
      this.dialogImageUrl = URL.createObjectURL(file.raw);
      console.log(res);
      this.addForm.img = res.data.id;
    },
    //上传失败回调
    handleAvatarFail(res) {
      this.$message({
        message: "图片上传失败！",
        type: "error"
      });
      console.log(res);
    },
    //图片上传超过数量限制
    handleExceed(files, fileList) {
      this.$message({
        message: "上传图片不能超过1张",
        type: "error"
      });
      console.log(file, fileList);
    },
    //上传前处理
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
    },
    //删除图片时
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },
  mounted: function() {
    //获取轮播图
    this.getBanner();
  }
};
</script>
<style>
/* .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
} */

.cards {
  padding: 20px;
}
.add-card {
  height: 420px;
  border: 1px dashed #ccc;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #999;
  font-size: 50px;
  font-weight: 300;
}
.image {
  width: 100%;
  display: block;
}
/* .image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
} */
</style>
