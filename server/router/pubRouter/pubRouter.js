// 这是公共的路由，不需要路由拦截都可以请求

const express = require('express');
// 公共路由
const pubRouter = express.Router();
const md5 = require('blueimp-md5');
const svgCaptcha = require('svg-captcha'); //引入验证码依赖
const secretKey = 'JakeQu_font31218';

const { awaitWrap } = require('./../../tools');
const { userModel } = require('../../model/user');
const { artModel } = require('../../model/article');
const { commentModel } = require('../../model/comment');
const { likeModel } = require('../../model/like');

// 验证码配置
const codeConfig = {
  size: 4, // 验证码长度
  ignoreChars: '0o1i', // 验证码字符中排除 0o1i
  noise: 3, // 干扰线条的数量
  height: 38,
  width: 112,
  color: '#ff3300',
  background: '#fafafa',
  fontSize: 41,
};

// 注册时发送的验证码
pubRouter.get('/captcha', function (req, res) {
  const capTools = svgCaptcha.create(codeConfig);
  req.session.rightCaptcha = capTools.text.toLowerCase();
  res.type('svg');
  res.status(200).send(capTools.data);
});

pubRouter.get('/log-captcha', function (req, res) {
  const codeConfig = {
    size: 4, // 验证码长度
    ignoreChars: '0o1i', // 验证码字符中排除 0o1i
    noise: 3, // 干扰线条的数量
    height: 38,
    width: 112,
    color: '#ff3300',
    fontSize: 41,
  };
  const capTools = svgCaptcha.create(codeConfig);
  req.session.loginCaptcha = capTools.text.toLowerCase();
  // console.log('login:', req.session.loginCaptcha);
  res.type('svg');
  res.status(200).send(capTools.data);
});

// 用户注册处理路由
pubRouter.post('/register', function (req, res) {
  const { nickName, userEmail, captcha, userPwd, confirmPwd } = req.body;
  if (captcha.toLowerCase() !== req.session.rightCaptcha) {
    return res.status(200).json({ msg: '验证码有误，请重新输入!', isOk: 0 });
  }
  if (userPwd.length < 6 && confirmPwd.length > 18) {
    return res.status(200).json({ msg: '密码长度在6~18位区间!', isOk: 0 });
  }
  // 否则，清空验证码
  req.session.rightCaptcha = null;
  userModel.findOne({ userEmail }, function (err, doc) {
    if (userPwd !== confirmPwd || !userEmail) {
      // 400Bad Request客户端请求的语法错误
      return res
        .status(200)
        .json({ msg: '注册有误，请查看格式是否正确!', isOk: 0 });
    } else if (doc) {
      return res.status(200).json({ msg: '注册有误，邮箱已注册', isOK: 0 });
    } else {
      const userDoc = new userModel({
        nickName,
        userEmail,
        userPwd: md5(userPwd, secretKey),
      });
      userDoc.save(function (errorObj, data) {
        if (errorObj) {
          const err = errorObj.errors;
          let errMsg = '';
          for (var attr in err) errMsg += err[attr]['message'] + ' ';
          return res.status(200).json({ msg: errMsg, isOk: 0 });
          // return res.status(200).json('输入有误')
        } else {
          return res
            .status(200)
            .json({ msg: '注册成功', userRole: data.userRole, isOk: 1 });
        }
      });
    }
  });
});
// 用户登录处理路由
pubRouter.post('/login', function (req, res) {
  let { userEmail, userPwd, loginCaptcha } = req.body;
  if (loginCaptcha.toLowerCase() !== req.session.loginCaptcha) {
    return res.status(200).send({ msg: '验证码有误，请重新输入!', isOk: 0 });
  }

  if (!userPwd || !userEmail) {
    // 400Bad Request客户端请求的语法错误
    return res
      .status(200)
      .json({ msg: '登录有误，请查看格式是否正确!', isOk: 0 });
  }

  userModel.findOne({ userEmail }, function (err, doc) {
    if (err) {
      // 400Bad Request客户端请求的语法错误
      return res.status(200).json({ msg: '登录失败,请重新登录!', isOk: 0 });
    } else if (doc) {
      userPwd = md5(userPwd, secretKey);
      if (doc.userPwd === userPwd) {
        req.session.userObj = {
          userRole: doc.userRole,
          nickName: doc.nickName,
          userEmail: doc.userEmail,
          avatarUrl: doc.avatarUrl,
        };

        return res.status(200).json({
          msg: '登录成功',
          isOk: 1,
          loginUser: {
            _id: doc._id,
            nickName: doc.nickName,
            userEmail: doc.userEmail,
            userRole: doc.userRole,
            avatarUrl: doc.avatarUrl,
          },
        });
      } else {
        return res
          .status(200)
          .json({ msg: '密码不正确，请确认密码是否正确', isOK: 0 });
      }
    } else {
      return res.status(200).json({ msg: '账户不存在，请先进行注册', isOK: 0 });
    }
  });
});

