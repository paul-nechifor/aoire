module.exports = class AbstractPlayer {
  constructor(conn, index, referee, userAgent) {
    this.conn = conn;
    this.index = index;
    this.referee = referee;
    this.userAgent = userAgent;
  }

  send(msg) {
    this.conn.send(msg);
  }

  stop() {
    this.conn.close();
  }
};
