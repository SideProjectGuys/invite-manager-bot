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

### Genel

| Setting                                        | Description                                           |
| ---------------------------------------------- | ----------------------------------------------------- |
| [Dil](#lang)                                   | Botun dili                                            |
| [Görmezden gelinen kanallar](#ignoredchannels) | Botun komutları görmezden geleceği kanallar.          |
| [Komut kanalları](#channels)                   | The channels in which the bot will react to commands. |
| [Log kanalı](#logchannel)                      | Bot işlemlerinin günlüğe kaydedildiği kanal.          |
| [Prefix](#prefix)                              | The prefix used to trigger bot commands.              |

### davetler

| Setting                                                    | Description                              |
| ---------------------------------------------------------- | ---------------------------------------- |
| [settings.hideFromLeaderboard.title](#hidefromleaderboard) | settings.hideFromLeaderboard.description |
| [settings.name.title](#name)                               | settings.name.description                |
| [settings.roles.title](#roles)                             | settings.roles.description               |

#### Sahte

| Setting                             | Description                          |
| ----------------------------------- | ------------------------------------ |
| [Auto Subtract](#autosubtractfakes) | Automatically subtract fake invites. |

#### Genel

| Setting                       | Description                           |
| ----------------------------- | ------------------------------------- |
| [Katılma rolleri](#joinroles) | Katılırken tüm üyelere atanan roller. |

#### gelenler

| Setting                             | Description                                    |
| ----------------------------------- | ---------------------------------------------- |
| [Mesaj](#joinmessage)               | Birisi sunucuya katıldığında gönderilen mesaj. |
| [Mesaj Kanalı](#joinmessagechannel) | Katılmadaki iletinin gönderildiği kanal        |

#### Liderlik Tablosu

| Setting                                                  | Description                                              |
| -------------------------------------------------------- | -------------------------------------------------------- |
| [Soldaki üyeleri gizle](#hideleftmembersfromleaderboard) | Liderlik tablosundan sunucudan ayrılan üyeleri gizleyin. |
| [Stil](#leaderboardstyle)                                | Skor tablosunun görüntü stili.                           |

#### ayrılanlar

| Setting                                                | Description                                                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| [Auto Subtract](#autosubtractleaves)                   | Kullanıcın yaptığı davetten gelen kullanıcı ayrıldığında kullanıcın otomatik olarak daveti kaldırılır. |
| [Auto Subtract Threshold](#autosubtractleavethreshold) | Davetiyenin sayması için bir kullanıcının sunucuda kalması gereken saniye cinsinden süre.              |
| [Mesaj](#leavemessage)                                 | Birisi sunucudan çıktığında gönderilen mesaj.                                                          |
| [Mesaj Kanalı](#leavemessagechannel)                   | Ayrılma mesajının gönderildiği kanal.                                                                  |

#### rütbe

| Setting                                   | Description                                              |
| ----------------------------------------- | -------------------------------------------------------- |
| [Assignment Style](#rankassignmentstyle)  | Ranklar kullanıcılara nasıl ödüllendirilir.              |
| [Duyuru Kanalı](#rankannouncementchannel) | Yeni bir rütbe alan kullanıcıların duyurulduğu kanal.    |
| [Duyuru Mesajı](#rankannouncementmessage) | Bir kullanıcı yeni bir rütbe aldığında gönderilen mesaj. |

### Moderasyon

#### Yasaklı Kelimeler.

| Setting                              | Description                                             |
| ------------------------------------ | ------------------------------------------------------- |
| [Etkin](#automodwordsenabled)        | Whether or not blacklisted words will be automoderated. |
| [Kara liste](#automodwordsblacklist) | A list of words that are banned.                        |

#### Büyük Harfler

| Setting                                          | Description                                                                                                       |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| [Etkin](#automodallcapsenabled)                  | Automatically moderate messages with A LOT OF CAPS.                                                               |
| [Min. Characters](#automodallcapsmincharacters)  | The minimum amount of characters in a message to be considered for moderating (setting to '3' would ignore 'OK'). |
| [Percentage CAPs](#automodallcapspercentagecaps) | The percentage of characters of the message that have to be CAPs for the rule to trigger.                         |

#### Doğrulama

| Setting                                                | Description                                                                                   |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| [Başarısız Mesaj](#captchaverificationfailedmessage)   | Geçersiz bir captcha girerse, kullanıcıya mesaj gönderilir.                                   |
| [Etkin](#captchaverificationonjoin)                    | Captcha doğrulamanın etkin olup olmadığı.                                                     |
| [Karşılama mesajı](#captchaverificationwelcomemessage) | Kullanıcının bir sunucuya katıldıktan ve captcha'ya girmesini istedikten sonra alacağı mesaj. |
| [log etkin](#captchaverificationlogenabled)            | Doğrulama girişimlerinin yapılıp yapılmadığı günlüğe kaydedilir.                              |
| [Success Message](#captchaverificationsuccessmessage)  | Başarılı bir şekilde doğrulandıktan sonra kullanıcıya gönderilecek hoş geldiniz mesajı.       |
| [Verification Timeout](#captchaverificationtimeout)    | The time within which the captcha has to be entered successfully.                             |

#### Çift Mesajlar

| Setting                                                           | Description                                                  |
| ----------------------------------------------------------------- | ------------------------------------------------------------ |
| [Enabled](#automodduplicatetextenabled)                           | Automatically moderate duplicate messages (copy-paste spam). |
| [Saniyede Zaman Aralığı](#automodduplicatetexttimeframeinseconds) | Hangi iletilerin kopya olarak kabul edileceği zaman dilimi.  |

#### Emojiler

| Setting                                            | Description                                                                                                                                  |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| [Enabled](#automodhoistenabled)                    | Kaldırmaya çalışırlarsa üyelere otomatik olarak takma adlar verin (kullanıcı listesinin en üstünde görünmek için özel karakterler kullanın). |
| [Etkin](#automodemojisenabled)                     | Aşırı miktarda emoji içeren iletileri otomatik olarak denetleyin.                                                                            |
| [Max # of Emojis](#automodemojismaxnumberofemojis) | The maximum amount of emojis a message is allowed to have before trigger the rule.                                                           |

#### genel

| Setting                                                         | Description                                                                                                                                                                             |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Disabled for Old Members](#automoddisabledforoldmembers)       | Disabled auto moderation for members that have been in your server for a long time.                                                                                                     |
| [etkin](#automodenabled)                                        | Automatically moderate messages (specific rules can also be turned on or off, this has to be ON for ANY rule to work).                                                                  |
| [Görmezden gelinen kanallar](#automodignoredchannels)           | Otomatik olarak denetlenirken yoksayılan kanallar.                                                                                                                                      |
| [Görmezden gelinen roller](#automodignoredroles)                | Bu rollere sahip üyeler otomatik olarak denetlenmez.                                                                                                                                    |
| [Moderated Channels](#automodmoderatedchannels)                 | The list of moderated channels (this acts as a whitelist, leave empty to moderate all channels, or use `autoModIgnoredChannels` to ignore certain channels).                            |
| [Moderatör Rolü](#automodmoderatedroles)                        | Denetlenen rollerin listesi (bu, beyaz liste olarak işlev görür, tüm rolleri denetlemek için boş bırakın veya belirli rolleri yok saymak için `autoModIgnoredRoles` komutunu kullanın). |
| [Old Members Threshold](#automoddisabledforoldmembersthreshold) | The amount of time a member has to be in your server to be considered 'old'.                                                                                                            |
| [Susturulmuş üyenin alacağı rol](#mutedrole)                    | Susturulmuş olan kişilere verilen rol. Bu rolün "Mesaj Gönder" izninin reddedildiğinden emin olun.                                                                                      |

#### Davetler

| Setting                         | Description                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| [etkin](#automodinvitesenabled) | Discord Sunucu davet bağlantıları için iletileri otomatik olarak tarayın ve kaldırın. |

#### bağlantılar

| Setting                                              | Description                                                                             |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [Betaz liste](#automodlinkswhitelist)                | Kullanıcıların yayın göndermesine izin verilen bağlantıların listesi.                   |
| [Blacklist](#automodlinksblacklist)                  | Blacklist certain links which users won't be able to post.                              |
| [Enabled](#automodlinksenabled)                      | Automatically remove messages containing links (you can set a whitelist and blacklist). |
| [Yönlendirmeleri İzle](#automodlinksfollowredirects) | Enable this to resolve redirects for links.                                             |

#### Logging

| Setting                                                                  | Description                                                                 |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| [Bot Mesajı Zaman Aşımını Sil](#automoddeletebotmessagetimeoutinseconds) | Bot mesajlarının silindiği zaman aşımı.                                     |
| [Bot Mesajlarını Sil](#automoddeletebotmessage)                          | Botların kendi mesajlarını otomatik olarak silin (sohbetinizi temiz tutar). |
| [Kick Mesajını Sil](#modpunishmentkickdeletemessage)                     | "Kick" mesajlarının otomatik olarak silinip silinmeyeceği.                  |
| [Log Enabled](#automodlogenabled)                                        | Log any moderation actions that the bot makes.                              |
| [Mod Log Channel](#modlogchannel)                                        | The channel where moderation logs will be posted in.                        |
| [Softban Mesajlarını Sil](#modpunishmentsoftbandeletemessage)            | "Softban" mesajlarının otomatik olarak silinip silinmeyeceği.               |
| [Susturma Mesajlarını Sil.](#modpunishmentmutedeletemessage)             | "Mute" mesajlarının otomatik olarak silinip silinmeyeceği.                  |
| [Uyarı Mesajlarını Sil.](#modpunishmentwarndeletemessage)                | "Uyarı" ceza mesajlarının otomatik olarak silinip silinmeyeceği.            |
| [Yasaklama Mesajını Sil](#modpunishmentbandeletemessage)                 | "Ban" mesajlarının otomatik olarak silinip silinmeyeceği.                   |

#### Bahsetmeler

| Setting                                                      | Description                                                                |
| ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| [Enabled](#automodmentionrolesenabled)                       | Automatically moderate messages that mention an excessive amount of roles. |
| [etkin](#automodmentionusersenabled)                         | Automatically moderate messages that mention an excessive amount of users. |
| [Max # of Mentions](#automodmentionusersmaxnumberofmentions) | The maximum amount of users a member can mention in a message.             |
| [Max # of Mentions](#automodmentionrolesmaxnumberofmentions) | The maximum amount of roles a member can mention in a message.             |

#### spam

| Setting                                                         | Description                                                                        |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [# of Messages](#automodquickmessagesnumberofmessages)          | Kuralı tetiklemek için zaman aralığı içinde gönderilmesi gereken ileti sayısı.     |
| [Etkin](#automodquickmessagesenabled)                           | Automatically moderate users sending a lot of messages in a short time.            |
| [Timeframe in Seconds](#automodquickmessagestimeframeinseconds) | The timeframe within which a user is allowed to send a maximum amount of messages. |

### Müzik

#### Duyuru

| Setting                                     | Description                                                            |
| ------------------------------------------- | ---------------------------------------------------------------------- |
| [Announcement Voice](#announcementvoice)    | The voice used in the next song announcements.                         |
| [Sıradaki Şarkıyı Duyur](#announcenextsong) | Whether or not the next song should be announced in the voice channel. |

#### Fade Music

| Setting                                    | Description                                                                               |
| ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| [Fade Music End Delay](#fademusicenddelay) | The delay of how many seconds noone has to speak for the volume to return back to normal. |
| [Fade Music On Talk](#fademusicontalk)     | If enabled, the music will fade down while people are talking.                            |

#### Müzik

| Setting                          | Description                                                          |
| -------------------------------- | -------------------------------------------------------------------- |
| [Müzik Ses Düzeyi](#musicvolume) | Bot bir ses kanalına katıldığında ayarlanan varsayılan ses seviyesi. |

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

<a name=lang></a>

---

## Genel - Dil

Botun dili

Type: `Enum`

Default: `en`

Reset to default:
`!config lang default`

Possible values: `ar`, `bg`, `cs`, `de`, `el`, `en`, `es`, `fr`, `hu`, `id_ID`, `it`, `ja`, `lt`, `nl`, `pl`, `pt`, `pt_BR`, `ro`, `ru`, `sr`, `tr`, `zh_CN`, `zh_TW`

Example:

`!config lang ar`

<a name=ignoredChannels></a>

---

## Genel - Görmezden gelinen kanallar

Botun komutları görmezden geleceği kanallar.

Type: `Channel[]`

Default: ``

Reset to default:
`!config ignoredChannels default`

<a name=channels></a>

---

## Genel - Komut kanalları

The channels in which the bot will react to commands.

Type: `Channel[]`

Default: ``

Reset to default:
`!config channels default`

<a name=logChannel></a>

---

## Genel - Log kanalı

Bot işlemlerinin günlüğe kaydedildiği kanal.

Type: `Channel`

Default: `null`

Reset to default:
`!config logChannel default`

Examples:

`!config logChannel #channel`

<a name=prefix></a>

---

## Genel - Prefix

The prefix used to trigger bot commands.

Type: `String`

Default: `!`

Reset to default:
`!config prefix default`

Examples:

`!config prefix +`

`!config prefix >`

<a name=hideFromLeaderboard></a>

---

## davetler - settings.hideFromLeaderboard.title

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

## davetler - settings.name.title

settings.name.description

Type: `String`

Default: `null`

Reset to default:
`!config name default`

<a name=roles></a>

---

## davetler - settings.roles.title

settings.roles.description

Type: `Role[]`

Default: ``

Reset to default:
`!config roles default`

<a name=autoSubtractFakes></a>

---

## davetler - Sahte - Auto Subtract

Automatically subtract fake invites.

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

## davetler - Genel - Katılma rolleri

Katılırken tüm üyelere atanan roller.

Type: `Role[]`

Default: ``

Reset to default:
`!config joinRoles default`

<a name=joinMessage></a>

---

## davetler - gelenler - Mesaj

Birisi sunucuya katıldığında gönderilen mesaj.

Type: `String`

Default: `{memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)`

Reset to default:
`!config joinMessage default`

<a name=joinMessageChannel></a>

---

## davetler - gelenler - Mesaj Kanalı

Katılmadaki iletinin gönderildiği kanal

Type: `Channel`

Default: `null`

Reset to default:
`!config joinMessageChannel default`

Examples:

`!config joinMessageChannel #general`

`!config joinMessageChannel #joins`

<a name=hideLeftMembersFromLeaderboard></a>

---

## davetler - Liderlik Tablosu - Soldaki üyeleri gizle

Liderlik tablosundan sunucudan ayrılan üyeleri gizleyin.

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

## davetler - Liderlik Tablosu - Stil

Skor tablosunun görüntü stili.

Type: `Enum`

Default: `normal`

Reset to default:
`!config leaderboardStyle default`

Possible values: `normal`, `table`, `mentions`

Example:

`!config leaderboardStyle normal`

<a name=autoSubtractLeaves></a>

---

## davetler - ayrılanlar - Auto Subtract

Kullanıcın yaptığı davetten gelen kullanıcı ayrıldığında kullanıcın otomatik olarak daveti kaldırılır.

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

## davetler - ayrılanlar - Auto Subtract Threshold

Davetiyenin sayması için bir kullanıcının sunucuda kalması gereken saniye cinsinden süre.

Type: `Number`

Default: `600`

Reset to default:
`!config autoSubtractLeaveThreshold default`

Examples:

`!config autoSubtractLeaveThreshold 60`

`!config autoSubtractLeaveThreshold 3600`

<a name=leaveMessage></a>

---

## davetler - ayrılanlar - Mesaj

Birisi sunucudan çıktığında gönderilen mesaj.

Type: `String`

Default: `{memberName} **left**; Invited by **{inviterName}**`

Reset to default:
`!config leaveMessage default`

Examples:

`!config leaveMessage`

`!config leaveMessage`

<a name=leaveMessageChannel></a>

---

## davetler - ayrılanlar - Mesaj Kanalı

Ayrılma mesajının gönderildiği kanal.

Type: `Channel`

Default: `null`

Reset to default:
`!config leaveMessageChannel default`

Examples:

`!config leaveMessageChannel #general`

`!config leaveMessageChannel #leaves`

<a name=rankAssignmentStyle></a>

---

## davetler - rütbe - Assignment Style

Ranklar kullanıcılara nasıl ödüllendirilir.

Type: `Enum`

Default: `all`

Reset to default:
`!config rankAssignmentStyle default`

Possible values: `all`, `highest`, `onlyAdd`

Example:

`!config rankAssignmentStyle all`

<a name=rankAnnouncementChannel></a>

---

## davetler - rütbe - Duyuru Kanalı

Yeni bir rütbe alan kullanıcıların duyurulduğu kanal.

Type: `Channel`

Default: `null`

Reset to default:
`!config rankAnnouncementChannel default`

Examples:

`!config rankAnnouncementChannel`

`!config rankAnnouncementChannel`

<a name=rankAnnouncementMessage></a>

---

## davetler - rütbe - Duyuru Mesajı

Bir kullanıcı yeni bir rütbe aldığında gönderilen mesaj.

Type: `String`

Default: `Congratulations, **{memberMention}** has reached the **{rankName}** rank!`

Reset to default:
`!config rankAnnouncementMessage default`

Examples:

`!config rankAnnouncementMessage`

`!config rankAnnouncementMessage`

<a name=autoModWordsEnabled></a>

---

## Moderasyon - Yasaklı Kelimeler. - Etkin

Whether or not blacklisted words will be automoderated.

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

## Moderasyon - Yasaklı Kelimeler. - Kara liste

A list of words that are banned.

Type: `String[]`

Default: ``

Reset to default:
`!config autoModWordsBlacklist default`

Examples:

`!config autoModWordsBlacklist gay`

`!config autoModWordsBlacklist stupid,fuck`

<a name=autoModAllCapsEnabled></a>

---

## Moderasyon - Büyük Harfler - Etkin

Automatically moderate messages with A LOT OF CAPS.

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

## Moderasyon - Büyük Harfler - Min. Characters

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

## Moderasyon - Büyük Harfler - Percentage CAPs

The percentage of characters of the message that have to be CAPs for the rule to trigger.

Type: `Number`

Default: `70`

Reset to default:
`!config autoModAllCapsPercentageCaps default`

Examples:

`!config autoModAllCapsPercentageCaps 50`

`!config autoModAllCapsPercentageCaps 90`

<a name=captchaVerificationFailedMessage></a>

---

## Moderasyon - Doğrulama - Başarısız Mesaj

Geçersiz bir captcha girerse, kullanıcıya mesaj gönderilir.

Type: `String`

Default: `You did not enter the captha right within the specified time.We're sorry, but we have to kick you from the server. Feel free to join again.`

Reset to default:
`!config captchaVerificationFailedMessage default`

Examples:

`!config captchaVerificationFailedMessage Looks like you are not human :(. You can join again and try again later if this was a mistake!`

<a name=captchaVerificationOnJoin></a>

---

## Moderasyon - Doğrulama - Etkin

Captcha doğrulamanın etkin olup olmadığı.

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

## Moderasyon - Doğrulama - Karşılama mesajı

Kullanıcının bir sunucuya katıldıktan ve captcha'ya girmesini istedikten sonra alacağı mesaj.

Type: `String`

Default: `Welcome to the server **{serverName}**! For extra protection, new members are required to enter a captcha.`

Reset to default:
`!config captchaVerificationWelcomeMessage default`

Examples:

`!config captchaVerificationWelcomeMessage Welcome, please enter the captcha below!`

<a name=captchaVerificationLogEnabled></a>

---

## Moderasyon - Doğrulama - log etkin

Doğrulama girişimlerinin yapılıp yapılmadığı günlüğe kaydedilir.

Type: `Boolean`

Default: `true`

Reset to default:
`!config captchaVerificationLogEnabled default`

Enable:

`!config captchaVerificationLogEnabled true`

Disable:

`!config captchaVerificationLogEnabled false`

<a name=captchaVerificationSuccessMessage></a>

---

## Moderasyon - Doğrulama - Success Message

Başarılı bir şekilde doğrulandıktan sonra kullanıcıya gönderilecek hoş geldiniz mesajı.

Type: `String`

Default: `You have successfully entered the captcha. Welcome to the server!`

Reset to default:
`!config captchaVerificationSuccessMessage default`

Examples:

`!config captchaVerificationSuccessMessage Thanks for entering the captcha, enjoy our server!`

<a name=captchaVerificationTimeout></a>

---

## Moderasyon - Doğrulama - Verification Timeout

The time within which the captcha has to be entered successfully.

Type: `Number`

Default: `180`

Reset to default:
`!config captchaVerificationTimeout default`

Examples:

`!config captchaVerificationTimeout 60`

`!config captchaVerificationTimeout 600`

<a name=autoModDuplicateTextEnabled></a>

---

## Moderasyon - Çift Mesajlar - Enabled

Automatically moderate duplicate messages (copy-paste spam).

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

## Moderasyon - Çift Mesajlar - Saniyede Zaman Aralığı

Hangi iletilerin kopya olarak kabul edileceği zaman dilimi.

Type: `Number`

Default: `60`

Reset to default:
`!config autoModDuplicateTextTimeframeInSeconds default`

Examples:

`!config autoModDuplicateTextTimeframeInSeconds 5`

`!config autoModDuplicateTextTimeframeInSeconds 20`

<a name=autoModHoistEnabled></a>

---

## Moderasyon - Emojiler - Enabled

Kaldırmaya çalışırlarsa üyelere otomatik olarak takma adlar verin (kullanıcı listesinin en üstünde görünmek için özel karakterler kullanın).

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

## Moderasyon - Emojiler - Etkin

Aşırı miktarda emoji içeren iletileri otomatik olarak denetleyin.

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

## Moderasyon - Emojiler - Max # of Emojis

The maximum amount of emojis a message is allowed to have before trigger the rule.

Type: `Number`

Default: `5`

Reset to default:
`!config autoModEmojisMaxNumberOfEmojis default`

Examples:

`!config autoModEmojisMaxNumberOfEmojis 5`

`!config autoModEmojisMaxNumberOfEmojis 10`

<a name=autoModDisabledForOldMembers></a>

---

## Moderasyon - genel - Disabled for Old Members

Disabled auto moderation for members that have been in your server for a long time.

Type: `Boolean`

Default: `false`

Reset to default:
`!config autoModDisabledForOldMembers default`

Enable:

`!config autoModDisabledForOldMembers true`

Disable:

`!config autoModDisabledForOldMembers false`

<a name=autoModEnabled></a>

---

## Moderasyon - genel - etkin

Automatically moderate messages (specific rules can also be turned on or off, this has to be ON for ANY rule to work).

Type: `Boolean`

Default: `false`

Reset to default:
`!config autoModEnabled default`

Enable:

`!config autoModEnabled true`

Disable:

`!config autoModEnabled false`

<a name=autoModIgnoredChannels></a>

---

## Moderasyon - genel - Görmezden gelinen kanallar

Otomatik olarak denetlenirken yoksayılan kanallar.

Type: `Channel[]`

Default: ``

Reset to default:
`!config autoModIgnoredChannels default`

Examples:

`!config autoModIgnoredChannels #general`

`!config autoModIgnoredChannels #off-topic,#nsfw`

<a name=autoModIgnoredRoles></a>

---

## Moderasyon - genel - Görmezden gelinen roller

Bu rollere sahip üyeler otomatik olarak denetlenmez.

Type: `Role[]`

Default: ``

Reset to default:
`!config autoModIgnoredRoles default`

Examples:

`!config autoModIgnoredRoles @TrustedMembers`

`!config autoModIgnoredRoles @Moderators,@Staff`

<a name=autoModModeratedChannels></a>

---

## Moderasyon - genel - Moderated Channels

The list of moderated channels (this acts as a whitelist, leave empty to moderate all channels, or use `autoModIgnoredChannels` to ignore certain channels).

Type: `Channel[]`

Default: ``

Reset to default:
`!config autoModModeratedChannels default`

Examples:

`!config autoModModeratedChannels #general`

`!config autoModModeratedChannels #support,#help`

<a name=autoModModeratedRoles></a>

---

## Moderasyon - genel - Moderatör Rolü

Denetlenen rollerin listesi (bu, beyaz liste olarak işlev görür, tüm rolleri denetlemek için boş bırakın veya belirli rolleri yok saymak için `autoModIgnoredRoles` komutunu kullanın).

Type: `Role[]`

Default: ``

Reset to default:
`!config autoModModeratedRoles default`

Examples:

`!config autoModModeratedRoles @NewMembers`

`!config autoModModeratedRoles @Newbies,@Starters`

<a name=autoModDisabledForOldMembersThreshold></a>

---

## Moderasyon - genel - Old Members Threshold

The amount of time a member has to be in your server to be considered 'old'.

Type: `Number`

Default: `604800`

Reset to default:
`!config autoModDisabledForOldMembersThreshold default`

Examples:

`!config autoModDisabledForOldMembersThreshold 604800` (1 week)``

`!config autoModDisabledForOldMembersThreshold 2419200` (1 month)``

<a name=mutedRole></a>

---

## Moderasyon - genel - Susturulmuş üyenin alacağı rol

Susturulmuş olan kişilere verilen rol. Bu rolün "Mesaj Gönder" izninin reddedildiğinden emin olun.

Type: `Role`

Default: `null`

Reset to default:
`!config mutedRole default`

Examples:

`!config mutedRole @muted`

<a name=autoModInvitesEnabled></a>

---

## Moderasyon - Davetler - etkin

Discord Sunucu davet bağlantıları için iletileri otomatik olarak tarayın ve kaldırın.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModInvitesEnabled default`

Enable:

`!config autoModInvitesEnabled true`

Disable:

`!config autoModInvitesEnabled false`

<a name=autoModLinksWhitelist></a>

---

## Moderasyon - bağlantılar - Betaz liste

Kullanıcıların yayın göndermesine izin verilen bağlantıların listesi.

Type: `String[]`

Default: ``

Reset to default:
`!config autoModLinksWhitelist default`

Examples:

`!config autoModLinksWhitelist discordbots.org`

`!config autoModLinksWhitelist youtube.com,twitch.com`

<a name=autoModLinksBlacklist></a>

---

## Moderasyon - bağlantılar - Blacklist

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

## Moderasyon - bağlantılar - Enabled

Automatically remove messages containing links (you can set a whitelist and blacklist).

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModLinksEnabled default`

Enable:

`!config autoModLinksEnabled true`

Disable:

`!config autoModLinksEnabled false`

<a name=autoModLinksFollowRedirects></a>

---

## Moderasyon - bağlantılar - Yönlendirmeleri İzle

Enable this to resolve redirects for links.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModLinksFollowRedirects default`

Enable:

`!config autoModLinksFollowRedirects true`

Disable:

`!config autoModLinksFollowRedirects false`

<a name=autoModDeleteBotMessageTimeoutInSeconds></a>

---

## Moderasyon - Logging - Bot Mesajı Zaman Aşımını Sil

Bot mesajlarının silindiği zaman aşımı.

Type: `Number`

Default: `5`

Reset to default:
`!config autoModDeleteBotMessageTimeoutInSeconds default`

Examples:

`!config autoModDeleteBotMessageTimeoutInSeconds 5`

`!config autoModDeleteBotMessageTimeoutInSeconds 10`

<a name=autoModDeleteBotMessage></a>

---

## Moderasyon - Logging - Bot Mesajlarını Sil

Botların kendi mesajlarını otomatik olarak silin (sohbetinizi temiz tutar).

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModDeleteBotMessage default`

Enable:

`!config autoModDeleteBotMessage true`

Disable:

`!config autoModDeleteBotMessage false`

<a name=modPunishmentKickDeleteMessage></a>

---

## Moderasyon - Logging - Kick Mesajını Sil

"Kick" mesajlarının otomatik olarak silinip silinmeyeceği.

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentKickDeleteMessage default`

Enable:

`!config modPunishmentKickDeleteMessage true`

Disable:

`!config modPunishmentKickDeleteMessage false`

<a name=autoModLogEnabled></a>

---

## Moderasyon - Logging - Log Enabled

Log any moderation actions that the bot makes.

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

## Moderasyon - Logging - Mod Log Channel

The channel where moderation logs will be posted in.

Type: `Channel`

Default: `null`

Reset to default:
`!config modLogChannel default`

Examples:

`!config modLogChannel #channel`

`!config modLogChannel #logs`

<a name=modPunishmentSoftbanDeleteMessage></a>

---

## Moderasyon - Logging - Softban Mesajlarını Sil

"Softban" mesajlarının otomatik olarak silinip silinmeyeceği.

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

## Moderasyon - Logging - Susturma Mesajlarını Sil.

"Mute" mesajlarının otomatik olarak silinip silinmeyeceği.

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentMuteDeleteMessage default`

Enable:

`!config modPunishmentMuteDeleteMessage true`

Disable:

`!config modPunishmentMuteDeleteMessage false`

<a name=modPunishmentWarnDeleteMessage></a>

---

## Moderasyon - Logging - Uyarı Mesajlarını Sil.

"Uyarı" ceza mesajlarının otomatik olarak silinip silinmeyeceği.

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

## Moderasyon - Logging - Yasaklama Mesajını Sil

"Ban" mesajlarının otomatik olarak silinip silinmeyeceği.

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentBanDeleteMessage default`

Enable:

`!config modPunishmentBanDeleteMessage true`

Disable:

`!config modPunishmentBanDeleteMessage false`

<a name=autoModMentionRolesEnabled></a>

---

## Moderasyon - Bahsetmeler - Enabled

Automatically moderate messages that mention an excessive amount of roles.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModMentionRolesEnabled default`

Enable:

`!config autoModMentionRolesEnabled true`

Disable:

`!config autoModMentionRolesEnabled false`

<a name=autoModMentionUsersEnabled></a>

---

## Moderasyon - Bahsetmeler - etkin

Automatically moderate messages that mention an excessive amount of users.

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

## Moderasyon - Bahsetmeler - Max # of Mentions

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

## Moderasyon - Bahsetmeler - Max # of Mentions

The maximum amount of roles a member can mention in a message.

Type: `Number`

Default: `3`

Reset to default:
`!config autoModMentionRolesMaxNumberOfMentions default`

Examples:

`!config autoModMentionRolesMaxNumberOfMentions 2`

`!config autoModMentionRolesMaxNumberOfMentions 5`

<a name=autoModQuickMessagesNumberOfMessages></a>

---

## Moderasyon - spam - # of Messages

Kuralı tetiklemek için zaman aralığı içinde gönderilmesi gereken ileti sayısı.

Type: `Number`

Default: `5`

Reset to default:
`!config autoModQuickMessagesNumberOfMessages default`

Examples:

`!config autoModQuickMessagesNumberOfMessages 5`

`!config autoModQuickMessagesNumberOfMessages 10`

<a name=autoModQuickMessagesEnabled></a>

---

## Moderasyon - spam - Etkin

Automatically moderate users sending a lot of messages in a short time.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModQuickMessagesEnabled default`

Enable:

`!config autoModQuickMessagesEnabled true`

Disable:

`!config autoModQuickMessagesEnabled false`

<a name=autoModQuickMessagesTimeframeInSeconds></a>

---

## Moderasyon - spam - Timeframe in Seconds

The timeframe within which a user is allowed to send a maximum amount of messages.

Type: `Number`

Default: `3`

Reset to default:
`!config autoModQuickMessagesTimeframeInSeconds default`

Examples:

`!config autoModQuickMessagesTimeframeInSeconds 2`

`!config autoModQuickMessagesTimeframeInSeconds 10`

<a name=announcementVoice></a>

---

## Müzik - Duyuru - Announcement Voice

The voice used in the next song announcements.

Type: `Enum`

Default: `Joanna`

Reset to default:
`!config announcementVoice default`

Possible values: `Joanna`, `Salli`, `Kendra`, `Kimberly`, `Ivy`, `Matthew`, `Justin`, `Joey`

Example:

`!config announcementVoice Joanna`

<a name=announceNextSong></a>

---

## Müzik - Duyuru - Sıradaki Şarkıyı Duyur

Whether or not the next song should be announced in the voice channel.

Type: `Boolean`

Default: `true`

Reset to default:
`!config announceNextSong default`

Enable:

`!config announceNextSong true`

Disable:

`!config announceNextSong false`

<a name=fadeMusicEndDelay></a>

---

## Müzik - Fade Music - Fade Music End Delay

The delay of how many seconds noone has to speak for the volume to return back to normal.

Type: `Number`

Default: `1`

Reset to default:
`!config fadeMusicEndDelay default`

<a name=fadeMusicOnTalk></a>

---

## Müzik - Fade Music - Fade Music On Talk

If enabled, the music will fade down while people are talking.

Type: `Boolean`

Default: `true`

Reset to default:
`!config fadeMusicOnTalk default`

Enable:

`!config fadeMusicOnTalk true`

Disable:

`!config fadeMusicOnTalk false`

<a name=musicVolume></a>

---

## Müzik - Müzik - Müzik Ses Düzeyi

Bot bir ses kanalına katıldığında ayarlanan varsayılan ses seviyesi.

Type: `Number`

Default: `100`

Reset to default:
`!config musicVolume default`

<a name=defaultMusicPlatform></a>

---

## Müzik - Platform - Default Music Platform

The platform that is used to search / play music when no platform is selected explicitly.

Type: `Enum`

Default: `SoundCloud`

Reset to default:
`!config defaultMusicPlatform default`

<a name=disabledMusicPlatforms></a>

---

## Müzik - Platform - Disabled Music Platforms

Music platforms that are disabled and cannot be used to play music.

Type: `Enum[]`

Default: ``

Reset to default:
`!config disabledMusicPlatforms default`
