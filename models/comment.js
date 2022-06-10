const mongoose = require('mongoose') 

const commentSchema = new mongoose.Schema(
  {
    comment:{
      type: String,
      required:[true, '回覆為必填']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref:'user',
      required:[true, 'user id 不得為空']
    },
    post:{
      type: mongoose.Schema.ObjectId,
      ref:'post',
      required:[true, 'post id 不得為空']
    },
    createdAt:{
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
)

// // 有用到 pre 的部分先註解 有開搜尋功能在打開
commentSchema.pre('/^find/', function(next){
  this.populate({
    path: 'user',
    select: 'id name createdAt'
  })
  next()
})

const Comment = mongoose.model( 'comment', commentSchema )

module.exports = Comment

