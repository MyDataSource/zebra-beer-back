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
    <el-table :data="cargoList" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="cargoName" label="商品名称" sortable></el-table-column>
      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <img
            :src="imgBaseUrl+(scope.row.cargoImg).split(',')[0]"
            alt
            class="image"
            @click="preview(scope.row.cargoImg)"
          >
        </template>
      </el-table-column>
      <el-table-column prop="oldPrice" label="原价" sortable></el-table-column>
      <el-table-column prop="nowPrice" label="现价" sortable></el-table-column>
      <el-table-column prop="quantity" label="库存" sortable></el-table-column>
      <el-table-column prop="sellQuantity" label="销量" sortable></el-table-column>
      <!-- <el-table-column prop="decripImg" label="详情图" sortable></el-table-column> -->
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="商品名称">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="editForm.addr"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="商品编号" prop="cargoNo">
          <el-input v-model="addForm.cargoNo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="cargoName">
          <el-input v-model="addForm.cargoName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            action="/BeerApp/oss/uploadFile"
            list-type="picture-card"
            accept="image/*"
            :limit="imgLimit"
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
        <el-form-item label="详情图片">
          <el-upload
            action="/BeerApp/oss/uploadFile"
            list-type="picture-card"
            accept="image/*"
            :limit="imgLimit"
            :multiple="isMultiple"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess1"
            :before-upload="beforeAvatarUpload"
            :on-exceed="handleExceed"
            :on-error="handleAvatarFail"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="现价">
          <el-input-number v-model="addForm.nowPrice" :precision="2" :step="0.1" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="原价">
          <el-input-number v-model="addForm.oldPrice" :precision="2" :step="0.1" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="销量">
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

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="imgBaseUrl+dialogImageUrl" alt>
    </el-dialog>

    <el-dialog :visible.sync="visible">
      <img width="100%" :src="imageUrl" alt>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
import {
  getCargoList,
  updateCargoList,
  addCargoList,
  getStandardList
} from "../../api/api";

export default {
  data() {
    return {
      isMultiple: true,
      imgLimit: 10,

      dialogVisible: false,
      visible: false,
      dialogImageUrl: "",
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
        cargoNo: "",
        cargoName: "",
        cargoImg: [],
        decripImg: [],
        description: "",
        nowPrice: 0,
        oldPrice: 0
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
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
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
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
            para.birth =
              !para.birth || para.birth == ""
                ? ""
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");
            editUser(para).then(res => {
              this.editLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["editForm"].resetFields();
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
      this.dialogImageUrl = img.split(",")[0];
      this.dialogVisible = true;
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
</style>