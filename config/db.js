if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: process.env.DATABASE_URI
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost:27017/privacybear'
    }

}


