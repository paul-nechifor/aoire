const Server = require('./Server.js');
const express = require('express');
const expressWs = require('express-ws');

const app = express();
const port = parseInt(process.env.port, 10);
const mongoUrl = process.env.mongo_url || 'mongodb://db:27017/aoire';

expressWs(app);

app.get('/', (req, res) => {
  res.send('See <a href="https://github.com/paul-nechifor/aoire">github.com/paul-nechifor/aoire</a>.');
});

new Server(app, port, mongoUrl).start();
