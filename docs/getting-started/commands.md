# Commands

To get a list of available commands, do !help on your server.

## Arguments & Flags

Most commands accept arguments and/or flags.  
According to the **Type** of the argument or flag you can provide different values.

### Number

This arguments expects a number

### Text

This arguments expects any text. You can use quotes (`"Text with quotes"`) for text that has spaces.  
**If the text is the last argument you don't have to use quotes.**

### Invite Code

This arguments expects a Discord Invite Code.  
**You can put only the part after `https://discord.gg/` to prevent Discord from creating a preview.**

### Enum

This arguments expects a value from a specific set of valid values.  
**Depending on the command the valid values can vary. Use `!help <command>` (eg. `!help addRank`) to get more information about the command and the valid values for the enum.**

### User

This arguments expects a Discord User. You can use any of the following methods to provide a user:

- Mention the user: `@Valandur`
- Use their ID: `102785693046026240`
- Use their name: `Valandur`
- Use their name and discriminator: `Valandur#3581`
- Use quotes if their name has a space: `"Valandur with a space"`

### Role

This arguments expects a Discord Role. You can use any of the following methods to provide a role:

- Mention the role: `@Admin`
- Use the ID: `102785693046026240`
- Use the name: `Admin`
- Use quotes if the name has a space: `"Admin with a space"`

### Channel

This arguments expects a Discord Channel. You can use any of the following methods to provide a channel:

