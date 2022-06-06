const express = require('express');
const router = express.Router();
const {isAuth} = require('../service/auth')
const {upload} = require('../service/image')
const {successHandler} = require('../service/responseHandler')
const {handleErrorAsync, appError} = require('../service/errorHandler')
const sizeOf = require('image-size')
const { ImgurClient } = require('imgur');
router.post('/', isAuth, upload, handleErrorAsync( async (req, res, next) => {
    
    if( !req.files.length ){
        return next( appError(400, '沒有檔案上傳', next))
    }
    const dimensions = sizeOf(req.files[0].buffer)

    if( dimensions.width !== dimensions.height ){
        return next( appError(400, '圖片長寬應為 1:1', next))
    }

    const client = new ImgurClient({
        clientId: process.env.IMGUR_CLIENTID,
        clientSecret: process.env.IMGUR_CLIENT_SECRET,
        refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });

    const imgurResponse = await client.upload({
        image: req.files[0].buffer.toString('base64'),
        type: 'base64',
        album: process.env.IMGUR_ALBUM_ID
    });
    
    successHandler(res, imgurResponse.data.link)

})) ;


module.exports = router;