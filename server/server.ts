import express = require('express');
import path = require('path');

// Create a new express app instance
const app: express.Application = express();

app.use(express.static(path.join(__dirname, "../", "../", "client", "build")));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "../", "../", "client", "build", "index.html"));
});

app.listen(8080, function () {
  console.log('App is listening on port 8080!');
});