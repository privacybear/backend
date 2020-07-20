const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Dotenv configuration
require('dotenv').config();

// Express Initialization
const app = express();

// Database connection

const db = require('./config/db');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => console.log('Database connected successfully.'))
.catch(err => console.log(err));

// Middlewares

// Body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Route configuration
app.use('/', require('./routes/global'))
app.use('/users', require('./routes/user.js'))

// Server configuration
const port = process.env.PORT || 8300;

app.listen(port, console.log(`Server started on port: ${port}`))