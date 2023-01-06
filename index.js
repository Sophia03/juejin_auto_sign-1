const request = require('./api')
const handlePush = require('./pushMessage')
const growth = {
  userName: '', // 用户名
  checkedIn: false, //是否签到
  incrPoint: 0, // 签到获得矿石数
  totalPoint: 0, //总矿石数
  contCount: 0, // 连续签到天数
  totalCount: 0, // 累计签到天数
  dippedLucky: false, // 是否沾过喜气
  dipValue: 0, // 幸运值
  luckyValue: 0, // 总幸运值
  freeCount: 0, //免费抽奖次数
  freeDraw: false, // 是否免费抽奖
  lotteryName: '' // 奖品名称
}
function message() {
  return `Hello ${growth.userName}
  ${growth.checkedIn ? `签到 +${growth.incrPoint} 矿石` : '今日已签到'}
  当前矿石数 ${growth.totalPoint}
  连续签到天数 ${growth.contCount}
  累计签到天数 ${growth.totalCount}
  ${growth.dippedLucky ? '今日已经沾过喜气' : `沾喜气 +${growth.dipValue} 幸运值`}
  当前幸运值 ${growth.luckyValue}
  免费抽奖次数 ${growth.freeCount}
  ${growth.freeDraw ? `恭喜抽中 ${growth.lotteryName}` : '今日已免费抽奖'}
  `.trim()
}
async function init() {
  // 判断cookie是否有效
  try {
    const { user_name } = await request.getUser()
    growth.userName = user_name
  } catch (error) {
    console.log(error)
    return handlePush({ message: '登录失败, 请尝试更新 Cookies', type: 'error' })
  }
  const isCheckedIn = await request.getTodayStatus()
  if (!isCheckedIn) {
    const { incr_point } = await request.checkIn()
    growth.incrPoint = incr_point
    growth.checkedIn = true
  }
  const { cont_count, sum_count } = await request.getCounts()
  growth.contCount = cont_count
  growth.totalCount = sum_count
  const { free_count } = await request.getLotteryConfig()
  growth.freeCount = free_count || 0
  if (free_count > 0) {
    const { lottery_name } = await request.drawLottery()
    growth.freeDraw = true
    growth.lotteryName = lottery_name
  }
  growth.totalPoint = await request.getCurrentPoint()
  const { lotteries } = await request.getLotteryHistory()
  const luckyId = lotteries && lotteries[0] ? lotteries[0]['history_id'] : 0
  if (lotteries.length > 0) {
    const { dip_value, total_value, has_dip } = await request.dipLucky(luckyId)
    growth.dipValue = dip_value || 0
    growth.luckyValue = total_value
    growth.dippedLucky = has_dip
  }
  console.log(growth)
  let msg = message()
  msg = msg.replace(/\n/g, ' \n\n > ').replace(/ +/g, ' ')
  handlePush({
    message: msg
  })
}

init()
