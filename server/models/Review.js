const { Schema } = require("mongoose");

const reviewStatus = new Schema({
  review: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
});

module.exports = reviewStatus;