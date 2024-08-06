const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
    rating: Float
    review: String
    readerStatus: Int
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me(id: String, username: String): User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(
      bookId: String!
      authors: [String]
      description: String!
      title: String!
      image: String
      link: String
    ): User
    removeBook(bookId: String!): User
    rateBook(bookId: String!, rating: Float!): User
    reviewBook(bookId: String!, review: String!): User
    setReaderStatus(bookId: String!, readStatus: Int!): User
  }
`;

module.exports = typeDefs;