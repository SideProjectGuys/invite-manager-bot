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
| [addInvites](#addInvites)         | Voeg toe/verwijder invites van een gebruiker.      | !addInvites \<user\> \<amount\> [reason]                         |
| [clearInvites](#clearInvites)     | Verwijder alle invites van de server/een gebruiker | !clearInvites [-d value\|--date=value][-cb\|--clearbonus] [user] |
| [createInvite](#createInvite)     | Maak unieke invite codes aan.                      | !createInvite \<name\> [channel]                                 |
| [info](#info)                     | Zie informatie over een specifieke gebruiker.      | !info \<user\> [details][page]                                   |
| [inviteCodes](#inviteCodes)       | Krijg een lijst van al jouw invite codes           | !inviteCodes                                                     |
| [inviteDetails](#inviteDetails)   | Zie details waar je je invites vandaan komen.      | !inviteDetails [user]                                            |
| [invites](#invites)               | Zie persoonlijke invites.                          | !invites [user]                                                  |
| [leaderboard](#leaderboard)       | Laat de mensen zien met de meeste invites.         | !leaderboard [page]                                              |
| [removeInvites](#removeInvites)   | Removes a specified amount of invites from a user. | !removeInvites \<user\> \<amount\> [reason]                      |
| [restoreInvites](#restoreInvites) | Zat alle vorige verwijderde invites terug.         | !restoreInvites [user]                                           |
| [subtractFakes](#subtractFakes)   | Verwijder fake invites van alle gebruikers.        | !subtractFakes                                                   |
| [subtractLeaves](#subtractLeaves) | Verwijder leaves voor alle gebruikers.             | !subtractLeaves                                                  |

### Ranks

| Command                   | Description                                   | Usage                                |
| ------------------------- | --------------------------------------------- | ------------------------------------ |
| [addRank](#addRank)       | Voeg een nieuwe rank toe.                     | !addRank \<role\> \<invites\> [info] |
| [fixRanks](#fixRanks)     | Deletes any ranks where the role was deleted. | !fixRanks                            |
| [ranks](#ranks)           | Zie alle ranks.                               | !ranks [page]                        |
| [removeRank](#removeRank) | Verwijder een rank.                           | !removeRank \<rank\>                 |

### Config

| Command                                 | Description                                                        | Usage                                       |
| --------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------- |
| [botConfig](#botConfig)                 | Zie en verander de configuratie van de bot.                        | !botConfig [key][value]                     |
| [config](#config)                       | Zie en verander de configuratie van de server.                     | !config [key][value]                        |
| [interactiveConfig](#interactiveConfig) | Interactieve Configuratie                                          | !interactiveConfig                          |
| [inviteCodeConfig](#inviteCodeConfig)   | Zie en verander de configuratie van de invite codes van de server. | !inviteCodeConfig [key][invitecode] [value] |
| [memberConfig](#memberConfig)           | Zie en verander de configuratie van de gebruikers van deze server. | !memberConfig [key][user] [value]           |
| [permissions](#permissions)             | Configureer permissies om commando's te gebruiken.                 | !permissions [cmd][role]                    |

### Info

| Command             | Description                                                                                        | Usage           |
| ------------------- | -------------------------------------------------------------------------------------------------- | --------------- |
| [botInfo](#botInfo) | Krijg algemene informatie over deze bot.                                                           | !botInfo        |
| [credits](#credits) | Zie de ontwikkelaars en de mensen die hebben helpen aan de bot.                                    | !credits        |
| [getBot](#getBot)   | Krijg een invite link voor de bot.                                                                 | !getBot         |
| [help](#help)       | Zie help.                                                                                          | !help [command] |
| [members](#members) | Zie de gebruiker aantal van deze server.                                                           | !members        |
| [ping](#ping)       | Mention de bot                                                                                     | !ping           |
| [prefix](#prefix)   | Laat de huidige prefix zien van de bot.                                                            | !prefix         |
| [setup](#setup)     | Help met het opzetten van de bot en het controleren van problemen (Bijvoorbeeld nodige permissies) | !setup          |
| [support](#support) | Krijg een invite link naar onze hulp server.                                                       | !support        |

### Premium

| Command                   | Description                                                                 | Usage             |
| ------------------------- | --------------------------------------------------------------------------- | ----------------- |
| [export](#export)         | Exporteer data van InviteManager in een csv bestand.                        | !export \<type\>  |
| [premium](#premium)       | Informatie over de betaalde versie van InviteManager.                       | !premium [action] |
| [tryPremium](#tryPremium) | Probeer de betaalde versie van InviteManager gratis voor een bepaalde tijd. | !tryPremium       |

### Moderation

| Command                               | Description                                                                                                                                                       | Usage                                                            |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [ban](#ban)                           | Verban een gebruiker van de server.                                                                                                                               | !ban [-d value\|--deleteMessageDays=value] \<user\> [reason]     |
| [caseDelete](#caseDelete)             | Verwijder een specifiek geval.                                                                                                                                    | !caseDelete \<caseNumber\> [reason]                              |
| [caseView](#caseView)                 | Bekijk meer informatie over een specifiek geval.                                                                                                                  | !caseView \<caseNumber\>                                         |
| [check](#check)                       | Zie overtredingen en straffen van een gebruiker.                                                                                                                  | !check \<user\>                                                  |
| [clean](#clean)                       | Maak een kanaal schoon van verschillende soorten berichten.                                                                                                       | !clean \<type\> [numberOfMessages]                               |
| [cleanShort](#cleanShort)             | Verwijder korte berichten                                                                                                                                         | !cleanShort \<maxTextLength\> [numberOfMessages]                 |
| [cleanText](#cleanText)               | Verwijder berichten die een bepaald woord bevatten.                                                                                                               | !cleanText \<text\> [numberOfMessages]                           |
| [kick](#kick)                         | Kick een gebruiker van de server.                                                                                                                                 | !kick \<member\> [reason]                                        |
| [lockdown](#lockdown)                 | Lockdown a specific channel (Prevents anyone without special roles from sending messages)                                                                         | !lockdown [-t value\|--timeout=value][channel]                   |
| [mute](#mute)                         | Mute een gebruiker                                                                                                                                                | !mute [-d value\|--duration=value] \<user\> [reason]             |
| [punishmentConfig](#punishmentConfig) | Configure punishments when reaching a certain amount of strikes.                                                                                                  | !punishmentConfig [punishment][strikes] [args]                   |
| [purge](#purge)                       | Verwijder berichten in een kanaal.                                                                                                                                | !purge \<quantity\> [user]                                       |
| [purgeUntil](#purgeUntil)             | Verwijder berichten in een kanaal tot een specifiek aan berichten.                                                                                                | !purgeUntil \<messageID\>                                        |
| [softBan](#softBan)                   | Ban en dan unban een gebruiker automatisch van de server.                                                                                                         | !softBan [-d value\|--deleteMessageDays=value] \<user\> [reason] |
| [strike](#strike)                     | Add strikes to a user                                                                                                                                             | !strike \<member\> \<type\> \<amount\>                           |
| [strikeConfig](#strikeConfig)         | Configureer waarschuwingen die gegeven zijn door vorige straffen.                                                                                                 | !strikeConfig [violation][strikes]                               |
| [unban](#unban)                       | Unban een gebruiker                                                                                                                                               | !unban \<user\> [reason]                                         |
| [unhoist](#unhoist)                   | Voeg een character toe in het begin van alle gebruikers met een speciale character in het begin van hun naam, dan komen zij onderaan de gebruiker lijst te staan. | !unhoist                                                         |
| [unmute](#unmute)                     | Unmute een gebruiker                                                                                                                                              | !unmute \<user\>                                                 |
| [warn](#warn)                         | Waarschuw een gebruikt.                                                                                                                                           | !warn \<member\> [reason]                                        |

### Music

| Command                   | Description                                                                                                 | Usage                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [disconnect](#disconnect) | Laat de bot de huidige spraakkanaal verlaten.                                                               | !disconnect                                             |
| [lyrics](#lyrics)         | Show lyrics of the currently playing song.                                                                  | !lyrics [-l\|--live]                                    |
| [mashup](#mashup)         | Create a mashup of 2 songs.                                                                                 | !mashup \<videos\>                                      |
| [nowPlaying](#nowPlaying) | Laat informatie zien over het huidige muziek                                                                | !nowPlaying [-p\|--pin]                                 |
| [pause](#pause)           | Zet het huidige muziek op pauze.                                                                            | !pause                                                  |
| [play](#play)             | Speel het muziek als de wachtrij leeg is, anders wordt het muziek toegevoegd aan het einde van de wachtrij. | !play [-p value\|--platform=value][-n\|--next] \<link\> |
| [queue](#queue)           | Laat de muziek in de wachtrij zien.                                                                         | !queue                                                  |
| [repeat](#repeat)         | Zet de muziek op herhaaldelijk afspelen.                                                                    | !repeat                                                 |
| [resume](#resume)         | Hervat de muziek muziek.                                                                                    | !resume                                                 |
| [rewind](#rewind)         | Laat het nummer opnieuw afspelen.                                                                           | !rewind                                                 |
| [search](#search)         | Zoek voor iets en laat je 1 van de resultaten kiezen.                                                       | !search [-p value\|--platform=value] \<search\>         |
| [seek](#seek)             | Spoel verder naar een bepaald stuk van de muziek.                                                           | !seek [duration]                                        |
| [skip](#skip)             | Skip the current song and play the next song in the queue.                                                  | !skip [amount]                                          |
| [volume](#volume)         | Set the volume if an argument is passed, or show the current volume.                                        | !volume [volume]                                        |

### Other

| Command         | Description                                                           | Usage                      |
| --------------- | --------------------------------------------------------------------- | -------------------------- |
| [graph](#graph) | Laat verschillende soorten grafieken zien van je server statistieken. | !graph \<type\> [from][to] |

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

| Flag                              | Short     | Type              | Description                                                                  |
| --------------------------------- | --------- | ----------------- | ---------------------------------------------------------------------------- |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [Number](#Number) | Als dit opgegeven is, worden de berichten van de opgegeven dagen verwijderd. |

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

| Argument | Type            | Required | Description                                             | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------- | --------------- | -------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key      | [Enum](#Enum)   | No       | De configuratie instelling die je wilt zien/veranderen. | Use one of the following values: `announcementVoice`, `announceNextSong`, `autoModAllCapsEnabled`, `autoModAllCapsMinCharacters`, `autoModAllCapsPercentageCaps`, `autoModDeleteBotMessage`, `autoModDeleteBotMessageTimeoutInSeconds`, `autoModDisabledForOldMembers`, `autoModDisabledForOldMembersThreshold`, `autoModDuplicateTextEnabled`, `autoModDuplicateTextTimeframeInSeconds`, `autoModEmojisEnabled`, `autoModEmojisMaxNumberOfEmojis`, `autoModEnabled`, `autoModHoistEnabled`, `autoModIgnoredChannels`, `autoModIgnoredRoles`, `autoModInvitesEnabled`, `autoModLinksBlacklist`, `autoModLinksEnabled`, `autoModLinksFollowRedirects`, `autoModLinksWhitelist`, `autoModLogEnabled`, `autoModMentionRolesEnabled`, `autoModMentionRolesMaxNumberOfMentions`, `autoModMentionUsersEnabled`, `autoModMentionUsersMaxNumberOfMentions`, `autoModModeratedChannels`, `autoModModeratedRoles`, `autoModQuickMessagesEnabled`, `autoModQuickMessagesNumberOfMessages`, `autoModQuickMessagesTimeframeInSeconds`, `autoModWordsBlacklist`, `autoModWordsEnabled`, `autoSubtractFakes`, `autoSubtractLeaves`, `autoSubtractLeaveThreshold`, `captchaVerificationFailedMessage`, `captchaVerificationLogEnabled`, `captchaVerificationOnJoin`, `captchaVerificationSuccessMessage`, `captchaVerificationTimeout`, `captchaVerificationWelcomeMessage`, `channels`, `defaultMusicPlatform`, `disabledMusicPlatforms`, `fadeMusicEndDelay`, `fadeMusicOnTalk`, `getUpdates`, `hideLeftMembersFromLeaderboard`, `ignoredChannels`, `joinMessage`, `joinMessageChannel`, `joinRoles`, `lang`, `leaderboardStyle`, `leaveMessage`, `leaveMessageChannel`, `logChannel`, `modLogChannel`, `modPunishmentBanDeleteMessage`, `modPunishmentKickDeleteMessage`, `modPunishmentMuteDeleteMessage`, `modPunishmentSoftbanDeleteMessage`, `modPunishmentWarnDeleteMessage`, `musicVolume`, `mutedRole`, `prefix`, `rankAnnouncementChannel`, `rankAnnouncementMessage`, `rankAssignmentStyle` |
| value    | [Value](#Value) | No       | De nieuwe waarde van de instelling.                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

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

Laat de bot de huidige spraakkanaal verlaten.

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
!graph <type> [from] [to]
```

### Aliases

- `!g`
- `!chart`

### Arguments

| Argument | Type          | Required | Description                 | Details                                                              |
| -------- | ------------- | -------- | --------------------------- | -------------------------------------------------------------------- |
| type     | [Enum](#Enum) | Yes      | De type grafiek om te zien. | Use one of the following values: `joins`, `joinsAndLeaves`, `leaves` |
| from     | [Date](#Date) | No       | Startdatum van de chart     |                                                                      |
| to       | [Date](#Date) | No       | Einddatum van de chart      |                                                                      |

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

| Argument | Type                | Required | Description                                          | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------- | ------------------- | -------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command  | [Command](#Command) | No       | De commando om gedetailleerde informatie te krijgen. | Use one of the following values: `addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lockdown`, `lyrics`, `mashup`, `memberConfig`, `members`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |

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

Zie en verander de configuratie van de invite codes van de server.

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
| key        | [Enum](#Enum)              | No       | De configuratie instelling die je wilt zien/veranderen.    | Use one of the following values: `name`, `roles` |
| inviteCode | [Invite Code](#InviteCode) | No       | De invite code waarvan je de instellingen wilt veranderen. |                                                  |
| value      | [Value](#Value)            | No       | De nieuwe waarde van de instelling.                        |                                                  |

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
!leaderboard [page]
```

### Aliases

- `!top`

### Arguments

| Argument | Type              | Required | Description                                    | Details |
| -------- | ----------------- | -------- | ---------------------------------------------- | ------- |
| page     | [Number](#Number) | No       | Welke pagina van de leaderboard om te krijgen. |         |

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

| Argument | Type            | Required | Description                                                       | Details                                                |
| -------- | --------------- | -------- | ----------------------------------------------------------------- | ------------------------------------------------------ |
| key      | [Enum](#Enum)   | No       | De gebruiker configuratie instelling die je wilt zien/veranderen. | Use one of the following values: `hideFromLeaderboard` |
| user     | [User](#User)   | No       | De gebruiker waar de setting voor is.                             |                                                        |
| value    | [Value](#Value) | No       | De nieuwe waarde van de setting.                                  |                                                        |

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

<a name='mute'></a>

---

## !mute

Mute een gebruiker

### Usage

```text
!mute [-d value|--duration=value] <user> [reason]
```

### Arguments

| Argument | Type              | Required | Description                                | Details |
| -------- | ----------------- | -------- | ------------------------------------------ | ------- |
| user     | [Member](#Member) | Yes      | De gebruiker die gemute zou moeten worden. |         |
| reason   | [Text](#Text)     | No       | De reden waarom de gebruiker is gemute.    |         |

### Flags

| Flag                     | Short     | Type                  | Description                       |
| ------------------------ | --------- | --------------------- | --------------------------------- |
| &#x2011;&#x2011;duration | &#x2011;d | [Duration](#Duration) | The duration to mute the user for |

### Examples

<a name='nowPlaying'></a>

---

## !nowPlaying

Laat informatie zien over het huidige muziek

### Usage

```text
!nowPlaying [-p|--pin]
```

### Aliases

- `!np`
- `!now-playing`

### Flags

| Flag                | Short     | Type                | Description                                                                                    |
| ------------------- | --------- | ------------------- | ---------------------------------------------------------------------------------------------- |
| &#x2011;&#x2011;pin | &#x2011;p | [Boolean](#Boolean) | Pint het muziek dat nu speelt en update het automatisch wanneer er een nieuwe muziek afspeelt. |

### Examples

```text
!nowPlaying
```

<a name='pause'></a>

---

## !pause

Zet het huidige muziek op pauze.

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

Configureer permissies om commando's te gebruiken.

### Usage

```text
!permissions [cmd] [role]
```

### Aliases

- `!perms`

### Arguments

| Argument | Type                | Required | Description                                                        | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------- | ------------------- | -------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cmd      | [Command](#Command) | No       | De commando om de permissies te configureren.                      | Use one of the following values: `addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lockdown`, `lyrics`, `mashup`, `memberConfig`, `members`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |
| role     | [Role](#Role)       | No       | De role die toegang of geen toegang moet krijgen tot het commando. |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

### Examples

```text
!permissions
```

<a name='ping'></a>

---

## !ping

Mention de bot

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

Speel het muziek als de wachtrij leeg is, anders wordt het muziek toegevoegd aan het einde van de wachtrij.

### Usage

```text
!play [-p value|--platform=value] [-n|--next] <link>
```

### Aliases

- `!p`

### Arguments

| Argument | Type          | Required | Description                                   | Details |
| -------- | ------------- | -------- | --------------------------------------------- | ------- |
| link     | [Text](#Text) | Yes      | De link naar een muziek of een zoek opdracht. |         |

### Flags

| Flag                     | Short     | Type                | Description                                                                                                                  |
| ------------------------ | --------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| &#x2011;&#x2011;platform | &#x2011;p | [Enum](#Enum)       | Selecteer de platform waar je wilt dat het muziek op wordt gespeeld.                                                         |
| &#x2011;&#x2011;next     | &#x2011;n | [Boolean](#Boolean) | Als dit gezet is, wordt het volgende muziek afgespeeld in plaats van dat het wordt toegevoegd aan het einde van de wachtrij. |

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

Informatie over de betaalde versie van InviteManager.

### Usage

```text
!premium [action]
```

### Aliases

- `!patreon`
- `!donate`

### Arguments

| Argument | Type          | Required | Description                                                                                                                                          | Details                                                            |
| -------- | ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| action   | [Enum](#Enum) | No       | De actie om uit te voeren. Niets voor premium info. `check` om je premium status te controleren. `acivate` om premium te gebruiken voor deze server. | Use one of the following values: `Activate`, `Check`, `Deactivate` |

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

| Argument | Type              | Required | Description                                          | Details |
| -------- | ----------------- | -------- | ---------------------------------------------------- | ------- |
| quantity | [Number](#Number) | Yes      | Hoeveel berichten er verwijdert zullen worden.       |         |
| user     | [User](#User)     | No       | De gebruiker van wie de berichten worden verwijderd. |         |

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

Laat de muziek in de wachtrij zien.

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

Zet de muziek op herhaaldelijk afspelen.

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

Hervat de muziek muziek.

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

Laat het nummer opnieuw afspelen.

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

Zoek voor iets en laat je 1 van de resultaten kiezen.

### Usage

```text
!search [-p value|--platform=value] <search>
```

### Arguments

| Argument | Type          | Required | Description | Details |
| -------- | ------------- | -------- | ----------- | ------- |
| search   | [Text](#Text) | Yes      | De zoeterm  |         |

### Flags

| Flag                     | Short     | Type          | Description                                                         |
| ------------------------ | --------- | ------------- | ------------------------------------------------------------------- |
| &#x2011;&#x2011;platform | &#x2011;p | [Enum](#Enum) | Selecteer het platvorm waarop je het muziek wilt hebben afgespeeld. |

### Examples

<a name='seek'></a>

---

## !seek

Spoel verder naar een bepaald stuk van de muziek.

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
| type     | [Enum](#Enum)     | Yes      | De type overtreding               | Use one of the following values: `allCaps`, `duplicateText`, `emojis`, `hoist`, `invites`, `links`, `mentionRoles`, `mentionUsers`, `quickMessages`, `words` |
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

Probeer de betaalde versie van InviteManager gratis voor een bepaalde tijd.

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

Unban een gebruiker

### Usage

```text
!unban <user> [reason]
```

### Arguments

| Argument | Type          | Required | Description                                 | Details |
| -------- | ------------- | -------- | ------------------------------------------- | ------- |
| user     | [User](#User) | Yes      | De gebruiker die wordt geunbanned.          |         |
| reason   | [Text](#Text) | No       | De reden waarom de gebruiker is geunbanned. |         |

### Examples

<a name='unhoist'></a>

---

## !unhoist

Voeg een character toe in het begin van alle gebruikers met een speciale character in het begin van hun naam, dan komen zij onderaan de gebruiker lijst te staan.

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

Unmute een gebruiker

### Usage

```text
!unmute <user>
```

### Arguments

| Argument | Type              | Required | Description                      | Details |
| -------- | ----------------- | -------- | -------------------------------- | ------- |
| user     | [Member](#Member) | Yes      | De gebruiker die geunmute wordt. |         |

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

Waarschuw een gebruikt.

### Usage

```text
!warn <member> [reason]
```

### Arguments

| Argument | Type              | Required | Description                          | Details |
| -------- | ----------------- | -------- | ------------------------------------ | ------- |
| member   | [Member](#Member) | Yes      | Gebruiker om te waarschuwen.         |         |
| reason   | [Text](#Text)     | No       | Waarom de gebruiker gewaarschuwd is. |         |

### Examples
