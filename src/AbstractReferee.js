module.exports = class AbstractReferee {
  constructor(server, room) {
    this.server = server;
    this.room = room;
    this.players = [];
  }

  joinGame(conn, msg) {
    const Player = this.getPlayerClass();
    const index = this.players.length;
    const player = new Player(conn, index, this);
    this.players.push(player);
    conn.player = player;

    this.broadcast({type: 'NumberOfPlayers', number: this.players.length});
    player.send({
      type: 'YouAre',
      index: player.index,
      id: player.conn.id,
    });
    this.onNewPlayer();
  }

  getPlayerClass() {
    throw new Error('Not implemented.');
  }

  broadcast(msg) {
    this.players.forEach(player => {
      player.send(msg);
    });
  }

  stopGame() {
    this.players.forEach(player => {
      player.stop();
    });
    this.server.gameEnded(this);
  }
};
