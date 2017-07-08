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
    const msg = {type: 'PlayerMove', playerIndex, move};
    if (winner !== MOVE_EMPTY) {
      msg.winner = winner;
    }
    this.broadcast(msg);

    console.log(this.getPrintableBoard());

    if (winner !== MOVE_EMPTY) {
      this.stopGame();
    }
  }

  checkEnd() {
    const b = this.board;

    if (_.every(b, x => x !== MOVE_EMPTY)) {
      throw new Error('Draw, TODO deal with this.');
    }

    let i, j, k;
    const end = SIZE - IN_A_ROW;
    let expect, isMatch;

    // This is kinda ugly...
    for (i = 0; i < SIZE; i++) {
      for (j = 0; j < end; j++) {
        // horiz
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

        // vert
        expect = b[j * SIZE + i];
        if (expect !== MOVE_EMPTY) {
          isMatch = true;
          for (k = 1; k < IN_A_ROW; k++) {
            if (b[(j + k) * SIZE + i] !== expect) {
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

    for (i = 0; i < end; i++) {
      for (j = 0; j <= i; j++) {
        // diag 1 and below
        expect = b[i * SIZE + j];
        if (expect !== MOVE_EMPTY) {
          isMatch = true;
          for (k = 1; k < IN_A_ROW; k++) {
            if (b[(k + i) * SIZE + j + k] !== expect) {
              isMatch = false;
              break;
            }
          }
          if (isMatch) {
            return expect;
          }
        }
        // diag 2 and below
        expect = b[i * SIZE + (SIZE - j - 1)];
        if (expect !== MOVE_EMPTY) {
          isMatch = true;
          for (k = 1; k < IN_A_ROW; k++) {
            if (b[(k + i) * SIZE + (SIZE - j - 1) - k] !== expect) {
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

    for (i = 1; i < end; i++) {
      for (j = 0; j <= i; j++) {
        // above diag 1
        expect = b[j * SIZE + i];
        if (expect !== MOVE_EMPTY) {
          isMatch = true;
          for (k = 1; k < IN_A_ROW; k++) {
            if (b[(k + j) * SIZE + i + k] !== expect) {
              isMatch = false;
              break;
            }
          }
          if (isMatch) {
            return expect;
          }
        }

        // above diag 2
        expect = b[j * SIZE + (SIZE - i - 1)];
        if (expect !== MOVE_EMPTY) {
          isMatch = true;
          for (k = 1; k < IN_A_ROW; k++) {
            if (b[(k + j) * SIZE + (SIZE - i - 1) - k] !== expect) {
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
