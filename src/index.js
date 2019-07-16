import dotenv from 'dotenv';
import { GraphQLServer } from 'graphql-yoga';
import mongoose from 'mongoose';
import { models, typeDefs, resolvers } from './graphql';

dotenv.config();

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const db = mongoose
.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@mono-workshop-tyhji.mongodb.net/mono-workshop-db`)
.then(() => {
  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: {
      models,
      db
    }
  })

  server.start(() => console.log('Server is running on localhost:4000'));
})
.catch((e) => {
  console.log('error', e);
});