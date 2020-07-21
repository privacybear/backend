const mongoose = require('mongoose');
const validator = require('validator');

// Schema
const historySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  site: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isURL(value)) {
        throw new Error({ error: 'Invalid URL format' });
      }
    },
  },
  permissions: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  timestamp: {
    type: String,
    default: new Date().getTime(),
  },
});

const History = mongoose.model('History', historySchema);

module.exports = History;
