import { dayjs } from "element-plus";
export const formatTime = (time, format) => {
  if (format) {
    // 有传入格式
    return dayjs(time).format(format)
  } else {
    // 无参数(默认)
    return dayjs(time).format('YYYY-MM-DD')
  }
}