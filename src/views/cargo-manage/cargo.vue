<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="cargoList" v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="cargoName" label="商品名称" sortable></el-table-column>
      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <img
            :src="scope.row.cargoImg==null?'':imgBaseUrl+(scope.row.cargoImg).split(',')[0]"
            alt
            class="image"
            @click="preview(scope.row.cargoImg)"
          >
        </template>
      </el-table-column>
      <el-table-column label="详情图片">
        <template slot-scope="scope">
          <img
            :src="scope.row.decripImg==null?'':imgBaseUrl+(scope.row.decripImg).split(',')[0]"
            alt
            class="image"
            @click="preview(scope.row.decripImg)"
          >
        </template>
      </el-table-column>
      <el-table-column prop="oldPrice" label="原价" sortable></el-table-column>
      <el-table-column prop="nowPrice" label="现价" sortable></el-table-column>
      <el-table-column prop="sellQuantity" label="销量" sortable></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleLink(scope.row.id)">
            设置规格
            <!-- <router-link :to="{name:'规格管理',query:{id:scope.row.id}}">设置规格</router-link> -->
          </el-button>
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑界面-->
    <el-dialog title="编辑商品" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="商品编号" prop="cargoNo">
          <el-input v-model="editForm.cargoNo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="cargoName">
          <el-input v-model="editForm.cargoName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            :action="baseUrl"
            list-type="picture-card"
            accept="image/*"
            :file-list="fileList1"
            :multiple="isMultiple"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove3"
            :on-success="handleAvatarSuccess3"
            :on-error="handleAvatarFail"
            ref="editUpload1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="详情图片">
          <el-upload
            :action="baseUrl"
            list-type="picture-card"
            accept="image/*"
            :file-list="fileList2"
            :multiple="isMultiple"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove4"
            :on-success="handleAvatarSuccess4"
            :on-error="handleAvatarFail"
            ref="editUpload2"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="现价" prop="nowPrice">
          <el-input-number v-model="editForm.nowPrice" :precision="2" :step="0.1" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="原价" prop="oldPrice">
          <el-input-number v-model="editForm.oldPrice" :precision="2" :step="0.1" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="销量" prop="sellQuantity">
          <el-input-number v-model="editForm.sellQuantity" :precision="0" :step="1" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="editForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增商品" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="商品编号" prop="cargoNo">
          <el-input v-model="addForm.cargoNo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="cargoName">
          <el-input v-model="addForm.cargoName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            :action="baseUrl"
            list-type="picture-card"
            accept="image/*"
            :multiple="isMultiple"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove1"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarFail"
            ref="addUpload1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="详情图片">
          <el-upload
            :action="baseUrl"
            list-type="picture-card"
            accept="image/*"
            :multiple="isMultiple"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove2"
            :on-success="handleAvatarSuccess1"
            :on-error="handleAvatarFail"
            ref="addUpload2"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="现价" prop="nowPrice">
          <el-input-number v-model="addForm.nowPrice" :precision="2" :step="0.1" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="原价" prop="oldPrice">
          <el-input-number v-model="addForm.oldPrice" :precision="2" :step="0.1" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="销量" prop="sellQuantity">
          <el-input-number v-model="addForm.sellQuantity" :precision="0" :step="1" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="addForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 商品图片轮播 -->
    <el-dialog :visible.sync="dialogVisible" class="bannerCover">
      <el-carousel :autoplay="false" style="height:auto">
        <el-carousel-item v-for="(item,index) in dialogImageUrl" :key="index">
          <img width="100%" :src="imgBaseUrl+item" mode="widthFix">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
    <!-- 上传图片预览 -->
    <el-dialog :visible.sync="visible">
      <img width="100%" :src="imageUrl" alt>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
import {
  baseUrl,
  getCargoList,
  updateCargoList,
  addCargoList,
  getStandardList
} from "../../api/api";

