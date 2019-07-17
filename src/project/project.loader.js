import DataLoader from 'dataloader';

export default (projectModel) => new DataLoader(async (userIds) => {
  const projectsFound = await projectModel
  .find({
    users: {
      $in: userIds,
    }
  })
  .populate('users');

  console.log('projects:', projectsFound);

  const projects = userIds.map((userId) => {
    return projectsFound.filter((projectFound) => {
      return projectFound.users.some((user) => String(user._id) === String(userId));
    })
  });

  return Promise.resolve(projects);
});
