# Setting up Premium

## Pro Bot

To set up premium, you have to run the following command in your server using the **regular InviteManager Bot**, not the premium one:

```
!premium check
```

This will send a request to patreon and check your premium status. After that you have to activate premium on your server using the following command:

```
!premium activate
```

Premium should now be active on this server. You can always check your premium subscription by doing

```
!premium
```

To deactivate premium on a server, simply do:

```
!premium deactivate
```

Once you have activated the bot on your server, please ask one of the moderators on our discord for the pro bot invite link.

## Custom Bot

Custom bots automatically have premium activated on all servers they join. We don't have a limit of how many servers you can run your custom bot on, but please only use it on your own servers, otherwise we will have to add a limit.

### Creating a Bot Token

First you have to create a new bot in the [Discord Developer Portal](https://discordapp.com/developers/applications/). Make sure you are logged in with your main Discord Account and click on "New Application" in the top right.

![Discord Developer Portal Add Application](../assets/discord-developer-1-add-application.png 'Discord Developer Portal Add Application')

Now enter the name of your Bot (you can change this again later), and hit "Create".

![Discord Developer Portal Add Application](../assets/discord-developer-2-add-application-popup.png 'Discord Developer Portal Add Application')

Now copy the ID of the `CLIENT ID` of your bot and save it for later.

![Discord Developer Portal Add Application](../assets/discord-developer-3-application-general-info.png 'Discord Developer Portal Add Application')

Then open the "Bots" tab on the left side and click on "Add Bot".

![Discord Developer Portal Add Application](../assets/discord-developer-4-application-bots.png 'Discord Developer Portal Add Application')

Confirm by clicking on "Yes, do it!".

![Discord Developer Portal Add Application](../assets/discord-developer-5-application-bots-add.png 'Discord Developer Portal Add Application')

Now click the "Copy" button under the `TOKEN` settings.

Send a message to one of the `Lead Developers` on our discord containing both the `CLIENT ID` and the `BOT TOKEN`. If you have been using the regular (blue) or pro (orange) bot and would like us to migrate your data over to your custom bot, please also send us the IDs of the server you want to migrate.

Example message:

```
New custom bot
CLIENT ID: <your client ID here>
BOT TOKEN: <your bot token here>
SERVER IDS: <id1>, <id2>, <id3>, ...
```

After we have have this message, it might take us up to 1 day to set up your bot, but if we're online, it's usually much faster.

![Discord Developer Portal Add Application](../assets/discord-developer-6-application-bots-token.png 'Discord Developer Portal Add Application')

On the last page you can also set the logo and name of your bot.
