const Server = require('./Server.js');
const express = require('express');
const expressWs = require('express-ws');

const app = express();
const port = parseInt(process.env.port, 10);

expressWs(app);

app.get('/', (req, res) => {
  res.send('Welcome to Aoire!!1');
});

new Server(app, port).start();
