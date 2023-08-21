<template>
  <div class="tip">
    <!-- 常见科室的结构 -->
    <div class="deparment">
      <div class="header">
        <div class="left">
          <SvgIcon name="Department" color="#ff0000"></SvgIcon>
          <span>常见科室</span>
        </div>
        <div class="right">
          <span>全部</span>
          <SvgIcon name="arrow"></SvgIcon>
        </div>
      </div>
      <div class="content">
        <ul>
          <li>神经内科</li>
          <li>消化内科</li>
          <li>呼吸内科</li>
          <li>内科</li>
          <li>神经外科</li>
          <li>妇科</li>
          <li>产科</li>
          <li>儿科</li>
        </ul>
      </div>
    </div>
    <!-- 平台公告 -->
    <div class="notice">
      <div class="header">
        <div class="left">
          <SvgIcon name="platform" color="#DB7093"></SvgIcon>
          <span>平台公告</span>
        </div>
        <div class="right">
          <span>全部</span>
          <SvgIcon name="arrow"></SvgIcon>
        </div>
      </div>
      <div class="content">
        <ul>
          <li>关于北京某医院放假的相关通知。</li>
          <li>关于北京某医院放假的相关通知。</li>
          <li>关于北京某医院放假的相关通知。</li>
        </ul>
      </div>
    </div>
    <!-- 停诊公告 -->
    <div class="notice">
      <div class="header">
        <div class="left">
          <SvgIcon name="close"></SvgIcon>
          <span>停诊公告</span>
        </div>
        <div class="right">
          <span>全部</span>
          <SvgIcon name="arrow"></SvgIcon>
        </div>
      </div>
      <div class="content">
        <ul>
          <li>关于北京某医院上班的相关通知。</li>
          <li>关于北京某医院上班的相关通知。</li>
          <li>关于北京某医院上班的相关通知。</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.tip {
  color: #7f7f7f;
  .deparment {
    .header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        span {
          margin-left: 5px;
        }
      }
      .right {
        display: flex;
        align-items: center;
      }
    }
    .content {
      ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        li {
          width: 40%;
          margin-top: 20px;
        }
      }
    }
  }
  .notice {
    margin-top: 20px;
    .header {
      display: flex;
      justify-content: space-between;
    }
    .right {
      display: flex;
      align-items: center;
    }
    .content {
      ul {
        li {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top: 18px;
        }
      }
    }
  }
}
</style>