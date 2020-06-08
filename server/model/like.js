const mongoose = require('mongoose')
// 创建模式
const likeSchema = {
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aritcle',
  },
  isLike: {
    type: Number,
    default: 0, //代表没有点赞
  },
}

//根据schema模式 创建 模型model
const likeModel = mongoose.model('Like', likeSchema)

module.exports = {
  likeModel,
}
