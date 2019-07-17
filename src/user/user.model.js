import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  }]
});

export default mongoose.model('User', UserSchema, 'users');
