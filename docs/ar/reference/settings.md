# Configs

There are many config options that can be set. You don't have to set all of them. If you just added the bot, just run `!setup`, which will guide you through the most important ones.

## Overview

### عام

| Setting                               | Description                                      |
| ------------------------------------- | ------------------------------------------------ |
| [بريفكس](#prefix)                     | البريفكس المستخدم لتشغيل أوامر البوت.            |
| [لغه](#lang)                          | لغة البوت                                        |
| [قناه السجل](#logchannel)             | القناه التي يتم تسجيل حركات البوت فيها.          |
| [الحصول على التحديثات](#getupdates)   | فعل لتلقي تحديثات التطوير الخاصه بInviteManager. |
| [قنوات الأوامر](#channels)            | القنوات التي سيتفاعل فيها البوت مع الأوامر.      |
| [القنوات المتجاهلة](#ignoredchannels) | القنوات التي سيتجاهل فيها البوت الأوامر.         |

### دعوات

#### الانضمامات

| Setting                             | Description                                       |
| ----------------------------------- | ------------------------------------------------- |
| [رساله](#joinmessage)               | الرسالة المرسلة عندما يدخل شخص ما الخادم/السيرفر. |
| [قناه الرسائل](#joinmessagechannel) | القناة التي يتم إرسال رسالة الدخول فيها.          |

#### المغادرات

| Setting                                             | Description                                                              |
| --------------------------------------------------- | ------------------------------------------------------------------------ |
| [رساله](#leavemessage)                              | الرسالة المرسلة عندما يترك شخص ما الخادم/السيرفر.                        |
| [قناه الرسائل](#leavemessagechannel)                | القناة التي يتم إرسال رسالة الخروج فيها.                                 |
| [طرح تلقائي](#autosubtractleaves)                   | ازالة الدعوات تلقائيًا من المدعو عندما يغادر                             |
| [بداية الطرح التلقائي](#autosubtractleavethreshold) | الوقت بالثواني الذي يتعين على المستخدم البقاء فيه في السيرفر للدعوه للعد |

#### المتصدرين

| Setting                                                     | Description                                   |
| ----------------------------------------------------------- | --------------------------------------------- |
| [اسلوب ](#leaderboardstyle)                                 | مظهر اسلوب المتصدرين                          |
| [اخفي الاعضاء الذين خرجوا](#hideleftmembersfromleaderboard) | إخفاء الأعضاء الذين تركوا الخادم من المتصدرين |

#### المزيفون

| Setting                          | Description                    |
| -------------------------------- | ------------------------------ |
| [طرح تلقائي](#autosubtractfakes) | ازاله الدعوات المزورة تلقائياً |

#### رتب

| Setting                                   | Description                                               |
| ----------------------------------------- | --------------------------------------------------------- |
| [أسلوب الواجب](#rankassignmentstyle)      | كيف تتم مكافأة الرتب للمستخدمين.                          |
| [قناه التصاريح](#rankannouncementchannel) | القناة التي يعلن فيها المستخدمون الذين يتلقون رتبة جديدة. |
| [رساله التصريح](#rankannouncementmessage) | الرسالة التي يتم إرسالها عندما يتلقى المستخدم رتبة جديدة. |

### اداره

#### كلمة التحقق

| Setting                                             | Description                                                                                 |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [مفعل](#captchaverificationonjoin)                  | سواء تم تفعيل التحقق من كلمة التحقق أم لا.                                                  |
| [رسالة الترحيب](#captchaverificationwelcomemessage) | الرسالة التي سيحصل عليها المستخدم بعد الانضمام إلى الخادم وتوجيهه لدخول اختبار كلمة التحقق. |
| [رسالة النجاح](#captchaverificationsuccessmessage)  | رسالة الترحيب التي سيتم إرسالها إلى المستخدم بعد أن يتحقق بنجاح.                            |
| [رسالة فاشلة](#captchaverificationfailedmessage)    | الرسالة التي يتم إرسالها عندما يخفق المستخدم بكلمه التحقق.                                  |
| [التحقق من المهلة](#captchaverificationtimeout)     | الوقت الذي يتم فيه إدخال كلمة التحقق بنجاح.                                                 |
| [السجل مفعل](#captchaverificationlogenabled)        | سواء سيتم تسجيل محاولات التحقق ام لا.                                                       |

#### عام

| Setting                                                        | Description                                                |
| -------------------------------------------------------------- | ---------------------------------------------------------- |
| [تمكين](#automodenabled)                                       | settings.autoModEnabled.description                        |
| [القنوات الادارية](#automodmoderatedchannels)                  | settings.autoModModeratedChannels.description              |
| [الرتب الادارية](#automodmoderatedroles)                       | settings.autoModModeratedRoles.description                 |
| [القنوات المتجاهلة](#automodignoredchannels)                   | settings.autoModIgnoredChannels.description                |
| [تجاهل الأدوار](#automodignoredroles)                          | settings.autoModIgnoredRoles.description                   |
| [رتبه صامته](#mutedrole)                                       | settings.mutedRole.description                             |
| [معطل للأعضاء القدامى](#automoddisabledforoldmembers)          | settings.autoModDisabledForOldMembers.description          |
| [الأعضاء القديمة عتبة](#automoddisabledforoldmembersthreshold) | settings.autoModDisabledForOldMembersThreshold.description |

#### تسجيل

| Setting                                                             | Description                                                  |
| ------------------------------------------------------------------- | ------------------------------------------------------------ |
| [Log Enabled](#automodlogenabled)                                   | settings.autoModLogEnabled.description                       |
| [سجل القناه الخاص بالمود](#modlogchannel)                           | القناة التي سيتم نشر سجلات المود فيها.                       |
| [حذف رسائل بوت](#automoddeletebotmessage)                           | settings.autoModDeleteBotMessage.description                 |
| [حذف Bot Message Timeout](#automoddeletebotmessagetimeoutinseconds) | settings.autoModDeleteBotMessageTimeoutInSeconds.description |
| [حذف رسائل الحظر](#modpunishmentbandeletemessage)                   | سواء سيتم حذف رسائل "الحظر" من عدمه تلقائيًا او لا.          |
| [حذف رسائل الطرد](#modpunishmentkickdeletemessage)                  | سواء سيتم حذف رسائل "الطرد" من عدمه تلقائيًا او لا.          |
| [حذف رسائل الحظر](#modpunishmentsoftbandeletemessage)               | سواء سيتم حذف رسائل "الحظر" من عدمه تلقائيًا او لا.          |
| [حذف رسائل التحذير.](#modpunishmentwarndeletemessage)               | سواء سيتم حذف رسائل "تحذير" من عدمه تلقائيًا او لا.          |
| [حذف رسائل الصمت](#modpunishmentmutedeletemessage)                  | سواء سيتم حذف رسائل "الصمت" من عدمه تلقائيًا او لا.          |

#### دعوات

| Setting                         | Description                                |
| ------------------------------- | ------------------------------------------ |
| [تمكين](#automodinvitesenabled) | settings.autoModInvitesEnabled.description |

#### روابط

| Setting                                          | Description                                      |
| ------------------------------------------------ | ------------------------------------------------ |
| [تمكين](#automodlinksenabled)                    | settings.autoModLinksEnabled.description         |
| [القائمة البيضاء](#automodlinkswhitelist)        | settings.autoModLinksWhitelist.description       |
| [القائمة السوداء](#automodlinksblacklist)        | settings.autoModLinksBlacklist.description       |
| [Follow Redirects](#automodlinksfollowredirects) | settings.autoModLinksFollowRedirects.description |

#### كلمات محظوره

| Setting                       | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| [مفعل](#automodwordsenabled)  | سواء سيتم التحقق تلقائياً من رسائل المحظوره او لا. |
| [حظر](#automodwordsblacklist) | قائمه من الكلمات المحظوره                          |

#### احرف كبيره

| Setting                                                 | Description                                       |
| ------------------------------------------------------- | ------------------------------------------------- |
| [تمكين](#automodallcapsenabled)                         | settings.autoModAllCapsEnabled.description        |
| [الحد الأدنى من الشخصيات](#automodallcapsmincharacters) | settings.autoModAllCapsMinCharacters.description  |
| [النسبة المئوية CAPs](#automodallcapspercentagecaps)    | settings.autoModAllCapsPercentageCaps.description |

#### رسائل مكررة

| Setting                                                           | Description                                                 |
| ----------------------------------------------------------------- | ----------------------------------------------------------- |
| [تمكين](#automodduplicatetextenabled)                             | settings.autoModDuplicateTextEnabled.description            |
| [الإطار الزمني بالثواني](#automodduplicatetexttimeframeinseconds) | settings.autoModDuplicateTextTimeframeInSeconds.description |

#### سبام/اصرار

| Setting                                                           | Description                                                 |
| ----------------------------------------------------------------- | ----------------------------------------------------------- |
| [مفعل](#automodquickmessagesenabled)                              | settings.autoModQuickMessagesEnabled.description            |
| [# من الرسائل](#automodquickmessagesnumberofmessages)             | settings.autoModQuickMessagesNumberOfMessages.description   |
| [الإطار الزمني بالثواني](#automodquickmessagestimeframeinseconds) | settings.autoModQuickMessagesTimeframeInSeconds.description |

#### إشارات

| Setting                                                      | Description                                                 |
| ------------------------------------------------------------ | ----------------------------------------------------------- |
| [تمكين](#automodmentionusersenabled)                         | settings.autoModMentionUsersEnabled.description             |
| [Max # of Mentions](#automodmentionusersmaxnumberofmentions) | settings.autoModMentionUsersMaxNumberOfMentions.description |
| [تمكين](#automodmentionrolesenabled)                         | settings.autoModMentionRolesEnabled.description             |
| [Max # of Mentions](#automodmentionrolesmaxnumberofmentions) | settings.autoModMentionRolesMaxNumberOfMentions.description |

#### ايموجيز - تعبير وجه

| Setting                                             | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- |
| [تمكين](#automodemojisenabled)                      | settings.autoModEmojisEnabled.description           |
| [ماكس # من Emojis](#automodemojismaxnumberofemojis) | settings.autoModEmojisMaxNumberOfEmojis.description |
| [Dehoist ممكن](#automodhoistenabled)                | settings.autoModHoistEnabled.description            |

### موسيقى

#### موسيقى

| Setting                           | Description                                          |
| --------------------------------- | ---------------------------------------------------- |
| [طبقة صوت الموسيقى](#musicvolume) | الصوت المعتاد الذي تم ضبطه عند دخول بوت لقناه صوتيه. |

#### settings.groups.music.announcement.title

| Setting                                    | Description                                                         |
| ------------------------------------------ | ------------------------------------------------------------------- |
| [اعلان الاغنيه التاليه](#announcenextsong) | ما إذا كان سيتم الإعلان عن الأغنية التالية في القناة الصوتية أم لا. |
| [صوت الاعلانات.](#announcementvoice)       | الصوت المستخدم في إعلانات الأغنية التاليه.                          |

#### settings.groups.music.fadeMusic.title

| Setting                                            | Description                                                                      |
| -------------------------------------------------- | -------------------------------------------------------------------------------- |
| [تلاشي الموسيقى على التكلم](#fademusicontalk)      | اذا مفعل, الموسيقى ستبدأ بالتلاشي عندما يتحدث الناس                              |
| [تلاشي الموسيقى نهايه التأخير](#fademusicenddelay) | تأخر عدد الثواني التي يجب ألا يتحدث فيها أحد من أجل عودة مستوى الصوت إلى طبيعته. |

#### settings.groups.music.platform.title

| Setting                                                          | Description                                 |
| ---------------------------------------------------------------- | ------------------------------------------- |
| [settings.defaultMusicPlatform.title](#defaultmusicplatform)     | settings.defaultMusicPlatform.description   |
| [settings.disabledMusicPlatforms.title](#disabledmusicplatforms) | settings.disabledMusicPlatforms.description |

<a name=prefix></a>

---

## بريفكس

البريفكس المستخدم لتشغيل أوامر البوت.

Type: `String`

Default: `!`

Reset to default:
`!config prefix default`

Examples:

`!config prefix +`

`!config prefix >`

<a name=lang></a>

---

## لغه

لغة البوت

Type: `Enum<Lang>`

Default: `en`

Reset to default:
`!config lang default`

Possible values: `de`, `en`, `es`, `fr`, `it`, `nl`, `pt`, `ro`, `sv`

Example:

`!config lang de`

<a name=logChannel></a>

---

## قناه السجل

القناه التي يتم تسجيل حركات البوت فيها.

Type: `Channel`

Default: `null`

Reset to default:
`!config logChannel default`

Examples:

`!config logChannel #channel`

<a name=getUpdates></a>

---

## الحصول على التحديثات

فعل لتلقي تحديثات التطوير الخاصه بInviteManager.

Type: `Boolean`

Default: `true`

Reset to default:
`!config getUpdates default`

Enable:

`!config getUpdates true`

Disable:

`!config getUpdates false`

<a name=channels></a>

---

## قنوات الأوامر

القنوات التي سيتفاعل فيها البوت مع الأوامر.

Type: `Channel[]`

Default: ``

Reset to default:
`!config channels default`

<a name=ignoredChannels></a>

---

## القنوات المتجاهلة

القنوات التي سيتجاهل فيها البوت الأوامر.

Type: `Channel[]`

Default: ``

Reset to default:
`!config ignoredChannels default`

<a name=joinMessage></a>

---

## رساله

الرسالة المرسلة عندما يدخل شخص ما الخادم/السيرفر.

Type: `String`

Default: `{memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)`

Reset to default:
`!config joinMessage default`

<a name=joinMessageChannel></a>

---

## قناه الرسائل

القناة التي يتم إرسال رسالة الدخول فيها.

Type: `Channel`

Default: `null`

Reset to default:
`!config joinMessageChannel default`

Examples:

`!config joinMessageChannel #general`

`!config joinMessageChannel #joins`

<a name=leaveMessage></a>

---

## رساله

الرسالة المرسلة عندما يترك شخص ما الخادم/السيرفر.

Type: `String`

Default: `{memberName} **left**; Invited by **{inviterName}**`

Reset to default:
`!config leaveMessage default`

Examples:

`!config leaveMessage`

`!config leaveMessage`

<a name=leaveMessageChannel></a>

---

## قناه الرسائل

القناة التي يتم إرسال رسالة الخروج فيها.

Type: `Channel`

Default: `null`

Reset to default:
`!config leaveMessageChannel default`

Examples:

`!config leaveMessageChannel #general`

`!config leaveMessageChannel #leaves`

<a name=leaderboardStyle></a>

---

## اسلوب

مظهر اسلوب المتصدرين

Type: `Enum<LeaderboardStyle>`

Default: `normal`

Reset to default:
`!config leaderboardStyle default`

Possible values: `normal`, `table`, `mentions`

Example:

`!config leaderboardStyle normal`

<a name=hideLeftMembersFromLeaderboard></a>

---

## اخفي الاعضاء الذين خرجوا

إخفاء الأعضاء الذين تركوا الخادم من المتصدرين

Type: `Boolean`

Default: `true`

Reset to default:
`!config hideLeftMembersFromLeaderboard default`

Enable:

`!config hideLeftMembersFromLeaderboard true`

Disable:

`!config hideLeftMembersFromLeaderboard false`

<a name=autoSubtractFakes></a>

---

## طرح تلقائي

ازاله الدعوات المزورة تلقائياً

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoSubtractFakes default`

Enable:

`!config autoSubtractFakes true`

Disable:

`!config autoSubtractFakes false`

<a name=autoSubtractLeaves></a>

---

## طرح تلقائي

ازالة الدعوات تلقائيًا من المدعو عندما يغادر

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoSubtractLeaves default`

Enable:

`!config autoSubtractLeaves true`

Disable:

`!config autoSubtractLeaves false`

<a name=autoSubtractLeaveThreshold></a>

---

## بداية الطرح التلقائي

الوقت بالثواني الذي يتعين على المستخدم البقاء فيه في السيرفر للدعوه للعد

Type: `Number`

Default: `600`

Reset to default:
`!config autoSubtractLeaveThreshold default`

Examples:

`!config autoSubtractLeaveThreshold 60`

`!config autoSubtractLeaveThreshold 3600`

<a name=rankAssignmentStyle></a>

---

## أسلوب الواجب

كيف تتم مكافأة الرتب للمستخدمين.

Type: `Enum<RankAssignmentStyle>`

Default: `all`

Reset to default:
`!config rankAssignmentStyle default`

Possible values: `all`, `highest`

Example:

`!config rankAssignmentStyle all`

<a name=rankAnnouncementChannel></a>

---

## قناه التصاريح

القناة التي يعلن فيها المستخدمون الذين يتلقون رتبة جديدة.

Type: `Channel`

Default: `null`

Reset to default:
`!config rankAnnouncementChannel default`

Examples:

`!config rankAnnouncementChannel`

`!config rankAnnouncementChannel`

<a name=rankAnnouncementMessage></a>

---

## رساله التصريح

الرسالة التي يتم إرسالها عندما يتلقى المستخدم رتبة جديدة.

Type: `String`

Default: `Congratulations, **{memberMention}** has reached the **{rankName}** rank!`

Reset to default:
`!config rankAnnouncementMessage default`

Examples:

`!config rankAnnouncementMessage`

`!config rankAnnouncementMessage`

<a name=captchaVerificationOnJoin></a>

---

## مفعل

سواء تم تفعيل التحقق من كلمة التحقق أم لا.

Type: `Boolean`

Default: `false`

Reset to default:
`!config captchaVerificationOnJoin default`

Enable:

`!config captchaVerificationOnJoin true`

Disable:

`!config captchaVerificationOnJoin false`

<a name=captchaVerificationWelcomeMessage></a>

---

## رسالة الترحيب

الرسالة التي سيحصل عليها المستخدم بعد الانضمام إلى الخادم وتوجيهه لدخول اختبار كلمة التحقق.

Type: `String`

Default: `Welcome to the server **{serverName}**! For extra protection, new members are required to enter a captcha.`

Reset to default:
`!config captchaVerificationWelcomeMessage default`

Examples:

`!config captchaVerificationWelcomeMessage Welcome, please enter the captcha below!`

<a name=captchaVerificationSuccessMessage></a>

---

## رسالة النجاح

رسالة الترحيب التي سيتم إرسالها إلى المستخدم بعد أن يتحقق بنجاح.

Type: `String`

Default: `You have successfully entered the captcha. Welcome to the server!`

Reset to default:
`!config captchaVerificationSuccessMessage default`

Examples:

`!config captchaVerificationSuccessMessage Thanks for entering the captcha, enjoy our server!`

<a name=captchaVerificationFailedMessage></a>

---

## رسالة فاشلة

الرسالة التي يتم إرسالها عندما يخفق المستخدم بكلمه التحقق.

Type: `String`

Default: `You did not enter the captha right within the specified time.We're sorry, but we have to kick you from the server. Feel free to join again.`

Reset to default:
`!config captchaVerificationFailedMessage default`

Examples:

`!config captchaVerificationFailedMessage Looks like you are not human :(. You can join again and try again later if this was a mistake!`

<a name=captchaVerificationTimeout></a>

---

## التحقق من المهلة

الوقت الذي يتم فيه إدخال كلمة التحقق بنجاح.

Type: `Number`

Default: `180`

Reset to default:
`!config captchaVerificationTimeout default`

Examples:

`!config captchaVerificationTimeout 60`

`!config captchaVerificationTimeout 600`

<a name=captchaVerificationLogEnabled></a>

---

## السجل مفعل

سواء سيتم تسجيل محاولات التحقق ام لا.

Type: `Boolean`

Default: `true`

Reset to default:
`!config captchaVerificationLogEnabled default`

Enable:

`!config captchaVerificationLogEnabled true`

Disable:

`!config captchaVerificationLogEnabled false`

<a name=autoModEnabled></a>

---

## تمكين

settings.autoModEnabled.description

Type: `Boolean`

Default: `false`

Reset to default:
`!config autoModEnabled default`

Enable:

`!config autoModEnabled true`

Disable:

`!config autoModEnabled false`

<a name=autoModModeratedChannels></a>

---

## القنوات الادارية

settings.autoModModeratedChannels.description

Type: `Channel[]`

Default: ``

Reset to default:
`!config autoModModeratedChannels default`

Examples:

`!config autoModModeratedChannels #general`

`!config autoModModeratedChannels #support,#help`

<a name=autoModModeratedRoles></a>

---

## الرتب الادارية

settings.autoModModeratedRoles.description

Type: `Role[]`

Default: ``

Reset to default:
`!config autoModModeratedRoles default`

Examples:

`!config autoModModeratedRoles @NewMembers`

`!config autoModModeratedRoles @Newbies,@Starters`

<a name=autoModIgnoredChannels></a>

---

## القنوات المتجاهلة

settings.autoModIgnoredChannels.description

Type: `Channel[]`

Default: ``

Reset to default:
`!config autoModIgnoredChannels default`

Examples:

`!config autoModIgnoredChannels #general`

`!config autoModIgnoredChannels #off-topic,#nsfw`

<a name=autoModIgnoredRoles></a>

---

## تجاهل الأدوار

settings.autoModIgnoredRoles.description

Type: `Role[]`

Default: ``

Reset to default:
`!config autoModIgnoredRoles default`

Examples:

`!config autoModIgnoredRoles @TrustedMembers`

`!config autoModIgnoredRoles @Moderators,@Staff`

<a name=mutedRole></a>

---

## رتبه صامته

settings.mutedRole.description

Type: `Role`

Default: `null`

Reset to default:
`!config mutedRole default`

Examples:

`!config mutedRole @muted`

<a name=autoModDisabledForOldMembers></a>

---

## معطل للأعضاء القدامى

settings.autoModDisabledForOldMembers.description

Type: `Boolean`

Default: `false`

Reset to default:
`!config autoModDisabledForOldMembers default`

Enable:

`!config autoModDisabledForOldMembers true`

Disable:

`!config autoModDisabledForOldMembers false`

<a name=autoModDisabledForOldMembersThreshold></a>

---

## الأعضاء القديمة عتبة

settings.autoModDisabledForOldMembersThreshold.description

Type: `Number`

Default: `604800`

Reset to default:
`!config autoModDisabledForOldMembersThreshold default`

Examples:

`!config autoModDisabledForOldMembersThreshold 604800` (1 week)``

`!config autoModDisabledForOldMembersThreshold 2419200` (1 month)``

<a name=autoModLogEnabled></a>

---

## Log Enabled

settings.autoModLogEnabled.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModLogEnabled default`

Enable:

`!config autoModLogEnabled true`

Disable:

`!config autoModLogEnabled false`

<a name=modLogChannel></a>

---

## سجل القناه الخاص بالمود

القناة التي سيتم نشر سجلات المود فيها.

Type: `Channel`

Default: `null`

Reset to default:
`!config modLogChannel default`

Examples:

`!config modLogChannel #channel`

`!config modLogChannel #logs`

<a name=autoModDeleteBotMessage></a>

---

## حذف رسائل بوت

settings.autoModDeleteBotMessage.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModDeleteBotMessage default`

Enable:

`!config autoModDeleteBotMessage true`

Disable:

`!config autoModDeleteBotMessage false`

<a name=autoModDeleteBotMessageTimeoutInSeconds></a>

---

## حذف Bot Message Timeout

settings.autoModDeleteBotMessageTimeoutInSeconds.description

Type: `Number`

Default: `5`

Reset to default:
`!config autoModDeleteBotMessageTimeoutInSeconds default`

Examples:

`!config autoModDeleteBotMessageTimeoutInSeconds 5`

`!config autoModDeleteBotMessageTimeoutInSeconds 10`

<a name=modPunishmentBanDeleteMessage></a>

---

## حذف رسائل الحظر

سواء سيتم حذف رسائل "الحظر" من عدمه تلقائيًا او لا.

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentBanDeleteMessage default`

Enable:

`!config modPunishmentBanDeleteMessage true`

Disable:

`!config modPunishmentBanDeleteMessage false`

<a name=modPunishmentKickDeleteMessage></a>

---

## حذف رسائل الطرد

سواء سيتم حذف رسائل "الطرد" من عدمه تلقائيًا او لا.

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentKickDeleteMessage default`

Enable:

`!config modPunishmentKickDeleteMessage true`

Disable:

`!config modPunishmentKickDeleteMessage false`

<a name=modPunishmentSoftbanDeleteMessage></a>

---

## حذف رسائل الحظر

سواء سيتم حذف رسائل "الحظر" من عدمه تلقائيًا او لا.

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentSoftbanDeleteMessage default`

Enable:

`!config modPunishmentSoftbanDeleteMessage true`

Disable:

`!config modPunishmentSoftbanDeleteMessage false`

<a name=modPunishmentWarnDeleteMessage></a>

---

## حذف رسائل التحذير.

سواء سيتم حذف رسائل "تحذير" من عدمه تلقائيًا او لا.

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentWarnDeleteMessage default`

Enable:

`!config modPunishmentWarnDeleteMessage true`

Disable:

`!config modPunishmentWarnDeleteMessage false`

<a name=modPunishmentMuteDeleteMessage></a>

---

## حذف رسائل الصمت

سواء سيتم حذف رسائل "الصمت" من عدمه تلقائيًا او لا.

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentMuteDeleteMessage default`

Enable:

`!config modPunishmentMuteDeleteMessage true`

Disable:

`!config modPunishmentMuteDeleteMessage false`

<a name=autoModInvitesEnabled></a>

---

## تمكين

settings.autoModInvitesEnabled.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModInvitesEnabled default`

Enable:

`!config autoModInvitesEnabled true`

Disable:

`!config autoModInvitesEnabled false`

<a name=autoModLinksEnabled></a>

---

## تمكين

settings.autoModLinksEnabled.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModLinksEnabled default`

Enable:

`!config autoModLinksEnabled true`

Disable:

`!config autoModLinksEnabled false`

<a name=autoModLinksWhitelist></a>

---

## القائمة البيضاء

settings.autoModLinksWhitelist.description

Type: `String[]`

Default: ``

Reset to default:
`!config autoModLinksWhitelist default`

Examples:

`!config autoModLinksWhitelist discordbots.org`

`!config autoModLinksWhitelist youtube.com,twitch.com`

<a name=autoModLinksBlacklist></a>

---

## القائمة السوداء

settings.autoModLinksBlacklist.description

Type: `String[]`

Default: ``

Reset to default:
`!config autoModLinksBlacklist default`

Examples:

`!config autoModLinksBlacklist google.com`

`!config autoModLinksBlacklist twitch.com,youtube.com`

<a name=autoModLinksFollowRedirects></a>

---

## Follow Redirects

settings.autoModLinksFollowRedirects.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModLinksFollowRedirects default`

Enable:

`!config autoModLinksFollowRedirects true`

Disable:

`!config autoModLinksFollowRedirects false`

<a name=autoModWordsEnabled></a>

---

## مفعل

سواء سيتم التحقق تلقائياً من رسائل المحظوره او لا.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModWordsEnabled default`

Enable:

`!config autoModWordsEnabled true`

Disable:

`!config autoModWordsEnabled false`

<a name=autoModWordsBlacklist></a>

---

## حظر

قائمه من الكلمات المحظوره

Type: `String[]`

Default: ``

Reset to default:
`!config autoModWordsBlacklist default`

Examples:

`!config autoModWordsBlacklist gay`

`!config autoModWordsBlacklist stupid,fuck`

<a name=autoModAllCapsEnabled></a>

---

## تمكين

settings.autoModAllCapsEnabled.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModAllCapsEnabled default`

Enable:

`!config autoModAllCapsEnabled true`

Disable:

`!config autoModAllCapsEnabled false`

<a name=autoModAllCapsMinCharacters></a>

---

## الحد الأدنى من الشخصيات

settings.autoModAllCapsMinCharacters.description

Type: `Number`

Default: `10`

Reset to default:
`!config autoModAllCapsMinCharacters default`

Examples:

`!config autoModAllCapsMinCharacters 5`

`!config autoModAllCapsMinCharacters 15`

<a name=autoModAllCapsPercentageCaps></a>

---

## النسبة المئوية CAPs

settings.autoModAllCapsPercentageCaps.description

Type: `Number`

Default: `70`

Reset to default:
`!config autoModAllCapsPercentageCaps default`

Examples:

`!config autoModAllCapsPercentageCaps 50`

`!config autoModAllCapsPercentageCaps 90`

<a name=autoModDuplicateTextEnabled></a>

---

## تمكين

settings.autoModDuplicateTextEnabled.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModDuplicateTextEnabled default`

Enable:

`!config autoModDuplicateTextEnabled true`

Disable:

`!config autoModDuplicateTextEnabled false`

<a name=autoModDuplicateTextTimeframeInSeconds></a>

---

## الإطار الزمني بالثواني

settings.autoModDuplicateTextTimeframeInSeconds.description

Type: `Number`

Default: `60`

Reset to default:
`!config autoModDuplicateTextTimeframeInSeconds default`

Examples:

`!config autoModDuplicateTextTimeframeInSeconds 5`

`!config autoModDuplicateTextTimeframeInSeconds 20`

<a name=autoModQuickMessagesEnabled></a>

---

## مفعل

settings.autoModQuickMessagesEnabled.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModQuickMessagesEnabled default`

Enable:

`!config autoModQuickMessagesEnabled true`

Disable:

`!config autoModQuickMessagesEnabled false`

<a name=autoModQuickMessagesNumberOfMessages></a>

---

## # من الرسائل

settings.autoModQuickMessagesNumberOfMessages.description

Type: `Number`

Default: `5`

Reset to default:
`!config autoModQuickMessagesNumberOfMessages default`

Examples:

`!config autoModQuickMessagesNumberOfMessages 5`

`!config autoModQuickMessagesNumberOfMessages 10`

<a name=autoModQuickMessagesTimeframeInSeconds></a>

---

## الإطار الزمني بالثواني

settings.autoModQuickMessagesTimeframeInSeconds.description

Type: `Number`

Default: `3`

Reset to default:
`!config autoModQuickMessagesTimeframeInSeconds default`

Examples:

`!config autoModQuickMessagesTimeframeInSeconds 2`

`!config autoModQuickMessagesTimeframeInSeconds 10`

<a name=autoModMentionUsersEnabled></a>

---

## تمكين

settings.autoModMentionUsersEnabled.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModMentionUsersEnabled default`

Enable:

`!config autoModMentionUsersEnabled true`

Disable:

`!config autoModMentionUsersEnabled false`

<a name=autoModMentionUsersMaxNumberOfMentions></a>

---

## Max # of Mentions

settings.autoModMentionUsersMaxNumberOfMentions.description

Type: `Number`

Default: `5`

Reset to default:
`!config autoModMentionUsersMaxNumberOfMentions default`

Examples:

`!config autoModMentionUsersMaxNumberOfMentions 2`

`!config autoModMentionUsersMaxNumberOfMentions 5`

<a name=autoModMentionRolesEnabled></a>

---

## تمكين

settings.autoModMentionRolesEnabled.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModMentionRolesEnabled default`

Enable:

`!config autoModMentionRolesEnabled true`

Disable:

`!config autoModMentionRolesEnabled false`

<a name=autoModMentionRolesMaxNumberOfMentions></a>

---

## Max # of Mentions

settings.autoModMentionRolesMaxNumberOfMentions.description

Type: `Number`

Default: `3`

Reset to default:
`!config autoModMentionRolesMaxNumberOfMentions default`

Examples:

`!config autoModMentionRolesMaxNumberOfMentions 2`

`!config autoModMentionRolesMaxNumberOfMentions 5`

<a name=autoModEmojisEnabled></a>

---

## تمكين

settings.autoModEmojisEnabled.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModEmojisEnabled default`

Enable:

`!config autoModEmojisEnabled true`

Disable:

`!config autoModEmojisEnabled false`

<a name=autoModEmojisMaxNumberOfEmojis></a>

---

## ماكس # من Emojis

settings.autoModEmojisMaxNumberOfEmojis.description

Type: `Number`

Default: `5`

Reset to default:
`!config autoModEmojisMaxNumberOfEmojis default`

Examples:

`!config autoModEmojisMaxNumberOfEmojis 5`

`!config autoModEmojisMaxNumberOfEmojis 10`

<a name=autoModHoistEnabled></a>

---

## Dehoist ممكن

settings.autoModHoistEnabled.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModHoistEnabled default`

Enable:

`!config autoModHoistEnabled true`

Disable:

`!config autoModHoistEnabled false`

<a name=musicVolume></a>

---

## طبقة صوت الموسيقى

الصوت المعتاد الذي تم ضبطه عند دخول بوت لقناه صوتيه.

Type: `Number`

Default: `100`

Reset to default:
`!config musicVolume default`

<a name=announceNextSong></a>

---

## اعلان الاغنيه التاليه

ما إذا كان سيتم الإعلان عن الأغنية التالية في القناة الصوتية أم لا.

Type: `Boolean`

Default: `true`

Reset to default:
`!config announceNextSong default`

Enable:

`!config announceNextSong true`

Disable:

`!config announceNextSong false`

<a name=announcementVoice></a>

---

## صوت الاعلانات.

الصوت المستخدم في إعلانات الأغنية التاليه.

Type: `Enum<AnnouncementVoice>`

Default: `Joanna`

Reset to default:
`!config announcementVoice default`

Possible values: `Joanna`, `Salli`, `Kendra`, `Kimberly`, `Ivy`, `Matthew`, `Justin`, `Joey`

Example:

`!config announcementVoice Joanna`

<a name=fadeMusicOnTalk></a>

---

## تلاشي الموسيقى على التكلم

اذا مفعل, الموسيقى ستبدأ بالتلاشي عندما يتحدث الناس

Type: `Boolean`

Default: `true`

Reset to default:
`!config fadeMusicOnTalk default`

Enable:

`!config fadeMusicOnTalk true`

Disable:

`!config fadeMusicOnTalk false`

<a name=fadeMusicEndDelay></a>

---

## تلاشي الموسيقى نهايه التأخير

تأخر عدد الثواني التي يجب ألا يتحدث فيها أحد من أجل عودة مستوى الصوت إلى طبيعته.

Type: `Number`

Default: `1`

Reset to default:
`!config fadeMusicEndDelay default`

<a name=defaultMusicPlatform></a>

---

## settings.defaultMusicPlatform.title

settings.defaultMusicPlatform.description

Type: `Enum<MusicPlatformTypes>`

Default: `soundcloud`

Reset to default:
`!config defaultMusicPlatform default`

<a name=disabledMusicPlatforms></a>

---

## settings.disabledMusicPlatforms.title

settings.disabledMusicPlatforms.description

Type: `Enum<MusicPlatformTypes>[]`

Default: ``

Reset to default:
`!config disabledMusicPlatforms default`
