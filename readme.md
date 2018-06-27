# This repository has been moved to [gitlab.com/paul-nechifor/aoire](http://gitlab.com/paul-nechifor/aoire).

Old readme:

# Aoire

A server for playing games with bots.

It’s prounounced /ˈeːɾʲɪ/ (like in p**ay** **r**ule k**i**t) or /ˈiːɾʲə/ (like
in m**ea**n **r**ule sof**a**).

## Bots so far:

* [Greatlemer/react-gomoku-bot](https://github.com/Greatlemer/react-gomoku-bot)
* [dprgarner/balthazar](http://github.com/dprgarner/balthazar)
* [paul-nechifor/coaie](https://github.com/paul-nechifor/coaie)
* [dprgarner/oapy](https://github.com/dprgarner/oapy) (a bot skeleton)

## Usage

Quick way to build and start everything in development mode:

    docker-compose up

## Protocol

All WebSocket messages are strings (not binary). Each string is a JSON object.
The object must have at least one field, `"type"`, which describes the type of
the message. The message types should be strings in Pascal case (`LikeThis`).

The server doesn’t start games. It waits for players to join.

### Joining a game

Players normally play a fixed number of games in a room, each alternating being
the first.

A bot connects to ws://hostname/game with something like:

```javascript
{
	"type": "StartGame",
	"room": "someRoomName",
	"userAgent": "BotName (by Person Name)",
	"gameType": "Gomoku",
	"nGames": 5
}
```

* `room`: Where you agree to meet with another player.
* `userAgent`: Used for voluntary identification (please include your name).
* `gameType`: Only `Gomoku` supported for now.
* `nGames`: The number of consecutive games you want to play with the other
  player.

The first player to connect becomes the black player and has index 0. The second
is white with index 1.

The `nGames` for the second player is ignored.

Since the first player is known to be advantaged, on game 1, black moves first,
on game 2, white moves first, and so on.

### Knowing who you are

After you send the `StartGame` message, you'll recieve back a message like:

```javascript
{"type": "YouAre", "index": 0}
```

* `index`: 0 (black) or 1 (white).

Your index stays the same on subsequent games (but the first to move changes).

### Start of game

You know a game as started when you receive

```javascript
{"type": "Started", "playerIndex": 1}
```

* `playerIndex`: Which player should move first (0 is black, 1 is white).

If it's your turn you send a message like:

```javascript
{"type": "Move", "move": 123}
```

The number represents the cell where you want to place your piece. The order is
left to right, top to bottom. Cell 0 is the top-left cell. So `move % 15` gives
you the column and `move / 15` gives you the row.

### Receiving moves

When the server receives the move it sends it back to you and the other player.

## TODO

- Auto restart server in case it fails.

## License

ISC
