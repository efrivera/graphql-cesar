import {idResolver} from '../utils';

export default {
  Query: {
    users: (_, __, ctx) => ctx.models.User.find(),
  },
  Mutation: {
    createUser: async (_, args, ctx) => {
      const { email } = args;
      const { models: { User }} = ctx;
      const userExists = await User.exists({ email });

      if (userExists) {
        throw new Error('The email already exists');
      }
      const userCreated = await User.create(args);

      return userCreated;
    },
    createUsers: async (_, args, ctx) => {
      const { users } = args;
      const { models: { User }} = ctx;
      const usersEmails = [];

      users.forEach(({ email }) => {
        if( usersEmails.includes(email) ) {
          throw new Error('This email is repeated');
        }
        usersEmails.push(email);
      });
      
      const userExists = await User.exists({ email: {$in: usersEmails} });

      if(userExists) {
        throw new Error('One email already exists in the DB');
      }

      const usersAdded = User.create(users);

      return usersAdded;
    },
  },
  User: {
    id: idResolver,
  }
};