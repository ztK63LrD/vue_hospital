<template>
  <div class="wrap">
    <!-- 顶部结构 -->
    <div class="top">
      <div class="hoscode">{{ workData.baseMap?.hosname }}</div>
      <div class="line"></div>
      <div>{{ workData.baseMap?.bigname }}</div>
      <div class="dot">·</div>
      <div class="hosdeparment">{{ workData.baseMap?.depname }}</div>
    </div>
    <!-- 中间区域 -->
    <div class="center">
      <h1 class="time">{{ workData.baseMap?.workDateString }}</h1>
      <div class="container">
        <div class="item" 
          :class="{ active: item.status == -1 || item.availableNumber == -1, cur: item.workDate == workTime.workDate }"
          v-for="item in workData.bookingScheduleList" :key="item" @click="changeTime(item)">
          <div class="top1">{{ item.workDate }}-{{ item.dayOfWeek }}</div>
          <div class="bottom">
            <div v-if="item.status == -1">停止挂号</div>
            <div v-if="item.status == 0">
              {{ item.availableNumber == -1 ? '约满了' : `有号(${item.availableNumber})` }}
            </div>
            <div v-if="item.status == 1">即将放号</div>
          </div>
        </div>
      </div>
      <el-pagination layout="prev, pager, next" v-model:current-page="pageNo" @current-change="fetchWorkData"
        :total="total">
      </el-pagination>
    </div>
    <!-- 底部展示医生的结构 -->
    <div class="bottom">
      <!-- 展示即将放号的时间 -->
      <div class="will" v-if="workTime.status == 1">
        <span class="time">{{ workTime.workDate.slice(0,4) }}{{ workTime.workDateMd }}</span>
        <span class="willText">放号</span>
      </div>
      <!-- 展示医生的结构 -->
      <div class="doctor" v-else>
        <div class="moring">
          <!-- 顶部文字提示 -->
          <div class="tip">
            <SvgIcon name="moring" width="35px" height="40px"></SvgIcon>
            <span class="text">上午号源</span>
          </div>
          <!-- 底部每一个医生的信息 -->
          <div class="doc_info" v-for="doctor in moringArr" :key="doctor.id">
            <!-- 展示医生的名字|技能 -->
            <div class="left">
              <div class="info">
                <span>{{ doctor.title }}</span>
                <span>|</span>
                <span>{{ doctor.docname }}</span>
              </div>
              <div class="skill">{{ doctor.skill }}</div>
            </div>
            <!-- 右侧区域展示挂号的钱数 -->
            <div class="right">
              <div class="money">￥{{ doctor.amount }}</div>
              <el-button type="primary" size="default" @click="goStep2(doctor)">{{ doctor.availableNumber }}</el-button>
            </div>
          </div>
        </div>
        <div class="after">
          <!-- 顶部文字提示 -->
          <div class="tip">
            <SvgIcon name="after" width="30px" height="40px"></SvgIcon>
            <span class="text">下午号源</span>
          </div>
          <!-- 底部每一个医生的信息 -->
          <div class="doc_info" v-for="doctor in afterArr" :key="doctor.id">
            <!-- 展示医生的名字|技能 -->
            <div class="left">
              <div class="info">
                <span>{{ doctor.title }}</span>
                <span>|</span>
                <span>{{ doctor.docname }}</span>
              </div>
              <div class="skill">{{ doctor.skill }}</div>
            </div>
            <!-- 右侧区域展示挂号的钱数 -->
            <div class="right">
              <div class="money">￥{{ doctor.amount }}</div>
              <el-button type="primary" size="default" @click="goStep2(doctor)">{{ doctor.availableNumber }}</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { reqHospitalWork, reqHospitalDoctor } from '@/api/hospital';
// 获取路由对象
let $route = useRoute()
// 获取路由器对象
let $router = useRouter()
// 分页器当前页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let limit = ref<number>(6)
// 数据的总个数
let total = ref<number>(0)
// 存储医院科室挂号数据
let workData = ref<any>({})
// 存储排班日期:当前数据的第一个
let workTime: any = ref({})
// 存储排班医生的数据
let docArr = ref<any>([])

