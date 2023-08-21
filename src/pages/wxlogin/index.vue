<template>
  <div></div>
</template>

<script setup lang="ts">
// 获取用户信息
import { useRoute } from 'vue-router'
// 获取路由对象
let $route = useRoute()

// 持久化存储用户信息
localStorage.setItem("USERINFO",JSON.stringify($route.query))
// 此路由组件代码执行：授权成功
let html: any = document.querySelector('html')
html.style.display = 'none'
</script>

<style lang="less" scoped>
  
</style>