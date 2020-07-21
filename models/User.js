const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: 'Invalid Email address' });
      }
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
  },
  avatar: {
    type: String,
    required: false,
  },
  timestamp: {
    type: String,
    default: new Date().getTime(),
  },
});

userSchema.pre('save', async function (next) {
  const user = this;

  // Hash the password before saving the user model

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
    expiresIn: '1h',
  });
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email });
  if (!user) {
    throw 'That email does not exist.';
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw 'Wrong password.';
  }
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
