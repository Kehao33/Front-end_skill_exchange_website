const express = require('express')
const path = require('path')
const uRouter = express.Router()
const md5 = require('blueimp-md5')
const showdown = require('showdown')
const formidable = require('formidable')
const secretKey = 'JakeQu_font31218'

const { awaitWrap } = require('./../../tools')
const { userModel } = require('../../model/user')
const { artModel } = require('../../model/article')
const { commentModel } = require('../../model/comment')
const { likeModel } = require('./../../model/like')

// 实现头像上传功能
uRouter.get('/logout', function (req, res) {
  //退出就是清除登录状态
  req.session.userObj = null
  // res.clearCookie('connect.sid')
  req.session.destroy()
  res.clearCookie('sessionKey')
  //重定向到登录页面
  return res.status(200).json({ msg: '退出成功', isOK: 1 })
})

// ********************* 用户中心 userCenter操作 START ************
// 修改用户的 昵称，密码路由
uRouter.post('/modify-pass', async function (req, res) {
  const { userEmail, oldPwd, userPwd, confirmPwd } = req.body
  let doc = await userModel.findOne({ userEmail })

  if (
    !doc ||
    userPwd !== confirmPwd ||
    md5(oldPwd, secretKey) !== doc.userPwd
  ) {
    // 400Bad Request客户端请求的语法错误
    return res
      .status(200)
      .json({ msg: '修改信息有误，请查检查是否输入正确!', isOk: 0 })
  } else {
    await userModel.updateOne(
      { userEmail },
      { userPwd: md5(userPwd, secretKey) }
    )

    return res
      .status(200)
      .json({ msg: '修改信息成功，需重新登录确认身份', isOK: 1 })
  }
})

// 用户修改文章
uRouter.post('/modifyArt', async function (req, res) {
  const { artId, title, content, artType, artTags } = req.body
  const converter = new showdown.Converter() //初始化转换器
  const htmlCon = converter.makeHtml(content)
  const [err, result] = await awaitWrap(
    artModel.updateOne(
      { _id: artId },
      {
        title,
        content: htmlCon,
        artType: artType.join(','),
        artTags: artTags.join(','),
      }
    )
  )
  if (err) {
    return res.status(200).json({ data: [], msg: '修改文章失败！', isOk: 0 })
  } else {
    return res.status(200).json({ data: [], msg: '修改文章成功', isOk: 1 })
  }
})
//  用户通过id来删除对应的文章
uRouter.post('/deleteArt', async function (req, res) {
  const { id } = req.body
  const [err, result] = await awaitWrap(artModel.deleteOne({ _id: id }))
  if (err) {
    return res.status(200).json({ data: [], msg: '删除文章失败！', isOk: 0 })
  } else {
    return res.status(200).json({ data: [], msg: '删除文章成功', isOk: 1 })
  }
})

// 根据用户的id信息获取该用户的所有文章
uRouter.get('/artinfo', async function (req, res) {
  const { id } = req.query
  const [err, result] = await awaitWrap(
    artModel.find({ author: id }).populate('author')
  )
  if (err) {
    return res.status(200).json({ data: [], msg: '请求信息有误', isOk: 0 })
  } else {
    return res
      .status(200)
      .json({ data: result, msg: '请求用户信息成功', isOk: 1 })
  }
})
// 根据用户的id获取用户的信息
uRouter.get('/uinfo', async function (req, res) {
  const { id } = req.query
  const [err, result] = await awaitWrap(userModel.find({ _id: id }))
  if (err) {
    return res.status(200).json({ data: [], msg: '请求信息有误', isOk: 0 })
  } else {
    return res
      .status(200)
      .json({ data: result, msg: '请求用户信息成功', isOk: 1 })
  }
})

// 用户完善信息，userCenter页面
uRouter.post('/update-userinfo', async function (req, res) {
  const { _id } = req.body
  const [err, result] = await awaitWrap(userModel.updateOne({ _id }, req.body))
  const [findErr, findRes] = await awaitWrap(userModel.findOne({ _id }))

  if (err) {
    return res.status(200).json({ data: [], msg: '完善个人信息失败', isOk: 0 })
  } else {
    if (findErr) {
      return res
        .status(200)
        .json({ data: [], msg: '服务器繁忙，请稍后操作', isOk: false })
    } else {
      const loginUser = {
        _id: findRes._id,
        nickName: findRes.nickName,
        userEmail: findRes.userEmail,
        userRole: findRes.userRole,
        avatarUrl: findRes.avatarUrl,
      }
      return res
        .status(200)
        .json({ data: loginUser, msg: '完善个人信息成功', isOk: 1 })
    }
  }
})
// ********************* 用户中心 userCenter操作 END ************

