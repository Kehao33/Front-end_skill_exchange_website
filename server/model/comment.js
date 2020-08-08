// 文章评论集合
const mongoose = require('mongoose')

// 创建评论文章集合规则
const commentSchema = {
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
  },
  commentDate: {
    type: Date,
  },
  content: {
    type: String,
  }
}

// 创建评论集合
const commentModel = mongoose.model('Comment', commentSchema)

module.exports = {
  commentModel,
}
