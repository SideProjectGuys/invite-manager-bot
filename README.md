# InviteManager Discord Bot

## Description

This is the code repository for the InviteManager Discord Bot.

## Docs

- [български](docs/bg/README.md)
- [Čeština](docs/cs/README.md)
- [Deutsch](docs/de/README.md)
- [Ελληνικά](docs/el/README.md)
- [English](docs/en/README.md)
- [Español](docs/es/README.md)
- [Français](docs/fr/README.md)
- [Indonesia](docs/id-ID/README.md)
- [Italiano](docs/it/README.md)
- [日本語](docs/ja/README.md)
- [Nederlands](docs/nl/README.md)
- [Polski](docs/pl/README.md)
- [Português](docs/pt/README.md)
- [Português do Brasil](docs/pt-BR/README.md)
- [Română](docs/ro/README.md)
- [Pусский](docs/ru/README.md)
- [Türkçe](docs/tr/README.md)

## Self hosting quick setup

### Requirements

- NodeJS (tested using v10)
- Database (tested using `MySQL` 5.7+, `MariaDB` 10.2+ should work)

### Setup

1. `npm install`
1. Setup databases
   1. Use the `scripts/db/setup_db0.sql` script to set up the global database `im_0`
   1. Use the `scripts/db/setup_dbx.sql` script to set up the data databases `im_1`, `im_2`, ... (you need at least one)
1. Copy the `config.example.json` to `config.json` and fill in required data
1. `npm start`
