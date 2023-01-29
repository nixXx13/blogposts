const { ApolloServer, gql } = require('apollo-server');
const { defaultDirectiveExample } = require("./DefaultDirectiveExample");

const typeDefs = gql`

    type Query {
        trainers(ids: [String]): String
    }
`;


const resolvers = {
    Query: {
        trainers: async (_, { ids }) => {
            console.log("Hi!");
            return "OK";
        },
    },
};

const queries = Object.entries(resolvers.Query)
  .map(([queryName, queryResolver]) => ({
    endpointName: queryName,
    endpointResolver: queryResolver,
    endpointContainer: resolvers.Query,
}));

const defaultDirectives = [
    defaultDirectiveExample
];

const endpoints = [...queries];
for (const endpoint of endpoints) {
    const { endpointName, endpointResolver, endpointContainer } = endpoint;
    let wrappedEndpoint = endpointResolver;
    defaultDirectives.forEach(
      directive => wrappedEndpoint = directive(wrappedEndpoint)
    );
    endpointContainer[endpointName] = wrappedEndpoint;
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen({port: 4001}).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
