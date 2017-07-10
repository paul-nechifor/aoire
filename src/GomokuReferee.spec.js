const _ = require('underscore');
const GomokuReferee = require('./GomokuReferee');

require('chai').should();

describe('GomokuReferee', () => {
  let referee;

  beforeEach(() => {
    referee = new GomokuReferee('room');
    referee.startGame();
  });

  describe('checkEnd', () => {
    it('should detect empty boards', () => {
      referee.checkEnd().should.equal(-1);
    });

    it('should detect first 5 in a row', () => {
      _.range(5).forEach(x => referee.board[x] = 1);
      referee.checkEnd().should.equal(1);
    });

    it('should detect middle 5 in a row', () => {
      _.range(5).forEach(x => referee.board[5 + x] = 1);
      referee.checkEnd().should.equal(1);
    });

    it('should detect first 5 in a row on line 2', () => {
      _.range(5).forEach(x => referee.board[15 + x] = 0);
      referee.checkEnd().should.equal(0);
    });

    it('should detect middle 5 in a row on line 2', () => {
      _.range(5).forEach(x => referee.board[15 * 5 + 5 + x] = 0);
      referee.checkEnd().should.equal(0);
    });

    it('should detect first 5 in a column', () => {
      _.range(5).forEach(x => referee.board[x * 15] = 1);
      referee.checkEnd().should.equal(1);
    });

    it('should detect first 5 in a column in column 4', () => {
      _.range(5).forEach(x => referee.board[x * 15 + 4] = 0);
      referee.checkEnd().should.equal(0);
    });

    it('should detect first 5 in a column in column 4, line 3', () => {
      _.range(5).forEach(x => referee.board[(x + 3) * 15 + 4] = 0);
      referee.checkEnd().should.equal(0);
    });

    it('should detect diagonal 1', () => {
      _.range(5).forEach(x => referee.board[x * 15 + x] = 0);
      referee.checkEnd().should.equal(0);
    });

    it('should detect below diag 2', () => {
      _.range(5).forEach(x => {
        return referee.board[(x + 1) * 15 + (15 - x - 1)] = 0;
      });
      referee.checkEnd().should.equal(0);
    });

    it('should detect above diag 1', () => {
      _.range(5).forEach(x => {
        return referee.board[(x + 2) * 15 + x + 4] = 0;
      });
      referee.checkEnd().should.equal(0);
    });

    it('should detect above diag 2', () => {
      _.range(5).forEach(x => {
        return referee.board[(x + 1) * 15 + (15 - x - 4)] = 0;
      });
      referee.checkEnd().should.equal(0);
    });
  });
});
