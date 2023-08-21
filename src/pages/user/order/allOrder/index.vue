<template>
  <!-- 展示全部订单 -->
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <h1>挂号订单</h1>
      </div>
    </template>
    <!-- 提供用户选择的下拉菜单 -->
    <el-form :inline="true">
      <el-form-item label="请选择就诊人">
        <el-select placeholder="请选择就诊人" v-model="patientId" @change="changeUser">
          <el-option label="请选择全部的就诊人" value=""></el-option>
          <el-option v-for="item in allUser" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select placeholder="请选择订单状态" v-model="orderStatus" @change="changeOrderState">
          <el-option label="全部订单" value=""></el-option>
          <el-option v-for="(item, index) in allOrderState" :key="index" :label="item.comment" :value="item.status">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 表格展示的订单数据 -->
    <el-table border style="margin: 10px 0;" :data="allOrderArr">
      <el-table-column label="就诊时间" prop="reserveDate"></el-table-column>
      <el-table-column label="医院" prop="hosname"></el-table-column>
      <el-table-column label="科室" prop="depname"></el-table-column>
      <el-table-column label="医生" prop="title"></el-table-column>
      <el-table-column label="服务费" prop="amount"></el-table-column>
      <el-table-column label="就诊人" prop="patientName"></el-table-column>
      <el-table-column label="订单状态" prop="param.orderStatusString"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button link type="primary" @click="goSetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper, ->, total, sizes"
      :total="total"
      @current-change="getOrderInfo"
      @size-change="handerSize"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入获取订单的请求方法
import { reqUserOrderInfo, reqAllUser, reqOrderState } from '@/api/user'
import { useRouter } from 'vue-router'

// 当前分页器处于的页码
let pageNo = ref<number>(1)
// 当前页码展示几条数据
let pageSize = ref<number>(10)
// 收集就诊人的ID
let patientId = ref<string>('')
// 订单的状态
let orderStatus = ref<string>('')
// 存储全部的订单
let allOrderArr = ref<any>()
// 存储订单的总个数
let total = ref<number>(0)
// 获取路由器对象
let $router = useRouter()
// 存储全部的就诊人信息
let allUser = ref<any>([])
// 存储全部的订单状态
let allOrderState = ref<any>([])

// 组件页面刚加载
onMounted(()=>{
  // 获取订单的方法
  getOrderInfo()
  // 获取全部就诊人的信息以及获取全部的订单状态
  getData()
})
// 获取订单的方法
const getOrderInfo = async (pager: number = 1) => {
  pageNo.value = pager
  let result: any = await reqUserOrderInfo(pageNo.value,pageSize.value,patientId.value,orderStatus.value)
  if (result.data.code == 200) {
    allOrderArr.value = result.data.data.records
    total.value = result.data.data.total
  }
}
// 详情按钮的回调
const goSetail = (row: any) => {
  $router.push({ path: '/user/order', query: { orderId: row.id } })
}
// 下拉菜单事件的回调
const handerSize = (pageSizes: number) => {
  pageSize.value = pageSizes
  // 再次发起请求获取数据
  getOrderInfo()
}
// 获取就诊人与订单状态的接口方法
const getData = async () => {
  // 获取全部的就诊人信息
  const result1: any = await reqAllUser()
  // 获取全部就诊人的信息以及获取全部的订单状态
  const result2: any = await reqOrderState()
  allUser.value = result1.data.data
  allOrderState.value = result2.data.data
}
// 下拉菜单回调方法
const changeUser = () => {
  getOrderInfo()
}
// 订单状态下拉菜单回调
const changeOrderState = () => {
  getOrderInfo()
}
</script>

<style lang="scss" scoped>
.box-card {
  margin: 20px;
}
</style>