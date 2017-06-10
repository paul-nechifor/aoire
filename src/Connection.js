const _ = require('underscore');
const uuid4 = require('uuid/v4');

module.exports = class Connection {
  constructor(server, ws, res) {
    this.id = uuid4();
    this.server = server;
    this.ws = ws;
    this.res = res;
    _.bindAll(this, 'handleMessage', 'handleError', 'handleClose');
  }

  start() {
    this.setupListeners();
  }

  setupListeners() {
    this.ws.on('message', this.handleMessage);
    this.ws.on('error', this.handleError);
    this.ws.on('close', this.handleClose);
  }

  handleMessage(data) {
    const msg = JSON.parse(data);
    console.log('msg', msg);
    this.send({type: 'reply', got: msg});
  }

  handleError() {
    console.log('error');
    this.ws.close();
    this.leave();
  }

  handleClose() {
    console.log('close');
  }

  leave() {
    this.server.left(this);
  }

  send(msg) {
    this.ws.send(JSON.stringify(msg))
  }
}
