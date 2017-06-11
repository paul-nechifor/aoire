const _ = require('underscore');
const AbstractReferee = require('./AbstractReferee');
const GomokuPlayer = require('./GomokuPlayer');

const MOVE_EMPTY = -1;
const MOVE_BLACK = 0;
const MOVE_WHITE = 1;
const SIZE = 15;
const IN_A_ROW = 5;
const FULL_SIZE = SIZE * SIZE;

module.exports = class GomokuReferee extends AbstractReferee {
  constructor(...args) {
    super(...args);
    this.board = _.range(FULL_SIZE).map(() => MOVE_EMPTY);
  }

  getPlayerClass() {
    return GomokuPlayer;
  }

  startGame() {
    this.currentPlayer = 0;
    this.broadcast({type: 'Started'});
  }

  onNewPlayer() {
    if (this.players.length === 2) {
      this.startGame();
    } else if (this.players.length > 2) {
      throw new Error('handle this');
    }
  }

  playerMove(playerIndex, move) {
    if (playerIndex !== this.currentPlayer) {
      throw new Error('bad player');
    }
    if (this.board[move] !== MOVE_EMPTY) {
      throw new Error('bad move');
    }
    this.board[move] = playerIndex;

    this.currentPlayer = (this.currentPlayer + 1) % 2;

    const winner = this.checkEnd();

    this.broadcast({type: 'PlayerMove', playerIndex, move, winner});
    console.log(this.getPrintableBoard());
  }

  checkEnd() {
    const b = this.board;

    if (_.every(b, x => x !== MOVE_EMPTY)) {
      throw new Error('Draw, TODO deal with this.');
    }

    let i, j, k;
    const end = SIZE - IN_A_ROW;
    let expect, isMatch;

    for (i = 0; i < SIZE; i++) {
      for (j = 0; j < end; j++) {
        expect = b[i * SIZE + j];
        if (expect !== MOVE_EMPTY) {
          isMatch = true;
          for (k = 1; k < IN_A_ROW; k++) {
            if (b[i * SIZE + j + k] !== expect) {
              isMatch = false;
              break;
            }
          }
          if (isMatch) {
            return expect;
          }
        }
      }
    }

    return MOVE_EMPTY;
  }

  getPrintableBoard() {
    const map = {
      [MOVE_EMPTY]: '  ',
      [MOVE_BLACK]: '██',
      [MOVE_WHITE]: '▒▒',
    };
    return this.board.map((x, i) => {
      return (i % SIZE ? '': '\n') + map[x];
    }).join('');
  }
};
