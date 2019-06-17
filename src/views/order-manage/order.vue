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
      <el-table-column prop="id" label="订单号" sortable></el-table-column>
      <el-table-column prop="price" label="支付金额" sortable></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
      <el-table-column prop="state" label="订单状态" sortable></el-table-column>
      <el-table-column prop="message" label="买家留言" sortable></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleView(scope.$index, scope.row)">查看</el-button>
          <el-button
            size="small"
            @click="handleDeliver(scope.$index, scope.row)"
            v-if="scope.row.state == 2"
          >发货</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="10"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>

    <!-- 查看 -->
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="viewItem" label-width="100px">
        <el-form-item label="订单编号">
          <span>{{viewItem.id}}</span>
        </el-form-item>
        <el-form-item label="支付金额">
          <span>{{viewItem.price}}</span>
        </el-form-item>
        <el-form-item label="下单时间">
          <span>{{viewItem.createTime}}</span>
        </el-form-item>
        <el-form-item label="收货地址">
          <span>{{viewItem.addressId}}</span>
        </el-form-item>
        <el-form-item label="买家留言">
          <span>{{viewItem.message}}</span>
        </el-form-item>
        <el-form-item label="货物清单">
          <div v-for="(items,index) in viewItem.cargoList" v-bind:key="index" class="cargoList">
            <img :src="imgBaseUrl+items.img" alt class="goodsImg">
            <div class="msgCover">
              <div class="msg1">
                <span>{{items.cargoName}}</span>
                <span style="color:#ef0007">￥{{items.price}}</span>
              </div>
              <div class="msg2">
                <span>X{{items.quantity}}</span>
                <span style="color:#ccc">包装:{{items.specName}}</span>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
import { getOrderList, updateOrderManage } from "../../api/api";

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
      imgBaseUrl: "/BeerApp/oss/getFile?id=",
      listLoading: false,
      dialogVisible: false,
      viewItem: {
        addressId: "",
        cargoList: [],
        createTime: "",
        id: "",
        message: "",
        price: "",
        state: "",
        userId: ""
      }
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getOrders();
    },
    getOrders() {
      let para = {
        pageItem: {
          page: this.page,
          size: 10
        },
        id: this.filters.orderid,
        state: this.filters.state
      };
      this.listLoading = true;
      getOrderList(para).then(res => {
        this.total = res.data.total;
        this.orders = res.data.list;
        this.listLoading = false;
        console.log(res.data);
      });
    },
    handleDeliver(index, row) {
      this.$confirm("确认发货吗？", "提示", {}).then(() => {
        let tradeId = row.id;
        console.log("发货", tradeId);
        updateOrderManage({ tradeId: tradeId }).then(res => {
          console.log(res);
          this.getOrders();
        });
      });
    },
    handleView(index, row) {
      this.viewItem = row;
      this.dialogVisible = true;
    }
  },
  mounted() {
    this.getOrders();
  }
};
</script>

<style>
.cargoList {
  height: 100px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.goodsImg {
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
}
.msgCover {
  width: calc(100% - 104px);
  padding: 10px 30px;
  display: flex;
  flex-direction: column;
}
.msg1 {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.msg2 {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>