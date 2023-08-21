<template>
  <div class="user">
    <!-- 左侧显示导航区域 -->
    <div class="menu">
      <div class="top">
        <el-icon><HomeFilled /></el-icon>
        <span>/&nbsp;&nbsp;会员中心</span>
      </div>
      <el-menu
        :default-active="$route.path" 
        class="el-menu-vertical-demo"
        :router="true"
      >
        <el-menu-item index="/user/certification">
          <el-icon><Postcard /></el-icon>
          <span>实名认证</span>
        </el-menu-item>
        <el-menu-item index="/user/order">
          <el-icon><OfficeBuilding /></el-icon>
          <span>挂号订单</span>
        </el-menu-item>
        <el-menu-item index="/user/patient">
          <el-icon><CoffeeCup /></el-icon>
          <span>就诊人管理</span>
        </el-menu-item>
        <el-menu-item index="/user/profile">
          <el-icon><Printer /></el-icon>
          <span>账号信息</span>
        </el-menu-item>
        <el-menu-item index="/user/feedback">
          <el-icon><setting /></el-icon>
          <span>一键反馈</span>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 右侧展示会员中心二级路由组件区域 -->
    <div class="content">
      <!-- 二级路由组件出口位置 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HomeFilled, Postcard, OfficeBuilding, CoffeeCup, Printer, Setting } from '@element-plus/icons-vue'

</script>

<style lang="scss" scoped>
.user {
  display: flex;
  .menu {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .content {
    flex: 8;
  }
}
</style>