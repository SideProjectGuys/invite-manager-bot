# Commands

To get a list of available commands, do !help on your server.

## Arguments & Flags

Most commands accept arguments and/or flags.  
According to the **Type** of the argument or flag you can provide different values.

### Boolean

resolvers.boolean.typeInfo

### Number

resolvers.number.typeInfo

### Enum

resolvers.enum.typeInfo

### Invite Code

resolvers.invitecode.typeInfo

### User

resolvers.user.typeInfo

### Role

resolvers.role.typeInfo

### Channel

resolvers.channel.typeInfo

### Command

resolvers.command.typeInfo

### Text

resolvers.string.typeInfo

### Date

resolvers.date.typeInfo

### Duration

resolvers.duration.typeInfo

## Overview

### Invites

| Command                           | Description                                       | Usage                                                            |
| --------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------- |
| [addInvites](#addInvites)         | Dodaje/Usuwa zaproszenia dla/od członka.          | !addInvites \<user\> \<amount\> [reason]                         |
| [clearInvites](#clearInvites)     | Wyczyść zaproszenia serwera/użytkownika.          | !clearInvites [-d value\|--date=value][-cb\|--clearbonus] [user] |
| [createInvite](#createInvite)     | Tworzy unikalne kody zaproszeń.                   | !createInvite \<name\> [channel]                                 |
| [fake](#fake)                     | Pomóż znaleźć użytkowników próbujących oszukiwać. | !fake [page]                                                     |
| [info](#info)                     | Pokaż informacje o określonym członku.            | !info \<user\> [details][page]                                   |
| [inviteCodes](#inviteCodes)       | Zdobądź listę wszystkich twoich kodów zaproszeń   | !inviteCodes                                                     |
| [inviteDetails](#inviteDetails)   | Pokazuje szczegóły skąd są twoje zaproszenia.     | !inviteDetails [user]                                            |
| [invites](#invites)               | Show personal invites.                            | !invites [user]                                                  |
| [leaderboard](#leaderboard)       | Show members with most invites.                   | !leaderboard [-c value\|--compare=value][duration] [page]        |
| [removeInvites](#removeInvites)   | cmd.removeInvites.self.description                | !removeInvites \<user\> \<amount\> [reason]                      |
| [restoreInvites](#restoreInvites) | Restore all previously cleared invites.           | !restoreInvites [user]                                           |
| [subtractFakes](#subtractFakes)   | Remove fake invites from all users.               | !subtractFakes                                                   |
| [subtractLeaves](#subtractLeaves) | Remove leaves from all users                      | !subtractLeaves                                                  |

### Ranks

| Command                   | Description                   | Usage                                |
| ------------------------- | ----------------------------- | ------------------------------------ |
| [addRank](#addRank)       | Dodaj nową rangę.             | !addRank \<role\> \<invites\> [info] |
| [fixRanks](#fixRanks)     | cmd.fixRanks.self.description | !fixRanks                            |
| [ranks](#ranks)           | Show all ranks.               | !ranks [page]                        |
| [removeRank](#removeRank) | Remove a rank.                | !removeRank \<rank\>                 |

### Config

| Command                                 | Description                                          | Usage                                       |
| --------------------------------------- | ---------------------------------------------------- | ------------------------------------------- |
| [botConfig](#botConfig)                 | Pokaż i zmień konfigurację bota.                     | !botConfig [key][value]                     |
| [config](#config)                       | Pokaż i zmień konfigurację serwera.                  | !config [key][value]                        |
| [interactiveConfig](#interactiveConfig) | Interaktywna konfiguracja                            | !interactiveConfig                          |
| [inviteCodeConfig](#inviteCodeConfig)   | Pokaż i zmień konfiguracje kodu zaproszenia serwera. | !inviteCodeConfig [key][invitecode] [value] |
| [memberConfig](#memberConfig)           | Show and change the config of members of the server. | !memberConfig [key][user] [value]           |
| [permissions](#permissions)             | Configure permissions to use commands.               | !permissions [cmd][role]                    |

### Info

| Command             | Description                                                                       | Usage           |
| ------------------- | --------------------------------------------------------------------------------- | --------------- |
| [botInfo](#botInfo) | Uzyskaj ogólne informacje o bocie.                                                | !botInfo        |
| [credits](#credits) | Pokaż deweloperów i kontrybutorów bota.                                           | !credits        |
| [getBot](#getBot)   | Uzyskaj link zaproszenia dla bota.                                                | !getBot         |
| [help](#help)       | Pokaż pomoc                                                                       | !help [command] |
| [members](#members) | Show member count of current server.                                              | !members        |
| [ping](#ping)       | Ping the bot                                                                      | !ping           |
| [prefix](#prefix)   | Shows the current prefix of the bot.                                              | !prefix         |
| [setup](#setup)     | Help with setting up the bot and checking for problems (e.g. missing permissions) | !setup          |
| [support](#support) | Get an invite link to our support server.                                         | !support        |

### Premium

| Command                   | Description                                                               | Usage             |
| ------------------------- | ------------------------------------------------------------------------- | ----------------- |
| [export](#export)         | Eksportuj dane InviteManager do arkusza CSV.                              | !export \<type\>  |
| [premium](#premium)       | Info about premium version of InviteManager.                              | !premium [action] |
| [tryPremium](#tryPremium) | Try the premium version of InviteManager for free for a limited duration. | !tryPremium       |

### Moderation

| Command                               | Description                                                                                                                                   | Usage                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [ban](#ban)                           | Banuje członka z serwera.                                                                                                                     | !ban [-d value\|--deleteMessageDays=value] \<user\> [reason]     |
| [caseDelete](#caseDelete)             | Usuń określoną sprawę.                                                                                                                        | !caseDelete \<caseNumber\> [reason]                              |
| [caseView](#caseView)                 | Wyświetl informacje o określonej sprawie.                                                                                                     | !caseView \<caseNumber\>                                         |
| [check](#check)                       | Sprawdź historię naruszeń i kar użytkownika.                                                                                                  | !check \<user\>                                                  |
| [clean](#clean)                       | Wyczyść kanał niektórych typów wiadomości.                                                                                                    | !clean \<type\> [numberOfMessages]                               |
| [cleanShort](#cleanShort)             | Wyczyść krótkie wiadomości                                                                                                                    | !cleanShort \<maxTextLength\> [numberOfMessages]                 |
| [cleanText](#cleanText)               | Usuń wiadomości zawierające określone słowa kluczowe.                                                                                         | !cleanText \<text\> [numberOfMessages]                           |
| [kick](#kick)                         | Kick a member from the server.                                                                                                                | !kick \<member\> [reason]                                        |
| [mute](#mute)                         | Mute a user                                                                                                                                   | !mute \<user\> [reason]                                          |
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

| Command                             | Description                                                   | Usage                      |
| ----------------------------------- | ------------------------------------------------------------- | -------------------------- |
| [graph](#graph)                     | Pokazuje wykresy dotyczące różnych statystyk na tym serwerze. | !graph \<type\> [duration] |
| [makeMentionable](#makeMentionable) | Make a role mentionable for 60 seconds or until it was used.  | !makeMentionable \<role\>  |
| [mentionRole](#mentionRole)         | Mention an unmentionable role.                                | !mentionRole \<role\>      |

<a name='addInvites'></a>

---

## !addInvites

Dodaje/Usuwa zaproszenia dla/od członka.

### Usage

```text
!addInvites <user> <amount> [reason]
```

### Aliases

- `!add-invites`

### Arguments

| Argument | Type              | Required | Description                                                                                        | Details |
| -------- | ----------------- | -------- | -------------------------------------------------------------------------------------------------- | ------- |
| user     | [User](#User)     | Yes      | Użytkownik, który otrzyma/straci bonusowe zaproszenia.                                             |         |
| amount   | [Number](#Number) | Yes      | Ilość zaproszeń, które użytkownik otrzyma/straci. Użyj liczby ujemnej (-), aby usunąć zaproszenia. |         |
| reason   | [Text](#Text)     | No       | Powód dodania/usunięcia zaproszeń.                                                                 |         |

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

Dodaj nową rangę.

### Usage

```text
!addRank <role> <invites> [info]
```

### Aliases

- `!add-rank`
- `!set-rank`
- `!setrank`

### Arguments

| Argument | Type              | Required | Description                                                              | Details |
| -------- | ----------------- | -------- | ------------------------------------------------------------------------ | ------- |
| role     | [Role](#Role)     | Yes      | Rola, którą użytkownik otrzyma po osiągnięciu tej rangi.                 |         |
| invites  | [Number](#Number) | Yes      | Ilość zaproszeń potrzebnych do osiągnięcia rangi.                        |         |
| info     | [Text](#Text)     | No       | Opis, który zobaczą użytkownicy, aby dowiedzieć się więcej o tej randze. |         |

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

Banuje członka z serwera.

### Usage

```text
!ban [-d value|--deleteMessageDays=value] <user> [reason]
```

### Arguments

| Argument | Type          | Required | Description                           | Details |
| -------- | ------------- | -------- | ------------------------------------- | ------- |
| user     | [User](#User) | Yes      | Użytkownik do zbanowania.             |         |
| reason   | [Text](#Text) | No       | Dlaczego użytkownik został zbanowany. |         |

### Flags

| Flag                              | Short     | Type              | Description                          |
| --------------------------------- | --------- | ----------------- | ------------------------------------ |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [Number](#Number) | cmd.ban.self.flags.deleteMessageDays |

### Examples

<a name='botConfig'></a>

---

## !botConfig

Pokaż i zmień konfigurację bota.

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
| key      | [Enum](#Enum)   | No       | Ustawienie konfiguracji bota, które chcesz pokazać/zmienić. | Use one of the following values: `activityEnabled`, `activityMessage`, `activityStatus`, `activityType`, `activityUrl`, `embedDefaultColor` |
| value    | [Value](#Value) | No       | Nowa wartość ustawienia.                                    |                                                                                                                                             |

### Examples

```text
!botConfig
```

<a name='botInfo'></a>

---

## !botInfo

Uzyskaj ogólne informacje o bocie.

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

Usuń określoną sprawę.

### Usage

```text
!caseDelete <caseNumber> [reason]
```

### Aliases

- `!case-delete`
- `!deletecase`
- `!delete-case`

### Arguments

| Argument   | Type              | Required | Description             | Details |
| ---------- | ----------------- | -------- | ----------------------- | ------- |
| caseNumber | [Number](#Number) | Yes      | Numer sprawy            |         |
| reason     | [Text](#Text)     | No       | Powód usunięcia sprawy. |         |

### Examples

```text
!caseDelete 5434 User apologized
```

<a name='caseView'></a>

---

## !caseView

Wyświetl informacje o określonej sprawie.

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
| caseNumber | [Number](#Number) | Yes      | Numer sprawy |         |

### Examples

```text
!caseView 5434
```

<a name='check'></a>

---

## !check

Sprawdź historię naruszeń i kar użytkownika.

### Usage

```text
!check <user>
```

### Aliases

- `!history`

### Arguments

| Argument | Type          | Required | Description                | Details |
| -------- | ------------- | -------- | -------------------------- | ------- |
| user     | [User](#User) | Yes      | Użytkownik do sprawdzenia. |         |

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

Wyczyść kanał niektórych typów wiadomości.

### Usage

```text
!clean <type> [numberOfMessages]
```

### Aliases

- `!clear`

### Arguments

| Argument         | Type              | Required | Description                                | Details                                                                                                            |
| ---------------- | ----------------- | -------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| type             | [Enum](#Enum)     | Yes      | Typ wiadomości, które zostaną usunięte.    | Use one of the following values: `bots`, `embeds`, `emojis`, `images`, `links`, `mentions`, `reacted`, `reactions` |
| numberOfMessages | [Number](#Number) | No       | Liczba wiadomości, które będą wyszukiwane. |                                                                                                                    |

### Examples

<a name='cleanShort'></a>

---

## !cleanShort

Wyczyść krótkie wiadomości

### Usage

```text
!cleanShort <maxTextLength> [numberOfMessages]
```

### Aliases

- `!clean-short`
- `!clearshort`
- `!clear-short`

### Arguments

| Argument         | Type              | Required | Description                                           | Details |
| ---------------- | ----------------- | -------- | ----------------------------------------------------- | ------- |
| maxTextLength    | [Number](#Number) | Yes      | Wszystkie wiadomości krótsze niż ta zostaną usunięte. |         |
| numberOfMessages | [Number](#Number) | No       | Liczba wiadomości, które będą wyszukiwane.            |         |

### Examples

<a name='cleanText'></a>

---

## !cleanText

Usuń wiadomości zawierające określone słowa kluczowe.

### Usage

```text
!cleanText <text> [numberOfMessages]
```

### Aliases

- `!clean-text`
- `!cleartext`
- `!clear-text`

### Arguments

| Argument         | Type              | Required | Description                                                 | Details |
| ---------------- | ----------------- | -------- | ----------------------------------------------------------- | ------- |
| text             | [Text](#Text)     | Yes      | Wszystkie wiadomości zawierające to słowo zostaną usunięte. |         |
| numberOfMessages | [Number](#Number) | No       | Liczba wiadomości, które będą wyszukiwane.                  |         |

### Examples

<a name='clearInvites'></a>

---

## !clearInvites

Wyczyść zaproszenia serwera/użytkownika.

### Usage

```text
!clearInvites [-d value|--date=value] [-cb|--clearBonus] [user]
```

### Aliases

- `!clear-invites`

### Arguments

| Argument | Type          | Required | Description                                                                                       | Details |
| -------- | ------------- | -------- | ------------------------------------------------------------------------------------------------- | ------- |
| user     | [User](#User) | No       | Użytkownik, któremu usunąć wszystkie zaproszenia. Jeśli pominięto, usuwa wszystkich użytkowników. |         |

### Flags

| Flag                       | Short      | Type                | Description                                                                                                               |
| -------------------------- | ---------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| &#x2011;&#x2011;date       | &#x2011;d  | [Date](#Date)       | Data rozpoczęcia, w której należy liczyć zaproszenia. Domyślnie jest to dzisiaj.                                          |
| &#x2011;&#x2011;clearBonus | &#x2011;cb | [Boolean](#Boolean) | Dodaj tę flagę, aby wyczyścić również bonusowe zaproszenia. W przeciwnym razie bonusowe zaproszenia pozostaną nietknięte. |

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

Pokaż i zmień konfigurację serwera.

### Usage

```text
!config [key] [value]
```

### Aliases

- `!c`

### Arguments

| Argument | Type            | Required | Description                                              | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------- | --------------- | -------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| key      | [Enum](#Enum)   | No       | Ustawienie konfiguracyjne, które chcesz pokazać/zmienić. | Use one of the following values: `announcementVoice`, `announceNextSong`, `autoModAllCapsEnabled`, `autoModAllCapsMinCharacters`, `autoModAllCapsPercentageCaps`, `autoModDeleteBotMessage`, `autoModDeleteBotMessageTimeoutInSeconds`, `autoModDisabledForOldMembers`, `autoModDisabledForOldMembersThreshold`, `autoModDuplicateTextEnabled`, `autoModDuplicateTextTimeframeInSeconds`, `autoModEmojisEnabled`, `autoModEmojisMaxNumberOfEmojis`, `autoModEnabled`, `autoModHoistEnabled`, `autoModIgnoredChannels`, `autoModIgnoredRoles`, `autoModInvitesEnabled`, `autoModLinksBlacklist`, `autoModLinksEnabled`, `autoModLinksFollowRedirects`, `autoModLinksWhitelist`, `autoModLogEnabled`, `autoModMentionRolesEnabled`, `autoModMentionRolesMaxNumberOfMentions`, `autoModMentionUsersEnabled`, `autoModMentionUsersMaxNumberOfMentions`, `autoModModeratedChannels`, `autoModModeratedRoles`, `autoModQuickMessagesEnabled`, `autoModQuickMessagesNumberOfMessages`, `autoModQuickMessagesTimeframeInSeconds`, `autoModWordsBlacklist`, `autoModWordsEnabled`, `autoSubtractFakes`, `autoSubtractLeaves`, `autoSubtractLeaveThreshold`, `captchaVerificationFailedMessage`, `captchaVerificationLogEnabled`, `captchaVerificationOnJoin`, `captchaVerificationSuccessMessage`, `captchaVerificationTimeout`, `captchaVerificationWelcomeMessage`, `channels`, `fadeMusicEndDelay`, `fadeMusicOnTalk`, `getUpdates`, `hideLeftMembersFromLeaderboard`, `ignoredChannels`, `joinMessage`, `joinMessageChannel`, `lang`, `leaderboardStyle`, `leaveMessage`, `leaveMessageChannel`, `logChannel`, `modLogChannel`, `modPunishmentBanDeleteMessage`, `modPunishmentKickDeleteMessage`, `modPunishmentMuteDeleteMessage`, `modPunishmentSoftbanDeleteMessage`, `modPunishmentWarnDeleteMessage`, `musicVolume`, `mutedRole`, `prefix`, `rankAnnouncementChannel`, `rankAnnouncementMessage`, `rankAssignmentStyle` |
| value    | [Value](#Value) | No       | Nowa wartość ustawienia.                                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

### Examples

```text
!config
```

<a name='createInvite'></a>

---

## !createInvite

Tworzy unikalne kody zaproszeń.

### Usage

```text
!createInvite <name> [channel]
```

### Aliases

- `!create-invite`

### Arguments

| Argument | Type                | Required | Description                                                                         | Details |
| -------- | ------------------- | -------- | ----------------------------------------------------------------------------------- | ------- |
| name     | [Text](#Text)       | Yes      | Nazwa kodu zaproszenia.                                                             |         |
| channel  | [Channel](#Channel) | No       | Kanał, dla którego tworzony jest kod zaproszenia. Domyślnie używa bieżącego kanału. |         |

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

Pokaż deweloperów i kontrybutorów bota.

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

Eksportuj dane InviteManager do arkusza CSV.

### Usage

```text
!export <type>
```

### Arguments

| Argument | Type          | Required | Description                       | Details                                        |
| -------- | ------------- | -------- | --------------------------------- | ---------------------------------------------- |
| type     | [Enum](#Enum) | Yes      | Rodzaj pliku, który eksportujesz. | Use one of the following values: `leaderboard` |

### Examples

```text
!export leaderboard
```

<a name='fake'></a>

---

## !fake

Pomóż znaleźć użytkowników próbujących oszukiwać.

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

| Argument | Type              | Required | Description                                   | Details |
| -------- | ----------------- | -------- | --------------------------------------------- | ------- |
| page     | [Number](#Number) | No       | Którą stronę fałszywej listy chcesz zobaczyć? |         |

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

Uzyskaj link zaproszenia dla bota.

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

Pokazuje wykresy dotyczące różnych statystyk na tym serwerze.

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
| type     | [Enum](#Enum)         | Yes      | Typ wykresu do wyświetlenia. | Use one of the following values: `joins`, `leaves`, `usage` |
| duration | [Duration](#Duration) | No       | Okres trwania wykresu.       |                                                             |

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

Pokaż pomoc

### Usage

```text
!help [command]
```

### Arguments

| Argument | Type                | Required | Description                                            | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------- | ------------------- | -------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command  | [Command](#Command) | No       | Polecenie, dla którego uzyskać szczegółowe informacje. | Use one of the following values: `addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fake`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lyrics`, `makeMentionable`, `mashup`, `memberConfig`, `members`, `mentionRole`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |

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

Pokaż informacje o określonym członku.

### Usage

```text
!info <user> [details] [page]
```

### Aliases

- `!showinfo`

### Arguments

| Argument | Type              | Required | Description                                                                  | Details                                             |
| -------- | ----------------- | -------- | ---------------------------------------------------------------------------- | --------------------------------------------------- |
| user     | [User](#User)     | Yes      | Użytkownik, dla którego chcesz zobaczyć dodatkowe informacje.                |                                                     |
| details  | [Enum](#Enum)     | No       | Poproś tylko o szczegółowe informacje na temat członka.                      | Use one of the following values: `bonus`, `members` |
| page     | [Number](#Number) | No       | Jaka strona szczegółów do pokazania. Możesz także użyć reakcji do nawigacji. |                                                     |

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

Interaktywna konfiguracja

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

Pokaż i zmień konfiguracje kodu zaproszenia serwera.

### Usage

```text
!inviteCodeConfig [key] [inviteCode] [value]
```

### Aliases

- `!invite-code-config`
- `!icc`

### Arguments

| Argument   | Type                       | Required | Description                                            | Details                                          |
| ---------- | -------------------------- | -------- | ------------------------------------------------------ | ------------------------------------------------ |
| key        | [Enum](#Enum)              | No       | Konfiguracja ustawienia jaką chcesz pokazać/zmienić.   | Use one of the following values: `name`, `roles` |
| inviteCode | [Invite Code](#InviteCode) | No       | Kod zaproszenia dla którego chcesz zmienić ustawienia. |                                                  |
| value      | [Value](#Value)            | No       | Nowa wartość ustawienia                                |                                                  |

### Examples

```text
!inviteCodeConfig
```

<a name='inviteCodes'></a>

---

## !inviteCodes

Zdobądź listę wszystkich twoich kodów zaproszeń

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

Pokazuje szczegóły skąd są twoje zaproszenia.

### Usage

```text
!inviteDetails [user]
```

### Aliases

- `!invite-details`

### Arguments

| Argument | Type          | Required | Description                                              | Details |
| -------- | ------------- | -------- | -------------------------------------------------------- | ------- |
| user     | [User](#User) | No       | Użytkownik kogo chcesz zobaczyć szczegółowo zaproszenia. |         |

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
