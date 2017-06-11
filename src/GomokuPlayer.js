const AbstractPlayer = require('./AbstractPlayer');

module.exports = class GomokuPlayer extends AbstractPlayer {
  constructor(...args) {
    super(...args);
  }

  handleMsgMove(msg) {
    this.referee.playerMove(this.index, msg.move);
  }
};
