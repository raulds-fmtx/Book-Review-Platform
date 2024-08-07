const { Schema, model } = require('mongoose');
const { ratingSchema } = require('./Rating');

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
    avgRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    ratings: [ratingSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Book = model('Book', bookSchema);

module.exports = Book;
