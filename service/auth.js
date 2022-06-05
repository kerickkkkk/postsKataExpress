const jwt = require('jsonwebtoken')
const {successHandler} = require('../service/responseHandler')

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


module.exports = {
    jwtGenerator, 
}