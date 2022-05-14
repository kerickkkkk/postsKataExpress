const successHandler = ( res, data) => {
  // status 200 預設
  res.send({
    status : "success",
    data
  }).end()
}

const errorHandler = (res, statusCode = 500 , message = '有錯誤') => {
  res.status(statusCode).send({
    status : 'false',
    message
  }).end()
}

module.exports = {
  successHandler, 
  errorHandler
}