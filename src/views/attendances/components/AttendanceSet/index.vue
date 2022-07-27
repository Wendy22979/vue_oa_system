<template>
  <div class="add-form">
    <el-dialog title="设置" :visible="dialogFormVisible" :before-close="handleClose">
      <el-tabs v-model="activeName" style="margin-left:20px">
        <el-tab-pane label="出勤设置" name="first">
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="formBase"
            label-position="right"
            label-width="100px"
            style="width:700px;"
            class="titmInfo"
          >
            <el-form-item label="部门：" prop="departmentId">
              <el-select v-model="formBase.departmentId" placeholder="请选择">
                <el-option
                  v-for="item in departmentData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="出勤时间：" prop="morningStartTime" style="">
              <el-time-select
                v-model="formBase.morningStartTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:05',
                  end: '23:59'
                }"
                :placeholder="formBase.morningStartTime"
                class="timePicker"
              />-
              <el-time-select
                v-model="formBase.morningEndTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }"
                :placeholder="formBase.morningEndTime"
                class="timePicker"
              />
              <el-time-select
                v-model="formBase.afternoonStartTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }"
                :placeholder="formBase.afternoonStartTime"
                class="timePicker"
              />-
              <el-time-select
                v-model="formBase.afternoonEndTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }"
                :placeholder="formBase.afternoonEndTime"
                class="timePicker"
              />
            </el-form-item>
          </el-form>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleAttendance">保存更新</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="请假设置" name="second">
          <el-form
            ref="leaveForm"
            :rules="rules"
            :model="leaveBase"
            label-position="right"
            label-width="80px"
            class="titmInfo"
          >
            <el-form-item label="部门：" prop="departmentId">
              <el-select
                v-model="leaveBase.departmentId"
                placeholder="请选择"
                @change="handleChangeLeave"
              >
                <el-option
                  v-for="item in departmentData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <p>假期类型</p>
          <el-table ref="singleTable" :data="stateData.type" style="width: 100%">
            <el-table-column prop="name" label="类型" width="200" />
            <el-table-column label="是否可用">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.isEnable"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </template>
            </el-table-column>
          </el-table>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleLeave">保存更新</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
          <el-alert type="warning" show-icon :closable="false" title>
            <template>
              <div class="tipInfo">
                <p>事假 请假单位为0.5天 只能提交工作日内的请假单</p>
                <p>当请假开关关闭后，员工则不可在员工端提交请假申请</p>
              </div>
            </template>
          </el-alert>
        </el-tab-pane>
        <el-tab-pane label="扣款设置" name="third">
          <el-form
            ref="deductionsForm"
            :rules="rules"
            :model="deductionsBase"
            label-position="right"
            label-width="80px"
            class="titmInfo"
          >
            <el-form-item label="部门：" prop="departmentId">
              <el-select
                v-model="deductionsBase.departmentId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in departmentData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <el-table ref="singleTable" :data="stateData.departmentType" style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.name }}
                  <el-switch
                    v-model="scope.row.isEnable"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="handleStatus(scope.$index)"
                  />
                </div>
                <!-- 迟到 -->
                <div v-if="scope.row.dedTypeCode==='51000'" class="attentInfo">
                  <p>
                    迟到≤
                    <el-input
                      v-model="scope.row.periodUpperLimit"
                      class="inputInfo"
                      value="30"
                    />分钟
                  </p>
                  <div class="deductionInfo">
                    <p>
                      迟到≤
                      <el-input
                        v-model="scope.row.timesUpperLimit"
                        class="inputInfo"
                      />次，每次扣款
                      <el-input
                        v-model="scope.row.dedAmonutUpperLimit"
                        class="inputInfo"
                      />元
                    </p>
                    <p>
                      迟到>
                      <el-input
                        v-model="scope.row.timesLowerLimit"
                        class="inputInfo"
                        disabled
                      />次，每次扣款
                      <el-input
                        v-model="scope.row.dedAmonutLowerLimit"
                        class="inputInfo"
                      />元
                    </p>
                  </div>
                  <p>
                    迟到>
                    <el-input v-model="scope.row.periodLowerLimit" class="inputInfo" disabled />分钟
                  </p>
                  <div class="deductionInfo">
                    <p>
                      迟到>
                      <el-input
                        v-model="scope.row.absenceTimesUpperLimt"
                        class="inputInfo"
                        disabled
                      />次，每次矿工
                      <el-input
                        v-model="scope.row.absenceDays"
                        class="inputInfo"
                      />天
                    </p>
                  </div>
                </div>
                <!-- 早退 -->
                <div v-if="scope.row.dedTypeCode==='52000'" class="attentInfo">
                  <p>
                    早退≤
                    <el-input
                      v-model="scope.row.periodUpperLimit"
                      class="inputInfo"
                      value="30"
                    />分钟
                  </p>
                  <div class="deductionInfo">
                    <p>
                      早退≤
                      <el-input
                        v-model="scope.row.timesUpperLimit"
                        class="inputInfo"
                      />次，每次扣款
                      <el-input
                        v-model="scope.row.dedAmonutUpperLimit"
                        class="inputInfo"
                      />元
                    </p>
                    <p>
                      早退>
                      <el-input v-model="scope.row.timesLowerLimit" class="inputInfo" disabled />次，每次扣款
                      <el-input
                        v-model="scope.row.dedAmonutLowerLimit"
                        class="inputInfo"
                      />元
                    </p>
                  </div>
                  <p>
                    早退>
                    <el-input v-model="scope.row.periodLowerLimit" class="inputInfo" disabled />分钟
                  </p>
                  <div style="padding-left:120px;">
                    <p>
                      早退>
                      <el-input
                        v-model="scope.row.absenceTimesUpperLimt"
                        class="inputInfo"
                        disabled
                      />次，每次旷工
                      <el-input
                        v-model="scope.row.absenceDays"
                        class="inputInfo"
                      />天
                    </p>
                  </div>
                </div>
                <!-- 旷工扣款 -->
                <div v-if="scope.row.dedTypeCode==='53000'" class="attentInfo">
                  <p>
                    旷工按
                    <el-input
                      v-model="scope.row.fineSalaryMultiples"
                      class="inputInfo"
                    />倍工资处罚
                  </p>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleDeductions">保存更新</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="加班设置" name="fourth">
          <el-form
            ref="overtimeForm"
            :model="overtimeBase"
            :rules="overtimeRule"
            label-width="110px"
          >

            <el-form-item label="部门：" prop="departmentId">
              <el-select
                v-model="overtimeBase.departmentId"
                placeholder="请选择"
                @change="handleChangeovertime"
              >
                <el-option
                  v-for="item in departmentData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="加班规则：">
              <div v-for="item in overtimeBase.rules" :key="item.id" class="ruleInfo">
                <el-row>
                  <el-col :span="8">
                    <div class="grid-content bg-purple">
                      <el-switch v-model="item.isEnable" />
                      &nbsp;&nbsp;{{ item.rule }}
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <div class="grid-content bg-purple-light">
                      <span class="pad">
                        <el-checkbox v-model="item.isTimeOff">调休假</el-checkbox>
                      </span>
                      <template>
                        <el-time-select
                          v-model="item.ruleStartTime"
                          :picker-options="{
                            start: '01:00',
                            step: '00:15',
                            end: '23:59'
                          }"
                          style="width:100px;"
                          :disabled="item.isTimeOff===false"
                        />
                        <el-time-select
                          v-model="item.ruleEndTime"
                          :picker-options="{
                            start: '01:00',
                            step: '00:15',
                            end: '23:59',
                            minTime: item.startTime
                          }"
                          style="width:100px;"
                          :disabled="item.isTimeOff===false"
                        />
                      </template>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item label="打卡验证：" prop="isClock">
              <el-switch v-model="overtimeBase.isClock" />&nbsp;&nbsp;加班需要有打卡记录
            </el-form-item>
            <el-form-item label="开启补偿：" prop="isCompensationint">
              <el-switch v-model="overtimeBase.isCompensationint" />
            </el-form-item>
            <el-form-item label="调休假设置：" prop="latestEffectDate">
              <div class="ruleInfo">
                最晚有效期： 次年
                <el-date-picker
                  v-model="overtimeBase.latestEffectDate"
                  type="date"
                  placeholder="选择日期"
                  style="width:150px;"
                />
              </div>
            </el-form-item>
            <el-form-item label prop="unit">
              <div class="ruleInfo">
                <p>
                  请假最小单位
                  <el-input v-model="overtimeBase.unit" style="width:50px" />天
                </p>
              </div>
            </el-form-item>
          </el-form>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleOvertime">保存更新</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { attendanceSave, leaveSave, deductionsSave, getOvertime, overtimeSave } from '@/api/attendances'
