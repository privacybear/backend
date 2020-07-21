const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const logger = require('./logging');
const cors = require('cors');
// Dotenv configuration
require('dotenv').config();

const debug = require('debug')('privacybear:app.js');

const app = express();
const port = process.env.PORT || 8300;

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => debug('Database connected successfully.'))
  .catch((err) => debug(err));

//#region Middlewares
app.use(cors());

app.use(
  '/',
  rateLimit({
    windowMs: +process.env.RATE_LIMIT_TIME || 15 * 60 * 1000, // 15 minutes
    max: +process.env.RATE_LIMIT || 100,
    onLimitReached: (req, res, options) => {
      logger.danger('Someone just reached the request limit');
      debug('Limit reached');
    },
  })
);

// Limiting payload size
app.use(express.json({ limit: '10kb' }));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route configuration
app.use('/', require('./routes/global'));
app.use('/users', require('./routes/user'));
app.use('/history', require('./routes/history'));

app.use(morgan('tiny'));

app.use((err, req, res, next) => {
  logger.log(err.message || err);

  res.status(400).send({ err });
});

//#endregion Middlewares

app.listen(port, debug(`Server started on port: ${port}`));
