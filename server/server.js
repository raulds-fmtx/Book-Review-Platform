// Import the Express framework, which is used for building web applications and APIs
const express = require("express");

// Import the built-in Path module from Node.js, which provides utilities for working with file and directory paths
const path = require("path");

// Import the database connection configuration from a local file
const db = require("./config/connection");

// Import ApolloServer from the apollo-server-express package for setting up a GraphQL server
const { ApolloServer } = require("apollo-server-express");

// Import type definitions and resolvers for the GraphQL schema
const { typeDefs, resolvers } = require("./schemas");

// Import authentication middleware for securing the GraphQL context
const { authMiddleware } = require("./utils/auth");

const app = express();
const PORT = process.env.PORT || 3001;

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, authMiddleware }),
  });

  await server.start();
  server.applyMiddleware({ app });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });
  }

  // app.use(routes);

  db.once("open", () => {
    app.listen(PORT, () =>
      console.log(`🌍 Now listening on localhost:${PORT}`)
    );
  });
}

startServer();
