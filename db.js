const mongoose = require('mongoose');

const connectToMongo = async () => {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:27017/notes-nimbus`)
    console.log('Connected to Mongo successfully')
  } catch(err) {
    console.error(err.message)
  }
}

module.exports = connectToMongo;