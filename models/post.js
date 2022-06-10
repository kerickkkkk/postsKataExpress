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
    likes:[
      { 
        type: mongoose.Schema.ObjectId, 
        ref: 'user' 
      }
    ],
    // 因為可能過多 抽出去
    // // 回復
    // comments:[
    //   {
    //     user: {
    //       type: mongoose.Schema.ObjectId,
    //       ref:"user",
    //       required: [true, '貼文 ID 未填寫']
    //     },
    //     content: {
    //       type: String,
    //       required: [ true, '內容不得為空']
    //     },
    //     createdAt:{
    //       type: Date,
    //       default: Date.now,
    //       select: false
    //     },
    //     updatedAt:{
    //       type: Date,
    //       default: Date.now,
    //     },
    //   }
    // ],
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
    versionKey: false,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  }
)

// 使用 virtual 的方式掛載
postSchema.virtual('comments',{
  ref: 'comment',
  foreignField: 'post',
  localField: '_id'
})

const Post = mongoose.model( 'post', postSchema )

module.exports = Post

