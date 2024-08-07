const { Schema } = require("mongoose");

const reviewStatus = new Schema({
  readStatus: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
});

module.exports = reviewStatus;