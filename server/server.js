const express = require('express');
//const path = require('path');
const db = require('./config/connection');
//updated to gql api const routes = require('./routes');
const {authMdw} = require('utils/auth');
const {ApolloServer} = require('apollo-server-express');
const {typeDefs, resolvers} = require('./schemas');
//importing apollo-server-express and new schema data
const server = new ApolloServer ({
  typeDefs,
  resolvers,
  context: authMdw,
});
//requiring new files and server routes
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

//app.use(routes);
const callApollo = async( typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({app});
};

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

callApollo(typeDefs, resolvers);
