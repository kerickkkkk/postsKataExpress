const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/user')
const {isAuth} = require('../service/auth')

router.get('/', userControllers.getUsers)
router.post('/signUp', userControllers.signUp)
router.post('/signIn', userControllers.signIn)

router.get('/profile', isAuth , userControllers.getProfile)
router.patch('/profile', isAuth, userControllers.updateProfile)
router.patch('/updatePassword', isAuth, userControllers.updatePassword)

router.get('/likes', isAuth, userControllers.getLikes)

router.post('/:id/follow', isAuth, userControllers.follow)
router.delete('/:id/follow', isAuth, userControllers.unFollow)

router.get('/follows', isAuth, userControllers.getFollows)

module.exports = router
