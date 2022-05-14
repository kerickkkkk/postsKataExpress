const { log } = require('debug/src/node')
const Post = require('../models/posts')
const {successHandler, errorHandler } = require('../service/responseHandler')
const getPost = async function(req, res, next) {
    try {
        const posts =  await Post.find({})
        successHandler(res, posts)
    } catch (error) {
        errorHandler(res, 400, )
    }
}
const postPost = async function(req, res, next){
    try {
        const params = req.body
        const { name, content } = params
        if( !name || !content) {
            errorHandler( res, 400, '姓名 或者 內容不得為空')
            return false
        }
        const result = await Post.create( params )
        successHandler(res, result)
    } catch (error) {
        errorHandler( res, 500, '伺服器有誤')
    }
}

const deletePosts = async function(req, res, next){
    try {
        await Post.deleteMany({})
        successHandler( res, `已刪除 全部 Posts`)
    } catch (error) {
        errorHandler( res, 500, '有一些錯誤')
    }
}
const deletePost = async function(req, res, next){
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