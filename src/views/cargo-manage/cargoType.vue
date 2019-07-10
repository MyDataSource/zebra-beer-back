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
    <!-- 列表 -->
    <el-table :data="cargoTypeList" v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="name" label="分类名称"></el-table-column>
      <el-table-column prop="stateName" label="状态" sortable></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--新增/编辑界面-->
    <el-dialog
      :title="flag == true?'新增分类':'编辑分类'"
      :visible.sync="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="addForm.state">
            <el-radio :label="1">可用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="handleSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import {
  addCargoByTypeList,
  getCargoByTypeList,
  updateCargoTypeList
} from "../../api/api";
export default {
  data() {
    return {
      flag: true,
      cargoTypeList: [],
      listLoading: false,
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        name: "",
        state: 1
      }
    };
  },
  methods: {
    getCargoByType() {
      this.listLoading = true;
      getCargoByTypeList(JSON.stringify({ state: 1 })).then(res => {
        for (let i of res.data) {
          i.stateName = i.state == 1 ? "可用" : "禁用";
        }
        this.cargoTypeList = res.data;
        this.listLoading = false;
        console.log(res.data);
      });
    },
    handleAdd() {
      this.flag = true;
      this.addFormVisible = true;
      this.addForm = {
        name: "",
        state: 1
      };
    },
    handleEdit(index, row) {
      this.flag = false;
      console.log(index, row);
      this.addFormVisible = true;
      this.addForm = row;
    },
    handleSubmit() {
      console.log("提交");
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            let para = JSON.parse(JSON.stringify(this.addForm));
            console.log(this.addForm);
            if (this.flag == true) {
              addCargoByTypeList(JSON.stringify(para)).then(res => {
                console.log(res);
                this.addLoading = false;
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getCargoByType();
              });
            } else {
              updateCargoTypeList(JSON.stringify(para)).then(res => {
                this.addLoading = false;
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getCargoByType();
              });
            }
          });
        }
      });
    }
  },
  mounted() {
    this.getCargoByType();
  }
};
</script>
<style scoped>
</style>
