const { Schema, SchemaTypes, Model, model } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: SchemaTypes.String,
    minLength: 3,
    required: true
  },
  email: {
    type: SchemaTypes.String,
    required: true,
    unique: true
  },
  password: {
    type: SchemaTypes.String,
    required: true
  },
  date: {
    type: SchemaTypes.Date,
    default: Date.now
  }
})

module.exports = model('user', UserSchema)