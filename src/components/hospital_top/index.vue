<template>
  <div class="top">
    <div class="content">
      <!-- 左侧 -->
      <div class="left" @click="goHome">
        <img src="../../assets/images/logo.jpg" alt="医院图标">
        <p>医院预约系统平台</p>
      </div>
      <div class="right">
        <p class="help">帮助中心</p>
        <!-- 如果没有用户名字：显示登录注册 -->
        <p class="login" @click="login" v-if="!userStore.userInfo.name">登录/注册</p>
        <!-- 如果有用户信息展示用户信息 -->
        <el-dropdown v-else>
          <span class="el-dropdown-link">
            {{ userStore.userInfo.name }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goUser('/user/certification')">实名认证</el-dropdown-item>
              <el-dropdown-item @click="goUser('/user/order')">挂号订单</el-dropdown-item>
              <el-dropdown-item @click="goUser('/user/patient')">就诊人管理</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入箭头组件
import { ArrowDown } from '@element-plus/icons-vue'
// 获取user仓库的数据(visiable)可以控制login组件的对话框显示与隐藏
import useUserStore from '@/store/modules/user'
// 引入路由器
import { useRouter } from 'vue-router';
let userStore = useUserStore()
let $router = useRouter()
const goHome = () => {
  $router.push({ path: '/' })
}
// 点击登录与注册按钮时弹出对话框
const login = () => {
  userStore.visiable = true
}
// 退出登录按钮的回调
const logout = () => {
  // 通知pinpa仓库清除用户相关信息
  userStore.logout()
  // 编程式路由导航跳转到首页
  $router.push({ path: '/home' })
}
// 点击顶部的下拉菜单进行路由的跳转
const goUser = (path: string) => {
  $router.push({ path: path })
}
</script>

<style lang="scss" scoped>
.top {
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 70px;
  background: #b1bde2;
  display: flex;
  justify-content: center;

  .content {
    width: 80%;
    height: 70px;
    display: flex;
    justify-content: space-between;

    .left {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      img {
        width: 70px;
        height: 50px;
        margin-right: 10px;
      }

      p {
        font-size: 20px;
        color: rgb(120, 3, 3);
      }
    }

    .right {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      color: #fff;

      .help {
        margin-right: 10px;

        &:hover {
          color: red;
          cursor: pointer;
        }
      }

      .login {
        &:hover {
          color: rgb(3, 105, 40);
          cursor: pointer;
        }
      }
    }
  }
}</style>