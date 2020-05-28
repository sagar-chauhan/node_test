import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

  fullName: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
  },
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;