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
        if( id ){
            await Post.findByIdAndDelete(id)
            successHandler(res, `已刪除ID : ${ id}`)
        }else{
            errorHandler(res, 400, 'ID有誤')
        }
    } catch (error) {
        errorHandler(res, 404, '查無此ID')
    }
}
const patchPost = async function(req, res, next){
    try {
        const {id} = req.params
        const params = req.body
        if( id ){
            const result = await Post.findByIdAndUpdate(id, params)
            successHandler(res, result)
        }else{
            errorHandler(res, 400, 'ID 或 內容有誤')
        }

    } catch (error) {
        errorHandler(res, 400, error)
    }
}


module.exports = {
    getPost,
    postPost,
    deletePosts, 
    deletePost, 
    patchPost,
}