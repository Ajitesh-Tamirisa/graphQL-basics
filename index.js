import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import db from './_db.js';

// types
import { typeDefs } from './schema.js';

const resolvers = {
    Query:{
        games() {
            return db.games;
        },
        reviews() {
            return db.reviews;
        },
        authors() {
            return db.authors;
        },
        review(_, args, context) {
            return db.reviews.find((review)=> review.id === args.id);
        },
        game(_, args, context){
            return db.games.find((game)=> game.id === args.id);
        },
        author(_, args, context){
            return db.authors.find((author) => author.id === args.id);
        }
    },
    Game: {
        reviews(parent) {
            return db.reviews.filter((review)=>review.game_id === parent.id);
        }
    },
    Author: {
        reviews(parent) {
            return db.reviews.filter((review)=>review.author_id === parent.id);
        }
    },
    Review: {
        game(parent) {
            return db.games.find((game)=> game.id === parent.game_id);
        },
        author(parent) {
            return db.authors.find((author)=> author.id === parent.author_id);
        }
    },
    Mutation: {
        deleteGame(_, args, context) {
            db.games = db.games.filter((game)=> game.id !== args.id);
            return db.games;
        },
        addGame(_, args, context) {
            let game = {
                ...args.game,
                id: Math.floor(Math.random()*10000).toString()
            }
            db.games.push(game);
            return game;
        },
        updateGame(_, args) {
            db.games = db.games.map((game)=>{
                if(game.id === args.id) {
                    return {
                        ...game,
                        ...args.edits
                    }
                }
                return game;
            })
            return db.games.find((game)=>game.id === args.id);
        }
    }
}

//server setup
const server = new ApolloServer({
    // typeDefs - descriptions of datatypes and their relationships with other datatypes
    typeDefs,
    // resolvers - functions that determine how we respond to queries for different data on the graph
    resolvers
})

const {url} = await startStandaloneServer(server, {
    listen: {port: 5000}
})

console.log('Server ready at', url);