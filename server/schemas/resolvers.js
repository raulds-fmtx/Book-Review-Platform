const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, {id, username}, { user }) => {
      const userData = await User
        .findOne({
          $or: [
            { _id: user ? user._id : id },
            { username: username },
          ],
        })
        .select("-__v -password")
        .populate("savedBooks");

      if (!userData) {
        throw new AuthenticationError("You need to be logged in!");
      }

      return userData;
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password});
      
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
      if (!user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id},
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