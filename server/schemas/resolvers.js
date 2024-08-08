const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

//FIXME
/**
 * Update typeDefs
 * 
 * Add book by user and general book queries 
 * 
 * Set saveBook and removeBook to save bookId's
 * removeBook should not delete associated ReadStatus, Rating, or Review
 * 
 * rateBook creates and or updates rating by user and returns updated book (avgRating is Updated).
 * reviewBook creates and or updates review by user and returns updated book.
 * setReaderStatus creates and or updates readerStatus by book and returns updated user.
 */

const resolvers = {
  Query: {
    me: async (parent, { id, username }, { user }) => {
      const userData = await User.findOne({
        $or: [{ _id: user ? user._id : id }, { username: username }],
      }).select("-__v -password");

      if (!userData) {
        throw new AuthenticationError("You need to be logged in!");
      }

      return userData;
    },
    getBook: async (parent, { bookId }) => {
      const bookData = await Book.findOne({ bookId }).select("-__v -ratings -reviews");

      if (!bookData) {
        throw new AuthenticationError("Book not found");
      }

      return bookData;
    },
    getBookByUser: async (parent, { bookId, id, username }, { user }) => {
      if (!user) {
        throw new AuthenticationError("You need to be logged in!");
      }
      
      const bookData = await Book.findOne({ bookId });

      if (!bookData) {
        throw new AuthenticationError("Book not found");
      }

      const userRating = bookData.ratings.find(rating => rating.username === user.username);
      const userReview = bookData.reviews.find(review => review.username === user.username);

      const bookDataWithUser = {
        ...bookData.select("-__v -ratings -reviews").toObject(),
        userRating: userRating ? userRating.rating : null,
        userReview: userReview ? userReview.review : null,
      };

      return bookDataWithUser;
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });

      if (!user) {
        throw new AuthenticationError("Something is wrong!");
      }

      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { bookData }, { user }) => {
      if (user) {
        return await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removeBook: async (parent, { bookId }, { user }) => {
      if (user) {
        return await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    rateBook: async (parent, { bookId, rating }, { user }) => {
      if (user) {
        return await User.findOneAndUpdate(
          { _id: user._id, "savedBooks.bookId": bookId },
          { $set: { "savedBooks.$.rating": rating } },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    reviewBook: async (parent, { bookId, review }, { user }) => {
      if (user) {
        return await User.findOneAndUpdate(
          { _id: user._id, "savedBooks.bookId": bookId },
          { $set: { "savedBooks.$.review": review } },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    setReaderStatus: async (parent, { bookId, readerStatus }, { user }) => {
      if (user) {
        return await User.findOneAndUpdate(
          { _id: user._id, "savedBooks.bookId": bookId },
          { $set: { "savedBooks.$.readerStatus": readerStatus } },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    }
  },
};

module.exports = resolvers;