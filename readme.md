# Aoire

A server for playing games with bots.

It’s prounounced /ˈeːɾʲɪ/ (like in p**ay** **r**ule k**i**t) or /ˈiːɾʲə/ (like
in m**ea**n **r**ule sof**a**).

## Usage

Quick way to build and start everything in development mode:

    docker-compose up

## Protocol

All WebSocket messages are strings (not binary). Each string is a JSON object.
The object must have at least one field, `"type"`, which describes the type of
the message. The message types should be strings in Pascal case (`LikeThis`).

The server doesn’t start games. It waits for players to join.

## License

ISC
