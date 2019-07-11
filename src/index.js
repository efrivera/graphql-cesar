import dotenv from 'dotenv';
import { GraphQLServer } from 'graphql-yoga'
import userModel from './user.model';
import mongoose from 'mongoose';
// const mongoose = require('mongoose');

dotenv.config();

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const models = {
  User: userModel,
};

const typeDefs = `
  type User {
    id: ID!
    name: String
    email: String!
  }
  input UserInput {
    id: ID
    name: String
    email: String!
  }
  type Query {
    hello(name: String): String!
    user: User!
    users: [User]!
  }
  type Mutation {
    hello(name: String!): Boolean!
    createUser(name: String!, email: String!): User
    createUsers(users: [UserInput]): [User]!
  }
`

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    user: () => {
      return {
        name: 'cesar',
        email: 'mono@zemoga.com'
      };
    },
    users: (_, __, ctx) => ctx.models.User.find(),
  },
  Mutation: {
    hello: (root, args) => true,
    createUser: async (_, args, ctx) => {
      const { email } = args;
      const { models: { User }} = ctx;
      const userExists = await User.exists({ email });

      if (userExists) {
        throw new Error('The email already exists');
      }
      const userCreated = await ctx.models.User.create(args);

      return userCreated;
    },
    createUsers: async (_, args, ctx) => {
      const { users } = args;
      const { models: { User }} = ctx;
      const usersEmails = [];

      users.forEach(({ email }) => {
        if( usersEmails.includes(email) ) {
          throw new Error(`This email ${email} is repeated`);
        }
        usersEmails.push(email);
      });
      
      const userExists = await User.exists({ email: {$in: usersEmails} });

      if(userExists) {
        throw new Error(`One email already exists in the DB`);
      }

      const usersAdded = ctx.models.User.create(users);

      return usersAdded;
    }
  },
  User: {
    id: (root) => {
      return root.id;
    }
  }
}

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
.catch(() => {
  console.log('error');
});