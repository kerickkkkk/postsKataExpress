const { log } = require('debug');
const express = require('express');
const router = express.Router();
const Post = require('../models/posts')

const {successHandler, errorHandler} = require('../service/responseHandler')
/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    const posts =  await Post.find({})
    successHandler(res, posts)
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
