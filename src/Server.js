const Connection = require('./Connection');
const _ = require('underscore');

module.exports = class Server {
  constructor(app, port) {
    this.app = app;
    this.port = port;
    _.bindAll(this, 'handleConnection');
    this.connections = {};
  }

  start() {
    this.setupListeners();
    this.listen();
  }

  setupListeners() {
    this.app.get('/game', (req, res) => res.end());
    this.app.ws('/game', this.handleConnection);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Started on port %s.', this.port)
    });
  }

  handleConnection(ws, req) {
    const conn = new Connection(this, ws, req);
    this.connections[conn.id] = conn;
    conn.start();
  }

  left(conn) {
    delete this.connections[conn.id];
  }
};
