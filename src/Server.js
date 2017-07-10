const Connection = require('./Connection');
const Db = require('./Db');
const _ = require('underscore');
const fs = require('fs');
const path = require('path');
const pug = require('pug');

const viewDir = path.resolve(__dirname, 'views');

module.exports = class Server {
  constructor(app, port, mongoUrl) {
    this.app = app;
    this.db = new Db(mongoUrl);
    this.port = port;
    _.bindAll(this, 'handleConnection', 'getDump');
    this.connections = {};
    this.roomReferees = {};
  }

  start() {
    this.setupListeners();
    this.db.connect(err => {
      if (err) {
        throw new Error(err);
      }
      this.listen();
    });
  }

  setupListeners() {
    this.app.get('/game', (req, res) => res.end());
    this.app.ws('/game', this.handleConnection);
    this.app.get('/dump', this.getDump);
    this.app.get('/', this.renderTemplate('index'));
    this.app.get('/games', (req, res) => {
      this.db.getAllGames((err, data) => {
        if (err) {
          throw err;
        }
        res.end(this.renderFile('games', {games: data}));
      });
    });
    this.app.get('/game/:id', (req, res) => {
      this.db.getGame(req.param('id'), (err, data) => {
        if (err) {
          throw err;
        }
        res.end(this.renderFile('game', {
          game: data,
          baseSvg: fs.readFileSync(
            path.join(__dirname, 'base.svg'), {encoding: 'utf8'}
          ),
        }));
      });
    });
  }

  renderTemplate(name) {
    return (req, res) => {
      res.end(this.renderFile(name));
    };
  }

  renderFile(name, options) {
    return pug.renderFile(path.join(viewDir, name + '.pug'), options);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Started on port %s.', this.port)
    });
  }

  handleConnection(ws, req) {
    const conn = new Connection(this, ws, req);
    this.connections[conn.id] = conn;
    conn.start();
  }

  left(conn) {
    delete this.connections[conn.id];
  }

  findGameRoom(conn, msg) {
    let referee = this.roomReferees[msg.room];
    if (!referee) {
      const Referee = require(`./${msg.gameType}Referee`);
      referee = new Referee(this, msg.room, msg.nGames);
      this.roomReferees[msg.room] = referee;
    }
    referee.joinGame(conn, msg);
    return referee;
  }

  gameEnded(referee) {
    delete this.roomReferees[referee.room];
  }

  getDump(req, res) {
    this.db.getAllGames((err, data) => {
      res.json(data);
    });
  }
};
