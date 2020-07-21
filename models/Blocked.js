const mongoose = require('mongoose');
const validator = require('validator');

// Schema
const blockedSchema = mongoose.Schema({
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

blockedSchema.statics.checkIfExists = async (id, url) => {
  // Search for a record by url
  const blocked = await Blocked.findOne({ _id: id, url: url });
  if(!blocked){
    return false;
  } else{
    return true;
  }
}
const Blocked = mongoose.model('Blocked', blockedSchema);

module.exports = Blocked;
