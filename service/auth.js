const jwt = require('jsonwebtoken')
const {successHandler} = require('../service/responseHandler')
const {handleErrorAsync, appError} = require('../service/errorHandler')
const User = require('../models/users')

const jwtGenerator = (user, statusCode = 200, res) => {
    const {_id: id, name} = user
    // 產出 jwt
    const token = jwt.sign({
        // 需要夾帶的內容
        id,
    }, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_DAY
    })
    
    user.password = null
    
    successHandler(res, {
        user:{
            token,
            name
        } 
    })
}

const isAuth = handleErrorAsync( async (req, res, next) => {
    // token 是否存在
    let token = null 
    if( req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    if( !token ){
        return next(
            appError(401, '您尚未登入', next)
        )
    }
    // token 是否正確
    const verified = await new Promise( (resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if(err){
                reject(err)
            }else{
                // 一些夾帶的資訊
                resolve(payload)
            }
        })
    })

    // 驗證通過取得資料
    const currentUser = await User.findById(verified.id)

    // 直接在資料上去往後傳
    req.user = currentUser
    next()
})

module.exports = {
    jwtGenerator, 
    isAuth,
}