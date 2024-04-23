// require express
const express = require('express');

// create an instance of express
const app = express();

// require the config file to get the port number
const { PORT} = require("./utilities/config");

// use the express.json middleware to parse JSON data in the request body
app.use(express.json());

//  use mentors route to handle request to /mentors
app.use("/mentors", require('./routes/mentors'))

// use students route to handle requests to /students
app.use("/students", require("./routes/students"));

  // start the server on port 3000
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });