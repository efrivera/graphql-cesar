import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  description: String,
  team: String,
});

export default mongoose.model('Project', UserSchema, 'projects');
