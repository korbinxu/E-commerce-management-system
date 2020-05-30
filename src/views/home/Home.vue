<template>
  <el-container class="home-container">
    <!-- 头部区-->
    <el-header>
      <div>
        <img src="../../assets/logo/feng.png" height="60" alt />
        <span>峰峰商场管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主题区域 -->
    <el-container>
      <!-- 左边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="taggle-button" @click="taggleButton">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="$route.path"
        >
          <!-- 一级菜单 index为字符串 +""转化字符串-->
          <el-submenu :index="item.id + ''" v-for="(item,index) in menulist" :key="item.id">
            <!-- 模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[index]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 2级菜单  el-menu加了router后 index为跳转的路径 -->
            <el-menu-item
              :index=" '/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <!-- 模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容区 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: "Home",
  data() {
    return {
      menulist: [],
      iconObj: {
        // 先放基类 再放图片的类
        "0": "iconfont icon-yonghuguanli",
        "1": "iconfont icon-quanxian",
        "2": "iconfont icon-shangpinguanlix",
        "3": "iconfont icon-dingdanguanli",
        "4": "iconfont icon-icon-test"
      },
      isCollapse: false
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取左侧菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
    },
    taggleButton() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>
<style lang="less" scoped>
.home-container {
  height: 100vh;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 5px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background: #eaedf1;
}

.taggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>