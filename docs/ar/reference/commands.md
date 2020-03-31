# Commands

To get a list of available commands, do !help on your server.

## Arguments & Flags

Most commands accept arguments and/or flags.  
According to the **Type** of the argument or flag you can provide different values.

### Boolean

This arguments expects `true` or `false`. You can also use `yes` and `no`.

### رقم

This arguments expects a number

### Enum

This arguments expects a value from a specific set of valid values.

> Depending on the command the valid values can vary. Use `!help <command>` (eg. `!help addRank`) to get more information about the command and the valid values for the enum.

### رقم الدعوة

This arguments expects a Discord Invite Code.

> You can put only the part after `https://discord.gg/` to prevent Discord from creating a preview.

### المستعمل

This arguments expects a Discord User. You can use any of the following methods to provide a user:

- Mention the user: `@Valandur`
- Use their ID: `102785693046026240`
- Use their name: `Valandur`
- Use their name and discriminator: `Valandur#3581`
- Use quotes if their name has a space: `"Valandur with a space"`

### وظيفة

This arguments expects a Discord Role. You can use any of the following methods to provide a role:

- Mention the role: `@Admin`
- Use the ID: `102785693046026240`
- Use the name: `Admin`
- Use quotes if the name has a space: `"Admin with a space"`

### القناة

This arguments expects a Discord Channel. You can use any of the following methods to provide a channel:

- Mention the channel: `#general`
- Use the ID: `409846838129197057`
- Use the name: `general`
- Use quotes if the name has a space: `"general with a space"`

### أمر

This argument expects a command of this bot. You can use any of the following methods to provide a command:

- Use the command name: `invites`
- Use an alias of the command: `p`

### نص

This arguments expects any text. You can use quotes (`"Text with quotes"`) for text that has spaces.

> If the text is the last argument you don't have to use quotes.

### تاريخ

This argument expects a date. You can use various formats, but we recommend: `YYYY-MM-DD`

