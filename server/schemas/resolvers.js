const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
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
    getBook: async (parent, { bookId }) => {
      const bookData = await Book.findOne({ bookId }).select("-ratings -reviews");

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
        ...bookData.select("-ratings -reviews").toObject(),
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
    saveBook: async (parent, { bookId }, { user }) => {
      if (user) {
        return await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: bookId } },
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
      if (!user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      // Fetch the book information
      const bookData = await Book.findOne({ bookId });

      if (!bookData) {
        throw new Error("Book not found");
      }

      // Find the user's rating if it exists
      const userRating = bookData.ratings.find(
        (r) => r.username === user.username
      );

      if (userRating) {
        // Update the existing rating
        userRating.rating = rating;
      } else {
        // Create a new rating
        bookData.ratings.push({ rating, username: user.username });
      }

      // Save the updated book document
      const updatedBook = await bookData.save();

      // Extract the specific user's rating and review for return
      const userReview = updatedBook.reviews.find(
        (review) => review.username === user.username
      );

      const updatedBookData = {
        ...updatedBook.select("-ratings -reviews").toObject(),
        userRating: rating,
        userReview: userReview ? userReview.review : null,
      };

      return updatedBookData;
    },
    reviewBook: async (parent, { bookId, review }, { user }) => {
      if (!user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      // Fetch the book information
      const bookData = await Book.findOne({ bookId });

      if (!bookData) {
        throw new Error("Book not found");
      }

      // Find the user's rating if it exists
      const userReview = bookData.reviews.find(
        (r) => r.username === user.username
      );

      if (userReview) {
        // Update the existing review
        userReview.review = review;
      } else {
        // Create a new review
        bookData.reviews.push({ review, username: user.username });
      }

      // Save the updated book document
      const updatedBook = await bookData.save();

      // Extract the specific user's rating and review for return
      const userRating = updatedBook.ratings.find(
        (rating) => rating.username === user.username
      );

      const updatedBookData = {
        ...updatedBook.select("-ratings -reviews").toObject(),
        userRating: userRating ? userRating.rating : null,
        userReview: review,
      };

      return updatedBookData;
    },
    setReaderStatus: async (parent, { bookId, readStatus }, { user }) => {
      if (!user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      // Fetch the user information, excluding the password
      const userData = await User.findOne({ _id: user._id });

      if (!userData) {
        throw new Error("User not found");
      }

      // Find the read status for the book if it exists
      const existingReadStatus = userData.readStatuses.find(
        (rs) => rs.bookId === bookId
      );

      if (existingReadStatus) {
        // Update the existing read status
        existingReadStatus.readStatus = readStatus;
      } else {
        // Create a new read status
        userData.readStatuses.push({ bookId, readStatus });
      }

      // Save the updated user document
      const updatedUser = await userData.save();

      // Exclude the password from the returned user object if it's still present
      const result = updatedUser.toObject();
      delete result.password;

      return result;
    }
  },
};

module.exports = resolvers;