import { idResolver } from '../utils';

export default {
  Query: {
    projects: (_, __, ctx) => ctx.models.Project
    .find({})
    .populate('users'),
  },
  Mutation: {
    createProject: async (_, args, ctx) => {
      const { Project: projectImput } = args;
      const { models: { Project, User }} = ctx;
      const projectExists = await Project.exists({ name: {$regex: projectImput.name, $options: 'i'} });

      if (projectExists) {
        throw new Error('The project already exists');
      }

      const projectCreated = await Project.create(projectImput);

      return projectCreated;
    },
    addUserToProject: async (_, {projectId, userId}, ctx) => {
      const userToAdd = await ctx.models.User.exists({
        _id: userId,
      });

      if(!userToAdd) {
        throw new Error('User with id was not found');
      }

      const projectToAdd = await ctx.models.Project.findOne({
        _id: projectId,
      });

      if(!projectToAdd) {
        throw new Error('project with id was not found');
      }

      projectToAdd.users.push(userId);

      await projectToAdd.save();

      return ctx.models.Project
        .findOne({
          _id: projectId,
        })
        .populate('users');
    }
  },
  Project: {
    id: idResolver,
  }
};