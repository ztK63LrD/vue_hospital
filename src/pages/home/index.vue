<template>
  <div>
    <!-- 首页轮播图结构 -->
    <Carousel></Carousel>
    <!-- 首页搜索医院的表单区域 -->
    <Search></Search>
    <!-- 底部展示医院的结构 -->
    <el-row :gutter="20">
      <el-col :span="20">
        <!-- 等级子组件 -->
        <Level @getLevel="getLevel"></Level>
        <!-- 地区子组件 -->
        <Region @getRegion="getRegion"></Region>
        <!-- 展示医院结构 -->
        <div class="hospital" v-if="hasHospitalArr.length > 0">
          <Card class="item" v-for="(item,index) in hasHospitalArr" :key="index" :hospitalInfo="item"></Card>
        </div>
        <el-empty v-else description="暂无数据"></el-empty>
        <!-- 分页器 -->
        <el-pagination 
          v-model:current-page="pageNo" 
          v-model:page-size="pageSize" 
          :page-sizes="[8, 16, 32, 64]"
          :background="true" 
          layout="prev, pager, next, jumper, ->, sizes, total" 
          :total="total"
          @current-change="getHospitalInfo"
          @size-change="sizeChange"
        />
      </el-col>
      <el-col :span="4">
        <Tip></Tip>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入接口函数
import { reqHospital } from '@/api/home'
// 引入接口类型
import type { Content } from '@/api/home/type'
// 引入首页轮播图组件
import Carousel from './carousel/index.vue'
// 引入搜索框组件
import Search from './search/index.vue'
// 引入首页等级的组件
import Level from './level/index.vue'
// 引入首页地区组件
import Region from './region/index.vue'
// 展示医院新的卡片组件
import Card from './card/index.vue'
// 常见科室静态搭建
import Tip from './tip/index.vue'

// 当前的页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(8)
// 存储已有的医院数据
let hasHospitalArr = ref<Content>([])
// 存储医院总数
let total = ref<number>(0)
// 存储医院的等级相应数据
let hostype = ref<string>('')
// 存储医院的地区
let districtCode = ref<string>('')

// 组件挂载完毕，发一次请求
onMounted(()=>{
  getHospitalInfo()
})
// 获取已有的医院数据
const getHospitalInfo = async () => {
  let result: any = await reqHospital(pageNo.value, pageSize.value, hostype.value, districtCode.value)
  if (result.status == 200) {
    // 存储已有的医院数据
    hasHospitalArr.value = result.data.data.content
    // 存储医院的总个数
    total.value = result.data.data.totalElements
  }
}
// 分页器下拉菜单发生变化时触发
const sizeChange = () => {
  getHospitalInfo()
}
// 子组件自定义事件，获取儿子给父组件传递的等级参数
const getLevel = (level: string) => {
  // 收集等级参数
  hostype.value = level
  // 再次发起请求
  getHospitalInfo()
}
// 子组件的自定义事件，获取子组件传递过来的地区参数
const getRegion = (region: string) => {
  // 存储地区的参数
  districtCode.value = region
  getHospitalInfo()
}
</script>

<style lang="scss" scoped>
.hospital {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .item {
    width: 48%;
    margin: 10px 0;
  }
}
</style>