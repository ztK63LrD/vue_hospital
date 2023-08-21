<template>
  <div class="region">
    <div class="content">
      <div class="left">地区:</div>
      <ul>
        <li :class="{active:activeFlag == ''}" @click="changeLevel('')">全部</li>
        <li 
          v-for="item in RegionArr" 
          :class="{active:activeFlag == item.value}" 
          :key="item.value" 
          @click="changeLevel(item.value)">
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reqHospitalLevelAndRegion } from '@/api/home'
import { ref, onMounted } from 'vue'

// 存储地区的数据
let RegionArr = ref<any>([])
// 控制医院等级高亮的响应式数据
let activeFlag = ref<string>('')
// 地区组件刚挂载完毕获取地区数据
onMounted(()=>{
  getRegion()
})
// 获取地区数据
const getRegion = async () => {
  let result: any = await reqHospitalLevelAndRegion("Beijin")
  if(result.data.code == 200) {
    RegionArr.value = result.data.data
  }
}
// 点击等级的按钮回调
const changeLevel = (region: string) => {
  // 高亮响应式数据存储level数值
  activeFlag.value = region
  // 给父组件传递区域的参数
  $emit('getRegion',region)
}
let $emit = defineEmits(['getRegion'])
</script>

<style lang="scss" scoped>
.region {
  color: #7f7f7f;
  margin-top: 10px;
  .content {
    display: flex;
    .left {
      margin-right: 10px;
      width: 40px;
      flex-shrink: 0; /* 添加此行,阻止宽度改变 */
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        margin-right: 10px;
        margin-bottom: 10px;
        &.active {
          color: #55a6fe;
          cursor: pointer;
        }
        &:hover {
          color: #55a6fe;
          cursor: pointer; 
        }
      }
    }
  }
}
</style>