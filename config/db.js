let mongoURI;

if (process.env.NODE_ENV === 'production') {
  mongoURI = process.env.DATABASE_URI;
} else {
  mongoURI = 'mongodb://localhost:27017/privacybear';
}

module.exports = { mongoURI };
