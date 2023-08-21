<template>
  <div class="register">
    <div class="top">
      <div class="title">{{ hospitalStore.hospitalInfo.hospital?.hosname }}</div>
      <div class="level">
        <SvgIcon name="Like" color="#ff0000"></SvgIcon>
        <span>{{ hospitalStore.hospitalInfo.hospital?.param.hostypeString }}</span>
      </div>
    </div>
    <!-- 展示内容区域 -->
    <div class="content">
      <div class="left">
        <img :src="`data:image/jpeg;base64,${hospitalStore.hospitalInfo.hospital?.logoData}`" alt="logo图片">
      </div>
      <div class="right">
        <div>挂号规则</div>
        <div class="time">
          预约周期:10天&nbsp;&nbsp;放号时间:{{ hospitalStore.hospitalInfo.bookingRule?.releaseTime }}&nbsp;&nbsp;停挂时间:{{
            hospitalStore.hospitalInfo.bookingRule?.stopTime }}
        </div>
        <div class="address">
          具体位置:{{ hospitalStore.hospitalInfo.hospital?.param.fullAddress }}
        </div>
        <div class="route">
          具体路线:{{ hospitalStore.hospitalInfo.hospital?.route }}
        </div>
        <div class="releaseTime">
          退号时间:就诊前——工作日{{ hospitalStore.hospitalInfo.bookingRule?.quitTime }}前取消
        </div>
        <div class="role">预约挂号规则</div>
        <div class="ruleInfo" v-for="(item, index) in hospitalStore.hospitalInfo.bookingRule?.rule" :key="index">
          {{ item }}
        </div>
      </div>
    </div>
    <!-- 放置每一个医院的科室的数据 -->
    <div class="deparment" v-if="hospitalStore.deparmentArr.length > 0">
      <div class="leftNav">
        <ul>
          <li @click="changeIndex(index)" v-for="(deparment, index) in hospitalStore.deparmentArr"
            :key="deparment.depcode" :class="{ active: index == currentIndex }">
            {{ deparment.depname }}
          </li>
        </ul>
      </div>
      <div class="deparmentInfo">
        <!-- 用一个div代表:大科室与小科室 -->
        <div class="showDeparment" v-for="deparment in hospitalStore.deparmentArr" :key="deparment.depcode">
          <h1 class="cur">{{ deparment.depname }}</h1>
          <!-- 每一个大的科室下小科室 -->
          <ul>
            <li @click="showLogin(item)" v-for="item in deparment.children" :key="item.depcode">
              {{ item.depname }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
//引入医院详情仓库的数据
import useDetailStore from "@/store/modules/hospitalDetail";
// 获取user仓库的数据(visiable)可以控制login组件的对话框显示与隐藏
let hospitalStore = useDetailStore();
// 获取路由器和路由对象
let $router = useRouter()

//控制科室高亮的响应式数据
let currentIndex = ref<number>(0);
//左侧大的科室点击的事件
const changeIndex = (index: number) => {
  currentIndex.value = index;
  //点击导航获取右侧科室(大的科室H1标题)
  let allH1 = document.querySelectorAll(".cur");
  //滚动到对应科室的位置
  allH1[currentIndex.value].scrollIntoView({
    behavior: "smooth", //过渡动画效果
    block: "start", //滚动到位置 默认起始位置
  });
};
// 点击科室按钮的回调
const showLogin = (item: any) => {
  // 点击某一个医院科室按钮，进入相应的预约挂号详情页面
  $router.push({ path: '/hospital/register_step1', query: {hoscode: hospitalStore.hospitalInfo.hospital?.hoscode, depcode: item.depcode} })
}
</script>

<style lang="scss" scoped>
.register {
  .top {
    display: flex;

    .title {
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

  .content {
    display: flex;
    margin-top: 30px;

    .left {
      width: 80px;

      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
    }

    .right {
      flex: 1;
      margin-left: 20px;
      font-size: 14px;

      .time,
      .address,
      .route,
      .releaseTime,
      .ruleInfo {
        margin-top: 10px;
        color: #7f7f7f;
      }

      .role {
        margin-top: 10px;
      }
    }
  }
  .deparment {
    width: 100%;
    height: 500px;
    display: flex;
    margin-top: 20px;
    .leftNav {
      width: 80px;
      height: 100%;
      ul {
        width: 100%;
        height: 100%;
        background: rgb(248, 248, 248);
        display: flex;
        flex-direction: column;
        li {
          flex: 1;
          text-align: center;
          color: #7f7f7f;
          font-size: 14px;
          cursor: pointer;
          line-height: 40px;
          &.active {
            border-left: 1px solid red;
            color: red;
            background: white;
          }
        }
      }
    }
    .deparmentInfo {
      flex: 1;
      margin-left: 20px;
      height: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .showDeparment {
        h1 {
          background-color: rgb(248, 248, 248);
          color: #7f7f7f;
        }
        ul {
          display: flex;
          flex-wrap: wrap;
          li {
            color: #7f7f7f;
            width: 33%;
            line-height: 30px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>