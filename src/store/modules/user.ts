// 定义用户相关的仓库
import { defineStore } from "pinia";
// 引入获取验证码的请求方法
import { reqCode, reqUserLogin } from "@/api/hospital";
// 引入ts类型
import type { LoginData } from "@/api/hospital/type";

const useUserStore = defineStore('User',{
  state:()=>{
    return {
      visiable: false, // 用于控制登录组件的dialog显示与隐藏
      code: '' as string, // 存储用户的验证码
      userInfo: JSON.parse(localStorage.getItem('USERINFO') as string) || {}, // 用户的个人信息
    }
  },
  actions:{
    // 获取验证码的方法
    async getCode(phone: string) {
      // 在向服务器携带手机号码获取验证码，正常开发的时候，只需要发一个请求，后台就会将验证码推送到用户手机设备当中
      // 目前使用的服务器接口不能向用户手机设备推送验证码（花钱）
      let result: any = await reqCode(phone)
      if (result.data.code == 200) {
        this.code = result.data.data
        return 'ok'
      }else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 用户手机号码登录方法
    async userLogin(loginData: LoginData) {
      let result: any = await reqUserLogin(loginData)
      console.log(result)
      if (result.data.code == 200) {
        this.userInfo = result.data.data
        // 本地存储持久化存储用户信息
        localStorage.setItem("USERINFO", JSON.stringify(this.userInfo))
        // 返回一个成功的Promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录的方法
    logout() {
      // 清空仓库中的数据
      this.userInfo = { name: '', token: '' }
      // 清除本地存储
      localStorage.removeItem('USERINFO')
    },
    // 查询微信扫码的接口(看本地存储是否存储数据)
    queryState() {
      // 开启定时器每隔一段实际：本地是否拥有用户信息
      let timer = setInterval(() => {
        // 本地存储已有数据：扫码成功
        if(localStorage.getItem("USERINFO")) {
          // 关闭对话框
          this.visiable = false
          this.userInfo = JSON.parse(localStorage.getItem("USERINFO") as string)
          clearInterval(timer)
        }
      })
    }
  },
  getters:{}
})
export default useUserStore