import attendanceApi from '@/api/constant/attendance' // 模拟数据
export default {
  name: 'AttendanceSet',
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: 'first', // 当前的tab
      formBase: { // 出勤设置
        departmentId: '', // 部门id
        morningStartTime: '', // 上午开始时间,出勤时间
        morningEndTime: '', // 上午出勤结束时间
        afternoonStartTime: '', // 下午出勤开始时间
        afternoonEndTime: ''// 下午出勤结束时间
      },
      leaveBase: { // 请假设置表单收集
        departmentId: '' // 部门id
      },
      deductionsBase: { // 扣款设置
        departmentId: '' // 部门id
      },
      overtimeBase: { // 加班设置
        departmentId: '', // 部门id
        rules: attendanceApi.overtimeType, // 加班规则
        isClock: false, // 打卡验证是否开启
        isCompensationint: false, // 加班补偿是否开启
        latestEffectDate: '', // 调休最晚有效期
        unit: '' // 请假最少为/天
      },
      departmentData: [], // 部门数据
      stateData: {}, // 假期列表
      rules: { // 表单验证规则
        departmentId: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ],
        morningStartTime: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        morningEndTime: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        afternoonStartTime: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        afternoonEndTime: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ]

      },
      overtimeRule: { // 加班表单校验
        latestEffectDate: [ // 最晚有效期
          { required: true, message: '请填写最晚有效期', trigger: 'blur' }
        ],
        unit: [{ required: true, message: '请填写最小请假天数', trigger: 'blur' }]
      }
    }
  },
  watch: {
    departmentData() {
      this.overtimeBase.departmentId = this.departmentData[0].id
      this.workRule()
    }
  },
  mounted() {
    this.getDepartments()
    this.stateData = attendanceApi
  },
  methods: {
    // 部门列表请求
    async getDepartments() {
      try {
        const { depts } = await getDepartments()
        this.departmentData = depts
      } catch (error) {
        console.log(error)
      }
    },
    // 根据id获取各个部门的加班规则
    async workRule() {
      const res = await getOvertime({ departmentId: this.overtimeBase.departmentId })
      if (res.dayOffConfigs !== null || res.extraDutyConfig !== null) { // 规则不为空时执行
        this.overtimeBase.latestEffectDate = res.dayOffConfigs.latestEffectDate // 储存休假日期
        this.overtimeBase.unit = res.dayOffConfigs.unit // 存储休假最少天数
        this.overtimeBase.isClock = res.extraDutyConfig.isClock // 打卡验证是否开启
        this.overtimeBase.isCompensationint = res.extraDutyConfig.isCompensationint // 加班补偿是否开启
      }

      if (this.overtimeBase.isClock === 0) { // 对打卡验证进行转换
        this.overtimeBase.isClock = true
      } else {
        this.overtimeBase.isClock = false
      }
      if (this.overtimeBase.isCompensationint === 0) { // 对加班补偿进行转换
        this.overtimeBase.isClock = true
      } else {
        this.overtimeBase.isCompensationint = false
      }

      if (res.extraDutyRuleList.length > 0) { // 加班规则列表不为空时
        res.extraDutyRuleList.forEach(item => {
          if (item.isEnable === 0) { // 对加班规则是否可用进行转化
            item.isEnable = true
          } else {
            item.isEnable = false
          }
          if (item.isTimeOff === 0) { // 对是否可调休进行转化
            item.isTimeOff = true
          } else {
            item.isTimeOff = false
          }
        })
        this.overtimeBase.rules = res.extraDutyRuleList // 存储规则
      }
    },
    // 出勤确认保存处理函数
    handleAttendance() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          await attendanceSave(this.formBase)
          this.$message.success('保存成功')
          this.handleClose('formBase') // 取消处理函数
        }
      })
    },
    // 取消
    handleClose(type) {
      this.$emit('update:dialogFormVisible', false)
      switch (type) {
        case 'formBase':
          this.formBase = {}// 重新请求还原
          break
        case 'stateData':
          this.stateData = attendanceApi// 重新请求还原
          break
        case 'overtimeBase':
          this.overtimeBase = { // 加班设置
            departmentId: '', // 部门id
            rules: attendanceApi.overtimeType, // 加班规则
            isClock: false, // 打卡验证是否开启
            isCompensationint: false, // 加班补偿是否开启
            latestEffectDate: '', // 调休最晚有效期
            unit: '' // 请假最少为/天
          }
          break
        case 'leaveBase':
          this.stateData = attendanceApi// 重新请求还原
          break
      }
    },
    // 请假部门的change事件
    handleChangeLeave() {

    },
    // 请假确定
    handleLeave() {
      this.$refs.leaveForm.validate(async valid => {
        if (valid) {
          this.stateData.type.forEach(item => { // 对假期数据进行转换
            if (item.isEnable) {
              item.isEnable = '0'
            } else {
              item.isEnable = '1'
            }
          })
          await leaveSave([...this.stateData.type]) // 接口设计有问题,没法传部门id
          this.$message.success('保存成功')
          this.handleClose('leaveBase')
        }
      })
    },
    // 扣款假期的change事件,在状态改变,允许设置的时候,就将其部门id添加进去,添加到所有规则中
    handleStatus(index) {
      this.stateData.departmentType.forEach(item => {
        item.departmentId = this.deductionsBase.departmentId
      })
    },
    // 迟到控工天数设置
    handleInputPoint() {

    },
    // 扣款设置确定
    handleDeductions() {
      this.$refs.deductionsForm.validate(async valid => {
        if (valid) {
          var deductionList = this.stateData.departmentType
          deductionList.forEach(item => {
            if (item.isEnable) { // 状态转换
              item.isEnable = '0'
            } else {
              item.isEnable = '1'
            }
          })
          try {
            await deductionsSave(deductionList)
            this.$message.success('保存成功')
            // 清除数据
            this.handleClose('stateData')
          } catch (error) {
            console.log(error)
          }
        }
      })
    },
    // 加班部门change事件
    handleChangeovertime() {
      // 部门更换,加班规则对应更新
      this.workRule()
    },
    // 加班确定保存
    handleOvertime() {
      this.$refs.overtimeForm.validate(async valid => {
        if (valid) {
          var deductionList = this.overtimeBase
          // 数据转换
          if (deductionList.isClock === true) { // 对打卡验证是否开启转换
            deductionList.isClock = '0'
          } else {
            deductionList.isClock = '1'
          }

          if (deductionList.isCompensationint === true) { // 加班补偿是否开启转换
            deductionList.isCompensationint = '0'
          } else {
            deductionList.isCompensationint = '1'
          }

          deductionList.rules.forEach(item => {
            if (item.isEnable === true) { // 调休是否可用设置
              item.isEnable = '0'
            } else {
              item.isEnable = '1'
            }
            if (item.isTimeOff === true) { // 是否调休转换
              item.isTimeOff = '0'
            } else {
              item.isTimeOff = '1'
            }
          })

          try {
            await overtimeSave(deductionList)
            this.$message.success('保存成功')
            this.handleClose('overtimeBase')
          } catch (error) {
            console.log(error)
          }
        }
      })
    }

  }

}
</script>

<style lang="scss" scoped>
.inputInfo{width: 50px;}

.attentInfo {
  p {
    padding: 3px 0;
  }
  .el-input--medium {
    .el-input__inner {
      height: 24px;
      line-height: 24px;
    }
  }
}
.titmInfo {
  .el-date-editor--timerange.el-input__inner {
    width: 280px;
  }
  .el-date-editor .el-range-separator {
    padding: 0 15px 0 0;
  }
}
.ruleInfo {
  .el-input--medium .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
}

.tipInfo {
  p {
    padding: 5px 0;
  }
}
.titInfo {
  border-bottom: 1px solid #dcdfe6;
  height: 30px;
  line-height: 30px;
  padding: 0 0 15px;
}
.attentInfo {
  padding: 30px 15px 15px 80px;
}
.ruleInfo {
  .pad {
    padding-left: 80px;
  }
}
</style>
