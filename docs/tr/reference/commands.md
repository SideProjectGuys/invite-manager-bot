# Commands

To get a list of available commands, do !help on your server.

## Arguments & Flags

Most commands accept arguments and/or flags.  
According to the **Type** of the argument or flag you can provide different values.

### Boolean

This arguments expects `true` or `false`. You can also use `yes` and `no`.

### Sayı

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

### Rol

This arguments expects a Discord Role. You can use any of the following methods to provide a role:

- Mention the role: `@Admin`
- Use the ID: `102785693046026240`
- Use the name: `Admin`
- Use quotes if the name has a space: `"Admin with a space"`

### Kanal

This arguments expects a Discord Channel. You can use any of the following methods to provide a channel:

- Mention the channel: `#general`
- Use the ID: `409846838129197057`
- Use the name: `general`
- Use quotes if the name has a space: `"general with a space"`

### Komut

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

| Command                           | Description                                                  | Usage                                                            |
| --------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------- |
| [addInvites](#addInvites)         | Kullanıcıya davet puanı ekler/siler.                         | !addInvites \<user\> \<amount\> [reason]                         |
| [clearInvites](#clearInvites)     | Sunucudaki/kullanıcıdaki davetleri temizler.                 | !clearInvites [-d value\|--date=value][-cb\|--clearbonus] [user] |
| [createInvite](#createInvite)     | Özel davet kodları oluştur.                                  | !createInvite \<name\> [channel]                                 |
| [fake](#fake)                     | Hile yapmaya çalışan kullanıcıları bulmanızda yardımcı olur. | !fake [page]                                                     |
| [info](#info)                     | Belirli bir üye hakkında bilgi göster.                       | !info \<user\> [details][page]                                   |
| [inviteCodes](#inviteCodes)       | Get a list of all your invite codes                          | !inviteCodes                                                     |
| [inviteDetails](#inviteDetails)   | Shows details about where your invites are from.             | !inviteDetails [user]                                            |
| [invites](#invites)               | Kişi Davetlerini Göster                                      | !invites [user]                                                  |
| [leaderboard](#leaderboard)       | Show members with most invites.                              | !leaderboard [-c value\|--compare=value][duration] [page]        |
| [removeInvites](#removeInvites)   | cmd.removeInvites.self.description                           | !removeInvites \<user\> \<amount\> [reason]                      |
| [restoreInvites](#restoreInvites) | Restore all previously cleared invites.                      | !restoreInvites [user]                                           |
| [subtractFakes](#subtractFakes)   | Tüm kullanıcılardan sahte davetliler temizlendi.             | !subtractFakes                                                   |
| [subtractLeaves](#subtractLeaves) | Tüm Kullanıcılardan Sunucudan Ayrılanları Sil.               | !subtractLeaves                                                  |

### Ranks

| Command                   | Description                   | Usage                                |
| ------------------------- | ----------------------------- | ------------------------------------ |
| [addRank](#addRank)       | Yeni bir rütbe ekle.          | !addRank \<role\> \<invites\> [info] |
| [fixRanks](#fixRanks)     | cmd.fixRanks.self.description | !fixRanks                            |
| [ranks](#ranks)           | Show all ranks.               | !ranks [page]                        |
| [removeRank](#removeRank) | Remove a rank.                | !removeRank \<rank\>                 |

### Config

| Command                                 | Description                                               | Usage                                       |
| --------------------------------------- | --------------------------------------------------------- | ------------------------------------------- |
| [botConfig](#botConfig)                 | Botun yapılandırmasını göster ve değiştir.                | !botConfig [key][value]                     |
| [config](#config)                       | Sunucunun yapılandırmasını göster ve değiştir.            | !config [key][value]                        |
| [interactiveConfig](#interactiveConfig) | Interactive Config                                        | !interactiveConfig                          |
| [inviteCodeConfig](#inviteCodeConfig)   | Show and change the config of invite codes of the server. | !inviteCodeConfig [key][invitecode] [value] |
| [memberConfig](#memberConfig)           | Show and change the config of members of the server.      | !memberConfig [key][user] [value]           |
| [permissions](#permissions)             | Komutları kullanmak için izinleri yapılandırın.           | !permissions [cmd][role]                    |

### Info

| Command             | Description                                                                       | Usage           |
| ------------------- | --------------------------------------------------------------------------------- | --------------- |
| [botInfo](#botInfo) | Bot hakkında genel bilgi al.                                                      | !botInfo        |
| [credits](#credits) | Bot geliştiricileri ve katkıda bulunanları göster.                                | !credits        |
| [getBot](#getBot)   | Bot için bir davet linki al.                                                      | !getBot         |
| [help](#help)       | Yardımı gösterir.                                                                 | !help [command] |
| [members](#members) | Show member count of current server.                                              | !members        |
| [ping](#ping)       | botun pingi                                                                       | !ping           |
| [prefix](#prefix)   | Botun geçerli ön-ekini gösterir.                                                  | !prefix         |
| [setup](#setup)     | Help with setting up the bot and checking for problems (e.g. missing permissions) | !setup          |
| [support](#support) | Destek sunucumuza katılmak için davet bağlantısı alın.                            | !support        |

### Premium

| Command                   | Description                                                               | Usage             |
| ------------------------- | ------------------------------------------------------------------------- | ----------------- |
| [export](#export)         | InviteManager verilerini bir csv sayfasına aktarın.                       | !export \<type\>  |
| [premium](#premium)       | InviteManager'ın premium versiyonu hakkında bilgi edinmek.                | !premium [action] |
| [tryPremium](#tryPremium) | InviteManager'ın premium sürümünü sınırlı bir süre için ücretsiz deneyin. | !tryPremium       |

### Moderation

| Command                               | Description                                                                                                                                   | Usage                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [ban](#ban)                           | Kullanıcıyı sunucudan banlamak için.                                                                                                          | !ban [-d value\|--deleteMessageDays=value] \<user\> [reason]     |
| [caseDelete](#caseDelete)             | Belirli bir durumu silin.                                                                                                                     | !caseDelete \<caseNumber\> [reason]                              |
| [caseView](#caseView)                 | Belirli bir kasa hakkındaki bilgileri görüntüleyin.                                                                                           | !caseView \<caseNumber\>                                         |
| [check](#check)                       | Bir kullanıcının ihlal ve ceza geçmişini kontrol edin.                                                                                        | !check \<user\>                                                  |
| [clean](#clean)                       | Belirli mesaj türlerinden bir kanalı temizleyin.                                                                                              | !clean \<type\> [numberOfMessages]                               |
| [cleanShort](#cleanShort)             | Clear short messages                                                                                                                          | !cleanShort \<maxTextLength\> [numberOfMessages]                 |
| [cleanText](#cleanText)               | Delete messages containing certain keywords.                                                                                                  | !cleanText \<text\> [numberOfMessages]                           |
| [kick](#kick)                         | Kick a member from the server.                                                                                                                | !kick \<member\> [reason]                                        |
| [mute](#mute)                         | Bir kullanıcı sustur                                                                                                                          | !mute \<user\> [reason]                                          |
| [punishmentConfig](#punishmentConfig) | Configure punishments when reaching a certain amount of strikes.                                                                              | !punishmentConfig [punishment][strikes] [args]                   |
| [purge](#purge)                       | Purge messages in a channel.                                                                                                                  | !purge \<quantity\> [user]                                       |
| [purgeUntil](#purgeUntil)             | Purge messages in a channel up until a specified message.                                                                                     | !purgeUntil \<messageID\>                                        |
| [softBan](#softBan)                   | Ban and then automatically unban a member from the server.                                                                                    | !softBan [-d value\|--deleteMessageDays=value] \<user\> [reason] |
| [strike](#strike)                     | Add strikes to a user                                                                                                                         | !strike \<member\> \<type\> \<amount\>                           |
| [strikeConfig](#strikeConfig)         | Configure strikes received for various violations.                                                                                            | !strikeConfig [violation][strikes]                               |
| [unban](#unban)                       | Bir kullanıcının yasağını kaldır.                                                                                                             | !unban \<user\> [reason]                                         |
| [unhoist](#unhoist)                   | Add a character in front of all members with a special character in front of their name, so they will be shown at the end of the member list. | !unhoist                                                         |
| [unmute](#unmute)                     | Unmute a user                                                                                                                                 | !unmute \<user\>                                                 |
| [warn](#warn)                         | Kullanıcı Uyar                                                                                                                                | !warn \<member\> [reason]                                        |

### Music

| Command                   | Description                                                                                  | Usage                                                   |
| ------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [disconnect](#disconnect) | Botu geçerli ses kanalından çıkarın.                                                         | !disconnect                                             |
| [lyrics](#lyrics)         | Show lyrics of the currently playing song.                                                   | !lyrics [-l\|--live]                                    |
| [mashup](#mashup)         | Create a mashup of 2 songs.                                                                  | !mashup \<videos\>                                      |
| [nowPlaying](#nowPlaying) | Shows information about the currently playing song                                           | !nowPlaying [-p\|--pin]                                 |
| [pause](#pause)           | Pause the current song.                                                                      | !pause                                                  |
| [play](#play)             | Play the song if the queue is empty, otherwise it will add the song to the end of the queue. | !play [-p value\|--platform=value][-n\|--next] \<link\> |
| [queue](#queue)           | Display the songs in the queue.                                                              | !queue                                                  |
| [repeat](#repeat)         | Tekrar çalınacak şarkıyı ayarlayın.                                                          | !repeat                                                 |
| [resume](#resume)         | Çalınan Şarkıyı Sürdür.                                                                      | !resume                                                 |
| [rewind](#rewind)         | Şarkıyı geri sar ve en baştan başla.                                                         | !rewind                                                 |
| [search](#search)         | Search for the search term and let you chose one of the results.                             | !search [-p value\|--platform=value] \<search\>         |
| [seek](#seek)             | Şarkının belirli bir bölümüne atla.                                                          | !seek [duration]                                        |
| [skip](#skip)             | Skip the current song and play the next song in the queue.                                   | !skip [amount]                                          |
| [volume](#volume)         | Set the volume if an argument is passed, or show the current volume.                         | !volume [volume]                                        |

### Other

| Command                             | Description                                                         | Usage                      |
| ----------------------------------- | ------------------------------------------------------------------- | -------------------------- |
| [graph](#graph)                     | Bu sunucudaki çeşitli istatistikler hakkındaki grafikleri gösterir. | !graph \<type\> [duration] |
| [makeMentionable](#makeMentionable) | Make a role mentionable for 60 seconds or until it was used.        | !makeMentionable \<role\>  |
| [mentionRole](#mentionRole)         | Mention an unmentionable role.                                      | !mentionRole \<role\>      |

<a name='addInvites'></a>

---

## !addInvites

Kullanıcıya davet puanı ekler/siler.

### Usage

```text
!addInvites <user> <amount> [reason]
```

### Aliases

- `!add-invites`

### Arguments

| Argument | Type          | Required | Description                                                                                                  | Details |
| -------- | ------------- | -------- | ------------------------------------------------------------------------------------------------------------ | ------- |
| user     | [User](#User) | Yes      | Bonus alacak / kaybedecek kullanıcı davet eder.                                                              |         |
| amount   | [Sayı](#Sayı) | Yes      | Kullanıcının alacağı / kaybedeceği davet miktarı. Davetiyeleri kaldırmak için negatif (-) bir sayı kullanın. |         |
| reason   | [Text](#Text) | No       | Kullanıcıya davet puanı ekleme/silme sebebi.                                                                 |         |

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

Yeni bir rütbe ekle.

### Usage

```text
!addRank <role> <invites> [info]
```

### Aliases

- `!add-rank`
- `!set-rank`
- `!setrank`

### Arguments

| Argument | Type          | Required | Description                                                                                        | Details |
| -------- | ------------- | -------- | -------------------------------------------------------------------------------------------------- | ------- |
| role     | [Rol](#Rol)   | Yes      | Bu rütbeye geldiğinde kullanıcının alacağı rol.                                                    |         |
| invites  | [Sayı](#Sayı) | Yes      | Rütbeye ulaşmak için gereken davet miktarı.                                                        |         |
| info     | [Text](#Text) | No       | Kullanıcıların göreceği bir açıklama, böylece bu rütbe hakkında daha fazla bilgi sahibi olacaklar. |         |

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

Kullanıcıyı sunucudan banlamak için.

### Usage

```text
!ban [-d value|--deleteMessageDays=value] <user> [reason]
```

### Arguments

| Argument | Type          | Required | Description                  | Details |
| -------- | ------------- | -------- | ---------------------------- | ------- |
| user     | [User](#User) | Yes      | Kullanıcıyı yasaklamak için. |         |
| reason   | [Text](#Text) | No       | Kullanıcı neden yasaklandı?  |         |

### Flags

| Flag                              | Short     | Type          | Description                                                                  |
| --------------------------------- | --------- | ------------- | ---------------------------------------------------------------------------- |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [Sayı](#Sayı) | If specified will delete messages by the banned members this many days back. |

### Examples

<a name='botConfig'></a>

---

## !botConfig

Botun yapılandırmasını göster ve değiştir.

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
| value    | [Value](#Value) | No       | Ayarın yeni değeri.                                   |                                                                                                                                             |

### Examples

```text
!botConfig
```

<a name='botInfo'></a>

---

## !botInfo

Bot hakkında genel bilgi al.

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

Belirli bir durumu silin.

### Usage

```text
!caseDelete <caseNumber> [reason]
```

### Aliases

- `!case-delete`
- `!deletecase`
- `!delete-case`

### Arguments

| Argument   | Type          | Required | Description            | Details |
| ---------- | ------------- | -------- | ---------------------- | ------- |
| caseNumber | [Sayı](#Sayı) | Yes      | Durum numarası         |         |
| reason     | [Text](#Text) | No       | Durumu silmenin sebebi |         |

### Examples

```text
!caseDelete 5434 User apologized
```

<a name='caseView'></a>

---

## !caseView

Belirli bir kasa hakkındaki bilgileri görüntüleyin.

### Usage

```text
!caseView <caseNumber>
```

### Aliases

- `!case-view`
- `!viewcase`
- `!view-case`

### Arguments

| Argument   | Type          | Required | Description   | Details |
| ---------- | ------------- | -------- | ------------- | ------- |
| caseNumber | [Sayı](#Sayı) | Yes      | Kasa numarası |         |

### Examples

```text
!caseView 5434
```

<a name='check'></a>

---

## !check

Bir kullanıcının ihlal ve ceza geçmişini kontrol edin.

### Usage

```text
!check <user>
```

### Aliases

- `!history`

### Arguments

| Argument | Type          | Required | Description                 | Details |
| -------- | ------------- | -------- | --------------------------- | ------- |
| user     | [User](#User) | Yes      | Kontrol edilecek kullanıcı. |         |

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

Belirli mesaj türlerinden bir kanalı temizleyin.

### Usage

```text
!clean <type> [numberOfMessages]
```

### Aliases

- `!clear`

### Arguments

| Argument         | Type          | Required | Description                | Details                                                                                                            |
| ---------------- | ------------- | -------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| type             | [Enum](#Enum) | Yes      | Silinecek mesajların türü. | Use one of the following values: `bots`, `embeds`, `emojis`, `images`, `links`, `mentions`, `reacted`, `reactions` |
| numberOfMessages | [Sayı](#Sayı) | No       | Aranacak mesaj sayısı.     |                                                                                                                    |

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

| Argument         | Type          | Required | Description                                     | Details |
| ---------------- | ------------- | -------- | ----------------------------------------------- | ------- |
| maxTextLength    | [Sayı](#Sayı) | Yes      | All messages shorter than this will be deleted. |         |
| numberOfMessages | [Sayı](#Sayı) | No       | Number of messages that will be searched.       |         |

### Examples

<a name='cleanText'></a>

---

## !cleanText

Delete messages containing certain keywords.

### Usage

```text
!cleanText <text> [numberOfMessages]
```

### Aliases

- `!clean-text`
- `!cleartext`
- `!clear-text`

### Arguments

| Argument         | Type          | Required | Description                                        | Details |
| ---------------- | ------------- | -------- | -------------------------------------------------- | ------- |
| text             | [Text](#Text) | Yes      | All messages containing this word will be deleted. |         |
| numberOfMessages | [Sayı](#Sayı) | No       | Number of messages that will be searched.          |         |

### Examples

<a name='clearInvites'></a>

---

## !clearInvites

Sunucudaki/kullanıcıdaki davetleri temizler.

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

Sunucunun yapılandırmasını göster ve değiştir.

### Usage

```text
!config [key] [value]
```

### Aliases

- `!c`

### Arguments

| Argument | Type            | Required | Description                                           | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------- | --------------- | -------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| key      | [Enum](#Enum)   | No       | Göstermek/değiştirmek istediğiniz yapılandırma ayarı. | Use one of the following values: `announcementVoice`, `announceNextSong`, `autoModAllCapsEnabled`, `autoModAllCapsMinCharacters`, `autoModAllCapsPercentageCaps`, `autoModDeleteBotMessage`, `autoModDeleteBotMessageTimeoutInSeconds`, `autoModDisabledForOldMembers`, `autoModDisabledForOldMembersThreshold`, `autoModDuplicateTextEnabled`, `autoModDuplicateTextTimeframeInSeconds`, `autoModEmojisEnabled`, `autoModEmojisMaxNumberOfEmojis`, `autoModEnabled`, `autoModHoistEnabled`, `autoModIgnoredChannels`, `autoModIgnoredRoles`, `autoModInvitesEnabled`, `autoModLinksBlacklist`, `autoModLinksEnabled`, `autoModLinksFollowRedirects`, `autoModLinksWhitelist`, `autoModLogEnabled`, `autoModMentionRolesEnabled`, `autoModMentionRolesMaxNumberOfMentions`, `autoModMentionUsersEnabled`, `autoModMentionUsersMaxNumberOfMentions`, `autoModModeratedChannels`, `autoModModeratedRoles`, `autoModQuickMessagesEnabled`, `autoModQuickMessagesNumberOfMessages`, `autoModQuickMessagesTimeframeInSeconds`, `autoModWordsBlacklist`, `autoModWordsEnabled`, `autoSubtractFakes`, `autoSubtractLeaves`, `autoSubtractLeaveThreshold`, `captchaVerificationFailedMessage`, `captchaVerificationLogEnabled`, `captchaVerificationOnJoin`, `captchaVerificationSuccessMessage`, `captchaVerificationTimeout`, `captchaVerificationWelcomeMessage`, `channels`, `fadeMusicEndDelay`, `fadeMusicOnTalk`, `getUpdates`, `hideLeftMembersFromLeaderboard`, `ignoredChannels`, `joinMessage`, `joinMessageChannel`, `lang`, `leaderboardStyle`, `leaveMessage`, `leaveMessageChannel`, `logChannel`, `modLogChannel`, `modPunishmentBanDeleteMessage`, `modPunishmentKickDeleteMessage`, `modPunishmentMuteDeleteMessage`, `modPunishmentSoftbanDeleteMessage`, `modPunishmentWarnDeleteMessage`, `musicVolume`, `mutedRole`, `prefix`, `rankAnnouncementChannel`, `rankAnnouncementMessage`, `rankAssignmentStyle` |
| value    | [Value](#Value) | No       | Ayarın yeni değeri.                                   |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

### Examples

```text
!config
```

<a name='createInvite'></a>

---

## !createInvite

Özel davet kodları oluştur.

### Usage

```text
!createInvite <name> [channel]
```

### Aliases

- `!create-invite`

### Arguments

| Argument | Type            | Required | Description                                                                            | Details |
| -------- | --------------- | -------- | -------------------------------------------------------------------------------------- | ------- |
| name     | [Text](#Text)   | Yes      | Davet kodunun adı.                                                                     |         |
| channel  | [Kanal](#Kanal) | No       | The channel for which the invite code is created. Uses the current channel by default. |         |

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

Bot geliştiricileri ve katkıda bulunanları göster.

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

Botu geçerli ses kanalından çıkarın.

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

InviteManager verilerini bir csv sayfasına aktarın.

### Usage

```text
!export <type>
```

### Arguments

| Argument | Type          | Required | Description                    | Details                                        |
| -------- | ------------- | -------- | ------------------------------ | ---------------------------------------------- |
| type     | [Enum](#Enum) | Yes      | İstediğiniz dışa aktarma türü. | Use one of the following values: `leaderboard` |

### Examples

```text
!export leaderboard
```

<a name='fake'></a>

---

## !fake

Hile yapmaya çalışan kullanıcıları bulmanızda yardımcı olur.

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

| Argument | Type          | Required | Description                         | Details |
| -------- | ------------- | -------- | ----------------------------------- | ------- |
| page     | [Sayı](#Sayı) | No       | Which page of the fake list to get. |         |

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

Bot için bir davet linki al.

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

Bu sunucudaki çeşitli istatistikler hakkındaki grafikleri gösterir.

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
| type     | [Enum](#Enum)         | Yes      | Gösterilecek tablonun türü.        | Use one of the following values: `joins`, `leaves`, `usage` |
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

Yardımı gösterir.

### Usage

```text
!help [command]
```

### Arguments

| Argument | Type            | Required | Description                                  | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------- | --------------- | -------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command  | [Komut](#Komut) | No       | The command to get detailed information for. | Use one of the following values: `addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fake`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lyrics`, `makeMentionable`, `mashup`, `memberConfig`, `members`, `mentionRole`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |

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

Belirli bir üye hakkında bilgi göster.

### Usage

```text
!info <user> [details] [page]
```

### Aliases

- `!showinfo`

### Arguments

| Argument | Type          | Required | Description                                                                   | Details                                             |
| -------- | ------------- | -------- | ----------------------------------------------------------------------------- | --------------------------------------------------- |
| user     | [User](#User) | Yes      | The user for whom you want to see additional info.                            |                                                     |
| details  | [Enum](#Enum) | No       | Bir üye hakkında sadece belirli detayları isteyin.                            | Use one of the following values: `bonus`, `members` |
| page     | [Sayı](#Sayı) | No       | What page of the details to show. You can also use the reactions to navigate. |                                                     |

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

Kişi Davetlerini Göster

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

| Argument | Type          | Required | Description                | Details |
| -------- | ------------- | -------- | -------------------------- | ------- |
| member   | [Üye](#Üye)   | Yes      | Kullanıcı Atıldı.          |         |
| reason   | [Text](#Text) | No       | Kullanıcının Atılma Sebebi |         |

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
| page     | [Sayı](#Sayı)         | No       | Which page of the leaderboard to get.                |         |

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

| Argument | Type        | Required | Description                        | Details |
| -------- | ----------- | -------- | ---------------------------------- | ------- |
| role     | [Rol](#Rol) | Yes      | The role that you want to mention. |         |

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

| Argument | Type        | Required | Description                        | Details |
| -------- | ----------- | -------- | ---------------------------------- | ------- |
| role     | [Rol](#Rol) | Yes      | The role that you want to mention. |         |

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

Bir kullanıcı sustur

### Usage

```text
!mute <user> [reason]
```

### Arguments

| Argument | Type          | Required | Description                        | Details |
| -------- | ------------- | -------- | ---------------------------------- | ------- |
| user     | [Üye](#Üye)   | Yes      | The user that should be muted.     |         |
| reason   | [Text](#Text) | No       | The reason why this user is muted. |         |

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

Komutları kullanmak için izinleri yapılandırın.

### Usage

```text
!permissions [cmd] [role]
```

### Aliases

- `!perms`

### Arguments

| Argument | Type            | Required | Description                                                       | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------- | --------------- | -------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cmd      | [Komut](#Komut) | No       | The command to configure permissions for.                         | Use one of the following values: `addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fake`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lyrics`, `makeMentionable`, `mashup`, `memberConfig`, `members`, `mentionRole`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |
| role     | [Rol](#Rol)     | No       | The role which should be granted or denied access to the command. |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

### Examples

```text
!permissions
```

<a name='ping'></a>

---

## !ping

botun pingi

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

Botun geçerli ön-ekini gösterir.

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

InviteManager'ın premium versiyonu hakkında bilgi edinmek.

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

| Argument   | Type          | Required | Description                                       | Details                                                                   |
| ---------- | ------------- | -------- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| punishment | [Enum](#Enum) | No       | Type of punishment to use.                        | Use one of the following values: `ban`, `kick`, `mute`, `softban`, `warn` |
| strikes    | [Sayı](#Sayı) | No       | Number of strikes for this punishment to be used. |                                                                           |
| args       | [Text](#Text) | No       | Arguments passed to the punishment.               |                                                                           |

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

| Argument | Type          | Required | Description                          | Details |
| -------- | ------------- | -------- | ------------------------------------ | ------- |
| quantity | [Sayı](#Sayı) | Yes      | How many messages should be deleted. |         |
| user     | [User](#User) | No       | User whose messages are deleted.     |         |

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

| Argument | Type          | Required | Description              | Details |
| -------- | ------------- | -------- | ------------------------ | ------- |
| page     | [Sayı](#Sayı) | No       | cmd.ranks.self.args.page |         |

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

| Argument | Type          | Required | Description                        | Details |
| -------- | ------------- | -------- | ---------------------------------- | ------- |
| user     | [User](#User) | Yes      | cmd.removeInvites.self.args.user   |         |
| amount   | [Sayı](#Sayı) | Yes      | cmd.removeInvites.self.args.amount |         |
| reason   | [Text](#Text) | No       | cmd.removeInvites.self.args.reason |         |

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

| Argument | Type        | Required | Description                                | Details |
| -------- | ----------- | -------- | ------------------------------------------ | ------- |
| rank     | [Rol](#Rol) | Yes      | The for which you want to remove the rank. |         |

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

Tekrar çalınacak şarkıyı ayarlayın.

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

Çalınan Şarkıyı Sürdür.

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

Şarkıyı geri sar ve en baştan başla.

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

| Argument | Type          | Required | Description  | Details |
| -------- | ------------- | -------- | ------------ | ------- |
| search   | [Text](#Text) | Yes      | Arama terimi |         |

### Flags

| Flag                     | Short     | Type          | Description                                               |
| ------------------------ | --------- | ------------- | --------------------------------------------------------- |
| &#x2011;&#x2011;platform | &#x2011;p | [Enum](#Enum) | Select the platform where you want the song to be played. |

### Examples

<a name='seek'></a>

---

## !seek

Şarkının belirli bir bölümüne atla.

### Usage

```text
!seek [duration]
```

### Arguments

| Argument | Type          | Required | Description                                                                | Details |
| -------- | ------------- | -------- | -------------------------------------------------------------------------- | ------- |
| duration | [Sayı](#Sayı) | No       | The position the song will be skipped to (from the beginning, in seconds). |         |

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

| Argument | Type          | Required | Description                     | Details |
| -------- | ------------- | -------- | ------------------------------- | ------- |
| amount   | [Sayı](#Sayı) | No       | How many songs will be skipped. |         |

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

| Argument | Type          | Required | Description                  | Details |
| -------- | ------------- | -------- | ---------------------------- | ------- |
| user     | [Üye](#Üye)   | Yes      | Kullanıcı Yasaklamak.        |         |
| reason   | [Text](#Text) | No       | Kullanıcı neden yasaklandı ? |         |

### Flags

| Flag                              | Short     | Type          | Description                              |
| --------------------------------- | --------- | ------------- | ---------------------------------------- |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [Sayı](#Sayı) | cmd.softBan.self.flags.deleteMessageDays |

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

| Argument | Type          | Required | Description                       | Details                                                                                                                                                      |
| -------- | ------------- | -------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| member   | [Üye](#Üye)   | Yes      | The member receiving the strikes  |                                                                                                                                                              |
| type     | [Enum](#Enum) | Yes      | The type of the violation         | Use one of the following values: `allCaps`, `duplicateText`, `emojis`, `hoist`, `invites`, `links`, `mentionRoles`, `mentionUsers`, `quickMessages`, `words` |
| amount   | [Sayı](#Sayı) | Yes      | The amount of strikes to be added |                                                                                                                                                              |

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

| Argument  | Type          | Required | Description        | Details                                                                                                                                                      |
| --------- | ------------- | -------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| violation | [Enum](#Enum) | No       | Violation type.    | Use one of the following values: `allCaps`, `duplicateText`, `emojis`, `hoist`, `invites`, `links`, `mentionRoles`, `mentionUsers`, `quickMessages`, `words` |
| strikes   | [Sayı](#Sayı) | No       | Number of strikes. |                                                                                                                                                              |

### Examples

```text
!strikeConfig
```

<a name='subtractFakes'></a>

---

## !subtractFakes

Tüm kullanıcılardan sahte davetliler temizlendi.

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

Tüm Kullanıcılardan Sunucudan Ayrılanları Sil.

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

Destek sunucumuza katılmak için davet bağlantısı alın.

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

InviteManager'ın premium sürümünü sınırlı bir süre için ücretsiz deneyin.

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

Bir kullanıcının yasağını kaldır.

### Usage

```text
!unban <user> [reason]
```

### Arguments

| Argument | Type          | Required | Description                             | Details |
| -------- | ------------- | -------- | --------------------------------------- | ------- |
| user     | [User](#User) | Yes      | The user that should be unbanned.       |         |
| reason   | [Text](#Text) | No       | Bu kullanıcının yasaklanmasının nedeni. |         |

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

| Argument | Type        | Required | Description                      | Details |
| -------- | ----------- | -------- | -------------------------------- | ------- |
| user     | [Üye](#Üye) | Yes      | The user that should be unmuted. |         |

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

| Argument | Type          | Required | Description                          | Details |
| -------- | ------------- | -------- | ------------------------------------ | ------- |
| volume   | [Sayı](#Sayı) | No       | The value the volume will be set to. |         |

### Examples

```text
!volume
```

<a name='warn'></a>

---

## !warn

Kullanıcı Uyar

### Usage

```text
!warn <member> [reason]
```

### Arguments

| Argument | Type          | Required | Description          | Details |
| -------- | ------------- | -------- | -------------------- | ------- |
| member   | [Üye](#Üye)   | Yes      | Member to warn.      |         |
| reason   | [Text](#Text) | No       | Üye neden uyarıldı ? |         |

### Examples
