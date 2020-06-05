const mongoose = require('mongoose')
const Joi = require('joi')
const { artModel } = require('./article')
// 创建用户集合规则
const userSchema = new mongoose.Schema({
  nickName: {
    type: String,
    required: [true, '用户名不合法'],
    minlength: 2,
    maxlength: 20,
    trim: true,
  },
  realName: {
    type: String,
    minlength: [2, '用户名字长度有误'],
    maxlength: [20, '用户名字长度有误'],
    default: '未设置',
    trim: true,
  },
  userEmail: {
    type: String,
    // 保证邮箱地址插入数据库的时候不重复
    unique: true,
    required: [true, '用户邮箱不能为空'],
    trim: true,
  },
  userPwd: {
    type: String,
    required: [true, '用户密码不能为空'],
    minlength: 1,
    trim: true,
  },
  // admin 超级管理员， normal： 普通用户
  userRole: {
    type: String,
    required: [true, '用户角色不能为空'],
    default: 'normal',
  },
  // 启用状态
  state: {
    type: Boolean,
    default: true,
  },
  // 用户头像
  avatarUrl: {
    type: String,
    default: '',
  },
  // 个性签名
  signature: {
    type: String,
    default: '还未设置个性签名',
    trim: true,
  },
  brief: {
    type: String,
    default: '还未设置个人简介哦',
    trim: true,
  },
  firm: {
    type: String,
    default: '还未设置就职状态哦',
    trim: true,
  },
  contact: {
    type: String,
    default: '还未设置联系方式哦',
    trim: true,
  },
})

//创建集合
const userModel = mongoose.model('User', userSchema)

// // // 添加一个user对象
// const JakeQuDoc = new userModel({
//   nickName: 'JakeQu',
//   realName: 'JakeQu',
//   userEmail: 'JakeQu@email.com',
//   userPwd: 'JakeQu',
//   userRole: 'admin',
//   state: true,
//   avatarUrl: null,
//   signature: '每天都做最勇敢的自己!',
// })
// // 将创建的集合保存在
// let kehaoObj
// userModel.findOne({ userEmail: 'kehao@email.com' }, function (err, doc) {
//   kehaoObj = doc._id
//   console.log('doc', doc)
//   console.log('doc._id', doc._id)
// })
// const artDoc = artModel.create({
//   title: 'typeScript',
//   artType: 'typeScript',
//   author: '5eb50fe8c3e27d42b898395f',
//   cover: null,
//   content: '这篇文章我爱死了aaaa',
//   readNumber: 111,
//   likeNumber: 111,
//   commentNumber: 111,
// })
// console.log('artDoc: ', artDoc)

// userModel.findOne({ userEmail: JakeQuDoc.userEmail }, function (err, doc) {
//   if (err) {
//     console.log('jakeSave: ', err)
//   } else if (doc) {
//     console.log('res: ', doc, ' , 该用户已经存在')
//   } else {
//     JakeQuDoc.save(function (err, data) {
//       if (err) {
//         console.log('save err: ', err)
//       } else {
//         console.log('save success')
//       }
//     })
//   }
// })

const validateUser = (user) => {
  // 定义对象的验证规则
  const schema = {
    nickName: Joi.string()
      .min(2)
      .max(16)
      .required()
      .error(new Error('用户名不符合规范')),
    realName: Joi.string()
      .min(2)
      .max(16)
      .error(new Error('用户真名不符合规范')),
    userEmail: Joi.email().required().error(new Error('邮箱地址格式不正确')),
    userPwd: Joi.string()
      .regex(/^[a-zA-Z0-9@.#$]{1,20}$/)
      .required()
      .error(new Error('密码格式不正确!')),
    userRole: Joi.string()
      .valid('normal', 'admin')
      .required()
      .error(new Error('用户角色身份不正确!')),
    state: Joi.boolean()
      .valid(true, false)
      .required()
      .error(new Error('用户启用状态不合法')),
    signature: Joi.string()
      .min(1)
      .max(30)
      .error(new Error('用户个性签名格式有误')),
  }
  // user格式是否和所定义的schema符合
  return Joi.validate(user, schema)
}

// 将用户集合作为模块成员进行导出
module.exports = {
  userModel,
  validateUser,
}