// 组件挂载完毕发一次请求
onMounted(() => {
  fetchWorkData()
})
// 获取挂号的数据
const fetchWorkData = async () => {
  let result: any = await reqHospitalWork(pageNo.value, limit.value, $route.query.hoscode as string, $route.query.depcode as string)
  if (result.data.code) {
    workData.value = result.data.data
    total.value = result.data.data.total
    // 存储第一天的数据
    workTime.value = workData.value.bookingScheduleList[0]
    // 获取一次医生的数据
    getDoctorWorkData()
  }
}
// 获取某一天医生排班的数据
const getDoctorWorkData = async () => {
  // 医院的编号
  let hoscode: string = $route.query.hoscode as string
  // 科室的编号
  let depcode: string = $route.query.depcode as string
  // 时间
  let workDate: string = workTime.value.workDate
  // 获取排班医生的数据
  let result: any = await reqHospitalDoctor(hoscode, depcode, workDate)
  if (result.data.code == 200) {
    docArr.value = result.data.data
  }
}
// 点击顶部触发某一天触发回调
const changeTime = (item: any) => {
  // 存储用户选择的那一天的数据
  workTime.value = item
  // 再发一次获取医生排班的数据
  getDoctorWorkData()
}
// 计算出上午排班的医生数据
let moringArr = computed(() => {
  return docArr.value.filter((doc: any) => {
    return doc.workTime == '0'
  })
})
// 计算出下午排班的医生数据
let afterArr = computed(() => {
  return docArr.value.filter((doc: any) => {
    return doc.workTime == '1'
  })
})
const goStep2 = (doctor: any) => {
  // 编程式路由导航进行路由跳转且携带医生的ID
  $router.push({ path: '/hospital/register_step2', query: { docId: doctor.id } })
}
</script>

<style lang="scss" scoped>
.wrap {
  .top {
    margin: 10px 0;
    display: flex;
    color: #7f7f7f;

    .line {
      width: 2px;
      height: 18px;
      background: #ddd;
      margin: 0 5px;
    }

    .dot {
      margin: 0 8px;
      color: skyblue;
    }
  }

  .center {
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    .time {
      font-weight: 900;
    }

    .container {
      margin: 30px 0;
      display: flex;
      width: 100%;

      .item {
        width: 100%;
        border: 1px solid skyblue;
        margin: 0px 5px;
        transition: all .8s;
        cursor: pointer;
        &.active {
          border: 1px solid #ccc;
          color: #7f7f7f;
          .top1 {
            background: #ccc;
          }
        }
        &.cur {
          transform: scale(1.05);
          border: 1px solid #f00;
          cursor: pointer;
        }

        .top1 {
          background: #e8f2ff;
          height: 30px;
          width: 100%;
          text-align: center;
          line-height: 30px;
        }

        .bottom {
          width: 100%;
          height: 60px;
          text-align: center;
          line-height: 60px;
        }
      }
    }
  }

  .bottom {
    .will {
      font-size: 30px;
      text-align: center;
      font-weight: 900;

      .time {
        color: red;
      }

      .willText {
        color: skyblue;
      }
    }

    .doctor {

      .moring,
      .after {
        .tip {
          display: flex;
          align-items: center;

          .text {
            color: #7f7f7f;
            font-weight: 900;
          }
        }

        .doc_info {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          border-bottom: 1px solid #ccc;

          .left {
            .info {
              color: skyblue;
              margin: 10px 0px;

              span {
                margin-right: 10px;
                font-size: 18px;
                font-weight: 900;
              }
            }

            .skill {
              margin: 15px 0 5px;
              color: #7f7f7f;
            }
          }

          .right {
            width: 150px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .money {
              color: #7f7f7f;
              font-weight: 900;
            }
          }
        }
      }
    }
  }
}</style>