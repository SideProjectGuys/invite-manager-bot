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

### Davet Kodu

This arguments expects a Discord Invite Code.

> You can put only the part after `https://discord.gg/` to prevent Discord from creating a preview.

### Kullanıcı

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

Bu argümanlar bir Discord Kanalı bekler. Kanal sağlamak için aşağıdaki yöntemlerden herhangi birini kullanabilirsiniz:

- Kanaldan bahsedin: `#general`
- Kanal ID kullanın: `409846838129197057`
- Kanal adını kullanın: `genel`
- Adda bir boşluk varsa tırnak işareti kullanın: `"boşluklu genel"`

### Komut

Bu argüman bu botun bir komutunu bekliyor. Komut sağlamak için aşağıdaki yöntemlerden birini kullanabilirsiniz:

- Komut adını kullanın: `invites`
- Komutun takma adını kullanın: `p`

### Metin

This arguments expects any text. You can use quotes (`"Text with quotes"`) for text that has spaces.

> If the text is the last argument you don't have to use quotes.

### Tarih

Bu argüman bir tarih bekliyor. Çeşitli formatlar kullanabilirsiniz, ancak şunları öneririz: `YYYY-AA-GG`

### Süre

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

| Command                           | Description                                                       | Usage                                                            |
| --------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------- |
| [addInvites](#addInvites)         | Kullanıcıya davet puanı ekler/siler.                              | !addInvites \<user\> \<amount\> [reason]                         |
| [clearInvites](#clearInvites)     | Sunucudaki/kullanıcıdaki davetleri temizler.                      | !clearInvites [-d value\|--date=value][-cb\|--clearbonus] [user] |
| [createInvite](#createInvite)     | Özel davet kodları oluştur.                                       | !createInvite \<name\> [channel]                                 |
| [info](#info)                     | Belirli bir üye hakkında bilgi göster.                            | !info \<user\> [details][page]                                   |
| [inviteCodes](#inviteCodes)       | Tüm davet kodlarınızın bir listesini alın                         | !inviteCodes                                                     |
| [inviteDetails](#inviteDetails)   | Davetiyelerinizin nereden geldiğiyle ilgili ayrıntıları gösterir. | !inviteDetails [user]                                            |
| [invites](#invites)               | Kişi Davetlerini Göster                                           | !invites [user]                                                  |
| [leaderboard](#leaderboard)       | En çok davet edilen üyeleri göster.                               | !leaderboard [page]                                              |
| [removeInvites](#removeInvites)   | Bir kullanıcıdan belirtilen miktarda daveti kaldırır.             | !removeInvites \<user\> \<amount\> [reason]                      |
| [restoreInvites](#restoreInvites) | Önceden temizlenmiş tüm davetiyeleri geri yükleyin.               | !restoreInvites [user]                                           |
| [subtractFakes](#subtractFakes)   | Tüm kullanıcılardan sahte davetliler temizlendi.                  | !subtractFakes                                                   |
| [subtractLeaves](#subtractLeaves) | Tüm Kullanıcılardan Sunucudan Ayrılanları Sil.                    | !subtractLeaves                                                  |

### Ranks

| Command                   | Description                          | Usage                                |
| ------------------------- | ------------------------------------ | ------------------------------------ |
| [addRank](#addRank)       | Yeni bir rütbe ekle.                 | !addRank \<role\> \<invites\> [info] |
| [fixRanks](#fixRanks)     | Rolün silindiği tüm rütbeleri siler. | !fixRanks                            |
| [ranks](#ranks)           | Tüm rütbeleri göster.                | !ranks [page]                        |
| [removeRank](#removeRank) | Bir rank'ı kaldırın.                 | !removeRank \<rank\>                 |

### Config

| Command                                 | Description                                                         | Usage                                       |
| --------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------- |
| [botConfig](#botConfig)                 | Botun yapılandırmasını göster ve değiştir.                          | !botConfig [key][value]                     |
| [config](#config)                       | Sunucunun yapılandırmasını göster ve değiştir.                      | !config [key][value]                        |
| [interactiveConfig](#interactiveConfig) | Etkileşimli Yapılandırma                                            | !interactiveConfig                          |
| [inviteCodeConfig](#inviteCodeConfig)   | Sunucunun davet kodlarının yapılandırmasını gösterin ve değiştirin. | !inviteCodeConfig [key][invitecode] [value] |
| [memberConfig](#memberConfig)           | Sunucunun üyelerinin yapılandırmasını gösterin ve değiştirin.       | !memberConfig [key][user] [value]           |
| [permissions](#permissions)             | Komutları kullanmak için izinleri yapılandırın.                     | !permissions [cmd][role]                    |

### Info

| Command             | Description                                                                   | Usage           |
| ------------------- | ----------------------------------------------------------------------------- | --------------- |
| [botInfo](#botInfo) | Bot hakkında genel bilgi al.                                                  | !botInfo        |
| [credits](#credits) | Bot geliştiricileri ve katkıda bulunanları göster.                            | !credits        |
| [getBot](#getBot)   | Bot için bir davet linki al.                                                  | !getBot         |
| [help](#help)       | Yardımı gösterir.                                                             | !help [command] |
| [members](#members) | Geçerli sunucunun üye sayısını göster.                                        | !members        |
| [ping](#ping)       | botun pingi                                                                   | !ping           |
| [prefix](#prefix)   | Botun geçerli ön-ekini gösterir.                                              | !prefix         |
| [setup](#setup)     | Botu ayarlama ve sorunları kontrol etme konusunda yardım (örn. Eksik izinler) | !setup          |
| [support](#support) | Destek sunucumuza katılmak için davet bağlantısı alın.                        | !support        |

### Premium

| Command                   | Description                                                               | Usage             |
| ------------------------- | ------------------------------------------------------------------------- | ----------------- |
| [export](#export)         | InviteManager verilerini bir csv sayfasına aktarın.                       | !export \<type\>  |
| [premium](#premium)       | InviteManager'ın premium versiyonu hakkında bilgi edinmek.                | !premium [action] |
| [tryPremium](#tryPremium) | InviteManager'ın premium sürümünü sınırlı bir süre için ücretsiz deneyin. | !tryPremium       |

### Moderation

| Command                               | Description                                                                                                                               | Usage                                                            |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [ban](#ban)                           | Kullanıcıyı sunucudan banlamak için.                                                                                                      | !ban [-d value\|--deleteMessageDays=value] \<user\> [reason]     |
| [caseDelete](#caseDelete)             | Belirli bir durumu silin.                                                                                                                 | !caseDelete \<caseNumber\> [reason]                              |
| [caseView](#caseView)                 | Belirli bir kasa hakkındaki bilgileri görüntüleyin.                                                                                       | !caseView \<caseNumber\>                                         |
| [check](#check)                       | Bir kullanıcının ihlal ve ceza geçmişini kontrol edin.                                                                                    | !check \<user\>                                                  |
| [clean](#clean)                       | Belirli mesaj türlerinden bir kanalı temizleyin.                                                                                          | !clean \<type\> [numberOfMessages]                               |
| [cleanShort](#cleanShort)             | Kısa mesajları temizle                                                                                                                    | !cleanShort \<maxTextLength\> [numberOfMessages]                 |
| [cleanText](#cleanText)               | Belirli anahtar kelimeleri içeren iletileri sil                                                                                           | !cleanText \<text\> [numberOfMessages]                           |
| [kick](#kick)                         | Sunucudan bir üyeyi atar.                                                                                                                 | !kick \<member\> [reason]                                        |
| [lockdown](#lockdown)                 | Lockdown a specific channel (Prevents anyone without special roles from sending messages)                                                 | !lockdown [-t value\|--timeout=value][channel]                   |
| [mute](#mute)                         | Bir kullanıcı sustur                                                                                                                      | !mute [-d value\|--duration=value] \<user\> [reason]             |
| [punishmentConfig](#punishmentConfig) | Configure punishments when reaching a certain amount of strikes.                                                                          | !punishmentConfig [punishment][strikes] [args]                   |
| [purge](#purge)                       | Bir kanaldaki mesajları temizleme                                                                                                         | !purge \<quantity\> [user]                                       |
| [purgeUntil](#purgeUntil)             | Bir kanaldaki mesajları belirtilen mesaja kadar temizleyin.                                                                               | !purgeUntil \<messageID\>                                        |
| [softBan](#softBan)                   | Ban and then automatically unban a member from the server.                                                                                | !softBan [-d value\|--deleteMessageDays=value] \<user\> [reason] |
| [strike](#strike)                     | Add strikes to a user                                                                                                                     | !strike \<member\> \<type\> \<amount\>                           |
| [strikeConfig](#strikeConfig)         | Configure strikes received for various violations.                                                                                        | !strikeConfig [violation][strikes]                               |
| [unban](#unban)                       | Bir kullanıcının yasağını kaldır.                                                                                                         | !unban \<user\> [reason]                                         |
| [unhoist](#unhoist)                   | Tüm üyelerin önüne, adlarının önünde özel bir karakter olacak şekilde bir karakter ekleyin, böylece üye listesinin sonunda gösterilirler. | !unhoist                                                         |
| [unmute](#unmute)                     | Unmute a user                                                                                                                             | !unmute \<user\>                                                 |
| [warn](#warn)                         | Kullanıcı Uyar                                                                                                                            | !warn \<member\> [reason]                                        |

### Music

| Command                   | Description                                                           | Usage                                                   |
| ------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------- |
| [disconnect](#disconnect) | Botu geçerli ses kanalından çıkarın.                                  | !disconnect                                             |
| [lyrics](#lyrics)         | Şu anda çalan şarkının sözlerini göster.                              | !lyrics [-l\|--live]                                    |
| [mashup](#mashup)         | Create a mashup of 2 songs.                                           | !mashup \<videos\>                                      |
| [nowPlaying](#nowPlaying) | Çalmakta olan şarkı hakkında bilgi gösterir                           | !nowPlaying [-p\|--pin]                                 |
| [pause](#pause)           | Çalan şarkıyı durdur.                                                 | !pause                                                  |
| [play](#play)             | Sıra boşsa şarkıyı açın, aksi takdirde şarkıyı kuyruğun sonuna ekler. | !play [-p value\|--platform=value][-n\|--next] \<link\> |
| [queue](#queue)           | Şarkıları kuyrukta göster                                             | !queue                                                  |
| [repeat](#repeat)         | Tekrar çalınacak şarkıyı ayarlayın.                                   | !repeat                                                 |
| [resume](#resume)         | Çalınan Şarkıyı Sürdür.                                               | !resume                                                 |
| [rewind](#rewind)         | Şarkıyı geri sar ve en baştan başla.                                  | !rewind                                                 |
| [search](#search)         | Arama terimini arayın ve sonuçlardan birini seçmenize izin verin.     | !search [-p value\|--platform=value] \<search\>         |
| [seek](#seek)             | Şarkının belirli bir bölümüne atla.                                   | !seek [duration]                                        |
| [skip](#skip)             | Geçerli şarkıyı atlayın ve sıradaki bir sonraki şarkıyı çalın.        | !skip [amount]                                          |
| [volume](#volume)         | Set the volume if an argument is passed, or show the current volume.  | !volume [volume]                                        |

### Other

| Command         | Description                                                         | Usage                      |
| --------------- | ------------------------------------------------------------------- | -------------------------- |
| [graph](#graph) | Bu sunucudaki çeşitli istatistikler hakkındaki grafikleri gösterir. | !graph \<type\> [from][to] |

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

| Argument | Type                    | Required | Description                                                                                                  | Details |
| -------- | ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------ | ------- |
| user     | [Kullanıcı](#Kullanıcı) | Yes      | Bonus alacak / kaybedecek kullanıcı davet eder.                                                              |         |
| amount   | [Sayı](#Sayı)           | Yes      | Kullanıcının alacağı / kaybedeceği davet miktarı. Davetiyeleri kaldırmak için negatif (-) bir sayı kullanın. |         |
| reason   | [Metin](#Metin)         | No       | Kullanıcıya davet puanı ekleme/silme sebebi.                                                                 |         |

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

| Argument | Type            | Required | Description                                                                                        | Details |
| -------- | --------------- | -------- | -------------------------------------------------------------------------------------------------- | ------- |
| role     | [Rol](#Rol)     | Yes      | Bu rütbeye geldiğinde kullanıcının alacağı rol.                                                    |         |
| invites  | [Sayı](#Sayı)   | Yes      | Rütbeye ulaşmak için gereken davet miktarı.                                                        |         |
| info     | [Metin](#Metin) | No       | Kullanıcıların göreceği bir açıklama, böylece bu rütbe hakkında daha fazla bilgi sahibi olacaklar. |         |

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

| Argument | Type                    | Required | Description                  | Details |
| -------- | ----------------------- | -------- | ---------------------------- | ------- |
| user     | [Kullanıcı](#Kullanıcı) | Yes      | Kullanıcıyı yasaklamak için. |         |
| reason   | [Metin](#Metin)         | No       | Kullanıcı neden yasaklandı?  |         |

### Flags

| Flag                              | Short     | Type          | Description                                                         |
| --------------------------------- | --------- | ------------- | ------------------------------------------------------------------- |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [Sayı](#Sayı) | Belirtilirse, yasaklanan üyelerin mesajlarını bu günler önce siler. |

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

| Argument | Type            | Required | Description                                                 | Details                                                                                                                                     |
| -------- | --------------- | -------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| key      | [Enum](#Enum)   | No       | Göstermek / değiştirmek istediğiniz bot yapılandırma ayarı. | Use one of the following values: `activityEnabled`, `activityMessage`, `activityStatus`, `activityType`, `activityUrl`, `embedDefaultColor` |
| value    | [Değer](#Değer) | No       | Ayarın yeni değeri.                                         |                                                                                                                                             |

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

| Argument   | Type            | Required | Description            | Details |
| ---------- | --------------- | -------- | ---------------------- | ------- |
| caseNumber | [Sayı](#Sayı)   | Yes      | Durum numarası         |         |
| reason     | [Metin](#Metin) | No       | Durumu silmenin sebebi |         |

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

| Argument | Type                    | Required | Description                 | Details |
| -------- | ----------------------- | -------- | --------------------------- | ------- |
| user     | [Kullanıcı](#Kullanıcı) | Yes      | Kontrol edilecek kullanıcı. |         |

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

Kısa mesajları temizle

### Usage

```text
!cleanShort <maxTextLength> [numberOfMessages]
```

### Aliases

- `!clean-short`
- `!clearshort`
- `!clear-short`

### Arguments

| Argument         | Type          | Required | Description                                 | Details |
| ---------------- | ------------- | -------- | ------------------------------------------- | ------- |
| maxTextLength    | [Sayı](#Sayı) | Yes      | Bundan kısa olan tüm mesajlar silinecektir. |         |
| numberOfMessages | [Sayı](#Sayı) | No       | Aranacak mesaj sayısı.                      |         |

### Examples

<a name='cleanText'></a>

---

## !cleanText

Belirli anahtar kelimeleri içeren iletileri sil

### Usage

```text
!cleanText <text> [numberOfMessages]
```

### Aliases

- `!clean-text`
- `!cleartext`
- `!clear-text`

### Arguments

| Argument         | Type            | Required | Description                                | Details |
| ---------------- | --------------- | -------- | ------------------------------------------ | ------- |
| text             | [Metin](#Metin) | Yes      | Bu kelimeyi içeren tüm mesajlar silinecek. |         |
| numberOfMessages | [Sayı](#Sayı)   | No       | Aranacak mesaj sayısı.                     |         |

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

| Argument | Type                    | Required | Description                                                                       | Details |
| -------- | ----------------------- | -------- | --------------------------------------------------------------------------------- | ------- |
| user     | [Kullanıcı](#Kullanıcı) | No       | Kullanıcıdan tüm davetiyeleri temizleyecek. Atlanırsa tüm kullanıcıları temizler. |         |

### Flags

| Flag                       | Short      | Type                | Description                                                                                          |
| -------------------------- | ---------- | ------------------- | ---------------------------------------------------------------------------------------------------- |
| &#x2011;&#x2011;date       | &#x2011;d  | [Tarih](#Tarih)     | Davetiyelerin sayıldığı tarih başlangıcı. Varsayılan bugün.                                          |
| &#x2011;&#x2011;clearBonus | &#x2011;cb | [Boolean](#Boolean) | Bonus davetlerini de temizlemek için bu bayrağı ekleyin. Aksi takdirde bonus davetlerine dokunulmaz. |

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

| Argument | Type            | Required | Description                                           | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------- | --------------- | -------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key      | [Enum](#Enum)   | No       | Göstermek/değiştirmek istediğiniz yapılandırma ayarı. | Use one of the following values: `announcementVoice`, `announceNextSong`, `autoModAllCapsEnabled`, `autoModAllCapsMinCharacters`, `autoModAllCapsPercentageCaps`, `autoModDeleteBotMessage`, `autoModDeleteBotMessageTimeoutInSeconds`, `autoModDisabledForOldMembers`, `autoModDisabledForOldMembersThreshold`, `autoModDuplicateTextEnabled`, `autoModDuplicateTextTimeframeInSeconds`, `autoModEmojisEnabled`, `autoModEmojisMaxNumberOfEmojis`, `autoModEnabled`, `autoModHoistEnabled`, `autoModIgnoredChannels`, `autoModIgnoredRoles`, `autoModInvitesEnabled`, `autoModLinksBlacklist`, `autoModLinksEnabled`, `autoModLinksFollowRedirects`, `autoModLinksWhitelist`, `autoModLogEnabled`, `autoModMentionRolesEnabled`, `autoModMentionRolesMaxNumberOfMentions`, `autoModMentionUsersEnabled`, `autoModMentionUsersMaxNumberOfMentions`, `autoModModeratedChannels`, `autoModModeratedRoles`, `autoModQuickMessagesEnabled`, `autoModQuickMessagesNumberOfMessages`, `autoModQuickMessagesTimeframeInSeconds`, `autoModWordsBlacklist`, `autoModWordsEnabled`, `autoSubtractFakes`, `autoSubtractLeaves`, `autoSubtractLeaveThreshold`, `captchaVerificationFailedMessage`, `captchaVerificationLogEnabled`, `captchaVerificationOnJoin`, `captchaVerificationSuccessMessage`, `captchaVerificationTimeout`, `captchaVerificationWelcomeMessage`, `channels`, `defaultMusicPlatform`, `disabledMusicPlatforms`, `fadeMusicEndDelay`, `fadeMusicOnTalk`, `getUpdates`, `hideLeftMembersFromLeaderboard`, `ignoredChannels`, `joinMessage`, `joinMessageChannel`, `joinRoles`, `lang`, `leaderboardStyle`, `leaveMessage`, `leaveMessageChannel`, `logChannel`, `modLogChannel`, `modPunishmentBanDeleteMessage`, `modPunishmentKickDeleteMessage`, `modPunishmentMuteDeleteMessage`, `modPunishmentSoftbanDeleteMessage`, `modPunishmentWarnDeleteMessage`, `musicVolume`, `mutedRole`, `prefix`, `rankAnnouncementChannel`, `rankAnnouncementMessage`, `rankAssignmentStyle` |
| value    | [Değer](#Değer) | No       | Ayarın yeni değeri.                                   |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

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

| Argument | Type            | Required | Description                                                                   | Details |
| -------- | --------------- | -------- | ----------------------------------------------------------------------------- | ------- |
| name     | [Metin](#Metin) | Yes      | Davet kodunun adı.                                                            |         |
| channel  | [Kanal](#Kanal) | No       | Davet kodunun oluşturulduğu kanal. Geçerli kanalı varsayılan olarak kullanır. |         |

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

<a name='fixRanks'></a>

---

## !fixRanks

Rolün silindiği tüm rütbeleri siler.

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
!graph <type> [from] [to]
```

### Aliases

- `!g`
- `!chart`

### Arguments

| Argument | Type            | Required | Description                 | Details                                                              |
| -------- | --------------- | -------- | --------------------------- | -------------------------------------------------------------------- |
| type     | [Enum](#Enum)   | Yes      | Gösterilecek tablonun türü. | Use one of the following values: `joins`, `joinsAndLeaves`, `leaves` |
| from     | [Tarih](#Tarih) | No       | Grafiğin başlangıç tarihi   |                                                                      |
| to       | [Tarih](#Tarih) | No       | Grafiğin bitiş tarihi       |                                                                      |

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

| Argument | Type            | Required | Description                           | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------- | --------------- | -------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command  | [Komut](#Komut) | No       | Hakkında ayrıntılı bilgi alma komutu. | Use one of the following values: `addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lockdown`, `lyrics`, `mashup`, `memberConfig`, `members`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |

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

| Argument | Type                    | Required | Description                                                                                     | Details                                             |
| -------- | ----------------------- | -------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| user     | [Kullanıcı](#Kullanıcı) | Yes      | Ek bilgi görmek istediğiniz kullanıcı.                                                          |                                                     |
| details  | [Enum](#Enum)           | No       | Bir üye hakkında sadece belirli detayları isteyin.                                              | Use one of the following values: `bonus`, `members` |
| page     | [Sayı](#Sayı)           | No       | Ayrıntıların hangi sayfasında gösterileceği. Reaksiyonlarda gezinmek için de kullanabilirsiniz. |                                                     |

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

Etkileşimli Yapılandırma

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

Sunucunun davet kodlarının yapılandırmasını gösterin ve değiştirin.

### Usage

```text
!inviteCodeConfig [key] [inviteCode] [value]
```

### Aliases

- `!invite-code-config`
- `!icc`

### Arguments

| Argument   | Type                     | Required | Description                                             | Details                                          |
| ---------- | ------------------------ | -------- | ------------------------------------------------------- | ------------------------------------------------ |
| key        | [Enum](#Enum)            | No       | Göstermek / değiştirmek istediğiniz yapılandırma ayarı. | Use one of the following values: `name`, `roles` |
| inviteCode | [Davet Kodu](#DavetKodu) | No       | Ayarlarını değiştirmek istediğiniz davet kodu.          |                                                  |
| value      | [Değer](#Değer)          | No       | Ayarın yeni değeri                                      |                                                  |

### Examples

```text
!inviteCodeConfig
```

<a name='inviteCodes'></a>

---

## !inviteCodes

Tüm davet kodlarınızın bir listesini alın

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

Davetiyelerinizin nereden geldiğiyle ilgili ayrıntıları gösterir.

### Usage

```text
!inviteDetails [user]
```

### Aliases

- `!invite-details`

### Arguments

| Argument | Type                    | Required | Description                                         | Details |
| -------- | ----------------------- | -------- | --------------------------------------------------- | ------- |
| user     | [Kullanıcı](#Kullanıcı) | No       | Ayrıntılı davetler göstermek istediğiniz kullanıcı. |         |

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

| Argument | Type                    | Required | Description                                             | Details |
| -------- | ----------------------- | -------- | ------------------------------------------------------- | ------- |
| user     | [Kullanıcı](#Kullanıcı) | No       | Kendisini göstermek istediğiniz kullanıcı davet ediyor. |         |

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

Sunucudan bir üyeyi atar.

### Usage

```text
!kick <member> [reason]
```

### Arguments

| Argument | Type            | Required | Description                | Details |
| -------- | --------------- | -------- | -------------------------- | ------- |
| member   | [Üye](#Üye)     | Yes      | Kullanıcı Atıldı.          |         |
| reason   | [Metin](#Metin) | No       | Kullanıcının Atılma Sebebi |         |

### Examples

<a name='leaderboard'></a>

---

## !leaderboard

En çok davet edilen üyeleri göster.

### Usage

```text
!leaderboard [page]
```

### Aliases

- `!top`

### Arguments

| Argument | Type          | Required | Description                  | Details |
| -------- | ------------- | -------- | ---------------------------- | ------- |
| page     | [Sayı](#Sayı) | No       | Afiş almak için hangi sayfa. |         |

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

| Argument | Type            | Required | Description                   | Details |
| -------- | --------------- | -------- | ----------------------------- | ------- |
| channel  | [Kanal](#Kanal) | No       | Kilitlemek istediğiniz kanal. |         |

### Flags

| Flag                    | Short     | Type          | Description                                                                                                                   |
| ----------------------- | --------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| &#x2011;&#x2011;timeout | &#x2011;t | [Süre](#Süre) | Kilitlemenin otomatik olarak sona erdiği zaman aşımı süresi. Kilidi manuel olarak sonlandırmak için komutu tekrar çalıştırın. |

### Examples

```text
!lockdown
```

<a name='lyrics'></a>

---

## !lyrics

Şu anda çalan şarkının sözlerini göster.

### Usage

```text
!lyrics [-l|--live]
```

### Flags

| Flag                 | Short     | Type                | Description                                                       |
| -------------------- | --------- | ------------------- | ----------------------------------------------------------------- |
| &#x2011;&#x2011;live | &#x2011;l | [Boolean](#Boolean) | Ayarlanırsa, sözler şarkının geçerli saati ile senkronize edilir. |

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
| videos   | [Metin](#Metin) | Yes      | The videos that should be mashed together. |         |

### Examples

<a name='memberConfig'></a>

---

## !memberConfig

Sunucunun üyelerinin yapılandırmasını gösterin ve değiştirin.

### Usage

```text
!memberConfig [key] [user] [value]
```

### Aliases

- `!member-config`
- `!memconf`
- `!mc`

### Arguments

| Argument | Type                    | Required | Description                                                 | Details                                                |
| -------- | ----------------------- | -------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| key      | [Enum](#Enum)           | No       | Göstermek / değiştirmek istediğiniz üye yapılandırma ayarı. | Use one of the following values: `hideFromLeaderboard` |
| user     | [Kullanıcı](#Kullanıcı) | No       | Ayarın gösterildiği / değiştirildiği üye.                   |                                                        |
| value    | [Değer](#Değer)         | No       | Ayarın yeni değeri.                                         |                                                        |

### Examples

```text
!memberConfig
```

<a name='members'></a>

---

## !members

Geçerli sunucunun üye sayısını göster.

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

Bir kullanıcı sustur

### Usage

```text
!mute [-d value|--duration=value] <user> [reason]
```

### Arguments

| Argument | Type            | Required | Description                                   | Details |
| -------- | --------------- | -------- | --------------------------------------------- | ------- |
| user     | [Üye](#Üye)     | Yes      | Susturulması gereken kullanıcı.               |         |
| reason   | [Metin](#Metin) | No       | Bu kullanıcının susturulmuş olmasının nedeni. |         |

### Flags

| Flag                     | Short     | Type          | Description                    |
| ------------------------ | --------- | ------------- | ------------------------------ |
| &#x2011;&#x2011;duration | &#x2011;d | [Süre](#Süre) | Kullanıcının susturulma süresi |

### Examples

<a name='nowPlaying'></a>

---

## !nowPlaying

Çalmakta olan şarkı hakkında bilgi gösterir

### Usage

```text
!nowPlaying [-p|--pin]
```

### Aliases

- `!np`
- `!now-playing`

### Flags

| Flag                | Short     | Type                | Description                                                                               |
| ------------------- | --------- | ------------------- | ----------------------------------------------------------------------------------------- |
| &#x2011;&#x2011;pin | &#x2011;p | [Boolean](#Boolean) | Şimdi çalınan mesajı sabitleyin ve yeni bir şarkı çaldığında otomatik olarak güncelleyin. |

### Examples

```text
!nowPlaying
```

<a name='pause'></a>

---

## !pause

Çalan şarkıyı durdur.

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

| Argument | Type            | Required | Description                                                 | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------- | --------------- | -------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cmd      | [Komut](#Komut) | No       | Komut, izinleri yapılandırma için                           | Use one of the following values: `addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lockdown`, `lyrics`, `mashup`, `memberConfig`, `members`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |
| role     | [Rol](#Rol)     | No       | Komuta erişim izni verilmesi veya reddedilmesi gereken rol. |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

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

Sıra boşsa şarkıyı açın, aksi takdirde şarkıyı kuyruğun sonuna ekler.

### Usage

```text
!play [-p value|--platform=value] [-n|--next] <link>
```

### Aliases

- `!p`

### Arguments

| Argument | Type            | Required | Description                                       | Details |
| -------- | --------------- | -------- | ------------------------------------------------- | ------- |
| link     | [Metin](#Metin) | Yes      | Belirli bir şarkıya veya arama terimine bağlantı. |         |

### Flags

| Flag                     | Short     | Type                | Description                                                                       |
| ------------------------ | --------- | ------------------- | --------------------------------------------------------------------------------- |
| &#x2011;&#x2011;platform | &#x2011;p | [Enum](#Enum)       | Şarkının çalınmasını istediğiniz platformu seçin.                                 |
| &#x2011;&#x2011;next     | &#x2011;n | [Boolean](#Boolean) | Ayarlanmışsa, sıranın sonuna eklemek yerine bu şarkıyı bir sonraki şarkıya ekler. |

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

| Argument | Type          | Required | Description                                                                                                                                           | Details                                                            |
| -------- | ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| action   | [Enum](#Enum) | No       | Gerçekleştirilecek eylem. Premium bilgi için yok. Premium durumunuzu kontrol etmek için `check`. bu sunucu için priminizi kullanmak için `activate` . | Use one of the following values: `Activate`, `Check`, `Deactivate` |

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

| Argument   | Type            | Required | Description                                     | Details                                                                   |
| ---------- | --------------- | -------- | ----------------------------------------------- | ------------------------------------------------------------------------- |
| punishment | [Enum](#Enum)   | No       | Kullanılacak cezalandırma türü.                 | Use one of the following values: `ban`, `kick`, `mute`, `softban`, `warn` |
| strikes    | [Sayı](#Sayı)   | No       | Bu cezalandırma için kullanılacak ihtar sayısı. |                                                                           |
| args       | [Metin](#Metin) | No       | İddialar cezaya geçti.                          |                                                                           |

### Examples

```text
!punishmentConfig
```

<a name='purge'></a>

---

## !purge

Bir kanaldaki mesajları temizleme

### Usage

```text
!purge <quantity> [user]
```

### Aliases

- `!prune`

### Arguments

| Argument | Type                    | Required | Description                        | Details |
| -------- | ----------------------- | -------- | ---------------------------------- | ------- |
| quantity | [Sayı](#Sayı)           | Yes      | Kaç mesaj silinmelidir.            |         |
| user     | [Kullanıcı](#Kullanıcı) | No       | Mesajları silinmiş olan kullanıcı. |         |

### Examples

<a name='purgeUntil'></a>

---

## !purgeUntil

Bir kanaldaki mesajları belirtilen mesaja kadar temizleyin.

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

| Argument  | Type            | Required | Description               | Details |
| --------- | --------------- | -------- | ------------------------- | ------- |
| messageID | [Metin](#Metin) | Yes      | Silinecek son mesaj ID'si |         |

### Examples

<a name='queue'></a>

---

## !queue

Şarkıları kuyrukta göster

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

Tüm rütbeleri göster.

### Usage

```text
!ranks [page]
```

### Aliases

- `!show-ranks`
- `!showranks`

### Arguments

| Argument | Type          | Required | Description                              | Details |
| -------- | ------------- | -------- | ---------------------------------------- | ------- |
| page     | [Sayı](#Sayı) | No       | Gösterilecek sıralama listesinin sayfası |         |

### Examples

```text
!ranks
```

<a name='removeInvites'></a>

---

## !removeInvites

Bir kullanıcıdan belirtilen miktarda daveti kaldırır.

### Usage

```text
!removeInvites <user> <amount> [reason]
```

### Aliases

- `!remove-invites`

### Arguments

| Argument | Type                    | Required | Description                         | Details |
| -------- | ----------------------- | -------- | ----------------------------------- | ------- |
| user     | [Kullanıcı](#Kullanıcı) | Yes      | Davetlerin kaldırılacağı kullanıcı. |         |
| amount   | [Sayı](#Sayı)           | Yes      | Kaldırılacak davetlerin sayısı.     |         |
| reason   | [Metin](#Metin)         | No       | Davetlerin kaldırılmasının nedeni.  |         |

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

Bir rank'ı kaldırın.

### Usage

```text
!removeRank <rank>
```

### Aliases

- `!remove-rank`

### Arguments

| Argument | Type        | Required | Description                     | Details |
| -------- | ----------- | -------- | ------------------------------- | ------- |
| rank     | [Rol](#Rol) | Yes      | Sırasını kaldırmak istediğiniz. |         |

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

Önceden temizlenmiş tüm davetiyeleri geri yükleyin.

### Usage

```text
!restoreInvites [user]
```

### Aliases

- `!restore-invites`
- `!unclear-invites`
- `!unclearinvites`

### Arguments

| Argument | Type                    | Required | Description                                                                                     | Details |
| -------- | ----------------------- | -------- | ----------------------------------------------------------------------------------------------- | ------- |
| user     | [Kullanıcı](#Kullanıcı) | No       | Tüm davetleri geri yükleyecek kullanıcı. Atlanırsa tüm kullanıcılar için davetleri geri yükler. |         |

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

Arama terimini arayın ve sonuçlardan birini seçmenize izin verin.

### Usage

```text
!search [-p value|--platform=value] <search>
```

### Arguments

| Argument | Type            | Required | Description  | Details |
| -------- | --------------- | -------- | ------------ | ------- |
| search   | [Metin](#Metin) | Yes      | Arama terimi |         |

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

Botu ayarlama ve sorunları kontrol etme konusunda yardım (örn. Eksik izinler)

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

Geçerli şarkıyı atlayın ve sıradaki bir sonraki şarkıyı çalın.

### Usage

```text
!skip [amount]
```

### Aliases

- `!next`

### Arguments

| Argument | Type          | Required | Description          | Details |
| -------- | ------------- | -------- | -------------------- | ------- |
| amount   | [Sayı](#Sayı) | No       | Kaç şarkı atlanacak. |         |

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

| Argument | Type            | Required | Description                  | Details |
| -------- | --------------- | -------- | ---------------------------- | ------- |
| user     | [Üye](#Üye)     | Yes      | Kullanıcı Yasaklamak.        |         |
| reason   | [Metin](#Metin) | No       | Kullanıcı neden yasaklandı ? |         |

### Flags

| Flag                              | Short     | Type          | Description                                         |
| --------------------------------- | --------- | ------------- | --------------------------------------------------- |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [Sayı](#Sayı) | Kullanıcının bu kadar gün önceki mesajlarını silin. |

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
| member   | [Üye](#Üye)   | Yes      | Vuruşları alan üye                |                                                                                                                                                              |
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
| violation | [Enum](#Enum) | No       | İhlal türü.        | Use one of the following values: `allCaps`, `duplicateText`, `emojis`, `hoist`, `invites`, `links`, `mentionRoles`, `mentionUsers`, `quickMessages`, `words` |
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

| Argument | Type                    | Required | Description                              | Details |
| -------- | ----------------------- | -------- | ---------------------------------------- | ------- |
| user     | [Kullanıcı](#Kullanıcı) | Yes      | Yasağının kaldırılması gereken kullanıcı |         |
| reason   | [Metin](#Metin)         | No       | Bu kullanıcının yasaklanmasının nedeni.  |         |

### Examples

<a name='unhoist'></a>

---

## !unhoist

Tüm üyelerin önüne, adlarının önünde özel bir karakter olacak şekilde bir karakter ekleyin, böylece üye listesinin sonunda gösterilirler.

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

| Argument | Type        | Required | Description                    | Details |
| -------- | ----------- | -------- | ------------------------------ | ------- |
| user     | [Üye](#Üye) | Yes      | Susturulması gereken kullanıcı |         |

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

| Argument | Type            | Required | Description          | Details |
| -------- | --------------- | -------- | -------------------- | ------- |
| member   | [Üye](#Üye)     | Yes      | Member to warn.      |         |
| reason   | [Metin](#Metin) | No       | Üye neden uyarıldı ? |         |

### Examples
