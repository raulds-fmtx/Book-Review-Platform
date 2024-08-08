const express = require("express");
const path = require("path");
const db = require("./config/connection");
// const routes = require("./routes");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");
// importing stripe checkout route
const checkoutRoute = require('./routes/api/checkout');

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

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //Stripe checkout route added 
  app.use('/api', checkoutRoute);

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