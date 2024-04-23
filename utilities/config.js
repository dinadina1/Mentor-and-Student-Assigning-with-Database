// require dotenv package
require('dotenv').config();

// Create all necessary configuration variable
const MongoDB_URL = process.env.URL;
const PORT = process.env.PORT || 3000;

// export the configuration variable
module.exports = {MongoDB_URL, PORT}