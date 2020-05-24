# Configs

There are many config options that can be set. You don't have to set all of them. If you just added the bot, just run `!setup`, which will guide you through the most important ones.

## Overview

### Genel

| Setting                                        | Description                                                              |
| ---------------------------------------------- | ------------------------------------------------------------------------ |
| [Prefix](#prefix)                              | The prefix used to trigger bot commands.                                 |
| [Dil](#lang)                                   | Botun dili                                                               |
| [Log kanalı](#logchannel)                      | Bot işlemlerinin günlüğe kaydedildiği kanal.                             |
| [Yükselt.](#getupdates)                        | InviteManager hakkında geliştirme güncellemelerini almayı etkinleştirin. |
| [Komut kanalları](#channels)                   | Botun komutlara tepki vereceği kanallar.                                 |
| [Görmezden gelinen kanallar](#ignoredchannels) | Botun komutları görmezden geleceği kanallar.                             |

### davetler

#### Genel

| Setting                       | Description                           |
| ----------------------------- | ------------------------------------- |
| [Katılma rolleri](#joinroles) | Katılırken tüm üyelere atanan roller. |

#### gelenler

| Setting                             | Description                                    |
| ----------------------------------- | ---------------------------------------------- |
| [Mesaj](#joinmessage)               | Birisi sunucuya katıldığında gönderilen mesaj. |
| [Mesaj Kanalı](#joinmessagechannel) | Katılmadaki iletinin gönderildiği kanal        |

#### ayrılanlar

| Setting                                                | Description                                                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| [Mesaj](#leavemessage)                                 | Birisi sunucudan çıktığında gönderilen mesaj.                                                          |
| [Mesaj Kanalı](#leavemessagechannel)                   | Ayrılma mesajının gönderildiği kanal.                                                                  |
| [Auto Subtract](#autosubtractleaves)                   | Kullanıcın yaptığı davetten gelen kullanıcı ayrıldığında kullanıcın otomatik olarak daveti kaldırılır. |
| [Auto Subtract Threshold](#autosubtractleavethreshold) | Davetiyenin sayması için bir kullanıcının sunucuda kalması gereken saniye cinsinden süre.              |

#### Liderlik Tablosu

| Setting                                                  | Description                                              |
| -------------------------------------------------------- | -------------------------------------------------------- |
| [Stil](#leaderboardstyle)                                | Skor tablosunun görüntü stili.                           |
| [Soldaki üyeleri gizle](#hideleftmembersfromleaderboard) | Liderlik tablosundan sunucudan ayrılan üyeleri gizleyin. |

#### Sahte

| Setting                             | Description                             |
| ----------------------------------- | --------------------------------------- |
| [Auto Subtract](#autosubtractfakes) | Sahte davetleri otomatik olarak çıkarın |

#### rütbe

| Setting                                   | Description                                              |
| ----------------------------------------- | -------------------------------------------------------- |
| [Assignment Style](#rankassignmentstyle)  | Ranklar kullanıcılara nasıl ödüllendirilir.              |
| [Duyuru Kanalı](#rankannouncementchannel) | Yeni bir rütbe alan kullanıcıların duyurulduğu kanal.    |
| [Duyuru Mesajı](#rankannouncementmessage) | Bir kullanıcı yeni bir rütbe aldığında gönderilen mesaj. |

### Moderasyon

#### Doğrulama

| Setting                                                | Description                                                                                   |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| [Etkin](#captchaverificationonjoin)                    | Captcha doğrulamanın etkin olup olmadığı.                                                     |
| [Karşılama mesajı](#captchaverificationwelcomemessage) | Kullanıcının bir sunucuya katıldıktan ve captcha'ya girmesini istedikten sonra alacağı mesaj. |
| [Success Message](#captchaverificationsuccessmessage)  | Başarılı bir şekilde doğrulandıktan sonra kullanıcıya gönderilecek hoş geldiniz mesajı.       |
| [Başarısız Mesaj](#captchaverificationfailedmessage)   | Geçersiz bir captcha girerse, kullanıcıya mesaj gönderilir.                                   |
| [Verification Timeout](#captchaverificationtimeout)    | The time within which the captcha has to be entered successfully.                             |
| [log etkin](#captchaverificationlogenabled)            | Doğrulama girişimlerinin yapılıp yapılmadığı günlüğe kaydedilir.                              |

#### genel

| Setting                                                         | Description                                                                                                                                                                             |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [etkin](#automodenabled)                                        | Automatically moderate messages (specific rules can also be turned on or off, this has to be ON for ANY rule to work).                                                                  |
| [Moderated Channels](#automodmoderatedchannels)                 | The list of moderated channels (this acts as a whitelist, leave empty to moderate all channels, or use `autoModIgnoredChannels` to ignore certain channels).                            |
| [Moderatör Rolü](#automodmoderatedroles)                        | Denetlenen rollerin listesi (bu, beyaz liste olarak işlev görür, tüm rolleri denetlemek için boş bırakın veya belirli rolleri yok saymak için `autoModIgnoredRoles` komutunu kullanın). |
| [Görmezden gelinen kanallar](#automodignoredchannels)           | Otomatik olarak denetlenirken yoksayılan kanallar.                                                                                                                                      |
| [Görmezden gelinen roller](#automodignoredroles)                | Bu rollere sahip üyeler otomatik olarak denetlenmez.                                                                                                                                    |
| [Susturulmuş üyenin alacağı rol](#mutedrole)                    | Susturulmuş olan kişilere verilen rol. Bu rolün "Mesaj Gönder" izninin reddedildiğinden emin olun.                                                                                      |
| [Disabled for Old Members](#automoddisabledforoldmembers)       | Disabled auto moderation for members that have been in your server for a long time.                                                                                                     |
| [Old Members Threshold](#automoddisabledforoldmembersthreshold) | The amount of time a member has to be in your server to be considered 'old'.                                                                                                            |

#### Logging

| Setting                                                                  | Description                                                                 |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| [Log Enabled](#automodlogenabled)                                        | Log any moderation actions that the bot makes.                              |
| [Mod Log Channel](#modlogchannel)                                        | The channel where moderation logs will be posted in.                        |
| [Bot Mesajlarını Sil](#automoddeletebotmessage)                          | Botların kendi mesajlarını otomatik olarak silin (sohbetinizi temiz tutar). |
| [Bot Mesajı Zaman Aşımını Sil](#automoddeletebotmessagetimeoutinseconds) | Bot mesajlarının silindiği zaman aşımı.                                     |
| [Yasaklama Mesajını Sil](#modpunishmentbandeletemessage)                 | "Ban" mesajlarının otomatik olarak silinip silinmeyeceği.                   |
| [Kick Mesajını Sil](#modpunishmentkickdeletemessage)                     | "Kick" mesajlarının otomatik olarak silinip silinmeyeceği.                  |
| [Softban Mesajlarını Sil](#modpunishmentsoftbandeletemessage)            | "Softban" mesajlarının otomatik olarak silinip silinmeyeceği.               |
| [Uyarı Mesajlarını Sil.](#modpunishmentwarndeletemessage)                | "Uyarı" ceza mesajlarının otomatik olarak silinip silinmeyeceği.            |
| [Susturma Mesajlarını Sil.](#modpunishmentmutedeletemessage)             | "Mute" mesajlarının otomatik olarak silinip silinmeyeceği.                  |

#### Davetler

| Setting                         | Description                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| [etkin](#automodinvitesenabled) | Discord Sunucu davet bağlantıları için iletileri otomatik olarak tarayın ve kaldırın. |

#### bağlantılar

| Setting                                              | Description                                                                             |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [Etkin](#automodlinksenabled)                        | Automatically remove messages containing links (you can set a whitelist and blacklist). |
| [Betaz liste](#automodlinkswhitelist)                | Kullanıcıların yayın göndermesine izin verilen bağlantıların listesi.                   |
| [Kara liste](#automodlinksblacklist)                 | Blacklist certain links which users won't be able to post.                              |
| [Yönlendirmeleri İzle](#automodlinksfollowredirects) | Enable this to resolve redirects for links.                                             |

#### Yasaklı Kelimeler.

| Setting                              | Description                                             |
| ------------------------------------ | ------------------------------------------------------- |
| [Etkin](#automodwordsenabled)        | Whether or not blacklisted words will be automoderated. |
| [Kara liste](#automodwordsblacklist) | Yasaklanan kelimelerin listesi.                         |

#### Büyük Harfler

| Setting                                          | Description                                                                                                       |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| [Etkin](#automodallcapsenabled)                  | Automatically moderate messages with A LOT OF CAPS.                                                               |
| [Min. Characters](#automodallcapsmincharacters)  | The minimum amount of characters in a message to be considered for moderating (setting to '3' would ignore 'OK'). |
| [Percentage CAPs](#automodallcapspercentagecaps) | The percentage of characters of the message that have to be CAPs for the rule to trigger.                         |

#### Çift Mesajlar

| Setting                                                           | Description                                                  |
| ----------------------------------------------------------------- | ------------------------------------------------------------ |
| [Etkin](#automodduplicatetextenabled)                             | Automatically moderate duplicate messages (copy-paste spam). |
| [Saniyede Zaman Aralığı](#automodduplicatetexttimeframeinseconds) | Hangi iletilerin kopya olarak kabul edileceği zaman dilimi.  |

#### spam

| Setting                                                         | Description                                                                        |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [Etkin](#automodquickmessagesenabled)                           | Automatically moderate users sending a lot of messages in a short time.            |
| [# of Messages](#automodquickmessagesnumberofmessages)          | Kuralı tetiklemek için zaman aralığı içinde gönderilmesi gereken ileti sayısı.     |
| [Timeframe in Seconds](#automodquickmessagestimeframeinseconds) | The timeframe within which a user is allowed to send a maximum amount of messages. |

#### Bahsetmeler

| Setting                                                      | Description                                                                |
| ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| [etkin](#automodmentionusersenabled)                         | Automatically moderate messages that mention an excessive amount of users. |
| [Max # of Mentions](#automodmentionusersmaxnumberofmentions) | The maximum amount of users a member can mention in a message.             |
| [Etkin](#automodmentionrolesenabled)                         | Automatically moderate messages that mention an excessive amount of roles. |
| [Max # of Mentions](#automodmentionrolesmaxnumberofmentions) | The maximum amount of roles a member can mention in a message.             |

#### Emojiler

| Setting                                            | Description                                                                                                                                  |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| [Etkin](#automodemojisenabled)                     | Aşırı miktarda emoji içeren iletileri otomatik olarak denetleyin.                                                                            |
| [Max # of Emojis](#automodemojismaxnumberofemojis) | Kuralı tetiklemeden önce bir iletinin sahip olabileceği maksimum emoji miktarı.                                                              |
| [Etkin](#automodhoistenabled)                      | Kaldırmaya çalışırlarsa üyelere otomatik olarak takma adlar verin (kullanıcı listesinin en üstünde görünmek için özel karakterler kullanın). |

### Müzik

#### Music

| Setting                          | Description                                                          |
| -------------------------------- | -------------------------------------------------------------------- |
| [Müzik Ses Düzeyi](#musicvolume) | Bot bir ses kanalına katıldığında ayarlanan varsayılan ses seviyesi. |

#### Duyuru

| Setting                                     | Description                                                            |
| ------------------------------------------- | ---------------------------------------------------------------------- |
| [Sıradaki Şarkıyı Duyur](#announcenextsong) | Whether or not the next song should be announced in the voice channel. |
| [Announcement Voice](#announcementvoice)    | The voice used in the next song announcements.                         |

#### Fade Music

| Setting                                    | Description                                                                               |
| ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| [Fade Music On Talk](#fademusicontalk)     | If enabled, the music will fade down while people are talking.                            |
| [Fade Music End Delay](#fademusicenddelay) | The delay of how many seconds noone has to speak for the volume to return back to normal. |

#### Platform

| Setting                                             | Description                                                                               |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [Default Music Platform](#defaultmusicplatform)     | The platform that is used to search / play music when no platform is selected explicitly. |
| [Disabled Music Platforms](#disabledmusicplatforms) | Music platforms that are disabled and cannot be used to play music.                       |

<a name=prefix></a>

---

## Prefix

The prefix used to trigger bot commands.

Type: `String`

Default: `!`

Reset to default:
`!config prefix default`

Examples:

`!config prefix +`

`!config prefix >`

<a name=lang></a>

---

## Dil

Botun dili

Type: `Enum<Lang>`

Default: `en`

Reset to default:
`!config lang default`

Possible values: `ar`, `bg`, `cs`, `de`, `el`, `en`, `es`, `fr`, `hu`, `id_ID`, `it`, `ja`, `lt`, `nl`, `pl`, `pt`, `pt_BR`, `ro`, `ru`, `sr`, `tr`, `zh_CN`, `zh_TW`

Example:

`!config lang ar`

<a name=logChannel></a>

---

## Log kanalı

Bot işlemlerinin günlüğe kaydedildiği kanal.

Type: `Channel`

Default: `null`

Reset to default:
`!config logChannel default`

Examples:

`!config logChannel #channel`

<a name=getUpdates></a>

---

## Yükselt.

InviteManager hakkında geliştirme güncellemelerini almayı etkinleştirin.

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

## Komut kanalları

Botun komutlara tepki vereceği kanallar.

Type: `Channel[]`

Default: ``

Reset to default:
`!config channels default`

<a name=ignoredChannels></a>

---

## Görmezden gelinen kanallar

Botun komutları görmezden geleceği kanallar.

Type: `Channel[]`

Default: ``

Reset to default:
`!config ignoredChannels default`

<a name=joinRoles></a>

---

## Katılma rolleri

Katılırken tüm üyelere atanan roller.

Type: `Role[]`

Default: ``

Reset to default:
`!config joinRoles default`

<a name=joinMessage></a>

---

## Mesaj

Birisi sunucuya katıldığında gönderilen mesaj.

Type: `String`

Default: `{memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)`

Reset to default:
`!config joinMessage default`

<a name=joinMessageChannel></a>

---

## Mesaj Kanalı

Katılmadaki iletinin gönderildiği kanal

Type: `Channel`

Default: `null`

Reset to default:
`!config joinMessageChannel default`

Examples:

`!config joinMessageChannel #general`

`!config joinMessageChannel #joins`

<a name=leaveMessage></a>

---

## Mesaj

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

## Mesaj Kanalı

Ayrılma mesajının gönderildiği kanal.

Type: `Channel`

Default: `null`

Reset to default:
`!config leaveMessageChannel default`

Examples:

`!config leaveMessageChannel #general`

`!config leaveMessageChannel #leaves`

<a name=leaderboardStyle></a>

---

## Stil

Skor tablosunun görüntü stili.

Type: `Enum<LeaderboardStyle>`

Default: `normal`

Reset to default:
`!config leaderboardStyle default`

Possible values: `normal`, `table`, `mentions`

Example:

`!config leaderboardStyle normal`

<a name=hideLeftMembersFromLeaderboard></a>

---

## Soldaki üyeleri gizle

Liderlik tablosundan sunucudan ayrılan üyeleri gizleyin.

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

## Auto Subtract

Sahte davetleri otomatik olarak çıkarın

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

## Auto Subtract

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

## Auto Subtract Threshold

Davetiyenin sayması için bir kullanıcının sunucuda kalması gereken saniye cinsinden süre.

Type: `Number`

Default: `600`

Reset to default:
`!config autoSubtractLeaveThreshold default`

Examples:

`!config autoSubtractLeaveThreshold 60`

`!config autoSubtractLeaveThreshold 3600`

<a name=rankAssignmentStyle></a>

---

## Assignment Style

Ranklar kullanıcılara nasıl ödüllendirilir.

Type: `Enum<RankAssignmentStyle>`

Default: `all`

Reset to default:
`!config rankAssignmentStyle default`

Possible values: `all`, `highest`, `onlyAdd`

Example:

`!config rankAssignmentStyle all`

<a name=rankAnnouncementChannel></a>

---

## Duyuru Kanalı

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

## Duyuru Mesajı

Bir kullanıcı yeni bir rütbe aldığında gönderilen mesaj.

Type: `String`

Default: `Congratulations, **{memberMention}** has reached the **{rankName}** rank!`

Reset to default:
`!config rankAnnouncementMessage default`

Examples:

`!config rankAnnouncementMessage`

`!config rankAnnouncementMessage`

<a name=captchaVerificationOnJoin></a>

---

## Etkin

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

## Karşılama mesajı

Kullanıcının bir sunucuya katıldıktan ve captcha'ya girmesini istedikten sonra alacağı mesaj.

Type: `String`

Default: `Welcome to the server **{serverName}**! For extra protection, new members are required to enter a captcha.`

Reset to default:
`!config captchaVerificationWelcomeMessage default`

Examples:

`!config captchaVerificationWelcomeMessage Welcome, please enter the captcha below!`

<a name=captchaVerificationSuccessMessage></a>

---

## Success Message

Başarılı bir şekilde doğrulandıktan sonra kullanıcıya gönderilecek hoş geldiniz mesajı.

Type: `String`

Default: `You have successfully entered the captcha. Welcome to the server!`

Reset to default:
`!config captchaVerificationSuccessMessage default`

Examples:

`!config captchaVerificationSuccessMessage Thanks for entering the captcha, enjoy our server!`

<a name=captchaVerificationFailedMessage></a>

---

## Başarısız Mesaj

Geçersiz bir captcha girerse, kullanıcıya mesaj gönderilir.

Type: `String`

Default: `You did not enter the captha right within the specified time.We're sorry, but we have to kick you from the server. Feel free to join again.`

Reset to default:
`!config captchaVerificationFailedMessage default`

Examples:

`!config captchaVerificationFailedMessage Looks like you are not human :(. You can join again and try again later if this was a mistake!`

<a name=captchaVerificationTimeout></a>

---

## Verification Timeout

The time within which the captcha has to be entered successfully.

Type: `Number`

Default: `180`

Reset to default:
`!config captchaVerificationTimeout default`

Examples:

`!config captchaVerificationTimeout 60`

`!config captchaVerificationTimeout 600`

<a name=captchaVerificationLogEnabled></a>

---

## log etkin

Doğrulama girişimlerinin yapılıp yapılmadığı günlüğe kaydedilir.

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

## etkin

Automatically moderate messages (specific rules can also be turned on or off, this has to be ON for ANY rule to work).

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

## Moderated Channels

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

## Moderatör Rolü

Denetlenen rollerin listesi (bu, beyaz liste olarak işlev görür, tüm rolleri denetlemek için boş bırakın veya belirli rolleri yok saymak için `autoModIgnoredRoles` komutunu kullanın).

Type: `Role[]`

Default: ``

Reset to default:
`!config autoModModeratedRoles default`

Examples:

`!config autoModModeratedRoles @NewMembers`

`!config autoModModeratedRoles @Newbies,@Starters`

<a name=autoModIgnoredChannels></a>

---

## Görmezden gelinen kanallar

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

## Görmezden gelinen roller

Bu rollere sahip üyeler otomatik olarak denetlenmez.

Type: `Role[]`

Default: ``

Reset to default:
`!config autoModIgnoredRoles default`

Examples:

`!config autoModIgnoredRoles @TrustedMembers`

`!config autoModIgnoredRoles @Moderators,@Staff`

<a name=mutedRole></a>

---

## Susturulmuş üyenin alacağı rol

Susturulmuş olan kişilere verilen rol. Bu rolün "Mesaj Gönder" izninin reddedildiğinden emin olun.

Type: `Role`

Default: `null`

Reset to default:
`!config mutedRole default`

Examples:

`!config mutedRole @muted`

<a name=autoModDisabledForOldMembers></a>

---

## Disabled for Old Members

Disabled auto moderation for members that have been in your server for a long time.

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

## Old Members Threshold

The amount of time a member has to be in your server to be considered 'old'.

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

## Mod Log Channel

The channel where moderation logs will be posted in.

Type: `Channel`

Default: `null`

Reset to default:
`!config modLogChannel default`

Examples:

`!config modLogChannel #channel`

`!config modLogChannel #logs`

<a name=autoModDeleteBotMessage></a>

---

## Bot Mesajlarını Sil

Botların kendi mesajlarını otomatik olarak silin (sohbetinizi temiz tutar).

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

## Bot Mesajı Zaman Aşımını Sil

Bot mesajlarının silindiği zaman aşımı.

Type: `Number`

Default: `5`

Reset to default:
`!config autoModDeleteBotMessageTimeoutInSeconds default`

Examples:

`!config autoModDeleteBotMessageTimeoutInSeconds 5`

`!config autoModDeleteBotMessageTimeoutInSeconds 10`

<a name=modPunishmentBanDeleteMessage></a>

---

## Yasaklama Mesajını Sil

"Ban" mesajlarının otomatik olarak silinip silinmeyeceği.

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

## Kick Mesajını Sil

"Kick" mesajlarının otomatik olarak silinip silinmeyeceği.

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

## Softban Mesajlarını Sil

"Softban" mesajlarının otomatik olarak silinip silinmeyeceği.

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

## Uyarı Mesajlarını Sil.

"Uyarı" ceza mesajlarının otomatik olarak silinip silinmeyeceği.

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

## Susturma Mesajlarını Sil.

"Mute" mesajlarının otomatik olarak silinip silinmeyeceği.

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

## etkin

Discord Sunucu davet bağlantıları için iletileri otomatik olarak tarayın ve kaldırın.

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

## Etkin

Automatically remove messages containing links (you can set a whitelist and blacklist).

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

## Betaz liste

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

## Kara liste

Blacklist certain links which users won't be able to post.

Type: `String[]`

Default: ``

Reset to default:
`!config autoModLinksBlacklist default`

Examples:

`!config autoModLinksBlacklist google.com`

`!config autoModLinksBlacklist twitch.com,youtube.com`

<a name=autoModLinksFollowRedirects></a>

---

## Yönlendirmeleri İzle

Enable this to resolve redirects for links.

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

## Etkin

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

## Kara liste

Yasaklanan kelimelerin listesi.

Type: `String[]`

Default: ``

Reset to default:
`!config autoModWordsBlacklist default`

Examples:

`!config autoModWordsBlacklist gay`

`!config autoModWordsBlacklist stupid,fuck`

<a name=autoModAllCapsEnabled></a>

---

## Etkin

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

## Min. Characters

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

## Percentage CAPs

The percentage of characters of the message that have to be CAPs for the rule to trigger.

Type: `Number`

Default: `70`

Reset to default:
`!config autoModAllCapsPercentageCaps default`

Examples:

`!config autoModAllCapsPercentageCaps 50`

`!config autoModAllCapsPercentageCaps 90`

<a name=autoModDuplicateTextEnabled></a>

---

## Etkin

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

## Saniyede Zaman Aralığı

Hangi iletilerin kopya olarak kabul edileceği zaman dilimi.

Type: `Number`

Default: `60`

Reset to default:
`!config autoModDuplicateTextTimeframeInSeconds default`

Examples:

`!config autoModDuplicateTextTimeframeInSeconds 5`

`!config autoModDuplicateTextTimeframeInSeconds 20`

<a name=autoModQuickMessagesEnabled></a>

---

## Etkin

Automatically moderate users sending a lot of messages in a short time.

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

## # of Messages

Kuralı tetiklemek için zaman aralığı içinde gönderilmesi gereken ileti sayısı.

Type: `Number`

Default: `5`

Reset to default:
`!config autoModQuickMessagesNumberOfMessages default`

Examples:

`!config autoModQuickMessagesNumberOfMessages 5`

`!config autoModQuickMessagesNumberOfMessages 10`

<a name=autoModQuickMessagesTimeframeInSeconds></a>

---

## Timeframe in Seconds

The timeframe within which a user is allowed to send a maximum amount of messages.

Type: `Number`

Default: `3`

Reset to default:
`!config autoModQuickMessagesTimeframeInSeconds default`

Examples:

`!config autoModQuickMessagesTimeframeInSeconds 2`

`!config autoModQuickMessagesTimeframeInSeconds 10`

<a name=autoModMentionUsersEnabled></a>

---

## etkin

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

## Max # of Mentions

The maximum amount of users a member can mention in a message.

Type: `Number`

Default: `5`

Reset to default:
`!config autoModMentionUsersMaxNumberOfMentions default`

Examples:

`!config autoModMentionUsersMaxNumberOfMentions 2`

`!config autoModMentionUsersMaxNumberOfMentions 5`

<a name=autoModMentionRolesEnabled></a>

---

## Etkin

Automatically moderate messages that mention an excessive amount of roles.

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

The maximum amount of roles a member can mention in a message.

Type: `Number`

Default: `3`

Reset to default:
`!config autoModMentionRolesMaxNumberOfMentions default`

Examples:

`!config autoModMentionRolesMaxNumberOfMentions 2`

`!config autoModMentionRolesMaxNumberOfMentions 5`

<a name=autoModEmojisEnabled></a>

---

## Etkin

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

## Max # of Emojis

Kuralı tetiklemeden önce bir iletinin sahip olabileceği maksimum emoji miktarı.

Type: `Number`

Default: `5`

Reset to default:
`!config autoModEmojisMaxNumberOfEmojis default`

Examples:

`!config autoModEmojisMaxNumberOfEmojis 5`

`!config autoModEmojisMaxNumberOfEmojis 10`

<a name=autoModHoistEnabled></a>

---

## Etkin

Kaldırmaya çalışırlarsa üyelere otomatik olarak takma adlar verin (kullanıcı listesinin en üstünde görünmek için özel karakterler kullanın).

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

## Müzik Ses Düzeyi

Bot bir ses kanalına katıldığında ayarlanan varsayılan ses seviyesi.

Type: `Number`

Default: `100`

Reset to default:
`!config musicVolume default`

<a name=announceNextSong></a>

---

## Sıradaki Şarkıyı Duyur

Whether or not the next song should be announced in the voice channel.

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

## Announcement Voice

The voice used in the next song announcements.

Type: `Enum<AnnouncementVoice>`

Default: `Joanna`

Reset to default:
`!config announcementVoice default`

Possible values: `Joanna`, `Salli`, `Kendra`, `Kimberly`, `Ivy`, `Matthew`, `Justin`, `Joey`

Example:

`!config announcementVoice Joanna`

<a name=fadeMusicOnTalk></a>

---

## Fade Music On Talk

If enabled, the music will fade down while people are talking.

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

## Fade Music End Delay

The delay of how many seconds noone has to speak for the volume to return back to normal.

Type: `Number`

Default: `1`

Reset to default:
`!config fadeMusicEndDelay default`

<a name=defaultMusicPlatform></a>

---

## Default Music Platform

The platform that is used to search / play music when no platform is selected explicitly.

Type: `Enum<MusicPlatformTypes>`

Default: `soundcloud`

Reset to default:
`!config defaultMusicPlatform default`

<a name=disabledMusicPlatforms></a>

---

## Disabled Music Platforms

Music platforms that are disabled and cannot be used to play music.

Type: `Enum<MusicPlatformTypes>[]`

Default: ``

Reset to default:
`!config disabledMusicPlatforms default`
