const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user')

router.get('/', userControllers.getUsers);
router.post('/', userControllers.postUser);
// router.delete('/', userControllers.deletePosts);
// router.delete('/:id', userControllers.deletePost);
// router.patch('/:id', userControllers.patchPost);


module.exports = router;
