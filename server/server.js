const express = require('express')
const userRouter = require('./router/userRouter/user')
const pubRouter = require('./router/pubRouter/pubRouter')
const adminRouter = require('./router/adminRouter/admin')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
const app = express()
const port = 9003

// 连接数据库
require('./model/connect')

// 处理post请求参数
app.use(bodyParser.urlencoded({ extended: false }))
// // parse application/json
app.use(bodyParser.json())
// 配置session ， secret：这个秘钥是可以自定义的，是用来加密客户端的信息，保证信息的安全性，服务器根据secret的值来解密
app.use(
  session({
    name: 'sessionKey',
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
    // 设置cookie的持续时间为 6个小时 ，即 6*60*60*1000毫秒
    cookie: {
      maxAge: 6 * 60 * 60 * 1000,
    },
  })
)

// 开放静态资源文件
app.use(express.static(path.join(__dirname, '../public')))

//  允许跨域访问服务器
app.all('*',(req,res,next)=>{
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods','*');
  res.header('Content-type','application/json;charset=utf-8')
  next();
})


// 做请求拦截
// app.use('/user', function (req, res, next) {
//   // 如果session上存在userObj，且用户角色为userRole那么就可以访问admin路由,反之
//   if (req.session.userObj) {
//     next()
//   } else {
//     return res.json({
//       data: [],
//       needLogin: 1,
//       msg: '请查看是否登录，或登录已失效需重新登录',
//       isOk: 0,
//     })
//   }
// })
// app.use('/admin', function (req, res, next) {
//   // 如果session上存在userObj，且用户角色为userRole那么就可以访问admin路由,反之
//   if (req.session.userObj && req.session.userObj.userRole === 'admin') {
//     next()
//   } else {
//     return res.json({
//       data: [],
//       needLogin: 1,
//       msg: '权限不够或登录已过期需重新登录',
//       isOk: 0,
//     })
//   }
// })

app.use('/public', pubRouter) // 公共路由
app.use('/user', userRouter)
app.use('/admin', adminRouter)

app.listen(port, () =>
  console.log(`listen ${port} port success! you can browser localhost:${port}`)
)

// userModel.findOne({ userEmail: JakeQuDoc.userEmail }, function (err, doc) {
//   if (err) {
//     console.log('jakeSave: ', err)
//   } else if (doc) {
//     console.log('res: ', doc, ' , 该用户已经存在')
//   } else {
//     JakeQuDoc.save(function (err, data) {
//       console.log('save success')
//     })
//   }
// })
