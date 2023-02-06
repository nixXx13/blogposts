const { ApolloServer, gql } = require('apollo-server');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { DbMock } = require('./DbMock.js');
const { restrictedFieldDefaultDirective } = require("./RestrictedFieldDefaultDirective.js");
const { restrictedDirectiveTransformer } = require("./RestrictedDirective");

const typeDefs = gql`
    directive @restricted on FIELD_DEFINITION | INPUT_OBJECT | INPUT_FIELD_DEFINITION

    enum UserRole {
        EMPLOYEE
        ADMIN
    }
    type User {
        id: String
        name: String 
        address: String
        role: UserRole #@restricted
    }
    input UserInput {
        name: String
        address: String
        role: UserRole @restricted
    }
    type Query {
        users(ids: [String]): [User]
        sensitiveData: String @restricted
    }
    type Mutation {
        updateUser( id: String, userInput: UserInput ): User
        updateSensitiveData( sensitiveData: String ): String @restricted
    }
`;

const resolvers = {
    Query: {
        users: async (_, { ids }) => {
            const users = await DbMock.getUsersData(ids);
            return users;
        },
        sensitiveData: async (_, {}) => {
            const sensitiveData = await DbMock.getSensitiveData();
            return sensitiveData;
        }
    },
    Mutation: {
        updateUser: async (_, {id, userInput}) => {
            const updatedUser = await DbMock.updateUser(id, userInput);
            return updatedUser;
        },
        updateSensitiveData: async (_, {sensitiveData}) => {
            const _sensitiveData = await DbMock.setSensitiveData(sensitiveData);
            return _sensitiveData;
        }
    }
};

const mutations = Object.entries(resolvers.Mutation).map(
    ([mutationName, mutationResolver]) => ({
      endpointName: mutationName,
      endpointResolver: mutationResolver,
      endpointContainer: resolvers.Mutation,
    })
  );

const defaultDirectives = [
    restrictedFieldDefaultDirective
];

const endpoints = [...mutations];
for (const endpoint of endpoints) {
    const { endpointName, endpointResolver, endpointContainer } = endpoint;
    let wrappedEndpoint = endpointResolver;
    const options = { endpointName };
    defaultDirectives.forEach(
      directive => wrappedEndpoint = directive(wrappedEndpoint, options)
    );
    endpointContainer[endpointName] = wrappedEndpoint;
}

// Create the base executable schema
let schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });
  
// Transform the schema by applying directive logic
schema = restrictedDirectiveTransformer(schema, 'restricted');

const server = new ApolloServer({
    schema,
    context: ({req, res}) => {
        if ( req?.body?.operationName !== 'IntrospectionQuery' ){
            return { isAdmin: req?.headers?.authorization === "admin" }
        }
    }
});

server.listen({port: 4001}).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});

// links
// https://github.com/ardatan/graphql-tools/issues/652
// https://github.com/ardatan/graphql-tools/blob/master/packages/utils/src/mapSchema.ts 