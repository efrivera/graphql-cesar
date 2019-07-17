import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import userModel from './user/user.model';
import projectModel from './project/project.model';
import projectLoader from './project/project.loader';

export const loaders = {
  projects: projectLoader(projectModel),
};

export const models = {
  User: userModel,
  Project: projectModel,
};

export const typeDefs = mergeTypes(
  fileLoader(path.join(__dirname, './**/*.graphql'), {recursive: true}),
  { all: true }
);

export const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, './**/*.resolvers.js'))
);