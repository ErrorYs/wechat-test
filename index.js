const koa = require('koa')
const wechat = require('./wechat-lib/middleware')
const config = require('./config/config')

const app = new koa()

app.use(wechat(config.wechat))

app.listen(3006)
console.log('listen'+3006)