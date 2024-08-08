const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    savedBooks: [String]
    readStatuses: [ReadStatus]
  }

  type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
    avgRating: Float
  }

  type BookWithUserDetails {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
    avgRating: Float
    userRating: Int
    userReview: String
  }

  type Rating {
    rating: Int!
    username: String!
  }

  type Review {
    review: String!
    username: String!
  }

  type ReadStatus {
    readStatus: Int!
    bookId: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me(id: String, username: String): User
    getBook(bookId: String!): Book
    getBookByUser(bookId: String!, id: String, username: String): BookWithUserDetails
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookId: String!): User
    removeBook(bookId: String!): User
    rateBook(bookId: String!, rating: Int!): BookWithUserDetails
    reviewBook(bookId: String!, review: String!): BookWithUserDetails
    setReaderStatus(bookId: String!, readStatus: Int!): User
  }
`;

module.exports = typeDefs;