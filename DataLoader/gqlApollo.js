const { ApolloServer, gql } = require('apollo-server');
const {DbMock} = require("./DbMock");
const {CloneLoader} = require("./CloneLoader");
const DataLoader = require('dataloader')

const typeDefs = gql`
    type Trainer {
        id: String
        name: String
        pokemons: [Pokemon]
    }
    type Pokemon {
        id: String
        name: String
    }
    
    type Query {
        trainers(ids: [String]): [Trainer]
    }
`;

const cloneLoader = new CloneLoader( async (ids) =>  {
    const results = await DbMock.getPokemonsForTrainers(ids);
    return ids.map( id => results[id] || null );
});
const realLoader = new DataLoader(async (ids) => {
    const results = await DbMock.getPokemonsForTrainers(ids);
    return ids.map(id => results[id] || new Error(`No result for ${id}`));
} );

// (async function test(){
//    await realLoader.load(1);
//    await realLoader.load(2);
//    console.log("zzzz");
//    await cloneLoader.load(1);
//    await cloneLoader.load(2);
//    console.log("yyyy");
// })()

const resolvers = {
    Trainer: {
        pokemons: async ( {id} ) => {
            // const pokemons = await DbMock.getPokemonsForTrainer(id);
            const pokemons = await cloneLoader.load(id);
            // const pokemons_ = await realLoader.load(id);
            return pokemons;
        },
    },
    Query: {
        trainers: async (_, { ids }) => {
            return DbMock.getTrainers(ids);
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen({port: 4001}).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});

// https://github.com/graphql/dataloader
// https://www.google.com/search?q=process+nexttick+vs+setimmediate&oq=process+nexttick&aqs=chrome.1.69i57j0i512j0i22i30l8.3957j0j7&sourceid=chrome&ie=UTF-8
// https://studio.apollographql.com/sandbox/explorer