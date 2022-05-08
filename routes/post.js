const { log } = require('debug');
const express = require('express');
const router = express.Router();
const Post = require('../models/posts')
const postControllers = require('../controllers/post')

const {successHandler, errorHandler} = require('../service/responseHandler')
router.get('/', postControllers.getPost);

module.exports = router;
