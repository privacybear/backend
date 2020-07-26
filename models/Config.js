const mongoose = require('mongoose');
const validator = require('validator');

const configSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    accuracy: Number,
    altitude: Number,
    altitudeAccuracy: Number,
    heading: String,
    latitude: Number,
    longitude: Number,
    speed: Number,
  },
  webgl_fingerprint: Object,
  cookie: String,
  referrer: String,
  battery: {
    level: Number;
  }
});

const Config = mongoose.model('Config', configSchema);

module.exports = Config;
