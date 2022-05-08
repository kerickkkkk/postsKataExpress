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

module.exports = {
    getPost,
    
}