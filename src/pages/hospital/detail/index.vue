<template>
  <div class="detail">
    <!-- 医院名字与医院等级的结构 -->
    <div class="top">
      <div class="name">{{ hospitalStore.hospitalInfo.hospital?.hosname }}</div>
      <div class="level">
        <SvgIcon name="Like" color="#ff0000"></SvgIcon>
        <span>{{ hospitalStore.hospitalInfo.hospital?.param.hostypeString }}</span>
      </div>
    </div>
    <!-- 医院的logo与路线 -->
    <div class="logo">
      <div class="left">
        <img :src="`data:image/jpeg;base64,${hospitalStore.hospitalInfo.hospital?.logoData}`" alt="logo图片">
      </div>
      <div class="right">
        <div class="address">
          <SvgIcon name="position" color="#0000ff" class="icon"></SvgIcon>
          <span>具体位置:{{ hospitalStore.hospitalInfo.hospital?.param.fullAddress }}</span>
          <div class="route">规划路线:{{ hospitalStore.hospitalInfo.hospital?.route }}</div>
        </div>
      </div>
    </div>
    <!-- 医院介绍 -->
    <div class="footer">
      <h1>医院介绍</h1>
      <p>{{ hospitalStore.hospitalInfo.hospital?.intro }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 获取医院详情仓库数据进行展示
import useDetailStore from '@/store/modules/hospitalDetail'
let hospitalStore = useDetailStore()
</script>

<style lang="scss" scoped>
.detail {
  .top {
    display: flex;
    .name {
      margin-top: 10px;
      font-size: 25px;
      font-weight: 600;
    }
    .level {
      margin-top: 5px;
      color: #7f7f7f;
      margin-left: 10px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      span {
        margin-left: 5px;
      }
    }
  }
  .logo {
    display: flex;
    margin-top: 20px;
    .left {
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
    }
    .right {
      margin-left: 10px;
      color: #7f7f7f;
      .icon {
        margin-left: -5px;
      }
      div {
        margin: 10px;
      }
    }
  }
  .footer {
    color: #7f7f7f;
    margin-top: 80px;
    p {
      margin-top: 10px;
      line-height: 30px;
    }
  }
} 
</style>