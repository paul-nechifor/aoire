module.exports = class AbstractPlayer {
  constructor(conn, index, referee) {
    this.conn = conn;
    this.index = index;
    this.referee = referee;
  }

  send(msg) {
    this.conn.send(msg);
  }

  stop() {
    this.conn.close();
  }
};
