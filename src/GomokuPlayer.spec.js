const _ = require('underscore');
const GomokuReferee = require('./GomokuReferee');

require('chai').should();

describe('GomokuReferee', () => {
  let referee;

  beforeEach(() => {
    referee = new GomokuReferee('room');
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
      _.range(5).forEach(x => referee.board[15 + x] = 2);
      referee.checkEnd().should.equal(2);
    });

    it('should detect middle 5 in a row on line 2', () => {
      _.range(5).forEach(x => referee.board[15 * 5 + 5 + x] = 2);
      referee.checkEnd().should.equal(2);
    });
  })
});
