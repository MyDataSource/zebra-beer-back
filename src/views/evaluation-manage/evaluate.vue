<template>
  <section>
    <!--列表-->
    <el-table :data="lists" v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="id" label="评论号" sortable></el-table-column>
      <el-table-column prop="userId" label="评论人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
      <el-table-column prop="description" label="评价内容"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" type="error" @click="handDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>
  </section>
</template>
<script>
import { getEvaluateList, delEvaluateList } from "../../api/api";
export default {
  data() {
    return {
      lists: [],
      listLoading: false,
      total: 0,
      page: 1,
      size: 10
    };
  },
  methods: {
    getLists() {
      getEvaluateList().then(res => {
        console.log(res);
        this.lists = res.data;
      });
    },
    handDel(index, row) {
      this.$confirm("确认删除吗？", "提示", {}).then(() => {
        delEvaluateList({ id: row.id }).then(res => {
          console.log(res);
          this.getLists();
        });
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getLists();
    },
    handleSizeChange(val) {
      this.size = val;
      this.getLists();
    }
  },
  mounted() {
    this.getLists();
  }
};
</script>
<style scoped>
</style>
