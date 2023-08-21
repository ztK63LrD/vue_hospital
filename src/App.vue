<template>
  <div class="container">
    <!-- 顶部的全局组件 -->
    <HospitalTop />
    <!-- 展示路由组件的区域 -->
    <div class="content">
      <!-- 展示路由组件的区域 -->
      <router-view></router-view>
    </div>
    <!--底部的全局组件 -->
    <HospitalBottom />
    <!-- 登录组件 -->
    <Login v-if="userStore.visiable"></Login>
  </div>
</template>

<script setup lang="ts">
// 引入用户仓库
import useUserStore from '@/store/modules/user';
let userStore = useUserStore()

</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;

  .content {
    padding: 70px 0px 70px;
    width: 80%;
  }
}
</style>