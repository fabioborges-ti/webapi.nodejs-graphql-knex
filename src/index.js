require('dotenv').config();
const { ApolloServer } = require('apollo-server');

const { importSchema } = require('graphql-import');
const resolvers = require('./resolvers');
const context = require('./config/context');

const schemasPath = './src/schemas/index.gql';

const server = new ApolloServer({
  typeDefs: importSchema(schemasPath),
  resolvers,
  context,
});

server.listen().then(({ url }) => {
  console.log(`executand em ${url}`);
});
