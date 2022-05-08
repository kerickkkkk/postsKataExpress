const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './.env'})

const DATABASE = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)
// const DATABASE = 'mongodb://localhost:27017/posts'

function connection(){
  mongoose.connect(DATABASE)
    .then(() => console.log('DB connected'))
    .catch( (e) => console.log(`DB connect error: ${e}` ))
}

module.exports = connection
