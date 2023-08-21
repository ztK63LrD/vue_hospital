import { defineStore } from "pinia";
// pinis仓库写法：组合式API、选择式API，这里采用组合式API写法
import { reqHospitalDetail, reqHospitalDeparment } from "@/api/hospital";

const useDetailStore = defineStore('Detail',{
  state: ()=>{
    return {
      // 医院详情的数据
      hospitalInfo: JSON.parse(localStorage.getItem('hospitalInfo') as string) || {}, // 从localStorage中获取数据
      // 存储医院科室的数据
      deparmentArr: [],
    }
  },
  actions:{
    // 获取医院详情的方法
    async getHospital(hoscode: string) {
      let result: any = await reqHospitalDetail(hoscode)
      if (result.data.code == 200) {
        this.hospitalInfo = result.data.data
        localStorage.setItem('hospitalInfo', JSON.stringify(result.data.data)); // 将数据保存到localStorage中
      }
    },
    // 获取某一个医院科室的数据
    async getDeparment(hoscode: string) {
      let result: any = await reqHospitalDeparment(hoscode)
      if(result.data.code == 200){
        this.deparmentArr = result.data.data
      }
    }
  },
  getters:{},
})
// 获取仓库的方法对外暴露
export default useDetailStore