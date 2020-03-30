# Commands

To get a list of available commands, do !help on your server.

## Arguments & Flags

Most commands accept arguments and/or flags.  
According to the **Type** of the argument or flag you can provide different values.

### Boolean

This arguments expects `true` or `false`. You can also use `yes` and `no`.

### Number

This arguments expects a number

### Enum

This arguments expects a value from a specific set of valid values.

> Depending on the command the valid values can vary. Use `!help <command>` (eg. `!help addRank`) to get more information about the command and the valid values for the enum.

### Invite Code

This arguments expects a Discord Invite Code.

> You can put only the part after `https://discord.gg/` to prevent Discord from creating a preview.

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

### Command

This argument expects a command of this bot. You can use any of the following methods to provide a command:

- Use the command name: `invites`
- Use an alias of the command: `p`

### Text

This arguments expects any text. You can use quotes (`"Text with quotes"`) for text that has spaces.

> If the text is the last argument you don't have to use quotes.

### Date

This argument expects a date. You can use various formats, but we recommend: `YYYY-MM-DD`

### Duration

This argument expects a duration. The following duration types are supported:

- Seconds: `s` (`5s` = 5 seconds)
- Minutes: `min` (`3min` = 3 minutes)
- Hours: `h` (`4h` = 4 hours)
- Days: `d` (`2d` = 2 days)
- Weeks: `w` (`1w` = 1 week)
- Months: `mo` (`6mo` = 6 months)
- Years: `y` (`10y` = 10 years)

## Overview

### Invites

