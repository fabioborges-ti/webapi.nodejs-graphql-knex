const { ApolloServer } = require('apollo-server');
const { importSchema } = require('graphql-import');
const resolvers = require('./resolvers');

const schemasPath = './src/schemas/index.gql';

const server = new ApolloServer({
  typeDefs: importSchema(schemasPath),
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`executand em ${url}`);
});
