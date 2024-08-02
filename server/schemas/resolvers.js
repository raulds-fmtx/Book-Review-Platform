const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, { user }) => {
      if (!user) {
        throw new AuthenticationError("You need to be logged in!");
      }
      const userData = await User.findById(user._id).select('-__v -password').populate('savedBooks');
      return userData;
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password});
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
      if (!user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $addToSet: { savedBooks: bookData } },
        { new: true }
      ).populate('savedBooks');

      return updatedUser;
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;