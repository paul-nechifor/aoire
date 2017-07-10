const {MongoClient} = require('mongodb');

module.exports = class Db {
  constructor(mongoUrl) {
    this.mongoUrl = mongoUrl;
    this.db = null;
    this.games = null;
  }

  connect(cb) {
    MongoClient.connect(this.mongoUrl, (err, db) => {
      if (err) {
        return cb(err);
      }

      this.db = db;
      this.games = db.collection('games');

      cb();
    });
  }
}
