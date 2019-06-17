<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.cargoId" placeholder="商品编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getStandard">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="standardList" v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column label="规格图片">
        <template slot-scope="scope">
          <img
            :src="scope.row.img==null?'':imgBaseUrl+(scope.row.img)"
            alt
            class="image"
            @click="preview(scope.row.img)"
          >
        </template>
      </el-table-column>
      <el-table-column prop="name" label="规格名称" sortable></el-table-column>
      <el-table-column prop="quantity" label="库存" sortable></el-table-column>
      <el-table-column prop="price" label="单价" sortable></el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="商品编号">
          <span>{{editForm.cargoId}}</span>
        </el-form-item>
        <el-form-item label="规格使能">
          <el-radio-group v-model="editForm.state">
            <el-radio class="radio" :label="1">是</el-radio>
            <el-radio class="radio" :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="规格图片" prop="img">
          <input type="hidden" v-model="editForm.img">
          <el-upload
            action="/BeerApp/oss/uploadFile"
            list-type="picture-card"
            accept="image/*"
            :file-list="fileList"
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
        <el-form-item label="单价">
          <el-input-number v-model="editForm.price" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="editForm.quantity" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="editForm.description"></el-input>
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
        <el-form-item label="商品编号">
          <span>{{addForm.cargoId}}</span>
        </el-form-item>
        <el-form-item label="规格使能">
          <el-radio-group v-model="addForm.state">
            <el-radio class="radio" :label="1">是</el-radio>
            <el-radio class="radio" :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="规格图片" prop="img">
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
        <el-form-item label="单价">
          <el-input-number v-model="addForm.price" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="addForm.quantity" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="addForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
import {
  getStandardList,
  delStandardList,
  editStandardList,
  addStandardList
} from "../../api/api";

export default {
  data() {
    return {
      //   cargoId: "",
      fileList: [],
      hideUpload: false,
      imgBaseUrl: "/BeerApp/oss/getFile?id=",
      filters: {
        cargoId: ""
      },
      standardList: [],
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入规格名称", trigger: "blur" }],
        img: [{ required: true, message: "请选择规格图片", trigger: "blur" }]
        // price: [{ required: true, message: "请输入单价", trigger: "blur" }],
        // quantity: [{ required: true, message: "请输入库存", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        cargoId: "",
        description: "",
        id: 0,
        img: "",
        name: "",
        price: 0,
        quantity: 0,
        state: 0
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入规格名称", trigger: "blur" }],
        img: [{ required: true, message: "请选择规格图片", trigger: "blur" }]
        // price: [{ required: true, message: "请输入单价", trigger: "blur" }],
        // quantity: [{ required: true, message: "请输入库存", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        cargoId: "",
        description: "",
        // id: 0,
        img: "",
        name: "",
        price: 0,
        quantity: 0,
        state: 1
      },
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    //预览图
    preview(img) {
      console.log(img);
      this.dialogImageUrl = img == null ? "" : this.imgBaseUrl + img;
      this.dialogVisible = img == null ? false : true;
    },
    getStandard() {
      let cargoId = localStorage.getItem("cargoId");
      console.log(cargoId);
      if (cargoId) {
        this.filters.cargoId = cargoId;
        localStorage.removeItem("cargoId");
      }
      if (this.filters.cargoId != "") {
        let para = {
          cargoId: this.filters.cargoId
        };
        this.listLoading = true;
        getStandardList(para).then(res => {
          this.standardList = res.data;
          this.listLoading = false;
          console.log(res.data);
        });
      } else {
        this.$message({
          message: "请输入商品编号进行查询",
          type: "warning"
        });
      }
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          console.log(row.id);
          delStandardList(row.id).then(res => {
            this.listLoading = false;
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getStandard();
          });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      let item = JSON.parse(JSON.stringify(row));
      this.editForm = item;
      this.fileList = [
        {
          url: this.imgBaseUrl + item.img
        }
      ];
      console.log(item);
      this.hideUpload = true;
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        cargoId: this.filters.cargoId,
        description: "",
        // id: 0,
        img: "",
        name: "",
        price: 0,
        quantity: 0,
        state: 1
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let para = Object.assign({}, this.editForm);
            console.log(para);
            editStandardList(para).then(res => {
              this.editLoading = false;
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["editForm"].resetFields();
              this.$refs.upload.clearFiles();
              this.editFormVisible = false;
              this.getStandard();
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
            let para = Object.assign({}, this.addForm);
            addStandardList(para).then(res => {
              this.addLoading = false;
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.$refs.upload.clearFiles();
              this.addFormVisible = false;
              this.getStandard();
            });
          });
        }
      });
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
  mounted() {
    this.getStandard();
  }
  //   created() {
  //     //生命周期里接收参数
  //     this.cargoId = this.$route.query.id;
  //     console.log(this.id);
  //   }
};
</script>

<style>
.image {
  width: 100px;
  height: 100px;
}
.hide .el-upload--picture-card {
  display: none;
}
</style>