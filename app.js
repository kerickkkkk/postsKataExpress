const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')

const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const postRouter = require('./routes/post')

const connection = require('./connection/index.js');
connection()

const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/posts', postRouter)
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile))


module.exports = app;