// 保存用户创作文章的保存
uRouter.post('/write', async function (req, res) {
  const { title, content, artTags, artType, author } = req.body
  const form = formidable({
    keepExtensions: true,
    multiples: true,
    uploadDir: path.join(__dirname, './../../../public/uploads'),
  })
  const converter = new showdown.Converter() //初始化转换器
  const htmlCt = converter.makeHtml(content)
  // form.parse(req, (err, fields, files) => {
  //   console.log('fields: ', fields)
  //   console.log('err: ', err)
  //   console.log('files: ', files)
  //   res.writeHead(200, { 'content-type': 'application/json' })
  //   res.end(JSON.stringify({ fields, files }, null, 2))
  // })

  if (
    title.trim().length !== 0 ||
    content.trim().length !== 0 ||
    artType.length <= 0 ||
    artTags.length <= 0
  ) {
    const artDoc = new artModel({
      title,
      artType: artType.join(','),
      artTags: artTags.join(','),
      author,
      content: htmlCt,
    })

    artDoc.save(function (errorObj, doc) {
      if (errorObj) {
        const err = errorObj.errors
        let errMsg = ''
        for (var attr in err) errMsg += err[attr]['message'] + ' '
        return res.status(200).json({ msg: errMsg, isOk: 0 })
        // return res.status(200).json('输入有误')
      } else {
        return res.status(200).json({ msg: '发布文章成功', isOk: 1 })
      }
    })
  } else
    return res.status(200).json({ msg: '发布文章失败,请重新操作', isOk: 0 })
})

// 修改用户的头像
uRouter.post('/change-avatar', async function (req, res) {
  const form = formidable({
    keepExtensions: true,
    multiples: true,
    uploadDir: path.join(__dirname, './../../../public/uploads/avatars'),
  })

  form.parse(req, async (err, fields, files) => {
    const [upErr, upRes] = await awaitWrap(
      userModel.updateOne(
        { _id: fields.uid },
        { avatarUrl: files.avatar.path.split('public')[1] }
      )
    )
    if (upErr) {
      return res.status(200).json({ data: [], msg: '修改头像失败', isOk: 0 })
    } else {
      return res.status(200).json({ data: [], msg: '修改头像成功', isOk: 1 })
    }
  })
})

// 给文章做评论操作,并且修改文章的评论数量
uRouter.post('/commentArt', async function (req, res) {
  const { articleId } = req.body
  const [err, result] = await awaitWrap(commentModel.create(req.body))
  const [upErr, upRes] = await awaitWrap(
    artModel.updateOne(
      {
        _id: articleId,
      },
      {
        commentNumber: await commentModel.countDocuments({
          articleId: articleId,
        }),
      }
    )
  )
  if (err || upErr) {
    return res.status(200).json({ data: [], msg: '评论文章失败', isOk: 0 })
  } else {
    return res.status(200).json({ data: [], msg: '评论文章成功', isOk: 1 })
  }
})

// add it before first git commit
// 根据文章点赞实现文章点赞数的修改
uRouter.post('/hit-like', async function (req, res) {
  const { authorId, articleId } = req.body
  const [findErr, findRes] = await awaitWrap(
    likeModel.find({ authorId, articleId })
  )
  // 如果没有找到这个评论记录，那么就创建一个评论，并更新文章集合中的点赞数量+1
  if (!findRes.length) {
    const [err, result] = await awaitWrap(
      likeModel.create({ ...req.body, isLike: 1 })
    )

    const [upErr, upRes] = await awaitWrap(
      artModel.updateOne({ _id: articleId }, { $inc: { likeNumber: 1 } })
    )

    if (findErr || err || upErr) {
      return res.status(200).json({ data: [], msg: '请刷新页面', isOk: 0 })
    } else {
      const showArt = await artModel.findOne({ _id: articleId })
      const comments = await commentModel
        .find({ articleId: articleId })
        .populate('authorId')
      return res.status(200).json({
        data: { isLike: result.isLike, showArt, comments },
        msg: '点赞成功',
        isOk: 1,
      })
    }
  } else {
    // 如果有点赞记录，则删除点赞记录，使文章集合的点赞数-1

    const [err, result] = await awaitWrap(likeModel.deleteOne(req.body))
    const [upErr, upRes] = await awaitWrap(
      artModel.updateOne({ _id: articleId }, { $inc: { likeNumber: -1 } })
    )

    if (findErr || err || upErr) {
      return res.status(200).json({ data: [], msg: '操作有误', isOk: 0 })
    } else {
      const comments = await commentModel
        .find({ articleId })
        .populate('authorId')
      const showArt = await artModel.findOne({ _id: articleId })
      return res.status(200).json({
        data: { isLike: 0, showArt, comments }, //表示取消点赞成功
        msg: '取消点赞成功',
        isOk: 1,
      })
    }
  }
})

module.exports = uRouter
