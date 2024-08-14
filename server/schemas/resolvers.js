const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

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
        ).select("-__v -password");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removeBook: async (parent, { bookId }, { user }) => {
      if (user) {
        return await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        ).select("-__v -password");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    rateBook: async (parent, { bookId, rating }, { user }) => {
      if (user) {
        return await User.findOneAndUpdate(
          { _id: user._id, "savedBooks.bookId": bookId },
          { $set: { "savedBooks.$.rating": rating } },
          { new: true }
        ).select("-__v -password");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    reviewBook: async (parent, { bookId, review }, { user }) => {
      if (user) {
        return await User.findOneAndUpdate(
          { _id: user._id, "savedBooks.bookId": bookId },
          { $set: { "savedBooks.$.review": review } },
          { new: true }
        ).select("-__v -password");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    setReaderStatus: async (parent, { bookId, readerStatus }, { user }) => {
      if (user) {
        return await User.findOneAndUpdate(
          { _id: user._id, "savedBooks.bookId": bookId },
          { $set: { "savedBooks.$.readerStatus": readerStatus } },
          { new: true }
        ).select("-__v -password");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    
  },
};

module.exports = resolvers;