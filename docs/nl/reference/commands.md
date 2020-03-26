# Commands

To get a list of available commands, do !help on your server.

## Arguments & Flags

Most commands accept arguments and/or flags.  
According to the **Type** of the argument or flag you can provide different values.

### Boolean

Deze argument hoord `true` of `false` te zijn. Je kan ook `yes` en `no` gebruiken.

### Nummer

De argument zou een nummer moeten zijn

### Enum

Deze argumenten horen een waarde te zijn van een specifiek gezette of geldige waarde.

> Gebaseerd op het commando kan de geldige waarde variëren. Gebruik `!help <command>` (Bijv. `!help addRank`) om meer informatie te krijgen over een commando's en de geldige waardes.

### Invite Code

Deze argument zou een Discord Invite Code moeten zijn

> Je kan alleen de invite code achter `https://discord.gg/` plaatsen om te voorkomen dat Discord een preview maakt.

### Gebruiker

DIt argument hoord een Discord Gebruikerte zijn. Je kan een van volgende methodes gebruiken om een gebruiker te krijgen:

- Mention de gebruiker: `@Valunder`
- Gebruik zijn ID: `102785693046026240`
- Gebruik zijn naam: `Valunder`
- Gebruik quotes als zijn naam een spatie heeft: `"Valunder met een spatie"`

### Role

Dit argument zou een Discord Role moeten zijn. Je kan 1 van de volgende methodes gebruiken:

- Mention de role `@Admin`
- Gebruik de ID: `102785693046026240`
- Gebruik de naam: `Admin`
- Gebruik quotes als de naam een space heeft: `"Admin met een spatie"`

### Kanaal

DIt argument hoord een Discord Kanaal te zijn. Je kan een van volgende methodes gebruiken om een kanaal te krijgen:

- Mention het kanaal: `#general`
- Gebruik het kanaalID: `409846838129197057`
- Gebruik de naam: `general`
- Gebruik quotes als de naam een spatie heeft: `"general met een spatie"`

### Command

Dit argument zou een commando moeten zijn van de bot. Je kan 1 van de volgende methodes gebruiken:

- Gebruik het commando naam: `invites`
- Gebruik een bijnaam van de commando: `p`

### Tekst

Deze argument zou een tekst moeten zijn. Je kan quotes ("Tekst met quotes") gebruiken voor tekst met spaties.

> Als de tekst de laatste argument is hoef je geen quotes te gebruiken.

### Datum

Deze argument zou een datum moeten zijn. Je kan verschillende formaten gebruiken, maar we raden de volgende formaat aan: `JJJJ-MM-DD`

### Tijdsduur

Deze argument zou een tijdsduur moeten zijn. De volgende tijdsduren zijn ondersteunt:

