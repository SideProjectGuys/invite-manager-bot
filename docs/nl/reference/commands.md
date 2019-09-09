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

resolvers.command.typeInfo

### Text

This arguments expects any text. You can use quotes (`"Text with quotes"`) for text that has spaces.

> If the text is the last argument you don't have to use quotes.

### Date

resolvers.date.typeInfo

### Duration

resolvers.duration.typeInfo

## Overview

### Invites

| Command                           | Description                                               | Usage                                                            |
| --------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------- |
| [addInvites](#addInvites)         | Voeg toe/verwijder invites van een gebruiker.             | !addInvites \<user\> \<amount\> [reason]                         |
| [clearInvites](#clearInvites)     | Verwijder alle invites van de server/een gebruiker        | !clearInvites [-d value\|--date=value][-cb\|--clearbonus] [user] |
| [createInvite](#createInvite)     | Maak unieke invite codes aan.                             | !createInvite \<name\> [channel]                                 |
| [fake](#fake)                     | Help om gebruikers te vinden die proberen vals te spelen. | !fake [page]                                                     |
| [info](#info)                     | Zie informatie over een specifieke gebruiker.             | !info \<user\> [details][page]                                   |
| [inviteCodes](#inviteCodes)       | Krijg een lijst van al jouw invite codes                  | !inviteCodes                                                     |
| [inviteDetails](#inviteDetails)   | Zie details waar je je invites vandaan komen.             | !inviteDetails [user]                                            |
| [invites](#invites)               | Zie persoonlijke invites.                                 | !invites [user]                                                  |
| [leaderboard](#leaderboard)       | Laat de mensen zien met de meeste invites.                | !leaderboard [-c value\|--compare=value][duration] [page]        |
| [removeInvites](#removeInvites)   | cmd.removeInvites.self.description                        | !removeInvites \<user\> \<amount\> [reason]                      |
| [restoreInvites](#restoreInvites) | Zat alle vorige verwijderde invites terug.                | !restoreInvites [user]                                           |
| [subtractFakes](#subtractFakes)   | Verwijder fake invites van alle gebruikers.               | !subtractFakes                                                   |
| [subtractLeaves](#subtractLeaves) | Verwijder leaves voor alle gebruikers.                    | !subtractLeaves                                                  |

### Ranks

| Command                   | Description                   | Usage                                |
| ------------------------- | ----------------------------- | ------------------------------------ |
| [addRank](#addRank)       | Voeg een nieuwe rank toe.     | !addRank \<role\> \<invites\> [info] |
| [fixRanks](#fixRanks)     | cmd.fixRanks.self.description | !fixRanks                            |
| [ranks](#ranks)           | Zie alle ranks.               | !ranks [page]                        |
| [removeRank](#removeRank) | Verwijder een rank.           | !removeRank \<rank\>                 |

### Config

| Command                                 | Description                                                        | Usage                                       |
| --------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------- |
| [botConfig](#botConfig)                 | Zie en verander de configuratie van de bot.                        | !botConfig [key][value]                     |
| [config](#config)                       | Zie en verander de configuratie van de server.                     | !config [key][value]                        |
| [interactiveConfig](#interactiveConfig) | Interactieve Configuratie                                          | !interactiveConfig                          |
| [inviteCodeConfig](#inviteCodeConfig)   | Show and change the config of invite codes of the server.          | !inviteCodeConfig [key][invitecode] [value] |
| [memberConfig](#memberConfig)           | Zie en verander de configuratie van de gebruikers van deze server. | !memberConfig [key][user] [value]           |
| [permissions](#permissions)             | Configure permissions to use commands.                             | !permissions [cmd][role]                    |

### Info

| Command             | Description                                                                                        | Usage           |
| ------------------- | -------------------------------------------------------------------------------------------------- | --------------- |
| [botInfo](#botInfo) | Krijg algemene informatie over deze bot.                                                           | !botInfo        |
| [credits](#credits) | Zie de ontwikkelaars en de mensen die hebben helpen aan de bot.                                    | !credits        |
| [getBot](#getBot)   | Krijg een invite link voor de bot.                                                                 | !getBot         |
| [help](#help)       | Zie help.                                                                                          | !help [command] |
| [members](#members) | Zie de gebruiker aantal van deze server.                                                           | !members        |
| [ping](#ping)       | Ping the bot                                                                                       | !ping           |
| [prefix](#prefix)   | Laat de huidige prefix zien van de bot.                                                            | !prefix         |
| [setup](#setup)     | Help met het opzetten van de bot en het controleren van problemen (Bijvoorbeeld nodige permissies) | !setup          |
| [support](#support) | Krijg een invite link naar onze hulp server.                                                       | !support        |

### Premium

| Command                   | Description                                                               | Usage             |
| ------------------------- | ------------------------------------------------------------------------- | ----------------- |
| [export](#export)         | Exporteer data van InviteManager in een csv bestand.                      | !export \<type\>  |
| [premium](#premium)       | Info about premium version of InviteManager.                              | !premium [action] |
| [tryPremium](#tryPremium) | Try the premium version of InviteManager for free for a limited duration. | !tryPremium       |

### Moderation

| Command                               | Description                                                                                                                                   | Usage                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [ban](#ban)                           | Verban een gebruiker van de server.                                                                                                           | !ban [-d value\|--deleteMessageDays=value] \<user\> [reason]     |
| [caseDelete](#caseDelete)             | Verwijder een specifiek geval.                                                                                                                | !caseDelete \<caseNumber\> [reason]                              |
| [caseView](#caseView)                 | Bekijk meer informatie over een specifiek geval.                                                                                              | !caseView \<caseNumber\>                                         |
| [check](#check)                       | Zie overtredingen en straffen van een gebruiker.                                                                                              | !check \<user\>                                                  |
| [clean](#clean)                       | Maak een kanaal schoon van verschillende soorten berichten.                                                                                   | !clean \<type\> [numberOfMessages]                               |
| [cleanShort](#cleanShort)             | Verwijder korte berichten                                                                                                                     | !cleanShort \<maxTextLength\> [numberOfMessages]                 |
| [cleanText](#cleanText)               | Verwijder berichten die een bepaald woord bevatten.                                                                                           | !cleanText \<text\> [numberOfMessages]                           |
| [kick](#kick)                         | Kick een gebruiker van de server.                                                                                                             | !kick \<member\> [reason]                                        |
| [mute](#mute)                         | Mute a user                                                                                                                                   | !mute \<user\> [reason]                                          |
| [punishmentConfig](#punishmentConfig) | Configure punishments when reaching a certain amount of strikes.                                                                              | !punishmentConfig [punishment][strikes] [args]                   |
| [purge](#purge)                       | Verwijder berichten in een kanaal.                                                                                                            | !purge \<quantity\> [user]                                       |
| [purgeUntil](#purgeUntil)             | Verwijder berichten in een kanaal tot een specifiek aan berichten.                                                                            | !purgeUntil \<messageID\>                                        |
| [softBan](#softBan)                   | Ban en dan unban een gebruiker automatisch van de server.                                                                                     | !softBan [-d value\|--deleteMessageDays=value] \<user\> [reason] |
| [strike](#strike)                     | Add strikes to a user                                                                                                                         | !strike \<member\> \<type\> \<amount\>                           |
| [strikeConfig](#strikeConfig)         | Configureer waarschuwingen die gegeven zijn door vorige straffen.                                                                             | !strikeConfig [violation][strikes]                               |
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

| Command                             | Description                                                           | Usage                      |
| ----------------------------------- | --------------------------------------------------------------------- | -------------------------- |
| [graph](#graph)                     | Laat verschillende soorten grafieken zien van je server statistieken. | !graph \<type\> [duration] |
| [makeMentionable](#makeMentionable) | Make a role mentionable for 60 seconds or until it was used.          | !makeMentionable \<role\>  |
| [mentionRole](#mentionRole)         | Mention an unmentionable role.                                        | !mentionRole \<role\>      |

<a name='addInvites'></a>

---

## !addInvites

Voeg toe/verwijder invites van een gebruiker.

### Usage

```text
!addInvites <user> <amount> [reason]
```

### Aliases

- `!add-invites`

### Arguments

| Argument | Type              | Required | Description                                                                                                | Details |
| -------- | ----------------- | -------- | ---------------------------------------------------------------------------------------------------------- | ------- |
| user     | [User](#User)     | Yes      | De gebruiker die krijgt of verliest de bonus invites.                                                      |         |
| amount   | [Number](#Number) | Yes      | De hoeveelheid invites dat de gebruiker krijgt / verliest. Gebruik de (-) teken om invites te verwijderen. |         |
| reason   | [Text](#Text)     | No       | De reden om invites toe te voegen of te verwijderen.                                                       |         |

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

Voeg een nieuwe rank toe.

### Usage

```text
!addRank <role> <invites> [info]
```

### Aliases

- `!add-rank`
- `!set-rank`
- `!setrank`

### Arguments

| Argument | Type              | Required | Description                                                             | Details |
| -------- | ----------------- | -------- | ----------------------------------------------------------------------- | ------- |
| role     | [Role](#Role)     | Yes      | De role die de gebruiker krijgt bij het bereiken van deze rank.         |         |
| invites  | [Number](#Number) | Yes      | De hoeveelheid invites nodig om de rank te krijgen.                     |         |
| info     | [Text](#Text)     | No       | Een beschrijving zodat gebruikers meer krijgen te weten over deze rank. |         |

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

Verban een gebruiker van de server.

### Usage

```text
!ban [-d value|--deleteMessageDays=value] <user> [reason]
```

### Arguments

| Argument | Type          | Required | Description                        | Details |
| -------- | ------------- | -------- | ---------------------------------- | ------- |
| user     | [User](#User) | Yes      | Gebruiker om te verbannen.         |         |
| reason   | [Text](#Text) | No       | Waarom de gebruiker was verbannen. |         |

### Flags

| Flag                              | Short     | Type              | Description                          |
| --------------------------------- | --------- | ----------------- | ------------------------------------ |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [Number](#Number) | cmd.ban.self.flags.deleteMessageDays |

### Examples

<a name='botConfig'></a>

---

## !botConfig

Zie en verander de configuratie van de bot.

### Usage

```text
!botConfig [key] [value]
```

### Aliases

- `!bot-config`
- `!botsetting`
- `!bot-setting`

### Arguments

| Argument | Type            | Required | Description                                                 | Details                                                                                                                                     |
| -------- | --------------- | -------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| key      | [Enum](#Enum)   | No       | De bot configuratie instelling die je wilt zien/veranderen. | Use one of the following values: `activityEnabled`, `activityMessage`, `activityStatus`, `activityType`, `activityUrl`, `embedDefaultColor` |
| value    | [Value](#Value) | No       | De nieuwe waarde van de setting.                            |                                                                                                                                             |

### Examples

```text
!botConfig
```

<a name='botInfo'></a>

---

## !botInfo

Krijg algemene informatie over deze bot.

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

Verwijder een specifiek geval.

### Usage

```text
!caseDelete <caseNumber> [reason]
```

### Aliases

- `!case-delete`
- `!deletecase`
- `!delete-case`

### Arguments

| Argument   | Type              | Required | Description                                  | Details |
| ---------- | ----------------- | -------- | -------------------------------------------- | ------- |
| caseNumber | [Number](#Number) | Yes      | Case nummer                                  |         |
| reason     | [Text](#Text)     | No       | De reden voor het verwijderen van het geval. |         |

### Examples

```text
!caseDelete 5434 User apologized
```

<a name='caseView'></a>

---

## !caseView

Bekijk meer informatie over een specifiek geval.

### Usage

```text
!caseView <caseNumber>
```

### Aliases

- `!case-view`
- `!viewcase`
- `!view-case`

### Arguments

| Argument   | Type              | Required | Description  | Details |
| ---------- | ----------------- | -------- | ------------ | ------- |
| caseNumber | [Number](#Number) | Yes      | Geval nummer |         |

### Examples

```text
!caseView 5434
```

<a name='check'></a>

---

## !check

Zie overtredingen en straffen van een gebruiker.

### Usage

```text
!check <user>
```

### Aliases

- `!history`

### Arguments

| Argument | Type          | Required | Description              | Details |
| -------- | ------------- | -------- | ------------------------ | ------- |
| user     | [User](#User) | Yes      | Gebruiker om te checken. |         |

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

Maak een kanaal schoon van verschillende soorten berichten.

### Usage

```text
!clean <type> [numberOfMessages]
```

### Aliases

- `!clear`

### Arguments

| Argument         | Type              | Required | Description                              | Details                                                                                                            |
| ---------------- | ----------------- | -------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| type             | [Enum](#Enum)     | Yes      | Het type bericht dat wordt verwijdert.   | Use one of the following values: `bots`, `embeds`, `emojis`, `images`, `links`, `mentions`, `reacted`, `reactions` |
| numberOfMessages | [Number](#Number) | No       | Hoeveelheid berichten dat wordt gezocht. |                                                                                                                    |

### Examples

<a name='cleanShort'></a>

---

## !cleanShort

Verwijder korte berichten

### Usage

```text
!cleanShort <maxTextLength> [numberOfMessages]
```

### Aliases

- `!clean-short`
- `!clearshort`
- `!clear-short`

### Arguments

| Argument         | Type              | Required | Description                                                | Details |
| ---------------- | ----------------- | -------- | ---------------------------------------------------------- | ------- |
| maxTextLength    | [Number](#Number) | Yes      | Alle berichten die korter zijn dan deze worden verwijderd. |         |
| numberOfMessages | [Number](#Number) | No       | Aantal berichten die worden gezocht.                       |         |

### Examples

<a name='cleanText'></a>

---

## !cleanText

Verwijder berichten die een bepaald woord bevatten.

### Usage

```text
!cleanText <text> [numberOfMessages]
```

### Aliases

- `!clean-text`
- `!cleartext`
- `!clear-text`

### Arguments

| Argument         | Type              | Required | Description                                     | Details |
| ---------------- | ----------------- | -------- | ----------------------------------------------- | ------- |
| text             | [Text](#Text)     | Yes      | Alle berichten met die woord worden verwijdert. |         |
| numberOfMessages | [Number](#Number) | No       | Aantal berichten die worden gezocht.            |         |

### Examples

<a name='clearInvites'></a>

---

## !clearInvites

Verwijder alle invites van de server/een gebruiker

### Usage

```text
!clearInvites [-d value|--date=value] [-cb|--clearBonus] [user]
```

### Aliases

- `!clear-invites`

### Arguments

| Argument | Type          | Required | Description                                                                                                        | Details |
| -------- | ------------- | -------- | ------------------------------------------------------------------------------------------------------------------ | ------- |
| user     | [User](#User) | No       | De gebruiker waar alle invites worden verwijdert. Wanneer dit wordt weggelaten, worden alle gebruikers verwijdert. |         |

### Flags

| Flag                       | Short      | Type                | Description                            |
| -------------------------- | ---------- | ------------------- | -------------------------------------- |
| &#x2011;&#x2011;date       | &#x2011;d  | [Date](#Date)       | cmd.clearInvites.self.flags.date       |
| &#x2011;&#x2011;clearBonus | &#x2011;cb | [Boolean](#Boolean) | cmd.clearInvites.self.flags.clearBonus |

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

Zie en verander de configuratie van de server.

### Usage

```text
!config [key] [value]
```

### Aliases

- `!c`

### Arguments

| Argument | Type            | Required | Description                                             | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------- | --------------- | -------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| key      | [Enum](#Enum)   | No       | De configuratie instelling die je wilt zien/veranderen. | Use one of the following values: `announcementVoice`, `announceNextSong`, `autoModAllCapsEnabled`, `autoModAllCapsMinCharacters`, `autoModAllCapsPercentageCaps`, `autoModDeleteBotMessage`, `autoModDeleteBotMessageTimeoutInSeconds`, `autoModDisabledForOldMembers`, `autoModDisabledForOldMembersThreshold`, `autoModDuplicateTextEnabled`, `autoModDuplicateTextTimeframeInSeconds`, `autoModEmojisEnabled`, `autoModEmojisMaxNumberOfEmojis`, `autoModEnabled`, `autoModHoistEnabled`, `autoModIgnoredChannels`, `autoModIgnoredRoles`, `autoModInvitesEnabled`, `autoModLinksBlacklist`, `autoModLinksEnabled`, `autoModLinksFollowRedirects`, `autoModLinksWhitelist`, `autoModLogEnabled`, `autoModMentionRolesEnabled`, `autoModMentionRolesMaxNumberOfMentions`, `autoModMentionUsersEnabled`, `autoModMentionUsersMaxNumberOfMentions`, `autoModModeratedChannels`, `autoModModeratedRoles`, `autoModQuickMessagesEnabled`, `autoModQuickMessagesNumberOfMessages`, `autoModQuickMessagesTimeframeInSeconds`, `autoModWordsBlacklist`, `autoModWordsEnabled`, `autoSubtractFakes`, `autoSubtractLeaves`, `autoSubtractLeaveThreshold`, `captchaVerificationFailedMessage`, `captchaVerificationLogEnabled`, `captchaVerificationOnJoin`, `captchaVerificationSuccessMessage`, `captchaVerificationTimeout`, `captchaVerificationWelcomeMessage`, `channels`, `fadeMusicEndDelay`, `fadeMusicOnTalk`, `getUpdates`, `hideLeftMembersFromLeaderboard`, `ignoredChannels`, `joinMessage`, `joinMessageChannel`, `lang`, `leaderboardStyle`, `leaveMessage`, `leaveMessageChannel`, `logChannel`, `modLogChannel`, `modPunishmentBanDeleteMessage`, `modPunishmentKickDeleteMessage`, `modPunishmentMuteDeleteMessage`, `modPunishmentSoftbanDeleteMessage`, `modPunishmentWarnDeleteMessage`, `musicVolume`, `mutedRole`, `prefix`, `rankAnnouncementChannel`, `rankAnnouncementMessage`, `rankAssignmentStyle` |
| value    | [Value](#Value) | No       | De nieuwe waarde van de instelling.                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

### Examples

```text
!config
```

<a name='createInvite'></a>

---

## !createInvite

Maak unieke invite codes aan.

### Usage

```text
!createInvite <name> [channel]
```

### Aliases

- `!create-invite`

### Arguments

| Argument | Type                | Required | Description                                                                                  | Details |
| -------- | ------------------- | -------- | -------------------------------------------------------------------------------------------- | ------- |
| name     | [Text](#Text)       | Yes      | De naam van de invite code.                                                                  |         |
| channel  | [Channel](#Channel) | No       | De kanaal waarvoor de invite code is aangemaakt. De huidige kanaal wordt standaard gebruikt. |         |

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

Zie de ontwikkelaars en de mensen die hebben helpen aan de bot.

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

Exporteer data van InviteManager in een csv bestand.

### Usage

```text
!export <type>
```

### Arguments

| Argument | Type          | Required | Description                 | Details                                        |
| -------- | ------------- | -------- | --------------------------- | ---------------------------------------------- |
| type     | [Enum](#Enum) | Yes      | De type export wat je wilt. | Use one of the following values: `leaderboard` |

### Examples

```text
!export leaderboard
```

<a name='fake'></a>

---

## !fake

Help om gebruikers te vinden die proberen vals te spelen.

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

| Argument | Type              | Required | Description                             | Details |
| -------- | ----------------- | -------- | --------------------------------------- | ------- |
| page     | [Number](#Number) | No       | Welke pagina van de fake te verkrijgen. |         |

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

Krijg een invite link voor de bot.

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

Laat verschillende soorten grafieken zien van je server statistieken.

### Usage

```text
!graph <type> [duration]
```

### Aliases

- `!g`
- `!chart`

### Arguments

| Argument | Type                  | Required | Description                  | Details                                                     |
| -------- | --------------------- | -------- | ---------------------------- | ----------------------------------------------------------- |
| type     | [Enum](#Enum)         | Yes      | De type grafiek om te zien.  | Use one of the following values: `joins`, `leaves`, `usage` |
| duration | [Duration](#Duration) | No       | De tijdsduur voor de grafiek |                                                             |

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

Zie help.

### Usage

```text
!help [command]
```

### Arguments

| Argument | Type                | Required | Description                                          | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------- | ------------------- | -------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command  | [Command](#Command) | No       | De commando om gedetailleerde informatie te krijgen. | Use one of the following values: `addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fake`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lyrics`, `makeMentionable`, `mashup`, `memberConfig`, `members`, `mentionRole`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |

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

Zie informatie over een specifieke gebruiker.

### Usage

```text
!info <user> [details] [page]
```

### Aliases

- `!showinfo`

### Arguments

| Argument | Type              | Required | Description                                                                                     | Details                                             |
| -------- | ----------------- | -------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| user     | [User](#User)     | Yes      | De gebruiker van wie je de toegevoegde informatie wilt zien.                                    |                                                     |
| details  | [Enum](#Enum)     | No       | Vraag alleen specifieke details aan van een gebruiker.                                          | Use one of the following values: `bonus`, `members` |
| page     | [Number](#Number) | No       | Welke pagina van de detail om te laten zien. Je kan ook de reactions gebruiken om te navigeren. |                                                     |

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

Interactieve Configuratie

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

Krijg een lijst van al jouw invite codes

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

Zie details waar je je invites vandaan komen.

### Usage

```text
!inviteDetails [user]
```

### Aliases

- `!invite-details`

### Arguments

| Argument | Type          | Required | Description                                                 | Details |
| -------- | ------------- | -------- | ----------------------------------------------------------- | ------- |
| user     | [User](#User) | No       | De gebruiker van wie je de invites gedetailleerd wilt zien. |         |

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

Zie persoonlijke invites.

### Usage

```text
!invites [user]
```

### Aliases

- `!invite`
- `!rank`

### Arguments

| Argument | Type          | Required | Description                                   | Details |
| -------- | ------------- | -------- | --------------------------------------------- | ------- |
| user     | [User](#User) | No       | De gebruiker van wie je de invites wilt zien. |         |

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

Kick een gebruiker van de server.

### Usage

```text
!kick <member> [reason]
```

### Arguments

| Argument | Type              | Required | Description                      | Details |
| -------- | ----------------- | -------- | -------------------------------- | ------- |
| member   | [Member](#Member) | Yes      | Gebruiker om te kicken.          |         |
| reason   | [Text](#Text)     | No       | Waarom de gebruiker is gekicked. |         |

### Examples

<a name='leaderboard'></a>

---

## !leaderboard

Laat de mensen zien met de meeste invites.

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
| page     | [Number](#Number)     | No       | Welke pagina van de leaderboard om te krijgen.       |         |

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

Zie en verander de configuratie van de gebruikers van deze server.

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
| user     | [User](#User)   | No       | De gebruiker waar de setting voor is.                    |                                                        |
| value    | [Value](#Value) | No       | De nieuwe waarde van de setting.                         |                                                        |

### Examples

```text
!memberConfig
```

<a name='members'></a>

---

## !members

Zie de gebruiker aantal van deze server.

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

Mute a user

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

| Argument | Type                | Required | Description                                                       | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------- | ------------------- | -------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cmd      | [Command](#Command) | No       | The command to configure permissions for.                         | Use one of the following values: `addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fake`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lyrics`, `makeMentionable`, `mashup`, `memberConfig`, `members`, `mentionRole`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |
| role     | [Role](#Role)       | No       | The role which should be granted or denied access to the command. |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

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

Laat de huidige prefix zien van de bot.

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

| Argument   | Type              | Required | Description                                           | Details                                                                   |
| ---------- | ----------------- | -------- | ----------------------------------------------------- | ------------------------------------------------------------------------- |
| punishment | [Enum](#Enum)     | No       | Straf type om te gebruiken.                           | Use one of the following values: `ban`, `kick`, `mute`, `softban`, `warn` |
| strikes    | [Number](#Number) | No       | Waarschuwing aantal voor deze straf mom te gebruiken. |                                                                           |
| args       | [Text](#Text)     | No       | Arguments passed to the punishment.                   |                                                                           |

### Examples

```text
!punishmentConfig
```

<a name='purge'></a>

---

## !purge

Verwijder berichten in een kanaal.

### Usage

```text
!purge <quantity> [user]
```

### Aliases

- `!prune`

### Arguments

| Argument | Type              | Required | Description                                    | Details |
| -------- | ----------------- | -------- | ---------------------------------------------- | ------- |
| quantity | [Number](#Number) | Yes      | Hoeveel berichten er verwijdert zullen worden. |         |
| user     | [User](#User)     | No       | cmd.purge.self.args.user                       |         |

### Examples

<a name='purgeUntil'></a>

---

## !purgeUntil

Verwijder berichten in een kanaal tot een specifiek aan berichten.

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

| Argument  | Type          | Required | Description                           | Details |
| --------- | ------------- | -------- | ------------------------------------- | ------- |
| messageID | [Text](#Text) | Yes      | Laatste bericht ID om te verwijderen. |         |

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

Zie alle ranks.

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

Verwijder een rank.

### Usage

```text
!removeRank <rank>
```

### Aliases

- `!remove-rank`

### Arguments

| Argument | Type          | Required | Description                           | Details |
| -------- | ------------- | -------- | ------------------------------------- | ------- |
| rank     | [Role](#Role) | Yes      | Voor wie je de rank wilt verwijderen. |         |

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

Zat alle vorige verwijderde invites terug.

### Usage

```text
!restoreInvites [user]
```

### Aliases

- `!restore-invites`
- `!unclear-invites`
- `!unclearinvites`

### Arguments

| Argument | Type          | Required | Description                                                                                                    | Details |
| -------- | ------------- | -------- | -------------------------------------------------------------------------------------------------------------- | ------- |
| user     | [User](#User) | No       | De gebruiker om alle invites terug te zetten. Wanneer leeg gelaten worden de invites van iedereen terug gezet. |         |

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

Help met het opzetten van de bot en het controleren van problemen (Bijvoorbeeld nodige permissies)

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

Ban en dan unban een gebruiker automatisch van de server.

### Usage

```text
!softBan [-d value|--deleteMessageDays=value] <user> [reason]
```

### Aliases

- `!soft-ban`

### Arguments

| Argument | Type              | Required | Description                        | Details |
| -------- | ----------------- | -------- | ---------------------------------- | ------- |
| user     | [Member](#Member) | Yes      | Gebruiker om te verbannen.         |         |
| reason   | [Text](#Text)     | No       | Waarom de gebruiker was verbannen. |         |

### Flags

| Flag                              | Short     | Type              | Description                              |
| --------------------------------- | --------- | ----------------- | ---------------------------------------- |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [Number](#Number) | cmd.softBan.self.flags.deleteMessageDays |

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

Configureer waarschuwingen die gegeven zijn door vorige straffen.

### Usage

```text
!strikeConfig [violation] [strikes]
```

### Aliases

- `!strike-config`

### Arguments

| Argument  | Type              | Required | Description            | Details                                                                                                                                                      |
| --------- | ----------------- | -------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| violation | [Enum](#Enum)     | No       | Straf type.            | Use one of the following values: `allCaps`, `duplicateText`, `emojis`, `hoist`, `invites`, `links`, `mentionRoles`, `mentionUsers`, `quickMessages`, `words` |
| strikes   | [Number](#Number) | No       | Aantal waarschuwingen. |                                                                                                                                                              |

### Examples

```text
!strikeConfig
```

<a name='subtractFakes'></a>

---

## !subtractFakes

Verwijder fake invites van alle gebruikers.

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

Verwijder leaves voor alle gebruikers.

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

Krijg een invite link naar onze hulp server.

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
