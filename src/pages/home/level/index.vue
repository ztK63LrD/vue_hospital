<template>
  <div class="level">
    <h1>医院</h1>
    <div class="content">
      <div class="left">等级:</div>
      <ul class="hospital">
        <li :class="{active:activeFlag == ''}" @click="changeLevel('')">全部</li>
        <li 
          v-for="level in levelArr" 
          :class="{active:activeFlag == level.value}" 
          :key="level.value" 
          @click="changeLevel(level.value)">
          {{ level.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入接口函数
import { reqHospitalLevelAndRegion } from '@/api/home'
import type { HospitalLevelAndRegionArr } from '@/api/home/type'

// 定义一个数组存储医院等级的数据
let levelArr = ref<HospitalLevelAndRegionArr>([])
// 控制医院等级高亮的响应式数据
let activeFlag = ref<string>('')
// 组件挂载完毕
onMounted(()=>{
  getLevel()
})
// 获取医院等级的数据
const getLevel = async () => {
  let result: any = await reqHospitalLevelAndRegion('HosType')
  if(result.data.code == 200) {
    levelArr.value = result.data.data
  }
}
// 点击等级的按钮回调
const changeLevel = (level: string) => {
  // 高亮响应式数据存储level数值
  activeFlag.value = level
  // 触发自定义事件,将医院等级参数回传给父组件
  $emit('getLevel',level)
}
let $emit = defineEmits(['getLevel'])
</script>

<style lang="scss" scoped>
.level {
  color: #7f7f7f;
  h1 {
    font-weight: 900;
    margin: 10px 0;
  }
  .content {
    display: flex;
    .left {
      margin-right: 10px;
      width: 40px;
      flex-shrink: 0; /* 添加此行,阻止宽度改变 */
    }
    .hospital {
      display: flex;
      li {
        margin-right: 10px;
        &.active {
          color: #55a6fe;
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