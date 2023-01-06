const axios = require('axios')
const { PUSH_PLUS_TOKEN } = require('./ENV')
const PUSH_URL = 'http://www.pushplus.plus/send' // pushplus 推送api

function handlePush({message, type = 'info'}) {
  axios.post(PUSH_URL, {
    token: PUSH_PLUS_TOKEN,
    template: 'markdown',
    title: type === 'info' ? '签到成功' : '签到失败',
    content: message
  })
}

module.exports = handlePush
