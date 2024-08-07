const { Schema } = require("mongoose");

const reviewStatus = new Schema({
  review: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

module.exports = reviewStatus;