<template>
  <el-row class="container" id="newOrder">
    <el-col :span="24" class="header">
      <el-col
        :span="10"
        class="logo"
        :class="collapsed?'logo-collapse-width':'logo-width'"
      >{{collapsed?'':sysName}}</el-col>
      <el-col :span="8">
        <div class="tools" @click.prevent="collapse">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>
      <el-col :span="6" class="userinfo">
        <i
          class="el-icon-message-solid"
          style="font-size:20px;margin-right:10px;"
          v-if="msg"
          @click="bindMsg"
        ></i>
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner">
            <img :src="this.sysUserAvatar" />
            {{sysUserName}}
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item>我的消息</el-dropdown-item> -->
            <!-- <el-dropdown-item>设置</el-dropdown-item> -->
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <!--导航菜单-->
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo uncollapsed"
          unique-opened
          router
          v-show="!collapsed"
        >
          <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
            <el-submenu :index="index+''" v-if="!item.leaf">
              <template slot="title">
                <i :class="item.iconCls"></i>
                {{item.name}}
              </template>
              <el-menu-item
                v-for="child in item.children"
                :index="child.path"
                :key="child.path"
                v-if="!child.hidden"
              >{{child.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item v-if="item.leaf && item.children.length>0" :index="item.children[0].path">
              <i :class="item.iconCls"></i>
              {{item.children[0].name}}
            </el-menu-item>
          </template>
        </el-menu>
        <!--导航菜单-折叠后-->
        <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
          <li
            v-for="(item,index) in $router.options.routes"
            v-if="!item.hidden"
            class="el-submenu item"
          >
            <template v-if="!item.leaf">
              <div
                class="el-submenu__title"
                style="padding-left: 20px;"
                @mouseover="showMenu(index,true)"
                @mouseout="showMenu(index,false)"
              >
                <i :class="item.iconCls"></i>
              </div>
              <ul
                class="el-menu submenu"
                :class="'submenu-hook-'+index"
                @mouseover="showMenu(index,true)"
                @mouseout="showMenu(index,false)"
              >
                <li
                  v-for="child in item.children"
                  v-if="!child.hidden"
                  :key="child.path"
                  class="el-menu-item"
                  style="padding-left: 40px;"
                  :class="$route.path==child.path?'is-active':''"
                  @click="$router.push(child.path)"
                >{{child.name}}</li>
              </ul>
            </template>
            <template v-else>
              <li class="el-submenu">
                <div
                  class="el-submenu__title el-menu-item"
                  style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;"
                  :class="$route.path==item.children[0].path?'is-active':''"
                  @click="$router.push(item.children[0].path)"
                >
                  <i :class="item.iconCls"></i>
                </div>
              </li>
            </template>
          </li>
        </ul>
      </aside>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="breadcrumb-container">
            <strong class="title">{{$route.name}}</strong>
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">{{ item.name }}</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import { getPort } from "../api/api";
export default {
  data() {
    return {
      msg: false,
      showOrder: true,
      sysName: "笙啤后台管理系统",
      collapsed: false,
      sysUserName: "",
      sysUserAvatar: "",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  methods: {
    handleselect: function(a, b) {},
    //退出登录
    logout: function() {
      var _this = this;
      this.$confirm("确认退出吗?", "提示", {
        //type: 'warning'
      })
        .then(() => {
          sessionStorage.removeItem("user");
          _this.$router.push("/login");
        })
        .catch(() => {});
    },
    //折叠导航栏
    collapse: function() {
      this.collapsed = !this.collapsed;
    },
    showMenu(i, status) {
      this.$refs.menuCollapsed.getElementsByClassName(
        "submenu-hook-" + i
      )[0].style.display = status ? "block" : "none";
    },
    //点击消息
    bindMsg() {
      this.msg = false;
      this.showOrder = false;
      this.$router.push({ path: "/order" });
    },
    //播放
    playSound() {
      let musicUrl =
        "http://apollo-wms.oss-cn-zhangjiakou.aliyuncs.com/20190708124824.mp3?Expires=3139361304&OSSAccessKeyId=LTAIAhZv9N2cPpLq&Signature=g4hxwvnLn%2F4AzS7E6zLnTcouA0c%3D";
      var borswer = window.navigator.userAgent.toLowerCase();
      console.log(borswer);
      if (borswer.indexOf("ie") >= 0) {
        //IE内核浏览器
        var strEmbed = `<embed name="embedPlay" src='${musicUrl}' autostart="true" hidden="true" loop="false"></embed>`;
        if ($("body").find("embed").length <= 0) $("body").append(strEmbed);
        // document.getElementById('newOrder').appendChild(strEmbed);
        var embed = document.embedPlay;

        //浏览器不支持 audion，则使用 embed 播放
        embed.volume = 100;
        //embed.play();这个不需要
      } else {
        //非IE内核浏览器
        var strAudio = `<audio id='audioPlay' src='${musicUrl}' hidden='true'>`; // hidden='true'

        if ($("#audioPlay").length <= 0) {
          $("body").append(strAudio);
        }
        // console.log(document.getElementById('newOrder'))
        var audio = document.getElementById("audioPlay");
        //浏览器支持 audio
        audio.play();
      }
    },
    //ws服务器
    socketServer() {
      getPort().then(res => {
        console.log(res.data);
        let url = "ws://" + res.data + "/BeerManage/socketServer/ddd";
        const ws = new WebSocket(url);
        var that = this;
        // console.log(ws);
        ws.onopen = function() {
          console.log("连接websocket");
          that.$notify({
            title: "成功",
            message: "订单消息推送服务连接成功！",
            type: "success",
            duration: 2000
          });
        };
        // 接收消息时触发
        ws.onmessage = function(response) {
          console.log(response);
          if (response.data.code == 1000) {
            sessionStorage.removeItem("user");
            //其他地方登录、
            that
              .$confirm("当前账户已在其他地方登录！", "提示", {
                confirmButtonText: "确定",
                showCancelButton: false,
                closeOnClickModal: false,
                type: "warning"
              })
              .then(() => {
                that.$router.push("/login");
              })
              .catch(() => {
                that.$router.push("/login");
              });
          } else {
            that.msg = true;
            that.showOrder = true;
            that.$notify({
              title: "订单提示！",
              offset: 100,
              type: "warning",
              message: `您有新的订单,请及时处理`
            });
            that.playSound();
          }
        };
        ws.onclose = function() {
          console.log("连接断开");
          that.$notify({
            title: "错误",
            message: "服务器错误，无法接收实时订单消息",
            type: "error",
            duration: 0
          });
        };
      });
    }
  },
  mounted() {
    var user = sessionStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      this.sysUserName = user.name || "";
      this.sysUserAvatar = user.avatar || "";
      //获取ip端口
      this.socketServer();
    }
  }
};
</script>

<style scoped lang="scss">
@import "~scss_vars";
.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  .header {
    height: 60px;
    line-height: 60px;
    background: $color-primary;
    color: #fff;
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 10px 0px 10px 10px;
          float: right;
        }
      }
    }
    .logo {
      //width:230px;
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;
      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      }
      .txt {
        color: #fff;
      }
    }
    .logo-width {
      width: 230px;
    }
    .logo-collapse-width {
      width: 60px;
    }
    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }
  .main {
    display: flex;
    // background: #324057;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    aside {
      flex: 0 0 230px;
      width: 230px;
      // position: absolute;
      // top: 0px;
      // bottom: 0px;
      .el-menu {
        height: 100%;
      }
      .collapsed {
        width: 60px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0px;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }
      }
      .uncollapsed {
        width: 230px !important;
      }
    }
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
    }
    .content-container {
      // background: #f1f2f7;
      flex: 1;
      // position: absolute;
      // right: 0px;
      // top: 0px;
      // bottom: 0px;
      // left: 230px;
      overflow-y: scroll;
      padding: 20px;
      .breadcrumb-container {
        //margin-bottom: 15px;
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
        padding: 40px 20px;
      }
    }
  }
}
</style>