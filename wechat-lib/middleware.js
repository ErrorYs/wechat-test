const sha1 = require('sha1')
const getRawBody = require('raw-body')
const util = require('./util')
module.exports = (config) => {
  return async (ctx, next) => {
    // console.log(ctx.query)
    const {
      signature,
      timestamp,
      nonce,
      echostr
    } = ctx.query
    const token = config.token
    // console.log('token'+token)
    const str = [token, timestamp, nonce].sort().join('')
    const sha = sha1(str)
    if (ctx.method === 'GET') {
      if (sha === signature) {
        ctx.body = echostr
      } else {
        ctx.body = 'wrong'
      }
    } else if (ctx.method === 'POST') {
      if (sha !== signature) {
        // ctx.body = 'wrong'
        return ctx.body = 'wrong'
      }
      //发送消息
      const data = await getRawBody(ctx.req, {
        length: ctx.length,
        limit: '1mb',
        encoding: ctx.charset
      })
      const content = await util.parseXML(data)
      // console.log(content)
      const message = util.formatMessage(content.xml)
      console.log(message)
      ctx.status = 200
      ctx.type = 'appliaction/xml'
      const xml= `<xml>
      <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
      <CreateTime>${parseInt(new Date().getTime()/1000,0)}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${message.Content}]]></Content>
      <MsgId>${message.MsgId}</MsgId>
    </xml>`
    console.log(xml)
    ctx.body = xml
    }
  }
}