<template>
  <!-- 就诊人组件静态结构 -->
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>就诊人管理</span>
        <el-button class="button" type="success" :icon="User" @click="addUser">添加就诊人</el-button>
      </div>
    </template>
    <!-- 就诊人管理模块展示就诊人信息的结构 -->
    <div class="visitor" v-if="scene == 0">
      <Visitor 
        @changeScene="changeScene" 
        @removeUser="removeUser"
        class="item" v-for="(user,index) in userArr" 
        :key="user.id" 
        :user="user" 
        :index="index" 
      />
    </div>
    <!-- 添加就诊人|修改已有的就诊人信息的结构 -->
    <div class="form" v-if="scene == 1">
      <el-divider content-position="left">就诊人信息</el-divider>
      <el-form style="width: 60%;margin: 10px auto">
        <el-form-item label="用户姓名">
          <el-input placeholder="请输入用户姓名" v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item label="证件类型">
          <el-select placeholder="请你选择证件类型" style="width: 100%;" v-model="userParams.certificatesType">
            <el-option v-for="item in certationArr" :key="item.id" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码">
          <el-input placeholder="请输入证件号码" v-model="userParams.certificatesNo"></el-input>
        </el-form-item>
        <el-form-item label="用户性别">
          <el-radio-group v-model="userParams.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker 
            type="date" 
            v-model="userParams.birthdate" 
            placeholder="请选择出生日期"
            value-format="YYYY-MM-DD"
          >
        </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input placeholder="请输入用户手机号码" v-model="userParams.phone"></el-input>
        </el-form-item>
      </el-form>
      <el-divider content-position="left">建档信息（完善后部分医院首次就诊不排队建档）</el-divider>
      <el-form style="width: 60%; margin: 10px auto">
        <el-form-item label="婚姻状况">
          <el-radio-group v-model="userParams.isMarry">
            <el-radio :label="1">已婚</el-radio>
            <el-radio :label="0">未婚</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自费/医保">
          <el-radio-group v-model="userParams.isInsure">
            <el-radio :label="1">自费</el-radio>
            <el-radio :label="0">医保</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="当前的住址">
          <el-cascader :props="props" v-model="userParams.addressSelected" />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input
            placeholder="请你输入用户详细地址"
            v-model="userParams.address"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-divider content-position="left">联系人信息（选填）</el-divider>
      <el-form style="width: 60%; margin: 10px auto" label-width="80">
        <el-form-item label="用户姓名">
          <el-input
            placeholder="请你输入用户姓名"
            v-model="userParams.contactsName"
          ></el-input>
        </el-form-item>
        <el-form-item label="证件类型">
          <el-select
            placeholder="请你选择证件的类型"
            style="width: 100%"
            v-model="userParams.contactsCertificatesType"
          >
            <el-option v-for="item in certationArr" :key="item.id" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码">
          <el-input
            placeholder="请你输入证件号码"
            v-model="userParams.contactsCertificatesNo"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input
            placeholder="请你输入用户手机号码"
            v-model="userParams.contactsPhone"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default" @click="submit">提交</el-button>
          <el-button type="primary" size="default" @click="reset">重写</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref,reactive, onMounted, watch } from 'vue'
// 引入icon图标
import { User } from '@element-plus/icons-vue'
// 引入接口函数
import { reqGetUser } from '@/api/hospital'
import { reqCertationType, reqCity, reqAddOrUpdateUser } from "@/api/user";
import { useRouter, useRoute } from 'vue-router';
import { CascaderProps, ElMessage } from "element-plus";

// 决定卡片展示场景的数据
let scene = ref<number>(0)
// 存储全部的就诊人信息
let userArr = ref<any>([])
//存储证件类型的数据
let certationArr = ref<any>([]);
// 收集就诊人数据
let userParams = reactive<any>({
  name: "",
  certificatesType: "",
  certificatesNo: "",
  sex: 0,
  birthdate: "",
  phone: "",
  isMarry: 0,
  isInsure: 0,
  addressSelected: [],
  address: "",
  contactsName: "",
  contactsCertificatesType: "",
  contactsCertificatesNo: "",
  contactsPhone: "",
})
// 获取路由与路由器对象
let $route = useRoute()
let $router = useRouter()

// 组件挂载完毕获取一次就诊人的信息
onMounted(()=>{
  // 获取就诊人信息
  getAllUser()
  //获取证件的类型的数据
  getCertationType();
  //判断:当前这个路由组件是不是从挂号组件而来[挂号组件而来,路径上是携带query参数type=add]
  if ($route.query.type == "add") {
    scene.value = 1;
  }
  if ($route.query.type == "edit") {
    scene.value = 1;
  }
})
// 获取全部的就诊人信息
const getAllUser = async () => {
  let result: any = await reqGetUser()
  if(result.data.code == 200) {
    userArr.value = result.data.data
  }
}
// 添加就诊人按钮的回调
const addUser = () => {
  // 清空上一次的数据
  reset()
  scene.value = 1
}
// 清空数据 
const reset = () => {
  Object.assign(userParams, {
    id:null,
    name: "",
    certificatesType: "",
    certificatesNo: "",
    sex: 0,
    birthdate: "",
    phone: "",
    isMarry: 0,
    isInsure: 0,
    addressSelected: [],
    address: "",
    contactsName: "",
    contactsCertificatesType: "",
    contactsCertificatesNo: "",
    contactsPhone: "",
  });
};
// 就诊人子组件自定义事件回调
const changeScene = (user: any) => {
  scene.value = 1
  // 收集已有的就诊人的信息
  Object.assign(userParams,user)
}
//获取证件类型的接口
const getCertationType = async () => {
  let result: any = await reqCertationType();
  if (result.data.code == 200) {
    certationArr.value = result.data.data;
  }
};
// 级联选择器提供的数据
const props: CascaderProps = {
  lazy: true, // 懒加载数据
  // 加载级联选择器的数据方法
  async lazyLoad(node: any, resolve: any) {
    let result: any = await reqCity(node.data.id || '86')
    //整理数据
    let showData = result.data.data.map((item: any) => {
      return {
        id: item.id,
        label: item.name,
        value: item.value,
        leaf: !item.hasChildren,
      };
    });
    //注入组件需要展示的数据
    resolve(showData);
  }
}
// 提交按钮的方法的回调
const submit = async () => {
  // 要么新增就诊人|更新一个已有的就诊人
  try {
    // 要么新增用户成功|更新已有的用户成功
    await reqAddOrUpdateUser(userParams)
    // 提示文字
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '新增成功'
    })
    //提交按钮的时候判断是不是从预约挂号而来
    if ($route.query.type) {
      $router.back();
    } else {
      scene.value = 0;
    }
    // 获取全部的就诊人信息
    getAllUser()
  } catch (error) {
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新失败' : '新增失败'
    })
  }
}
//监听全部就诊人的数据
watch(
  () => userArr.value,
  () => {
    if ($route.query.type == "edit") {
       let user  = userArr.value.find((item:any)=>{
           return item.id==$route.query.id;
       });
      Object.assign(userParams,user)
    }
  }
);
//子组件自定义事件:删除按钮触发
const removeUser = ()=>{
  //再次获取全部的就诊人的信息
   getAllUser();
}
</script>

<style lang="scss" scoped>
.box-card {
  margin: 30px 0 10px;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .visitor {
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 32%;
      margin: 5px;
    }
  }
}
</style>