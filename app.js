const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const db = require('./config/db');
const morgan = require('morgan');
// Dotenv configuration
require('dotenv').config();

const debug = require('debug')('privacybear:app.js');

const app = express();
const port = process.env.PORT || 8300;

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

mongoose
  .connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => debug('Database connected successfully.'))
  .catch((err) => debug(err));

//#region Middlewares

// Limiting payload size
app.use(express.json({ limit: '10kb' }));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route configuration
app.use('/', require('./routes/global'));
app.use('/users', require('./routes/user'));
app.use('/history', require('./routes/history'));

app.use(morgan('short'));
//#endregion Middlewares

app.listen(port, debug(`Server started on port: ${port}`));
