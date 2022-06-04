const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts')
// dev or production 環境錯誤
const { resErrorDev, resErrorProd } = require('./service/errorHandler')
const connection = require('./connection/index.js');
connection()

const app = express();

process.on('uncaughtException', err => {
    // 記錄錯誤下來，等到服務都處理完後，停掉該 process
    console.error('Uncaughted Exception！')
    console.error(err);
    process.exit(1);
});

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile))
// 404 
app.use((req,res,next) => {
    res.status(404).send({
        status:"false",
        message:"您的路由不存在"
    })
})

app.use(function(err, req, res, next) {
    // dev
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === 'dev') {
        return resErrorDev(err, res);
    } 
    // production
    if (err.name === 'ValidationError'){
        err.message = "資料欄位未填寫正確，請重新輸入！"
        err.isOperational = true;
        return s(err, res)
    }
    resErrorProd(err, res)
});
// 未捕捉到的 catch 
process.on('unhandledRejection', (reason, promise) => {
    console.error('未捕捉到的 rejection：', promise, '原因：', reason);
    // 記錄於 log 上
});


module.exports = app;
