<template>
  <div class="container">
    <el-dialog v-model="userStore.visiable" title="用户登录">
      <!-- 对话框身体部分的结构 -->
      <el-row>
        <!-- 左侧结构：收集号码登录、微信扫一扫登录 -->
        <el-col :span="12">
          <div class="login">
            <div v-show="scene == 0">
              <el-form :model="loginParam" :rules="rules" ref="form">
                <el-form-item prop="phone">
                  <el-input :prefix-icon="User" placeholder="请输入手机号码" v-model="loginParam.phone"></el-input>
                </el-form-item>
                <el-form-item prop="code">
                  <el-input :prefix-icon="Lock" placeholder="请输入手机验证码" v-model="loginParam.code"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button :disabled="!isPhone || flag ? true : false">
                    <CountDown v-if="flag" :flag="flag" @getFlag="getFlag"></CountDown>
                    <span v-else  @click="getCode">获取验证码</span>
                  </el-button>
                </el-form-item>
              </el-form>
              <el-button 
                type="primary" 
                style="width: 100%;" 
                size="default" 
                :disabled="!isPhone || loginParam.code?.length !== 6 ? true : false" 
                @click="login"
                >用户登录
              </el-button>
              <div class="bottom" @click="changeScene">
                <p>微信登录</p>
                <SvgIcon name="weixin" width="30px" height="30px"></SvgIcon>
              </div>
            </div>
            <div class="webchat" v-show="scene == 1">
              <!-- 在这个容器当中显示微信扫码登录的页面 -->
              <div id="login_container"></div>
              <div class="phone" @click="goback">
                <p>手机验证码登录</p>
                <SvgIcon name="phone" color="#ff0000"></SvgIcon>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="leftContent">
            <div class="top">
              <div class="item">
                <img src="../../assets/images/code_app.png" alt="二维码图片">
                <SvgIcon name="weixin_other"></SvgIcon>
                <p>微信扫一扫关注</p>
                <p>“快速预约挂号”</p>
              </div>
              <div class="item">
                <img src="../../assets/images/code_login_wechat.png" alt="二维码图片">
                <SvgIcon name="phone"></SvgIcon>
                <p>扫一扫下载</p>
                <p>“预约挂号APP”</p>
              </div>
            </div>
          </div>
          <p class="tip">医院预约系统平台</p>
          <p class="tip">快速挂号 安全放心</p>
        </el-col>
      </el-row>
      <template #footer>
        <el-button type="primary" size="default" @click="closeDialog">关闭窗口</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 引入wx扫码登录参数请求
import { reqWxLogin } from '@/api/hospital';
import { ref, reactive, computed, watch } from 'vue'
// 引入组件库图标
import { User, Lock } from '@element-plus/icons-vue'
// 获取user仓库的数据(visiable)可以控制login组件的对话框显示与隐藏
import useUserStore from '@/store/modules/user'
import { ElMessage } from "element-plus";
// 引入倒计时组件
import CountDown from '@/components/countdown/index.vue'
import { useRouter, useRoute } from 'vue-router'

let userStore = useUserStore()
// 切换登录场景
let scene = ref<number>(0) // 0代表手机号登录，如果是1代表微信扫码登录
// 收集表单数据——手机号码
let loginParam = reactive({
  phone: '', // 收集手机号码
  code: '', // 接口收集验证码用来展示在输入框当中
})
// 控制倒计时组件的显示与隐藏
let flag = ref<boolean>(false) // flag为真开启倒计时，flag为假并非倒计时
// 获取组件实例
let form = ref<any>()
// 获取路由器对象
let $router = useRouter()
let $route = useRoute()

