const bcrypt = require('bcryptjs')
const validator = require('validator')
const User = require('../models/users')
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


module.exports = {
    getUsers,
    signUp,
    signIn

}