const mongoose = require('mongoose') 

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [ true, '名字必填']
    },
    avatar:{
      type: String,
      default: ''
    },
    createdAt:{
      type: Date,
      default: Date.now,
    },
    content: {
      type: String,
      require: [ true, '內容不得為空']
    },
    image: {
      type: String, 
      default: ''
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  {
    versionKey: false
  }
)

const Post = mongoose.model( 'Post', postSchema )

module.exports = Post

