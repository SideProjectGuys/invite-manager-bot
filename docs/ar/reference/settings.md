# Configs

There are many config options that can be set. You don't have to set all of them. If you just added the bot, just run `!setup`, which will guide you through the most important ones.

## Overview

### settings.groups.custom_bot.title

| Setting                                                | Description                            |
| ------------------------------------------------------ | -------------------------------------- |
| [settings.activityEnabled.title](#activityenabled)     | settings.activityEnabled.description   |
| [settings.activityMessage.title](#activitymessage)     | settings.activityMessage.description   |
| [settings.activityStatus.title](#activitystatus)       | settings.activityStatus.description    |
| [settings.activityType.title](#activitytype)           | settings.activityType.description      |
| [settings.activityUrl.title](#activityurl)             | settings.activityUrl.description       |
| [settings.embedDefaultColor.title](#embeddefaultcolor) | settings.embedDefaultColor.description |

### عام

| Setting                               | Description                                 |
| ------------------------------------- | ------------------------------------------- |
| [القنوات المتجاهلة](#ignoredchannels) | القنوات التي سيتجاهل فيها البوت الأوامر.    |
| [بريفكس](#prefix)                     | البريفكس المستخدم لتشغيل أوامر البوت.       |
| [قناه السجل](#logchannel)             | القناه التي يتم تسجيل حركات البوت فيها.     |
| [قنوات الأوامر](#channels)            | القنوات التي سيتفاعل فيها البوت مع الأوامر. |
| [لغه](#lang)                          | لغة البوت                                   |

### دعوات

| Setting                                                    | Description                              |
| ---------------------------------------------------------- | ---------------------------------------- |
| [settings.hideFromLeaderboard.title](#hidefromleaderboard) | settings.hideFromLeaderboard.description |
| [settings.name.title](#name)                               | settings.name.description                |
| [settings.roles.title](#roles)                             | settings.roles.description               |

#### المزيفون

| Setting                          | Description                    |
| -------------------------------- | ------------------------------ |
| [طرح تلقائي](#autosubtractfakes) | ازاله الدعوات المزورة تلقائياً |

#### General

| Setting                  | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| [Join Roles](#joinroles) | Roles that are assigned to all members when joining. |

#### الانضمامات

| Setting                             | Description                                       |
| ----------------------------------- | ------------------------------------------------- |
| [رساله](#joinmessage)               | الرسالة المرسلة عندما يدخل شخص ما الخادم/السيرفر. |
| [قناه الرسائل](#joinmessagechannel) | القناة التي يتم إرسال رسالة الدخول فيها.          |

#### المتصدرين

| Setting                                                     | Description                                   |
| ----------------------------------------------------------- | --------------------------------------------- |
| [اخفي الاعضاء الذين خرجوا](#hideleftmembersfromleaderboard) | إخفاء الأعضاء الذين تركوا الخادم من المتصدرين |
| [اسلوب ](#leaderboardstyle)                                 | مظهر اسلوب المتصدرين                          |

#### المغادرات

| Setting                                             | Description                                                              |
| --------------------------------------------------- | ------------------------------------------------------------------------ |
| [بداية الطرح التلقائي](#autosubtractleavethreshold) | الوقت بالثواني الذي يتعين على المستخدم البقاء فيه في السيرفر للدعوه للعد |
| [رساله](#leavemessage)                              | الرسالة المرسلة عندما يترك شخص ما الخادم/السيرفر.                        |
| [طرح تلقائي](#autosubtractleaves)                   | ازالة الدعوات تلقائيًا من المدعو عندما يغادر                             |
| [قناه الرسائل](#leavemessagechannel)                | القناة التي يتم إرسال رسالة الخروج فيها.                                 |

#### رتب

| Setting                                   | Description                                               |
| ----------------------------------------- | --------------------------------------------------------- |
| [أسلوب الواجب](#rankassignmentstyle)      | كيف تتم مكافأة الرتب للمستخدمين.                          |
| [رساله التصريح](#rankannouncementmessage) | الرسالة التي يتم إرسالها عندما يتلقى المستخدم رتبة جديدة. |
| [قناه التصاريح](#rankannouncementchannel) | القناة التي يعلن فيها المستخدمون الذين يتلقون رتبة جديدة. |

### اداره

#### كلمات محظوره

| Setting                       | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| [حظر](#automodwordsblacklist) | قائمه من الكلمات المحظوره                          |
| [مفعل](#automodwordsenabled)  | سواء سيتم التحقق تلقائياً من رسائل المحظوره او لا. |

#### احرف كبيره

| Setting                                                 | Description                                                                                                       |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [الحد الأدنى من الشخصيات](#automodallcapsmincharacters) | The minimum amount of characters in a message to be considered for moderating (setting to '3' would ignore 'OK'). |
| [النسبة المئوية CAPs](#automodallcapspercentagecaps)    | The percentage of characters of the message that have to be CAPs for the rule to trigger.                         |
| [تمكين](#automodallcapsenabled)                         | Automatically moderate messages with A LOT OF CAPS.                                                               |

#### كلمة التحقق

| Setting                                             | Description                                                                                 |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [التحقق من المهلة](#captchaverificationtimeout)     | الوقت الذي يتم فيه إدخال كلمة التحقق بنجاح.                                                 |
| [السجل مفعل](#captchaverificationlogenabled)        | سواء سيتم تسجيل محاولات التحقق ام لا.                                                       |
| [رسالة الترحيب](#captchaverificationwelcomemessage) | الرسالة التي سيحصل عليها المستخدم بعد الانضمام إلى الخادم وتوجيهه لدخول اختبار كلمة التحقق. |
| [رسالة النجاح](#captchaverificationsuccessmessage)  | رسالة الترحيب التي سيتم إرسالها إلى المستخدم بعد أن يتحقق بنجاح.                            |
| [رسالة فاشلة](#captchaverificationfailedmessage)    | الرسالة التي يتم إرسالها عندما يخفق المستخدم بكلمه التحقق.                                  |
| [مفعل](#captchaverificationonjoin)                  | سواء تم تفعيل التحقق من كلمة التحقق أم لا.                                                  |

#### رسائل مكررة

| Setting                                                           | Description                                                         |
| ----------------------------------------------------------------- | ------------------------------------------------------------------- |
| [الإطار الزمني بالثواني](#automodduplicatetexttimeframeinseconds) | The timeframe whithin which messages will be considered duplicates. |
| [تمكين](#automodduplicatetextenabled)                             | Automatically moderate duplicate messages (copy-paste spam).        |

#### ايموجيز - تعبير وجه

| Setting                                             | Description                                                                                                               |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [Enabled](#automodhoistenabled)                     | Automatically give members nicknames if they try to hoist (use special characters to appear at the top of the user list). |
| [تمكين](#automodemojisenabled)                      | Automatically moderate messages with an excessive amount of emojis.                                                       |
| [ماكس # من Emojis](#automodemojismaxnumberofemojis) | The maximum amount of emojis a message is allowed to have before trigger the rule.                                        |

#### عام

| Setting                                                        | Description                                                                                                                                                  |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [الأعضاء القديمة عتبة](#automoddisabledforoldmembersthreshold) | The amount of time a member has to be in your server to be considered 'old'.                                                                                 |
| [الرتب الادارية](#automodmoderatedroles)                       | The list of roles that are moderated (this acts as a whitelist, leave empty to moderate all roles, or use `autoModIgnoredRoles` to ignore certain roles).    |
| [القنوات الادارية](#automodmoderatedchannels)                  | The list of moderated channels (this acts as a whitelist, leave empty to moderate all channels, or use `autoModIgnoredChannels` to ignore certain channels). |
| [القنوات المتجاهلة](#automodignoredchannels)                   | Channels that are ignored while automatically moderating.                                                                                                    |
| [تجاهل الأدوار](#automodignoredroles)                          | Any members with these roles will not automatically be moderated.                                                                                            |
| [تمكين](#automodenabled)                                       | Automatically moderate messages (specific rules can also be turned on or off, this has to be ON for ANY rule to work).                                       |
| [رتبه صامته](#mutedrole)                                       | The role that is given to people who are muted. Make sure this role is denied the "Send Message" permission.                                                 |
| [معطل للأعضاء القدامى](#automoddisabledforoldmembers)          | Disabled auto moderation for members that have been in your server for a long time.                                                                          |

#### دعوات

| Setting                         | Description                                                           |
| ------------------------------- | --------------------------------------------------------------------- |
| [تمكين](#automodinvitesenabled) | Automatically scan messages for discord invite links and remove them. |

#### روابط

| Setting                                          | Description                                                                             |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| [Follow Redirects](#automodlinksfollowredirects) | Enable this to resolve redirects for links.                                             |
| [القائمة البيضاء](#automodlinkswhitelist)        | A list of links that users are allowed to post.                                         |
| [القائمة السوداء](#automodlinksblacklist)        | Blacklist certain links which users won't be able to post.                              |
| [تمكين](#automodlinksenabled)                    | Automatically remove messages containing links (you can set a whitelist and blacklist). |

#### تسجيل

| Setting                                                             | Description                                                         |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [Log Enabled](#automodlogenabled)                                   | Log any moderation actions that the bot makes.                      |
| [حذف Bot Message Timeout](#automoddeletebotmessagetimeoutinseconds) | The timeout after which bot messages are deleted.                   |
| [حذف رسائل التحذير.](#modpunishmentwarndeletemessage)               | سواء سيتم حذف رسائل "تحذير" من عدمه تلقائيًا او لا.                 |
| [حذف رسائل الحظر](#modpunishmentbandeletemessage)                   | سواء سيتم حذف رسائل "الحظر" من عدمه تلقائيًا او لا.                 |
| [حذف رسائل الحظر](#modpunishmentsoftbandeletemessage)               | سواء سيتم حذف رسائل "الحظر" من عدمه تلقائيًا او لا.                 |
| [حذف رسائل الصمت](#modpunishmentmutedeletemessage)                  | سواء سيتم حذف رسائل "الصمت" من عدمه تلقائيًا او لا.                 |
| [حذف رسائل الطرد](#modpunishmentkickdeletemessage)                  | سواء سيتم حذف رسائل "الطرد" من عدمه تلقائيًا او لا.                 |
| [حذف رسائل بوت](#automoddeletebotmessage)                           | Automatically delete the bots own messages (keeps your chat clean). |
| [سجل القناه الخاص بالمود](#modlogchannel)                           | القناة التي سيتم نشر سجلات المود فيها.                              |

#### إشارات

| Setting                                                      | Description                                                                |
| ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| [Max # of Mentions](#automodmentionusersmaxnumberofmentions) | The maximum amount of users a member can mention in a message.             |
| [Max # of Mentions](#automodmentionrolesmaxnumberofmentions) | The maximum amount of roles a member can mention in a message.             |
| [تمكين](#automodmentionusersenabled)                         | Automatically moderate messages that mention an excessive amount of users. |
| [تمكين](#automodmentionrolesenabled)                         | Automatically moderate messages that mention an excessive amount of roles. |

#### سبام/اصرار

| Setting                                                           | Description                                                                           |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [# من الرسائل](#automodquickmessagesnumberofmessages)             | The number of messages that have to be sent within the timeframe to trigger the rule. |
| [الإطار الزمني بالثواني](#automodquickmessagestimeframeinseconds) | The timeframe within which a user is allowed to send a maximum amount of messages.    |
| [مفعل](#automodquickmessagesenabled)                              | Automatically moderate users sending a lot of messages in a short time.               |

### موسيقى

#### Announcement

| Setting                                    | Description                                                         |
| ------------------------------------------ | ------------------------------------------------------------------- |
| [اعلان الاغنيه التاليه](#announcenextsong) | ما إذا كان سيتم الإعلان عن الأغنية التالية في القناة الصوتية أم لا. |
| [صوت الاعلانات.](#announcementvoice)       | الصوت المستخدم في إعلانات الأغنية التاليه.                          |

#### Fade Music

| Setting                                            | Description                                                                      |
| -------------------------------------------------- | -------------------------------------------------------------------------------- |
| [تلاشي الموسيقى على التكلم](#fademusicontalk)      | اذا مفعل, الموسيقى ستبدأ بالتلاشي عندما يتحدث الناس                              |
| [تلاشي الموسيقى نهايه التأخير](#fademusicenddelay) | تأخر عدد الثواني التي يجب ألا يتحدث فيها أحد من أجل عودة مستوى الصوت إلى طبيعته. |

#### موسيقى

| Setting                           | Description                                          |
| --------------------------------- | ---------------------------------------------------- |
| [طبقة صوت الموسيقى](#musicvolume) | الصوت المعتاد الذي تم ضبطه عند دخول بوت لقناه صوتيه. |

#### Platform

| Setting                                             | Description                                                                               |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [Default Music Platform](#defaultmusicplatform)     | The platform that is used to search / play music when no platform is selected explicitly. |
| [Disabled Music Platforms](#disabledmusicplatforms) | Music platforms that are disabled and cannot be used to play music.                       |

<a name=activityEnabled></a>

---

## settings.groups.custom_bot.title - settings.activityEnabled.title

settings.activityEnabled.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config activityEnabled default`

Enable:

`!config activityEnabled true`

Disable:

`!config activityEnabled false`

<a name=activityMessage></a>

---

## settings.groups.custom_bot.title - settings.activityMessage.title

settings.activityMessage.description

Type: `String`

Default: `null`

Reset to default:
`!config activityMessage default`

<a name=activityStatus></a>

---

## settings.groups.custom_bot.title - settings.activityStatus.title

settings.activityStatus.description

Type: `Enum`

Default: `online`

Reset to default:
`!config activityStatus default`

Possible values: `online`, `dnd`, `idle`

Example:

`!config activityStatus online`

<a name=activityType></a>

---

## settings.groups.custom_bot.title - settings.activityType.title

settings.activityType.description

Type: `Enum`

Default: `playing`

Reset to default:
`!config activityType default`

Possible values: `playing`, `streaming`, `listening`, `watching`

Example:

`!config activityType playing`

<a name=activityUrl></a>

---

## settings.groups.custom_bot.title - settings.activityUrl.title

settings.activityUrl.description

Type: `String`

Default: `null`

Reset to default:
`!config activityUrl default`

<a name=embedDefaultColor></a>

---

## settings.groups.custom_bot.title - settings.embedDefaultColor.title

settings.embedDefaultColor.description

Type: `String`

Default: `null`

Reset to default:
`!config embedDefaultColor default`

<a name=ignoredChannels></a>

---

## عام - القنوات المتجاهلة

القنوات التي سيتجاهل فيها البوت الأوامر.

Type: `Channel[]`

Default: ``

Reset to default:
`!config ignoredChannels default`

<a name=prefix></a>

---

## عام - بريفكس

البريفكس المستخدم لتشغيل أوامر البوت.

Type: `String`

Default: `!`

Reset to default:
`!config prefix default`

Examples:

`!config prefix +`

`!config prefix >`

<a name=logChannel></a>

---

## عام - قناه السجل

القناه التي يتم تسجيل حركات البوت فيها.

Type: `Channel`

Default: `null`

Reset to default:
`!config logChannel default`

Examples:

`!config logChannel #channel`

<a name=channels></a>

---

## عام - قنوات الأوامر

القنوات التي سيتفاعل فيها البوت مع الأوامر.

Type: `Channel[]`

Default: ``

Reset to default:
`!config channels default`

<a name=lang></a>

---

## عام - لغه

لغة البوت

Type: `Enum`

Default: `en`

Reset to default:
`!config lang default`

Possible values: `ar`, `bg`, `cs`, `de`, `el`, `en`, `es`, `fr`, `hu`, `id_ID`, `it`, `ja`, `lt`, `nl`, `pl`, `pt`, `pt_BR`, `ro`, `ru`, `sr`, `tr`, `zh_CN`, `zh_TW`

Example:

`!config lang ar`

<a name=hideFromLeaderboard></a>

---

## دعوات - settings.hideFromLeaderboard.title

settings.hideFromLeaderboard.description

Type: `Boolean`

Default: `false`

Reset to default:
`!config hideFromLeaderboard default`

Enable:

`!config hideFromLeaderboard true`

Disable:

`!config hideFromLeaderboard false`

<a name=name></a>

---

## دعوات - settings.name.title

settings.name.description

Type: `String`

Default: `null`

Reset to default:
`!config name default`

<a name=roles></a>

---

## دعوات - settings.roles.title

settings.roles.description

Type: `Role[]`

Default: ``

Reset to default:
`!config roles default`

<a name=autoSubtractFakes></a>

---

## دعوات - المزيفون - طرح تلقائي

ازاله الدعوات المزورة تلقائياً

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoSubtractFakes default`

Enable:

`!config autoSubtractFakes true`

Disable:

`!config autoSubtractFakes false`

<a name=joinRoles></a>

---

## دعوات - General - Join Roles

Roles that are assigned to all members when joining.

Type: `Role[]`

Default: ``

Reset to default:
`!config joinRoles default`

<a name=joinMessage></a>

---

## دعوات - الانضمامات - رساله

الرسالة المرسلة عندما يدخل شخص ما الخادم/السيرفر.

Type: `String`

Default: `{memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)`

Reset to default:
`!config joinMessage default`

<a name=joinMessageChannel></a>

---

## دعوات - الانضمامات - قناه الرسائل

القناة التي يتم إرسال رسالة الدخول فيها.

Type: `Channel`

Default: `null`

Reset to default:
`!config joinMessageChannel default`

Examples:

`!config joinMessageChannel #general`

`!config joinMessageChannel #joins`

<a name=hideLeftMembersFromLeaderboard></a>

---

## دعوات - المتصدرين - اخفي الاعضاء الذين خرجوا

إخفاء الأعضاء الذين تركوا الخادم من المتصدرين

Type: `Boolean`

Default: `true`

Reset to default:
`!config hideLeftMembersFromLeaderboard default`

Enable:

`!config hideLeftMembersFromLeaderboard true`

Disable:

`!config hideLeftMembersFromLeaderboard false`

<a name=leaderboardStyle></a>

---

## دعوات - المتصدرين - اسلوب

مظهر اسلوب المتصدرين

Type: `Enum`

Default: `normal`

Reset to default:
`!config leaderboardStyle default`

Possible values: `normal`, `table`, `mentions`

Example:

`!config leaderboardStyle normal`

<a name=autoSubtractLeaveThreshold></a>

---

## دعوات - المغادرات - بداية الطرح التلقائي

الوقت بالثواني الذي يتعين على المستخدم البقاء فيه في السيرفر للدعوه للعد

Type: `Number`

Default: `600`

Reset to default:
`!config autoSubtractLeaveThreshold default`

Examples:

`!config autoSubtractLeaveThreshold 60`

`!config autoSubtractLeaveThreshold 3600`

<a name=leaveMessage></a>

---

## دعوات - المغادرات - رساله

الرسالة المرسلة عندما يترك شخص ما الخادم/السيرفر.

Type: `String`

Default: `{memberName} **left**; Invited by **{inviterName}**`

Reset to default:
`!config leaveMessage default`

Examples:

`!config leaveMessage`

`!config leaveMessage`

<a name=autoSubtractLeaves></a>

---

## دعوات - المغادرات - طرح تلقائي

ازالة الدعوات تلقائيًا من المدعو عندما يغادر

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoSubtractLeaves default`

Enable:

`!config autoSubtractLeaves true`

Disable:

`!config autoSubtractLeaves false`

<a name=leaveMessageChannel></a>

---

## دعوات - المغادرات - قناه الرسائل

القناة التي يتم إرسال رسالة الخروج فيها.

Type: `Channel`

Default: `null`

Reset to default:
`!config leaveMessageChannel default`

Examples:

`!config leaveMessageChannel #general`

`!config leaveMessageChannel #leaves`

<a name=rankAssignmentStyle></a>

---

## دعوات - رتب - أسلوب الواجب

كيف تتم مكافأة الرتب للمستخدمين.

Type: `Enum`

Default: `all`

Reset to default:
`!config rankAssignmentStyle default`

Possible values: `all`, `highest`, `onlyAdd`

Example:

`!config rankAssignmentStyle all`

<a name=rankAnnouncementMessage></a>

---

## دعوات - رتب - رساله التصريح

الرسالة التي يتم إرسالها عندما يتلقى المستخدم رتبة جديدة.

Type: `String`

Default: `Congratulations, **{memberMention}** has reached the **{rankName}** rank!`

Reset to default:
`!config rankAnnouncementMessage default`

Examples:

`!config rankAnnouncementMessage`

`!config rankAnnouncementMessage`

<a name=rankAnnouncementChannel></a>

---

## دعوات - رتب - قناه التصاريح

القناة التي يعلن فيها المستخدمون الذين يتلقون رتبة جديدة.

Type: `Channel`

Default: `null`

Reset to default:
`!config rankAnnouncementChannel default`

Examples:

`!config rankAnnouncementChannel`

`!config rankAnnouncementChannel`

<a name=autoModWordsBlacklist></a>

---

## اداره - كلمات محظوره - حظر

قائمه من الكلمات المحظوره

Type: `String[]`

Default: ``

Reset to default:
`!config autoModWordsBlacklist default`

Examples:

`!config autoModWordsBlacklist gay`

`!config autoModWordsBlacklist stupid,fuck`

<a name=autoModWordsEnabled></a>

---

## اداره - كلمات محظوره - مفعل

سواء سيتم التحقق تلقائياً من رسائل المحظوره او لا.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModWordsEnabled default`

Enable:

`!config autoModWordsEnabled true`

Disable:

`!config autoModWordsEnabled false`

<a name=autoModAllCapsMinCharacters></a>

---

## اداره - احرف كبيره - الحد الأدنى من الشخصيات

The minimum amount of characters in a message to be considered for moderating (setting to '3' would ignore 'OK').

Type: `Number`

Default: `10`

Reset to default:
`!config autoModAllCapsMinCharacters default`

Examples:

`!config autoModAllCapsMinCharacters 5`

`!config autoModAllCapsMinCharacters 15`

<a name=autoModAllCapsPercentageCaps></a>

---

## اداره - احرف كبيره - النسبة المئوية CAPs

The percentage of characters of the message that have to be CAPs for the rule to trigger.

Type: `Number`

Default: `70`

Reset to default:
`!config autoModAllCapsPercentageCaps default`

Examples:

`!config autoModAllCapsPercentageCaps 50`

`!config autoModAllCapsPercentageCaps 90`

<a name=autoModAllCapsEnabled></a>

---

## اداره - احرف كبيره - تمكين

Automatically moderate messages with A LOT OF CAPS.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModAllCapsEnabled default`

Enable:

`!config autoModAllCapsEnabled true`

Disable:

`!config autoModAllCapsEnabled false`

<a name=captchaVerificationTimeout></a>

---

## اداره - كلمة التحقق - التحقق من المهلة

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

## اداره - كلمة التحقق - السجل مفعل

سواء سيتم تسجيل محاولات التحقق ام لا.

Type: `Boolean`

Default: `true`

Reset to default:
`!config captchaVerificationLogEnabled default`

Enable:

`!config captchaVerificationLogEnabled true`

Disable:

`!config captchaVerificationLogEnabled false`

<a name=captchaVerificationWelcomeMessage></a>

---

## اداره - كلمة التحقق - رسالة الترحيب

الرسالة التي سيحصل عليها المستخدم بعد الانضمام إلى الخادم وتوجيهه لدخول اختبار كلمة التحقق.

Type: `String`

Default: `Welcome to the server **{serverName}**! For extra protection, new members are required to enter a captcha.`

Reset to default:
`!config captchaVerificationWelcomeMessage default`

Examples:

`!config captchaVerificationWelcomeMessage Welcome, please enter the captcha below!`

<a name=captchaVerificationSuccessMessage></a>

---

## اداره - كلمة التحقق - رسالة النجاح

رسالة الترحيب التي سيتم إرسالها إلى المستخدم بعد أن يتحقق بنجاح.

Type: `String`

Default: `You have successfully entered the captcha. Welcome to the server!`

Reset to default:
`!config captchaVerificationSuccessMessage default`

Examples:

`!config captchaVerificationSuccessMessage Thanks for entering the captcha, enjoy our server!`

<a name=captchaVerificationFailedMessage></a>

---

## اداره - كلمة التحقق - رسالة فاشلة

الرسالة التي يتم إرسالها عندما يخفق المستخدم بكلمه التحقق.

Type: `String`

Default: `You did not enter the captha right within the specified time.We're sorry, but we have to kick you from the server. Feel free to join again.`

Reset to default:
`!config captchaVerificationFailedMessage default`

Examples:

`!config captchaVerificationFailedMessage Looks like you are not human :(. You can join again and try again later if this was a mistake!`

<a name=captchaVerificationOnJoin></a>

---

## اداره - كلمة التحقق - مفعل

سواء تم تفعيل التحقق من كلمة التحقق أم لا.

Type: `Boolean`

Default: `false`

Reset to default:
`!config captchaVerificationOnJoin default`

Enable:

`!config captchaVerificationOnJoin true`

Disable:

`!config captchaVerificationOnJoin false`

<a name=autoModDuplicateTextTimeframeInSeconds></a>

---

## اداره - رسائل مكررة - الإطار الزمني بالثواني

The timeframe whithin which messages will be considered duplicates.

Type: `Number`

Default: `60`

Reset to default:
`!config autoModDuplicateTextTimeframeInSeconds default`

Examples:

`!config autoModDuplicateTextTimeframeInSeconds 5`

`!config autoModDuplicateTextTimeframeInSeconds 20`

<a name=autoModDuplicateTextEnabled></a>

---

## اداره - رسائل مكررة - تمكين

Automatically moderate duplicate messages (copy-paste spam).

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModDuplicateTextEnabled default`

Enable:

`!config autoModDuplicateTextEnabled true`

Disable:

`!config autoModDuplicateTextEnabled false`

<a name=autoModHoistEnabled></a>

---

## اداره - ايموجيز - تعبير وجه - Enabled

Automatically give members nicknames if they try to hoist (use special characters to appear at the top of the user list).

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModHoistEnabled default`

Enable:

`!config autoModHoistEnabled true`

Disable:

`!config autoModHoistEnabled false`

<a name=autoModEmojisEnabled></a>

---

## اداره - ايموجيز - تعبير وجه - تمكين

Automatically moderate messages with an excessive amount of emojis.

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

## اداره - ايموجيز - تعبير وجه - ماكس # من Emojis

The maximum amount of emojis a message is allowed to have before trigger the rule.

Type: `Number`

Default: `5`

Reset to default:
`!config autoModEmojisMaxNumberOfEmojis default`

Examples:

`!config autoModEmojisMaxNumberOfEmojis 5`

`!config autoModEmojisMaxNumberOfEmojis 10`

<a name=autoModDisabledForOldMembersThreshold></a>

---

## اداره - عام - الأعضاء القديمة عتبة

The amount of time a member has to be in your server to be considered 'old'.

Type: `Number`

Default: `604800`

Reset to default:
`!config autoModDisabledForOldMembersThreshold default`

Examples:

`!config autoModDisabledForOldMembersThreshold 604800` (1 week)``

`!config autoModDisabledForOldMembersThreshold 2419200` (1 month)``

<a name=autoModModeratedRoles></a>

---

## اداره - عام - الرتب الادارية

The list of roles that are moderated (this acts as a whitelist, leave empty to moderate all roles, or use `autoModIgnoredRoles` to ignore certain roles).

Type: `Role[]`

Default: ``

Reset to default:
`!config autoModModeratedRoles default`

Examples:

`!config autoModModeratedRoles @NewMembers`

`!config autoModModeratedRoles @Newbies,@Starters`

<a name=autoModModeratedChannels></a>

---

## اداره - عام - القنوات الادارية

The list of moderated channels (this acts as a whitelist, leave empty to moderate all channels, or use `autoModIgnoredChannels` to ignore certain channels).

Type: `Channel[]`

Default: ``

Reset to default:
`!config autoModModeratedChannels default`

Examples:

`!config autoModModeratedChannels #general`

`!config autoModModeratedChannels #support,#help`

<a name=autoModIgnoredChannels></a>

---

## اداره - عام - القنوات المتجاهلة

Channels that are ignored while automatically moderating.

Type: `Channel[]`

Default: ``

Reset to default:
`!config autoModIgnoredChannels default`

Examples:

`!config autoModIgnoredChannels #general`

`!config autoModIgnoredChannels #off-topic,#nsfw`

<a name=autoModIgnoredRoles></a>

---

## اداره - عام - تجاهل الأدوار

Any members with these roles will not automatically be moderated.

Type: `Role[]`

Default: ``

Reset to default:
`!config autoModIgnoredRoles default`

Examples:

`!config autoModIgnoredRoles @TrustedMembers`

`!config autoModIgnoredRoles @Moderators,@Staff`

<a name=autoModEnabled></a>

---

## اداره - عام - تمكين

Automatically moderate messages (specific rules can also be turned on or off, this has to be ON for ANY rule to work).

Type: `Boolean`

Default: `false`

Reset to default:
`!config autoModEnabled default`

Enable:

`!config autoModEnabled true`

Disable:

`!config autoModEnabled false`

<a name=mutedRole></a>

---

## اداره - عام - رتبه صامته

The role that is given to people who are muted. Make sure this role is denied the "Send Message" permission.

Type: `Role`

Default: `null`

Reset to default:
`!config mutedRole default`

Examples:

`!config mutedRole @muted`

<a name=autoModDisabledForOldMembers></a>

---

## اداره - عام - معطل للأعضاء القدامى

Disabled auto moderation for members that have been in your server for a long time.

Type: `Boolean`

Default: `false`

Reset to default:
`!config autoModDisabledForOldMembers default`

Enable:

`!config autoModDisabledForOldMembers true`

Disable:

`!config autoModDisabledForOldMembers false`

<a name=autoModInvitesEnabled></a>

---

## اداره - دعوات - تمكين

Automatically scan messages for discord invite links and remove them.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModInvitesEnabled default`

Enable:

`!config autoModInvitesEnabled true`

Disable:

`!config autoModInvitesEnabled false`

<a name=autoModLinksFollowRedirects></a>

---

## اداره - روابط - Follow Redirects

Enable this to resolve redirects for links.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModLinksFollowRedirects default`

Enable:

`!config autoModLinksFollowRedirects true`

Disable:

`!config autoModLinksFollowRedirects false`

<a name=autoModLinksWhitelist></a>

---

## اداره - روابط - القائمة البيضاء

A list of links that users are allowed to post.

Type: `String[]`

Default: ``

Reset to default:
`!config autoModLinksWhitelist default`

Examples:

`!config autoModLinksWhitelist discordbots.org`

`!config autoModLinksWhitelist youtube.com,twitch.com`

<a name=autoModLinksBlacklist></a>

---

## اداره - روابط - القائمة السوداء

Blacklist certain links which users won't be able to post.

Type: `String[]`

Default: ``

Reset to default:
`!config autoModLinksBlacklist default`

Examples:

`!config autoModLinksBlacklist google.com`

`!config autoModLinksBlacklist twitch.com,youtube.com`

<a name=autoModLinksEnabled></a>

---

## اداره - روابط - تمكين

Automatically remove messages containing links (you can set a whitelist and blacklist).

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModLinksEnabled default`

Enable:

`!config autoModLinksEnabled true`

Disable:

`!config autoModLinksEnabled false`

<a name=autoModLogEnabled></a>

---

## اداره - تسجيل - Log Enabled

Log any moderation actions that the bot makes.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModLogEnabled default`

Enable:

`!config autoModLogEnabled true`

Disable:

`!config autoModLogEnabled false`

<a name=autoModDeleteBotMessageTimeoutInSeconds></a>

---

## اداره - تسجيل - حذف Bot Message Timeout

The timeout after which bot messages are deleted.

Type: `Number`

Default: `5`

Reset to default:
`!config autoModDeleteBotMessageTimeoutInSeconds default`

Examples:

`!config autoModDeleteBotMessageTimeoutInSeconds 5`

`!config autoModDeleteBotMessageTimeoutInSeconds 10`

<a name=modPunishmentWarnDeleteMessage></a>

---

## اداره - تسجيل - حذف رسائل التحذير.

سواء سيتم حذف رسائل "تحذير" من عدمه تلقائيًا او لا.

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentWarnDeleteMessage default`

Enable:

`!config modPunishmentWarnDeleteMessage true`

Disable:

`!config modPunishmentWarnDeleteMessage false`

<a name=modPunishmentBanDeleteMessage></a>

---

## اداره - تسجيل - حذف رسائل الحظر

سواء سيتم حذف رسائل "الحظر" من عدمه تلقائيًا او لا.

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentBanDeleteMessage default`

Enable:

`!config modPunishmentBanDeleteMessage true`

Disable:

`!config modPunishmentBanDeleteMessage false`

<a name=modPunishmentSoftbanDeleteMessage></a>

---

## اداره - تسجيل - حذف رسائل الحظر

سواء سيتم حذف رسائل "الحظر" من عدمه تلقائيًا او لا.

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentSoftbanDeleteMessage default`

Enable:

`!config modPunishmentSoftbanDeleteMessage true`

Disable:

`!config modPunishmentSoftbanDeleteMessage false`

<a name=modPunishmentMuteDeleteMessage></a>

---

## اداره - تسجيل - حذف رسائل الصمت

سواء سيتم حذف رسائل "الصمت" من عدمه تلقائيًا او لا.

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentMuteDeleteMessage default`

Enable:

`!config modPunishmentMuteDeleteMessage true`

Disable:

`!config modPunishmentMuteDeleteMessage false`

<a name=modPunishmentKickDeleteMessage></a>

---

## اداره - تسجيل - حذف رسائل الطرد

سواء سيتم حذف رسائل "الطرد" من عدمه تلقائيًا او لا.

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentKickDeleteMessage default`

Enable:

`!config modPunishmentKickDeleteMessage true`

Disable:

`!config modPunishmentKickDeleteMessage false`

<a name=autoModDeleteBotMessage></a>

---

## اداره - تسجيل - حذف رسائل بوت

Automatically delete the bots own messages (keeps your chat clean).

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModDeleteBotMessage default`

Enable:

`!config autoModDeleteBotMessage true`

Disable:

`!config autoModDeleteBotMessage false`

<a name=modLogChannel></a>

---

## اداره - تسجيل - سجل القناه الخاص بالمود

القناة التي سيتم نشر سجلات المود فيها.

Type: `Channel`

Default: `null`

Reset to default:
`!config modLogChannel default`

Examples:

`!config modLogChannel #channel`

`!config modLogChannel #logs`

<a name=autoModMentionUsersMaxNumberOfMentions></a>

---

## اداره - إشارات - Max # of Mentions

The maximum amount of users a member can mention in a message.

Type: `Number`

Default: `5`

Reset to default:
`!config autoModMentionUsersMaxNumberOfMentions default`

Examples:

`!config autoModMentionUsersMaxNumberOfMentions 2`

`!config autoModMentionUsersMaxNumberOfMentions 5`

<a name=autoModMentionRolesMaxNumberOfMentions></a>

---

## اداره - إشارات - Max # of Mentions

The maximum amount of roles a member can mention in a message.

Type: `Number`

Default: `3`

Reset to default:
`!config autoModMentionRolesMaxNumberOfMentions default`

Examples:

`!config autoModMentionRolesMaxNumberOfMentions 2`

`!config autoModMentionRolesMaxNumberOfMentions 5`

<a name=autoModMentionUsersEnabled></a>

---

## اداره - إشارات - تمكين

Automatically moderate messages that mention an excessive amount of users.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModMentionUsersEnabled default`

Enable:

`!config autoModMentionUsersEnabled true`

Disable:

`!config autoModMentionUsersEnabled false`

<a name=autoModMentionRolesEnabled></a>

---

## اداره - إشارات - تمكين

Automatically moderate messages that mention an excessive amount of roles.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModMentionRolesEnabled default`

Enable:

`!config autoModMentionRolesEnabled true`

Disable:

`!config autoModMentionRolesEnabled false`

<a name=autoModQuickMessagesNumberOfMessages></a>

---

## اداره - سبام/اصرار - # من الرسائل

The number of messages that have to be sent within the timeframe to trigger the rule.

Type: `Number`

Default: `5`

Reset to default:
`!config autoModQuickMessagesNumberOfMessages default`

Examples:

`!config autoModQuickMessagesNumberOfMessages 5`

`!config autoModQuickMessagesNumberOfMessages 10`

<a name=autoModQuickMessagesTimeframeInSeconds></a>

---

## اداره - سبام/اصرار - الإطار الزمني بالثواني

The timeframe within which a user is allowed to send a maximum amount of messages.

Type: `Number`

Default: `3`

Reset to default:
`!config autoModQuickMessagesTimeframeInSeconds default`

Examples:

`!config autoModQuickMessagesTimeframeInSeconds 2`

`!config autoModQuickMessagesTimeframeInSeconds 10`

<a name=autoModQuickMessagesEnabled></a>

---

## اداره - سبام/اصرار - مفعل

Automatically moderate users sending a lot of messages in a short time.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModQuickMessagesEnabled default`

Enable:

`!config autoModQuickMessagesEnabled true`

Disable:

`!config autoModQuickMessagesEnabled false`

<a name=announceNextSong></a>

---

## موسيقى - Announcement - اعلان الاغنيه التاليه

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

## موسيقى - Announcement - صوت الاعلانات.

الصوت المستخدم في إعلانات الأغنية التاليه.

Type: `Enum`

Default: `Joanna`

Reset to default:
`!config announcementVoice default`

Possible values: `Joanna`, `Salli`, `Kendra`, `Kimberly`, `Ivy`, `Matthew`, `Justin`, `Joey`

Example:

`!config announcementVoice Joanna`

<a name=fadeMusicOnTalk></a>

---

## موسيقى - Fade Music - تلاشي الموسيقى على التكلم

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

## موسيقى - Fade Music - تلاشي الموسيقى نهايه التأخير

تأخر عدد الثواني التي يجب ألا يتحدث فيها أحد من أجل عودة مستوى الصوت إلى طبيعته.

Type: `Number`

Default: `1`

Reset to default:
`!config fadeMusicEndDelay default`

<a name=musicVolume></a>

---

## موسيقى - موسيقى - طبقة صوت الموسيقى

الصوت المعتاد الذي تم ضبطه عند دخول بوت لقناه صوتيه.

Type: `Number`

Default: `100`

Reset to default:
`!config musicVolume default`

<a name=defaultMusicPlatform></a>

---

## موسيقى - Platform - Default Music Platform

The platform that is used to search / play music when no platform is selected explicitly.

Type: `Enum`

Default: `SoundCloud`

Reset to default:
`!config defaultMusicPlatform default`

<a name=disabledMusicPlatforms></a>

---

## موسيقى - Platform - Disabled Music Platforms

Music platforms that are disabled and cannot be used to play music.

Type: `Enum[]`

Default: ``

Reset to default:
`!config disabledMusicPlatforms default`
