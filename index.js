const request = require('./api')
const handlePush = require('./pushMessage')
const growth = {
  userName: '', // 用户名
  checkedIn: false, //是否签到
  incrPoint: 0, // 签到获得矿石数
  totalPoint: 0, //总矿石数
  contCount: 0, // 连续签到天数
  totalCount: 0, // 累计签到天数
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
  // 签到
  const isCheckedIn = await request.getTodayStatus()
  if (!isCheckedIn) {
    const { incr_point } = await request.checkIn()
    growth.incrPoint = incr_point
    growth.checkedIn = true
  }
  // 签到天数
  const { cont_count, sum_count } = await request.getCounts()
  growth.contCount = cont_count
  growth.totalCount = sum_count
  // 免费抽奖
  const { free_count } = await request.getLotteryConfig()
  growth.freeCount = free_count || 0
  if (free_count > 0) {
    const { lottery_name } = await request.drawLottery()
    growth.freeDraw = true
    growth.lotteryName = lottery_name
  }
  // 当前矿石数
  growth.totalPoint = await request.getCurrentPoint()
  console.log(growth)
  let msg = message()
  msg = msg.replace(/\n/g, ' \n\n > ').replace(/ +/g, ' ')
  handlePush({
    message: msg
  })
}

init()
