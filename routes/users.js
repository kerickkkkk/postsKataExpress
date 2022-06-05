const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/user')
const {isAuth} = require('../service/auth')

router.get('/', userControllers.getUsers)
router.post('/signUp', userControllers.signUp)
router.post('/signIn', userControllers.signIn)

router.get('/profile', isAuth , userControllers.getProfile)
// router.post('/', userControllers.signUp);
// router.delete('/', userControllers.deletePosts);
// router.delete('/:id', userControllers.deletePost);
// router.patch('/:id', userControllers.patchPost);


module.exports = router
