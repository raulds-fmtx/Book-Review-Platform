const { Schema } = require("mongoose");

const ratingSchema = new Schema({
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  username: {
    type: String,
    required: true,
  },
});

module.exports = ratingSchema;