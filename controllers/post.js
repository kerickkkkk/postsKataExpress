const { log } = require('debug/src/node')
const Post = require('../models/post')
const User = require('../models/users')
const Comment = require('../models/comment')
const {successHandler } = require('../service/responseHandler')
const { appError, handleErrorAsync } = require('../service/errorHandler.js')
const getPost = handleErrorAsync( async function(req, res, next) {
    const id = req.params.id

    if( !id ){
        return next(appError( 400, '沒有文章 ID', next))
    }
    const post =  await Post.findOne({_id: id})
    if( !post ){
        return next(appError( 400, '沒有文章 ID', next))
    }

    successHandler(res, post)
})

const getPosts = handleErrorAsync( async function(req, res, next) {
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
    // try {
        const posts =  await Post.find().populate({
            path: 'user',
            select: 'name avatar'
        }).populate({
            path: 'comments',
            select: 'comment user'
        })
        successHandler(res, posts)
    // } catch (error) {
    //     errorHandler(res, 400)
    // }
})


const postPost = handleErrorAsync( async function(req, res, next){
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
    // handleErrorAsync 集中 try catch 
    // try {
        const params = req.body
        // const { user :userId , content ,image = ''} = params
        // userId 改從 auth 送
        const userId = req.user.id
        const { content ,image = ''} = params
        if( !userId || !content) {
            // 寫法 v1.0
            // errorHandler( res, 400, '姓名 或者 內容不得為空')
            // return false
            return next(appError(400, '姓名或者內容不得為空', next))
        }
        const userData = await User.findOne( { _id : userId} )
        if( userData === null ){
            return next(appError(404, '沒有該使用者 ID', next))
        }

        const result = await Post.create( {
            user : userId ,
            content,
            image: image ? image : '',
        } )
        successHandler(res, result)

    // } catch (error) {
    //     errorHandler( res, 500, '伺服器有誤')
    // }
})

const deletePosts = handleErrorAsync( async function(req, res, next){
     /*
        #swagger.tags = ['Posts - 貼文']
        #swagger.description = '這是刪除全部貼文'
    */
    // try {
        await Post.deleteMany({})
        successHandler( res, `已刪除 全部 Posts`)
    // } catch (error) {
    //     errorHandler( res, 500, '有一些錯誤')
    // }
})
const deletePost = handleErrorAsync( async function(req, res, next){
    /*
        #swagger.tags = ['Posts - 貼文']
        #swagger.description = '這是刪除 單筆 貼文'
    */

        const {id} = req.params
        const findId = await Post.findOne({_id: {$in:[id]}})
        if(findId === null){
            return next(appError(400, '沒有該 Id', next))
        }
        const {_id} = await Post.findOneAndDelete({_id: id}, { runValidators: true  , new: true })
        successHandler(res, `已刪除ID : ${ _id}`)

})
const patchPost = handleErrorAsync( async function(req, res, next){
    /*
        #swagger.tags = ['Posts - 貼文']
        #swagger.security = [{
            apiKeyAuth : []
        }]
    */
        const {id} = req.params 
        const findId = await Post.findOne({_id: {$in:[id]}})
        if(findId === null){
            return next(appError(404, '沒有該 Id', next))
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

})

const likePost = handleErrorAsync( async function(req, res, next) {
    const userId = req.user.id
    const postId = req.params.id
    if( !userId || !postId) {
        return next(appError(400, '文章或使用者 id 有誤'))
    }

    const result = await Post.findByIdAndUpdate(
        postId, 
        {
            $addToSet: {
                likes : userId
            }
        }, 
        { runValidators: true  , new: true }
    )

    if(result === null) {
        return next( appError(404, '找不到文章', next))
    }

    successHandler( res, result)
})

const unlikePost = handleErrorAsync( async function(req, res, next) {
    const userId = req.user.id
    const postId = req.params.id
    if( !userId || !postId) {
        return next(appError(400, '文章或使用者 id 有誤'))
    }

    const result = await Post.findByIdAndUpdate(
        postId, 
        {
            $pull: {
                likes : userId
            }
        }, 
        { runValidators: true  , new: true }
    )

    if(result === null) {
        return next( appError(404, '找不到文章', next))
    }

    successHandler( res, result)
})
const userPosts = handleErrorAsync( async function(req, res, next) {
    const userId = req.params.id

    if( !userId ) {
        return next(appError(400, '文章或使用者 id 有誤'))
    }

    const posts = await Post.find(
        {user: userId}
    )

    if( !posts || posts.length === 0) {
        return next( appError(404, '找不到文章', next))
    }

    successHandler( res, {
        posts
    })
})

/*
* 新增回復
*/
const comment = handleErrorAsync( async function(req, res, next) {
    const userId = req.user.id
    const postId = req.params.id
    const {comment} = req.body

    if(!comment){
        return next(appError(400, '回文不能為空', next))
    }
    // 是否都每次都要去資料庫撈取是否有 ID 
    if(!postId || !userId){
        return next(appError(400, '使用者或文章不存在', next))
    }

    const newComment = await Comment.create({
        comment,
        user: userId,
        post: postId
    })

    successHandler(res, {
        comment: newComment
    })
    // const post = await Post.findByIdAndUpdate(
    //     postId,
    //     {
    //         $push:{
    //             comments: { user: userId, comment}
    //         }
    //     },
    //     { runValidators: true  , new: true }
    // ).populate({
    //     path: 'user',
    //     select: 'name avatar'
    // })

    if( !post) {
        return next(appError(400, '沒有該使用者', next))
    }
    successHandler(res, post)
})
module.exports = {
    getPost,
    getPosts,
    postPost,
    deletePosts, 
    deletePost, 
    patchPost,
    likePost,
    unlikePost,
    userPosts,
    comment
}