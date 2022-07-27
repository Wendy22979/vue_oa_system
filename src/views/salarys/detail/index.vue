<template>
  <div class="detailsContainer">
    <div class="contLeft">
      <div class="topTit">
        <img src="@/assets/common/img.jpeg" alt="">
        <div class="info">
          <p class="name"><strong> {{ user.username }} </strong><span :class="dutyStatus">{{ dutyStatusTxt }}</span></p>
          <p class="time">入职时间:  {{ user.timeOfEntry }}   最新工资： {{ formLabelAlign.currentPostWage + formLabelAlign.currentBasicSalary }} <ul><span class="more">?</span><li>员工所有调薪后的基本工资、岗位工资合计</li></ul></p>
          <p>当月基本工资 / 当月岗位工资: {{ formLabelAlign.currentBasicSalary }} / {{ formLabelAlign.currentPostWage }}</p>
        </div>
      </div>
      <div>
        <div class="social">
          <div class="title"> <strong>津贴</strong></div>
          <div class="table">
            <div class="tabTit"><div>津贴类型</div><div> 补贴金额 </div><div>津贴类型</div><div> 补贴金额 </div></div>
            <div class="tabRow"><div>交通补助</div><div> {{ paymentData.p2 }} </div><div>通讯补助</div><div> {{ paymentData.p3 }} </div></div>
            <div class="tabRow"><div>午餐补助</div><div> {{ paymentData.p4 }} </div><div>住房补助</div><div> {{ paymentData.p1 }} </div></div>
          </div>
        </div>
        <div class="fund">
          <div class="title"> <strong>社保公积金</strong> <span>企业 {{ enterprisePayment }}</span> <span>个人 {{ personPayment }}</span></div>
          <div class="table">
            <div class="tabTit"><div>缴费项目</div><div>基数</div><div> 企业缴纳 </div><div>个人缴纳</div></div>
            <div class="tabRow"><div>社保</div><div> {{ socialData.socialSecurityBase }} </div><div>{{ socialData.socialSecurityEnterprise }}</div><div> {{ socialData.socialSecurityIndividual }} </div></div>
            <div class="tabRow"><div>公积金</div><div> {{ socialData.providentFundBase }} </div><div>{{ socialData.enterpriseProvidentFundPayment }}</div><div> {{ socialData.personalProvidentFundPayment }} </div></div>
            <div class="tabRow"><div>缴费合计</div><div /><div>{{ enterprisePayment }}</div><div> {{ personPayment }} </div></div>
          </div>
        </div>
        <div class="formTable">
          <el-form :label-position="'left'" label-width="180px" :model="formLabelAlign">
            <el-form-item label="实际出勤天数（正式）：" style="width: 50%;">
              <el-input v-model="atteData.actualAtteOfficialDays" placeholder="0" :disabled="true" />
            </el-form-item>
            <el-form-item label="计薪天数（正式）：" style="width: 50%;">
              <el-input v-model="atteData.workingDays" placeholder="0" :disabled="true" />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="contRit">
      <div class="topTit"><strong>招聘日程</strong></div>
      <div class="Items">
        <li><div class="name"><p>HR专员</p><p>2018-12-3 3:30</p></div><div class="act"> <strong>放弃</strong> </div></li>
        <li><div class="name"><p>HR专员</p><p>2018-12-3 3:30</p></div><div class="act"> <strong>放弃</strong> </div></li>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { getSalaryDetail, getSettings } from '@/api/salarys'
import { getAtteArchiveDetail } from '@/api/attendances'
import { getContent } from '@/api/social'
export default {
  name: 'Detail',
  data() {
    return {
      user: {}, // 用户信息
      formLabelAlign: { // 薪资信息
      },
      paymentData: {
        p1: 0,
        p2: 0,
        p3: 0,
        p4: 0
      }, // 补助信息
      socialData: {}, // 社保公积金
      atteData: {}, // 考勤信息
      userId: this.$route.params.id, // 用户id
      yearMonth: this.$route.params.yearMonth // 年月
    }
  },
  computed: {
    dutyStatusTxt() { // 在职离职转换
      return this.user.inServiceStatus === 1 ? '在职' : '离职'
    },
    dutyStatus() { // 在职离职动态样式
      return this.user.inServiceStatus === 1 ? 'job-txt-green' : 'job-txt-red'
    },
    enterprisePayment() { // 企业缴纳
    // 这个社保数据不存在
      const socialSecurityEnterprise = this.socialData.socialSecurityEnterprise ? this.socialData.socialSecurityEnterprise : 0
      return socialSecurityEnterprise + Number(this.socialData.enterpriseProvidentFundPayment)
    },
    personPayment() { // 个人缴纳
      // 这个社保数据不存在
      const socialSecurityIndividual = this.socialData.socialSecurityIndividual ? this.socialData.socialSecurityIndividual : 0
      return socialSecurityIndividual + Number(this.socialData.personalProvidentFundPayment)
    }

  },
  mounted() {
    this.getUserDetailById()
    this.getSalaryDetail()
    this.getAtteArchiveDetail()
    this.getContent()
  },
  methods: {
  //  获取用户数据
    async getUserDetailById() {
      try {
        const res = await getUserDetailById(this.userId)
        this.user = res
      } catch (error) {
        console.log(error)
      }
    },
    // 获取薪资信息
    async getSalaryDetail() {
      try {
        const res = await getSalaryDetail(this.userId)
        this.formLabelAlign = res
      } catch (error) {
        console.log(error)
      }
    },
    // 获取考勤信息,并计算补助信息
    async getAtteArchiveDetail() {
      try {
        const res = await getAtteArchiveDetail({ userId: this.userId, yearMonth: this.yearMonth })
        this.atteData = res || {}
        const subsidy = await getSettings() // 补贴设置的标准
        this.paymentData.p1 = this.calMoney(subsidy.housingSubsidyScheme, subsidy.housingSubsidyAmount, this.atteData.actualAtteOfficialDays)
        this.paymentData.p2 = this.calMoney(subsidy.transportationSubsidyScheme, subsidy.transportationSubsidyAmount, this.atteData.actualAtteOfficialDays)
        this.paymentData.p3 = this.calMoney(subsidy.communicationSubsidyScheme, subsidy.communicationSubsidyAmount, this.atteData.actualAtteOfficialDays)
        this.paymentData.p4 = this.calMoney(subsidy.lunchAllowanceScheme, subsidy.lunchAllowanceAmount, this.atteData.actualAtteOfficialDays)
      } catch (error) {
        console.log(error)
      }
    },
    // 补贴计算
    calMoney(type, money, days) {
      if (type === 3) {
        return money
      }
      if (type === 1) {
        return money * days
      }
      return 0
    },
    // 用户社保信息获取
    async getContent() {
      try {
        const res = await getContent(this.userId)
        this.socialData = res.userSocialSecurity
      } catch (error) {
        console.log(error)
      }
    }

  }
}
</script>

