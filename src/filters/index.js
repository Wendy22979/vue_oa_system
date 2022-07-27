import moment from 'moment'

// 时间处理，年月日形式
export function formDate(time, option = 'YYYY-MM-DD') {
  const t = (new Date(time)).getTime()
  return moment(t).format(option)
}

// 考勤状态处理
export function attendancesState(num) {
  let state
  switch (num) {
    case 1:
      state = '√'
      break
    case 2:
      state = '旷工'
      break
    case 3:
      state = '迟到'
      break
    case 4:
      state = '早退'
      break
    case 5:
      state = '外出'
      break
    case 6:
      state = '出差'
      break
    case 7:
      state = '年假'
      break
    case 8:
      state = '事假'
      break
    case 9:
      state = '病假'
      break
    case 10:
      state = '婚假'
      break
    case 11:
      state = '丧假'
      break
    case 12:
      state = '产假'
      break
    case 13:
      state = '奖励产假'
      break

    case 14:
      state = '陪产假'
      break
    case 15:
      state = '探亲假'
      break
    case 16:
      state = '工伤假'
      break
    case 17:
      state = '调休'
      break

    case 18:
      state = '产检假'
      break

    case 19:
      state = '流产假'
      break

    case 20:
      state = '长期病假'
      break

    case 21:
      state = '测试架'
      break

    case 22:
      state = '补签'
      break
  }
  return state
}
