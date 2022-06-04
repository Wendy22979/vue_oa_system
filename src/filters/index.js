import moment from 'moment'

// 时间处理，年月日形式
 export function formDate (time,option='YYYY-MM-DD') {
  const t=  (new Date(time)).getTime()
    return moment(t).format(option);
 }