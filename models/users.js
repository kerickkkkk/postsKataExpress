const mongoose = require('mongoose') 

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [ true, '請輸入姓名']
    },
    email: {
      type: String,
      required : [ true, '請輸入您的 Email'],
      unique: true,
      // find: {+email}
      select: false
    },
    avatar:{
      type: String,
      default: ''
    },
    createdAt:{
      type: Date,
      default: Date.now,
      select: false
    },
  },
  {
    versionKey: false
  }
)

const User = mongoose.model( 'user', userSchema )

module.exports = User

