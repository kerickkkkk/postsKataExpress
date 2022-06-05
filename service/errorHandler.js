const handleErrorAsync = (func) => {
    // func 先將 async fun 帶入參數儲存
    // middleware 先接住 router 資料
    return (req, res, next) => {
        //再執行函式，並增加 catch 條件去捕捉
        // async 本身就是 promise，所以可用 catch 去捕捉
        func(req, res, next).catch(
            (error) => {
                return next(error)
            }
        );
    };
};

// 自己設定的 err 錯誤 
const resErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).send({
        message: err.message
        })
    } else {
        // log 紀錄
        console.error('出現重大錯誤', err);
        // 送出罐頭預設訊息
        res.status(500).send({
        status: 'error',
        message: '系統錯誤，請恰系統管理員'
        })
    }
};
// 開發環境錯誤
const resErrorDev = (err, res) => {
    res.status(err.statusCode).send({
        message: err.message,
        error: err,
        stack: err.stack
    })
}

// 自定義錯誤
const appError = (httpStatus, errMessage, next) => {
    const error = new Error(errMessage)
    error.statusCode = httpStatus
    error.isOperational = true
    next(error)
}

module.exports = {
    handleErrorAsync,
    resErrorProd,
    resErrorDev,
    appError
}