const bcrypt = require('bcryptjs')
const validator = require('validator')
const User = require('../models/users')
const Post = require('../models/post')
const {successHandler} = require('../service/responseHandler')
const {handleErrorAsync, appError} = require('../service/errorHandler')
const { jwtGenerator } = require('../service/auth')
const getUsers = handleErrorAsync(async function(req, res, next) {
    /*
        #swagger.tags = ['Users - 使用者']
        #swagger.description = '這是取得全部貼文'
        #swagger.responses[200] = {
            description: '使用者資訊',
            schema:
                {
                    "status": "success",
                    "data": [
                        {
                            name: 'test',
                            email : 'test@test.com',
                            avatar : ''
                        }
                    ]
                }
        }
    */

        const users =  await User.find({})
        successHandler(res, users)

})

const signUp = handleErrorAsync(async function(req, res, next) {

    /*
        #swagger.tags = ['Users - 使用者']
        #swagger.description = '新增使用者'
        #swagger.parameters:['body'] = {
            in: 'body',
            type: 'object',
            description: '資料格式',
            required : true,
            schema:{
                $name: 'test',
                $email : 'email@email.com',
                avatar: '這個是非必填'
            }
        }
        #swagger.responses[200] = {
            description: '使用者資訊',
            schema:
                {
                    "status": "success",
                    "data": [
                        {
                            name: 'test',
                            email : 'test@test.com',
                            avatar : ''
                        }
                    ]
                }
        }
    */
    const {name, email, password, confirmPassword} = req.body

    // 驗證是否為空
    if( !name || !email || !password || !confirmPassword){
        return next(appError(400,'欄位填寫有誤', next))
    }

    // 密碼是否相同
    if( password !== confirmPassword){
        return next(appError(400, '密碼不同', next))
    }

    // 密碼需八碼以上
    if(!validator.isLength(password, {min:8})){
        return next(appError(400, '密碼長度不得低於 8 碼', next))
    }

    if(!validator.isEmail(email)){
        return next(appError(400, 'email 格式錯誤', next))
    }

    // 通過

    // 密碼加密
    const bcryptPassword = await bcrypt.hash( password, 12)
    
    // 創建使用者
    const newUser = await User.create({
        name, email, 
        password : bcryptPassword, 
    })

    jwtGenerator( newUser, 200, res )

})

const signIn = handleErrorAsync(async function(req, res, next) {
    const {email, password} = req.body
    if( !email || !password) {
        return next(
            appError( 400, '欄位不得為空', next)
        )
    }

    if(!validator.isEmail(email)){
        return next(appError(400, 'email 格式錯誤', next))
    }

    const user = await User.findOne({
        email
    }).select('+password')

    if( user === null) {
        return next(appError(400, '欄位填寫有誤', next))
    }

    const auth = await bcrypt.compare(password, user.password)

    if(!auth){
        return next(appError(400, '欄位填寫有誤', next))
    }

    jwtGenerator( user , 200, res )

})
const getProfile = handleErrorAsync(async function(req, res, next) {
    successHandler( res, req.user)
})

const updatePassword = handleErrorAsync(async function(req, res, next) {
    const { password, confirmPassword } = req.body

    if( !password || !confirmPassword) {
        return next(appError( 400, '密碼不得為空', next))
    }

    if( password !== confirmPassword){
        return next(appError( 400, '密碼不同', next ))
    }

    const newPassword = await bcrypt.hash( password, 12)

    const user = User.findOneAndUpdate(req.user.id,{
        password : newPassword
    })

    jwtGenerator( user, 200, res )
})

const updateProfile = handleErrorAsync(async function(req, res, next) {
    const { name, avatar, gender } = req.body

    if( !name ) {
        return next(appError( 400, '名稱不得全為空', next))
    }

    // 這邊不知道有沒有比較好的處理方式
    // 目的是先過濾如果沒有值就不寫入
    const params = {}

    params.name = name

    if ( avatar ){
        params.avatar = avatar
    }

    if( gender ) {
        params.gender = gender
    }

    const user = await User.findByIdAndUpdate(req.user.id, 
        params, {
        runValidators: true,
        new: true,
    })
    
    successHandler(res, user)

})
const getLikes = handleErrorAsync(async function(req, res, next) {
    const likes = await Post.find({
        likes: {
            $in: [req.user.id]
        }
    })
    
    successHandler( res, likes)
})
const follow = handleErrorAsync(async function(req, res, next) {
    const followId = req.params.id

    // 確認是否存在
    const userExist = await User.exists({_id: followId}) 
    if(userExist === null){
        return next( appError( 404, '使用者不存在', next))
    }
    // addToSet 會有重複加入的問題

    await User.updateOne(
        {
            _id: req.user.id,
            'follows.user': { $ne: followId },
        },
        {
            $push:{
                follows: {user:followId}
            }
        }
    )

    await User.updateOne(
        {
            _id: followId ,
            'followers.user': { $ne: req.user.id},
        },
        {
            $push:{
                followers: {user: req.user.id}
            }
        }
    )


    successHandler( res, {
        userId: req.user.id,
        followId
    })
})
const unFollow = handleErrorAsync(async function(req, res, next) {
    const followId = req.params.id
    // 確認是否存在
    const userExist = await User.exists({_id: followId}) 
    if(userExist === null){
        return next( appError( 404, '使用者不存在', next))
    }
    // addToSet 會有重複加入的問題

    await User.findOneAndUpdate(
        {
            _id: req.user.id,
        },
        {
            $pull:{
                follows: { user : followId}
            }
        }
    )

    await User.findOneAndUpdate(
        {
            _id: followId,
        },
        {
            $pull:{
                followers: { user : req.user.id}
            }
        }
    )
    successHandler( res, {
        userId: req.user.id,
        followId
    })
})

const getFollows = handleErrorAsync(async function(req, res, next) {
    const id = req.user.id
    // 是否要再過濾

    if(!id){
        return next(appError(404, '使用者不存在', next))
    }
    
    const user = await User.findOne({_id: id})
        .populate({
            path: 'follows.user',
            select: '_id name avatar'
        })
    if( !user ) {
        return next(appError(404, '使用者不存在', next))
    }

    const follows = user.follows.map( follow => {
        const {user, createdAt} = follow
        const {_id, name, avatar} = user

        return {
            _id, name, avatar, createdAt 
        }
    })
    successHandler( res, follows)
})

module.exports = {
    getUsers,
    signUp,
    signIn,
    getProfile,
    updatePassword,
    updateProfile,
    getLikes,
    follow,
    getFollows,
    unFollow,
}