# Commands

To get a list of available commands, do !help on your server.

## Arguments & Flags

Most commands accept arguments and/or flags.  
According to the **Type** of the argument or flag you can provide different values.

### resolvers.boolean.type

resolvers.boolean.typeInfo

### resolvers.number.type

resolvers.number.typeInfo

### resolvers.enum.type

resolvers.enum.typeInfo

### resolvers.invitecode.type

resolvers.invitecode.typeInfo

### resolvers.user.type

resolvers.user.typeInfo

### resolvers.role.type

resolvers.role.typeInfo

### resolvers.channel.type

resolvers.channel.typeInfo

### resolvers.command.type

resolvers.command.typeInfo

### resolvers.string.type

resolvers.string.typeInfo

### resolvers.date.type

resolvers.date.typeInfo

### resolvers.duration.type

resolvers.duration.typeInfo

## Overview

### Invites

| Command                           | Description                         | Usage                                                            |
| --------------------------------- | ----------------------------------- | ---------------------------------------------------------------- |
| [addInvites](#addInvites)         | cmd.addInvites.self.description     | !addInvites \<user\> \<amount\> [reason]                         |
| [clearInvites](#clearInvites)     | cmd.clearInvites.self.description   | !clearInvites [-d value\|--date=value][-cb\|--clearbonus] [user] |
| [createInvite](#createInvite)     | cmd.createInvite.self.description   | !createInvite \<name\> [channel]                                 |
| [fake](#fake)                     | cmd.fake.self.description           | !fake [page]                                                     |
| [info](#info)                     | cmd.info.self.description           | !info \<user\> [details][page]                                   |
| [inviteCodes](#inviteCodes)       | cmd.inviteCodes.self.description    | !inviteCodes                                                     |
| [inviteDetails](#inviteDetails)   | cmd.inviteDetails.self.description  | !inviteDetails [user]                                            |
| [invites](#invites)               | cmd.invites.self.description        | !invites [user]                                                  |
| [leaderboard](#leaderboard)       | cmd.leaderboard.self.description    | !leaderboard [-c value\|--compare=value][duration] [page]        |
| [removeInvites](#removeInvites)   | cmd.removeInvites.self.description  | !removeInvites \<user\> \<amount\> [reason]                      |
| [restoreInvites](#restoreInvites) | cmd.restoreInvites.self.description | !restoreInvites [user]                                           |
| [subtractFakes](#subtractFakes)   | cmd.subtractFakes.self.description  | !subtractFakes                                                   |
| [subtractLeaves](#subtractLeaves) | cmd.subtractLeaves.self.description | !subtractLeaves                                                  |

### Ranks

| Command                   | Description                     | Usage                                |
| ------------------------- | ------------------------------- | ------------------------------------ |
| [addRank](#addRank)       | cmd.addRank.self.description    | !addRank \<role\> \<invites\> [info] |
| [fixRanks](#fixRanks)     | cmd.fixRanks.self.description   | !fixRanks                            |
| [ranks](#ranks)           | cmd.ranks.self.description      | !ranks [page]                        |
| [removeRank](#removeRank) | cmd.removeRank.self.description | !removeRank \<rank\>                 |

### Config

| Command                                 | Description                            | Usage                                       |
| --------------------------------------- | -------------------------------------- | ------------------------------------------- |
| [botConfig](#botConfig)                 | cmd.botConfig.self.description         | !botConfig [key][value]                     |
| [config](#config)                       | cmd.config.self.description            | !config [key][value]                        |
| [interactiveConfig](#interactiveConfig) | cmd.interactiveConfig.self.description | !interactiveConfig                          |
| [inviteCodeConfig](#inviteCodeConfig)   | cmd.inviteCodeConfig.self.description  | !inviteCodeConfig [key][invitecode] [value] |
| [memberConfig](#memberConfig)           | cmd.memberConfig.self.description      | !memberConfig [key][user] [value]           |
| [permissions](#permissions)             | cmd.permissions.self.description       | !permissions [cmd][role]                    |

### Info

| Command             | Description                  | Usage           |
| ------------------- | ---------------------------- | --------------- |
| [botInfo](#botInfo) | cmd.botInfo.self.description | !botInfo        |
| [credits](#credits) | cmd.credits.self.description | !credits        |
| [getBot](#getBot)   | cmd.getBot.self.description  | !getBot         |
| [help](#help)       | cmd.help.self.description    | !help [command] |
| [members](#members) | cmd.members.self.description | !members        |
| [ping](#ping)       | cmd.ping.self.description    | !ping           |
| [prefix](#prefix)   | cmd.prefix.self.description  | !prefix         |
| [setup](#setup)     | cmd.setup.self.description   | !setup          |
| [support](#support) | cmd.support.self.description | !support        |

### Premium

| Command                   | Description                     | Usage             |
| ------------------------- | ------------------------------- | ----------------- |
| [export](#export)         | cmd.export.self.description     | !export \<type\>  |
| [premium](#premium)       | cmd.premium.self.description    | !premium [action] |
| [tryPremium](#tryPremium) | cmd.tryPremium.self.description | !tryPremium       |

### Moderation

| Command                               | Description                           | Usage                                                            |
| ------------------------------------- | ------------------------------------- | ---------------------------------------------------------------- |
| [ban](#ban)                           | cmd.ban.self.description              | !ban [-d value\|--deleteMessageDays=value] \<user\> [reason]     |
| [caseDelete](#caseDelete)             | cmd.caseDelete.self.description       | !caseDelete \<caseNumber\> [reason]                              |
| [caseView](#caseView)                 | cmd.caseView.self.description         | !caseView \<caseNumber\>                                         |
| [check](#check)                       | cmd.check.self.description            | !check \<user\>                                                  |
| [clean](#clean)                       | cmd.clean.self.description            | !clean \<type\> [numberOfMessages]                               |
| [cleanShort](#cleanShort)             | cmd.cleanShort.self.description       | !cleanShort \<maxTextLength\> [numberOfMessages]                 |
| [cleanText](#cleanText)               | cmd.cleanText.self.description        | !cleanText \<text\> [numberOfMessages]                           |
| [kick](#kick)                         | cmd.kick.self.description             | !kick \<member\> [reason]                                        |
| [mute](#mute)                         | cmd.mute.self.description             | !mute \<user\> [reason]                                          |
| [punishmentConfig](#punishmentConfig) | cmd.punishmentConfig.self.description | !punishmentConfig [punishment][strikes] [args]                   |
| [purge](#purge)                       | cmd.purge.self.description            | !purge \<quantity\> [user]                                       |
| [purgeUntil](#purgeUntil)             | cmd.purgeUntil.self.description       | !purgeUntil \<messageID\>                                        |
| [softBan](#softBan)                   | cmd.softBan.self.description          | !softBan [-d value\|--deleteMessageDays=value] \<user\> [reason] |
| [strike](#strike)                     | cmd.strike.self.description           | !strike \<member\> \<type\> \<amount\>                           |
| [strikeConfig](#strikeConfig)         | cmd.strikeConfig.self.description     | !strikeConfig [violation][strikes]                               |
| [unban](#unban)                       | cmd.unban.self.description            | !unban \<user\> [reason]                                         |
| [unhoist](#unhoist)                   | cmd.unhoist.self.description          | !unhoist                                                         |
| [unmute](#unmute)                     | cmd.unmute.self.description           | !unmute \<user\>                                                 |
| [warn](#warn)                         | cmd.warn.self.description             | !warn \<member\> [reason]                                        |

### Music

| Command                   | Description                     | Usage                                                   |
| ------------------------- | ------------------------------- | ------------------------------------------------------- |
| [disconnect](#disconnect) | cmd.disconnect.self.description | !disconnect                                             |
| [lyrics](#lyrics)         | cmd.lyrics.self.description     | !lyrics [-l\|--live]                                    |
| [mashup](#mashup)         | cmd.mashup.self.description     | !mashup \<videos\>                                      |
| [nowPlaying](#nowPlaying) | cmd.nowPlaying.self.description | !nowPlaying [-p\|--pin]                                 |
| [pause](#pause)           | cmd.pause.self.description      | !pause                                                  |
| [play](#play)             | cmd.play.self.description       | !play [-p value\|--platform=value][-n\|--next] \<link\> |
| [queue](#queue)           | cmd.queue.self.description      | !queue                                                  |
| [repeat](#repeat)         | cmd.repeat.self.description     | !repeat                                                 |
| [resume](#resume)         | cmd.resume.self.description     | !resume                                                 |
| [rewind](#rewind)         | cmd.rewind.self.description     | !rewind                                                 |
| [search](#search)         | cmd.search.self.description     | !search [-p value\|--platform=value] \<search\>         |
| [seek](#seek)             | cmd.seek.self.description       | !seek [duration]                                        |
| [skip](#skip)             | cmd.skip.self.description       | !skip [amount]                                          |
| [volume](#volume)         | cmd.volume.self.description     | !volume [volume]                                        |

### Other

| Command                             | Description                          | Usage                      |
| ----------------------------------- | ------------------------------------ | -------------------------- |
| [graph](#graph)                     | cmd.graph.self.description           | !graph \<type\> [duration] |
| [makeMentionable](#makeMentionable) | cmd.makeMentionable.self.description | !makeMentionable \<role\>  |
| [mentionRole](#mentionRole)         | cmd.mentionRole.self.description     | !mentionRole \<role\>      |

<a name='addInvites'></a>

---

## !addInvites

cmd.addInvites.self.description

### Usage

```text
!addInvites <user> <amount> [reason]
```

### Aliases

- `!add-invites`

### Arguments

| Argument | Type                                            | Required | Description                     | Details |
| -------- | ----------------------------------------------- | -------- | ------------------------------- | ------- |
| user     | [resolvers.user.type](#resolvers.user.type)     | Yes      | cmd.addInvites.self.args.user   |         |
| amount   | [resolvers.number.type](#resolvers.number.type) | Yes      | cmd.addInvites.self.args.amount |         |
| reason   | [resolvers.string.type](#resolvers.string.type) | No       | cmd.addInvites.self.args.reason |         |

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

cmd.addRank.self.description

### Usage

```text
!addRank <role> <invites> [info]
```

### Aliases

- `!add-rank`
- `!set-rank`
- `!setrank`

### Arguments

| Argument | Type                                            | Required | Description                   | Details |
| -------- | ----------------------------------------------- | -------- | ----------------------------- | ------- |
| role     | [resolvers.role.type](#resolvers.role.type)     | Yes      | cmd.addRank.self.args.role    |         |
| invites  | [resolvers.number.type](#resolvers.number.type) | Yes      | cmd.addRank.self.args.invites |         |
| info     | [resolvers.string.type](#resolvers.string.type) | No       | cmd.addRank.self.args.info    |         |

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

cmd.ban.self.description

### Usage

```text
!ban [-d value|--deleteMessageDays=value] <user> [reason]
```

### Arguments

| Argument | Type                                            | Required | Description              | Details |
| -------- | ----------------------------------------------- | -------- | ------------------------ | ------- |
| user     | [resolvers.user.type](#resolvers.user.type)     | Yes      | cmd.ban.self.args.user   |         |
| reason   | [resolvers.string.type](#resolvers.string.type) | No       | cmd.ban.self.args.reason |         |

### Flags

| Flag                              | Short     | Type                                            | Description                          |
| --------------------------------- | --------- | ----------------------------------------------- | ------------------------------------ |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [resolvers.number.type](#resolvers.number.type) | cmd.ban.self.flags.deleteMessageDays |

### Examples

<a name='botConfig'></a>

---

## !botConfig

cmd.botConfig.self.description

### Usage

```text
!botConfig [key] [value]
```

### Aliases

- `!bot-config`
- `!botsetting`
- `!bot-setting`

### Arguments

| Argument | Type                                                          | Required | Description                   | Details                    |
| -------- | ------------------------------------------------------------- | -------- | ----------------------------- | -------------------------- |
| key      | [resolvers.enum.type](#resolvers.enum.type)                   | No       | cmd.botConfig.self.args.key   | resolvers.enum.validValues |
| value    | [resolvers.settingsvalue.type](#resolvers.settingsvalue.type) | No       | cmd.botConfig.self.args.value |                            |

### Examples

```text
!botConfig
```

<a name='botInfo'></a>

---

## !botInfo

cmd.botInfo.self.description

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

| Argument   | Type                                            | Required | Description                         | Details |
| ---------- | ----------------------------------------------- | -------- | ----------------------------------- | ------- |
| caseNumber | [resolvers.number.type](#resolvers.number.type) | Yes      | cmd.caseDelete.self.args.caseNumber |         |
| reason     | [resolvers.string.type](#resolvers.string.type) | No       | cmd.caseDelete.self.args.reason     |         |

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

| Argument   | Type                                            | Required | Description                       | Details |
| ---------- | ----------------------------------------------- | -------- | --------------------------------- | ------- |
| caseNumber | [resolvers.number.type](#resolvers.number.type) | Yes      | cmd.caseView.self.args.caseNumber |         |

### Examples

```text
!caseView 5434
```

<a name='check'></a>

---

## !check

cmd.check.self.description

### Usage

```text
!check <user>
```

### Aliases

- `!history`

### Arguments

| Argument | Type                                        | Required | Description              | Details |
| -------- | ------------------------------------------- | -------- | ------------------------ | ------- |
| user     | [resolvers.user.type](#resolvers.user.type) | Yes      | cmd.check.self.args.user |         |

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

cmd.clean.self.description

### Usage

```text
!clean <type> [numberOfMessages]
```

### Aliases

- `!clear`

### Arguments

| Argument         | Type                                            | Required | Description                          | Details                    |
| ---------------- | ----------------------------------------------- | -------- | ------------------------------------ | -------------------------- |
| type             | [resolvers.enum.type](#resolvers.enum.type)     | Yes      | cmd.clean.self.args.type             | resolvers.enum.validValues |
| numberOfMessages | [resolvers.number.type](#resolvers.number.type) | No       | cmd.clean.self.args.numberOfMessages |                            |

### Examples

<a name='cleanShort'></a>

---

## !cleanShort

cmd.cleanShort.self.description

### Usage

```text
!cleanShort <maxTextLength> [numberOfMessages]
```

### Aliases

- `!clean-short`
- `!clearshort`
- `!clear-short`

### Arguments

| Argument         | Type                                            | Required | Description                               | Details |
| ---------------- | ----------------------------------------------- | -------- | ----------------------------------------- | ------- |
| maxTextLength    | [resolvers.number.type](#resolvers.number.type) | Yes      | cmd.cleanShort.self.args.maxTextLength    |         |
| numberOfMessages | [resolvers.number.type](#resolvers.number.type) | No       | cmd.cleanShort.self.args.numberOfMessages |         |

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

| Argument         | Type                                            | Required | Description                              | Details |
| ---------------- | ----------------------------------------------- | -------- | ---------------------------------------- | ------- |
| text             | [resolvers.string.type](#resolvers.string.type) | Yes      | cmd.cleanText.self.args.text             |         |
| numberOfMessages | [resolvers.number.type](#resolvers.number.type) | No       | cmd.cleanText.self.args.numberOfMessages |         |

### Examples

<a name='clearInvites'></a>

---

## !clearInvites

cmd.clearInvites.self.description

### Usage

```text
!clearInvites [-d value|--date=value] [-cb|--clearBonus] [user]
```

### Aliases

- `!clear-invites`

### Arguments

| Argument | Type                                        | Required | Description                     | Details |
| -------- | ------------------------------------------- | -------- | ------------------------------- | ------- |
| user     | [resolvers.user.type](#resolvers.user.type) | No       | cmd.clearInvites.self.args.user |         |

### Flags

| Flag                       | Short      | Type                                              | Description                            |
| -------------------------- | ---------- | ------------------------------------------------- | -------------------------------------- |
| &#x2011;&#x2011;date       | &#x2011;d  | [resolvers.date.type](#resolvers.date.type)       | cmd.clearInvites.self.flags.date       |
| &#x2011;&#x2011;clearBonus | &#x2011;cb | [resolvers.boolean.type](#resolvers.boolean.type) | cmd.clearInvites.self.flags.clearBonus |

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

cmd.config.self.description

### Usage

```text
!config [key] [value]
```

### Aliases

- `!c`

### Arguments

| Argument | Type                                                          | Required | Description                | Details                    |
| -------- | ------------------------------------------------------------- | -------- | -------------------------- | -------------------------- |
| key      | [resolvers.enum.type](#resolvers.enum.type)                   | No       | cmd.config.self.args.key   | resolvers.enum.validValues |
| value    | [resolvers.settingsvalue.type](#resolvers.settingsvalue.type) | No       | cmd.config.self.args.value |                            |

### Examples

```text
!config
```

<a name='createInvite'></a>

---

## !createInvite

cmd.createInvite.self.description

### Usage

```text
!createInvite <name> [channel]
```

### Aliases

- `!create-invite`

### Arguments

| Argument | Type                                              | Required | Description                        | Details |
| -------- | ------------------------------------------------- | -------- | ---------------------------------- | ------- |
| name     | [resolvers.string.type](#resolvers.string.type)   | Yes      | cmd.createInvite.self.args.name    |         |
| channel  | [resolvers.channel.type](#resolvers.channel.type) | No       | cmd.createInvite.self.args.channel |         |

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

cmd.export.self.description

### Usage

```text
!export <type>
```

### Arguments

| Argument | Type                                        | Required | Description               | Details                    |
| -------- | ------------------------------------------- | -------- | ------------------------- | -------------------------- |
| type     | [resolvers.enum.type](#resolvers.enum.type) | Yes      | cmd.export.self.args.type | resolvers.enum.validValues |

### Examples

```text
!export leaderboard
```

<a name='fake'></a>

---

## !fake

cmd.fake.self.description

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

| Argument | Type                                            | Required | Description             | Details |
| -------- | ----------------------------------------------- | -------- | ----------------------- | ------- |
| page     | [resolvers.number.type](#resolvers.number.type) | No       | cmd.fake.self.args.page |         |

### Examples

```text
!fake
```

```text
!fake 4
```

<a name='fixRanks'></a>

---

## !fixRanks

cmd.fixRanks.self.description

### Usage

```text
!fixRanks
```

### Aliases

- `!fix-ranks`

### Examples

```text
!fixRanks
```

<a name='getBot'></a>

---

## !getBot

cmd.getBot.self.description

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

cmd.graph.self.description

### Usage

```text
!graph <type> [duration]
```

### Aliases

- `!g`
- `!chart`

### Arguments

| Argument | Type                                                | Required | Description                  | Details                    |
| -------- | --------------------------------------------------- | -------- | ---------------------------- | -------------------------- |
| type     | [resolvers.enum.type](#resolvers.enum.type)         | Yes      | cmd.graph.self.args.type     | resolvers.enum.validValues |
| duration | [resolvers.duration.type](#resolvers.duration.type) | No       | cmd.graph.self.args.duration |                            |

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

cmd.help.self.description

### Usage

```text
!help [command]
```

### Arguments

| Argument | Type                                              | Required | Description                | Details                       |
| -------- | ------------------------------------------------- | -------- | -------------------------- | ----------------------------- |
| command  | [resolvers.command.type](#resolvers.command.type) | No       | cmd.help.self.args.command | resolvers.command.validValues |

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

cmd.info.self.description

### Usage

```text
!info <user> [details] [page]
```

### Aliases

- `!showinfo`

### Arguments

| Argument | Type                                            | Required | Description                | Details                    |
| -------- | ----------------------------------------------- | -------- | -------------------------- | -------------------------- |
| user     | [resolvers.user.type](#resolvers.user.type)     | Yes      | cmd.info.self.args.user    |                            |
| details  | [resolvers.enum.type](#resolvers.enum.type)     | No       | cmd.info.self.args.details | resolvers.enum.validValues |
| page     | [resolvers.number.type](#resolvers.number.type) | No       | cmd.info.self.args.page    |                            |

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

cmd.inviteCodeConfig.self.description

### Usage

```text
!inviteCodeConfig [key] [inviteCode] [value]
```

### Aliases

- `!invite-code-config`
- `!icc`

### Arguments

| Argument   | Type                                                          | Required | Description                               | Details                    |
| ---------- | ------------------------------------------------------------- | -------- | ----------------------------------------- | -------------------------- |
| key        | [resolvers.enum.type](#resolvers.enum.type)                   | No       | cmd.inviteCodeConfig.self.args.key        | resolvers.enum.validValues |
| inviteCode | [resolvers.invitecode.type](#resolvers.invitecode.type)       | No       | cmd.inviteCodeConfig.self.args.inviteCode |                            |
| value      | [resolvers.settingsvalue.type](#resolvers.settingsvalue.type) | No       | cmd.inviteCodeConfig.self.args.value      |                            |

### Examples

```text
!inviteCodeConfig
```

<a name='inviteCodes'></a>

---

## !inviteCodes

cmd.inviteCodes.self.description

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

cmd.inviteDetails.self.description

### Usage

```text
!inviteDetails [user]
```

### Aliases

- `!invite-details`

### Arguments

| Argument | Type                                        | Required | Description                      | Details |
| -------- | ------------------------------------------- | -------- | -------------------------------- | ------- |
| user     | [resolvers.user.type](#resolvers.user.type) | No       | cmd.inviteDetails.self.args.user |         |

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

cmd.invites.self.description

### Usage

```text
!invites [user]
```

### Aliases

- `!invite`
- `!rank`

### Arguments

| Argument | Type                                        | Required | Description                | Details |
| -------- | ------------------------------------------- | -------- | -------------------------- | ------- |
| user     | [resolvers.user.type](#resolvers.user.type) | No       | cmd.invites.self.args.user |         |

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

cmd.kick.self.description

### Usage

```text
!kick <member> [reason]
```

### Arguments

| Argument | Type                                            | Required | Description               | Details |
| -------- | ----------------------------------------------- | -------- | ------------------------- | ------- |
| member   | [resolvers.member.type](#resolvers.member.type) | Yes      | cmd.kick.self.args.member |         |
| reason   | [resolvers.string.type](#resolvers.string.type) | No       | cmd.kick.self.args.reason |         |

### Examples

<a name='leaderboard'></a>

---

## !leaderboard

cmd.leaderboard.self.description

### Usage

```text
!leaderboard [-c value|--compare=value] [duration] [page]
```

### Aliases

- `!top`

### Arguments

| Argument | Type                                                | Required | Description                        | Details |
| -------- | --------------------------------------------------- | -------- | ---------------------------------- | ------- |
| duration | [resolvers.duration.type](#resolvers.duration.type) | No       | cmd.leaderboard.self.args.duration |         |
| page     | [resolvers.number.type](#resolvers.number.type)     | No       | cmd.leaderboard.self.args.page     |         |

### Flags

| Flag                    | Short     | Type                                                | Description                        |
| ----------------------- | --------- | --------------------------------------------------- | ---------------------------------- |
| &#x2011;&#x2011;compare | &#x2011;c | [resolvers.duration.type](#resolvers.duration.type) | cmd.leaderboard.self.flags.compare |

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

<a name='lyrics'></a>

---

## !lyrics

cmd.lyrics.self.description

### Usage

```text
!lyrics [-l|--live]
```

### Flags

| Flag                 | Short     | Type                                              | Description                |
| -------------------- | --------- | ------------------------------------------------- | -------------------------- |
| &#x2011;&#x2011;live | &#x2011;l | [resolvers.boolean.type](#resolvers.boolean.type) | cmd.lyrics.self.flags.live |

### Examples

```text
!lyrics
```

<a name='makeMentionable'></a>

---

## !makeMentionable

cmd.makeMentionable.self.description

### Usage

```text
!makeMentionable <role>
```

### Aliases

- `!make-mentionable`
- `!mm`

### Arguments

| Argument | Type                                        | Required | Description                        | Details |
| -------- | ------------------------------------------- | -------- | ---------------------------------- | ------- |
| role     | [resolvers.role.type](#resolvers.role.type) | Yes      | cmd.makeMentionable.self.args.role |         |

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

| Argument | Type                                            | Required | Description                 | Details |
| -------- | ----------------------------------------------- | -------- | --------------------------- | ------- |
| videos   | [resolvers.string.type](#resolvers.string.type) | Yes      | cmd.mashup.self.args.videos |         |

### Examples

<a name='memberConfig'></a>

---

## !memberConfig

cmd.memberConfig.self.description

### Usage

```text
!memberConfig [key] [user] [value]
```

### Aliases

- `!member-config`
- `!memconf`
- `!mc`

### Arguments

| Argument | Type                                                          | Required | Description                      | Details                    |
| -------- | ------------------------------------------------------------- | -------- | -------------------------------- | -------------------------- |
| key      | [resolvers.enum.type](#resolvers.enum.type)                   | No       | cmd.memberConfig.self.args.key   | resolvers.enum.validValues |
| user     | [resolvers.user.type](#resolvers.user.type)                   | No       | cmd.memberConfig.self.args.user  |                            |
| value    | [resolvers.settingsvalue.type](#resolvers.settingsvalue.type) | No       | cmd.memberConfig.self.args.value |                            |

### Examples

```text
!memberConfig
```

<a name='members'></a>

---

## !members

cmd.members.self.description

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

cmd.mentionRole.self.description

### Usage

```text
!mentionRole <role>
```

### Aliases

- `!mention-role`
- `!mr`

### Arguments

| Argument | Type                                        | Required | Description                    | Details |
| -------- | ------------------------------------------- | -------- | ------------------------------ | ------- |
| role     | [resolvers.role.type](#resolvers.role.type) | Yes      | cmd.mentionRole.self.args.role |         |

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

| Argument | Type                                            | Required | Description               | Details |
| -------- | ----------------------------------------------- | -------- | ------------------------- | ------- |
| user     | [resolvers.member.type](#resolvers.member.type) | Yes      | cmd.mute.self.args.user   |         |
| reason   | [resolvers.string.type](#resolvers.string.type) | No       | cmd.mute.self.args.reason |         |

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

| Flag                | Short     | Type                                              | Description                   |
| ------------------- | --------- | ------------------------------------------------- | ----------------------------- |
| &#x2011;&#x2011;pin | &#x2011;p | [resolvers.boolean.type](#resolvers.boolean.type) | cmd.nowPlaying.self.flags.pin |

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

cmd.permissions.self.description

### Usage

```text
!permissions [cmd] [role]
```

### Aliases

- `!perms`

### Arguments

| Argument | Type                                              | Required | Description                    | Details                       |
| -------- | ------------------------------------------------- | -------- | ------------------------------ | ----------------------------- |
| cmd      | [resolvers.command.type](#resolvers.command.type) | No       | cmd.permissions.self.args.cmd  | resolvers.command.validValues |
| role     | [resolvers.role.type](#resolvers.role.type)       | No       | cmd.permissions.self.args.role |                               |

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
!play [-p value|--platform=value] [-n|--next] <link>
```

### Aliases

- `!p`

### Arguments

| Argument | Type                                            | Required | Description             | Details |
| -------- | ----------------------------------------------- | -------- | ----------------------- | ------- |
| link     | [resolvers.string.type](#resolvers.string.type) | Yes      | cmd.play.self.args.link |         |

### Flags

| Flag                     | Short     | Type                                              | Description                  |
| ------------------------ | --------- | ------------------------------------------------- | ---------------------------- |
| &#x2011;&#x2011;platform | &#x2011;p | [resolvers.enum.type](#resolvers.enum.type)       | cmd.play.self.flags.platform |
| &#x2011;&#x2011;next     | &#x2011;n | [resolvers.boolean.type](#resolvers.boolean.type) | cmd.play.self.flags.next     |

### Examples

<a name='prefix'></a>

---

## !prefix

cmd.prefix.self.description

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

cmd.premium.self.description

### Usage

```text
!premium [action]
```

### Aliases

- `!patreon`
- `!donate`

### Arguments

| Argument | Type                                        | Required | Description                  | Details                    |
| -------- | ------------------------------------------- | -------- | ---------------------------- | -------------------------- |
| action   | [resolvers.enum.type](#resolvers.enum.type) | No       | cmd.premium.self.args.action | resolvers.enum.validValues |

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

cmd.punishmentConfig.self.description

### Usage

```text
!punishmentConfig [punishment] [strikes] [args]
```

### Aliases

- `!punishment-config`

### Arguments

| Argument   | Type                                            | Required | Description                               | Details                    |
| ---------- | ----------------------------------------------- | -------- | ----------------------------------------- | -------------------------- |
| punishment | [resolvers.enum.type](#resolvers.enum.type)     | No       | cmd.punishmentConfig.self.args.punishment | resolvers.enum.validValues |
| strikes    | [resolvers.number.type](#resolvers.number.type) | No       | cmd.punishmentConfig.self.args.strikes    |                            |
| args       | [resolvers.string.type](#resolvers.string.type) | No       | cmd.punishmentConfig.self.args.args       |                            |

### Examples

```text
!punishmentConfig
```

<a name='purge'></a>

---

## !purge

cmd.purge.self.description

### Usage

```text
!purge <quantity> [user]
```

### Aliases

- `!prune`

### Arguments

| Argument | Type                                            | Required | Description                  | Details |
| -------- | ----------------------------------------------- | -------- | ---------------------------- | ------- |
| quantity | [resolvers.number.type](#resolvers.number.type) | Yes      | cmd.purge.self.args.quantity |         |
| user     | [resolvers.user.type](#resolvers.user.type)     | No       | cmd.purge.self.args.user     |         |

### Examples

<a name='purgeUntil'></a>

---

## !purgeUntil

cmd.purgeUntil.self.description

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

| Argument  | Type                                            | Required | Description                        | Details |
| --------- | ----------------------------------------------- | -------- | ---------------------------------- | ------- |
| messageID | [resolvers.string.type](#resolvers.string.type) | Yes      | cmd.purgeUntil.self.args.messageID |         |

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

cmd.ranks.self.description

### Usage

```text
!ranks [page]
```

### Aliases

- `!show-ranks`
- `!showranks`

### Arguments

| Argument | Type                                            | Required | Description              | Details |
| -------- | ----------------------------------------------- | -------- | ------------------------ | ------- |
| page     | [resolvers.number.type](#resolvers.number.type) | No       | cmd.ranks.self.args.page |         |

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

| Argument | Type                                            | Required | Description                        | Details |
| -------- | ----------------------------------------------- | -------- | ---------------------------------- | ------- |
| user     | [resolvers.user.type](#resolvers.user.type)     | Yes      | cmd.removeInvites.self.args.user   |         |
| amount   | [resolvers.number.type](#resolvers.number.type) | Yes      | cmd.removeInvites.self.args.amount |         |
| reason   | [resolvers.string.type](#resolvers.string.type) | No       | cmd.removeInvites.self.args.reason |         |

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

cmd.removeRank.self.description

### Usage

```text
!removeRank <rank>
```

### Aliases

- `!remove-rank`

### Arguments

| Argument | Type                                        | Required | Description                   | Details |
| -------- | ------------------------------------------- | -------- | ----------------------------- | ------- |
| rank     | [resolvers.role.type](#resolvers.role.type) | Yes      | cmd.removeRank.self.args.rank |         |

### Examples

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

cmd.restoreInvites.self.description

### Usage

```text
!restoreInvites [user]
```

### Aliases

- `!restore-invites`
- `!unclear-invites`
- `!unclearinvites`

### Arguments

| Argument | Type                                        | Required | Description                       | Details |
| -------- | ------------------------------------------- | -------- | --------------------------------- | ------- |
| user     | [resolvers.user.type](#resolvers.user.type) | No       | cmd.restoreInvites.self.args.user |         |

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
!search [-p value|--platform=value] <search>
```

### Arguments

| Argument | Type                                            | Required | Description                 | Details |
| -------- | ----------------------------------------------- | -------- | --------------------------- | ------- |
| search   | [resolvers.string.type](#resolvers.string.type) | Yes      | cmd.search.self.args.search |         |

### Flags

| Flag                     | Short     | Type                                        | Description                    |
| ------------------------ | --------- | ------------------------------------------- | ------------------------------ |
| &#x2011;&#x2011;platform | &#x2011;p | [resolvers.enum.type](#resolvers.enum.type) | cmd.search.self.flags.platform |

### Examples

<a name='seek'></a>

---

## !seek

cmd.seek.self.description

### Usage

```text
!seek [duration]
```

### Arguments

| Argument | Type                                            | Required | Description                 | Details |
| -------- | ----------------------------------------------- | -------- | --------------------------- | ------- |
| duration | [resolvers.number.type](#resolvers.number.type) | No       | cmd.seek.self.args.duration |         |

### Examples

```text
!seek
```

<a name='setup'></a>

---

## !setup

cmd.setup.self.description

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
!skip [amount]
```

### Aliases

- `!next`

### Arguments

| Argument | Type                                            | Required | Description               | Details |
| -------- | ----------------------------------------------- | -------- | ------------------------- | ------- |
| amount   | [resolvers.number.type](#resolvers.number.type) | No       | cmd.skip.self.args.amount |         |

### Examples

```text
!skip
```

<a name='softBan'></a>

---

## !softBan

cmd.softBan.self.description

### Usage

```text
!softBan [-d value|--deleteMessageDays=value] <user> [reason]
```

### Aliases

- `!soft-ban`

### Arguments

| Argument | Type                                            | Required | Description                  | Details |
| -------- | ----------------------------------------------- | -------- | ---------------------------- | ------- |
| user     | [resolvers.member.type](#resolvers.member.type) | Yes      | cmd.softBan.self.args.user   |         |
| reason   | [resolvers.string.type](#resolvers.string.type) | No       | cmd.softBan.self.args.reason |         |

### Flags

| Flag                              | Short     | Type                                            | Description                              |
| --------------------------------- | --------- | ----------------------------------------------- | ---------------------------------------- |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [resolvers.number.type](#resolvers.number.type) | cmd.softBan.self.flags.deleteMessageDays |

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

| Argument | Type                                            | Required | Description                 | Details                    |
| -------- | ----------------------------------------------- | -------- | --------------------------- | -------------------------- |
| member   | [resolvers.member.type](#resolvers.member.type) | Yes      | cmd.strike.self.args.member |                            |
| type     | [resolvers.enum.type](#resolvers.enum.type)     | Yes      | cmd.strike.self.args.type   | resolvers.enum.validValues |
| amount   | [resolvers.number.type](#resolvers.number.type) | Yes      | cmd.strike.self.args.amount |                            |

### Examples

<a name='strikeConfig'></a>

---

## !strikeConfig

cmd.strikeConfig.self.description

### Usage

```text
!strikeConfig [violation] [strikes]
```

### Aliases

- `!strike-config`

### Arguments

| Argument  | Type                                            | Required | Description                          | Details                    |
| --------- | ----------------------------------------------- | -------- | ------------------------------------ | -------------------------- |
| violation | [resolvers.enum.type](#resolvers.enum.type)     | No       | cmd.strikeConfig.self.args.violation | resolvers.enum.validValues |
| strikes   | [resolvers.number.type](#resolvers.number.type) | No       | cmd.strikeConfig.self.args.strikes   |                            |

### Examples

```text
!strikeConfig
```

<a name='subtractFakes'></a>

---

## !subtractFakes

cmd.subtractFakes.self.description

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

cmd.subtractLeaves.self.description

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

cmd.support.self.description

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

cmd.tryPremium.self.description

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

| Argument | Type                                            | Required | Description                | Details |
| -------- | ----------------------------------------------- | -------- | -------------------------- | ------- |
| user     | [resolvers.user.type](#resolvers.user.type)     | Yes      | cmd.unban.self.args.user   |         |
| reason   | [resolvers.string.type](#resolvers.string.type) | No       | cmd.unban.self.args.reason |         |

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

| Argument | Type                                            | Required | Description               | Details |
| -------- | ----------------------------------------------- | -------- | ------------------------- | ------- |
| user     | [resolvers.member.type](#resolvers.member.type) | Yes      | cmd.unmute.self.args.user |         |

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

| Argument | Type                                            | Required | Description                 | Details |
| -------- | ----------------------------------------------- | -------- | --------------------------- | ------- |
| volume   | [resolvers.number.type](#resolvers.number.type) | No       | cmd.volume.self.args.volume |         |

### Examples

```text
!volume
```

<a name='warn'></a>

---

## !warn

cmd.warn.self.description

### Usage

```text
!warn <member> [reason]
```

### Arguments

| Argument | Type                                            | Required | Description               | Details |
| -------- | ----------------------------------------------- | -------- | ------------------------- | ------- |
| member   | [resolvers.member.type](#resolvers.member.type) | Yes      | cmd.warn.self.args.member |         |
| reason   | [resolvers.string.type](#resolvers.string.type) | No       | cmd.warn.self.args.reason |         |

### Examples
