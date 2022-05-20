const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        title: "Swagger 測試中",
        description: "Swagger test Description"
    },
    // 要注意換過去 heroku 要換 或者要改用 env
    host: process.env.SWAGGERHOST,
    schemes: ['http','https'],
    securityDefinitions:{
        apiKeyAuth: {
            type: 'apiKey',
            in: 'headers',
            name: 'authorization',
            description : '請加上 API Token'
        }
    }
}


const outputFile = './swagger-output.json'

// 有支援兩個入口 但通常只有一個入口
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc)