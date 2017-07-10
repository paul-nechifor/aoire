const _ = require('underscore');
const AbstractReferee = require('./AbstractReferee');
const GomokuPlayer = require('./GomokuPlayer');

const MOVE_DRAW = -2;
const MOVE_EMPTY = -1;
const MOVE_BLACK = 0;
const MOVE_WHITE = 1;
const SIZE = 15;
const IN_A_ROW = 5;
const FULL_SIZE = SIZE * SIZE;

module.exports = class GomokuReferee extends AbstractReferee {
  constructor(server, room, nGames) {
    super(server, room);
    this.nGames = nGames;
    this.gamesPlayed = 0;
    this.board = null;
    this.wins = {
      [MOVE_DRAW]: 0,
      [MOVE_BLACK]: 0,
      [MOVE_WHITE]: 0,
    };
    this.gameEvents = [];
    this.currentPlayer = -1;
    this.maxMoveTime = 5000;
    this.timeoutHandle = null;
    this.eventRecords = null;
  }

  getPlayerClass() {
    return GomokuPlayer;
  }

  startGame() {
    this.currentPlayer = (this.gamesPlayed % 2);
    this.gamesPlayed++;
    this.board = _.range(FULL_SIZE).map(() => MOVE_EMPTY);
    this.broadcast({type: 'Started', playerIndex: this.currentPlayer});
    this.setTimeout();
    this.eventRecords = [];
  }

  onNewPlayer() {
    if (this.players.length === 2) {
      this.startGame();
    } else if (this.players.length > 2) {
      throw new Error('handle this');
    }
  }

  setTimeout() {
    this.timeoutHandle = setTimeout(() => {
      this.disqualify('timeout');
    }, this.maxMoveTime);
  }

  clearTimeout() {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
    this.timeoutHandle = null;
  }

  playerMove(playerIndex, move) {
    this.clearTimeout();
    this.setTimeout();
    if (playerIndex !== this.currentPlayer) {
      this.disqualify('bad player');
    }
    if (this.board[move] !== MOVE_EMPTY) {
      this.disqualify('bad move');
    }
    this.board[move] = playerIndex;
    this.eventRecords.push([Date.now(), move]);

    this.currentPlayer = (this.currentPlayer + 1) % 2;

    console.log(this.getPrintableBoard());

    const winner = this.checkEnd();
    const msg = {type: 'PlayerMove', playerIndex, move};
    if (winner !== MOVE_EMPTY) {
      msg.winner = winner;
      console.log('winner', winner);
    }
    this.broadcast(msg);

    if (winner !== MOVE_EMPTY) {
      this.wins[winner]++;
      this.endCurrentGame();
    }
  }

  disqualify(msg) {
    this.eventRecords.push([Date.now(), 'disqualify', msg]);
    console.log('disqualified');
    this.endCurrentGame();
  }

  endCurrentGame() {
    this.clearTimeout();
    this.gameEvents.push(this.eventRecords);
    if (this.gamesPlayed < this.nGames) {
      this.startGame();
    } else {
      console.log(JSON.stringify({
        wins: {
          [MOVE_BLACK]: this.wins[MOVE_BLACK],
          [MOVE_WHITE]: this.wins[MOVE_WHITE],
        },
        draws: this.wins[MOVE_WHITE],
        nGames: this.nGames,
        gameEvents: this.gameEvents,
      }));
      this.stopGame();
    }
  }

  checkEnd() {
    const b = this.board;

    let i, j, k;
    const end = SIZE - IN_A_ROW;
    let expect, isMatch;

    // This is kinda ugly...
    for (i = 0; i < SIZE; i++) {
      for (j = 0; j < end; j++) {
        // horiz
        expect = b[i * SIZE + j];
        if (expect >= MOVE_BLACK) {
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
        if (expect >= MOVE_BLACK) {
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
        if (expect >= MOVE_BLACK) {
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
        if (expect >= MOVE_BLACK) {
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
        if (expect >= MOVE_BLACK) {
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
        if (expect >= MOVE_BLACK) {
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

    if (_.every(b, x => x !== MOVE_EMPTY)) {
      return MOVE_DRAW;
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
