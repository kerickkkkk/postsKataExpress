const User = require('../models/users')
const {successHandler, errorHandler } = require('../service/responseHandler')
const getUsers = async function(req, res, next) {
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
    try {
        const users =  await User.find({})
        successHandler(res, users)
    } catch (error) {
        errorHandler(res, 400, )
    }
}

const postUser = async function(req, res, next) {
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
    try {
        const {name, email, avatar = ''} = req.body
        const result = await User.create({
            name, email, avatar
        })
        successHandler(res, result) 
    } catch (error) {
        errorHandler(res, 500 )
    }
}

module.exports = {
    getUsers,
    postUser

}