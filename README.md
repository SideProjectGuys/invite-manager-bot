# InviteManager Discord Bot

## Description

This is the code repository for the InviteManager Discord Bot.

## Docs

[Click here to view the documentation](https://docs.invitemanager.co)

## Requirements

- NodeJS (tested using v12)
- Database (tested using `MySQL` 5.7+)

## Setup

### Manual (recommended for production)

1. `npm install`
1. Setup databases
   1. Use the `scripts/db/setup_db0.sql` script to set up the global database `im_0`
   1. Use the `scripts/db/setup_dbx.sql` script to set up the data databases `im_1`, `im_2`, ... (you need at least one)
1. Copy the `config.example.json` to `config.json` and fill in required data
1. `npm run build`
1. `node bin/bot.js $TOKEN $FIRST_SHARD $LAST_SHARD $SHARD_COUNT`  
   (or use [pm2](https://pm2.keymetrics.io/) to run in the background)

   `$TOKEN`: Your bot token  
   `$FIRST_SHARD`: The first shard to run in this process (min. 1)  
   `$LAST_SHARD`: The last shard to run in this process (min. 1)  
   `$SHARD_COUNT`: The total amount of shards across all processes (min. 1)

### Docker (recommended for development)

Starting

1. Copy the `config.example.json` to `config.json` and fill in required data
1. `docker-compose up -d`

Restarting

1. `docker-compose restart bot`
