// Import the Express framework to build web applications and APIs
const express = require('express');

// Import ApolloServer from the apollo-server-express package for setting up a GraphQL server
const { ApolloServer } = require('apollo-server-express');
// Import the built-in path module from Node.js to handle and transform file paths
const path = require('path');

// Import the authentication middleware to secure GraphQL context
const { authMiddleware } = require('./utils/auth');
// Import type definitions and resolvers for the GraphQL schema
const { typeDefs, resolvers } = require('./schemas');

// Import the database connection configuration from a local file
const db = require('./config/connection');
// not needed for GraphQL API
// const routes = require('./routes');

// Define the port number for the server, using the environment variable PORT if available, otherwise defaulting to 3001
const PORT = process.env.PORT || 3001;

// Create an instance of the Express application
const app = express();

// Create a new instance of ApolloServer with the specified type definitions, resolvers, and context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
  };
  
// Call the async function to start the server
  startApolloServer(typeDefs, resolvers);
