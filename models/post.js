const mongoose = require('mongoose') 

const postSchema = new mongoose.Schema(
  {
    // name: {
    //   type: String,
    //   required: [ true, '名字必填']
    // },
    // avatar:{
    //   type: String,
    //   default: ''
    // },
    user: {
      type: mongoose.Schema.ObjectId,
      ref:"user",
      required: [true, '貼文 ID 未填寫']
    },
    content: {
      type: String,
      required: [ true, '內容不得為空']
    },
    image: {
      type: String, 
      default: ''
    },
    // 被按讚
    likes: {
      type: [String],
      default: []
    },
    createdAt:{
      type: Date,
      default: Date.now,
      select: false
    },
    updatedAt:{
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false
  }
)

const Post = mongoose.model( 'Post', postSchema )

module.exports = Post

