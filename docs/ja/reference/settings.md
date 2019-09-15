# Configs

There are many config options that can be set. You don't have to set all of them. If you just added the bot, just run `!setup`, which will guide you through the most important ones.

## Overview

### 総合

| Setting                                     | Description                                                              |
| ------------------------------------------- | ------------------------------------------------------------------------ |
| [接頭辞](#prefix)                           | ボットコマンドを呼びだすために使用されるプレフィックス。                 |
| [言語](#lang)                               | BOT の言語                                                               |
| [ログチャンネル](#logchannel)               | ボットアクションが記録されるチャンネル。                                 |
| [アップデート情報を手に入れる](#getupdates) | InviteManager に関する開発の最新情報を受け取ることができるようにします。 |
| [コマンドチャンネル](#channels)             | ボットがコマンドに反応するチャンネル。                                   |
| [無視されるチャンネル](#ignoredchannels)    | ボットがコマンドを無視するチャンネル。                                   |

### 招待

#### 参加

| Setting                                     | Description                                    |
| ------------------------------------------- | ---------------------------------------------- |
| [メッセージ](#joinmessage)                  | サーバーに参加したときに送信されるメッセージ。 |
| [メッセージチャンネル](#joinmessagechannel) | 参加時のメッセージが送信されるチャンネル。     |

#### 退出

| Setting                                         | Description                                                        |
| ----------------------------------------------- | ------------------------------------------------------------------ |
| [メッセージ](#leavemessage)                     | サーバーを離れたときに送信されるメッセージ。                       |
| [メッセージチャンネル](#leavemessagechannel)    | 退出メッセージが送信されるチャンネル。                             |
| [自動減算](#autosubtractleaves)                 | 招待ユーザーが退出したときに招待者から招待状を自動的に削除します。 |
| [自動減算しきい値](#autosubtractleavethreshold) | 招待を数えるためにユーザーがサーバーに留まる必要がある時間（秒）。 |

#### リーダーボード

| Setting                                               | Description                                                  |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| [スタイル](#leaderboardstyle)                         | リーダーボードの表示スタイル。                               |
| [退出メンバーを隠す](#hideleftmembersfromleaderboard) | リーダーボードからサーバーを離れたメンバーを非表示にします。 |

#### 偽

| Setting                        | Description                      |
| ------------------------------ | -------------------------------- |
| [自動減算](#autosubtractfakes) | 自動的に偽の招待を差し引きます。 |

#### ランク

| Setting                                        | Description                                                      |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| [割り当てスタイル](#rankassignmentstyle)       | ランクはユーザーにどのように与えられますか。                     |
| [お知らせチャンネル](#rankannouncementchannel) | ユーザーが新しいランクを獲得したときにアナウンスするチャンネル。 |
| [お知らせメッセージ](#rankannouncementmessage) | ユーザーが新しいランクを受け取ったときに送信されるメッセージ。   |

### 管理

#### Captcha

| Setting                                                  | Description                                                                          |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [有効](#captchaverificationonjoin)                       | キャプチャ検証が有効かどうか。                                                       |
| [参加メッセージ](#captchaverificationwelcomemessage)     | ユーザーがサーバーに参加してキャプチャに入るように指示した後に表示されるメッセージ。 |
| [成功メッセージ](#captchaverificationsuccessmessage)     | ユーザーが正常に確認した後にユーザーに送信されるウェルカムメッセージ。               |
| [失敗メッセージ](#captchaverificationfailedmessage)      | ユーザーが無効なキャプチャを入力した場合にメッセージがユーザーに送信されます。       |
| [認証タイムアウト](#captchaverificationtimeout)          | キャプチャが正常に入力されなければならない時間。                                     |
| [ログが有効化されました](#captchaverificationlogenabled) | 検証の試行がログに記録されるかどうか。                                               |

#### 総合

| Setting                                                          | Description                                                |
| ---------------------------------------------------------------- | ---------------------------------------------------------- |
| [有効](#automodenabled)                                          | settings.autoModEnabled.description                        |
| [管理チャンネル](#automodmoderatedchannels)                      | settings.autoModModeratedChannels.description              |
| [管理役職](#automodmoderatedroles)                               | settings.autoModModeratedRoles.description                 |
| [無視されるチャンネル](#automodignoredchannels)                  | settings.autoModIgnoredChannels.description                |
| [無視される役職](#automodignoredroles)                           | settings.autoModIgnoredRoles.description                   |
| [ミュート役職](#mutedrole)                                       | settings.mutedRole.description                             |
| [古いメンバーには無効](#automoddisabledforoldmembers)            | settings.autoModDisabledForOldMembers.description          |
| [古いメンバーのしきい値](#automoddisabledforoldmembersthreshold) | settings.autoModDisabledForOldMembersThreshold.description |

#### ログを記録する

| Setting                                                                        | Description                                                  |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| [ログが有効化されました](#automodlogenabled)                                   | settings.autoModLogEnabled.description                       |
| [MOD ログチャンネル](#modlogchannel)                                           | モデレーションログが記録されるチャンネル。                   |
| [BOT のメッセージを削除](#automoddeletebotmessage)                             | settings.autoModDeleteBotMessage.description                 |
| [ボットメッセージタイムアウトの削除](#automoddeletebotmessagetimeoutinseconds) | settings.autoModDeleteBotMessageTimeoutInSeconds.description |
| [BAN メッセージを削除](#modpunishmentbandeletemessage)                         | 「禁止」プッシュメッセージを自動的に削除するかどうか。       |
| [キックメッセージを削除](#modpunishmentkickdeletemessage)                      | 「キック」プッシュメッセージが自動的に削除されるかどうか。   |
| [ソフト BAN メッセージを削除](#modpunishmentsoftbandeletemessage)              | 「Softban」プッシュメッセージが自動的に削除されるかどうか。  |
| [警告メッセージを削除](#modpunishmentwarndeletemessage)                        | 「警告」プッシュメッセージを自動的に削除するかどうか。       |
| [ミュートメッセージを削除](#modpunishmentmutedeletemessage)                    | 「ミュート」プッシュメッセージが自動的に削除されるかどうか。 |

#### 招待

| Setting                        | Description                                |
| ------------------------------ | ------------------------------------------ |
| [有効](#automodinvitesenabled) | settings.autoModInvitesEnabled.description |

#### リンク

| Setting                                                    | Description                                      |
| ---------------------------------------------------------- | ------------------------------------------------ |
| [有効](#automodlinksenabled)                               | settings.autoModLinksEnabled.description         |
| [ホワイトリスト](#automodlinkswhitelist)                   | settings.autoModLinksWhitelist.description       |
| [ブラックリスト](#automodlinksblacklist)                   | settings.autoModLinksBlacklist.description       |
| [リダイレクトをフォローする](#automodlinksfollowredirects) | settings.autoModLinksFollowRedirects.description |

#### 禁止された単語

| Setting                                  | Description                                          |
| ---------------------------------------- | ---------------------------------------------------- |
| [有効](#automodwordsenabled)             | ブラックリストに載っている単語を自動対応するかどうか |
| [ブラックリスト](#automodwordsblacklist) | 禁止されている単語のリスト。                         |

#### キャップ

| Setting                                           | Description                                       |
| ------------------------------------------------- | ------------------------------------------------- |
| [有効](#automodallcapsenabled)                    | settings.autoModAllCapsEnabled.description        |
| [最小文字](#automodallcapsmincharacters)          | settings.autoModAllCapsMinCharacters.description  |
| [煽りのパーセント](#automodallcapspercentagecaps) | settings.autoModAllCapsPercentageCaps.description |

#### 重複メッセージ

| Setting                                                           | Description                                                 |
| ----------------------------------------------------------------- | ----------------------------------------------------------- |
| [有効化](#automodduplicatetextenabled)                            | settings.autoModDuplicateTextEnabled.description            |
| [秒単位のタイムフレーム](#automodduplicatetexttimeframeinseconds) | settings.autoModDuplicateTextTimeframeInSeconds.description |

#### スパム

| Setting                                                           | Description                                                 |
| ----------------------------------------------------------------- | ----------------------------------------------------------- |
| [有効](#automodquickmessagesenabled)                              | settings.autoModQuickMessagesEnabled.description            |
| [#のメッセージ数](#automodquickmessagesnumberofmessages)          | settings.autoModQuickMessagesNumberOfMessages.description   |
| [秒単位のタイムフレーム](#automodquickmessagestimeframeinseconds) | settings.autoModQuickMessagesTimeframeInSeconds.description |

#### メンション

| Setting                                               | Description                                                 |
| ----------------------------------------------------- | ----------------------------------------------------------- |
| [有効](#automodmentionusersenabled)                   | settings.autoModMentionUsersEnabled.description             |
| [メンション](#automodmentionusersmaxnumberofmentions) | settings.autoModMentionUsersMaxNumberOfMentions.description |
| [有効](#automodmentionrolesenabled)                   | settings.autoModMentionRolesEnabled.description             |
| [メンション](#automodmentionrolesmaxnumberofmentions) | settings.autoModMentionRolesMaxNumberOfMentions.description |

#### 絵文字

| Setting                                           | Description                                         |
| ------------------------------------------------- | --------------------------------------------------- |
| [有効](#automodemojisenabled)                     | settings.autoModEmojisEnabled.description           |
| [絵文字の最大数](#automodemojismaxnumberofemojis) | settings.autoModEmojisMaxNumberOfEmojis.description |
| [デホイストが有効](#automodhoistenabled)          | settings.autoModHoistEnabled.description            |

### 音楽

#### 音楽

| Setting                                                          | Description                                                      |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| [音楽の音量](#musicvolume)                                       | ボットが音声チャネルに参加したときに設定されるデフォルトの音量。 |
| [次の曲をアナウンスする](#announcenextsong)                      | 次の曲を音声チャンネルでアナウンスするかどうか。                 |
| [アナウンスの声](#announcementvoice)                             | 次の曲の発表で使われる声。                                       |
| [トークで音楽をフェード](#fademusicontalk)                       | 有効にすると、人々が話している間、音楽は消えます。               |
| [ミュージックのフェードが終了するまでの時間](#fademusicenddelay) | 音量が正常に戻るまでに誰も話していない秒数の遅延。               |

<a name=prefix></a>

---

## 接頭辞

ボットコマンドを呼びだすために使用されるプレフィックス。

Type: `String`

Default: `!`

Reset to default:
`!config prefix default`

Examples:

`!config prefix +`

`!config prefix >`

<a name=lang></a>

---

## 言語

BOT の言語

Type: `Enum<Lang>`

Default: `en`

Reset to default:
`!config lang default`

Possible values: `ar`, `bg`, `cs`, `de`, `el`, `en`, `es`, `fr`, `id_ID`, `it`, `ja`, `nl`, `pl`, `pt`, `pt_BR`, `ro`, `ru`, `tr`, `zh_CN`, `zh_TW`, `ur_PK`, `sv`, `sr`, `hu`, `lt`

Example:

`!config lang ar`

<a name=logChannel></a>

---

## ログチャンネル

ボットアクションが記録されるチャンネル。

Type: `Channel`

Default: `null`

Reset to default:
`!config logChannel default`

Examples:

`!config logChannel #channel`

<a name=getUpdates></a>

---

## アップデート情報を手に入れる

InviteManager に関する開発の最新情報を受け取ることができるようにします。

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

## コマンドチャンネル

ボットがコマンドに反応するチャンネル。

Type: `Channel[]`

Default: ``

Reset to default:
`!config channels default`

<a name=ignoredChannels></a>

---

## 無視されるチャンネル

ボットがコマンドを無視するチャンネル。

Type: `Channel[]`

Default: ``

Reset to default:
`!config ignoredChannels default`

<a name=joinMessage></a>

---

## メッセージ

サーバーに参加したときに送信されるメッセージ。

Type: `String`

Default: `{memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)`

Reset to default:
`!config joinMessage default`

<a name=joinMessageChannel></a>

---

## メッセージチャンネル

参加時のメッセージが送信されるチャンネル。

Type: `Channel`

Default: `null`

Reset to default:
`!config joinMessageChannel default`

Examples:

`!config joinMessageChannel #general`

`!config joinMessageChannel #joins`

<a name=leaveMessage></a>

---

## メッセージ

サーバーを離れたときに送信されるメッセージ。

Type: `String`

Default: `{memberName} **left**; Invited by **{inviterName}**`

Reset to default:
`!config leaveMessage default`

Examples:

`!config leaveMessage`

`!config leaveMessage`

<a name=leaveMessageChannel></a>

---

## メッセージチャンネル

退出メッセージが送信されるチャンネル。

Type: `Channel`

Default: `null`

Reset to default:
`!config leaveMessageChannel default`

Examples:

`!config leaveMessageChannel #general`

`!config leaveMessageChannel #leaves`

<a name=leaderboardStyle></a>

---

## スタイル

リーダーボードの表示スタイル。

Type: `Enum<LeaderboardStyle>`

Default: `normal`

Reset to default:
`!config leaderboardStyle default`

Possible values: `normal`, `table`, `mentions`

Example:

`!config leaderboardStyle normal`

<a name=hideLeftMembersFromLeaderboard></a>

---

## 退出メンバーを隠す

リーダーボードからサーバーを離れたメンバーを非表示にします。

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

## 自動減算

自動的に偽の招待を差し引きます。

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

## 自動減算

招待ユーザーが退出したときに招待者から招待状を自動的に削除します。

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

## 自動減算しきい値

招待を数えるためにユーザーがサーバーに留まる必要がある時間（秒）。

Type: `Number`

Default: `600`

Reset to default:
`!config autoSubtractLeaveThreshold default`

Examples:

`!config autoSubtractLeaveThreshold 60`

`!config autoSubtractLeaveThreshold 3600`

<a name=rankAssignmentStyle></a>

---

## 割り当てスタイル

ランクはユーザーにどのように与えられますか。

Type: `Enum<RankAssignmentStyle>`

Default: `all`

Reset to default:
`!config rankAssignmentStyle default`

Possible values: `all`, `highest`

Example:

`!config rankAssignmentStyle all`

<a name=rankAnnouncementChannel></a>

---

## お知らせチャンネル

ユーザーが新しいランクを獲得したときにアナウンスするチャンネル。

Type: `Channel`

Default: `null`

Reset to default:
`!config rankAnnouncementChannel default`

Examples:

`!config rankAnnouncementChannel`

`!config rankAnnouncementChannel`

<a name=rankAnnouncementMessage></a>

---

## お知らせメッセージ

ユーザーが新しいランクを受け取ったときに送信されるメッセージ。

Type: `String`

Default: `Congratulations, **{memberMention}** has reached the **{rankName}** rank!`

Reset to default:
`!config rankAnnouncementMessage default`

Examples:

`!config rankAnnouncementMessage`

`!config rankAnnouncementMessage`

<a name=captchaVerificationOnJoin></a>

---

## 有効

キャプチャ検証が有効かどうか。

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

## 参加メッセージ

ユーザーがサーバーに参加してキャプチャに入るように指示した後に表示されるメッセージ。

Type: `String`

Default: `Welcome to the server **{serverName}**! For extra protection, new members are required to enter a captcha.`

Reset to default:
`!config captchaVerificationWelcomeMessage default`

Examples:

`!config captchaVerificationWelcomeMessage Welcome, please enter the captcha below!`

<a name=captchaVerificationSuccessMessage></a>

---

## 成功メッセージ

ユーザーが正常に確認した後にユーザーに送信されるウェルカムメッセージ。

Type: `String`

Default: `You have successfully entered the captcha. Welcome to the server!`

Reset to default:
`!config captchaVerificationSuccessMessage default`

Examples:

`!config captchaVerificationSuccessMessage Thanks for entering the captcha, enjoy our server!`

<a name=captchaVerificationFailedMessage></a>

---

## 失敗メッセージ

ユーザーが無効なキャプチャを入力した場合にメッセージがユーザーに送信されます。

Type: `String`

Default: `You did not enter the captha right within the specified time.We're sorry, but we have to kick you from the server. Feel free to join again.`

Reset to default:
`!config captchaVerificationFailedMessage default`

Examples:

`!config captchaVerificationFailedMessage Looks like you are not human :(. You can join again and try again later if this was a mistake!`

<a name=captchaVerificationTimeout></a>

---

## 認証タイムアウト

キャプチャが正常に入力されなければならない時間。

Type: `Number`

Default: `180`

Reset to default:
`!config captchaVerificationTimeout default`

Examples:

`!config captchaVerificationTimeout 60`

`!config captchaVerificationTimeout 600`

<a name=captchaVerificationLogEnabled></a>

---

## ログが有効化されました

検証の試行がログに記録されるかどうか。

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

## 有効

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

## 管理チャンネル

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

## 管理役職

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

## 無視されるチャンネル

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

## 無視される役職

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

## ミュート役職

settings.mutedRole.description

Type: `Role`

Default: `null`

Reset to default:
`!config mutedRole default`

Examples:

`!config mutedRole @muted`

<a name=autoModDisabledForOldMembers></a>

---

## 古いメンバーには無効

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

## 古いメンバーのしきい値

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

## ログが有効化されました

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

## MOD ログチャンネル

モデレーションログが記録されるチャンネル。

Type: `Channel`

Default: `null`

Reset to default:
`!config modLogChannel default`

Examples:

`!config modLogChannel #channel`

`!config modLogChannel #logs`

<a name=autoModDeleteBotMessage></a>

---

## BOT のメッセージを削除

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

## ボットメッセージタイムアウトの削除

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

## BAN メッセージを削除

「禁止」プッシュメッセージを自動的に削除するかどうか。

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

## キックメッセージを削除

「キック」プッシュメッセージが自動的に削除されるかどうか。

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

## ソフト BAN メッセージを削除

「Softban」プッシュメッセージが自動的に削除されるかどうか。

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

## 警告メッセージを削除

「警告」プッシュメッセージを自動的に削除するかどうか。

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

## ミュートメッセージを削除

「ミュート」プッシュメッセージが自動的に削除されるかどうか。

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

## 有効

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

## 有効

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

## ホワイトリスト

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

## ブラックリスト

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

## リダイレクトをフォローする

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

## 有効

ブラックリストに載っている単語を自動対応するかどうか

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

## ブラックリスト

禁止されている単語のリスト。

Type: `String[]`

Default: ``

Reset to default:
`!config autoModWordsBlacklist default`

Examples:

`!config autoModWordsBlacklist gay`

`!config autoModWordsBlacklist stupid,fuck`

<a name=autoModAllCapsEnabled></a>

---

## 有効

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

## 最小文字

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

## 煽りのパーセント

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

## 有効化

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

## 秒単位のタイムフレーム

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

## 有効

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

## #のメッセージ数

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

## 秒単位のタイムフレーム

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

## 有効

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

## メンション

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

## 有効

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

## メンション

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

## 有効

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

## 絵文字の最大数

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

## デホイストが有効

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

## 音楽の音量

ボットが音声チャネルに参加したときに設定されるデフォルトの音量。

Type: `Number`

Default: `100`

Reset to default:
`!config musicVolume default`

<a name=announceNextSong></a>

---

## 次の曲をアナウンスする

次の曲を音声チャンネルでアナウンスするかどうか。

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

## アナウンスの声

次の曲の発表で使われる声。

Type: `Enum<AnnouncementVoice>`

Default: `Joanna`

Reset to default:
`!config announcementVoice default`

Possible values: `Joanna`, `Salli`, `Kendra`, `Kimberly`, `Ivy`, `Matthew`, `Justin`, `Joey`

Example:

`!config announcementVoice Joanna`

<a name=fadeMusicOnTalk></a>

---

## トークで音楽をフェード

有効にすると、人々が話している間、音楽は消えます。

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

## ミュージックのフェードが終了するまでの時間

音量が正常に戻るまでに誰も話していない秒数の遅延。

Type: `Number`

Default: `1`

Reset to default:
`!config fadeMusicEndDelay default`
