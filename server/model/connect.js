const mongoose = require('mongoose')
// 连接mongo并且使用immoc这个集合

const fontBlog_URL = 'mongodb://jakequc:jakequc@localhost:27017/fontBlog_datebase'

mongoose.set('useCreateIndex', true)
mongoose
  .connect(fontBlog_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('fontBlogDB connect success!'))
  .catch((err) => console.log('fontBlogDB connect fail...',err))
