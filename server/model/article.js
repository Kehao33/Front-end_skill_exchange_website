const mongoose = require('mongoose')


// 创建文章集合
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: [120, '文章标题字符数不能超过120'],
    minlength: [2, '文章标题指数不能小于2'],
    required: [true, '文章标题不能为空'],
  },
  // 文章的类型，如资源共享类型，数据结构，算法类型，前端动态新闻类型
  artType: {
    type: String,
    required: [true, '文章的类型不能为空'],
  },
  artTags: {
    type: String,
    required: [true, '文章的类型不能为空'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // 关联User
    required: [true, '文章作者不能为空'],
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  // 文章封面
  cover: {
    type: String,
    default: null,
  },
  content: {
    type: String,
    required: [true, '文章内容不能为空'],
  },
  // 阅读数
  readNumber: {
    type: Number,
    default: 0,
  },
  // 点赞数
  likeNumber: {
    type: Number,
    default: 0,
  },
  // 评论数
  commentNumber: {
    type: Number,
    default: 0,
  },
})

// 创建文章集合
const artModel = mongoose.model('Article', articleSchema)
module.exports = { artModel }
