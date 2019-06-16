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
        v-loading="listLoading"
        @selection-change="selsChange"
        style="width: 100%;"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <!-- <el-table-column type="index" width="60"></el-table-column> -->
        <el-table-column prop="serial" label="排序编号" width="100"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <img :src="imgBaseUrl+scope.row.img" class="image">
          </template>
        </el-table-column>
        <el-table-column prop="url" label="跳转链接" min-width="100"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="200"></el-table-column>
        <el-table-column label="排序操作" width="200">
          <template slot-scope="scope">
            <el-button
              @click="moveUp(scope.$index, scope.row)"
              icon="el-icon-top"
              size="small"
              v-if="scope.$index > 0"
            >上移</el-button>
            <el-button
              @click="moveDown(scope.$index, scope.row)"
              icon="el-icon-bottom"
              size="small"
              v-if="!(scope.$index+1 == bannerList.length)"
            >下移</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
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
    <el-dialog title="新增轮播图" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRule" ref="addForm">
        <el-form-item label="跳转链接" prop="url">
          <el-input v-model="addForm.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="img">
          <input type="hidden" v-model="addForm.img">
          <el-upload
            action="/BeerApp/oss/uploadFile"
            list-type="picture-card"
            accept="image/*"
            :multiple="false"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarFail"
            :class="{hide:hideUpload}"
            ref="upload"
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

    <!--编辑界面-->
    <el-dialog title="编辑轮播图" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRule" ref="editForm">
        <el-form-item label="跳转链接" prop="url">
          <el-input v-model="editForm.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="img">
          <input type="hidden" v-model="editForm.img">
          <el-upload
            action="/BeerApp/oss/uploadFile"
            list-type="picture-card"
            :file-list="fileList"
            accept="image/*"
            :multiple="false"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarFail"
            :class="{hide:hideUpload}"
            ref="upload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editBanner" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </section>
</template>
<script>
import { getBannerList, updateBannerList } from "../../api/api";
import util from "../../common/js/util";
import { Message } from "element-ui";
export default {
  data() {
    return {
      hideUpload: false,
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: [], //编辑界面初始化file

      sels: [], //列表选中列
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      //新增界面数据
      addForm: {
        img: "",
        url: ""
      },
      addFormRule: {
        img: [{ required: true, message: "请选择图片", trigger: "blur" }]
      },
      editFormVisible: false, //
      editLoading: false,
      //编辑界面数据
      editForm: {
        img: "",
        url: ""
      },
      editFormRule: {
        img: [{ required: true, message: "请选择图片", trigger: "blur" }]
      },
      imgBaseUrl: "/BeerApp/oss/getFile?id=",
      listLoading: false,
      //初始表格数据
      bannerList: []
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
      this.addFormVisible = true;
      this.hideUpload = false;
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      //
      let item = JSON.parse(JSON.stringify(row));
      this.editForm = item;
      this.fileList = [
        {
          url:this.imgBaseUrl+item.img
        }
      ];
      console.log(item);
      this.hideUpload = true;
    },
    //添加一项
    addBanner() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗?", "提示", {
            type: "warning"
          })
            .then(() => {
              this.addLoading = true;
              this.addForm.id = this.bannerList.length + 1;
              this.addForm.serial = this.bannerList.length + 1;
              this.addForm.createTime = util.formatDate.format(
                new Date(),
                "yyyy-MM-dd hh:mm:ss"
              );
              console.log(this.addForm);
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.bannerList.push(JSON.parse(JSON.stringify(this.addForm))); //json转换防止重置表单时表格数据同步变化
              this.$refs["addForm"].resetFields(); //提交成功重置表单
              this.$refs.upload.clearFiles(); //清空已上传图片
              // console.log(this.bannerList);
              this.addLoading = false;
              this.addFormVisible = false;
            })
            .catch(() => {});
        }
      });
    },
    //确认编辑
    editBanner() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗?", "提示", {
            type: "warning"
          })
            .then(() => {
              this.editLoading = true;
              console.log(this.editForm);
              let item = JSON.parse(JSON.stringify(this.editForm))
              for(let i=0; i<this.bannerList.length;i++){
                if(this.bannerList[i].id == item.id){
                  console.log('匹配');
                  this.bannerList.splice(i,1,item);
                }
              }
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["editForm"].resetFields(); //提交成功重置表单
              this.$refs.upload.clearFiles(); //清空已上传图片
              // console.log(this.bannerList);
              this.editLoading = false;
              this.editFormVisible = false;
            })
            .catch(() => {});
        }
      });
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
          this.$message({
            message: "删除成功！",
            type: "success"
          });
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
          this.$message({
            message: "删除成功！",
            type: "success"
          });
          //重新排序
          this.sortSerial();
        })
        .catch(() => {});
    },
    //上传成功回调
    handleAvatarSuccess(res, file, fileList) {
      console.log("上传成功", fileList);
      this.hideUpload = fileList.length >= 1;
      if (this.addFormVisible) {
        this.addForm.img = res.data.id;
      } else if (this.editFormVisible) {
        this.editForm.img = res.data.id;
      }
    },
    //上传失败回调
    handleAvatarFail(res) {
      console.log("上传失败", res);
      this.$message({
        message: "图片上传失败！",
        type: "error"
      });
    },
    //删除图片时
    handleRemove(file, fileList) {
      console.log("删除", fileList);
      this.hideUpload = fileList.length >= 1;
      if (this.addFormVisible) {
        this.addForm.img = "";
      } else if (this.editFormVisible) {
        this.editForm.img = "";
      }
    },
    //预览
    handlePictureCardPreview(file) {
      console.log("预览", file);
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
.hide .el-upload--picture-card {
  display: none;
}
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
</style>