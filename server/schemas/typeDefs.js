const { gql } = require("apollo-server-express");
// added donation mutation under auth

// type DonationResponse {
//   success: Boolean!
//   message: String
// }
const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    savedBooks: [Book]
  }

  type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
    rating: Int
    review: String
  }

  input BookInput {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
    rating: Int
    review: String
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
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
    rateBook(bookId: String!, rating: Int!): User
    reviewBook(bookId: String!, review: String!): User
  }
`;

module.exports = typeDefs;