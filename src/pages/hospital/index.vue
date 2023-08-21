<template>
  <div class="hospital">
    <!-- 左侧导航区域 -->
    <div class="left">
      <div class="top">
        <el-icon><HomeFilled /></el-icon>
        <span>/ 医院详细信息</span>
      </div>
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        :router="true"
      >
        <el-menu-item index="/hospital/register">
          <el-icon><icon-menu /></el-icon>
          <span>预约挂号</span>
        </el-menu-item>
        <el-menu-item index="/hospital/detail">
          <el-icon><document /></el-icon>
          <span>医院详情</span>
        </el-menu-item>
        <el-menu-item index="/hospital/notice">
          <el-icon><setting /></el-icon>
          <span>预约通知</span>
        </el-menu-item>
        <el-menu-item index="/hospital/close">
          <el-icon><InfoFilled /></el-icon>
          <span>停诊信息</span>
        </el-menu-item>
        <el-menu-item index="/hospital/search">
          <el-icon><Search /></el-icon>
          <span>查询/取消</span>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 右侧内容展示区域：路由组件展示位置 -->
    <div class="right">
      <!-- 子组件展示结构地方 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useDetailStore from '@/store/modules/hospitalDetail'
// 左侧菜单所使用的图标
import { Document, Menu as IconMenu, Setting, InfoFilled, Search, HomeFilled} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';
// 获取当前的路由信息
let $route = useRoute()
// 获取仓库对象
let detailStore = useDetailStore()

// 组件挂载完毕，通知pinia仓库发起请求获取医院详情数据，存储仓库当中
onMounted(()=>{
  // 获取医院详情的数据
  detailStore.getHospital($route.query.hoscode as string)
  // 获取某一个科室的数据
  detailStore.getDeparment($route.query.hoscode as string)
})
</script>

<style lang="scss" scoped>
.hospital {
  display: flex;
  .left {
    flex: 2; // 左侧占总区域的2份
    display: flex;
    flex-direction: column;
    align-items: center;
    span {
      margin-right: 60px;
    }
    .top {
      color: #7f7f7f;
    }
  }
  .right {
    flex: 8; // 右侧占总区域的8份
  }
}
</style>