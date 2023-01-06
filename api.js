const axios = require('axios')
const { COOKIE } = require('./ENV.js')
const service = axios.create({
  baseURL: 'https://api.juejin.cn',
  headers: {
    cookie: COOKIE,
    'content-type': 'application/json',
    'referer': 'https://juejin.cn/',
    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': 'Windows',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
  }
})
service.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

service.interceptors.response.use(
  (res) => {
    if (res?.data?.err_no !== 0) {
      return Promise.reject(res)
    }
    return Promise.resolve(res?.data?.data ?? {})
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * @desc 用户信息
 * @returns {Promise<*>}
 * {
 *   user_name: String 用户名
 * }
 */
 function getUser() {
  return service.get('/user_api/v1/user/get')
}

/**
 * 当日签到状态
 * @returns {Promise<*>}
 * Boolean 是否签到
 */
 function getTodayStatus() {
  return service.get('/growth_api/v1/get_today_status')
}

/**
 * @desc 签到
 * @returns {Promise<*>}
 * {
 *   incr_point: Number 获得矿石数
 * }
 */
 function checkIn() {
  return service.post('/growth_api/v1/check_in')
}

/**
 * @desc 签到天数
 * @returns {Promise<*>}
 * {
 *   cont_count: Number 连续签到天数
 *   sum_count: Number 累计签到天数
 * }
 */
 function getCounts() {
  return service.get('/growth_api/v1/get_counts')
}

/**
 * @desc 免费抽奖次数
 * @returns {Promise<*>}
 * {
 *   free_count: Number 免费次数
 * }
 */
 function getLotteryConfig() {
  return service.get('/growth_api/v1/lottery_config/get')
}

/**
 * @desc 抽奖
 * @returns {Promise<*>}
 * {
 *   lottery_name: String 奖品名称
 * }
 */
 function drawLottery() {
  return service.post('/growth_api/v1/lottery/draw')
}

/**
 * @desc 当前矿石数
 * @returns {Promise<*>}
 * Number 矿石数量
 */
 function getCurrentPoint() {
  return service.get('/growth_api/v1/get_cur_point')
}

/**
 * @desc 围观大奖记录
 * @param page_no
 * @param page_size
 * @returns {Promise<*>}
 * {
 *   count: Number 数量
 *   lotteries: [
 *     {
 *       history_id: String 记录 ID
 *     }
 *   ]
 * }
 */
 function getLotteryHistory({ page_no = 1, page_size = 5 } = {}) {
  return service.post('/growth_api/v1/lottery_history/global_big', { page_no, page_size })
}

/**
 * @desc 沾喜气
 * @param lottery_history_id
 * @returns {Promise<*>}
 * {
 *   dip_value: Number 幸运值
 *   total_value: Number 总幸运值
 *   has_dip: Boolean 是否沾过
 * }
 */
 function dipLucky(lottery_history_id) {
  return service.post('/growth_api/v1/lottery_lucky/dip_lucky', { lottery_history_id })
}

module.exports = {
  getUser,
  getCounts,
  getCurrentPoint,
  getLotteryConfig,
  getTodayStatus,
  checkIn,
  dipLucky,
  getLotteryHistory,
  drawLottery
}