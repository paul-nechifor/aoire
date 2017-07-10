const _ = require('underscore');
const uuid4 = require('uuid/v4');

module.exports = class Connection {
  constructor(server, ws, res) {
    this.id = uuid4();
    this.server = server;
    this.ws = ws;
    this.res = res;
    this.player = null;
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
    if (msg.type === 'StartGame') {
      this.server.findGameRoom(this, msg);
    } else {
      this.player[`handleMsg${msg.type}`](msg);
    }
  }

  handleError() {
    console.log('handleError');
    this.ws.close();
    this.leave();
  }

  handleClose() {
    console.log('handleClose');
  }

  leave() {
    this.server.left(this);
  }

  send(msg) {
    this.ws.send(JSON.stringify(msg))
  }

  close() {
    this.ws.close();
  }
}