- Seconden: `s` (5s` = 5 seconden)
- Minuten: `min` (3min` = 3 minuten)
- Uren: `h` (4h` = 4 uren)
- Dagen: `d` (2d` = 2 dagen)
- Weken: `w` (1w` = 1 week)
- Maanden: `mo` (6mo` = 6 maanden)
- Jaren: `y` (10y` = 10 jaren)

## Overview

### Invites

| Command                           | Description                                                | Usage                                                            |
| --------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| [addInvites](#addInvites)         | Voeg toe/verwijder invites van een gebruiker.              | !addInvites \<user\> \<amount\> [reason]                         |
| [clearInvites](#clearInvites)     | Verwijder alle invites van de server/een gebruiker         | !clearInvites [-d value\|--date=value][-cb\|--clearbonus] [user] |
| [createInvite](#createInvite)     | Maak unieke invite codes aan.                              | !createInvite \<name\> [channel]                                 |
| [info](#info)                     | Zie informatie over een specifieke gebruiker.              | !info \<user\> [details][page]                                   |
| [inviteCodes](#inviteCodes)       | Krijg een lijst van al jouw invite codes                   | !inviteCodes                                                     |
| [inviteDetails](#inviteDetails)   | Zie details waar je je invites vandaan komen.              | !inviteDetails [user]                                            |
| [invites](#invites)               | Zie persoonlijke invites.                                  | !invites [user]                                                  |
| [leaderboard](#leaderboard)       | Laat de mensen zien met de meeste invites.                 | !leaderboard [page]                                              |
| [removeInvites](#removeInvites)   | Verwijder een specifieke aantal invites van een gebruiker. | !removeInvites \<user\> \<amount\> [reason]                      |
| [restoreInvites](#restoreInvites) | Zat alle vorige verwijderde invites terug.                 | !restoreInvites [user]                                           |
| [subtractFakes](#subtractFakes)   | Verwijder fake invites van alle gebruikers.                | !subtractFakes                                                   |
| [subtractLeaves](#subtractLeaves) | Verwijder leaves voor alle gebruikers.                     | !subtractLeaves                                                  |

### Ranks

| Command                   | Description                                              | Usage                                |
| ------------------------- | -------------------------------------------------------- | ------------------------------------ |
| [addRank](#addRank)       | Voeg een nieuwe rank toe.                                | !addRank \<role\> \<invites\> [info] |
| [fixRanks](#fixRanks)     | Verwijder alle ranken waarvan de rollen verwijderd zijn. | !fixRanks                            |
| [ranks](#ranks)           | Zie alle ranks.                                          | !ranks [page]                        |
| [removeRank](#removeRank) | Verwijder een rank.                                      | !removeRank \<rank\>                 |

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
| [lockdown](#lockdown)                 | Lockdown een specifiek kanaal (Zorg ervoor dat mensen zonder een speciale role geen berichten kunnen versturen)                                                   | !lockdown [-t value\|--timeout=value][channel]                   |
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
| [skip](#skip)             | Skip the huidige muziek en speel de volgende muziek af in de wachtrij.                                      | !skip [amount]                                          |
| [volume](#volume)         | Zet de volume als er een argument is opgegeven, of laat de huidige volume zien.                             | !volume [volume]                                        |

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

| Argument | Type                    | Required | Description                                                                                                | Details |
| -------- | ----------------------- | -------- | ---------------------------------------------------------------------------------------------------------- | ------- |
| user     | [Gebruiker](#Gebruiker) | Yes      | De gebruiker die krijgt of verliest de bonus invites.                                                      |         |
| amount   | [Nummer](#Nummer)       | Yes      | De hoeveelheid invites dat de gebruiker krijgt / verliest. Gebruik de (-) teken om invites te verwijderen. |         |
| reason   | [Tekst](#Tekst)         | No       | De reden om invites toe te voegen of te verwijderen.                                                       |         |

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
| invites  | [Nummer](#Nummer) | Yes      | De hoeveelheid invites nodig om de rank te krijgen.                     |         |
| info     | [Tekst](#Tekst)   | No       | Een beschrijving zodat gebruikers meer krijgen te weten over deze rank. |         |

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

| Argument | Type                    | Required | Description                        | Details |
| -------- | ----------------------- | -------- | ---------------------------------- | ------- |
| user     | [Gebruiker](#Gebruiker) | Yes      | Gebruiker om te verbannen.         |         |
| reason   | [Tekst](#Tekst)         | No       | Waarom de gebruiker was verbannen. |         |

### Flags

| Flag                              | Short     | Type              | Description                                                                  |
| --------------------------------- | --------- | ----------------- | ---------------------------------------------------------------------------- |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [Nummer](#Nummer) | Als dit opgegeven is, worden de berichten van de opgegeven dagen verwijderd. |

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

| Argument | Type              | Required | Description                                                 | Details                                                                                                                                       |
| -------- | ----------------- | -------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| key      | [Enum](#Enum)     | No       | De bot configuratie instelling die je wilt zien/veranderen. | Gebruik 1 van de volgende waardes: `activityEnabled`, `activityMessage`, `activityStatus`, `activityType`, `activityUrl`, `embedDefaultColor` |
| value    | [Waarde](#Waarde) | No       | De nieuwe waarde van de setting.                            |                                                                                                                                               |

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
| caseNumber | [Nummer](#Nummer) | Yes      | Case nummer                                  |         |
| reason     | [Tekst](#Tekst)   | No       | De reden voor het verwijderen van het geval. |         |

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
| caseNumber | [Nummer](#Nummer) | Yes      | Geval nummer |         |

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

| Argument | Type                    | Required | Description              | Details |
| -------- | ----------------------- | -------- | ------------------------ | ------- |
| user     | [Gebruiker](#Gebruiker) | Yes      | Gebruiker om te checken. |         |

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

| Argument         | Type              | Required | Description                              | Details                                                                                                              |
| ---------------- | ----------------- | -------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| type             | [Enum](#Enum)     | Yes      | Het type bericht dat wordt verwijdert.   | Gebruik 1 van de volgende waardes: `bots`, `embeds`, `emojis`, `images`, `links`, `mentions`, `reacted`, `reactions` |
| numberOfMessages | [Nummer](#Nummer) | No       | Hoeveelheid berichten dat wordt gezocht. |                                                                                                                      |

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
| maxTextLength    | [Nummer](#Nummer) | Yes      | Alle berichten die korter zijn dan deze worden verwijderd. |         |
| numberOfMessages | [Nummer](#Nummer) | No       | Aantal berichten die worden gezocht.                       |         |

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
| text             | [Tekst](#Tekst)   | Yes      | Alle berichten met die woord worden verwijdert. |         |
| numberOfMessages | [Nummer](#Nummer) | No       | Aantal berichten die worden gezocht.            |         |

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

| Argument | Type                    | Required | Description                                                                                                        | Details |
| -------- | ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------ | ------- |
| user     | [Gebruiker](#Gebruiker) | No       | De gebruiker waar alle invites worden verwijdert. Wanneer dit wordt weggelaten, worden alle gebruikers verwijdert. |         |

### Flags

| Flag                       | Short      | Type                | Description                            |
| -------------------------- | ---------- | ------------------- | -------------------------------------- |
| &#x2011;&#x2011;date       | &#x2011;d  | [Datum](#Datum)     | cmd.clearInvites.self.flags.date       |
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

| Argument | Type              | Required | Description                                             | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------- | ----------------- | -------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key      | [Enum](#Enum)     | No       | De configuratie instelling die je wilt zien/veranderen. | Gebruik 1 van de volgende waardes: `announcementVoice`, `announceNextSong`, `autoModAllCapsEnabled`, `autoModAllCapsMinCharacters`, `autoModAllCapsPercentageCaps`, `autoModDeleteBotMessage`, `autoModDeleteBotMessageTimeoutInSeconds`, `autoModDisabledForOldMembers`, `autoModDisabledForOldMembersThreshold`, `autoModDuplicateTextEnabled`, `autoModDuplicateTextTimeframeInSeconds`, `autoModEmojisEnabled`, `autoModEmojisMaxNumberOfEmojis`, `autoModEnabled`, `autoModHoistEnabled`, `autoModIgnoredChannels`, `autoModIgnoredRoles`, `autoModInvitesEnabled`, `autoModLinksBlacklist`, `autoModLinksEnabled`, `autoModLinksFollowRedirects`, `autoModLinksWhitelist`, `autoModLogEnabled`, `autoModMentionRolesEnabled`, `autoModMentionRolesMaxNumberOfMentions`, `autoModMentionUsersEnabled`, `autoModMentionUsersMaxNumberOfMentions`, `autoModModeratedChannels`, `autoModModeratedRoles`, `autoModQuickMessagesEnabled`, `autoModQuickMessagesNumberOfMessages`, `autoModQuickMessagesTimeframeInSeconds`, `autoModWordsBlacklist`, `autoModWordsEnabled`, `autoSubtractFakes`, `autoSubtractLeaves`, `autoSubtractLeaveThreshold`, `captchaVerificationFailedMessage`, `captchaVerificationLogEnabled`, `captchaVerificationOnJoin`, `captchaVerificationSuccessMessage`, `captchaVerificationTimeout`, `captchaVerificationWelcomeMessage`, `channels`, `defaultMusicPlatform`, `disabledMusicPlatforms`, `fadeMusicEndDelay`, `fadeMusicOnTalk`, `getUpdates`, `hideLeftMembersFromLeaderboard`, `ignoredChannels`, `joinMessage`, `joinMessageChannel`, `joinRoles`, `lang`, `leaderboardStyle`, `leaveMessage`, `leaveMessageChannel`, `logChannel`, `modLogChannel`, `modPunishmentBanDeleteMessage`, `modPunishmentKickDeleteMessage`, `modPunishmentMuteDeleteMessage`, `modPunishmentSoftbanDeleteMessage`, `modPunishmentWarnDeleteMessage`, `musicVolume`, `mutedRole`, `prefix`, `rankAnnouncementChannel`, `rankAnnouncementMessage`, `rankAssignmentStyle` |
| value    | [Waarde](#Waarde) | No       | De nieuwe waarde van de instelling.                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

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

| Argument | Type              | Required | Description                                                                                  | Details |
| -------- | ----------------- | -------- | -------------------------------------------------------------------------------------------- | ------- |
| name     | [Tekst](#Tekst)   | Yes      | De naam van de invite code.                                                                  |         |
| channel  | [Kanaal](#Kanaal) | No       | De kanaal waarvoor de invite code is aangemaakt. De huidige kanaal wordt standaard gebruikt. |         |

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

| Argument | Type          | Required | Description                 | Details                                          |
| -------- | ------------- | -------- | --------------------------- | ------------------------------------------------ |
| type     | [Enum](#Enum) | Yes      | De type export wat je wilt. | Gebruik 1 van de volgende waardes: `leaderboard` |

### Examples

```text
!export leaderboard
```

<a name='fixRanks'></a>

---

## !fixRanks

Verwijder alle ranken waarvan de rollen verwijderd zijn.

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

| Argument | Type            | Required | Description                 | Details                                                                |
| -------- | --------------- | -------- | --------------------------- | ---------------------------------------------------------------------- |
| type     | [Enum](#Enum)   | Yes      | De type grafiek om te zien. | Gebruik 1 van de volgende waardes: `joins`, `joinsAndLeaves`, `leaves` |
| from     | [Datum](#Datum) | No       | Startdatum van de chart     |                                                                        |
| to       | [Datum](#Datum) | No       | Einddatum van de chart      |                                                                        |

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

| Argument | Type                | Required | Description                                          | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------- | ------------------- | -------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command  | [Command](#Command) | No       | De commando om gedetailleerde informatie te krijgen. | Gebruik 1 van de volgende waardes: `addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lockdown`, `lyrics`, `mashup`, `memberConfig`, `members`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |

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

| Argument | Type                    | Required | Description                                                                                     | Details                                               |
| -------- | ----------------------- | -------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| user     | [Gebruiker](#Gebruiker) | Yes      | De gebruiker van wie je de toegevoegde informatie wilt zien.                                    |                                                       |
| details  | [Enum](#Enum)           | No       | Vraag alleen specifieke details aan van een gebruiker.                                          | Gebruik 1 van de volgende waardes: `bonus`, `members` |
| page     | [Nummer](#Nummer)       | No       | Welke pagina van de detail om te laten zien. Je kan ook de reactions gebruiken om te navigeren. |                                                       |

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

| Argument   | Type                       | Required | Description                                                | Details                                            |
| ---------- | -------------------------- | -------- | ---------------------------------------------------------- | -------------------------------------------------- |
| key        | [Enum](#Enum)              | No       | De configuratie instelling die je wilt zien/veranderen.    | Gebruik 1 van de volgende waardes: `name`, `roles` |
| inviteCode | [Invite Code](#InviteCode) | No       | De invite code waarvan je de instellingen wilt veranderen. |                                                    |
| value      | [Waarde](#Waarde)          | No       | De nieuwe waarde van de instelling.                        |                                                    |

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

| Argument | Type                    | Required | Description                                                 | Details |
| -------- | ----------------------- | -------- | ----------------------------------------------------------- | ------- |
| user     | [Gebruiker](#Gebruiker) | No       | De gebruiker van wie je de invites gedetailleerd wilt zien. |         |

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

| Argument | Type                    | Required | Description                                   | Details |
| -------- | ----------------------- | -------- | --------------------------------------------- | ------- |
| user     | [Gebruiker](#Gebruiker) | No       | De gebruiker van wie je de invites wilt zien. |         |

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

| Argument | Type                    | Required | Description                      | Details |
| -------- | ----------------------- | -------- | -------------------------------- | ------- |
| member   | [Gebruiker](#Gebruiker) | Yes      | Gebruiker om te kicken.          |         |
| reason   | [Tekst](#Tekst)         | No       | Waarom de gebruiker is gekicked. |         |

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
| page     | [Nummer](#Nummer) | No       | Welke pagina van de leaderboard om te krijgen. |         |

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

Lockdown een specifiek kanaal (Zorg ervoor dat mensen zonder een speciale role geen berichten kunnen versturen)

### Usage

```text
!lockdown [-t value|--timeout=value] [channel]
```

### Arguments

| Argument | Type              | Required | Description                      | Details |
| -------- | ----------------- | -------- | -------------------------------- | ------- |
| channel  | [Kanaal](#Kanaal) | No       | Het kanaal dat in lockdown wilt. |         |

### Flags

| Flag                    | Short     | Type                    | Description                                                                                                     |
| ----------------------- | --------- | ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| &#x2011;&#x2011;timeout | &#x2011;t | [Tijdsduur](#Tijdsduur) | De timeout dat de lockdown automatisch eindigd. Voer het commando opnieuw uit om de lockdown manual te stoppen. |

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

| Argument | Type            | Required | Description                                | Details |
| -------- | --------------- | -------- | ------------------------------------------ | ------- |
| videos   | [Tekst](#Tekst) | Yes      | The videos that should be mashed together. |         |

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

| Argument | Type                    | Required | Description                                                       | Details                                                  |
| -------- | ----------------------- | -------- | ----------------------------------------------------------------- | -------------------------------------------------------- |
| key      | [Enum](#Enum)           | No       | De gebruiker configuratie instelling die je wilt zien/veranderen. | Gebruik 1 van de volgende waardes: `hideFromLeaderboard` |
| user     | [Gebruiker](#Gebruiker) | No       | De gebruiker waar de setting voor is.                             |                                                          |
| value    | [Waarde](#Waarde)       | No       | De nieuwe waarde van de setting.                                  |                                                          |

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

| Argument | Type                    | Required | Description                                | Details |
| -------- | ----------------------- | -------- | ------------------------------------------ | ------- |
| user     | [Gebruiker](#Gebruiker) | Yes      | De gebruiker die gemute zou moeten worden. |         |
| reason   | [Tekst](#Tekst)         | No       | De reden waarom de gebruiker is gemute.    |         |

### Flags

| Flag                     | Short     | Type                    | Description                            |
| ------------------------ | --------- | ----------------------- | -------------------------------------- |
| &#x2011;&#x2011;duration | &#x2011;d | [Tijdsduur](#Tijdsduur) | De tijdsduur om een gebruiker te muten |

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

| Argument | Type                | Required | Description                                                        | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------- | ------------------- | -------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cmd      | [Command](#Command) | No       | De commando om de permissies te configureren.                      | Gebruik 1 van de volgende waardes: `addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lockdown`, `lyrics`, `mashup`, `memberConfig`, `members`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |
| role     | [Role](#Role)       | No       | De role die toegang of geen toegang moet krijgen tot het commando. |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

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

| Argument | Type            | Required | Description                                   | Details |
| -------- | --------------- | -------- | --------------------------------------------- | ------- |
| link     | [Tekst](#Tekst) | Yes      | De link naar een muziek of een zoek opdracht. |         |

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

| Argument | Type          | Required | Description                                                                                                                                          | Details                                                              |
| -------- | ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| action   | [Enum](#Enum) | No       | De actie om uit te voeren. Niets voor premium info. `check` om je premium status te controleren. `acivate` om premium te gebruiken voor deze server. | Gebruik 1 van de volgende waardes: `Activate`, `Check`, `Deactivate` |

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

| Argument   | Type              | Required | Description                                           | Details                                                                     |
| ---------- | ----------------- | -------- | ----------------------------------------------------- | --------------------------------------------------------------------------- |
| punishment | [Enum](#Enum)     | No       | Straf type om te gebruiken.                           | Gebruik 1 van de volgende waardes: `ban`, `kick`, `mute`, `softban`, `warn` |
| strikes    | [Nummer](#Nummer) | No       | Waarschuwing aantal voor deze straf mom te gebruiken. |                                                                             |
| args       | [Tekst](#Tekst)   | No       | Arguments passed to the punishment.                   |                                                                             |

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

| Argument | Type                    | Required | Description                                          | Details |
| -------- | ----------------------- | -------- | ---------------------------------------------------- | ------- |
| quantity | [Nummer](#Nummer)       | Yes      | Hoeveel berichten er verwijdert zullen worden.       |         |
| user     | [Gebruiker](#Gebruiker) | No       | De gebruiker van wie de berichten worden verwijderd. |         |

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

| Argument  | Type            | Required | Description                           | Details |
| --------- | --------------- | -------- | ------------------------------------- | ------- |
| messageID | [Tekst](#Tekst) | Yes      | Laatste bericht ID om te verwijderen. |         |

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

| Argument | Type              | Required | Description                            | Details |
| -------- | ----------------- | -------- | -------------------------------------- | ------- |
| page     | [Nummer](#Nummer) | No       | De pagina van de ranklijst om te zien. |         |

### Examples

```text
!ranks
```

<a name='removeInvites'></a>

---

## !removeInvites

Verwijder een specifieke aantal invites van een gebruiker.

### Usage

```text
!removeInvites <user> <amount> [reason]
```

### Aliases

- `!remove-invites`

### Arguments

| Argument | Type                    | Required | Description                                    | Details |
| -------- | ----------------------- | -------- | ---------------------------------------------- | ------- |
| user     | [Gebruiker](#Gebruiker) | Yes      | De gebruiker om de invites van te verwijderen. |         |
| amount   | [Nummer](#Nummer)       | Yes      | het aantal invites om te verwijderen.          |         |
| reason   | [Tekst](#Tekst)         | No       | De reden om de invites te verwijderen.         |         |

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

| Argument | Type                    | Required | Description                                                                                                    | Details |
| -------- | ----------------------- | -------- | -------------------------------------------------------------------------------------------------------------- | ------- |
| user     | [Gebruiker](#Gebruiker) | No       | De gebruiker om alle invites terug te zetten. Wanneer leeg gelaten worden de invites van iedereen terug gezet. |         |

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

| Argument | Type            | Required | Description | Details |
| -------- | --------------- | -------- | ----------- | ------- |
| search   | [Tekst](#Tekst) | Yes      | De zoeterm  |         |

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
| duration | [Nummer](#Nummer) | No       | The position the song will be skipped to (from the beginning, in seconds). |         |

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

Skip the huidige muziek en speel de volgende muziek af in de wachtrij.

### Usage

```text
!skip [amount]
```

### Aliases

- `!next`

### Arguments

| Argument | Type              | Required | Description                          | Details |
| -------- | ----------------- | -------- | ------------------------------------ | ------- |
| amount   | [Nummer](#Nummer) | No       | Hoeveel liedjes er worden geskipped. |         |

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

| Argument | Type                    | Required | Description                        | Details |
| -------- | ----------------------- | -------- | ---------------------------------- | ------- |
| user     | [Gebruiker](#Gebruiker) | Yes      | Gebruiker om te verbannen.         |         |
| reason   | [Tekst](#Tekst)         | No       | Waarom de gebruiker was verbannen. |         |

### Flags

| Flag                              | Short     | Type              | Description                                             |
| --------------------------------- | --------- | ----------------- | ------------------------------------------------------- |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [Nummer](#Nummer) | Verwijder berichten van de gebruiker van dagen geleden. |

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

| Argument | Type                    | Required | Description                       | Details                                                                                                                                                        |
| -------- | ----------------------- | -------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| member   | [Gebruiker](#Gebruiker) | Yes      | The member receiving the strikes  |                                                                                                                                                                |
| type     | [Enum](#Enum)           | Yes      | De type overtreding               | Gebruik 1 van de volgende waardes: `allCaps`, `duplicateText`, `emojis`, `hoist`, `invites`, `links`, `mentionRoles`, `mentionUsers`, `quickMessages`, `words` |
| amount   | [Nummer](#Nummer)       | Yes      | The amount of strikes to be added |                                                                                                                                                                |

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

| Argument  | Type              | Required | Description            | Details                                                                                                                                                        |
| --------- | ----------------- | -------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| violation | [Enum](#Enum)     | No       | Straf type.            | Gebruik 1 van de volgende waardes: `allCaps`, `duplicateText`, `emojis`, `hoist`, `invites`, `links`, `mentionRoles`, `mentionUsers`, `quickMessages`, `words` |
| strikes   | [Nummer](#Nummer) | No       | Aantal waarschuwingen. |                                                                                                                                                                |

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

| Argument | Type                    | Required | Description                                 | Details |
| -------- | ----------------------- | -------- | ------------------------------------------- | ------- |
| user     | [Gebruiker](#Gebruiker) | Yes      | De gebruiker die wordt geunbanned.          |         |
| reason   | [Tekst](#Tekst)         | No       | De reden waarom de gebruiker is geunbanned. |         |

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

| Argument | Type                    | Required | Description                      | Details |
| -------- | ----------------------- | -------- | -------------------------------- | ------- |
| user     | [Gebruiker](#Gebruiker) | Yes      | De gebruiker die geunmute wordt. |         |

### Examples

<a name='volume'></a>

---

## !volume

Zet de volume als er een argument is opgegeven, of laat de huidige volume zien.

### Usage

```text
!volume [volume]
```

### Arguments

| Argument | Type              | Required | Description                                   | Details |
| -------- | ----------------- | -------- | --------------------------------------------- | ------- |
| volume   | [Nummer](#Nummer) | No       | De waarde waar de volume naartoe wordt gezet. |         |

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

| Argument | Type                    | Required | Description                          | Details |
| -------- | ----------------------- | -------- | ------------------------------------ | ------- |
| member   | [Gebruiker](#Gebruiker) | Yes      | Gebruiker om te waarschuwen.         |         |
| reason   | [Tekst](#Tekst)         | No       | Waarom de gebruiker gewaarschuwd is. |         |

### Examples
