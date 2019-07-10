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
      <el-table-column prop="price" label="支付金额(元)" sortable></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
      <el-table-column prop="stateName" label="订单状态" sortable></el-table-column>
      <el-table-column prop="typeName" label="收货方式" sortable></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleView(scope.$index, scope.row)">查看</el-button>
          <el-button
            size="small"
            type="primary"
            @click="handleDeliver(scope.$index, scope.row)"
            v-if="scope.row.state == 2"
          >发货</el-button>
          <el-button
            size="small"
            type="warning"
            @click="handleRefund(scope.$index, scope.row)"
            v-if="scope.row.state == 0"
          >退款</el-button>
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

    <!-- 查看 -->
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" title="订单查看">
      <el-form :model="viewItem" label-width="100px">
        <el-form-item label="订单编号">
          <span>{{viewItem.id}}</span>
        </el-form-item>
        <el-form-item label="支付金额">
          <span>{{viewItem.price}}(元)</span>
        </el-form-item>
        <el-form-item label="下单时间">
          <span>{{viewItem.createTime}}</span>
        </el-form-item>
        <el-form-item label="收货人" v-if="viewItem.type==1">
          <span>{{viewItem.receiver}}</span>
        </el-form-item>
        <el-form-item label="联系电话" v-if="viewItem.type==1">
          <span>{{viewItem.phone}}</span>
        </el-form-item>
        <el-form-item label="收货地址" v-if="viewItem.type==1">
          <span>{{viewItem.address}}</span>
        </el-form-item>
        <el-form-item label="收货方式">
          <span>{{viewItem.type == 1 ? '配送':'自提'}}</span>
        </el-form-item>
        <el-form-item label="买家留言" v-if="viewItem.type==1">
          <span>{{viewItem.message}}</span>
        </el-form-item>
        <el-form-item label="货物清单">
          <div v-for="(items,index) in viewItem.cargoList" v-bind:key="index" class="cargoList">
            <!-- <img :src="imgBaseUrl+items.img" alt class="goodsImg" /> -->
            <el-image
              :src="imgBaseUrl+items.img"
              @click="preview(imgBaseUrl+items.img)"
              class="goodsImg"
            >
              <div slot="placeholder" class="image-slot">
                加载中
                <span class="dot">...</span>
              </div>
            </el-image>
            <div class="msgCover">
              <div>{{items.cargoName}}</div>
              <div style="color:#ccc">包装:{{items.specName}}</div>
              <div class="msgs">
                <span style="color:#ef0007;font-weight:600">￥{{items.price}}</span>
                <span>X{{items.quantity}}</span>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="visible">
      <img width="100%" :src="imageUrl" alt />
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
import {
  getOrderList,
  updateOrderManage,
  refund,
  cancelOrder
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        orderid: "",
        state: ""
      },
      options: [
        {
          value: null,
          label: "全部"
        },
        {
          value: -2,
          label: "已删除"
        },
        {
          value: -1,
          label: "已取消"
        },
        {
          value: 0,
          label: "退款中"
        },
        {
          value: 1,
          label: "待付款"
        },
        {
          value: 2,
          label: "待发货"
        },
        {
          value: 3,
          label: "待收货"
        },
        {
          value: 4,
          label: "待评价"
        },
        {
          value: 5,
          label: "已完成"
        }
      ],
      map: new Map(),
      orders: [],
      total: 0,
      page: 1,
      size: 10,
      imgBaseUrl: "/BeerApp/oss/getFile?id=",
      listLoading: false,
      dialogVisible: false,
      viewItem: {},
      imageUrl: "",
      visible: false
    };
  },
  methods: {
    //预览图
    preview(img) {
      console.log(img);
      this.imageUrl = img;
      this.visible = true;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getOrders();
    },
    handleSizeChange(val) {
      this.size = val;
      this.getOrders();
    },
    getOrders() {
      let para = {
        pageItem: {
          page: this.page,
          size: this.size
        },
        id: this.filters.orderid,
        state: this.filters.state
      };
      this.listLoading = true;
      getOrderList(para).then(res => {
        this.total = res.data.total;
        for (let i of res.data.list) {
          i.stateName = this.map.get(i.state);
          i.typeName = i.type == 1 ? "配送" : "自提";
        }
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
    handleRefund(index, row) {
      console.log("退款", row);
      this.$confirm("确认退款吗？", "提示", {}).then(() => {
        refund({ tradeId: row.id, total_fee: row.price * 100 }).then(res => {
          cancelOrder({ tradeId: row.id }).then(resp => {
            console.log(resp);
            this.getOrders();
          });
        });
      });
    },
    handleView(index, row) {
      this.viewItem = row;
      this.dialogVisible = true;
      //获取收货地址
    }
  },
  mounted() {
    for (let i of this.options) {
      this.map.set(i.value, i.label);
    }
    this.getOrders();
    console.log(this.map);
  }
};
</script>

<style>
.cargoList {
  height: auto;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
.cargoList div {
  line-height: 30px;
}
.goodsImg {
  width: 100px;
  height: 100px;
  margin-left: 10px;
  /* margin-top: 10px;
  align-self: flex-start; */
}
.msgCover {
  width: calc(100% - 112px);
  padding: 10px;
}
.msgs {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>