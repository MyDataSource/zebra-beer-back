<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.orderid" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.state" placeholder="订单状态">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getOrders">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="orders" v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="orderid" label="订单号" width="120" sortable></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
          <el-button size="small" @click="handleDel(scope.$index, scope.row)">发货</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>
  </section>
</template>

<script>
import util from "../../common/js/util";
import { getOrderList } from "../../api/api";

export default {
  data() {
    return {
      filters: {
        orderid: "",
        state: ""
      },
      options: [
        {
          value: "null",
          label: "全部"
        },
        {
          value: "1",
          label: "待付款"
        },
        {
          value: "2",
          label: "待发货"
        },
        {
          value: "3",
          label: "待收货"
        },
        {
          value: "4",
          label: "待评价"
        }
      ],
      orders: [],
      total: 0,
      page: 1,
      listLoading: false
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getOrders();
    },
    getOrders() {
      let para = {
        page: this.page,
        orderid: this.filters.orderid,
        state: this.filters.state
      };
      this.listLoading = true;
      getOrderList(para).then(res => {
        this.total = res.data.total;
        this.users = res.data.users;
        this.listLoading = false;
        console.log(res.data);
      });
    }
  },
  mounted() {
    this.getOrders();
  }
};
</script>

<style scoped>
</style>