// *************前端动态页面路由 START ************
pubRouter.get('/dynamic-article', async function (req, res) {
  let { count } = req.query;
  // 实现分部加载数据
  let skipNum = parseInt(count);
  const dynArt = await artModel
    .find({ artType: /前端动态/g })
    .skip(skipNum)
    .limit(3)
    .populate('author');
  // const numbers = await artModel.countDocuments({})
  return res
    .status(200)
    .send({ data: dynArt, msg: '请求前端动态文章成功', isOk: 1 });
});
// 获取热门文章
pubRouter.get('/hot-article', async function (req, res) {
  const { hotcount } = req.query;
  const hotArt = await artModel
    .find({})
    .sort({ readNumber: -1 })
    .limit(parseInt(hotcount))
    .populate('author');

  return res
    .status(200)
    .json({ data: hotArt, msg: '请求前端热门文章成功', isOk: 1 });
});

// 获取轮播图或者是跑马灯的文章
pubRouter.get('/carousel-article', async function (req, res) {
  const { carcount } = req.query;

  const carArt = await artModel
    .find({})
    .sort({ likeNumber: -1 })
    .limit(parseInt(carcount))
    .populate('author');

  return res
    .status(200)
    .json({ data: carArt, msg: '请求推荐文章成功', isOk: 1 });
});

// 根据文章的id展示文章的页面 article.jsx
pubRouter.get('/show-article', async function (req, res) {
  const { id } = req.query;
  const [updateErr, updateArt] = await awaitWrap(
    artModel.updateOne(
      { _id: id },
      {
        $inc: { readNumber: 1 },
      }
    )
  );
  const [artErr, showArt] = await awaitWrap(
    artModel.findById(id).populate('author')
  );
  const [likeErr, likeStatus] = await awaitWrap(
    likeModel.findOne({ articleId: id })
  );
  const [cntErr, comments] = await awaitWrap(
    commentModel.find({ articleId: id }).populate('authorId')
  );
  if (artErr || cntErr || updateErr) {
    return res.status(200).json({ data: [], msg: '获取文章信息失败', isOk: 0 });
  } else {
    return res
      .status(200)
      .json({
        showArt,
        likeStatus,
        comments,
        msg: '请求文章信息成功',
        isOk: 1,
      });
  }
});
// ************* 前端动态页面路由 END ************

// ************* 资源共享页面路由 START *********
pubRouter.get('/resource-article', async function (req, res) {
  // let { count } = req.query
  // 实现分部加载数据
  // let skipNum = parseInt(count)
  const resArt = await artModel
    .find({ artType: /资源共享/g })
    .populate('author');
  // const numbers = await artModel.countDocuments({})
  return res
    .status(200)
    .send({ data: resArt, msg: '请求资源共享文章成功', isOk: 1 });
});
// ************* 资源共享页面路由 END *********

// ************* 数据结构&算法路由 START *********
// 1. 请求数据结构的所有数据
pubRouter.get('/algorithm-article', async function (req, res) {
  let { reqtype, skipcount, reqcount } = req.query;
  const reqObj = {
    allData: /数据结构&算法/g,
    structData: /数据结构&算法,数据结构/g,
    algoData: /数据结构&算法,算法/g,
    otherData: /数据结构&算法,其他/g,
  };
  if (!reqObj.hasOwnProperty(reqtype)) {
    return res.status(200).send({ data: [], msg: '请求数据有误', isOk: 0 });
  }
  // 实现分部加载数据 ,
  // 出错2： 用户密码的敏感信息发送给了前端***********************
  let skipNum = parseInt(skipcount);
  let reqNum = parseInt(reqcount);
  const allArtNum = await artModel.countDocuments();
  if (skipNum + reqNum >= allArtNum) {
    return res.status(200).send({ data: [], msg: '已加载完所有数据', isOk: 0 });
  } else {
    const resArt = await artModel
      // .find({ artType: /(数据结构)|(算法)/g })
      .find({ artType: reqObj[reqtype] })
      .skip(skipNum)
      .limit(reqNum)
      .populate('author');
    resArt.forEach((item) => delete item.author.userPwd);
    // const numbers = await artModel.countDocuments({})
    return res
      .status(200)
      .send({ data: resArt, msg: '请求资源共享文章成功', isOk: 1 });
  }
});
// ************* 数据结构&算法路由 END ***********

module.exports = pubRouter;