- Mention the channel: `#general`
- Use the ID: `409846838129197057`
- Use the name: `general`
- Use quotes if the name has a space: `"general with a space"`

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
| [ranks](#ranks)           | Show all ranks. | !ranks [page]                        |
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

### Music

| Command                   | Description                     | Usage                                                 |
| ------------------------- | ------------------------------- | ----------------------------------------------------- |
| [disconnect](#disconnect) | cmd.disconnect.self.description | !disconnect                                           |
| [lyrics](#lyrics)         | cmd.lyrics.self.description     | !lyrics [-l\|--live]                                  |
| [mashup](#mashup)         | cmd.mashup.self.description     | !mashup \<videos\>                                    |
| [nowPlaying](#nowPlaying) | cmd.nowPlaying.self.description | !nowPlaying [-p\|--pin]                               |
| [pause](#pause)           | cmd.pause.self.description      | !pause                                                |
| [play](#play)             | cmd.play.self.description       | !play [-p value\|--platform=value][-n\|--next] [link] |
| [queue](#queue)           | cmd.queue.self.description      | !queue                                                |
| [repeat](#repeat)         | cmd.repeat.self.description     | !repeat                                               |
| [resume](#resume)         | cmd.resume.self.description     | !resume                                               |
| [rewind](#rewind)         | cmd.rewind.self.description     | !rewind                                               |
| [search](#search)         | cmd.search.self.description     | !search [-p value\|--platform=value][search]          |
| [seek](#seek)             | cmd.seek.self.description       | !seek [duration]                                      |
| [skip](#skip)             | cmd.skip.self.description       | !skip                                                 |
| [volume](#volume)         | cmd.volume.self.description     | !volume [volume]                                      |

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

### Aliases

- `!add-invites`

### Arguments

| Argument | Type              | Required | Description                                                                                | Details |
| -------- | ----------------- | -------- | ------------------------------------------------------------------------------------------ | ------- |
| user     | [User](#User)     | Yes      | The user that will receive/lose the bonus invites.                                         |         |
| amount   | [Number](#Number) | Yes      | The amount of invites the user will get/lose. Use a negative (-) number to remove invites. |         |
| reason   | [Text](#Text)     | No       | The reason for adding/removing the invites.                                                |         |

### Examples

```text
!addInvites @User 5
```

```text
!addInvites "Name with space" -30 Removed for cheating
```

<a name='addRank'></a>

---

## !addRank

Add a new rank.

### Usage

```text
!addRank <role> <invites> [info]
```

### Aliases

- `!add-rank`
- `!set-rank`
- `!setrank`

### Arguments

| Argument | Type              | Required | Description                                                          | Details |
| -------- | ----------------- | -------- | -------------------------------------------------------------------- | ------- |
| role     | [Role](#Role)     | Yes      | The role which the user will receive when reaching this rank.        |         |
| invites  | [Number](#Number) | Yes      | The amount of invites needed to reach the rank.                      |         |
| info     | [Text](#Text)     | No       | A description that users will see so they know more about this rank. |         |

### Examples

```text
!addRank @Role 5
```

```text
!addRank "Role with space" 10 Wow, already 10 people!
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

| Argument | Type          | Required | Description              | Details |
| -------- | ------------- | -------- | ------------------------ | ------- |
| user     | [User](#User) | Yes      | User to ban.             |         |
| reason   | [Text](#Text) | No       | Why was the user banned. |         |

### Flags

| Flag                              | Short     | Type              | Description                          |
| --------------------------------- | --------- | ----------------- | ------------------------------------ |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [Number](#Number) | cmd.ban.self.flags.deleteMessageDays |

### Examples

<a name='botConfig'></a>

---

## !botConfig

Show and change the config of the bot.

### Usage

```text
!botConfig [key] [value]
```

### Aliases

- `!bot-config`
- `!botsetting`
- `!bot-setting`

### Arguments

| Argument | Type            | Required | Description                                           | Details                                                                                                                                     |
| -------- | --------------- | -------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| key      | [Enum](#Enum)   | No       | The bot config setting which you want to show/change. | Use one of the following values: `activityEnabled`, `activityMessage`, `activityStatus`, `activityType`, `activityUrl`, `embedDefaultColor` |
| value    | [Value](#Value) | No       | The new value of the setting.                         |                                                                                                                                             |

### Examples

```text
!botConfig
```

<a name='botInfo'></a>

---

## !botInfo

Get general information about the bot.

### Usage

```text
!botInfo
```

### Aliases

- `!bot-info`

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

### Aliases

- `!case-delete`
- `!deletecase`
- `!delete-case`

### Arguments

| Argument   | Type              | Required | Description                         | Details |
| ---------- | ----------------- | -------- | ----------------------------------- | ------- |
| caseNumber | [Number](#Number) | Yes      | cmd.caseDelete.self.args.caseNumber |         |
| reason     | [Text](#Text)     | No       | cmd.caseDelete.self.args.reason     |         |

### Examples

```text
!caseDelete 5434 User apologized
```

<a name='caseView'></a>

---

## !caseView

cmd.caseView.self.description

### Usage

```text
!caseView <caseNumber>
```

### Aliases

- `!case-view`
- `!viewcase`
- `!view-case`

### Arguments

| Argument   | Type              | Required | Description                       | Details |
| ---------- | ----------------- | -------- | --------------------------------- | ------- |
| caseNumber | [Number](#Number) | Yes      | cmd.caseView.self.args.caseNumber |         |

### Examples

```text
!caseView 5434
```

<a name='check'></a>

---

## !check

Check violation and punishment history of a user.

### Usage

```text
!check <user>
```

### Aliases

- `!history`

### Arguments

| Argument | Type          | Required | Description    | Details |
| -------- | ------------- | -------- | -------------- | ------- |
| user     | [User](#User) | Yes      | User to check. |         |

### Examples

```text
!check @User
```

```text
!check "User with space"
```

<a name='clean'></a>

---

## !clean

Clean a channel of certain message types.

### Usage

```text
!clean <type> [numberOfMessages]
```

### Aliases

- `!clear`

### Arguments

| Argument         | Type              | Required | Description                                | Details                                                                                                            |
| ---------------- | ----------------- | -------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| type             | [Enum](#Enum)     | Yes      | The type of messages that will be deleted. | Use one of the following values: `bots`, `embeds`, `emojis`, `images`, `links`, `mentions`, `reacted`, `reactions` |
| numberOfMessages | [Number](#Number) | No       | Number of messages that will be searched.  |                                                                                                                    |

### Examples

<a name='cleanShort'></a>

---

## !cleanShort

Clear short messages

### Usage

```text
!cleanShort <maxTextLength> [numberOfMessages]
```

### Aliases

- `!clean-short`
- `!clearshort`
- `!clear-short`

### Arguments

| Argument         | Type              | Required | Description                                     | Details |
| ---------------- | ----------------- | -------- | ----------------------------------------------- | ------- |
| maxTextLength    | [Number](#Number) | Yes      | All messages shorter than this will be deleted. |         |
| numberOfMessages | [Number](#Number) | No       | Number of messages that will be searched.       |         |

### Examples

<a name='cleanText'></a>

---

## !cleanText

cmd.cleanText.self.description

### Usage

```text
!cleanText <text> [numberOfMessages]
```

### Aliases

- `!clean-text`
- `!cleartext`
- `!clear-text`

### Arguments

| Argument         | Type              | Required | Description                                        | Details |
| ---------------- | ----------------- | -------- | -------------------------------------------------- | ------- |
| text             | [Text](#Text)     | Yes      | All messages containing this word will be deleted. |         |
| numberOfMessages | [Number](#Number) | No       | Number of messages that will be searched.          |         |

### Examples

<a name='clearInvites'></a>

---

## !clearInvites

Clear invites of the server/a user.

### Usage

```text
!clearInvites [-d value|--date=value] [-cb|--clearBonus] [user]
```

### Aliases

- `!clear-invites`

### Arguments

| Argument | Type          | Required | Description                                                      | Details |
| -------- | ------------- | -------- | ---------------------------------------------------------------- | ------- |
| user     | [User](#User) | No       | The user to clear all invites from. If omitted clears all users. |         |

### Flags

| Flag                       | Short      | Type                | Description                                                                              |
| -------------------------- | ---------- | ------------------- | ---------------------------------------------------------------------------------------- |
| &#x2011;&#x2011;date       | &#x2011;d  | [Date](#Date)       | The date start at which invites should be counted. Default is today.                     |
| &#x2011;&#x2011;clearBonus | &#x2011;cb | [Boolean](#Boolean) | Add this flag to clear bonus invites aswell. Otherwise bonus invites are left untouched. |

### Examples

```text
!clearInvites
```

```text
!clearInvites @User
```

```text
!clearInvites -cb "User with space"
```

<a name='config'></a>

---

## !config

Show and change the config of the server.

### Usage

```text
!config [key] [value]
```

### Aliases

- `!c`

### Arguments

| Argument | Type            | Required | Description                                       | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------- | --------------- | -------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key      | [Enum](#Enum)   | No       | The config setting which you want to show/change. | Use one of the following values: `announcementVoice`, `announceNextSong`, `autoModAllCapsEnabled`, `autoModAllCapsMinCharacters`, `autoModAllCapsPercentageCaps`, `autoModDeleteBotMessage`, `autoModDeleteBotMessageTimeoutInSeconds`, `autoModDisabledForOldMembers`, `autoModDisabledForOldMembersThreshold`, `autoModDuplicateTextEnabled`, `autoModDuplicateTextTimeframeInSeconds`, `autoModEmojisEnabled`, `autoModEmojisMaxNumberOfEmojis`, `autoModEnabled`, `autoModHoistEnabled`, `autoModIgnoredChannels`, `autoModIgnoredRoles`, `autoModInvitesEnabled`, `autoModLinksBlacklist`, `autoModLinksEnabled`, `autoModLinksFollowRedirects`, `autoModLinksWhitelist`, `autoModLogEnabled`, `autoModMentionRolesEnabled`, `autoModMentionRolesMaxNumberOfMentions`, `autoModMentionUsersEnabled`, `autoModMentionUsersMaxNumberOfMentions`, `autoModModeratedChannels`, `autoModModeratedRoles`, `autoModQuickMessagesEnabled`, `autoModQuickMessagesNumberOfMessages`, `autoModQuickMessagesTimeframeInSeconds`, `autoModWordsBlacklist`, `autoModWordsEnabled`, `autoSubtractFakes`, `autoSubtractLeaves`, `autoSubtractLeaveThreshold`, `captchaVerificationFailedMessage`, `captchaVerificationLogEnabled`, `captchaVerificationOnJoin`, `captchaVerificationSuccessMessage`, `captchaVerificationTimeout`, `captchaVerificationWelcomeMessage`, `channels`, `fadeMusicEndDelay`, `fadeMusicOnTalk`, `fadeMusicStartDuration`, `getUpdates`, `hideLeftMembersFromLeaderboard`, `ignoredChannels`, `joinMessage`, `joinMessageChannel`, `lang`, `leaderboardStyle`, `leaveMessage`, `leaveMessageChannel`, `logChannel`, `modLogChannel`, `modPunishmentBanDeleteMessage`, `modPunishmentKickDeleteMessage`, `modPunishmentMuteDeleteMessage`, `modPunishmentSoftbanDeleteMessage`, `modPunishmentWarnDeleteMessage`, `musicVolume`, `mutedRole`, `prefix`, `rankAnnouncementChannel`, `rankAnnouncementMessage`, `rankAssignmentStyle` |
| value    | [Value](#Value) | No       | The new value of the setting.                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

### Examples

```text
!config
```

<a name='createInvite'></a>

---

## !createInvite

Creates unique invite codes.

### Usage

```text
!createInvite <name> [channel]
```

### Aliases

- `!create-invite`

### Arguments

| Argument | Type                | Required | Description                                                                            | Details |
| -------- | ------------------- | -------- | -------------------------------------------------------------------------------------- | ------- |
| name     | [Text](#Text)       | Yes      | The name of the invite code.                                                           |         |
| channel  | [Channel](#Channel) | No       | The channel for which the invite code is created. Uses the current channel by default. |         |

### Examples

```text
!createInvite reddit
```

```text
!createInvite website #welcome
```

<a name='credits'></a>

---

## !credits

cmd.credits.self.description

### Usage

```text
!credits
```

### Examples

```text
!credits
```

<a name='disconnect'></a>

---

## !disconnect

cmd.disconnect.self.description

### Usage

```text
!disconnect
```

### Examples

```text
!disconnect
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

| Argument | Type          | Required | Description                  | Details                                        |
| -------- | ------------- | -------- | ---------------------------- | ---------------------------------------------- |
| type     | [Enum](#Enum) | Yes      | The type of export you want. | Use one of the following values: `leaderboard` |

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

### Aliases

- `!fakes`
- `!cheaters`
- `!cheater`
- `!invalid`

### Arguments

| Argument | Type              | Required | Description                         | Details |
| -------- | ----------------- | -------- | ----------------------------------- | ------- |
| page     | [Number](#Number) | No       | Which page of the fake list to get. |         |

### Examples

```text
!fake
```

```text
!fake 4
```

<a name='getBot'></a>

---

## !getBot

Get an invite link for the bot.

### Usage

```text
!getBot
```

### Aliases

- `!get-bot`
- `!invite-bot`
- `!invitebot`

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

### Aliases

- `!g`
- `!chart`

### Arguments

| Argument | Type                  | Required | Description                        | Details                                                     |
| -------- | --------------------- | -------- | ---------------------------------- | ----------------------------------------------------------- |
| type     | [Enum](#Enum)         | Yes      | The type of chart to display.      | Use one of the following values: `joins`, `leaves`, `usage` |
| duration | [Duration](#Duration) | No       | The duration period for the chart. |                                                             |

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

<a name='help'></a>

---

## !help

Display help.

### Usage

```text
!help [command]
```

### Arguments

| Argument | Type                | Required | Description                                  | Details                       |
| -------- | ------------------- | -------- | -------------------------------------------- | ----------------------------- |
| command  | [Command](#Command) | No       | The command to get detailed information for. | resolvers.command.validValues |

### Examples

```text
!help
```

```text
!help addRank
```

<a name='info'></a>

---

## !info

Show info about a specific member.

### Usage

```text
!info <user> [details] [page]
```

### Aliases

- `!showinfo`

### Arguments

| Argument | Type              | Required | Description                                                                   | Details                                             |
| -------- | ----------------- | -------- | ----------------------------------------------------------------------------- | --------------------------------------------------- |
| user     | [User](#User)     | Yes      | The user for whom you want to see additional info.                            |                                                     |
| details  | [Enum](#Enum)     | No       | Request only specific details about a member.                                 | Use one of the following values: `bonus`, `members` |
| page     | [Number](#Number) | No       | What page of the details to show. You can also use the reactions to navigate. |                                                     |

### Examples

```text
!info @User
```

```text
!info "User with space"
```

```text
!info @User members
```

```text
!info @User bonus
```

```text
!info @User members 4
```

<a name='interactiveConfig'></a>

---

## !interactiveConfig

cmd.interactiveConfig.self.description

### Usage

```text
!interactiveConfig
```

### Aliases

- `!ic`

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

### Aliases

- `!invite-code-config`
- `!icc`

### Arguments

| Argument   | Type                       | Required | Description                                                | Details                                          |
| ---------- | -------------------------- | -------- | ---------------------------------------------------------- | ------------------------------------------------ |
| key        | [Enum](#Enum)              | No       | The config setting which you want to show/change.          | Use one of the following values: `name`, `roles` |
| inviteCode | [Invite Code](#InviteCode) | No       | The invite code for which you want to change the settings. |                                                  |
| value      | [Value](#Value)            | No       | The new value of the setting.                              |                                                  |

### Examples

```text
!inviteCodeConfig
```

<a name='inviteCodes'></a>

---

## !inviteCodes

Get a list of all your invite codes

### Usage

```text
!inviteCodes
```

### Aliases

- `!invitecode`
- `!invite-code`
- `!invite-codes`
- `!getinvitecode`
- `!get-invite-code`
- `!get-invite-codes`
- `!showinvitecode`
- `!show-invite-code`

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

### Aliases

- `!invite-details`

### Arguments

| Argument | Type          | Required | Description                                          | Details |
| -------- | ------------- | -------- | ---------------------------------------------------- | ------- |
| user     | [User](#User) | No       | The user for whom you want to show detailed invites. |         |

### Examples

```text
!inviteDetails
```

```text
!inviteDetails @User
```

```text
!inviteDetails "User with space"
```

<a name='invites'></a>

---

## !invites

Show personal invites.

### Usage

```text
!invites [user]
```

### Aliases

- `!invite`
- `!rank`

### Arguments

| Argument | Type          | Required | Description                                 | Details |
| -------- | ------------- | -------- | ------------------------------------------- | ------- |
| user     | [User](#User) | No       | The user for whom you want to show invites. |         |

### Examples

```text
!invites
```

```text
!invites @User
```

```text
!invites "User with space"
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

| Argument | Type              | Required | Description                | Details |
| -------- | ----------------- | -------- | -------------------------- | ------- |
| member   | [Member](#Member) | Yes      | Member to kick.            |         |
| reason   | [Text](#Text)     | No       | Why the member was kicked. |         |

### Examples

<a name='leaderboard'></a>

---

## !leaderboard

Show members with most invites.

### Usage

```text
!leaderboard [-c value|--compare=value] [duration] [page]
```

### Aliases

- `!top`

### Arguments

| Argument | Type                  | Required | Description                                          | Details |
| -------- | --------------------- | -------- | ---------------------------------------------------- | ------- |
| duration | [Duration](#Duration) | No       | The duration for which to calculate the leaderboard. |         |
| page     | [Number](#Number)     | No       | Which page of the leaderboard to get.                |         |

### Flags

| Flag                    | Short     | Type                  | Description                                                         |
| ----------------------- | --------- | --------------------- | ------------------------------------------------------------------- |
| &#x2011;&#x2011;compare | &#x2011;c | [Duration](#Duration) | The date to which the current leaderboard standings are compared to |

### Examples

```text
!leaderboard
```

```text
!leaderboard 1mo
```

```text
!leaderboard 30d 6
```

<a name='legacyInvites'></a>

---

## !legacyInvites

> [!WARNING|style:flat]
> This command has been deprecated and will be removed soon, please avoid using it.

cmd.legacyInvites.self.description

### Usage

```text
!legacyInvites [user]
```

### Aliases

- `!legacy-invites`

### Arguments

| Argument | Type          | Required | Description                      | Details |
| -------- | ------------- | -------- | -------------------------------- | ------- |
| user     | [User](#User) | No       | cmd.legacyInvites.self.args.user |         |

### Examples

```text
!legacyInvites
```

<a name='legacyLeaderboard'></a>

---

## !legacyLeaderboard

> [!WARNING|style:flat]
> This command has been deprecated and will be removed soon, please avoid using it.

cmd.legacyLeaderboard.self.description

### Usage

```text
!legacyLeaderboard [page] [date]
```

### Aliases

- `!legacy-leaderboard`
- `!legacytop`
- `!legacy-top`

### Arguments

| Argument | Type              | Required | Description                          | Details |
| -------- | ----------------- | -------- | ------------------------------------ | ------- |
| page     | [Number](#Number) | No       | cmd.legacyLeaderboard.self.args.page |         |
| date     | [Text](#Text)     | No       | cmd.legacyLeaderboard.self.args.date |         |

### Examples

```text
!legacyLeaderboard
```

<a name='lyrics'></a>

---

## !lyrics

cmd.lyrics.self.description

### Usage

```text
!lyrics [-l|--live]
```

### Flags

| Flag                 | Short     | Type                | Description                |
| -------------------- | --------- | ------------------- | -------------------------- |
| &#x2011;&#x2011;live | &#x2011;l | [Boolean](#Boolean) | cmd.lyrics.self.flags.live |

### Examples

```text
!lyrics
```

<a name='makeMentionable'></a>

---

## !makeMentionable

Make a role mentionable for 60 seconds or until it was used.

### Usage

```text
!makeMentionable <role>
```

### Aliases

- `!make-mentionable`
- `!mm`

### Arguments

| Argument | Type          | Required | Description                        | Details |
| -------- | ------------- | -------- | ---------------------------------- | ------- |
| role     | [Role](#Role) | Yes      | The role that you want to mention. |         |

### Examples

```text
!makeMentionable @Role
```

```text
!makeMentionable "Role with space"
```

<a name='mashup'></a>

---

## !mashup

cmd.mashup.self.description

### Usage

```text
!mashup <videos>
```

### Arguments

| Argument | Type          | Required | Description                 | Details |
| -------- | ------------- | -------- | --------------------------- | ------- |
| videos   | [Text](#Text) | Yes      | cmd.mashup.self.args.videos |         |

### Examples

<a name='memberConfig'></a>

---

## !memberConfig

Show and change the config of members of the server.

### Usage

```text
!memberConfig [key] [user] [value]
```

### Aliases

- `!member-config`
- `!memconf`
- `!mc`

### Arguments

| Argument | Type            | Required | Description                                              | Details                                                |
| -------- | --------------- | -------- | -------------------------------------------------------- | ------------------------------------------------------ |
| key      | [Enum](#Enum)   | No       | The member config setting which you want to show/change. | Use one of the following values: `hideFromLeaderboard` |
| user     | [User](#User)   | No       | The member that the setting is shown/changed for.        |                                                        |
| value    | [Value](#Value) | No       | The new value of the setting.                            |                                                        |

### Examples

```text
!memberConfig
```

<a name='members'></a>

---

## !members

Show member count of current server.

### Usage

```text
!members
```

### Aliases

- `!member`
- `!memberscount`

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

### Aliases

- `!mention-role`
- `!mr`

### Arguments

| Argument | Type          | Required | Description                        | Details |
| -------- | ------------- | -------- | ---------------------------------- | ------- |
| role     | [Role](#Role) | Yes      | The role that you want to mention. |         |

### Examples

```text
!mentionRole @Role
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

| Argument | Type              | Required | Description                        | Details |
| -------- | ----------------- | -------- | ---------------------------------- | ------- |
| user     | [Member](#Member) | Yes      | The user that should be muted.     |         |
| reason   | [Text](#Text)     | No       | The reason why this user is muted. |         |

### Examples

<a name='nowPlaying'></a>

---

## !nowPlaying

cmd.nowPlaying.self.description

### Usage

```text
!nowPlaying [-p|--pin]
```

### Aliases

- `!np`
- `!now-playing`

### Flags

| Flag                | Short     | Type                | Description                   |
| ------------------- | --------- | ------------------- | ----------------------------- |
| &#x2011;&#x2011;pin | &#x2011;p | [Boolean](#Boolean) | cmd.nowPlaying.self.flags.pin |

### Examples

```text
!nowPlaying
```

<a name='pause'></a>

---

## !pause

cmd.pause.self.description

### Usage

```text
!pause
```

### Aliases

- `!stop`

### Examples

```text
!pause
```

<a name='permissions'></a>

---

## !permissions

Configure permissions to use commands.

### Usage

```text
!permissions [cmd] [role]
```

### Aliases

- `!perms`

### Arguments

| Argument | Type                | Required | Description                                                       | Details                       |
| -------- | ------------------- | -------- | ----------------------------------------------------------------- | ----------------------------- |
| cmd      | [Command](#Command) | No       | The command to configure permissions for.                         | resolvers.command.validValues |
| role     | [Role](#Role)       | No       | The role which should be granted or denied access to the command. |                               |

### Examples

```text
!permissions
```

<a name='ping'></a>

---

## !ping

cmd.ping.self.description

### Usage

```text
!ping
```

### Examples

```text
!ping
```

<a name='play'></a>

---

## !play

cmd.play.self.description

### Usage

```text
!play [-p value|--platform=value] [-n|--next] [link]
```

### Aliases

- `!p`

### Arguments

| Argument | Type          | Required | Description             | Details |
| -------- | ------------- | -------- | ----------------------- | ------- |
| link     | [Text](#Text) | No       | cmd.play.self.args.link |         |

### Flags

| Flag                     | Short     | Type                | Description                  |
| ------------------------ | --------- | ------------------- | ---------------------------- |
| &#x2011;&#x2011;platform | &#x2011;p | [Enum](#Enum)       | cmd.play.self.flags.platform |
| &#x2011;&#x2011;next     | &#x2011;n | [Boolean](#Boolean) | cmd.play.self.flags.next     |

### Examples

```text
!play
```

<a name='prefix'></a>

---

## !prefix

Shows the current prefix of the bot.

### Usage

```text
!prefix
```

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

### Aliases

- `!patreon`
- `!donate`

### Arguments

| Argument | Type          | Required | Description                                                                                                                         | Details                                                            |
| -------- | ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| action   | [Enum](#Enum) | No       | The action to perform. None for premium info. `check` to check your premium status. `activate` to use your premium for this server. | Use one of the following values: `Activate`, `Check`, `Deactivate` |

### Examples

```text
!premium
```

```text
!premium check
```

```text
!premium activate
```

```text
!premium deactivate
```

<a name='punishmentConfig'></a>

---

## !punishmentConfig

Configure punishments when reaching a certain amount of strikes.

### Usage

```text
!punishmentConfig [punishment] [strikes] [args]
```

### Aliases

- `!punishment-config`

### Arguments

| Argument   | Type              | Required | Description                                       | Details                                                                   |
| ---------- | ----------------- | -------- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| punishment | [Enum](#Enum)     | No       | Type of punishment to use.                        | Use one of the following values: `ban`, `kick`, `mute`, `softban`, `warn` |
| strikes    | [Number](#Number) | No       | Number of strikes for this punishment to be used. |                                                                           |
| args       | [Text](#Text)     | No       | Arguments passed to the punishment.               |                                                                           |

### Examples

```text
!punishmentConfig
```

<a name='purge'></a>

---

## !purge

Purge messages in a channel.

### Usage

```text
!purge <quantity> [user]
```

### Aliases

- `!prune`

### Arguments

| Argument | Type              | Required | Description                          | Details |
| -------- | ----------------- | -------- | ------------------------------------ | ------- |
| quantity | [Number](#Number) | Yes      | How many messages should be deleted. |         |
| user     | [User](#User)     | No       | cmd.purge.self.args.user             |         |

### Examples

<a name='purgeUntil'></a>

---

## !purgeUntil

Purge messages in a channel up until a specified message.

### Usage

```text
!purgeUntil <messageID>
```

### Aliases

- `!purge-until`
- `!prune-until`
- `!pruneu`
- `!purgeu`

### Arguments

| Argument  | Type          | Required | Description                    | Details |
| --------- | ------------- | -------- | ------------------------------ | ------- |
| messageID | [Text](#Text) | Yes      | Last message ID to be deleted. |         |

### Examples

<a name='queue'></a>

---

## !queue

cmd.queue.self.description

### Usage

```text
!queue
```

### Examples

```text
!queue
```

<a name='ranks'></a>

---

## !ranks

Show all ranks.

### Usage

```text
!ranks [page]
```

### Aliases

- `!show-ranks`
- `!showranks`

### Arguments

| Argument | Type              | Required | Description              | Details |
| -------- | ----------------- | -------- | ------------------------ | ------- |
| page     | [Number](#Number) | No       | cmd.ranks.self.args.page |         |

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

### Aliases

- `!remove-invites`

### Arguments

| Argument | Type              | Required | Description                        | Details |
| -------- | ----------------- | -------- | ---------------------------------- | ------- |
| user     | [User](#User)     | Yes      | cmd.removeInvites.self.args.user   |         |
| amount   | [Number](#Number) | Yes      | cmd.removeInvites.self.args.amount |         |
| reason   | [Text](#Text)     | No       | cmd.removeInvites.self.args.reason |         |

### Examples

```text
!removeInvites @User 5
```

```text
!removeInvites "User with space" 23 Removed for cheating
```

```text
!removeInvites @User -6 Added for apologizing
```

<a name='removeRank'></a>

---

## !removeRank

Remove a rank.

### Usage

```text
!removeRank [rank]
```

### Aliases

- `!remove-rank`

### Arguments

| Argument | Type          | Required | Description                                | Details |
| -------- | ------------- | -------- | ------------------------------------------ | ------- |
| rank     | [Role](#Role) | No       | The for which you want to remove the rank. |         |

### Examples

```text
!removeRank
```

```text
!removeRank @Role
```

```text
!removeRank "Role with space"
```

<a name='repeat'></a>

---

## !repeat

cmd.repeat.self.description

### Usage

```text
!repeat
```

### Aliases

- `!loop`

### Examples

```text
!repeat
```

<a name='restoreInvites'></a>

---

## !restoreInvites

Restore all previously cleared invites.

### Usage

```text
!restoreInvites [user]
```

### Aliases

- `!restore-invites`
- `!unclear-invites`
- `!unclearinvites`

### Arguments

| Argument | Type          | Required | Description                                                                    | Details |
| -------- | ------------- | -------- | ------------------------------------------------------------------------------ | ------- |
| user     | [User](#User) | No       | The user to restore all invites to. If omitted restores invites for all users. |         |

### Examples

```text
!restoreInvites
```

```text
!restoreInvites @User
```

```text
!restoreInvites "User with space"
```

<a name='resume'></a>

---

## !resume

cmd.resume.self.description

### Usage

```text
!resume
```

### Aliases

- `!start`

### Examples

```text
!resume
```

<a name='rewind'></a>

---

## !rewind

cmd.rewind.self.description

### Usage

```text
!rewind
```

### Aliases

- `!replay`

### Examples

```text
!rewind
```

<a name='search'></a>

---

## !search

cmd.search.self.description

### Usage

```text
!search [-p value|--platform=value] [search]
```

### Arguments

| Argument | Type          | Required | Description                 | Details |
| -------- | ------------- | -------- | --------------------------- | ------- |
| search   | [Text](#Text) | No       | cmd.search.self.args.search |         |

### Flags

| Flag                     | Short     | Type          | Description                    |
| ------------------------ | --------- | ------------- | ------------------------------ |
| &#x2011;&#x2011;platform | &#x2011;p | [Enum](#Enum) | cmd.search.self.flags.platform |

### Examples

```text
!search
```

<a name='seek'></a>

---

## !seek

cmd.seek.self.description

### Usage

```text
!seek [duration]
```

### Arguments

| Argument | Type              | Required | Description                 | Details |
| -------- | ----------------- | -------- | --------------------------- | ------- |
| duration | [Number](#Number) | No       | cmd.seek.self.args.duration |         |

### Examples

```text
!seek
```

<a name='setup'></a>

---

## !setup

Help with setting up the bot and checking for problems (e.g. missing permissions)

### Usage

```text
!setup
```

### Aliases

- `!guide`
- `!test`
- `!testbot`
- `!test-bot`

### Examples

```text
!setup
```

<a name='skip'></a>

---

## !skip

cmd.skip.self.description

### Usage

```text
!skip
```

### Examples

```text
!skip
```

<a name='softBan'></a>

---

## !softBan

Ban and then automatically unban a member from the server.

### Usage

```text
!softBan [-d value|--deleteMessageDays=value] <user> [reason]
```

### Aliases

- `!soft-ban`

### Arguments

| Argument | Type              | Required | Description              | Details |
| -------- | ----------------- | -------- | ------------------------ | ------- |
| user     | [Member](#Member) | Yes      | User to ban.             |         |
| reason   | [Text](#Text)     | No       | Why was the user banned. |         |

### Flags

| Flag                              | Short     | Type              | Description                              |
| --------------------------------- | --------- | ----------------- | ---------------------------------------- |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [Number](#Number) | cmd.softBan.self.flags.deleteMessageDays |

### Examples

<a name='strike'></a>

---

## !strike

cmd.strike.self.description

### Usage

```text
!strike <member> <type> <amount>
```

### Arguments

| Argument | Type              | Required | Description                 | Details                                                                                                                                                      |
| -------- | ----------------- | -------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| member   | [Member](#Member) | Yes      | cmd.strike.self.args.member |                                                                                                                                                              |
| type     | [Enum](#Enum)     | Yes      | cmd.strike.self.args.type   | Use one of the following values: `allCaps`, `duplicateText`, `emojis`, `hoist`, `invites`, `links`, `mentionRoles`, `mentionUsers`, `quickMessages`, `words` |
| amount   | [Number](#Number) | Yes      | cmd.strike.self.args.amount |                                                                                                                                                              |

### Examples

<a name='strikeConfig'></a>

---

## !strikeConfig

Configure strikes received for various violations.

### Usage

```text
!strikeConfig [violation] [strikes]
```

### Aliases

- `!strike-config`

### Arguments

| Argument  | Type              | Required | Description        | Details                                                                                                                                                      |
| --------- | ----------------- | -------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| violation | [Enum](#Enum)     | No       | Violation type.    | Use one of the following values: `allCaps`, `duplicateText`, `emojis`, `hoist`, `invites`, `links`, `mentionRoles`, `mentionUsers`, `quickMessages`, `words` |
| strikes   | [Number](#Number) | No       | Number of strikes. |                                                                                                                                                              |

### Examples

```text
!strikeConfig
```

<a name='subtractFakes'></a>

---

## !subtractFakes

Remove fake invites from all users.

### Usage

```text
!subtractFakes
```

### Aliases

- `!subtract-fakes`
- `!subfakes`
- `!sf`

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

### Aliases

- `!subtract-leaves`
- `!subleaves`
- `!sl`

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

### Aliases

- `!try`
- `!try-premium`

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

| Argument | Type          | Required | Description                           | Details |
| -------- | ------------- | -------- | ------------------------------------- | ------- |
| user     | [User](#User) | Yes      | The user that should be unbanned.     |         |
| reason   | [Text](#Text) | No       | The reason why this user is unbanned. |         |

### Examples

<a name='unhoist'></a>

---

## !unhoist

cmd.unhoist.self.description

### Usage

```text
!unhoist
```

### Aliases

- `!dehoist`

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

| Argument | Type              | Required | Description                      | Details |
| -------- | ----------------- | -------- | -------------------------------- | ------- |
| user     | [Member](#Member) | Yes      | The user that should be unmuted. |         |

### Examples

<a name='volume'></a>

---

## !volume

cmd.volume.self.description

### Usage

```text
!volume [volume]
```

### Arguments

| Argument | Type              | Required | Description                 | Details |
| -------- | ----------------- | -------- | --------------------------- | ------- |
| volume   | [Number](#Number) | No       | cmd.volume.self.args.volume |         |

### Examples

```text
!volume
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

| Argument | Type              | Required | Description                    | Details |
| -------- | ----------------- | -------- | ------------------------------ | ------- |
| member   | [Member](#Member) | Yes      | Member to warn.                |         |
| reason   | [Text](#Text)     | No       | Why was the member was warned. |         |

### Examples
