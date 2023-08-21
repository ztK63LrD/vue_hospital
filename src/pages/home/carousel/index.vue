<template>
  <!-- 首页轮播图的结构 -->
  <el-carousel height="350px">
    <el-carousel-item v-for="item in 4" :key="item">
      <img src="../../../assets/images/web-banner-1.png" alt="轮播图片" />
    </el-carousel-item>
  </el-carousel>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
img {
  width: 100%;
  height: 350px;
}
</style>