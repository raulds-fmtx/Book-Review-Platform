const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const bookSchema = new Schema({
  authors: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  // saved book id from GoogleBooks
  bookId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  review: {
    type: String,
  },
  readerStatus: {
    /*
      0 : Unread
      1 : Actively reading
      2 : Completed
    */
    type: Number,
    required: true,
    min: 0,
    max: 2,
    default: 0,
  },
});

module.exports = bookSchema;