<style lang="scss" scoped>
  @import "../../../styles/variables";
  .detailsContainer{
    display: flex;
    padding: 15px;
    .contLeft{
      flex: 4;
      background: #fff;
      margin-right: 10px;
      padding: 20px;
      .topTit{
        display: flex;
        padding-bottom: 10px;
        img{
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
        .more{
          display: inline-block;
          position: relative;
          text-align: center;
          width: 16px;
          line-height: 14px;
          font-size: 12px;
          top: -1px;
          left: 5px;
          border: solid 1px #666;
          color:#666;
          border-radius: 50px;
        }
        .info{
          margin-left: 10px;
          line-height: 25px;
          .name{
            span{
              // background: $green1;
              color:#fff;
              padding: 4px 10px;
              border-radius: 3px;
              margin-left: 10px;
              font-size: 12px;
            }
          }
          .time{
            ul{
              position: relative;
              display: inline-block;
              li{
                position: absolute;
                border-radius: 3px;
                box-shadow: 1px 2px 2px #ccc;
                top: 34px;
                left: -43px;
                width: 500px;
                padding:5px 10px;
                line-height: 20px;
                display: none;
                background: #fff;
                border: solid 1px #ccc;
              }
              li::before{
                position:absolute;
                content: '∧';
                left: 50px;
                top: -15px;
                background: #fff;
                color:#ccc;
              }
            }
            ul:hover li{
              display: block;
            }
          }
        }
      }
      .social{
        padding-bottom: 10px;
        .title{
          line-height: 40px;
        }
        .table{
          display: table;
          background: #f9f9f9;
          padding: 20px;
          line-height: 30px;
          width: 100%;
          text-align: center;
          .tabTit{
            display: table-row;
            font-weight: bold;
            div{
              display: table-cell;
            }
          }
          .tabRow{
            display: table-row;
            width: 100%;
            div{
              display: table-cell;
            }
          }
        }
      }
      .fund{
        padding-bottom: 10px;
        .title{
          line-height: 40px;
          span{
            display: inline-block;
            padding: 0 80px;
          }
        }
        .table{
          display: table;
          background: #f9f9f9;
          padding: 20px;
          line-height: 30px;
          width: 100%;
          text-align: center;
          .tabTit{
            display: table-row;
            font-weight: bold;
            div{
              display: table-cell;
            }
          }
          .tabRow{
            display: table-row;
            width: 100%;
            div{
              display: table-cell;
            }
          }
        }
      }
      .formTable{
        margin-top: 20px;
      }
    }
    .contRit{
      flex: 1;
      background: #fff;
      padding:0 20px;
      .topTit{
        margin-bottom: 10px;
        border-bottom: solid 1px #ccc;
        line-height: 40px;
      }
      .Items{
        padding: 20px 0;
        li{
          display: flex;
          .name{
            position: relative;
            text-align: center;
            line-height: 24px;
            padding: 0 0 10px 0;
            flex: 2;
            border-right:solid 1px #ccc;
          }
          .name:after{
            content: ' ';
            border-radius: 50%;
            position: absolute;
            width: 10px;
            height: 10px;
            border:solid 2px $green1;
            right: -5px;
            top:0px;
            background: #fff;
          }
          .act{
            flex: 1;
            text-align: center;
          }
        }
      }
    }
  }
.job-txt-green,.job-txt-red {
  // display: inline-block;
  position: relative;
  padding: 3px;
  border-radius: 3px;
  font-size: 12px;
  color: #fff;
}
.job-txt-green {
  background: #67c23a;
}
.job-txt-red {
  background: #f56c6c;
}

</style>
