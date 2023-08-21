<template>
  <div class="container">
    <h1 class="tip">确认挂号信息</h1>
    <el-card class="box-card">
      <!-- 卡片的头部 -->
      <template #header>
        <div class="card-header">
          <span>请选择就诊人</span>
          <el-button type="success" size="default" :icon="User" @click="goUser">添加就诊人</el-button>
        </div>
      </template>
      <!-- 卡片的身体部分要展示就诊人信息 -->
      <div class="user">
        <Visitor 
          @click="changeIndex(index)" 
          class="item" v-for="(user,index) in userArr" 
          :key="user.id" 
          :user="user"
          :index="index"
          :currentIndex="currentIndex"
      />
      </div>
    </el-card>
    <!-- 底部卡片：展示医生的信息 -->
    <el-card class="box-card">
      <!-- 卡片的头部 -->
      <template #header>
        <div class="card-header">
          <span>挂号信息</span>
        </div>
      </template>
      <!-- 卡片的身体部分：展示医生的信息 -->
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">就诊日期:</div>
          </template>
          {{ docInfo.workDate }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">就诊医院:</div>
          </template>
          {{ docInfo.param?.hosname }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">就诊科室:</div>
          </template>
          {{ docInfo.param?.depname }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">医生姓名:</div>
          </template>
          {{ docInfo.docname }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">医生职称:</div>
          </template>
          {{ docInfo.title }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">医生专长:</div>
          </template>
          {{ docInfo.skill }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">医生服务费:</div>
          </template>
          <span style="color: red">{{ docInfo.amount }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <!-- 确定挂号按钮 -->
    <div class="btn">
      <el-button 
        type="primary" 
        size="default" 
        :disabled="currentIndex == -1 ? true : false"
        @click="submitOrder"
      >
        确认挂号
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { User } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';
// 引入获取就诊人信息接口
import { reqGetUser, reqDoctorInfo } from '@/api/hospital';
// 引入确认挂号获取数据的接口函数
import { reqSubmitOrder } from '@/api/user';
// 导入就诊人组件
import { ElMessage } from 'element-plus';

// 获取路由对象
let $route = useRoute()
// 获取路由器对象
let $router = useRouter()
// 存储全部的就诊人信息
let userArr = ref<any>([])
// 存储医生的信息
let docInfo = ref<any>({})
// 存储用户确定就诊人的索引值
let currentIndex = ref<number>(-1)

// 组件挂载完毕获取数据
onMounted(()=>{
  // 获取就诊人信息
  fetchUserData()
  // 获取医生的信息
  fetchDoctor()
})
// 获取就诊人信息
const fetchUserData = async () => {
  // 获取就诊人信息，如果没有信息说明该账号本身没有注册信息，需要先注册几个
  let result: any = await reqGetUser()
  if(result.data.code == 200) {
    userArr.value = result.data.data
  }
}
// 获取医生的信息
const fetchDoctor = async () => {
  let result: any = await reqDoctorInfo($route.query.docId as string)
  if(result.data.code == 200) {
    docInfo.value = result.data.data
  }
}
// 点击就诊人子组件的回调
const changeIndex = (index: number) => {
  // 存储当前用户选中就诊人信息索引值
  currentIndex.value = index
}
// 确认挂号按钮的回调
const submitOrder = async () => {
  // 医院编号
  let hoscode = docInfo.value.hoscode
  // 医生的ID
  let scheduleId = docInfo.value.id
  // 就诊人的ID
  let patientId = userArr.value[currentIndex.value].id
  // 提交订单
  let result: any = await reqSubmitOrder(hoscode,scheduleId,patientId)
  if(result.data.code == 200) {
    $router.push({ path: '/user/order', query: {orderId: result.data.data} })
  }else{
    ElMessage({
      type: 'error',
      message: result.message
    })
  }
}
// 预约挂号添加就诊人按钮的方法
const goUser = () => {
  // 路由跳转
  $router.push({ path: '/user/patient',query: {type:'add'}})
}
</script>

<style lang="scss" scoped>
.container {
  .tip {
    margin: 20px 0 0;
    font-weight: 900;
    color: #7f7f7f;
    font-size: 20px;
  }

  .box-card {
    margin: 20px 0;
    cursor: pointer;
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .user {
      display: flex;
      flex-wrap: wrap;

      .item {
        width: 32%;
        margin: 5px;
      }
    }
  }
  .btn {
    display: flex;
    justify-content: center;
    margin: 10px 0;
  }
}
</style>