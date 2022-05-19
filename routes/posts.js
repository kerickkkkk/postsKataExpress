const { log } = require('debug');
const express = require('express');
const router = express.Router();
const postControllers = require('../controllers/post')

router.get('/', postControllers.getPost);
router.post('/', postControllers.postPost);
router.delete('/', postControllers.deletePosts);
router.delete('/:id', postControllers.deletePost);
router.patch('/:id', postControllers.patchPost);


module.exports = router;