| Command                           | Description                                        | Usage                                                            |
| --------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------- |
| [addInvites](#addInvites)         | 新增/移除成員的邀請。                              | !addInvites \<user\> \<amount\> [reason]                         |
| [clearInvites](#clearInvites)     | 清除伺服器/一個使用者的邀請。                      | !clearInvites [-d value\|--date=value][-cb\|--clearbonus] [user] |
| [createInvite](#createInvite)     | 創立獨特的邀請代碼。                               | !createInvite \<name\> [channel]                                 |
| [info](#info)                     | Show info about a specific member.                 | !info \<user\> [details][page]                                   |
| [inviteCodes](#inviteCodes)       | Get a list of all your invite codes                | !inviteCodes                                                     |
| [inviteDetails](#inviteDetails)   | Shows details about where your invites are from.   | !inviteDetails [user]                                            |
| [invites](#invites)               | Show personal invites.                             | !invites [user]                                                  |
| [leaderboard](#leaderboard)       | Show members with most invites.                    | !leaderboard [page]                                              |
| [removeInvites](#removeInvites)   | Removes a specified amount of invites from a user. | !removeInvites \<user\> \<amount\> [reason]                      |
| [restoreInvites](#restoreInvites) | Restore all previously cleared invites.            | !restoreInvites [user]                                           |
| [subtractFakes](#subtractFakes)   | Remove fake invites from all users.                | !subtractFakes                                                   |
| [subtractLeaves](#subtractLeaves) | Remove leaves from all users                       | !subtractLeaves                                                  |

### Ranks

| Command                   | Description                                   | Usage                                |
| ------------------------- | --------------------------------------------- | ------------------------------------ |
| [addRank](#addRank)       | 新增一個新的等級。                            | !addRank \<role\> \<invites\> [info] |
| [fixRanks](#fixRanks)     | Deletes any ranks where the role was deleted. | !fixRanks                            |
| [ranks](#ranks)           | Show all ranks.                               | !ranks [page]                        |
| [removeRank](#removeRank) | Remove a rank.                                | !removeRank \<rank\>                 |

### Config

| Command                                 | Description                                               | Usage                                       |
| --------------------------------------- | --------------------------------------------------------- | ------------------------------------------- |
| [botConfig](#botConfig)                 | 顯示和更改機器人的配置。                                  | !botConfig [key][value]                     |
| [config](#config)                       | 顯示和更改伺服器的配置。                                  | !config [key][value]                        |
| [interactiveConfig](#interactiveConfig) | Interactive Config                                        | !interactiveConfig                          |
| [inviteCodeConfig](#inviteCodeConfig)   | Show and change the config of invite codes of the server. | !inviteCodeConfig [key][invitecode] [value] |
| [memberConfig](#memberConfig)           | Show and change the config of members of the server.      | !memberConfig [key][user] [value]           |
| [permissions](#permissions)             | Configure permissions to use commands.                    | !permissions [cmd][role]                    |

### Info

| Command             | Description                                                                       | Usage           |
| ------------------- | --------------------------------------------------------------------------------- | --------------- |
| [botInfo](#botInfo) | 得到關於機器人的一般資訊。                                                        | !botInfo        |
| [credits](#credits) | 顯示機器人的開發人員和合作人員。                                                  | !credits        |
| [getBot](#getBot)   | 拿到機器人的邀請鏈接                                                              | !getBot         |
| [help](#help)       | 顯示幫助                                                                          | !help [command] |
| [members](#members) | Show member count of current server.                                              | !members        |
| [ping](#ping)       | Ping the bot                                                                      | !ping           |
| [prefix](#prefix)   | Shows the current prefix of the bot.                                              | !prefix         |
| [setup](#setup)     | Help with setting up the bot and checking for problems (e.g. missing permissions) | !setup          |
| [support](#support) | Get an invite link to our support server.                                         | !support        |

### Premium

| Command                   | Description                                                               | Usage             |
| ------------------------- | ------------------------------------------------------------------------- | ----------------- |
| [export](#export)         | 輸出 InviteManager 的資料到一個 csv 表單。                                | !export \<type\>  |
| [premium](#premium)       | Info about premium version of InviteManager.                              | !premium [action] |
| [tryPremium](#tryPremium) | Try the premium version of InviteManager for free for a limited duration. | !tryPremium       |

### Moderation

| Command                               | Description                                                                                                                                   | Usage                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [ban](#ban)                           | 從伺服器封鎖一個成員。                                                                                                                        | !ban [-d value\|--deleteMessageDays=value] \<user\> [reason]     |
| [caseDelete](#caseDelete)             | 刪除一個特定案件。                                                                                                                            | !caseDelete \<caseNumber\> [reason]                              |
| [caseView](#caseView)                 | 檢視一個特定案件的資訊。                                                                                                                      | !caseView \<caseNumber\>                                         |
| [check](#check)                       | 檢查使用者的 violation 和懲罰歷史。                                                                                                           | !check \<user\>                                                  |
| [clean](#clean)                       | 清除一個頻道中一些類型的訊息。                                                                                                                | !clean \<type\> [numberOfMessages]                               |
| [cleanShort](#cleanShort)             | 清除短訊息                                                                                                                                    | !cleanShort \<maxTextLength\> [numberOfMessages]                 |
| [cleanText](#cleanText)               | 刪除包含一些關鍵字的訊息。                                                                                                                    | !cleanText \<text\> [numberOfMessages]                           |
| [kick](#kick)                         | Kick a member from the server.                                                                                                                | !kick \<member\> [reason]                                        |
| [lockdown](#lockdown)                 | Lockdown a specific channel (Prevents anyone without special roles from sending messages)                                                     | !lockdown [-t value\|--timeout=value][channel]                   |
| [mute](#mute)                         | Mute a user                                                                                                                                   | !mute [-d value\|--duration=value] \<user\> [reason]             |
| [punishmentConfig](#punishmentConfig) | Configure punishments when reaching a certain amount of strikes.                                                                              | !punishmentConfig [punishment][strikes] [args]                   |
| [purge](#purge)                       | Purge messages in a channel.                                                                                                                  | !purge \<quantity\> [user]                                       |
| [purgeUntil](#purgeUntil)             | Purge messages in a channel up until a specified message.                                                                                     | !purgeUntil \<messageID\>                                        |
| [softBan](#softBan)                   | Ban and then automatically unban a member from the server.                                                                                    | !softBan [-d value\|--deleteMessageDays=value] \<user\> [reason] |
| [strike](#strike)                     | Add strikes to a user                                                                                                                         | !strike \<member\> \<type\> \<amount\>                           |
| [strikeConfig](#strikeConfig)         | Configure strikes received for various violations.                                                                                            | !strikeConfig [violation][strikes]                               |
| [unban](#unban)                       | Unban a user                                                                                                                                  | !unban \<user\> [reason]                                         |
| [unhoist](#unhoist)                   | Add a character in front of all members with a special character in front of their name, so they will be shown at the end of the member list. | !unhoist                                                         |
| [unmute](#unmute)                     | Unmute a user                                                                                                                                 | !unmute \<user\>                                                 |
| [warn](#warn)                         | Warn a member.                                                                                                                                | !warn \<member\> [reason]                                        |

### Music

| Command                   | Description                                                                                  | Usage                                                   |
| ------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [disconnect](#disconnect) | Disconnect the bot from the current voice channel.                                           | !disconnect                                             |
| [lyrics](#lyrics)         | Show lyrics of the currently playing song.                                                   | !lyrics [-l\|--live]                                    |
| [mashup](#mashup)         | Create a mashup of 2 songs.                                                                  | !mashup \<videos\>                                      |
| [nowPlaying](#nowPlaying) | Shows information about the currently playing song                                           | !nowPlaying [-p\|--pin]                                 |
| [pause](#pause)           | Pause the current song.                                                                      | !pause                                                  |
| [play](#play)             | Play the song if the queue is empty, otherwise it will add the song to the end of the queue. | !play [-p value\|--platform=value][-n\|--next] \<link\> |
| [queue](#queue)           | Display the songs in the queue.                                                              | !queue                                                  |
| [repeat](#repeat)         | Set the song to be played on repeat.                                                         | !repeat                                                 |
| [resume](#resume)         | Resume the current song.                                                                     | !resume                                                 |
| [rewind](#rewind)         | Rewind the song and start from the beginning.                                                | !rewind                                                 |
| [search](#search)         | Search for the search term and let you chose one of the results.                             | !search [-p value\|--platform=value] \<search\>         |
| [seek](#seek)             | Skip to a specific part of the song.                                                         | !seek [duration]                                        |
| [skip](#skip)             | Skip the current song and play the next song in the queue.                                   | !skip [amount]                                          |
| [volume](#volume)         | Set the volume if an argument is passed, or show the current volume.                         | !volume [volume]                                        |

### Other

| Command         | Description                    | Usage                      |
| --------------- | ------------------------------ | -------------------------- |
| [graph](#graph) | 顯示關於這個伺服的各種統計資料 | !graph \<type\> [from][to] |

<a name='addInvites'></a>

---

## !addInvites

新增/移除成員的邀請。

### Usage

```text
!addInvites <user> <amount> [reason]
```

### Aliases

- `!add-invites`

### Arguments

| Argument | Type              | Required | Description                                              | Details |
| -------- | ----------------- | -------- | -------------------------------------------------------- | ------- |
| user     | [User](#User)     | Yes      | 使用者將收到/遺失額外獎勵的邀請。                        |         |
| amount   | [Number](#Number) | Yes      | 使用者的邀請數量將獲得/遺失。使用一個負(-)數來移除邀請。 |         |
| reason   | [Text](#Text)     | No       | 新增/移除邀請的原因。                                    |         |

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

新增一個新的等級。

### Usage

```text
!addRank <role> <invites> [info]
```

### Aliases

- `!add-rank`
- `!set-rank`
- `!setrank`

### Arguments

| Argument | Type              | Required | Description                                      | Details |
| -------- | ----------------- | -------- | ------------------------------------------------ | ------- |
| role     | [Role](#Role)     | Yes      | 使用者將收到的身分組當達到等級時。               |         |
| invites  | [Number](#Number) | Yes      | 需要的邀請數量來達到等級。                       |         |
| info     | [Text](#Text)     | No       | 一個使用者將看見的敘述所以他們能更知道這個等級。 |         |

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

從伺服器封鎖一個成員。

### Usage

```text
!ban [-d value|--deleteMessageDays=value] <user> [reason]
```

### Arguments

| Argument | Type          | Required | Description          | Details |
| -------- | ------------- | -------- | -------------------- | ------- |
| user     | [User](#User) | Yes      | 使用者封鎖。         |         |
| reason   | [Text](#Text) | No       | 為甚麼使用者被封鎖。 |         |

### Flags

| Flag                              | Short     | Type              | Description                              |
| --------------------------------- | --------- | ----------------- | ---------------------------------------- |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [Number](#Number) | 如果指定將刪除被封鎖成員近幾日內的訊息。 |

### Examples

<a name='botConfig'></a>

---

## !botConfig

顯示和更改機器人的配置。

### Usage

```text
!botConfig [key] [value]
```

### Aliases

- `!bot-config`
- `!botsetting`
- `!bot-setting`

### Arguments

| Argument | Type            | Required | Description                       | Details                                                                                                                                     |
| -------- | --------------- | -------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| key      | [Enum](#Enum)   | No       | 您想要顯示/更改的機器人配置設定。 | Use one of the following values: `activityEnabled`, `activityMessage`, `activityStatus`, `activityType`, `activityUrl`, `embedDefaultColor` |
| value    | [Value](#Value) | No       | 新設定的值。                      |                                                                                                                                             |

### Examples

```text
!botConfig
```

<a name='botInfo'></a>

---

## !botInfo

得到關於機器人的一般資訊。

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

刪除一個特定案件。

### Usage

```text
!caseDelete <caseNumber> [reason]
```

### Aliases

- `!case-delete`
- `!deletecase`
- `!delete-case`

### Arguments

| Argument   | Type              | Required | Description      | Details |
| ---------- | ----------------- | -------- | ---------------- | ------- |
| caseNumber | [Number](#Number) | Yes      | 案件編號         |         |
| reason     | [Text](#Text)     | No       | 移除案件的原因。 |         |

### Examples

```text
!caseDelete 5434 User apologized
```

<a name='caseView'></a>

---

## !caseView

檢視一個特定案件的資訊。

### Usage

```text
!caseView <caseNumber>
```

### Aliases

- `!case-view`
- `!viewcase`
- `!view-case`

### Arguments

| Argument   | Type              | Required | Description | Details |
| ---------- | ----------------- | -------- | ----------- | ------- |
| caseNumber | [Number](#Number) | Yes      | 案件編號    |         |

### Examples

```text
!caseView 5434
```

<a name='check'></a>

---

## !check

檢查使用者的 violation 和懲罰歷史。

### Usage

```text
!check <user>
```

### Aliases

- `!history`

### Arguments

| Argument | Type          | Required | Description  | Details |
| -------- | ------------- | -------- | ------------ | ------- |
| user     | [User](#User) | Yes      | 檢查使用者。 |         |

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

清除一個頻道中一些類型的訊息。

### Usage

```text
!clean <type> [numberOfMessages]
```

### Aliases

- `!clear`

### Arguments

| Argument         | Type              | Required | Description            | Details                                                                                                            |
| ---------------- | ----------------- | -------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| type             | [Enum](#Enum)     | Yes      | 該類型的訊息將被刪除。 | Use one of the following values: `bots`, `embeds`, `emojis`, `images`, `links`, `mentions`, `reacted`, `reactions` |
| numberOfMessages | [Number](#Number) | No       | 將被搜尋的訊息數量。   |                                                                                                                    |

### Examples

<a name='cleanShort'></a>

---

## !cleanShort

清除短訊息

### Usage

```text
!cleanShort <maxTextLength> [numberOfMessages]
```

### Aliases

- `!clean-short`
- `!clearshort`
- `!clear-short`

### Arguments

| Argument         | Type              | Required | Description                  | Details |
| ---------------- | ----------------- | -------- | ---------------------------- | ------- |
| maxTextLength    | [Number](#Number) | Yes      | 所有短於這個的訊息將被刪除。 |         |
| numberOfMessages | [Number](#Number) | No       | 將被搜尋的訊息數量。         |         |

### Examples

<a name='cleanText'></a>

---

## !cleanText

刪除包含一些關鍵字的訊息。

### Usage

```text
!cleanText <text> [numberOfMessages]
```

### Aliases

- `!clean-text`
- `!cleartext`
- `!clear-text`

### Arguments

| Argument         | Type              | Required | Description                    | Details |
| ---------------- | ----------------- | -------- | ------------------------------ | ------- |
| text             | [Text](#Text)     | Yes      | 所有包含這個字的訊息將被刪除。 |         |
| numberOfMessages | [Number](#Number) | No       | 將被搜尋的訊息數量。           |         |

### Examples

<a name='clearInvites'></a>

---

## !clearInvites

清除伺服器/一個使用者的邀請。

### Usage

```text
!clearInvites [-d value|--date=value] [-cb|--clearBonus] [user]
```

### Aliases

- `!clear-invites`

### Arguments

| Argument | Type          | Required | Description                                          | Details |
| -------- | ------------- | -------- | ---------------------------------------------------- | ------- |
| user     | [User](#User) | No       | 要被清除所有邀請的使用者。如果省略則清除所有使用者。 |         |

### Flags

| Flag                       | Short      | Type                | Description                                                        |
| -------------------------- | ---------- | ------------------- | ------------------------------------------------------------------ |
| &#x2011;&#x2011;date       | &#x2011;d  | [Date](#Date)       | 應該開始被計算的邀請的日期。預設值是今日。                         |
| &#x2011;&#x2011;clearBonus | &#x2011;cb | [Boolean](#Boolean) | 增加此標誌來清除額外獎勵的邀請。否則額外獎勵的邀請被留下不會改變。 |

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

顯示和更改伺服器的配置。

### Usage

```text
!config [key] [value]
```

### Aliases

- `!c`

### Arguments

| Argument | Type            | Required | Description                 | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------- | --------------- | -------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key      | [Enum](#Enum)   | No       | 您想要顯示/更改的配置設定。 | Use one of the following values: `announcementVoice`, `announceNextSong`, `autoModAllCapsEnabled`, `autoModAllCapsMinCharacters`, `autoModAllCapsPercentageCaps`, `autoModDeleteBotMessage`, `autoModDeleteBotMessageTimeoutInSeconds`, `autoModDisabledForOldMembers`, `autoModDisabledForOldMembersThreshold`, `autoModDuplicateTextEnabled`, `autoModDuplicateTextTimeframeInSeconds`, `autoModEmojisEnabled`, `autoModEmojisMaxNumberOfEmojis`, `autoModEnabled`, `autoModHoistEnabled`, `autoModIgnoredChannels`, `autoModIgnoredRoles`, `autoModInvitesEnabled`, `autoModLinksBlacklist`, `autoModLinksEnabled`, `autoModLinksFollowRedirects`, `autoModLinksWhitelist`, `autoModLogEnabled`, `autoModMentionRolesEnabled`, `autoModMentionRolesMaxNumberOfMentions`, `autoModMentionUsersEnabled`, `autoModMentionUsersMaxNumberOfMentions`, `autoModModeratedChannels`, `autoModModeratedRoles`, `autoModQuickMessagesEnabled`, `autoModQuickMessagesNumberOfMessages`, `autoModQuickMessagesTimeframeInSeconds`, `autoModWordsBlacklist`, `autoModWordsEnabled`, `autoSubtractFakes`, `autoSubtractLeaves`, `autoSubtractLeaveThreshold`, `captchaVerificationFailedMessage`, `captchaVerificationLogEnabled`, `captchaVerificationOnJoin`, `captchaVerificationSuccessMessage`, `captchaVerificationTimeout`, `captchaVerificationWelcomeMessage`, `channels`, `defaultMusicPlatform`, `disabledMusicPlatforms`, `fadeMusicEndDelay`, `fadeMusicOnTalk`, `getUpdates`, `hideLeftMembersFromLeaderboard`, `ignoredChannels`, `joinMessage`, `joinMessageChannel`, `joinRoles`, `lang`, `leaderboardStyle`, `leaveMessage`, `leaveMessageChannel`, `logChannel`, `modLogChannel`, `modPunishmentBanDeleteMessage`, `modPunishmentKickDeleteMessage`, `modPunishmentMuteDeleteMessage`, `modPunishmentSoftbanDeleteMessage`, `modPunishmentWarnDeleteMessage`, `musicVolume`, `mutedRole`, `prefix`, `rankAnnouncementChannel`, `rankAnnouncementMessage`, `rankAssignmentStyle` |
| value    | [Value](#Value) | No       | 新設定的值。                |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

### Examples

```text
!config
```

<a name='createInvite'></a>

---

## !createInvite

創立獨特的邀請代碼。

### Usage

```text
!createInvite <name> [channel]
```

### Aliases

- `!create-invite`

### Arguments

| Argument | Type                | Required | Description                                  | Details |
| -------- | ------------------- | -------- | -------------------------------------------- | ------- |
| name     | [Text](#Text)       | Yes      | 邀請代碼的名字。                             |         |
| channel  | [Channel](#Channel) | No       | 邀請代碼被創立在頻道。使用目前的頻道為默認。 |         |

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

顯示機器人的開發人員和合作人員。

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

Disconnect the bot from the current voice channel.

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

輸出 InviteManager 的資料到一個 csv 表單。

### Usage

```text
!export <type>
```

### Arguments

| Argument | Type          | Required | Description        | Details                                        |
| -------- | ------------- | -------- | ------------------ | ---------------------------------------------- |
| type     | [Enum](#Enum) | Yes      | 輸出您想要的類型。 | Use one of the following values: `leaderboard` |

### Examples

```text
!export leaderboard
```

<a name='fixRanks'></a>

---

## !fixRanks

Deletes any ranks where the role was deleted.

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

拿到機器人的邀請鏈接

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

顯示關於這個伺服的各種統計資料

### Usage

```text
!graph <type> [from] [to]
```

### Aliases

- `!g`
- `!chart`

### Arguments

| Argument | Type          | Required | Description             | Details                                                              |
| -------- | ------------- | -------- | ----------------------- | -------------------------------------------------------------------- |
| type     | [Enum](#Enum) | Yes      | 顯示的圖表類型          | Use one of the following values: `joins`, `joinsAndLeaves`, `leaves` |
| from     | [Date](#Date) | No       | Start date of the chart |                                                                      |
| to       | [Date](#Date) | No       | End date of the chart   |                                                                      |

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

顯示幫助

### Usage

```text
!help [command]
```

### Arguments

| Argument | Type                | Required | Description                                  | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------- | ------------------- | -------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command  | [Command](#Command) | No       | The command to get detailed information for. | Use one of the following values: `addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lockdown`, `lyrics`, `mashup`, `memberConfig`, `members`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |

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

Interactive Config

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
!leaderboard [page]
```

### Aliases

- `!top`

### Arguments

| Argument | Type              | Required | Description                           | Details |
| -------- | ----------------- | -------- | ------------------------------------- | ------- |
| page     | [Number](#Number) | No       | Which page of the leaderboard to get. |         |

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

<a name='lockdown'></a>

---

## !lockdown

Lockdown a specific channel (Prevents anyone without special roles from sending messages)

### Usage

```text
!lockdown [-t value|--timeout=value] [channel]
```

### Arguments

| Argument | Type                | Required | Description                             | Details |
| -------- | ------------------- | -------- | --------------------------------------- | ------- |
| channel  | [Channel](#Channel) | No       | The channel that you want to lock down. |         |

### Flags

| Flag                    | Short     | Type                  | Description                                                                                                  |
| ----------------------- | --------- | --------------------- | ------------------------------------------------------------------------------------------------------------ |
| &#x2011;&#x2011;timeout | &#x2011;t | [Duration](#Duration) | The timeout after which the lockdown automatically ends. Run the command again to end the lockdown manually. |

### Examples

```text
!lockdown
```

<a name='lyrics'></a>

---

## !lyrics

Show lyrics of the currently playing song.

### Usage

```text
!lyrics [-l|--live]
```

### Flags

| Flag                 | Short     | Type                | Description                                                          |
| -------------------- | --------- | ------------------- | -------------------------------------------------------------------- |
| &#x2011;&#x2011;live | &#x2011;l | [Boolean](#Boolean) | If set, then the lyrics will sync with the current time of the song. |

### Examples

```text
!lyrics
```

<a name='mashup'></a>

---

## !mashup

Create a mashup of 2 songs.

### Usage

```text
!mashup <videos>
```

### Arguments

| Argument | Type          | Required | Description                                | Details |
| -------- | ------------- | -------- | ------------------------------------------ | ------- |
| videos   | [Text](#Text) | Yes      | The videos that should be mashed together. |         |

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

<a name='mute'></a>

---

## !mute

Mute a user

### Usage

```text
!mute [-d value|--duration=value] <user> [reason]
```

### Arguments

| Argument | Type              | Required | Description                        | Details |
| -------- | ----------------- | -------- | ---------------------------------- | ------- |
| user     | [Member](#Member) | Yes      | The user that should be muted.     |         |
| reason   | [Text](#Text)     | No       | The reason why this user is muted. |         |

### Flags

| Flag                     | Short     | Type                  | Description                       |
| ------------------------ | --------- | --------------------- | --------------------------------- |
| &#x2011;&#x2011;duration | &#x2011;d | [Duration](#Duration) | The duration to mute the user for |

### Examples

<a name='nowPlaying'></a>

---

## !nowPlaying

Shows information about the currently playing song

### Usage

```text
!nowPlaying [-p|--pin]
```

### Aliases

- `!np`
- `!now-playing`

### Flags

| Flag                | Short     | Type                | Description                                                                        |
| ------------------- | --------- | ------------------- | ---------------------------------------------------------------------------------- |
| &#x2011;&#x2011;pin | &#x2011;p | [Boolean](#Boolean) | Pin the now playing message and update it automatically whenever a new song plays. |

### Examples

```text
!nowPlaying
```

<a name='pause'></a>

---

## !pause

Pause the current song.

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

| Argument | Type                | Required | Description                                                       | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------- | ------------------- | -------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cmd      | [Command](#Command) | No       | The command to configure permissions for.                         | Use one of the following values: `addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lockdown`, `lyrics`, `mashup`, `memberConfig`, `members`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |
| role     | [Role](#Role)       | No       | The role which should be granted or denied access to the command. |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

### Examples

```text
!permissions
```

<a name='ping'></a>

---

## !ping

Ping the bot

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

Play the song if the queue is empty, otherwise it will add the song to the end of the queue.

### Usage

```text
!play [-p value|--platform=value] [-n|--next] <link>
```

### Aliases

- `!p`

### Arguments

| Argument | Type          | Required | Description                                   | Details |
| -------- | ------------- | -------- | --------------------------------------------- | ------- |
| link     | [Text](#Text) | Yes      | The link to a specific song or a search term. |         |

### Flags

| Flag                     | Short     | Type                | Description                                                                       |
| ------------------------ | --------- | ------------------- | --------------------------------------------------------------------------------- |
| &#x2011;&#x2011;platform | &#x2011;p | [Enum](#Enum)       | Select the platform where you want the song to be played.                         |
| &#x2011;&#x2011;next     | &#x2011;n | [Boolean](#Boolean) | If set, it will play this song next instead of adding it to the end of the queue. |

### Examples

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
| user     | [User](#User)     | No       | User whose messages are deleted.     |         |

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

Display the songs in the queue.

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

| Argument | Type              | Required | Description                         | Details |
| -------- | ----------------- | -------- | ----------------------------------- | ------- |
| page     | [Number](#Number) | No       | The page of the ranks list to show. |         |

### Examples

```text
!ranks
```

<a name='removeInvites'></a>

---

## !removeInvites

Removes a specified amount of invites from a user.

### Usage

```text
!removeInvites <user> <amount> [reason]
```

### Aliases

- `!remove-invites`

### Arguments

| Argument | Type              | Required | Description                          | Details |
| -------- | ----------------- | -------- | ------------------------------------ | ------- |
| user     | [User](#User)     | Yes      | The user to remove the invites from. |         |
| amount   | [Number](#Number) | Yes      | The amount of invites to remove.     |         |
| reason   | [Text](#Text)     | No       | The reason for removing the invites. |         |

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
!removeRank <rank>
```

### Aliases

- `!remove-rank`

### Arguments

| Argument | Type          | Required | Description                                | Details |
| -------- | ------------- | -------- | ------------------------------------------ | ------- |
| rank     | [Role](#Role) | Yes      | The for which you want to remove the rank. |         |

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

Set the song to be played on repeat.

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

Resume the current song.

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

Rewind the song and start from the beginning.

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

Search for the search term and let you chose one of the results.

### Usage

```text
!search [-p value|--platform=value] <search>
```

### Arguments

| Argument | Type          | Required | Description     | Details |
| -------- | ------------- | -------- | --------------- | ------- |
| search   | [Text](#Text) | Yes      | The search term |         |

### Flags

| Flag                     | Short     | Type          | Description                                               |
| ------------------------ | --------- | ------------- | --------------------------------------------------------- |
| &#x2011;&#x2011;platform | &#x2011;p | [Enum](#Enum) | Select the platform where you want the song to be played. |

### Examples

<a name='seek'></a>

---

## !seek

Skip to a specific part of the song.

### Usage

```text
!seek [duration]
```

### Arguments

| Argument | Type              | Required | Description                                                                | Details |
| -------- | ----------------- | -------- | -------------------------------------------------------------------------- | ------- |
| duration | [Number](#Number) | No       | The position the song will be skipped to (from the beginning, in seconds). |         |

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

Skip the current song and play the next song in the queue.

### Usage

```text
!skip [amount]
```

### Aliases

- `!next`

### Arguments

| Argument | Type              | Required | Description                     | Details |
| -------- | ----------------- | -------- | ------------------------------- | ------- |
| amount   | [Number](#Number) | No       | How many songs will be skipped. |         |

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

| Flag                              | Short     | Type              | Description                                        |
| --------------------------------- | --------- | ----------------- | -------------------------------------------------- |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [Number](#Number) | Delete messages from the user this many days back. |

### Examples

<a name='strike'></a>

---

## !strike

Add strikes to a user

### Usage

```text
!strike <member> <type> <amount>
```

### Arguments

| Argument | Type              | Required | Description                       | Details                                                                                                                                                      |
| -------- | ----------------- | -------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| member   | [Member](#Member) | Yes      | The member receiving the strikes  |                                                                                                                                                              |
| type     | [Enum](#Enum)     | Yes      | The type of the violation         | Use one of the following values: `allCaps`, `duplicateText`, `emojis`, `hoist`, `invites`, `links`, `mentionRoles`, `mentionUsers`, `quickMessages`, `words` |
| amount   | [Number](#Number) | Yes      | The amount of strikes to be added |                                                                                                                                                              |

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

Unban a user

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

Add a character in front of all members with a special character in front of their name, so they will be shown at the end of the member list.

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

Unmute a user

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

Set the volume if an argument is passed, or show the current volume.

### Usage

```text
!volume [volume]
```

### Arguments

| Argument | Type              | Required | Description                          | Details |
| -------- | ----------------- | -------- | ------------------------------------ | ------- |
| volume   | [Number](#Number) | No       | The value the volume will be set to. |         |

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
