const Logger = require('logdna');
require('dotenv').config();
const options = {};
// Defaults to false, when true ensures meta object will be searchable
options.index_meta = true;

// Add tags in array or comma-separated string format:
options.tags = ['privacybear'];

// Create multiple loggers with different options
const logger = Logger.createLogger(process.env.LOGDNA_KEY, options);

module.exports = {
  log: async (data) => logger.log(data, options),
  danger: async (data) => logger.error(data),
  info: async (data) => logger.info(data),
  warn: async (data) => logger.warn(data),
};
