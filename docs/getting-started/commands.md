# Commands

To get a list of available commands, do !help on your server.

## Overview

### Invites

| Command                                 | Description                                      | Usage                                                            |
| --------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| [addInvites](#addInvites)               | Adds/Removes invites to/from a member.           | !addInvites \<user\> \<amount\> [reason]                         |
| [clearInvites](#clearInvites)           | Clear invites of the server/a user.              | !clearInvites [-d value\|--date=value][-cb\|--clearbonus] [user] |
| [createInvite](#createInvite)           | Creates unique invite codes.                     | !createInvite \<name\> [channel]                                 |
| [fake](#fake)                           | Help find users trying to cheat.                 | !fake [page]                                                     |
| [info](#info)                           | Show info about a specific member.               | !info \<user\> [details][page]                                   |
| [inviteCodes](#inviteCodes)             | Get a list of all your invite codes              | !inviteCodes                                                     |
| [inviteDetails](#inviteDetails)         | Shows details about where your invites are from. | !inviteDetails [user]                                            |
| [invites](#invites)                     | Show personal invites.                           | !invites [user]                                                  |
| [leaderboard](#leaderboard)             | Show members with most invites.                  | !leaderboard [-c value\|--compare=value][duration] [page]        |
| [legacyInvites](#legacyInvites)         | cmd.legacyInvites.self.description               | !legacyInvites [user]                                            |
| [legacyLeaderboard](#legacyLeaderboard) | cmd.legacyLeaderboard.self.description           | !legacyLeaderboard [page][date]                                  |
| [removeInvites](#removeInvites)         | cmd.removeInvites.self.description               | !removeInvites \<user\> \<amount\> [reason]                      |
| [restoreInvites](#restoreInvites)       | Restore all previously cleared invites.          | !restoreInvites [user]                                           |
| [subtractFakes](#subtractFakes)         | Remove fake invites from all users.              | !subtractFakes                                                   |
| [subtractLeaves](#subtractLeaves)       | Remove leaves from all users                     | !subtractLeaves                                                  |

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

| Command                               | Description                                                      | Usage                                                            |
| ------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| [ban](#ban)                           | Ban a member from the server.                                    | !ban [-d value\|--deleteMessageDays=value] \<user\> [reason]     |
| [caseDelete](#caseDelete)             | cmd.caseDelete.self.description                                  | !caseDelete \<caseNumber\> [reason]                              |
| [caseView](#caseView)                 | cmd.caseView.self.description                                    | !caseView \<caseNumber\>                                         |
| [check](#check)                       | Check violation and punishment history of a user.                | !check \<user\>                                                  |
| [clean](#clean)                       | Clean a channel of certain message types.                        | !clean \<type\> [numberOfMessages]                               |
| [cleanShort](#cleanShort)             | Clear short messages                                             | !cleanShort \<maxTextLength\> [numberOfMessages]                 |
| [cleanText](#cleanText)               | cmd.cleanText.self.description                                   | !cleanText \<text\> [numberOfMessages]                           |
| [kick](#kick)                         | Kick a member from the server.                                   | !kick \<member\> [reason]                                        |
| [mute](#mute)                         | cmd.mute.self.description                                        | !mute \<user\> [reason]                                          |
| [punishmentConfig](#punishmentConfig) | Configure punishments when reaching a certain amount of strikes. | !punishmentConfig [punishment][strikes] [args]                   |
| [purgeUntil](#purgeUntil)             | Purge messages in a channel up until a specified message.        | !purgeUntil \<messageID\>                                        |
| [softBan](#softBan)                   | Ban and then automatically unban a member from the server.       | !softBan [-d value\|--deleteMessageDays=value] \<user\> [reason] |
| [strike](#strike)                     | cmd.strike.self.description                                      | !strike \<member\> \<type\> \<amount\>                           |
| [strikeConfig](#strikeConfig)         | Configure strikes received for various violations.               | !strikeConfig [violation][strikes]                               |
| [unban](#unban)                       | cmd.unban.self.description                                       | !unban \<user\> [reason]                                         |
| [unhoist](#unhoist)                   | cmd.unhoist.self.description                                     | !unhoist                                                         |
| [unmute](#unmute)                     | cmd.unmute.self.description                                      | !unmute \<user\>                                                 |
| [warn](#warn)                         | Warn a member.                                                   | !warn \<member\> [reason]                                        |

### Other

| Command                             | Description                                                  | Usage                      |
| ----------------------------------- | ------------------------------------------------------------ | -------------------------- |
| [graph](#graph)                     | Shows graphs about various stats on this server.             | !graph \<type\> [duration] |
| [makeMentionable](#makeMentionable) | Make a role mentionable for 60 seconds or until it was used. | !makeMentionable \<role\>  |
| [mentionRole](#mentionRole)         | Mention an unmentionable role.                               | !mentionRole \<role\>      |

<a name='addInvites'></a>

---

## !addInvites

Adds/Removes invites to/from a member.

### Usage

```text
!addInvites <user> <amount> [reason]
```

### Arguments

| Argument | Type   | Required | Description                                                                                |
| -------- | ------ | -------- | ------------------------------------------------------------------------------------------ |
| user     | User   | Yes      | The user that will receive/lose the bonus invites.                                         |
| amount   | Number | Yes      | The amount of invites the user will get/lose. Use a negative (-) number to remove invites. |
| reason   | Text   |          | The reason for adding/removing the invites.                                                |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!addInvites @User
```

```text
!addInvites User
```

```text
!addInvites User#1234
```

```text
!addInvites "User with a space"
```

```text
!addInvites @User 2
```

```text
!addInvites @User 42
```

```text
!addInvites @User 2 Text
```

```text
!addInvites @User 2 Text with a space
```

<a name='addRank'></a>

---

## !addRank

Add a new rank.

### Usage

```text
!addRank <role> <invites> [info]
```

### Arguments

| Argument | Type   | Required | Description                                                          |
| -------- | ------ | -------- | -------------------------------------------------------------------- |
| role     | Role   | Yes      | The role which the user will receive when reaching this rank.        |
| invites  | Number | Yes      | The amount of invites needed to reach the rank.                      |
| info     | Text   |          | A description that users will see so they know more about this rank. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!addRank @Role
```

```text
!addRank Role
```

```text
!addRank "Role with space"
```

```text
!addRank @Role 2
```

```text
!addRank @Role 42
```

```text
!addRank @Role 2 Text
```

```text
!addRank @Role 2 Text with a space
```

<a name='ban'></a>

---

## !ban

Ban a member from the server.

### Usage

```text
!ban [-d value|--deleteMessageDays=value] <user> [reason]
```

### Arguments

| Argument | Type | Required | Description              |
| -------- | ---- | -------- | ------------------------ |
| user     | User | Yes      | User to ban.             |
| reason   | Text |          | Why was the user banned. |

### Flags

| Flag                | Short | Description                          |
| ------------------- | ----- | ------------------------------------ |
| --deleteMessageDays | -d    | cmd.ban.self.flags.deleteMessageDays |

### Examples

```text
!ban @User
```

```text
!ban User
```

```text
!ban User#1234
```

```text
!ban "User with a space"
```

```text
!ban @User Text
```

```text
!ban @User Text with a space
```

```text
!ban --deleteMessageDays=2 @User
```

```text
!ban -d 2 @User
```

<a name='botConfig'></a>

---

## !botConfig

Show and change the config of the bot.

### Usage

```text
!botConfig [key] [value]
```

### Arguments

| Argument | Type | Required | Description                                           |
| -------- | ---- | -------- | ----------------------------------------------------- |
| key      |      |          | The bot config setting which you want to show/change. |
| value    |      |          | The new value of the setting.                         |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!botConfig
```

```text
!botConfig activityEnabled
```

```text
!botConfig activityMessage
```

```text
!botConfig activityStatus
```

```text
!botConfig activityType
```

```text
!botConfig activityUrl
```

```text
!botConfig embedDefaultColor
```

```text
!botConfig activityEnabled value
```

<a name='botInfo'></a>

---

## !botInfo

Get general information about the bot.

### Usage

```text
!botInfo
```

### Arguments

| Argument | Type | Required | Description |
| -------- | ---- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!botInfo
```

<a name='caseDelete'></a>

---

## !caseDelete

cmd.caseDelete.self.description

### Usage

```text
!caseDelete <caseNumber> [reason]
```

### Arguments

| Argument   | Type   | Required | Description                         |
| ---------- | ------ | -------- | ----------------------------------- |
| caseNumber | Number | Yes      | cmd.caseDelete.self.args.caseNumber |
| reason     | Text   |          | cmd.caseDelete.self.args.reason     |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!caseDelete 2
```

```text
!caseDelete 42
```

```text
!caseDelete 2 Text
```

```text
!caseDelete 2 Text with a space
```

<a name='caseView'></a>

---

## !caseView

cmd.caseView.self.description

### Usage

```text
!caseView <caseNumber>
```

### Arguments

| Argument   | Type   | Required | Description                       |
| ---------- | ------ | -------- | --------------------------------- |
| caseNumber | Number | Yes      | cmd.caseView.self.args.caseNumber |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!caseView 2
```

```text
!caseView 42
```

<a name='check'></a>

---

## !check

Check violation and punishment history of a user.

### Usage

```text
!check <user>
```

### Arguments

| Argument | Type | Required | Description    |
| -------- | ---- | -------- | -------------- |
| user     | User | Yes      | User to check. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!check @User
```

```text
!check User
```

```text
!check User#1234
```

```text
!check "User with a space"
```

<a name='clean'></a>

---

## !clean

Clean a channel of certain message types.

### Usage

```text
!clean <type> [numberOfMessages]
```

### Arguments

| Argument         | Type   | Required | Description                                |
| ---------------- | ------ | -------- | ------------------------------------------ |
| type             |        | Yes      | The type of messages that will be deleted. |
| numberOfMessages | Number |          | Number of messages that will be searched.  |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!clean bots
```

```text
!clean embeds
```

```text
!clean emojis
```

```text
!clean images
```

```text
!clean links
```

```text
!clean mentions
```

```text
!clean reacted
```

```text
!clean reactions
```

```text
!clean bots 2
```

```text
!clean bots 42
```

<a name='cleanShort'></a>

---

## !cleanShort

Clear short messages

### Usage

```text
!cleanShort <maxTextLength> [numberOfMessages]
```

### Arguments

| Argument         | Type   | Required | Description                                     |
| ---------------- | ------ | -------- | ----------------------------------------------- |
| maxTextLength    | Number | Yes      | All messages shorter than this will be deleted. |
| numberOfMessages | Number |          | Number of messages that will be searched.       |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!cleanShort 2
```

```text
!cleanShort 42
```

```text
!cleanShort 2 2
```

```text
!cleanShort 2 42
```

<a name='cleanText'></a>

---

## !cleanText

cmd.cleanText.self.description

### Usage

```text
!cleanText <text> [numberOfMessages]
```

### Arguments

| Argument         | Type   | Required | Description                                        |
| ---------------- | ------ | -------- | -------------------------------------------------- |
| text             | Text   | Yes      | All messages containing this word will be deleted. |
| numberOfMessages | Number |          | Number of messages that will be searched.          |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!cleanText Text
```

```text
!cleanText "Text with a space"
```

```text
!cleanText Text 2
```

```text
!cleanText Text 42
```

<a name='clearInvites'></a>

---

## !clearInvites

Clear invites of the server/a user.

### Usage

```text
!clearInvites [-d value|--date=value] [-cb|--clearBonus] [user]
```

### Arguments

| Argument | Type | Required | Description                                                      |
| -------- | ---- | -------- | ---------------------------------------------------------------- |
| user     | User |          | The user to clear all invites from. If omitted clears all users. |

### Flags

| Flag         | Short | Description                                                                              |
| ------------ | ----- | ---------------------------------------------------------------------------------------- |
| --date       | -d    | The date start at which invites should be counted. Default is today.                     |
| --clearBonus | -cb   | Add this flag to clear bonus invites aswell. Otherwise bonus invites are left untouched. |

### Examples

```text
!clearInvites
```

```text
!clearInvites @User
```

```text
!clearInvites User
```

```text
!clearInvites User#1234
```

```text
!clearInvites "User with a space"
```

```text
!clearInvites --date=undefined
```

```text
!clearInvites -d undefined
```

```text
!clearInvites --clearBonus=yes
```

```text
!clearInvites -cb yes
```

<a name='config'></a>

---

## !config

Show and change the config of the server.

### Usage

```text
!config [key] [value]
```

### Arguments

| Argument | Type | Required | Description                                       |
| -------- | ---- | -------- | ------------------------------------------------- |
| key      |      |          | The config setting which you want to show/change. |
| value    |      |          | The new value of the setting.                     |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!config
```

```text
!config autoModAllCapsEnabled
```

```text
!config autoModAllCapsMinCharacters
```

```text
!config autoModAllCapsPercentageCaps
```

```text
!config autoModDeleteBotMessage
```

```text
!config autoModDeleteBotMessageTimeoutInSeconds
```

```text
!config autoModDisabledForOldMembers
```

```text
!config autoModDisabledForOldMembersThreshold
```

```text
!config autoModDuplicateTextEnabled
```

```text
!config autoModDuplicateTextTimeframeInSeconds
```

```text
!config autoModEmojisEnabled
```

```text
!config autoModEmojisMaxNumberOfEmojis
```

```text
!config autoModEnabled
```

```text
!config autoModHoistEnabled
```

```text
!config autoModIgnoredChannels
```

```text
!config autoModIgnoredRoles
```

```text
!config autoModInvitesEnabled
```

```text
!config autoModLinksBlacklist
```

```text
!config autoModLinksEnabled
```

```text
!config autoModLinksFollowRedirects
```

```text
!config autoModLinksWhitelist
```

```text
!config autoModLogEnabled
```

```text
!config autoModMentionRolesEnabled
```

```text
!config autoModMentionRolesMaxNumberOfMentions
```

```text
!config autoModMentionUsersEnabled
```

```text
!config autoModMentionUsersMaxNumberOfMentions
```

```text
!config autoModModeratedChannels
```

```text
!config autoModModeratedRoles
```

```text
!config autoModQuickMessagesEnabled
```

```text
!config autoModQuickMessagesNumberOfMessages
```

```text
!config autoModQuickMessagesTimeframeInSeconds
```

```text
!config autoModWordsBlacklist
```

```text
!config autoModWordsEnabled
```

```text
!config autoSubtractFakes
```

```text
!config autoSubtractLeaves
```

```text
!config autoSubtractLeaveThreshold
```

```text
!config captchaVerificationFailedMessage
```

```text
!config captchaVerificationLogEnabled
```

```text
!config captchaVerificationOnJoin
```

```text
!config captchaVerificationSuccessMessage
```

```text
!config captchaVerificationTimeout
```

```text
!config captchaVerificationWelcomeMessage
```

```text
!config channels
```

```text
!config getUpdates
```

```text
!config hideLeftMembersFromLeaderboard
```

```text
!config ignoredChannels
```

```text
!config joinMessage
```

```text
!config joinMessageChannel
```

```text
!config lang
```

```text
!config leaderboardStyle
```

```text
!config leaveMessage
```

```text
!config leaveMessageChannel
```

```text
!config logChannel
```

```text
!config modLogChannel
```

```text
!config modPunishmentBanDeleteMessage
```

```text
!config modPunishmentKickDeleteMessage
```

```text
!config modPunishmentMuteDeleteMessage
```

```text
!config modPunishmentSoftbanDeleteMessage
```

```text
!config modPunishmentWarnDeleteMessage
```

```text
!config mutedRole
```

```text
!config prefix
```

```text
!config rankAnnouncementChannel
```

```text
!config rankAnnouncementMessage
```

```text
!config rankAssignmentStyle
```

```text
!config autoModAllCapsEnabled value
```

<a name='createInvite'></a>

---

## !createInvite

Creates unique invite codes.

### Usage

```text
!createInvite <name> [channel]
```

### Arguments

| Argument | Type    | Required | Description                                                                            |
| -------- | ------- | -------- | -------------------------------------------------------------------------------------- |
| name     | Text    | Yes      | The name of the invite code.                                                           |
| channel  | Channel |          | The channel for which the invite code is created. Uses the current channel by default. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!createInvite Text
```

```text
!createInvite "Text with a space"
```

```text
!createInvite Text #general
```

```text
!createInvite Text general
```

```text
!createInvite Text "Channel with a space"
```

<a name='credits'></a>

---

## !credits

cmd.credits.self.description

### Usage

```text
!credits
```

### Arguments

| Argument | Type | Required | Description |
| -------- | ---- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!credits
```

<a name='export'></a>

---

## !export

Export data of InviteManager to a csv sheet.

### Usage

```text
!export <type>
```

### Arguments

| Argument | Type | Required | Description                  |
| -------- | ---- | -------- | ---------------------------- |
| type     |      | Yes      | The type of export you want. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!export leaderboard
```

<a name='fake'></a>

---

## !fake

Help find users trying to cheat.

### Usage

```text
!fake [page]
```

### Arguments

| Argument | Type   | Required | Description                         |
| -------- | ------ | -------- | ----------------------------------- |
| page     | Number |          | Which page of the fake list to get. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!fake
```

```text
!fake 2
```

```text
!fake 42
```

<a name='getBot'></a>

---

## !getBot

Get an invite link for the bot.

### Usage

```text
!getBot
```

### Arguments

| Argument | Type | Required | Description |
| -------- | ---- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!getBot
```

<a name='graph'></a>

---

## !graph

Shows graphs about various stats on this server.

### Usage

```text
!graph <type> [duration]
```

### Arguments

| Argument | Type     | Required | Description                        |
| -------- | -------- | -------- | ---------------------------------- |
| type     |          | Yes      | The type of chart to display.      |
| duration | Duration |          | The duration period for the chart. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!graph joins
```

```text
!graph leaves
```

```text
!graph usage
```

```text
!graph joins duration
```

<a name='help'></a>

---

## !help

Display help.

### Usage

```text
!help [command]
```

### Arguments

| Argument | Type | Required | Description                                  |
| -------- | ---- | -------- | -------------------------------------------- |
| command  |      |          | The command to get detailed information for. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!help
```

```text
!help addInvites
```

```text
!help addRank
```

```text
!help ban
```

```text
!help botConfig
```

```text
!help botInfo
```

```text
!help caseDelete
```

```text
!help caseView
```

```text
!help check
```

```text
!help clean
```

```text
!help cleanShort
```

```text
!help cleanText
```

```text
!help clearInvites
```

```text
!help config
```

```text
!help createInvite
```

```text
!help credits
```

```text
!help export
```

```text
!help fake
```

```text
!help getBot
```

```text
!help graph
```

```text
!help help
```

```text
!help info
```

```text
!help interactiveConfig
```

```text
!help inviteCodeConfig
```

```text
!help inviteCodes
```

```text
!help inviteDetails
```

```text
!help invites
```

```text
!help kick
```

```text
!help leaderboard
```

```text
!help legacyInvites
```

```text
!help legacyLeaderboard
```

```text
!help makeMentionable
```

```text
!help memberConfig
```

```text
!help members
```

```text
!help mentionRole
```

```text
!help mute
```

```text
!help permissions
```

```text
!help ping
```

```text
!help prefix
```

```text
!help premium
```

```text
!help punishmentConfig
```

```text
!help purge
```

```text
!help purgeUntil
```

```text
!help ranks
```

```text
!help removeInvites
```

```text
!help removeRank
```

```text
!help restoreInvites
```

```text
!help setup
```

```text
!help softBan
```

```text
!help strike
```

```text
!help strikeConfig
```

```text
!help subtractFakes
```

```text
!help subtractLeaves
```

```text
!help support
```

```text
!help tryPremium
```

```text
!help unban
```

```text
!help unhoist
```

```text
!help unmute
```

```text
!help warn
```

<a name='info'></a>

---

## !info

Show info about a specific member.

### Usage

```text
!info <user> [details] [page]
```

### Arguments

| Argument | Type   | Required | Description                                                                   |
| -------- | ------ | -------- | ----------------------------------------------------------------------------- |
| user     | User   | Yes      | The user for whom you want to see additional info.                            |
| details  |        |          | Request only specific details about a member.                                 |
| page     | Number |          | What page of the details to show. You can also use the reactions to navigate. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!info @User
```

```text
!info User
```

```text
!info User#1234
```

```text
!info "User with a space"
```

```text
!info @User bonus
```

```text
!info @User members
```

```text
!info @User bonus 2
```

```text
!info @User bonus 42
```

<a name='interactiveConfig'></a>

---

## !interactiveConfig

cmd.interactiveConfig.self.description

### Usage

```text
!interactiveConfig
```

### Arguments

| Argument | Type | Required | Description |
| -------- | ---- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!interactiveConfig
```

<a name='inviteCodeConfig'></a>

---

## !inviteCodeConfig

Show and change the config of invite codes of the server.

### Usage

```text
!inviteCodeConfig [key] [inviteCode] [value]
```

### Arguments

| Argument   | Type        | Required | Description                                                |
| ---------- | ----------- | -------- | ---------------------------------------------------------- |
| key        |             |          | The config setting which you want to show/change.          |
| inviteCode | Invite code |          | The invite code for which you want to change the settings. |
| value      |             |          | The new value of the setting.                              |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!inviteCodeConfig
```

```text
!inviteCodeConfig name
```

```text
!inviteCodeConfig roles
```

```text
!inviteCodeConfig name inviteCode
```

```text
!inviteCodeConfig name inviteCode value
```

<a name='inviteCodes'></a>

---

## !inviteCodes

Get a list of all your invite codes

### Usage

```text
!inviteCodes
```

### Arguments

| Argument | Type | Required | Description |
| -------- | ---- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!inviteCodes
```

<a name='inviteDetails'></a>

---

## !inviteDetails

Shows details about where your invites are from.

### Usage

```text
!inviteDetails [user]
```

### Arguments

| Argument | Type | Required | Description                                          |
| -------- | ---- | -------- | ---------------------------------------------------- |
| user     | User |          | The user for whom you want to show detailed invites. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!inviteDetails
```

```text
!inviteDetails @User
```

```text
!inviteDetails User
```

```text
!inviteDetails User#1234
```

```text
!inviteDetails "User with a space"
```

<a name='invites'></a>

---

## !invites

Show personal invites.

### Usage

```text
!invites [user]
```

### Arguments

| Argument | Type | Required | Description                                 |
| -------- | ---- | -------- | ------------------------------------------- |
| user     | User |          | The user for whom you want to show invites. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!invites
```

```text
!invites @User
```

```text
!invites User
```

```text
!invites User#1234
```

```text
!invites "User with a space"
```

<a name='kick'></a>

---

## !kick

Kick a member from the server.

### Usage

```text
!kick <member> [reason]
```

### Arguments

| Argument | Type   | Required | Description                |
| -------- | ------ | -------- | -------------------------- |
| member   | Member | Yes      | Member to kick.            |
| reason   | Text   |          | Why the member was kicked. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!kick member
```

```text
!kick member Text
```

```text
!kick member Text with a space
```

<a name='leaderboard'></a>

---

## !leaderboard

Show members with most invites.

### Usage

```text
!leaderboard [-c value|--compare=value] [duration] [page]
```

### Arguments

| Argument | Type     | Required | Description                                          |
| -------- | -------- | -------- | ---------------------------------------------------- |
| duration | Duration |          | The duration for which to calculate the leaderboard. |
| page     | Number   |          | Which page of the leaderboard to get.                |

### Flags

| Flag      | Short | Description                                                         |
| --------- | ----- | ------------------------------------------------------------------- |
| --compare | -c    | The date to which the current leaderboard standings are compared to |

### Examples

```text
!leaderboard
```

```text
!leaderboard duration
```

```text
!leaderboard duration 2
```

```text
!leaderboard duration 42
```

```text
!leaderboard --compare=undefined
```

```text
!leaderboard -c undefined
```

<a name='legacyInvites'></a>

---

## !legacyInvites

cmd.legacyInvites.self.description

### Usage

```text
!legacyInvites [user]
```

### Arguments

| Argument | Type | Required | Description                      |
| -------- | ---- | -------- | -------------------------------- |
| user     | User |          | cmd.legacyInvites.self.args.user |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!legacyInvites
```

```text
!legacyInvites @User
```

```text
!legacyInvites User
```

```text
!legacyInvites User#1234
```

```text
!legacyInvites "User with a space"
```

<a name='legacyLeaderboard'></a>

---

## !legacyLeaderboard

cmd.legacyLeaderboard.self.description

### Usage

```text
!legacyLeaderboard [page] [date]
```

### Arguments

| Argument | Type   | Required | Description                          |
| -------- | ------ | -------- | ------------------------------------ |
| page     | Number |          | cmd.legacyLeaderboard.self.args.page |
| date     | Text   |          | cmd.legacyLeaderboard.self.args.date |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!legacyLeaderboard
```

```text
!legacyLeaderboard 2
```

```text
!legacyLeaderboard 42
```

```text
!legacyLeaderboard 2 Text
```

```text
!legacyLeaderboard 2 "Text with a space"
```

<a name='makeMentionable'></a>

---

## !makeMentionable

Make a role mentionable for 60 seconds or until it was used.

### Usage

```text
!makeMentionable <role>
```

### Arguments

| Argument | Type | Required | Description                        |
| -------- | ---- | -------- | ---------------------------------- |
| role     | Role | Yes      | The role that you want to mention. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!makeMentionable @Role
```

```text
!makeMentionable Role
```

```text
!makeMentionable "Role with space"
```

<a name='memberConfig'></a>

---

## !memberConfig

Show and change the config of members of the server.

### Usage

```text
!memberConfig [key] [user] [value]
```

### Arguments

| Argument | Type | Required | Description                                              |
| -------- | ---- | -------- | -------------------------------------------------------- |
| key      |      |          | The member config setting which you want to show/change. |
| user     | User |          | The member that the setting is shown/changed for.        |
| value    |      |          | The new value of the setting.                            |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!memberConfig
```

```text
!memberConfig hideFromLeaderboard
```

```text
!memberConfig hideFromLeaderboard @User
```

```text
!memberConfig hideFromLeaderboard User
```

```text
!memberConfig hideFromLeaderboard User#1234
```

```text
!memberConfig hideFromLeaderboard "User with a space"
```

```text
!memberConfig hideFromLeaderboard @User value
```

<a name='members'></a>

---

## !members

Show member count of current server.

### Usage

```text
!members
```

### Arguments

| Argument | Type | Required | Description |
| -------- | ---- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!members
```

<a name='mentionRole'></a>

---

## !mentionRole

Mention an unmentionable role.

### Usage

```text
!mentionRole <role>
```

### Arguments

| Argument | Type | Required | Description                        |
| -------- | ---- | -------- | ---------------------------------- |
| role     | Role | Yes      | The role that you want to mention. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!mentionRole @Role
```

```text
!mentionRole Role
```

```text
!mentionRole "Role with space"
```

<a name='mute'></a>

---

## !mute

cmd.mute.self.description

### Usage

```text
!mute <user> [reason]
```

### Arguments

| Argument | Type   | Required | Description                        |
| -------- | ------ | -------- | ---------------------------------- |
| user     | Member | Yes      | The user that should be muted.     |
| reason   | Text   |          | The reason why this user is muted. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!mute user
```

```text
!mute user Text
```

```text
!mute user Text with a space
```

<a name='permissions'></a>

---

## !permissions

Configure permissions to use commands.

### Usage

```text
!permissions [cmd] [role]
```

### Arguments

| Argument | Type | Required | Description                                                       |
| -------- | ---- | -------- | ----------------------------------------------------------------- |
| cmd      |      |          | The command to configure permissions for.                         |
| role     | Role |          | The role which should be granted or denied access to the command. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!permissions
```

```text
!permissions addInvites
```

```text
!permissions addRank
```

```text
!permissions ban
```

```text
!permissions botConfig
```

```text
!permissions botInfo
```

```text
!permissions caseDelete
```

```text
!permissions caseView
```

```text
!permissions check
```

```text
!permissions clean
```

```text
!permissions cleanShort
```

```text
!permissions cleanText
```

```text
!permissions clearInvites
```

```text
!permissions config
```

```text
!permissions createInvite
```

```text
!permissions credits
```

```text
!permissions export
```

```text
!permissions fake
```

```text
!permissions getBot
```

```text
!permissions graph
```

```text
!permissions help
```

```text
!permissions info
```

```text
!permissions interactiveConfig
```

```text
!permissions inviteCodeConfig
```

```text
!permissions inviteCodes
```

```text
!permissions inviteDetails
```

```text
!permissions invites
```

```text
!permissions kick
```

```text
!permissions leaderboard
```

```text
!permissions legacyInvites
```

```text
!permissions legacyLeaderboard
```

```text
!permissions makeMentionable
```

```text
!permissions memberConfig
```

```text
!permissions members
```

```text
!permissions mentionRole
```

```text
!permissions mute
```

```text
!permissions permissions
```

```text
!permissions ping
```

```text
!permissions prefix
```

```text
!permissions premium
```

```text
!permissions punishmentConfig
```

```text
!permissions purge
```

```text
!permissions purgeUntil
```

```text
!permissions ranks
```

```text
!permissions removeInvites
```

```text
!permissions removeRank
```

```text
!permissions restoreInvites
```

```text
!permissions setup
```

```text
!permissions softBan
```

```text
!permissions strike
```

```text
!permissions strikeConfig
```

```text
!permissions subtractFakes
```

```text
!permissions subtractLeaves
```

```text
!permissions support
```

```text
!permissions tryPremium
```

```text
!permissions unban
```

```text
!permissions unhoist
```

```text
!permissions unmute
```

```text
!permissions warn
```

```text
!permissions addInvites @Role
```

```text
!permissions addInvites Role
```

```text
!permissions addInvites "Role with space"
```

<a name='ping'></a>

---

## !ping

cmd.ping.self.description

### Usage

```text
!ping
```

### Arguments

| Argument | Type | Required | Description |
| -------- | ---- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!ping
```

<a name='prefix'></a>

---

## !prefix

Shows the current prefix of the bot.

### Usage

```text
!prefix
```

### Arguments

| Argument | Type | Required | Description |
| -------- | ---- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!prefix
```

<a name='premium'></a>

---

## !premium

Info about premium version of InviteManager.

### Usage

```text
!premium [action]
```

### Arguments

| Argument | Type | Required | Description                                                                                                                         |
| -------- | ---- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| action   |      |          | The action to perform. None for premium info. `check` to check your premium status. `activate` to use your premium for this server. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!premium
```

```text
!premium Activate
```

```text
!premium Check
```

```text
!premium Deactivate
```

<a name='punishmentConfig'></a>

---

## !punishmentConfig

Configure punishments when reaching a certain amount of strikes.

### Usage

```text
!punishmentConfig [punishment] [strikes] [args]
```

### Arguments

| Argument   | Type   | Required | Description                                       |
| ---------- | ------ | -------- | ------------------------------------------------- |
| punishment |        |          | Type of punishment to use.                        |
| strikes    | Number |          | Number of strikes for this punishment to be used. |
| args       | Text   |          | Arguments passed to the punishment.               |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!punishmentConfig
```

```text
!punishmentConfig ban
```

```text
!punishmentConfig kick
```

```text
!punishmentConfig mute
```

```text
!punishmentConfig softban
```

```text
!punishmentConfig warn
```

```text
!punishmentConfig ban 2
```

```text
!punishmentConfig ban 42
```

```text
!punishmentConfig ban 2 Text
```

```text
!punishmentConfig ban 2 Text with a space
```

<a name='purge'></a>

---

## !purge

Purge messages in a channel.

### Usage

```text
!purge <quantity> [user]
```

### Arguments

| Argument | Type   | Required | Description                          |
| -------- | ------ | -------- | ------------------------------------ |
| quantity | Number | Yes      | How many messages should be deleted. |
| user     | User   |          | cmd.purge.self.args.user             |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!purge 2
```

```text
!purge 42
```

```text
!purge 2 @User
```

```text
!purge 2 User
```

```text
!purge 2 User#1234
```

```text
!purge 2 "User with a space"
```

<a name='purgeUntil'></a>

---

## !purgeUntil

Purge messages in a channel up until a specified message.

### Usage

```text
!purgeUntil <messageID>
```

### Arguments

| Argument  | Type | Required | Description                    |
| --------- | ---- | -------- | ------------------------------ |
| messageID | Text | Yes      | Last message ID to be deleted. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!purgeUntil Text
```

```text
!purgeUntil "Text with a space"
```

<a name='ranks'></a>

---

## !ranks

Show all ranks.

### Usage

```text
!ranks
```

### Arguments

| Argument | Type | Required | Description |
| -------- | ---- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!ranks
```

<a name='removeInvites'></a>

---

## !removeInvites

cmd.removeInvites.self.description

### Usage

```text
!removeInvites <user> <amount> [reason]
```

### Arguments

| Argument | Type   | Required | Description                        |
| -------- | ------ | -------- | ---------------------------------- |
| user     | User   | Yes      | cmd.removeInvites.self.args.user   |
| amount   | Number | Yes      | cmd.removeInvites.self.args.amount |
| reason   | Text   |          | cmd.removeInvites.self.args.reason |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!removeInvites @User
```

```text
!removeInvites User
```

```text
!removeInvites User#1234
```

```text
!removeInvites "User with a space"
```

```text
!removeInvites @User 2
```

```text
!removeInvites @User 42
```

```text
!removeInvites @User 2 Text
```

```text
!removeInvites @User 2 Text with a space
```

<a name='removeRank'></a>

---

## !removeRank

Remove a rank.

### Usage

```text
!removeRank [rank]
```

### Arguments

| Argument | Type | Required | Description                                |
| -------- | ---- | -------- | ------------------------------------------ |
| rank     | Role |          | The for which you want to remove the rank. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!removeRank
```

```text
!removeRank @Role
```

```text
!removeRank Role
```

```text
!removeRank "Role with space"
```

<a name='restoreInvites'></a>

---

## !restoreInvites

Restore all previously cleared invites.

### Usage

```text
!restoreInvites [user]
```

### Arguments

| Argument | Type | Required | Description                                                                    |
| -------- | ---- | -------- | ------------------------------------------------------------------------------ |
| user     | User |          | The user to restore all invites to. If omitted restores invites for all users. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!restoreInvites
```

```text
!restoreInvites @User
```

```text
!restoreInvites User
```

```text
!restoreInvites User#1234
```

```text
!restoreInvites "User with a space"
```

<a name='setup'></a>

---

## !setup

Help with setting up the bot and checking for problems (e.g. missing permissions)

### Usage

```text
!setup
```

### Arguments

| Argument | Type | Required | Description |
| -------- | ---- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!setup
```

<a name='softBan'></a>

---

## !softBan

Ban and then automatically unban a member from the server.

### Usage

```text
!softBan [-d value|--deleteMessageDays=value] <user> [reason]
```

### Arguments

| Argument | Type   | Required | Description              |
| -------- | ------ | -------- | ------------------------ |
| user     | Member | Yes      | User to ban.             |
| reason   | Text   |          | Why was the user banned. |

### Flags

| Flag                | Short | Description                              |
| ------------------- | ----- | ---------------------------------------- |
| --deleteMessageDays | -d    | cmd.softBan.self.flags.deleteMessageDays |

### Examples

```text
!softBan user
```

```text
!softBan user Text
```

```text
!softBan user Text with a space
```

```text
!softBan --deleteMessageDays=2 user
```

```text
!softBan -d 2 user
```

<a name='strike'></a>

---

## !strike

cmd.strike.self.description

### Usage

```text
!strike <member> <type> <amount>
```

### Arguments

| Argument | Type   | Required | Description                 |
| -------- | ------ | -------- | --------------------------- |
| member   | Member | Yes      | cmd.strike.self.args.member |
| type     |        | Yes      | cmd.strike.self.args.type   |
| amount   | Number | Yes      | cmd.strike.self.args.amount |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!strike member allCaps
```

```text
!strike member duplicateText
```

```text
!strike member emojis
```

```text
!strike member hoist
```

```text
!strike member invites
```

```text
!strike member links
```

```text
!strike member mentionRoles
```

```text
!strike member mentionUsers
```

```text
!strike member quickMessages
```

```text
!strike member words
```

```text
!strike member allCaps 2
```

```text
!strike member allCaps 42
```

<a name='strikeConfig'></a>

---

## !strikeConfig

Configure strikes received for various violations.

### Usage

```text
!strikeConfig [violation] [strikes]
```

### Arguments

| Argument  | Type   | Required | Description        |
| --------- | ------ | -------- | ------------------ |
| violation |        |          | Violation type.    |
| strikes   | Number |          | Number of strikes. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!strikeConfig
```

```text
!strikeConfig allCaps
```

```text
!strikeConfig duplicateText
```

```text
!strikeConfig emojis
```

```text
!strikeConfig hoist
```

```text
!strikeConfig invites
```

```text
!strikeConfig links
```

```text
!strikeConfig mentionRoles
```

```text
!strikeConfig mentionUsers
```

```text
!strikeConfig quickMessages
```

```text
!strikeConfig words
```

```text
!strikeConfig allCaps 2
```

```text
!strikeConfig allCaps 42
```

<a name='subtractFakes'></a>

---

## !subtractFakes

Remove fake invites from all users.

### Usage

```text
!subtractFakes
```

### Arguments

| Argument | Type | Required | Description |
| -------- | ---- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!subtractFakes
```

<a name='subtractLeaves'></a>

---

## !subtractLeaves

Remove leaves from all users

### Usage

```text
!subtractLeaves
```

### Arguments

| Argument | Type | Required | Description |
| -------- | ---- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!subtractLeaves
```

<a name='support'></a>

---

## !support

Get an invite link to our support server.

### Usage

```text
!support
```

### Arguments

| Argument | Type | Required | Description |
| -------- | ---- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!support
```

<a name='tryPremium'></a>

---

## !tryPremium

Try the premium version of InviteManager for free for a limited duration.

### Usage

```text
!tryPremium
```

### Arguments

| Argument | Type | Required | Description |
| -------- | ---- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!tryPremium
```

<a name='unban'></a>

---

## !unban

cmd.unban.self.description

### Usage

```text
!unban <user> [reason]
```

### Arguments

| Argument | Type | Required | Description                           |
| -------- | ---- | -------- | ------------------------------------- |
| user     | User | Yes      | The user that should be unbanned.     |
| reason   | Text |          | The reason why this user is unbanned. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!unban @User
```

```text
!unban User
```

```text
!unban User#1234
```

```text
!unban "User with a space"
```

```text
!unban @User Text
```

```text
!unban @User Text with a space
```

<a name='unhoist'></a>

---

## !unhoist

cmd.unhoist.self.description

### Usage

```text
!unhoist
```

### Arguments

| Argument | Type | Required | Description |
| -------- | ---- | -------- | ----------- |


### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!unhoist
```

<a name='unmute'></a>

---

## !unmute

cmd.unmute.self.description

### Usage

```text
!unmute <user>
```

### Arguments

| Argument | Type   | Required | Description                      |
| -------- | ------ | -------- | -------------------------------- |
| user     | Member | Yes      | The user that should be unmuted. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!unmute user
```

<a name='warn'></a>

---

## !warn

Warn a member.

### Usage

```text
!warn <member> [reason]
```

### Arguments

| Argument | Type   | Required | Description                    |
| -------- | ------ | -------- | ------------------------------ |
| member   | Member | Yes      | Member to warn.                |
| reason   | Text   |          | Why was the member was warned. |

### Flags

| Flag | Short | Description |
| ---- | ----- | ----------- |


### Examples

```text
!warn member
```

```text
!warn member Text
```

```text
!warn member Text with a space
```