export default {
  data() {
    return {
      baseUrl: baseUrl+"/BeerApp/oss/uploadFile",
      isMultiple: true,
      fileList2: [],
      fileList1: [],
      dialogVisible: false,
      visible: false,
      dialogImageUrl: [],
      imageUrl: "",
      imgBaseUrl: "/BeerApp/oss/getFile?id=",
      cargoList: [],
      listLoading: false,

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        cargoName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        cargoNo: [
          { required: true, message: "请输入商品编号", trigger: "blur" }
        ]
      },
      //编辑界面数据
      editForm: {
        id: "",
        cargoNo: "",
        cargoName: "",
        cargoImg: [],
        decripImg: [],
        description: "",
        nowPrice: 0,
        oldPrice: 0,
        sellQuantity: 0
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        cargoName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        cargoNo: [
          { required: true, message: "请输入商品编号", trigger: "blur" }
        ]
      },
      //新增界面数据
      addForm: {
        cargoNo: "",
        cargoName: "",
        cargoImg: [],
        decripImg: [],
        description: "",
        nowPrice: 0,
        oldPrice: 0,
        sellQuantity: 0
      }
    };
  },
  methods: {
    handleLink(id) {
      console.log(id);
      localStorage.setItem("cargoId", id);

      this.$router.push({ path: "/standard" });
    },
    //获取列表
    getCargo() {
      this.listLoading = true;
      getCargoList().then(res => {
        this.cargoList = res.data;
        this.listLoading = false;
        console.log(res.data);
      });
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      // this.editForm = Object.assign({}, row);
      row = JSON.parse(JSON.stringify(row));
      this.editForm = {
        id: row.id,
        cargoNo: row.cargoNo,
        cargoName: row.cargoName,
        cargoImg: (row.cargoImg == null || row.cargoImg == "") ? [] : row.cargoImg.split(","),
        decripImg: (row.decripImg == null || row.decripImg == "") ? [] : row.decripImg.split(","),
        description: row.description,
        nowPrice: row.nowPrice,
        oldPrice: row.oldPrice,
        sellQuantity: row.sellQuantity
      };
      this.fileList1 = [];
      this.fileList2 = [];
      for (let i of this.editForm.cargoImg) {
        this.fileList1.push({ url: this.imgBaseUrl + i });
      }
      for (let j of this.editForm.decripImg) {
        this.fileList2.push({ url: this.imgBaseUrl + j });
      }
      this.editFormVisible = true;
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        cargoNo: "",
        cargoName: "",
        cargoImg: [],
        decripImg: [],
        description: "",
        nowPrice: 0,
        oldPrice: 0,
        sellQuantity: 0
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let para = {
              id: this.editForm.id,
              cargoImg: this.editForm.cargoImg.join(","),
              cargoName: this.editForm.cargoName,
              cargoNo: this.editForm.cargoNo,
              decripImg: this.editForm.decripImg.join(","),
              description: this.editForm.description,
              nowPrice: this.editForm.nowPrice,
              oldPrice: this.editForm.oldPrice,
              sellQuantity: this.editForm.sellQuantity
              //   quantity: 0,
              //   spec: "string",
              //   specificationList: [
              //     {
              //       cargoId: "string",
              //       description: "string",
              //       id: 0,
              //       img: "string",
              //       name: "string",
              //       price: 0,
              //       quantity: 0,
              //       state: 0
              //     }
              //   ]
            };
            updateCargoList(JSON.stringify(para)).then(res => {
              this.editLoading = false;
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["editForm"].resetFields();
              this.$refs.editUpload1.clearFiles();
              this.$refs.editUpload2.clearFiles();
              this.editFormVisible = false;
              this.getCargo();
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            let para = {
              cargoImg: this.addForm.cargoImg.join(","),
              cargoName: this.addForm.cargoName,
              cargoNo: this.addForm.cargoNo,
              decripImg: this.addForm.decripImg.join(","),
              description: this.addForm.description,
              nowPrice: this.addForm.nowPrice,
              oldPrice: this.addForm.oldPrice,
              sellQuantity: this.addForm.sellQuantity
              //   quantity: 0,
              //   spec: "string",
              //   specificationList: [
              //     {
              //       cargoId: "string",
              //       description: "string",
              //       id: 0,
              //       img: "string",
              //       name: "string",
              //       price: 0,
              //       quantity: 0,
              //       state: 0
              //     }
              //   ]
            };
            addCargoList(JSON.stringify(para)).then(res => {
              this.addLoading = false;
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.$refs.addUpload1.clearFiles();
              this.$refs.addUpload2.clearFiles();
              this.addFormVisible = false;
              this.getCargo();
            });
          });
        }
      });
    },
    //预览图
    preview(img) {
      console.log(img);
      this.dialogImageUrl = img == null ? [] : img.split(",");
      this.dialogVisible = img == null ? false : true;
    },
    //上传成功回调
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res);
      this.addForm.cargoImg.push(res.data.id);
      console.log(this.addForm.cargoImg);
    },
    handleAvatarSuccess1(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res);
      this.addForm.decripImg.push(res.data.id);
      console.log(this.addForm.decripImg);
    },
    handleAvatarSuccess3(res, file, fileList) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(fileList);
      this.editForm.cargoImg.push(res.data.id);
      this.fileList1.push({ url: this.imgBaseUrl + res.data.id });
      console.log(this.editForm.cargoImg);
    },
    handleAvatarSuccess4(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res);
      this.editForm.decripImg.push(res.data.id);
      this.fileList2.push({ url: this.imgBaseUrl + res.data.id });
      console.log(this.editForm.decripImg);
    },
    //上传失败回调
    handleAvatarFail(res) {
      this.$message({
        message: "图片上传失败！",
        type: "error"
      });
      console.log(res);
    },
    //删除图片时
    handleRemove1(file, fileList) {
      console.log(file, fileList);
      //删除的项
      let index = this.addForm.cargoImg.indexOf(file.response.data.id);
      console.log(index);
      this.addForm.cargoImg.splice(index, 1);
    },
    //删除图片时
    handleRemove2(file, fileList) {
      console.log(file, fileList);
      let index = this.addForm.decripImg.indexOf(file.response.data.id);
      console.log(index);
      this.addForm.decripImg.splice(index, 1);
    },
    handleRemove3(file, fileList) {
      console.log(file, this.editForm.cargoImg, fileList);
      console.log(this.fileList1);
      this.editForm.cargoImg = [];
      for (let i = 0; i < this.fileList1.length; i++) {
        if (this.fileList1[i].uid == file.uid) {
          console.log("匹配到uid", file.uid);
          this.fileList1.splice(i, 1);
        }
      }
      for (let j of this.fileList1) {
        this.editForm.cargoImg.push(j.url.substr(this.imgBaseUrl.length));
      }
      console.log(this.fileList1);
      console.log(this.editForm.cargoImg);
    },
    handleRemove4(file, fileList) {
      console.log(this.editForm.decripImg, fileList);
      console.log(this.fileList2);
      this.editForm.decripImg = [];
      for (let i = 0; i < this.fileList2.length; i++) {
        if (this.fileList2[i].uid == file.uid) {
          console.log("匹配到uid", file.uid);
          this.fileList2.splice(i, 1);
        }
      }
      for (let j of this.fileList2) {
        this.editForm.decripImg.push(j.url.substr(this.imgBaseUrl.length));
      }
      console.log(this.fileList2);
      console.log(this.editForm.decripImg);
    },
    //预览
    handlePictureCardPreview(file) {
      console.log(file);
      this.imageUrl = file.url;
      this.visible = true;
    }
  },
  mounted() {
    this.getCargo();
  }
};
</script>

<style scoped>
.image {
  width: 100px;
  height: 100px;
}
.bannerCover .el-dialog__body {
  overflow: scroll;
}
</style>