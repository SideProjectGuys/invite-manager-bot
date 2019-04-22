# Commands

To get a list of available commands, do !help on your server.

## Overview

### Invites

| Command                                 | Description                                      | Usage                                       |
| --------------------------------------- | ------------------------------------------------ | ------------------------------------------- |
| [addInvites](#addInvites)               | Adds/Removes invites to/from a member.           | !addInvites \<user\> \<amount\> [reason]    |
| [clearInvites](#clearInvites)           | Clear invites of the server/a user.              | !clearInvites [-d value                     | --date=value] [-cb | --clearBonus] [user] |
| [createInvite](#createInvite)           | Creates unique invite codes.                     | !createInvite \<name\> [channel]            |
| [fake](#fake)                           | Help find users trying to cheat.                 | !fake [page]                                |
| [info](#info)                           | Show info about a specific member.               | !info \<user\> [details][page]              |
| [inviteCodes](#inviteCodes)             | Get a list of all your invite codes              | !inviteCodes                                |
| [inviteDetails](#inviteDetails)         | Shows details about where your invites are from. | !inviteDetails [user]                       |
| [invites](#invites)                     | Show personal invites.                           | !invites [user]                             |
| [leaderboard](#leaderboard)             | Show members with most invites.                  | !leaderboard [-c value                      | --compare=value] [duration][page] |
| [legacyInvites](#legacyInvites)         | cmd.legacyInvites.self.description               | !legacyInvites [user]                       |
| [legacyLeaderboard](#legacyLeaderboard) | cmd.legacyLeaderboard.self.description           | !legacyLeaderboard [page][date]             |
| [removeInvites](#removeInvites)         | cmd.removeInvites.self.description               | !removeInvites \<user\> \<amount\> [reason] |
| [restoreInvites](#restoreInvites)       | Restore all previously cleared invites.          | !restoreInvites [user]                      |
| [subtractFakes](#subtractFakes)         | Remove fake invites from all users.              | !subtractFakes                              |
| [subtractLeaves](#subtractLeaves)       | Remove leaves from all users                     | !subtractLeaves                             |

### Ranks

| Command                   | Description     | Usage                                |
| ------------------------- | --------------- | ------------------------------------ |
| [addRank](#addRank)       | Add a new rank. | !addRank \<role\> \<invites\> [info] |
| [ranks](#ranks)           | Show all ranks. | !ranks                               |
| [removeRank](#removeRank) | Remove a rank.  | !removeRank [rank]                   |

### Config

| Command                                 | Description                                               | Usage                                       |
| --------------------------------------- | --------------------------------------------------------- | ------------------------------------------- |
| [botConfig](#botConfig)                 | Show and change the config of the bot.                    | !botConfig [key][value]                     |
| [config](#config)                       | Show and change the config of the server.                 | !config [key][value]                        |
| [interactiveConfig](#interactiveConfig) | cmd.interactiveConfig.self.description                    | !interactiveConfig                          |
| [inviteCodeConfig](#inviteCodeConfig)   | Show and change the config of invite codes of the server. | !inviteCodeConfig [key][invitecode] [value] |
| [memberConfig](#memberConfig)           | Show and change the config of members of the server.      | !memberConfig [key][user] [value]           |
| [permissions](#permissions)             | Configure permissions to use commands.                    | !permissions [cmd][role]                    |

### Info

| Command             | Description                                                                       | Usage           |
| ------------------- | --------------------------------------------------------------------------------- | --------------- |
| [botInfo](#botInfo) | Get general information about the bot.                                            | !botInfo        |
| [credits](#credits) | cmd.credits.self.description                                                      | !credits        |
| [getBot](#getBot)   | Get an invite link for the bot.                                                   | !getBot         |
| [help](#help)       | Display help.                                                                     | !help [command] |
| [members](#members) | Show member count of current server.                                              | !members        |
| [ping](#ping)       | cmd.ping.self.description                                                         | !ping           |
| [prefix](#prefix)   | Shows the current prefix of the bot.                                              | !prefix         |
| [setup](#setup)     | Help with setting up the bot and checking for problems (e.g. missing permissions) | !setup          |
| [support](#support) | Get an invite link to our support server.                                         | !support        |

### Premium

| Command                   | Description                                                               | Usage             |
| ------------------------- | ------------------------------------------------------------------------- | ----------------- |
| [export](#export)         | Export data of InviteManager to a csv sheet.                              | !export \<type\>  |
| [premium](#premium)       | Info about premium version of InviteManager.                              | !premium [action] |
| [tryPremium](#tryPremium) | Try the premium version of InviteManager for free for a limited duration. | !tryPremium       |

### Moderation

| Command                               | Description                                                      | Usage                                            |
| ------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------ |
| [ban](#ban)                           | Ban a member from the server.                                    | !ban [-d value                                   | --deleteMessageDays=value] \<user\> [reason] |
| [caseDelete](#caseDelete)             | cmd.caseDelete.self.description                                  | !caseDelete \<caseNumber\> [reason]              |
| [caseView](#caseView)                 | cmd.caseView.self.description                                    | !caseView \<caseNumber\>                         |
| [check](#check)                       | Check violation and punishment history of a user.                | !check \<user\>                                  |
| [clean](#clean)                       | Clean a channel of certain message types.                        | !clean \<type\> [numberOfMessages]               |
| [cleanShort](#cleanShort)             | Clear short messages                                             | !cleanShort \<maxTextLength\> [numberOfMessages] |
| [cleanText](#cleanText)               | cmd.cleanText.self.description                                   | !cleanText \<text\> [numberOfMessages]           |
| [kick](#kick)                         | Kick a member from the server.                                   | !kick \<member\> [reason]                        |
| [mute](#mute)                         | cmd.mute.self.description                                        | !mute \<user\> [reason]                          |
| [punishmentConfig](#punishmentConfig) | Configure punishments when reaching a certain amount of strikes. | !punishmentConfig [punishment][strikes] [args]   |
| [purgeUntil](#purgeUntil)             | Purge messages in a channel up until a specified message.        | !purgeUntil \<messageID\>                        |
| [softBan](#softBan)                   | Ban and then automatically unban a member from the server.       | !softBan [-d value                               | --deleteMessageDays=value] \<user\> [reason] |
| [strike](#strike)                     | cmd.strike.self.description                                      | !strike \<member\> \<type\> \<amount\>           |
| [strikeConfig](#strikeConfig)         | Configure strikes received for various violations.               | !strikeConfig [violation][strikes]               |
| [unban](#unban)                       | cmd.unban.self.description                                       | !unban \<user\> [reason]                         |
| [unhoist](#unhoist)                   | cmd.unhoist.self.description                                     | !unhoist                                         |
| [unmute](#unmute)                     | cmd.unmute.self.description                                      | !unmute \<user\>                                 |
| [warn](#warn)                         | Warn a member.                                                   | !warn \<member\> [reason]                        |

### Other

| Command                             | Description                                                  | Usage                      |
| ----------------------------------- | ------------------------------------------------------------ | -------------------------- |
| [graph](#graph)                     | Shows graphs about various stats on this server.             | !graph \<type\> [duration] |
| [makeMentionable](#makeMentionable) | Make a role mentionable for 60 seconds or until it was used. | !makeMentionable \<role\>  |
| [mentionRole](#mentionRole)         | Mention an unmentionable role.                               | !mentionRole \<role\>      |

<a name='addInvites'></a>

---

## cmd.addInvites.self.title

Adds/Removes invites to/from a member.

### Usage

```text
!addInvites <user> <amount> [reason]
```

### Arguments

| Argument | Required | Description                                                                                |
| -------- | -------- | ------------------------------------------------------------------------------------------ |
| user     | Yes      | The user that will receive/lose the bonus invites.                                         |
| amount   | Yes      | The amount of invites the user will get/lose. Use a negative (-) number to remove invites. |
| reason   |          | The reason for adding/removing the invites.                                                |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='addRank'></a>

---

## cmd.addRank.self.title

Add a new rank.

### Usage

```text
!addRank <role> <invites> [info]
```

### Arguments

| Argument | Required | Description                                                          |
| -------- | -------- | -------------------------------------------------------------------- |
| role     | Yes      | The role which the user will receive when reaching this rank.        |
| invites  | Yes      | The amount of invites needed to reach the rank.                      |
| info     |          | A description that users will see so they know more about this rank. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='ban'></a>

---

## cmd.ban.self.title

Ban a member from the server.

### Usage

```text
!ban [-d value|--deleteMessageDays=value] <user> [reason]
```

### Arguments

| Argument | Required | Description              |
| -------- | -------- | ------------------------ |
| user     | Yes      | User to ban.             |
| reason   |          | Why was the user banned. |

### Flags

| Flag                | Short | Description                          |
| ------------------- | ----- | ------------------------------------ |
| --deleteMessageDays | -d    | cmd.ban.self.flags.deleteMessageDays |

<a name='botConfig'></a>

---

## cmd.botConfig.self.title

Show and change the config of the bot.

### Usage

```text
!botConfig [key] [value]
```

### Arguments

| Argument | Required | Description                                           |
| -------- | -------- | ----------------------------------------------------- |
| key      |          | The bot config setting which you want to show/change. |
| value    |          | The new value of the setting.                         |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='botInfo'></a>

---

## cmd.botInfo.self.title

Get general information about the bot.

### Usage

```text
!botInfo
```

### Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='caseDelete'></a>

---

## cmd.caseDelete.self.title

cmd.caseDelete.self.description

### Usage

```text
!caseDelete <caseNumber> [reason]
```

### Arguments

| Argument   | Required | Description                         |
| ---------- | -------- | ----------------------------------- |
| caseNumber | Yes      | cmd.caseDelete.self.args.caseNumber |
| reason     |          | cmd.caseDelete.self.args.reason     |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='caseView'></a>

---

## cmd.caseView.self.title

cmd.caseView.self.description

### Usage

```text
!caseView <caseNumber>
```

### Arguments

| Argument   | Required | Description                       |
| ---------- | -------- | --------------------------------- |
| caseNumber | Yes      | cmd.caseView.self.args.caseNumber |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='check'></a>

---

## cmd.check.self.title

Check violation and punishment history of a user.

### Usage

```text
!check <user>
```

### Arguments

| Argument | Required | Description    |
| -------- | -------- | -------------- |
| user     | Yes      | User to check. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='clean'></a>

---

## cmd.clean.self.title

Clean a channel of certain message types.

### Usage

```text
!clean <type> [numberOfMessages]
```

### Arguments

| Argument         | Required | Description                                |
| ---------------- | -------- | ------------------------------------------ |
| type             | Yes      | The type of messages that will be deleted. |
| numberOfMessages |          | Number of messages that will be searched.  |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='cleanShort'></a>

---

## cmd.cleanShort.self.title

Clear short messages

### Usage

```text
!cleanShort <maxTextLength> [numberOfMessages]
```

### Arguments

| Argument         | Required | Description                                     |
| ---------------- | -------- | ----------------------------------------------- |
| maxTextLength    | Yes      | All messages shorter than this will be deleted. |
| numberOfMessages |          | Number of messages that will be searched.       |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='cleanText'></a>

---

## cmd.cleanText.self.title

cmd.cleanText.self.description

### Usage

```text
!cleanText <text> [numberOfMessages]
```

### Arguments

| Argument         | Required | Description                                        |
| ---------------- | -------- | -------------------------------------------------- |
| text             | Yes      | All messages containing this word will be deleted. |
| numberOfMessages |          | Number of messages that will be searched.          |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='clearInvites'></a>

---

## cmd.clearInvites.self.title

Clear invites of the server/a user.

### Usage

```text
!clearInvites [-d value|--date=value] [-cb|--clearBonus] [user]
```

### Arguments

| Argument | Required | Description                                                      |
| -------- | -------- | ---------------------------------------------------------------- |
| user     |          | The user to clear all invites from. If omitted clears all users. |

### Flags

| Flag         | Short | Description                                                                              |
| ------------ | ----- | ---------------------------------------------------------------------------------------- |
| --date       | -d    | The date start at which invites should be counted. Default is today.                     |
| --clearBonus | -cb   | Add this flag to clear bonus invites aswell. Otherwise bonus invites are left untouched. |

<a name='config'></a>

---

## cmd.config.self.title

Show and change the config of the server.

### Usage

```text
!config [key] [value]
```

### Arguments

| Argument | Required | Description                                       |
| -------- | -------- | ------------------------------------------------- |
| key      |          | The config setting which you want to show/change. |
| value    |          | The new value of the setting.                     |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='createInvite'></a>

---

## cmd.createInvite.self.title

Creates unique invite codes.

### Usage

```text
!createInvite <name> [channel]
```

### Arguments

| Argument | Required | Description                                                                            |
| -------- | -------- | -------------------------------------------------------------------------------------- |
| name     | Yes      | The name of the invite code.                                                           |
| channel  |          | The channel for which the invite code is created. Uses the current channel by default. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='credits'></a>

---

## cmd.credits.self.title

cmd.credits.self.description

### Usage

```text
!credits
```

### Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='export'></a>

---

## cmd.export.self.title

Export data of InviteManager to a csv sheet.

### Usage

```text
!export <type>
```

### Arguments

| Argument | Required | Description                  |
| -------- | -------- | ---------------------------- |
| type     | Yes      | The type of export you want. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='fake'></a>

---

## cmd.fake.self.title

Help find users trying to cheat.

### Usage

```text
!fake [page]
```

### Arguments

| Argument | Required | Description                         |
| -------- | -------- | ----------------------------------- |
| page     |          | Which page of the fake list to get. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='getBot'></a>

---

## cmd.getBot.self.title

Get an invite link for the bot.

### Usage

```text
!getBot
```

### Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='graph'></a>

---

## cmd.graph.self.title

Shows graphs about various stats on this server.

### Usage

```text
!graph <type> [duration]
```

### Arguments

| Argument | Required | Description                        |
| -------- | -------- | ---------------------------------- |
| type     | Yes      | The type of chart to display.      |
| duration |          | The duration period for the chart. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='help'></a>

---

## cmd.help.self.title

Display help.

### Usage

```text
!help [command]
```

### Arguments

| Argument | Required | Description                                  |
| -------- | -------- | -------------------------------------------- |
| command  |          | The command to get detailed information for. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='info'></a>

---

## cmd.info.self.title

Show info about a specific member.

### Usage

```text
!info <user> [details] [page]
```

### Arguments

| Argument | Required | Description                                                                   |
| -------- | -------- | ----------------------------------------------------------------------------- |
| user     | Yes      | The user for whom you want to see additional info.                            |
| details  |          | Request only specific details about a member.                                 |
| page     |          | What page of the details to show. You can also use the reactions to navigate. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='interactiveConfig'></a>

---

## cmd.interactiveConfig.self.title

cmd.interactiveConfig.self.description

### Usage

```text
!interactiveConfig
```

### Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='inviteCodeConfig'></a>

---

## cmd.inviteCodeConfig.self.title

Show and change the config of invite codes of the server.

### Usage

```text
!inviteCodeConfig [key] [inviteCode] [value]
```

### Arguments

| Argument   | Required | Description                                                |
| ---------- | -------- | ---------------------------------------------------------- |
| key        |          | The config setting which you want to show/change.          |
| inviteCode |          | The invite code for which you want to change the settings. |
| value      |          | The new value of the setting.                              |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='inviteCodes'></a>

---

## cmd.inviteCodes.self.title

Get a list of all your invite codes

### Usage

```text
!inviteCodes
```

### Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='inviteDetails'></a>

---

## cmd.inviteDetails.self.title

Shows details about where your invites are from.

### Usage

```text
!inviteDetails [user]
```

### Arguments

| Argument | Required | Description                                          |
| -------- | -------- | ---------------------------------------------------- |
| user     |          | The user for whom you want to show detailed invites. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='invites'></a>

---

## cmd.invites.self.title

Show personal invites.

### Usage

```text
!invites [user]
```

### Arguments

| Argument | Required | Description                                 |
| -------- | -------- | ------------------------------------------- |
| user     |          | The user for whom you want to show invites. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='kick'></a>

---

## cmd.kick.self.title

Kick a member from the server.

### Usage

```text
!kick <member> [reason]
```

### Arguments

| Argument | Required | Description                |
| -------- | -------- | -------------------------- |
| member   | Yes      | Member to kick.            |
| reason   |          | Why the member was kicked. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='leaderboard'></a>

---

## cmd.leaderboard.self.title

Show members with most invites.

### Usage

```text
!leaderboard [-c value|--compare=value] [duration] [page]
```

### Arguments

| Argument | Required | Description                                          |
| -------- | -------- | ---------------------------------------------------- |
| duration |          | The duration for which to calculate the leaderboard. |
| page     |          | Which page of the leaderboard to get.                |

### Flags

| Flag      | Short | Description                                                         |
| --------- | ----- | ------------------------------------------------------------------- |
| --compare | -c    | The date to which the current leaderboard standings are compared to |

<a name='legacyInvites'></a>

---

## cmd.legacyInvites.self.title

cmd.legacyInvites.self.description

### Usage

```text
!legacyInvites [user]
```

### Arguments

| Argument | Required | Description                      |
| -------- | -------- | -------------------------------- |
| user     |          | cmd.legacyInvites.self.args.user |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='legacyLeaderboard'></a>

---

## cmd.legacyLeaderboard.self.title

cmd.legacyLeaderboard.self.description

### Usage

```text
!legacyLeaderboard [page] [date]
```

### Arguments

| Argument | Required | Description                          |
| -------- | -------- | ------------------------------------ |
| page     |          | cmd.legacyLeaderboard.self.args.page |
| date     |          | cmd.legacyLeaderboard.self.args.date |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='makeMentionable'></a>

---

## cmd.makeMentionable.self.title

Make a role mentionable for 60 seconds or until it was used.

### Usage

```text
!makeMentionable <role>
```

### Arguments

| Argument | Required | Description                        |
| -------- | -------- | ---------------------------------- |
| role     | Yes      | The role that you want to mention. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='memberConfig'></a>

---

## cmd.memberConfig.self.title

Show and change the config of members of the server.

### Usage

```text
!memberConfig [key] [user] [value]
```

### Arguments

| Argument | Required | Description                                              |
| -------- | -------- | -------------------------------------------------------- |
| key      |          | The member config setting which you want to show/change. |
| user     |          | The member that the setting is shown/changed for.        |
| value    |          | The new value of the setting.                            |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='members'></a>

---

## cmd.members.self.title

Show member count of current server.

### Usage

```text
!members
```

### Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='mentionRole'></a>

---

## cmd.mentionRole.self.title

Mention an unmentionable role.

### Usage

```text
!mentionRole <role>
```

### Arguments

| Argument | Required | Description                        |
| -------- | -------- | ---------------------------------- |
| role     | Yes      | The role that you want to mention. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='mute'></a>

---

## cmd.mute.self.title

cmd.mute.self.description

### Usage

```text
!mute <user> [reason]
```

### Arguments

| Argument | Required | Description                        |
| -------- | -------- | ---------------------------------- |
| user     | Yes      | The user that should be muted.     |
| reason   |          | The reason why this user is muted. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='permissions'></a>

---

## cmd.permissions.self.title

Configure permissions to use commands.

### Usage

```text
!permissions [cmd] [role]
```

### Arguments

| Argument | Required | Description                                                       |
| -------- | -------- | ----------------------------------------------------------------- |
| cmd      |          | The command to configure permissions for.                         |
| role     |          | The role which should be granted or denied access to the command. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='ping'></a>

---

## cmd.ping.self.title

cmd.ping.self.description

### Usage

```text
!ping
```

### Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='prefix'></a>

---

## cmd.prefix.self.title

Shows the current prefix of the bot.

### Usage

```text
!prefix
```

### Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='premium'></a>

---

## cmd.premium.self.title

Info about premium version of InviteManager.

### Usage

```text
!premium [action]
```

### Arguments

| Argument | Required | Description                                                                                                                         |
| -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| action   |          | The action to perform. None for premium info. `check` to check your premium status. `activate` to use your premium for this server. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='punishmentConfig'></a>

---

## cmd.punishmentConfig.self.title

Configure punishments when reaching a certain amount of strikes.

### Usage

```text
!punishmentConfig [punishment] [strikes] [args]
```

### Arguments

| Argument   | Required | Description                                       |
| ---------- | -------- | ------------------------------------------------- |
| punishment |          | Type of punishment to use.                        |
| strikes    |          | Number of strikes for this punishment to be used. |
| args       |          | Arguments passed to the punishment.               |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='purge'></a>

---

## cmd.purge.self.title

Purge messages in a channel.

### Usage

```text
!purge <quantity> [user]
```

### Arguments

| Argument | Required | Description                          |
| -------- | -------- | ------------------------------------ |
| quantity | Yes      | How many messages should be deleted. |
| user     |          | cmd.purge.self.args.user             |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='purgeUntil'></a>

---

## cmd.purgeUntil.self.title

Purge messages in a channel up until a specified message.

### Usage

```text
!purgeUntil <messageID>
```

### Arguments

| Argument  | Required | Description                    |
| --------- | -------- | ------------------------------ |
| messageID | Yes      | Last message ID to be deleted. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='ranks'></a>

---

## cmd.ranks.self.title

Show all ranks.

### Usage

```text
!ranks
```

### Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='removeInvites'></a>

---

## cmd.removeInvites.self.title

cmd.removeInvites.self.description

### Usage

```text
!removeInvites <user> <amount> [reason]
```

### Arguments

| Argument | Required | Description                        |
| -------- | -------- | ---------------------------------- |
| user     | Yes      | cmd.removeInvites.self.args.user   |
| amount   | Yes      | cmd.removeInvites.self.args.amount |
| reason   |          | cmd.removeInvites.self.args.reason |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='removeRank'></a>

---

## cmd.removeRank.self.title

Remove a rank.

### Usage

```text
!removeRank [rank]
```

### Arguments

| Argument | Required | Description                                |
| -------- | -------- | ------------------------------------------ |
| rank     |          | The for which you want to remove the rank. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='restoreInvites'></a>

---

## cmd.restoreInvites.self.title

Restore all previously cleared invites.

### Usage

```text
!restoreInvites [user]
```

### Arguments

| Argument | Required | Description                                                                    |
| -------- | -------- | ------------------------------------------------------------------------------ |
| user     |          | The user to restore all invites to. If omitted restores invites for all users. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='setup'></a>

---

## cmd.setup.self.title

Help with setting up the bot and checking for problems (e.g. missing permissions)

### Usage

```text
!setup
```

### Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='softBan'></a>

---

## cmd.softBan.self.title

Ban and then automatically unban a member from the server.

### Usage

```text
!softBan [-d value|--deleteMessageDays=value] <user> [reason]
```

### Arguments

| Argument | Required | Description              |
| -------- | -------- | ------------------------ |
| user     | Yes      | User to ban.             |
| reason   |          | Why was the user banned. |

### Flags

| Flag                | Short | Description                              |
| ------------------- | ----- | ---------------------------------------- |
| --deleteMessageDays | -d    | cmd.softBan.self.flags.deleteMessageDays |

<a name='strike'></a>

---

## cmd.strike.self.title

cmd.strike.self.description

### Usage

```text
!strike <member> <type> <amount>
```

### Arguments

| Argument | Required | Description                 |
| -------- | -------- | --------------------------- |
| member   | Yes      | cmd.strike.self.args.member |
| type     | Yes      | cmd.strike.self.args.type   |
| amount   | Yes      | cmd.strike.self.args.amount |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='strikeConfig'></a>

---

## cmd.strikeConfig.self.title

Configure strikes received for various violations.

### Usage

```text
!strikeConfig [violation] [strikes]
```

### Arguments

| Argument  | Required | Description        |
| --------- | -------- | ------------------ |
| violation |          | Violation type.    |
| strikes   |          | Number of strikes. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='subtractFakes'></a>

---

## cmd.subtractFakes.self.title

Remove fake invites from all users.

### Usage

```text
!subtractFakes
```

### Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='subtractLeaves'></a>

---

## cmd.subtractLeaves.self.title

Remove leaves from all users

### Usage

```text
!subtractLeaves
```

### Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='support'></a>

---

## cmd.support.self.title

Get an invite link to our support server.

### Usage

```text
!support
```

### Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='tryPremium'></a>

---

## cmd.tryPremium.self.title

Try the premium version of InviteManager for free for a limited duration.

### Usage

```text
!tryPremium
```

### Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='unban'></a>

---

## cmd.unban.self.title

cmd.unban.self.description

### Usage

```text
!unban <user> [reason]
```

### Arguments

| Argument | Required | Description                           |
| -------- | -------- | ------------------------------------- |
| user     | Yes      | The user that should be unbanned.     |
| reason   |          | The reason why this user is unbanned. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='unhoist'></a>

---

## cmd.unhoist.self.title

cmd.unhoist.self.description

### Usage

```text
!unhoist
```

### Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='unmute'></a>

---

## cmd.unmute.self.title

cmd.unmute.self.description

### Usage

```text
!unmute <user>
```

### Arguments

| Argument | Required | Description                      |
| -------- | -------- | -------------------------------- |
| user     | Yes      | The user that should be unmuted. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


<a name='warn'></a>

---

## cmd.warn.self.title

Warn a member.

### Usage

```text
!warn <member> [reason]
```

### Arguments

| Argument | Required | Description                    |
| -------- | -------- | ------------------------------ |
| member   | Yes      | Member to warn.                |
| reason   |          | Why was the member was warned. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |

