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
      default: 'https://images.unsplash.com/photo-1654292598116-88416a1766cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80'
    },
    gender:{
      type: String,
      enum: ['male', 'female', 'noAccess'],
      default: 'noAccess'
    },
    password:{
      type: String,
      minlength: 8,
      required: [true, '請輸入密碼'],
      select: false
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