// 计算出当前表单元素收集的内容是否是手机号码格式
let isPhone = computed(()=>{
  // 手机号码正则表达式
  const reg = /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/;
  // 返回布尔值：真代表手机号码、假代表的即为不是手机号码
  return reg.test(loginParam.phone)
})
// 点击微信扫码登录 | 微信小图标切换为微信扫码登录
const changeScene = async () => {
  scene.value = 1
  // 发请求获取微信扫码二维码需要的参数
  let redirect_URL = encodeURIComponent(window.location.origin + '/wxlogin')
  let result: any = await reqWxLogin(redirect_URL)
  // 生成微信扫码登录的二维码页面
  // @ts-ignore
  new WxLogin({
    self_redirect:true, // true：手机点击确认登录后可以在 iframe 内跳转到 redirect_uri
    id:"login_container", // 显示二维码容器的设置
    appid: result.data.data.appid, // 应用的唯一标识
    scope: "snsapi_login",  // 当前微信扫码登录页面已经授权了
    redirect_uri: result.data.data.redirectUri, // 填写授权回调域路径，就是用户授权成功后，微信服务器向公司后台推送code地址
    state: result.data.data.state, // state就是学校服务器重定向的地址携带用户信息
    style: "black", // 二维码的外观
    href: "",
  });
}
// 获取验证码按钮的回调
const getCode = async () => {
  // 解决element-plus按钮禁用还能点击的问题
  if (!isPhone.value || flag.value) return
  // 开启倒计时模式,倒计时组件显示出来
  flag.value = true
  // 通知pinia仓库存储验证码
  try {
    // 获取验证码成功
    await userStore.getCode(loginParam.phone)
    loginParam.code = userStore.code
    let result = parseInt(loginParam.phone) + 1
    loginParam.phone = result.toString()
  } catch (error) {
    // 获取验证码失败
    ElMessage({
      type: "error",
      message: (error as Error).message,
    });
  }
}
// 计数器子组件绑定的自定义事件，当倒计时为零时，通知父组件倒计时组件隐藏
const getFlag = (val: boolean) => {
  // 倒计时模式结束
  flag.value = val  
}
// 点击登录按钮的回调
const login = async () => {
  form.value.validate()
  // 发起登录请求，登录请求成功，对话框关闭，登录请求失败，弹出对应登录失败的错误信息
  try {
    // 用户登录成功
    await userStore.userLogin(loginParam)
    // 关闭对话框
    userStore.visiable = false
    // 获取url的query参数
    let redirect = $route.query.redirect as string
    if(redirect){
      $router.push(redirect)
    }else{
      $router.push('/home')
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: (error as Error).message
    })
  }
}
// 自定义校验规则：手机号码自定义校验规则
const validatorPhone = (_rule: any, value: any, callback: any) => {
  const reg = /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/;
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的手机号码格式'))
  }
}
// 自定义校验规则：验证码自定义校验规则
const validatorCode = (_rule: any, value: any, callback: any) => {
  if (/^\d{6}$/.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的验证码格式'))
  }
}
// 表单校验的规则对象
const rules = {
  phone: [{trigger: 'change', validator: validatorPhone}],
  code: [{trigger: 'change', validator: validatorCode}],
}
// 关闭窗口
const closeDialog = () => {
  userStore.visiable = false
}
// 点击手机验证码回调
const goback = () => {
  scene.value = 0
}
// 监听场景的数据
watch(()=>scene.value,(val: number) => {
  if(val === 1) {
    userStore.queryState()
  }
})
</script>

<style lang="scss" scoped>
.container {
  ::v-deep(.el-dialog__body) {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
  .login {
    padding: 20px;
    border: 1px solid #ccc;
    .webchat {
      display: flex;
      flex-direction: column;
      align-items: center;
      .phone {
        display: flex;
        flex-direction: column;
        align-items: center;
        p {
          margin: 10px 0;
        }
      }
    }
  }
  .bottom {
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
      margin: 10px 0px;
    }
  }
  .leftContent {
    .top {
      display: flex;
      justify-content: space-around;

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
          width: 140px;
          height: 140px;
        }

        p {
          margin: 5px 0;
        }
      }
    }
  }
  .tip {
    text-align: center;
    margin: 20px 0;
    font-size: 20px;
    font-weight: 200;
    font-style: italic;
  }
}</style>