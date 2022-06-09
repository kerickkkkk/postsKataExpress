const { log } = require('debug');
const express = require('express');
const router = express.Router();
const postControllers = require('../controllers/post')
const {isAuth} = require('../service/auth')

// 將所有的post都要過 isAuth
router.use(isAuth)

router.get('/:id', postControllers.getPost);
router.get('/', postControllers.getPosts);
router.post('/', postControllers.postPost);
router.delete('/', postControllers.deletePosts);
router.delete('/:id', postControllers.deletePost);
router.patch('/:id', postControllers.patchPost);

// 新增一則貼文的讚
router.post('/:id/like', postControllers.likePost)
// 取消一則貼文的讚
router.delete('/:id/like', postControllers.unlikePost)

// 取得個人所有貼文
router.get('/user/:id', postControllers.userPosts);

// 新增回復
router.post('/:id/comment', postControllers.comment)

module.exports = router;
