const multer  = require('multer')
const path = require('path')

const upload = multer({
    limits:{
        fileSize : 2*1024*1024,
    },
    fileFilter (req, file, cb){
        const ext = path.extname(file.originalname).toLocaleLowerCase()
        if( ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            cb(new Error(
                "檔案格式錯誤，檔案僅接受 jpg、jpeg、png"
            ))
        }
        cb(null, true)
    }
}).any()

module.exports = {
    upload
}
