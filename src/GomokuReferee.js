const AbstractReferee = require('./AbstractReferee');
const GomokuPlayer = require('./GomokuPlayer');

module.exports = class GomokuReferee extends AbstractReferee {
  getPlayerClass() {
    return GomokuPlayer;
  }

  startGame() {
    this.broadcast({type: 'Started'});
  }

  onNewPlayer() {
    if (this.players.length === 2) {
      this.startGame();
    } else if (this.players.length > 2) {
      throw new Error('handle this');
    }
  }
};
