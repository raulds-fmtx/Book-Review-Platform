const { Schema } = require("mongoose");

const readStatusSchema = new Schema({
  readStatus: {
    /**
     * 0 : Unread
     * 1 : Actively Reading
     * 2 : Completed
     */
    type: Number,
    min: 0,
    max: 2,
    default: 0,
  },
  bookId: {
    type: String,
    required: true,
  },
});

module.exports = readStatusSchema;