### المدة الزمنية

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
| [addInvites](#addInvites)         | أضافة/ازالة دعوات للعضو او منه.                    | !addInvites \<user\> \<amount\> [reason]                         |
| [clearInvites](#clearInvites)     | تنظيف الاضافات للسيرفر او لمستعمل.                 | !clearInvites [-d value\|--date=value][-cb\|--clearbonus] [user] |
| [createInvite](#createInvite)     | انشاء كود الدعوات فريد من نوعه.                    | !createInvite \<name\> [channel]                                 |
| [info](#info)                     | عرض معلومات حول عضو معين.                          | !info \<user\> [details][page]                                   |
| [inviteCodes](#inviteCodes)       | الحصول على قائمة كل ما لديك من روابط               | !inviteCodes                                                     |
| [inviteDetails](#inviteDetails)   | يعرض تفاصيل من اين لك دعواتك.                      | !inviteDetails [user]                                            |
| [invites](#invites)               | اظهار عدد الدعوات الخاصة.                          | !invites [user]                                                  |
| [leaderboard](#leaderboard)       | إظهار الأعضاء مع اعلى الدعوات.                     | !leaderboard [page]                                              |
| [removeInvites](#removeInvites)   | Removes a specified amount of invites from a user. | !removeInvites \<user\> \<amount\> [reason]                      |
| [restoreInvites](#restoreInvites) | استعادة جميع الدعوات التي تم مسحها مسبقًا.         | !restoreInvites [user]                                           |
| [subtractFakes](#subtractFakes)   | Remove fake invites from all users.                | !subtractFakes                                                   |
| [subtractLeaves](#subtractLeaves) | Remove leaves from all users                       | !subtractLeaves                                                  |

### Ranks

| Command                   | Description                                   | Usage                                |
| ------------------------- | --------------------------------------------- | ------------------------------------ |
| [addRank](#addRank)       | أضف رتبة جديدة.                               | !addRank \<role\> \<invites\> [info] |
| [fixRanks](#fixRanks)     | Deletes any ranks where the role was deleted. | !fixRanks                            |
| [ranks](#ranks)           | اظهار كل الرتب.                               | !ranks [page]                        |
| [removeRank](#removeRank) | إزالة رتبة.                                   | !removeRank \<rank\>                 |

### Config

| Command                                 | Description                                     | Usage                                       |
| --------------------------------------- | ----------------------------------------------- | ------------------------------------------- |
| [botConfig](#botConfig)                 | قم باظهار وتغيير اعدادات البوت.                 | !botConfig [key][value]                     |
| [config](#config)                       | اظهر وغير الاعدادات في السيرفر.                 | !config [key][value]                        |
| [interactiveConfig](#interactiveConfig) | التكوين التفاعلي                                | !interactiveConfig                          |
| [inviteCodeConfig](#inviteCodeConfig)   | اظهار وتغيير اعدادات كود الدعوات في السيرفر     | !inviteCodeConfig [key][invitecode] [value] |
| [memberConfig](#memberConfig)           | اظهر وغير الاعدادات التابعة للاعضاء في السيرفر. | !memberConfig [key][user] [value]           |
| [permissions](#permissions)             | تهيئة الإذن ليستخدم الأوامر                     | !permissions [cmd][role]                    |

### Info

| Command             | Description                                                                       | Usage           |
| ------------------- | --------------------------------------------------------------------------------- | --------------- |
| [botInfo](#botInfo) | الحصول على معلومات عامة حول الروبوت.                                              | !botInfo        |
| [credits](#credits) | إظهار المطورين والمساهمين في البوت.                                               | !credits        |
| [getBot](#getBot)   | الحصول على رابط دعوة للبوت.                                                       | !getBot         |
| [help](#help)       | عرض المساعدة.                                                                     | !help [command] |
| [members](#members) | إظهار عدد الأعضاء لسيرفر الحالي.                                                  | !members        |
| [ping](#ping)       | بينغ الروبوت                                                                      | !ping           |
| [prefix](#prefix)   | يظهر البادئة الحالية للروبوت.                                                     | !prefix         |
| [setup](#setup)     | Help with setting up the bot and checking for problems (e.g. missing permissions) | !setup          |
| [support](#support) | Get an invite link to our support server.                                         | !support        |

### Premium

| Command                   | Description                                                               | Usage             |
| ------------------------- | ------------------------------------------------------------------------- | ----------------- |
| [export](#export)         | اصدار ملفات الانفايت منجر لـ csv                                          | !export \<type\>  |
| [premium](#premium)       | معلومات حول الإصدار المتميز من InviteManager.                             | !premium [action] |
| [tryPremium](#tryPremium) | Try the premium version of InviteManager for free for a limited duration. | !tryPremium       |

### Moderation

| Command                               | Description                                                                                                                                   | Usage                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [ban](#ban)                           | قم بحظر العضو من السيرفر الخاص بك.                                                                                                            | !ban [-d value\|--deleteMessageDays=value] \<user\> [reason]     |
| [caseDelete](#caseDelete)             | حذف حالة معينة.                                                                                                                               | !caseDelete \<caseNumber\> [reason]                              |
| [caseView](#caseView)                 | عرض معلومات حول حالة معينة.                                                                                                                   | !caseView \<caseNumber\>                                         |
| [check](#check)                       | تحقق من انتهاك وتاريخ العقوبة للمستخدم.                                                                                                       | !check \<user\>                                                  |
| [clean](#clean)                       | مسح روم/غرفة لنوع معين من الرسائل                                                                                                             | !clean \<type\> [numberOfMessages]                               |
| [cleanShort](#cleanShort)             | قم بمسح الرسائل القصيرة                                                                                                                       | !cleanShort \<maxTextLength\> [numberOfMessages]                 |
| [cleanText](#cleanText)               | حذف الرسائل التي تحتوي على كلمات رئيسية معينة.                                                                                                | !cleanText \<text\> [numberOfMessages]                           |
| [kick](#kick)                         | طرد عضو من سيرفر                                                                                                                              | !kick \<member\> [reason]                                        |
| [lockdown](#lockdown)                 | Lockdown a specific channel (Prevents anyone without special roles from sending messages)                                                     | !lockdown [-t value\|--timeout=value][channel]                   |
| [mute](#mute)                         | اسكت المستخدم                                                                                                                                 | !mute [-d value\|--duration=value] \<user\> [reason]             |
| [punishmentConfig](#punishmentConfig) | Configure punishments when reaching a certain amount of strikes.                                                                              | !punishmentConfig [punishment][strikes] [args]                   |
| [purge](#purge)                       | Purge messages in a channel.                                                                                                                  | !purge \<quantity\> [user]                                       |
| [purgeUntil](#purgeUntil)             | Purge messages in a channel up until a specified message.                                                                                     | !purgeUntil \<messageID\>                                        |
| [softBan](#softBan)                   | Ban and then automatically unban a member from the server.                                                                                    | !softBan [-d value\|--deleteMessageDays=value] \<user\> [reason] |
| [strike](#strike)                     | Add strikes to a user                                                                                                                         | !strike \<member\> \<type\> \<amount\>                           |
| [strikeConfig](#strikeConfig)         | Configure strikes received for various violations.                                                                                            | !strikeConfig [violation][strikes]                               |
| [unban](#unban)                       | فك الحظر من شخص.                                                                                                                              | !unban \<user\> [reason]                                         |
| [unhoist](#unhoist)                   | Add a character in front of all members with a special character in front of their name, so they will be shown at the end of the member list. | !unhoist                                                         |
| [unmute](#unmute)                     | فك الاسكات من شخص.                                                                                                                            | !unmute \<user\>                                                 |
| [warn](#warn)                         | تحذير شخص.                                                                                                                                    | !warn \<member\> [reason]                                        |

### Music

| Command                   | Description                                                                                  | Usage                                                   |
| ------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [disconnect](#disconnect) | فصل البوت من الروم الصوتي الحالي.                                                            | !disconnect                                             |
| [lyrics](#lyrics)         | اظهار كلمات الاغنية التي تشتغل حاليا.                                                        | !lyrics [-l\|--live]                                    |
| [mashup](#mashup)         | Create a mashup of 2 songs.                                                                  | !mashup \<videos\>                                      |
| [nowPlaying](#nowPlaying) | اظهار المعلومات المتعلقة بالاغنية التي تشتغل حاليا.                                          | !nowPlaying [-p\|--pin]                                 |
| [pause](#pause)           | ايقاف الاغنية التي تشتغل حاليا.                                                              | !pause                                                  |
| [play](#play)             | Play the song if the queue is empty, otherwise it will add the song to the end of the queue. | !play [-p value\|--platform=value][-n\|--next] \<link\> |
| [queue](#queue)           | اظهار الاغنية فالقائمة.                                                                      | !queue                                                  |
| [repeat](#repeat)         | اختر الاغنية التي ستشتغل مع الاعادة.                                                         | !repeat                                                 |
| [resume](#resume)         | متابعة الاغنية الحالية.                                                                      | !resume                                                 |
| [rewind](#rewind)         | Rewind the song and start from the beginning.                                                | !rewind                                                 |
| [search](#search)         | Search for the search term and let you chose one of the results.                             | !search [-p value\|--platform=value] \<search\>         |
| [seek](#seek)             | Skip to a specific part of the song.                                                         | !seek [duration]                                        |
| [skip](#skip)             | Skip the current song and play the next song in the queue.                                   | !skip [amount]                                          |
| [volume](#volume)         | Set the volume if an argument is passed, or show the current volume.                         | !volume [volume]                                        |

### Other

| Command         | Description                                                   | Usage                      |
| --------------- | ------------------------------------------------------------- | -------------------------- |
| [graph](#graph) | يعرض الرسوم البيانية حول الإحصائيات المختلفة على هذا السيرفر. | !graph \<type\> [from][to] |

<a name='addInvites'></a>

---

## !addInvites

أضافة/ازالة دعوات للعضو او منه.

### Usage

```text
!addInvites <user> <amount> [reason]
```

### Aliases

- `!add-invites`

### Arguments

| Argument | Type                  | Required | Description                                                                                  | Details |
| -------- | --------------------- | -------- | -------------------------------------------------------------------------------------------- | ------- |
| user     | [المستعمل](#المستعمل) | Yes      | المستعمل المشار اليه ستضاف او تنقص منه الدعوات الاضافية.                                     |         |
| amount   | [رقم](#رقم)           | Yes      | مقدار الدعوات التي سيحصل عليها المستعمل او يخسرها, استعمل (-) وبجانبها العدد لازالة الدعوات. |         |
| reason   | [نص](#نص)             | No       | السبب لاضافة او ازالة الدعوات..                                                              |         |

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

أضف رتبة جديدة.

### Usage

```text
!addRank <role> <invites> [info]
```

### Aliases

- `!add-rank`
- `!set-rank`
- `!setrank`

### Arguments

| Argument | Type            | Required | Description                                                | Details |
| -------- | --------------- | -------- | ---------------------------------------------------------- | ------- |
| role     | [وظيفة](#وظيفة) | Yes      | الرتبة التي سيحصل عليها المستخدم عند الوصول إلى هذا العدد. |         |
| invites  | [رقم](#رقم)     | Yes      | كمية الدعوات اللازمة للوصول إلى الرتبة.                    |         |
| info     | [نص](#نص)       | No       | وصف سيشاهده المستخدمون حتى يعرفوا المزيد عن هذه الرتبة.    |         |

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

قم بحظر العضو من السيرفر الخاص بك.

### Usage

```text
!ban [-d value|--deleteMessageDays=value] <user> [reason]
```

### Arguments

| Argument | Type                  | Required | Description             | Details |
| -------- | --------------------- | -------- | ----------------------- | ------- |
| user     | [المستعمل](#المستعمل) | Yes      | قم بذكر المستعمل للحظر. |         |
| reason   | [نص](#نص)             | No       | لماذا تم حظر المستعمل؟  |         |

### Flags

| Flag                              | Short     | Type        | Description                                                                  |
| --------------------------------- | --------- | ----------- | ---------------------------------------------------------------------------- |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [رقم](#رقم) | If specified will delete messages by the banned members this many days back. |

### Examples

<a name='botConfig'></a>

---

## !botConfig

قم باظهار وتغيير اعدادات البوت.

### Usage

```text
!botConfig [key] [value]
```

### Aliases

- `!bot-config`
- `!botsetting`
- `!bot-setting`

### Arguments

| Argument | Type              | Required | Description                              | Details                                                                                                                                     |
| -------- | ----------------- | -------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| key      | [Enum](#Enum)     | No       | اعدادات البوت التي تريد اظهارها/تغييرها. | Use one of the following values: `activityEnabled`, `activityMessage`, `activityStatus`, `activityType`, `activityUrl`, `embedDefaultColor` |
| value    | [القيمة](#القيمة) | No       | الاعدادت الجديدة.                        |                                                                                                                                             |

### Examples

```text
!botConfig
```

<a name='botInfo'></a>

---

## !botInfo

الحصول على معلومات عامة حول الروبوت.

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

حذف حالة معينة.

### Usage

```text
!caseDelete <caseNumber> [reason]
```

### Aliases

- `!case-delete`
- `!deletecase`
- `!delete-case`

### Arguments

| Argument   | Type        | Required | Description                    | Details |
| ---------- | ----------- | -------- | ------------------------------ | ------- |
| caseNumber | [رقم](#رقم) | Yes      | رقم القضية                     |         |
| reason     | [نص](#نص)   | No       | السبب الذي بسببه ستحذف القضية. |         |

### Examples

```text
!caseDelete 5434 User apologized
```

<a name='caseView'></a>

---

## !caseView

عرض معلومات حول حالة معينة.

### Usage

```text
!caseView <caseNumber>
```

### Aliases

- `!case-view`
- `!viewcase`
- `!view-case`

### Arguments

| Argument   | Type        | Required | Description | Details |
| ---------- | ----------- | -------- | ----------- | ------- |
| caseNumber | [رقم](#رقم) | Yes      | رقم القضية  |         |

### Examples

```text
!caseView 5434
```

<a name='check'></a>

---

## !check

تحقق من انتهاك وتاريخ العقوبة للمستخدم.

### Usage

```text
!check <user>
```

### Aliases

- `!history`

### Arguments

| Argument | Type                  | Required | Description                 | Details |
| -------- | --------------------- | -------- | --------------------------- | ------- |
| user     | [المستعمل](#المستعمل) | Yes      | الرجاء اذكر المستخدم للفحص. |         |

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

مسح روم/غرفة لنوع معين من الرسائل

### Usage

```text
!clean <type> [numberOfMessages]
```

### Aliases

- `!clear`

### Arguments

| Argument         | Type          | Required | Description                                     | Details                                                                                                            |
| ---------------- | ------------- | -------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| type             | [Enum](#Enum) | Yes      | الرجاء تحديد نوع الرسائل التي ستقوم بحذفها      | Use one of the following values: `bots`, `embeds`, `emojis`, `images`, `links`, `mentions`, `reacted`, `reactions` |
| numberOfMessages | [رقم](#رقم)   | No       | الرجاء تحديد عدد الرسائل التي ستقوم بالبحث عنها |                                                                                                                    |

### Examples

<a name='cleanShort'></a>

---

## !cleanShort

قم بمسح الرسائل القصيرة

### Usage

```text
!cleanShort <maxTextLength> [numberOfMessages]
```

### Aliases

- `!clean-short`
- `!clearshort`
- `!clear-short`

### Arguments

| Argument         | Type        | Required | Description                       | Details |
| ---------------- | ----------- | -------- | --------------------------------- | ------- |
| maxTextLength    | [رقم](#رقم) | Yes      | اي رسالة اقصر من هذه سيتم حذفها.  |         |
| numberOfMessages | [رقم](#رقم) | No       | عدد الرسائل التي سيتم البحث عنها. |         |

### Examples

<a name='cleanText'></a>

---

## !cleanText

حذف الرسائل التي تحتوي على كلمات رئيسية معينة.

### Usage

```text
!cleanText <text> [numberOfMessages]
```

### Aliases

- `!clean-text`
- `!cleartext`
- `!clear-text`

### Arguments

| Argument         | Type        | Required | Description                                    | Details |
| ---------------- | ----------- | -------- | ---------------------------------------------- | ------- |
| text             | [نص](#نص)   | Yes      | جميع الرسائل التي تحتوي هذه الكلمة سيتم حذفها. |         |
| numberOfMessages | [رقم](#رقم) | No       | عدد الرسائل التي سيتم البحث عنها.              |         |

### Examples

<a name='clearInvites'></a>

---

## !clearInvites

تنظيف الاضافات للسيرفر او لمستعمل.

### Usage

```text
!clearInvites [-d value|--date=value] [-cb|--clearBonus] [user]
```

### Aliases

- `!clear-invites`

### Arguments

| Argument | Type                  | Required | Description                                                                  | Details |
| -------- | --------------------- | -------- | ---------------------------------------------------------------------------- | ------- |
| user     | [المستعمل](#المستعمل) | No       | قم بذكر المستعمل لمسح جميع الانفايت التابع له, او قم بتنظيف جميع المستعملين. |         |

### Flags

| Flag                       | Short      | Type                | Description                                                                             |
| -------------------------- | ---------- | ------------------- | --------------------------------------------------------------------------------------- |
| &#x2011;&#x2011;date       | &#x2011;d  | [تاريخ](#تاريخ)     | تاريخ البدء الذي يجب فيه حساب الدعوات. الافتراضي هو اليوم.                              |
| &#x2011;&#x2011;clearBonus | &#x2011;cb | [Boolean](#Boolean) | إضافة هذه العلامة لمسح المكافآت تدعو أيضا. خلاف ذلك ، يتم ترك دعوات المكافأة دون تغيير. |

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

اظهر وغير الاعدادات في السيرفر.

### Usage

```text
!config [key] [value]
```

### Aliases

- `!c`

### Arguments

| Argument | Type              | Required | Description                       | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------- | ----------------- | -------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key      | [Enum](#Enum)     | No       | الاعدادات التي تحتاجها تظهر/تغير. | Use one of the following values: `announcementVoice`, `announceNextSong`, `autoModAllCapsEnabled`, `autoModAllCapsMinCharacters`, `autoModAllCapsPercentageCaps`, `autoModDeleteBotMessage`, `autoModDeleteBotMessageTimeoutInSeconds`, `autoModDisabledForOldMembers`, `autoModDisabledForOldMembersThreshold`, `autoModDuplicateTextEnabled`, `autoModDuplicateTextTimeframeInSeconds`, `autoModEmojisEnabled`, `autoModEmojisMaxNumberOfEmojis`, `autoModEnabled`, `autoModHoistEnabled`, `autoModIgnoredChannels`, `autoModIgnoredRoles`, `autoModInvitesEnabled`, `autoModLinksBlacklist`, `autoModLinksEnabled`, `autoModLinksFollowRedirects`, `autoModLinksWhitelist`, `autoModLogEnabled`, `autoModMentionRolesEnabled`, `autoModMentionRolesMaxNumberOfMentions`, `autoModMentionUsersEnabled`, `autoModMentionUsersMaxNumberOfMentions`, `autoModModeratedChannels`, `autoModModeratedRoles`, `autoModQuickMessagesEnabled`, `autoModQuickMessagesNumberOfMessages`, `autoModQuickMessagesTimeframeInSeconds`, `autoModWordsBlacklist`, `autoModWordsEnabled`, `autoSubtractFakes`, `autoSubtractLeaves`, `autoSubtractLeaveThreshold`, `captchaVerificationFailedMessage`, `captchaVerificationLogEnabled`, `captchaVerificationOnJoin`, `captchaVerificationSuccessMessage`, `captchaVerificationTimeout`, `captchaVerificationWelcomeMessage`, `channels`, `defaultMusicPlatform`, `disabledMusicPlatforms`, `fadeMusicEndDelay`, `fadeMusicOnTalk`, `getUpdates`, `hideLeftMembersFromLeaderboard`, `ignoredChannels`, `joinMessage`, `joinMessageChannel`, `joinRoles`, `lang`, `leaderboardStyle`, `leaveMessage`, `leaveMessageChannel`, `logChannel`, `modLogChannel`, `modPunishmentBanDeleteMessage`, `modPunishmentKickDeleteMessage`, `modPunishmentMuteDeleteMessage`, `modPunishmentSoftbanDeleteMessage`, `modPunishmentWarnDeleteMessage`, `musicVolume`, `mutedRole`, `prefix`, `rankAnnouncementChannel`, `rankAnnouncementMessage`, `rankAssignmentStyle` |
| value    | [القيمة](#القيمة) | No       | الاعدادات الجديدة.                |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

### Examples

```text
!config
```

<a name='createInvite'></a>

---

## !createInvite

انشاء كود الدعوات فريد من نوعه.

### Usage

```text
!createInvite <name> [channel]
```

### Aliases

- `!create-invite`

### Arguments

| Argument | Type              | Required | Description                                              | Details |
| -------- | ----------------- | -------- | -------------------------------------------------------- | ------- |
| name     | [نص](#نص)         | Yes      | الاسم لكود الدعوات.                                      |         |
| channel  | [القناة](#القناة) | No       | الروم التي تم انشاء فيها الكود, تستعمل الروم الاعتيادية. |         |

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

إظهار المطورين والمساهمين في البوت.

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

فصل البوت من الروم الصوتي الحالي.

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

اصدار ملفات الانفايت منجر لـ csv

### Usage

```text
!export <type>
```

### Arguments

| Argument | Type          | Required | Description            | Details                                        |
| -------- | ------------- | -------- | ---------------------- | ---------------------------------------------- |
| type     | [Enum](#Enum) | Yes      | نوع الاصدار الذي تريده | Use one of the following values: `leaderboard` |

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

الحصول على رابط دعوة للبوت.

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

يعرض الرسوم البيانية حول الإحصائيات المختلفة على هذا السيرفر.

### Usage

```text
!graph <type> [from] [to]
```

### Aliases

- `!g`
- `!chart`

### Arguments

| Argument | Type            | Required | Description             | Details                                                              |
| -------- | --------------- | -------- | ----------------------- | -------------------------------------------------------------------- |
| type     | [Enum](#Enum)   | Yes      | نوع المخطط لعرضه.       | Use one of the following values: `joins`, `joinsAndLeaves`, `leaves` |
| from     | [تاريخ](#تاريخ) | No       | Start date of the chart |                                                                      |
| to       | [تاريخ](#تاريخ) | No       | End date of the chart   |                                                                      |

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

عرض المساعدة.

### Usage

```text
!help [command]
```

### Arguments

| Argument | Type        | Required | Description                                      | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------- | ----------- | -------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command  | [أمر](#أمر) | No       | الرجاء اذكر الأمر الذي تريد ان تحصل معلومات عنه. | Use one of the following values: `addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lockdown`, `lyrics`, `mashup`, `memberConfig`, `members`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |

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

عرض معلومات حول عضو معين.

### Usage

```text
!info <user> [details] [page]
```

### Aliases

- `!showinfo`

### Arguments

| Argument | Type                  | Required | Description                                                        | Details                                             |
| -------- | --------------------- | -------- | ------------------------------------------------------------------ | --------------------------------------------------- |
| user     | [المستعمل](#المستعمل) | Yes      | المستخدم الذي تريد أن ترى معلوماته إلاضافية.                       |                                                     |
| details  | [Enum](#Enum)         | No       | اطلب معلومات معينة عن المستعمل                                     | Use one of the following values: `bonus`, `members` |
| page     | [رقم](#رقم)           | No       | ما صفحة من التفاصيل لإظهار. يمكنك أيضًا استخدام ردود الفعل للتنقل. |                                                     |

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

التكوين التفاعلي

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

اظهار وتغيير اعدادات كود الدعوات في السيرفر

### Usage

```text
!inviteCodeConfig [key] [inviteCode] [value]
```

### Aliases

- `!invite-code-config`
- `!icc`

### Arguments

| Argument   | Type                     | Required | Description                                | Details                                          |
| ---------- | ------------------------ | -------- | ------------------------------------------ | ------------------------------------------------ |
| key        | [Enum](#Enum)            | No       | الاعدادات التي تريد اظهارها/تغييرها.       | Use one of the following values: `name`, `roles` |
| inviteCode | [رقم الدعوة](#رقمالدعوة) | No       | اعدادات كود الدعوات التي تحتاج الى تغييرها |                                                  |
| value      | [القيمة](#القيمة)        | No       | الاعدادات الجديدة.                         |                                                  |

### Examples

```text
!inviteCodeConfig
```

<a name='inviteCodes'></a>

---

## !inviteCodes

الحصول على قائمة كل ما لديك من روابط

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

يعرض تفاصيل من اين لك دعواتك.

### Usage

```text
!inviteDetails [user]
```

### Aliases

- `!invite-details`

### Arguments

| Argument | Type                  | Required | Description                                    | Details |
| -------- | --------------------- | -------- | ---------------------------------------------- | ------- |
| user     | [المستعمل](#المستعمل) | No       | قم بذكر المستخدم الذي تريد عرض دعوات مفصلة له. |         |

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

اظهار عدد الدعوات الخاصة.

### Usage

```text
!invites [user]
```

### Aliases

- `!invite`
- `!rank`

### Arguments

| Argument | Type                  | Required | Description                        | Details |
| -------- | --------------------- | -------- | ---------------------------------- | ------- |
| user     | [المستعمل](#المستعمل) | No       | المستخدم الذي تريد عرض الدعوات له. |         |

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

طرد عضو من سيرفر

### Usage

```text
!kick <member> [reason]
```

### Arguments

| Argument | Type        | Required | Description              | Details |
| -------- | ----------- | -------- | ------------------------ | ------- |
| member   | [عضو](#عضو) | Yes      | اذكر عضو للقيام بالطرد   |         |
| reason   | [نص](#نص)   | No       | الرجاء قم بذكر سبب الطرد |         |

### Examples

<a name='leaderboard'></a>

---

## !leaderboard

إظهار الأعضاء مع اعلى الدعوات.

### Usage

```text
!leaderboard [page]
```

### Aliases

- `!top`

### Arguments

| Argument | Type        | Required | Description                             | Details |
| -------- | ----------- | -------- | --------------------------------------- | ------- |
| page     | [رقم](#رقم) | No       | أي صفحة من المتصدرين تريد الحصول عليها. |         |

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

| Argument | Type              | Required | Description                             | Details |
| -------- | ----------------- | -------- | --------------------------------------- | ------- |
| channel  | [القناة](#القناة) | No       | The channel that you want to lock down. |         |

### Flags

| Flag                    | Short     | Type                           | Description                                                                                                  |
| ----------------------- | --------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| &#x2011;&#x2011;timeout | &#x2011;t | [المدة الزمنية](#المدةالزمنية) | The timeout after which the lockdown automatically ends. Run the command again to end the lockdown manually. |

### Examples

```text
!lockdown
```

<a name='lyrics'></a>

---

## !lyrics

اظهار كلمات الاغنية التي تشتغل حاليا.

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

| Argument | Type      | Required | Description                                | Details |
| -------- | --------- | -------- | ------------------------------------------ | ------- |
| videos   | [نص](#نص) | Yes      | The videos that should be mashed together. |         |

### Examples

<a name='memberConfig'></a>

---

## !memberConfig

اظهر وغير الاعدادات التابعة للاعضاء في السيرفر.

### Usage

```text
!memberConfig [key] [user] [value]
```

### Aliases

- `!member-config`
- `!memconf`
- `!mc`

### Arguments

| Argument | Type                  | Required | Description                       | Details                                                |
| -------- | --------------------- | -------- | --------------------------------- | ------------------------------------------------------ |
| key      | [Enum](#Enum)         | No       | الاعدادات التي تحتاجها تظهر/تغير. | Use one of the following values: `hideFromLeaderboard` |
| user     | [المستعمل](#المستعمل) | No       | اعدادات كود الدعوات تغيرت الى.    |                                                        |
| value    | [القيمة](#القيمة)     | No       | الاعدادت الجديدة.                 |                                                        |

### Examples

```text
!memberConfig
```

<a name='members'></a>

---

## !members

إظهار عدد الأعضاء لسيرفر الحالي.

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

اسكت المستخدم

### Usage

```text
!mute [-d value|--duration=value] <user> [reason]
```

### Arguments

| Argument | Type        | Required | Description                           | Details |
| -------- | ----------- | -------- | ------------------------------------- | ------- |
| user     | [عضو](#عضو) | Yes      | المستخدم الذي يجب اسكاته.             |         |
| reason   | [نص](#نص)   | No       | السبب الذي سيتم اسكات المستخدم بسببه. |         |

### Flags

| Flag                     | Short     | Type                           | Description                       |
| ------------------------ | --------- | ------------------------------ | --------------------------------- |
| &#x2011;&#x2011;duration | &#x2011;d | [المدة الزمنية](#المدةالزمنية) | The duration to mute the user for |

### Examples

<a name='nowPlaying'></a>

---

## !nowPlaying

اظهار المعلومات المتعلقة بالاغنية التي تشتغل حاليا.

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

ايقاف الاغنية التي تشتغل حاليا.

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

تهيئة الإذن ليستخدم الأوامر

### Usage

```text
!permissions [cmd] [role]
```

### Aliases

- `!perms`

### Arguments

| Argument | Type            | Required | Description                                    | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------- | --------------- | -------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cmd      | [أمر](#أمر)     | No       | الأمر لتكوين أذونات ل.                         | Use one of the following values: `addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lockdown`, `lyrics`, `mashup`, `memberConfig`, `members`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |
| role     | [وظيفة](#وظيفة) | No       | الدور الذي ينبغي منحه أو رفض الوصول إلى الأمر. |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

### Examples

```text
!permissions
```

<a name='ping'></a>

---

## !ping

بينغ الروبوت

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

| Argument | Type      | Required | Description                                   | Details |
| -------- | --------- | -------- | --------------------------------------------- | ------- |
| link     | [نص](#نص) | Yes      | The link to a specific song or a search term. |         |

### Flags

| Flag                     | Short     | Type                | Description                                                                       |
| ------------------------ | --------- | ------------------- | --------------------------------------------------------------------------------- |
| &#x2011;&#x2011;platform | &#x2011;p | [Enum](#Enum)       | Select the platform where you want the song to be played.                         |
| &#x2011;&#x2011;next     | &#x2011;n | [Boolean](#Boolean) | If set, it will play this song next instead of adding it to the end of the queue. |

### Examples

<a name='prefix'></a>

---

## !prefix

يظهر البادئة الحالية للروبوت.

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

معلومات حول الإصدار المتميز من InviteManager.

### Usage

```text
!premium [action]
```

### Aliases

- `!patreon`
- `!donate`

### Arguments

| Argument                                                       | Type                                                               | Required | Description                                                        | Details |
| -------------------------------------------------------------- | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------ | ------- |
| action                                                         | [Enum](#Enum)                                                      | No       | العمل على التنفيذ. لا شيء للحصول على معلومات متميزة. "تحقق" للتحقق |
| متميزة. "تحقق" للتحقق ص بك. "تنشيط" لاستخدام قسطك لهذا الخادم. | Use one of the following values: `Activate`, `Check`, `Deactivate` |

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
| strikes    | [رقم](#رقم)   | No       | Number of strikes for this punishment to be used. |                                                                           |
| args       | [نص](#نص)     | No       | Arguments passed to the punishment.               |                                                                           |

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

| Argument | Type                  | Required | Description                          | Details |
| -------- | --------------------- | -------- | ------------------------------------ | ------- |
| quantity | [رقم](#رقم)           | Yes      | How many messages should be deleted. |         |
| user     | [المستعمل](#المستعمل) | No       | User whose messages are deleted.     |         |

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

| Argument  | Type      | Required | Description                    | Details |
| --------- | --------- | -------- | ------------------------------ | ------- |
| messageID | [نص](#نص) | Yes      | Last message ID to be deleted. |         |

### Examples

<a name='queue'></a>

---

## !queue

اظهار الاغنية فالقائمة.

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

اظهار كل الرتب.

### Usage

```text
!ranks [page]
```

### Aliases

- `!show-ranks`
- `!showranks`

### Arguments

| Argument | Type        | Required | Description                         | Details |
| -------- | ----------- | -------- | ----------------------------------- | ------- |
| page     | [رقم](#رقم) | No       | The page of the ranks list to show. |         |

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

| Argument | Type                  | Required | Description                          | Details |
| -------- | --------------------- | -------- | ------------------------------------ | ------- |
| user     | [المستعمل](#المستعمل) | Yes      | The user to remove the invites from. |         |
| amount   | [رقم](#رقم)           | Yes      | The amount of invites to remove.     |         |
| reason   | [نص](#نص)             | No       | The reason for removing the invites. |         |

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

إزالة رتبة.

### Usage

```text
!removeRank <rank>
```

### Aliases

- `!remove-rank`

### Arguments

| Argument | Type            | Required | Description               | Details |
| -------- | --------------- | -------- | ------------------------- | ------- |
| rank     | [وظيفة](#وظيفة) | Yes      | والتي تريد إزالة الترتيب. |         |

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

اختر الاغنية التي ستشتغل مع الاعادة.

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

استعادة جميع الدعوات التي تم مسحها مسبقًا.

### Usage

```text
!restoreInvites [user]
```

### Aliases

- `!restore-invites`
- `!unclear-invites`
- `!unclearinvites`

### Arguments

| Argument | Type                  | Required | Description                                                             | Details |
| -------- | --------------------- | -------- | ----------------------------------------------------------------------- | ------- |
| user     | [المستعمل](#المستعمل) | No       | المستخدم لاستعادة جميع يدعو ل. إذا تم حذف يستعيد يدعو لجميع المستخدمين. |         |

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

متابعة الاغنية الحالية.

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

| Argument | Type      | Required | Description     | Details |
| -------- | --------- | -------- | --------------- | ------- |
| search   | [نص](#نص) | Yes      | The search term |         |

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

| Argument | Type        | Required | Description                                                                | Details |
| -------- | ----------- | -------- | -------------------------------------------------------------------------- | ------- |
| duration | [رقم](#رقم) | No       | The position the song will be skipped to (from the beginning, in seconds). |         |

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

| Argument | Type        | Required | Description                     | Details |
| -------- | ----------- | -------- | ------------------------------- | ------- |
| amount   | [رقم](#رقم) | No       | How many songs will be skipped. |         |

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

| Argument | Type        | Required | Description              | Details |
| -------- | ----------- | -------- | ------------------------ | ------- |
| user     | [عضو](#عضو) | Yes      | User to ban.             |         |
| reason   | [نص](#نص)   | No       | Why was the user banned. |         |

### Flags

| Flag                              | Short     | Type        | Description                                        |
| --------------------------------- | --------- | ----------- | -------------------------------------------------- |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [رقم](#رقم) | Delete messages from the user this many days back. |

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
| member   | [عضو](#عضو)   | Yes      | The member receiving the strikes  |                                                                                                                                                              |
| type     | [Enum](#Enum) | Yes      | The type of the violation         | Use one of the following values: `allCaps`, `duplicateText`, `emojis`, `hoist`, `invites`, `links`, `mentionRoles`, `mentionUsers`, `quickMessages`, `words` |
| amount   | [رقم](#رقم)   | Yes      | The amount of strikes to be added |                                                                                                                                                              |

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
| strikes   | [رقم](#رقم)   | No       | Number of strikes. |                                                                                                                                                              |

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

فك الحظر من شخص.

### Usage

```text
!unban <user> [reason]
```

### Arguments

| Argument | Type                  | Required | Description                     | Details |
| -------- | --------------------- | -------- | ------------------------------- | ------- |
| user     | [المستعمل](#المستعمل) | Yes      | المستخدم الذي يجب فك الحظر منه. |         |
| reason   | [نص](#نص)             | No       | السبب لفك حظر المستخدم.         |         |

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

فك الاسكات من شخص.

### Usage

```text
!unmute <user>
```

### Arguments

| Argument | Type        | Required | Description                  | Details |
| -------- | ----------- | -------- | ---------------------------- | ------- |
| user     | [عضو](#عضو) | Yes      | المستخدم الذي يجب فك اسكاته. |         |

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

| Argument | Type        | Required | Description                          | Details |
| -------- | ----------- | -------- | ------------------------------------ | ------- |
| volume   | [رقم](#رقم) | No       | The value the volume will be set to. |         |

### Examples

```text
!volume
```

<a name='warn'></a>

---

## !warn

تحذير شخص.

### Usage

```text
!warn <member> [reason]
```

### Arguments

| Argument | Type        | Required | Description           | Details |
| -------- | ----------- | -------- | --------------------- | ------- |
| member   | [عضو](#عضو) | Yes      | شخص ليتم تحذيره.      |         |
| reason   | [نص](#نص)   | No       | لماذا تم تحذير الشخص. |         |

### Examples
