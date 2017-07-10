const {MongoClient, ObjectId} = require('mongodb');

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

  insertGame(game, cb) {
    this.games.insertOne(game, cb);
  }

  getAllGames(cb) {
    this.games.find({}).sort({startTime: -1}).toArray(cb);
  }

  getGame(id, cb) {
    this.games.findOne({_id: ObjectId(id)}, cb);
  }
}
