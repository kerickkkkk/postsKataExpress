const { log } = require('debug/src/node')
const Post = require('../models/post')
const User = require('../models/users')
const {successHandler, errorHandler } = require('../service/responseHandler')
const getPost = async function(req, res, next) {
    /*
        #swagger.tags = ['Posts - 貼文']
        #swagger.description = '這是取得全部貼文'
        #swagger.responses[200] = {
            description: '貼文資訊',
            schema:
                {
                    "status": "success",
                    "data": [
                        {
                        "_id": "627f4397ec70054e1b5d05bf",
                        "name": "heroku",
                        "avatar": "https://images.unsplash.com/photo-1650493102777-cf317788cc95?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
                        "content": "第 2 筆",
                        "image": "https://images.unsplash.com/photo-1650493102777-cf317788cc95?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
                        "likes": 0,
                        "createdAt": "2022-05-14T05:52:23.719Z"
                        }
                    ]
                }
        }
    */
    try {
        const posts =  await Post.find({}).populate({
            path: 'user',
            select: 'name avatar'
        })
        successHandler(res, posts)
    } catch (error) {
        errorHandler(res, 400, )
    }
}
const postPost = async function(req, res, next){
    /*
        #swagger.tags = ['Posts - 貼文']
        #swagger.description = '新增貼文'
        #swagger.parameters:['body'] = {
            in: 'body',
            type: 'object',
            description: '資料格式',
            required : true,
            schema:{
                $user: '6286523ded1afb268771d4bd',
                $content : '這個是內容',
                image: '圖片不一定要傳',
            }
        }
        #swagger.responses[200] = {
            description: '貼文資訊',
            schema:
                {
                    "status": "success",
                    "data": [
                        {
                            "_id": "628669afb29d167f03a74412",
                            "user": "6286523ded1afb268771d4bd",
                            "content": "AAAAAA",
                            "image": "圖片不一定要傳",
                            "likes": []
                        }
                    ]
                }
        }
    */
    try {
        const params = req.body
        const { user :userId , content ,image = ''} = params
        if( !userId || !content) {
            errorHandler( res, 400, '姓名 或者 內容不得為空')
            return false
        }
        const userData = await User.findOne( { _id : userId} )
        if( userData === null ){
            errorHandler( res, 404, '沒有該使用者 ID')
            return false
        }

        const result = await Post.create( {
            user : userId ,
            content,
            image: image ? image : '',
        } )
        successHandler(res, result)

    } catch (error) {
        errorHandler( res, 500, '伺服器有誤')
    }
}

const deletePosts = async function(req, res, next){
     /*
        #swagger.tags = ['Posts - 貼文']
        #swagger.description = '這是刪除全部貼文'
    */
    try {
        await Post.deleteMany({})
        successHandler( res, `已刪除 全部 Posts`)
    } catch (error) {
        errorHandler( res, 500, '有一些錯誤')
    }
}
const deletePost = async function(req, res, next){
    /*
        #swagger.tags = ['Posts - 貼文']
        #swagger.description = '這是刪除 單筆 貼文'
    */
    try {
        const {id} = req.params
        const findId = await Post.findOne({_id: {$in:[id]}})
        if(findId === null){
            errorHandler(res, 404, '沒有該 Id')
            return false 
        }
        const {_id} = await Post.findOneAndDelete({_id: id}, { runValidators: true  , new: true })
        successHandler(res, `已刪除ID : ${ _id}`)
    } catch (error) {
        errorHandler(res, 404, '查無此ID')
    }
}
const patchPost = async function(req, res, next){
    /*
        #swagger.tags = ['Posts - 貼文']
        #swagger.security = [{
            apiKeyAuth : []
        }]
    */
    try {
        const {id} = req.params 
        // 發現用 findOne 會找到相似的 id 目前先用這個方式 不確定有其他的方式可以比對百分之百的 id
        const findId = await Post.findOne({_id: {$in:[id]}})
        if(findId === null){
            errorHandler(res, 404, '沒有該 Id')
            return false 
        }
        const paramAry = ['name', 'avatar', 'content', 'image']
        const params = paramAry.reduce((prev, next) => {
            if(req.body[next]){
                prev[next] = req.body[next]
            }
            return prev
        },{})

        const result = await Post.findByIdAndUpdate(id, params, { runValidators: true  , new: true })
        successHandler(res, result)

    } catch (error) {
        errorHandler(res, 400, '有一些錯誤')
    }
}


module.exports = {
    getPost,
    postPost,
    deletePosts, 
    deletePost, 
    patchPost,
}