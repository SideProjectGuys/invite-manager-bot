# InviteManager Discord Bot

## Description

This is the code repository for the InviteManager Discord Bot.

## Docs

- [Command reference](docs/Commands.md) that lists all available commands
- [Settings](docs/Settings.md) reference for details about the `!config` command

## Requirements

- NodeJS (tested using v10)
- Database (tested using MySQL v5.7)  
  (`MariaDB` should work, `PostgreSQL` and `MsSQL` might work, `SQLite` probably will not)

## Setup

1. `npm install`
1. Copy the `config.example.json` and name it `config.json` and fill in:
   1. The `devToken` field
   1. The `sequelize` section.
1. `npm start`
