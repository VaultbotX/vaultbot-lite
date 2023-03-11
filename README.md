# vaultbot-lite

Bare-bones implementation of the core functionality of Vaultbot.
This is meant to be a self-hosted implementation of Vaultbot without any associated cloud infrastructure.

## Stack
This version of Vaultbot is fully written in TypeScript and can be deployed all at once via `docker compose up -d`. You will need to set environment variables in a `.env` file in the root directory (details TBD).
The application stores song data in two separate databases: Neo4j and MongoDB.
The Neo4j database is set up to properly reflect the graph-like nature of the song-album-artist-genre hierarchy.
The purpose of the Mongo instance is to track song additions to the playlist over time.
