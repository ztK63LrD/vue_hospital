<template>
  <div>
    <!-- 实名认证组件的结构 -->
    <el-card class="box-card">
      <!-- 卡片的头部 -->
      <template #header>
        <div class="card-header">
          <h1>实名信息</h1>
        </div>
      </template>
      <!-- 实名认证结构的提示部分 -->
      <div class="tip">
        <p><el-icon>
            <InfoFilled />
          </el-icon>>完成实名认证后才能添加就诊人，正常进行挂号，为了不影响后续步骤，建议提前实名认证</p>
      </div>
      <!-- 卡片身体的底部: 认证成功的结构，认证未成功的结构 -->
      <el-descriptions v-if="userInfo.authStatus == 1" class="margin-top" :column="1" border>
        <el-descriptions-item label-align="center" :width="10">
          <template #label>
            <div class="cell-item">用户姓名</div>
          </template>
          {{ userInfo.name }}
        </el-descriptions-item>
        <el-descriptions-item label-align="center" :width="10">
          <template #label>
            <div class="cell-item">证件类型</div>
          </template>
          {{ userInfo.certificatesType == '10' ? '身份证' : '户口本' }}
        </el-descriptions-item>
        <el-descriptions-item label-align="center" width="10px">
          <template #label>
            <div class="cell-item">证件号码</div>
          </template>
          {{ userInfo.certificatesNo }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 用户为验证的结构 -->
      <el-form v-else ref="form" style="width: 40%;margin: 20px auto;" label-width="80" :model="params" :rules="rules">
        <el-form-item label="用户姓名" prop="name">
          <el-input placeholder="请输入用户的姓名" v-model="params.name"></el-input>
        </el-form-item>
        <el-form-item label="证件类型" prop="certificatesType">
          <el-select style="width: 100%;" placeholder="请选择证件类型" v-model="params.certificatesType">
            <el-option :label="item.name" :value="item.value" v-for="(item, index) in arrType" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" prop="certificatesNo">
          <el-input placeholder="请输入证件号码" v-model="params.certificatesNo"></el-input>
        </el-form-item>
        <el-form-item label="上传证件" prop="certificatesUrl">
          <!-- 
            action:upload组件向服务器提交图片路径
            limit:照片墙约束图片个数
            on-exceed:超出数量的钩子
            on-success:图片上传成功的回调
            on-preview:预览的钩子函数
            on-remove:删除的钩子函数
          -->
          <el-upload 
            list-type="picture-card" 
            :limit="1" 
            action="/api/oss/file/fileUpload?fileHost=userAuth"
            :on-exceed="exceedhandler"
            :on-success="successhandler"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            ref="upload"
          >
            <img style="width: 100%;height: 100%;" src="../../../assets/images/auth_example.png" alt="图片" />
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img w-full 
              v-if="params.certificatesUrl" 
              style="width: 100%; height: 100%;" 
              :src="params.certificatesUrl" 
              alt="Preview Image" 
            />
          </el-dialog>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="default" @click="submit">提交</el-button>
          <el-button type="primary" size="default" @click="reset">重写</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
// 引入element-plus的图标
import { InfoFilled } from '@element-plus/icons-vue'
// 引入获取用户信息的接口函数
import { reqUserInfo, reqCertationType, reqUserCertation } from '@/api/user';
import { ElMessage } from 'element-plus';

// 存储用户信息
let userInfo = ref<any>({})
// 存储证件类型
let arrType = ref<any>([])
// 收集表单认证数据
let params = reactive<any>({
  certificatesType: '',
  certificatesNo: '',
  certificatesUrl: '',
  name: '',
})
// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 获取组件实例
let upload = ref<any>()
// 获取form组件实例
let form = ref<any>()

// 组件挂载页面完毕
onMounted(()=>{
  // 获取用户信息的方法
  getUserInfo()
  // 获取证件类型的方法
  getType()
})
// 获取用户信息
const getUserInfo = async () => {
  let result: any = await reqUserInfo()
  if (result.data.code == 200) {
    userInfo.value = result.data.data
  }
}
// 获取证件类型
const getType = async () => {
  let result: any = await reqCertationType()
  if(result.data.code == 200) {
    arrType.value = result.data.data
  }
}
// 超出数量的钩子
const exceedhandler = () => {
  ElMessage({
    type: 'error',
    message: '只能上传一张图片',
  })
}
// 图片上传成功的回调
/* 
  response: 上传图片请求服务器返回的数据
  uploadFile: 上传文件对象
*/
const successhandler = (response: any) => {
  // 如果图片上传成功，校验的结果得删除
  form.value.clearValidate('certificatesUrl')
  // 收集上传成功的图片地址
  params.certificatesUrl = response.data
}
// 照片墙预览的钩子
const handlePictureCardPreview = () => {
  // 触发预览钩子的时候，对话框显示
  dialogVisible.value = true
}
// 照片墙删除的钩子
const handleRemove = () => {
  params.certificatesUrl = ''
}
// 重写按钮的回调
const reset = () => {
  // 清除文件上传列表数据
  upload.value.clearFiles()
  // 清空数据
  Object.assign(params,{
    certificatesType: '',
    certificatesNo: '',
    certificatesUrl: '',
    name: '',
  })
}
// 提交按钮的回调
const submit = async () => {
  // 进行全部的表单校验,返回一个成功的promise，如果有一个表单校验失败返回的是失败的promise，后面的语句就不再执行了
  form.value.validate()
  try {
    // 认证成功
    await reqUserCertation(params)
    // 提示消息
    ElMessage({
      type: 'success',
      message: '认证成功'
    })
    // 认证成功之后再次获取用户信息
    getUserInfo()
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '认证失败'
    })
  }
}
//自定义校验规则姓名方法
const validatorName = (_rule: any, value: any, callBack: any) => {
  //rule:即为当前校验字段的校验规则对象
  const reg = /^[\u00B7\u3007\u3400-\u4DBF\u4E00-\u9FFF\uE000-\uF8FF\uD840-\uD8C0\uDC00-\uDFFF\uF900-\uFAFF]+$/;
  if (reg.test(value)) {
    callBack();
  } else {
    callBack(new Error("请输入正确中国人的名字"));
  }
};
//证件类型校验的方法
const validatorType = (_rule: any, value: any, callBack: any) => {
  if (value == "10" || value == "20") {
    callBack();
  } else {
    callBack(new Error("请选择证件的类型"));
  }
};
//证件号码的校验方法
const validatorNo = (_rule: any, value: any, callBack: any) => {
  let sfz = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
  let hkb = /^\d{9}$/;
  if (sfz.test(value) || hkb.test(value)) {
    callBack();
  } else {
    callBack(new Error("请输入正确的身份证或者户口本的号码"));
  }
};
//证件照图片的
const validatorUrl = (_rule: any, value: any, callBack: any) => {
  if (value.length) {
    callBack();
  } else {
    callBack(new Error("请上传证件照图片"));
  }
};
// 表单的校验规则对象
const rules = {
  // 用户姓名的校验规则
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  certificatesType: [{required: true, trigger: 'blur', validator: validatorType}],
  certificatesNo: [{required: true, trigger: 'blur', validator: validatorNo}],
  certificatesUrl: [{required: true, trigger: 'blur', validator: validatorUrl}],
}
</script>

<style lang="scss" scoped>
.box-card {
  margin-top: 10px;

  .tip {
    color: #7f7f77;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0 25px;
  }
}
</style>