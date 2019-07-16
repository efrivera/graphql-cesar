import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  team: {
    type: String,
    required: true,
    enum: [
      'UI',
      'QA',
      'DESIGN',
      'ADMIN',
    ],
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }]
});

export default mongoose.model('Project', ProjectSchema, 'projects');
