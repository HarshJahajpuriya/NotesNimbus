const { Schema, SchemaTypes, model } = require("mongoose");

const NoteSchema = new Schema({
  user: {
    type: SchemaTypes.ObjectId,
    ref: 'user'
  },
  title: {
    type: SchemaTypes.String,
    minLength: 3,
    required: true
  },
  description: {
    type: SchemaTypes.String,
    minLength: 5,
    required: true
  },
  tag: {
    type: SchemaTypes.String,
    default: "General"
  },
  date: {
    type: SchemaTypes.Date,
    default: Date.now
  }
})

module.exports = model('note', NoteSchema);