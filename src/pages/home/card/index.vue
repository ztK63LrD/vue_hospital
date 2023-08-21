<template>
  <el-card class="box-card" shadow="hover" @click="goDetail">
    <div class="content">
      <div class="left">
        <div class="hospital">{{ hospitalInfo.hosname }}</div>
        <div class="tip">
          <div class="level">
            <SvgIcon name="Like"></SvgIcon>
            <span>{{ hospitalInfo.param.hostypeString }}</span>
          </div>
          <div class="time">
            <SvgIcon name="time" color="#008c8c"></SvgIcon>
            <span>每天{{ hospitalInfo.bookingRule.releaseTime }}放号</span>
          </div>
        </div>
      </div> 
      <div class="right">
        <img :src="`data:image/jpeg;base64,${hospitalInfo.logoData}`" alt="logo图片" />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
// 创建路由器对象
let $router = useRouter()
// 点击医院卡片跳转到详情页
const goDetail = () => {
  // 点击推荐项，进入医院详情页，将来需要携带query参数(医院的编码)
  $router.push({ path: '/hospital', query: { hoscode: props.hospitalInfo.hoscode } })
}
// 接收父组件传递过来的props，即为已有的医院数据
let props = defineProps(['hospitalInfo'])
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  justify-content: space-between;
  .right {
    img {
      border-radius: 50%;
      width: 60px;
      height: 50px;
    }
  }
  .left {
    width: 60%;
    .tip {
      color: #7f7f7f;
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      .level, .time {
        display: flex;
        align-items: center;
        span {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>