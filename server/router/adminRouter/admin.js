const express = require('express')
const { artModel } = require('./../../model/article')
const { userModel } = require('./../../model/user')
// const showdown = require('showdown')
const md5 = require('blueimp-md5')
const secretKey = 'JakeQu_font31218'
const { awaitWrap } = require('./../../tools')
const adminRouter = express.Router()

adminRouter.get('/all-article', async function (req, res) {
  const [err, result] = await awaitWrap(artModel.find({}).populate('author'))
  if (err) {
    return res
      .status(200)
      .json({ data: [], msg: '请求数据失败,请重新操作', isOk: 0 })
  } else {
    return res.status(200).json({ data: result, msg: '请求数据成功', isOk: 1 })
  }
})

adminRouter.get('/all-user', async function (req, res) {
  const [err, result] = await awaitWrap(userModel.find({}))
  if (err) {
    return res
      .status(200)
      .json({ data: [], msg: '请求数据失败,请重新操作', isOk: 0 })
  } else {
    return res
      .status(200)
      .json({ data: result, msg: '请求用户数据成功', isOk: 1 })
  }
})

adminRouter.post('/delete-byuid', async function (req, res) {
  const { uid } = req.body
  const [err, result] = await awaitWrap(userModel.deleteOne({ _id: uid }))
  if (err) {
    return res.status(200).json({ data: [], msg: '删除用户失败', isOk: 0 })
  } else {
    return res
      .status(200)
      .json({ data: result, msg: '删除用户数据成功', isOk: 1 })
  }
})
adminRouter.post('/adduser', async function (req, res) {
  const { userEmail, userPwd, nickName, userRole, state, confirmPwd } = req.body
  const isEqual = userPwd === confirmPwd

  const [findErr, hasUser] = await awaitWrap(userModel.findOne({ userEmail }))
  if (findErr || !isEqual) {
    return res.status(200).json({ data: [], msg: '添加用户失败', isOk: 0 })
  }
  if (hasUser) {
    return res.status(200).json({ data: [], msg: '添加用户已存在', isOk: 0 })
  } else {
    const [createErr, result] = await awaitWrap(
      userModel.create({
        userEmail,
        userPwd: md5(userPwd, secretKey),
        nickName,
        userRole,
        state,
      })
    )
    if (createErr) {
      return res.status(200).json({ data: [], msg: '添加用户失败', isOk: 0 })
    } else
      return res
        .status(200)
        .json({ data: result, msg: '添加用户数据成功', isOk: 1 })
  }
})
adminRouter.post('/modify-user', async function (req, res) {
  const { uid } = req.body
  const [err, result] = await awaitWrap(
    userModel.updateOne({ _id: uid }, req.body)
  )
  if (err) {
    return res.status(200).json({ data: [], msg: '修改用户失败', isOk: 0 })
  } else {
    return res
      .status(200)
      .json({ data: result, msg: '修改用户数据成功', isOk: 1 })
  }
})

module.exports = adminRouter
