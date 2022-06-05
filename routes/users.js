const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/user')

router.get('/users', userControllers.getUsers)
router.post('/signUp', userControllers.signUp)

// router.post('/', userControllers.signUp);
// router.delete('/', userControllers.deletePosts);
// router.delete('/:id', userControllers.deletePost);
// router.patch('/:id', userControllers.patchPost);


module.exports = router
