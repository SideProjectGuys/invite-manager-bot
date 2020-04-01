# Commands

To get a list of available commands, do !help on your server.

## Arguments & Flags

Most commands accept arguments and/or flags.  
According to the **Type** of the argument or flag you can provide different values.

### ブール値

この引数は、`true` または `false`を要求しています。 `yes`と `no`使用できます。

### 番号

この引数には数値が必要です

### 列挙型

この引数は、有効な値の特定のセットからの値を要求します。

> 有効な値はコマンドによって異なります。コマンドと列挙型の有効な値に関する詳細情報を取得するには、`!help<command>` (eg. `!help addRank`) と使用してください。

### 招待コード

この引数は、Discord Invite Code を想定しています。

> `https://discord.gg/` の後ろの部分置くことができ、Discord がプレビューを作成しないようにします。

### ユーザー

この引数は Discord ユーザーを想定しています。 次のいずれかの方法を使用して、ユーザーに指定できます:

-ユーザーをメンション: `@Valandur`

- 彼らの ID を使用: `102785693046026240`
- 彼らの名前を使用: `Valandur`
- 名前と識別名を使用: `Valandur#3581`
- 名前にスペースが含まれる場合は引用符を使用します: `"Valandur with a space"`

### 役職

この引数は、Discord の Role を想定しています。 次のいずれかの方法を使用して、Role を指定できます。

- role をメンション: `@Admin`
- ID を使用: `102785693046026240`
- 名前を使用: `Admin`
- 名前にスペースがある場合は引用符を使用します: `"Admin with a space"`

### チャンネル

この引数は Discord チャンネルを想定しています。 次のいずれかの方法を使用して、チャンネルを要求できます:

- チャンネルのメンション:`#general`
- ID を使用: `409846838129197057`
- 名前を使用: `general`
- 名前にスペースがある場合は引用符を使用します: `"general with a space"`

### コマンド

This argument expects a command of this bot. You can use any of the following methods to provide a command:

- Use the command name: `invites`
- Use an alias of the command: `p`

### テキスト

この引数には、任意のテキストが必要です。 スペースを含むテキストには、引用符(`"Text with quotes"`) を使用できます。

> テキストが最後の引数である場合、引用符を使用する必要はありません。

### 日付

This argument expects a date. You can use various formats, but we recommend: `YYYY-MM-DD`

### 期間

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
| [addInvites](#addInvites)         | メンバーに招待を追加(又は削除)します。             | !addInvites \<user\> \<amount\> [reason]                         |
| [clearInvites](#clearInvites)     | サーバー(ユーザー)の招待を削除します。             | !clearInvites [-d value\|--date=value][-cb\|--clearbonus] [user] |
| [createInvite](#createInvite)     | 永久の招待コードを作成します。                     | !createInvite \<name\> [channel]                                 |
| [info](#info)                     | 特定のメンバーに関する情報を表示します。           | !info \<user\> [details][page]                                   |
| [inviteCodes](#inviteCodes)       | すべての招待コードの一覧を取得する                 | !inviteCodes                                                     |
| [inviteDetails](#inviteDetails)   | 招待状の送信元に関する詳細が表示されます。         | !inviteDetails [user]                                            |
| [invites](#invites)               | Show personal invites.                             | !invites [user]                                                  |
| [leaderboard](#leaderboard)       | 招待が最も多いメンバーを表示します。               | !leaderboard [page]                                              |
| [removeInvites](#removeInvites)   | Removes a specified amount of invites from a user. | !removeInvites \<user\> \<amount\> [reason]                      |
| [restoreInvites](#restoreInvites) | 以前にクリアした招待状をすべて復元します。         | !restoreInvites [user]                                           |
| [subtractFakes](#subtractFakes)   | すべてのユーザーから偽の招待を削除します。         | !subtractFakes                                                   |
| [subtractLeaves](#subtractLeaves) | すべてのユーザーの退出履歴を削除します。           | !subtractLeaves                                                  |

### Ranks

| Command                   | Description                                   | Usage                                |
| ------------------------- | --------------------------------------------- | ------------------------------------ |
| [addRank](#addRank)       | 新しいランクを追加する。                      | !addRank \<role\> \<invites\> [info] |
| [fixRanks](#fixRanks)     | Deletes any ranks where the role was deleted. | !fixRanks                            |
| [ranks](#ranks)           | すべてのランクを見る                          | !ranks [page]                        |
| [removeRank](#removeRank) | ランクを外します。                            | !removeRank \<rank\>                 |

### Config

| Command                                 | Description                                      | Usage                                       |
| --------------------------------------- | ------------------------------------------------ | ------------------------------------------- |
| [botConfig](#botConfig)                 | BOT の設定を表示および変更します。               | !botConfig [key][value]                     |
| [config](#config)                       | サーバーの設定を表示および変更します。           | !config [key][value]                        |
| [interactiveConfig](#interactiveConfig) | 対話型の設定                                     | !interactiveConfig                          |
| [inviteCodeConfig](#inviteCodeConfig)   | サーバーの招待リンクの設定を表示、変更します。   | !inviteCodeConfig [key][invitecode] [value] |
| [memberConfig](#memberConfig)           | サーバーのメンバーの設定を表示および変更します。 | !memberConfig [key][user] [value]           |
| [permissions](#permissions)             | コマンドを使用するための権限を設定します。       | !permissions [cmd][role]                    |

### Info

| Command             | Description                                            | Usage           |
| ------------------- | ------------------------------------------------------ | --------------- |
| [botInfo](#botInfo) | BOT に関する基本的な情報を入手してください。           | !botInfo        |
| [credits](#credits) | BOT の開発者と貢献者を表示します。                     | !credits        |
| [getBot](#getBot)   | ボットへの招待リンクを入手できます。                   | !getBot         |
| [help](#help)       | ヘルプを表示する。                                     | !help [command] |
| [members](#members) | 現在のサーバーのメンバー数を表示します。               | !members        |
| [ping](#ping)       | ボットをピング                                         | !ping           |
| [prefix](#prefix)   | ボットの現在のプレフィックスを表示します。             | !prefix         |
| [setup](#setup)     | ボットの設定や問題の確認（権限の不足など）を手助けする | !setup          |
| [support](#support) | サポートサーバーへの招待リンクを入手してください。     | !support        |

### Premium

| Command                   | Description                                                     | Usage             |
| ------------------------- | --------------------------------------------------------------- | ----------------- |
| [export](#export)         | InviteManager のデータを csv シートにエクスポートします。       | !export \<type\>  |
| [premium](#premium)       | InviteManager のプレミアムバージョンに関する情報。              | !premium [action] |
| [tryPremium](#tryPremium) | プレミアム版の InviteManager を期間限定で無料でお試しください。 | !tryPremium       |

### Moderation

| Command                               | Description                                                                                                        | Usage                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| [ban](#ban)                           | サーバーからメンバーを BAN します。                                                                                | !ban [-d value\|--deleteMessageDays=value] \<user\> [reason]     |
| [caseDelete](#caseDelete)             | 指定したケースを削除します。                                                                                       | !caseDelete \<caseNumber\> [reason]                              |
| [caseView](#caseView)                 | 特定のケースに関する情報を表示します。                                                                             | !caseView \<caseNumber\>                                         |
| [check](#check)                       | ユーザーの違反と罰の回数を確認してください。                                                                       | !check \<user\>                                                  |
| [clean](#clean)                       | 特定のチャットタイプを削除します。                                                                                 | !clean \<type\> [numberOfMessages]                               |
| [cleanShort](#cleanShort)             | 短いメッセージを消去する                                                                                           | !cleanShort \<maxTextLength\> [numberOfMessages]                 |
| [cleanText](#cleanText)               | 指定のキーワードを含むメッセージを削除します。                                                                     | !cleanText \<text\> [numberOfMessages]                           |
| [kick](#kick)                         | サーバーからメンバーを蹴ります。                                                                                   | !kick \<member\> [reason]                                        |
| [lockdown](#lockdown)                 | Lockdown a specific channel (Prevents anyone without special roles from sending messages)                          | !lockdown [-t value\|--timeout=value][channel]                   |
| [mute](#mute)                         | ユーザーをミュートする                                                                                             | !mute [-d value\|--duration=value] \<user\> [reason]             |
| [punishmentConfig](#punishmentConfig) | 一定量の警告に達したときに罰を設定します。                                                                         | !punishmentConfig [punishment][strikes] [args]                   |
| [purge](#purge)                       | チャネル内のメッセージを削除します。                                                                               | !purge \<quantity\> [user]                                       |
| [purgeUntil](#purgeUntil)             | 指定されたメッセージまでチャネル内のメッセージを削除します。                                                       | !purgeUntil \<messageID\>                                        |
| [softBan](#softBan)                   | サーバーからメンバーを BAN してから自動的に BAN 解除します。                                                       | !softBan [-d value\|--deleteMessageDays=value] \<user\> [reason] |
| [strike](#strike)                     | ユーザーにストライクを追加する                                                                                     | !strike \<member\> \<type\> \<amount\>                           |
| [strikeConfig](#strikeConfig)         | さまざまな違反に対して受け取った警告を設定します。                                                                 | !strikeConfig [violation][strikes]                               |
| [unban](#unban)                       | ユーザーの BAN を解除する                                                                                          | !unban \<user\> [reason]                                         |
| [unhoist](#unhoist)                   | すべてのメンバーの前にその名前の前に特殊文字を付けて文字を追加すると、メンバーリストの最後にそれらが表示されます。 | !unhoist                                                         |
| [unmute](#unmute)                     | ユーザーのミュートを解除する                                                                                       | !unmute \<user\>                                                 |
| [warn](#warn)                         | メンバーに警告する                                                                                                 | !warn \<member\> [reason]                                        |

### Music

| Command                   | Description                                                                  | Usage                                                   |
| ------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------- |
| [disconnect](#disconnect) | 現在の音声チャンネルからボットを退出させます。                               | !disconnect                                             |
| [lyrics](#lyrics)         | 現在再生中の曲の歌詞を表示します。                                           | !lyrics [-l\|--live]                                    |
| [mashup](#mashup)         | 2 つの曲のマッシュアップを作成します。                                       | !mashup \<videos\>                                      |
| [nowPlaying](#nowPlaying) | 現在再生されている曲の情報を表示しています。                                 | !nowPlaying [-p\|--pin]                                 |
| [pause](#pause)           | 現在の曲を一時停止します。                                                   | !pause                                                  |
| [play](#play)             | キューが空の場合は曲を再生し、それ以外の場合はキューの最後に曲を追加します。 | !play [-p value\|--platform=value][-n\|--next] \<link\> |
| [queue](#queue)           | キュー内の曲を表示します。                                                   | !queue                                                  |
| [repeat](#repeat)         | 繰り返し再生する曲を設定します。                                             | !repeat                                                 |
| [resume](#resume)         | 現在の曲を再開します。                                                       | !resume                                                 |
| [rewind](#rewind)         | 曲を巻き戻して最初から始めます。                                             | !rewind                                                 |
| [search](#search)         | 検索語を検索して、結果の 1 つを選択させます。                                | !search [-p value\|--platform=value] \<search\>         |
| [seek](#seek)             | 曲の特定の部分にスキップします。                                             | !seek [duration]                                        |
| [skip](#skip)             | 現在の曲をスキップして、キュー内の次の曲を再生します。                       | !skip [amount]                                          |
| [volume](#volume)         | 引数が渡された場合は音量を設定するか、現在の音量を表示します。               | !volume [volume]                                        |

### Other

| Command         | Description                                        | Usage                      |
| --------------- | -------------------------------------------------- | -------------------------- |
| [graph](#graph) | このサーバー上のさまざまな統計グラフを表示します。 | !graph \<type\> [from][to] |

<a name='addInvites'></a>

---

## !addInvites

メンバーに招待を追加(又は削除)します。

### Usage

```text
!addInvites <user> <amount> [reason]
```

### Aliases

- `!add-invites`

### Arguments

| Argument | Type                  | Required | Description                                                                       | Details |
| -------- | --------------------- | -------- | --------------------------------------------------------------------------------- | ------- |
| user     | [ユーザー](#ユーザー) | Yes      | そのユーザーはボーナスの招待数を受け取る、または失うでしょう。                    |         |
| amount   | [番号](#番号)         | Yes      | ユーザーが取得、又は失う可能性のある招待の数。招待を削除する場合は`-`を用います。 |         |
| reason   | [テキスト](#テキスト) | No       | 招待数を追加(又は削除)した理由。                                                  |         |

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

新しいランクを追加する。

### Usage

```text
!addRank <role> <invites> [info]
```

### Aliases

- `!add-rank`
- `!set-rank`
- `!setrank`

### Arguments

| Argument | Type                  | Required | Description                                            | Details |
| -------- | --------------------- | -------- | ------------------------------------------------------ | ------- |
| role     | [役職](#役職)         | Yes      | このランクに到達したときにユーザーが受け取る役職。     |         |
| invites  | [番号](#番号)         | Yes      | ランクに到達するために必要な招待の数。                 |         |
| info     | [テキスト](#テキスト) | No       | ユーザーがこのランクについて知るために表示される説明。 |         |

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

サーバーからメンバーを BAN します。

### Usage

```text
!ban [-d value|--deleteMessageDays=value] <user> [reason]
```

### Arguments

| Argument | Type                  | Required | Description                 | Details |
| -------- | --------------------- | -------- | --------------------------- | ------- |
| user     | [ユーザー](#ユーザー) | Yes      | ユーザーを BAN する。       |         |
| reason   | [テキスト](#テキスト) | No       | ユーザーが BAN された理由。 |         |

### Flags

| Flag                              | Short     | Type          | Description                                            |
| --------------------------------- | --------- | ------------- | ------------------------------------------------------ |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [番号](#番号) | BAN するユーザーのメッセージを指定した日数分削除します |

### Examples

<a name='botConfig'></a>

---

## !botConfig

BOT の設定を表示および変更します。

### Usage

```text
!botConfig [key] [value]
```

### Aliases

- `!bot-config`
- `!botsetting`
- `!bot-setting`

### Arguments

| Argument | Type              | Required | Description           | Details                                                                                                                             |
| -------- | ----------------- | -------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| key      | [列挙型](#列挙型) | No       | 表示/変更したい設定。 | 以下のいずれかの値を使用:`activityEnabled`, `activityMessage`, `activityStatus`, `activityType`, `activityUrl`, `embedDefaultColor` |
| value    | [値](#値)         | No       | 設定の新しい値        |                                                                                                                                     |

### Examples

```text
!botConfig
```

<a name='botInfo'></a>

---

## !botInfo

BOT に関する基本的な情報を入手してください。

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

指定したケースを削除します。

### Usage

```text
!caseDelete <caseNumber> [reason]
```

### Aliases

- `!case-delete`
- `!deletecase`
- `!delete-case`

### Arguments

| Argument   | Type                  | Required | Description              | Details |
| ---------- | --------------------- | -------- | ------------------------ | ------- |
| caseNumber | [番号](#番号)         | Yes      | ケース番号               |         |
| reason     | [テキスト](#テキスト) | No       | そのケースを削除した理由 |         |

### Examples

```text
!caseDelete 5434 User apologized
```

<a name='caseView'></a>

---

## !caseView

特定のケースに関する情報を表示します。

### Usage

```text
!caseView <caseNumber>
```

### Aliases

- `!case-view`
- `!viewcase`
- `!view-case`

### Arguments

| Argument   | Type          | Required | Description | Details |
| ---------- | ------------- | -------- | ----------- | ------- |
| caseNumber | [番号](#番号) | Yes      | ケース番号  |         |

### Examples

```text
!caseView 5434
```

<a name='check'></a>

---

## !check

ユーザーの違反と罰の回数を確認してください。

### Usage

```text
!check <user>
```

### Aliases

- `!history`

### Arguments

| Argument | Type                  | Required | Description          | Details |
| -------- | --------------------- | -------- | -------------------- | ------- |
| user     | [ユーザー](#ユーザー) | Yes      | ユーザーを確認する。 |         |

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

特定のチャットタイプを削除します。

### Usage

```text
!clean <type> [numberOfMessages]
```

### Aliases

- `!clear`

### Arguments

| Argument         | Type              | Required | Description              | Details                                                                                                    |
| ---------------- | ----------------- | -------- | ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| type             | [列挙型](#列挙型) | Yes      | 削除するメッセージの種類 | 以下のいずれかの値を使用:`bots`, `embeds`, `emojis`, `images`, `links`, `mentions`, `reacted`, `reactions` |
| numberOfMessages | [番号](#番号)     | No       | 削除されるメッセージの数 |                                                                                                            |

### Examples

<a name='cleanShort'></a>

---

## !cleanShort

短いメッセージを消去する

### Usage

```text
!cleanShort <maxTextLength> [numberOfMessages]
```

### Aliases

- `!clean-short`
- `!clearshort`
- `!clear-short`

### Arguments

| Argument         | Type          | Required | Description                                  | Details |
| ---------------- | ------------- | -------- | -------------------------------------------- | ------- |
| maxTextLength    | [番号](#番号) | Yes      | これより短いメッセージはすべて削除されます。 |         |
| numberOfMessages | [番号](#番号) | No       | 削除されるメッセージの数                     |         |

### Examples

<a name='cleanText'></a>

---

## !cleanText

指定のキーワードを含むメッセージを削除します。

### Usage

```text
!cleanText <text> [numberOfMessages]
```

### Aliases

- `!clean-text`
- `!cleartext`
- `!clear-text`

### Arguments

| Argument         | Type                  | Required | Description                                      | Details |
| ---------------- | --------------------- | -------- | ------------------------------------------------ | ------- |
| text             | [テキスト](#テキスト) | Yes      | この単語を含むすべてのメッセージが削除されます。 |         |
| numberOfMessages | [番号](#番号)         | No       | 検索されるメッセージの数                         |         |

### Examples

<a name='clearInvites'></a>

---

## !clearInvites

サーバー(ユーザー)の招待を削除します。

### Usage

```text
!clearInvites [-d value|--date=value] [-cb|--clearBonus] [user]
```

### Aliases

- `!clear-invites`

### Arguments

| Argument | Type                  | Required | Description                                                                | Details |
| -------- | --------------------- | -------- | -------------------------------------------------------------------------- | ------- |
| user     | [ユーザー](#ユーザー) | No       | 招待数をすべて削除する。省略された場合、すべてのメンバーが対象になります。 |         |

### Flags

| Flag                       | Short      | Type                  | Description                                                                                            |
| -------------------------- | ---------- | --------------------- | ------------------------------------------------------------------------------------------------------ |
| &#x2011;&#x2011;date       | &#x2011;d  | [日付](#日付)         | 招待の開始日を指定する必要があります。 デフォルトは今日です。                                          |
| &#x2011;&#x2011;clearBonus | &#x2011;cb | [ブール値](#ブール値) | これを追加すると、ボーナスの招待数もクリアされます。省略した場合、ボーナスの招待状はそのまま残ります。 |

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

サーバーの設定を表示および変更します。

### Usage

```text
!config [key] [value]
```

### Aliases

- `!c`

### Arguments

| Argument | Type              | Required | Description           | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------- | ----------------- | -------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key      | [列挙型](#列挙型) | No       | 表示/変更したい設定。 | 以下のいずれかの値を使用:`announcementVoice`, `announceNextSong`, `autoModAllCapsEnabled`, `autoModAllCapsMinCharacters`, `autoModAllCapsPercentageCaps`, `autoModDeleteBotMessage`, `autoModDeleteBotMessageTimeoutInSeconds`, `autoModDisabledForOldMembers`, `autoModDisabledForOldMembersThreshold`, `autoModDuplicateTextEnabled`, `autoModDuplicateTextTimeframeInSeconds`, `autoModEmojisEnabled`, `autoModEmojisMaxNumberOfEmojis`, `autoModEnabled`, `autoModHoistEnabled`, `autoModIgnoredChannels`, `autoModIgnoredRoles`, `autoModInvitesEnabled`, `autoModLinksBlacklist`, `autoModLinksEnabled`, `autoModLinksFollowRedirects`, `autoModLinksWhitelist`, `autoModLogEnabled`, `autoModMentionRolesEnabled`, `autoModMentionRolesMaxNumberOfMentions`, `autoModMentionUsersEnabled`, `autoModMentionUsersMaxNumberOfMentions`, `autoModModeratedChannels`, `autoModModeratedRoles`, `autoModQuickMessagesEnabled`, `autoModQuickMessagesNumberOfMessages`, `autoModQuickMessagesTimeframeInSeconds`, `autoModWordsBlacklist`, `autoModWordsEnabled`, `autoSubtractFakes`, `autoSubtractLeaves`, `autoSubtractLeaveThreshold`, `captchaVerificationFailedMessage`, `captchaVerificationLogEnabled`, `captchaVerificationOnJoin`, `captchaVerificationSuccessMessage`, `captchaVerificationTimeout`, `captchaVerificationWelcomeMessage`, `channels`, `defaultMusicPlatform`, `disabledMusicPlatforms`, `fadeMusicEndDelay`, `fadeMusicOnTalk`, `getUpdates`, `hideLeftMembersFromLeaderboard`, `ignoredChannels`, `joinMessage`, `joinMessageChannel`, `joinRoles`, `lang`, `leaderboardStyle`, `leaveMessage`, `leaveMessageChannel`, `logChannel`, `modLogChannel`, `modPunishmentBanDeleteMessage`, `modPunishmentKickDeleteMessage`, `modPunishmentMuteDeleteMessage`, `modPunishmentSoftbanDeleteMessage`, `modPunishmentWarnDeleteMessage`, `musicVolume`, `mutedRole`, `prefix`, `rankAnnouncementChannel`, `rankAnnouncementMessage`, `rankAssignmentStyle` |
| value    | [値](#値)         | No       | 設定の新しい値        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

### Examples

```text
!config
```

<a name='createInvite'></a>

---

## !createInvite

永久の招待コードを作成します。

### Usage

```text
!createInvite <name> [channel]
```

### Aliases

- `!create-invite`

### Arguments

| Argument | Type                      | Required | Description                                                                   | Details |
| -------- | ------------------------- | -------- | ----------------------------------------------------------------------------- | ------- |
| name     | [テキスト](#テキスト)     | Yes      | 招待リンクの名前。                                                            |         |
| channel  | [チャンネル](#チャンネル) | No       | 招待コードが作成されたチャンネル。 デフォルトで現在のチャンネルを使用します。 |         |

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

BOT の開発者と貢献者を表示します。

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

現在の音声チャンネルからボットを退出させます。

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

InviteManager のデータを csv シートにエクスポートします。

### Usage

```text
!export <type>
```

### Arguments

| Argument | Type              | Required | Description                | Details                                |
| -------- | ----------------- | -------- | -------------------------- | -------------------------------------- |
| type     | [列挙型](#列挙型) | Yes      | 必要なエクスポートの種類。 | 以下のいずれかの値を使用:`leaderboard` |

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

ボットへの招待リンクを入手できます。

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

このサーバー上のさまざまな統計グラフを表示します。

### Usage

```text
!graph <type> [from] [to]
```

### Aliases

- `!g`
- `!chart`

### Arguments

| Argument | Type              | Required | Description              | Details                                                      |
| -------- | ----------------- | -------- | ------------------------ | ------------------------------------------------------------ |
| type     | [列挙型](#列挙型) | Yes      | 表示するチャートの種類。 | 以下のいずれかの値を使用:`joins`, `joinsAndLeaves`, `leaves` |
| from     | [日付](#日付)     | No       | Start date of the chart  |                                                              |
| to       | [日付](#日付)     | No       | End date of the chart    |                                                              |

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

ヘルプを表示する。

### Usage

```text
!help [command]
```

### Arguments

| Argument | Type                  | Required | Description                        | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------- | --------------------- | -------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command  | [コマンド](#コマンド) | No       | 詳細情報を取得するためのコマンド。 | 以下のいずれかの値を使用:`addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lockdown`, `lyrics`, `mashup`, `memberConfig`, `members`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |

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

特定のメンバーに関する情報を表示します。

### Usage

```text
!info <user> [details] [page]
```

### Aliases

- `!showinfo`

### Arguments

| Argument | Type                  | Required | Description                                                             | Details                                     |
| -------- | --------------------- | -------- | ----------------------------------------------------------------------- | ------------------------------------------- |
| user     | [ユーザー](#ユーザー) | Yes      | 追加情報を見たいユーザー。                                              |                                             |
| details  | [列挙型](#列挙型)     | No       | メンバーに関する特定の詳細のみを要求します。                            | 以下のいずれかの値を使用:`bonus`, `members` |
| page     | [番号](#番号)         | No       | 表示する詳細のどのページ。 リアクションを使って移動することもできます。 |                                             |

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

対話型の設定

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

サーバーの招待リンクの設定を表示、変更します。

### Usage

```text
!inviteCodeConfig [key] [inviteCode] [value]
```

### Aliases

- `!invite-code-config`
- `!icc`

### Arguments

| Argument   | Type                      | Required | Description                  | Details                                  |
| ---------- | ------------------------- | -------- | ---------------------------- | ---------------------------------------- |
| key        | [列挙型](#列挙型)         | No       | 表示/変更したい設定。        | 以下のいずれかの値を使用:`name`, `roles` |
| inviteCode | [招待コード](#招待コード) | No       | 招待リンクの設定を変更する。 |                                          |
| value      | [値](#値)                 | No       | 新しい設定値                 |                                          |

### Examples

```text
!inviteCodeConfig
```

<a name='inviteCodes'></a>

---

## !inviteCodes

すべての招待コードの一覧を取得する

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

招待状の送信元に関する詳細が表示されます。

### Usage

```text
!inviteDetails [user]
```

### Aliases

- `!invite-details`

### Arguments

| Argument | Type                  | Required | Description                    | Details |
| -------- | --------------------- | -------- | ------------------------------ | ------- |
| user     | [ユーザー](#ユーザー) | No       | 詳細な招待状を見たいユーザー。 |         |

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

| Argument | Type                  | Required | Description                      | Details |
| -------- | --------------------- | -------- | -------------------------------- | ------- |
| user     | [ユーザー](#ユーザー) | No       | 表示したいユーザーを招待します。 |         |

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

サーバーからメンバーを蹴ります。

### Usage

```text
!kick <member> [reason]
```

### Arguments

| Argument | Type                  | Required | Description            | Details |
| -------- | --------------------- | -------- | ---------------------- | ------- |
| member   | [メンバー](#メンバー) | Yes      | メンバーをキックする   |         |
| reason   | [テキスト](#テキスト) | No       | メンバーが蹴られた理由 |         |

### Examples

<a name='leaderboard'></a>

---

## !leaderboard

招待が最も多いメンバーを表示します。

### Usage

```text
!leaderboard [page]
```

### Aliases

- `!top`

### Arguments

| Argument | Type          | Required | Description                              | Details |
| -------- | ------------- | -------- | ---------------------------------------- | ------- |
| page     | [番号](#番号) | No       | リーダーボードのどのページを取得するか。 |         |

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

| Argument | Type                      | Required | Description                             | Details |
| -------- | ------------------------- | -------- | --------------------------------------- | ------- |
| channel  | [チャンネル](#チャンネル) | No       | The channel that you want to lock down. |         |

### Flags

| Flag                    | Short     | Type          | Description                                                                                                  |
| ----------------------- | --------- | ------------- | ------------------------------------------------------------------------------------------------------------ |
| &#x2011;&#x2011;timeout | &#x2011;t | [期間](#期間) | The timeout after which the lockdown automatically ends. Run the command again to end the lockdown manually. |

### Examples

```text
!lockdown
```

<a name='lyrics'></a>

---

## !lyrics

現在再生中の曲の歌詞を表示します。

### Usage

```text
!lyrics [-l|--live]
```

### Flags

| Flag                 | Short     | Type                  | Description                                      |
| -------------------- | --------- | --------------------- | ------------------------------------------------ |
| &#x2011;&#x2011;live | &#x2011;l | [ブール値](#ブール値) | 設定すると、歌詞はその曲の現在時刻と同期します。 |

### Examples

```text
!lyrics
```

<a name='mashup'></a>

---

## !mashup

2 つの曲のマッシュアップを作成します。

### Usage

```text
!mashup <videos>
```

### Arguments

| Argument | Type                  | Required | Description                                    | Details |
| -------- | --------------------- | -------- | ---------------------------------------------- | ------- |
| videos   | [テキスト](#テキスト) | Yes      | ビデオを一緒にマッシュアップする必要があります |         |

### Examples

<a name='memberConfig'></a>

---

## !memberConfig

サーバーのメンバーの設定を表示および変更します。

### Usage

```text
!memberConfig [key] [user] [value]
```

### Aliases

- `!member-config`
- `!memconf`
- `!mc`

### Arguments

| Argument | Type                  | Required | Description                       | Details                                        |
| -------- | --------------------- | -------- | --------------------------------- | ---------------------------------------------- |
| key      | [列挙型](#列挙型)     | No       | 表示/変更したいメンバー構成設定。 | 以下のいずれかの値を使用:`hideFromLeaderboard` |
| user     | [ユーザー](#ユーザー) | No       | 設定が表示/変更されたメンバー。   |                                                |
| value    | [値](#値)             | No       | 設定の新しい値                    |                                                |

### Examples

```text
!memberConfig
```

<a name='members'></a>

---

## !members

現在のサーバーのメンバー数を表示します。

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

ユーザーをミュートする

### Usage

```text
!mute [-d value|--duration=value] <user> [reason]
```

### Arguments

| Argument | Type                  | Required | Description                          | Details |
| -------- | --------------------- | -------- | ------------------------------------ | ------- |
| user     | [メンバー](#メンバー) | Yes      | ミュートする必要があるユーザー。     |         |
| reason   | [テキスト](#テキスト) | No       | このユーザーがミュートされている理由 |         |

### Flags

| Flag                     | Short     | Type          | Description                       |
| ------------------------ | --------- | ------------- | --------------------------------- |
| &#x2011;&#x2011;duration | &#x2011;d | [期間](#期間) | The duration to mute the user for |

### Examples

<a name='nowPlaying'></a>

---

## !nowPlaying

現在再生されている曲の情報を表示しています。

### Usage

```text
!nowPlaying [-p|--pin]
```

### Aliases

- `!np`
- `!now-playing`

### Flags

| Flag                | Short     | Type                  | Description                                                                      |
| ------------------- | --------- | --------------------- | -------------------------------------------------------------------------------- |
| &#x2011;&#x2011;pin | &#x2011;p | [ブール値](#ブール値) | 現在再生中のメッセージを固定して、新しい曲が再生されるたびに自動的に更新します。 |

### Examples

```text
!nowPlaying
```

<a name='pause'></a>

---

## !pause

現在の曲を一時停止します。

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

コマンドを使用するための権限を設定します。

### Usage

```text
!permissions [cmd] [role]
```

### Aliases

- `!perms`

### Arguments

| Argument | Type                  | Required | Description                                    | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------- | --------------------- | -------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cmd      | [コマンド](#コマンド) | No       | 権限を設定するためのコマンド。                 | 以下のいずれかの値を使用:`addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lockdown`, `lyrics`, `mashup`, `memberConfig`, `members`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |
| role     | [役職](#役職)         | No       | コマンドへのアクセスを許可または拒否する役職。 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

### Examples

```text
!permissions
```

<a name='ping'></a>

---

## !ping

ボットをピング

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

キューが空の場合は曲を再生し、それ以外の場合はキューの最後に曲を追加します。

### Usage

```text
!play [-p value|--platform=value] [-n|--next] <link>
```

### Aliases

- `!p`

### Arguments

| Argument | Type                  | Required | Description                      | Details |
| -------- | --------------------- | -------- | -------------------------------- | ------- |
| link     | [テキスト](#テキスト) | Yes      | 特定の曲または検索語へのリンク。 |         |

### Flags

| Flag                     | Short     | Type                  | Description                                                                    |
| ------------------------ | --------- | --------------------- | ------------------------------------------------------------------------------ |
| &#x2011;&#x2011;platform | &#x2011;p | [列挙型](#列挙型)     | 曲を再生するプラットフォームを選択してください。                               |
| &#x2011;&#x2011;next     | &#x2011;n | [ブール値](#ブール値) | 設定されている場合、キューの最後に追加するのではなく、次にこの曲を再生します。 |

### Examples

<a name='prefix'></a>

---

## !prefix

ボットの現在のプレフィックスを表示します。

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

InviteManager のプレミアムバージョンに関する情報。

### Usage

```text
!premium [action]
```

### Aliases

- `!patreon`
- `!donate`

### Arguments

| Argument | Type              | Required | Description                                                                                                                                             | Details                                                    |
| -------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| action   | [列挙型](#列挙型) | No       | プレミアム情報はありません。 あなたのプレミアムステータスをチェックするために `check`。 このサーバーにプレミアムを使用するには `activate`してください。 | 以下のいずれかの値を使用:`Activate`, `Check`, `Deactivate` |

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

一定量の警告に達したときに罰を設定します。

### Usage

```text
!punishmentConfig [punishment] [strikes] [args]
```

### Aliases

- `!punishment-config`

### Arguments

| Argument   | Type                  | Required | Description                        | Details                                                           |
| ---------- | --------------------- | -------- | ---------------------------------- | ----------------------------------------------------------------- |
| punishment | [列挙型](#列挙型)     | No       | 使用する罰の種類                   | 以下のいずれかの値を使用:`ban`, `kick`, `mute`, `softban`, `warn` |
| strikes    | [番号](#番号)         | No       | この罰が適用されるための警告の数。 |                                                                   |
| args       | [テキスト](#テキスト) | No       | 議論は罰に渡された。               |                                                                   |

### Examples

```text
!punishmentConfig
```

<a name='purge'></a>

---

## !purge

チャネル内のメッセージを削除します。

### Usage

```text
!purge <quantity> [user]
```

### Aliases

- `!prune`

### Arguments

| Argument | Type                  | Required | Description                            | Details |
| -------- | --------------------- | -------- | -------------------------------------- | ------- |
| quantity | [番号](#番号)         | Yes      | 削除するメッセージ数。                 |         |
| user     | [ユーザー](#ユーザー) | No       | ユーザーのメッセージは削除されました。 |         |

### Examples

<a name='purgeUntil'></a>

---

## !purgeUntil

指定されたメッセージまでチャネル内のメッセージを削除します。

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

| Argument  | Type                  | Required | Description                            | Details |
| --------- | --------------------- | -------- | -------------------------------------- | ------- |
| messageID | [テキスト](#テキスト) | Yes      | 最後のメッセージ ID は削除されました。 |         |

### Examples

<a name='queue'></a>

---

## !queue

キュー内の曲を表示します。

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

すべてのランクを見る

### Usage

```text
!ranks [page]
```

### Aliases

- `!show-ranks`
- `!showranks`

### Arguments

| Argument | Type          | Required | Description                         | Details |
| -------- | ------------- | -------- | ----------------------------------- | ------- |
| page     | [番号](#番号) | No       | The page of the ranks list to show. |         |

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
| user     | [ユーザー](#ユーザー) | Yes      | The user to remove the invites from. |         |
| amount   | [番号](#番号)         | Yes      | The amount of invites to remove.     |         |
| reason   | [テキスト](#テキスト) | No       | The reason for removing the invites. |         |

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

ランクを外します。

### Usage

```text
!removeRank <rank>
```

### Aliases

- `!remove-rank`

### Arguments

| Argument | Type          | Required | Description                  | Details |
| -------- | ------------- | -------- | ---------------------------- | ------- |
| rank     | [役職](#役職) | Yes      | ランクを削除したい対象です。 |         |

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

繰り返し再生する曲を設定します。

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

以前にクリアした招待状をすべて復元します。

### Usage

```text
!restoreInvites [user]
```

### Aliases

- `!restore-invites`
- `!unclear-invites`
- `!unclearinvites`

### Arguments

| Argument | Type                  | Required | Description                                                                           | Details |
| -------- | --------------------- | -------- | ------------------------------------------------------------------------------------- | ------- |
| user     | [ユーザー](#ユーザー) | No       | ユーザーのすべての招待を復元する。 省略すると、すべてのユーザーの招待が復元されます。 |         |

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

現在の曲を再開します。

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

曲を巻き戻して最初から始めます。

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

検索語を検索して、結果の 1 つを選択させます。

### Usage

```text
!search [-p value|--platform=value] <search>
```

### Arguments

| Argument | Type                  | Required | Description | Details |
| -------- | --------------------- | -------- | ----------- | ------- |
| search   | [テキスト](#テキスト) | Yes      | 検索語      |         |

### Flags

| Flag                     | Short     | Type              | Description                                      |
| ------------------------ | --------- | ----------------- | ------------------------------------------------ |
| &#x2011;&#x2011;platform | &#x2011;p | [列挙型](#列挙型) | 曲を再生するプラットフォームを選択してください。 |

### Examples

<a name='seek'></a>

---

## !seek

曲の特定の部分にスキップします。

### Usage

```text
!seek [duration]
```

### Arguments

| Argument | Type          | Required | Description                              | Details |
| -------- | ------------- | -------- | ---------------------------------------- | ------- |
| duration | [番号](#番号) | No       | 曲がスキップされる位置（最初から秒単位） |         |

### Examples

```text
!seek
```

<a name='setup'></a>

---

## !setup

ボットの設定や問題の確認（権限の不足など）を手助けする

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

現在の曲をスキップして、キュー内の次の曲を再生します。

### Usage

```text
!skip [amount]
```

### Aliases

- `!next`

### Arguments

| Argument | Type          | Required | Description                    | Details |
| -------- | ------------- | -------- | ------------------------------ | ------- |
| amount   | [番号](#番号) | No       | いくつの曲がスキップされます。 |         |

### Examples

```text
!skip
```

<a name='softBan'></a>

---

## !softBan

サーバーからメンバーを BAN してから自動的に BAN 解除します。

### Usage

```text
!softBan [-d value|--deleteMessageDays=value] <user> [reason]
```

### Aliases

- `!soft-ban`

### Arguments

| Argument | Type                  | Required | Description               | Details |
| -------- | --------------------- | -------- | ------------------------- | ------- |
| user     | [メンバー](#メンバー) | Yes      | メンバーを BAN する       |         |
| reason   | [テキスト](#テキスト) | No       | ユーザーが BAN された理由 |         |

### Flags

| Flag                              | Short     | Type          | Description                                        |
| --------------------------------- | --------- | ------------- | -------------------------------------------------- |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [番号](#番号) | Delete messages from the user this many days back. |

### Examples

<a name='strike'></a>

---

## !strike

ユーザーにストライクを追加する

### Usage

```text
!strike <member> <type> <amount>
```

### Arguments

| Argument | Type                  | Required | Description                        | Details                                                                                                                                              |
| -------- | --------------------- | -------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| member   | [メンバー](#メンバー) | Yes      | メンバーがストライキを受けました。 |                                                                                                                                                      |
| type     | [列挙型](#列挙型)     | Yes      | 違反の種類                         | 以下のいずれかの値を使用:`allCaps`, `duplicateText`, `emojis`, `hoist`, `invites`, `links`, `mentionRoles`, `mentionUsers`, `quickMessages`, `words` |
| amount   | [番号](#番号)         | Yes      | 追加するストライクの量             |                                                                                                                                                      |

### Examples

<a name='strikeConfig'></a>

---

## !strikeConfig

さまざまな違反に対して受け取った警告を設定します。

### Usage

```text
!strikeConfig [violation] [strikes]
```

### Aliases

- `!strike-config`

### Arguments

| Argument  | Type              | Required | Description  | Details                                                                                                                                              |
| --------- | ----------------- | -------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| violation | [列挙型](#列挙型) | No       | 違反のタイプ | 以下のいずれかの値を使用:`allCaps`, `duplicateText`, `emojis`, `hoist`, `invites`, `links`, `mentionRoles`, `mentionUsers`, `quickMessages`, `words` |
| strikes   | [番号](#番号)     | No       | 警告の数     |                                                                                                                                                      |

### Examples

```text
!strikeConfig
```

<a name='subtractFakes'></a>

---

## !subtractFakes

すべてのユーザーから偽の招待を削除します。

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

すべてのユーザーの退出履歴を削除します。

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

サポートサーバーへの招待リンクを入手してください。

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

プレミアム版の InviteManager を期間限定で無料でお試しください。

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

ユーザーの BAN を解除する

### Usage

```text
!unban <user> [reason]
```

### Arguments

| Argument | Type                  | Required | Description                           | Details |
| -------- | --------------------- | -------- | ------------------------------------- | ------- |
| user     | [ユーザー](#ユーザー) | Yes      | BAN を解除すべきユーザー。            |         |
| reason   | [テキスト](#テキスト) | No       | このユーザーの BAN が解除された理由。 |         |

### Examples

<a name='unhoist'></a>

---

## !unhoist

すべてのメンバーの前にその名前の前に特殊文字を付けて文字を追加すると、メンバーリストの最後にそれらが表示されます。

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

ユーザーのミュートを解除する

### Usage

```text
!unmute <user>
```

### Arguments

| Argument | Type                  | Required | Description                            | Details |
| -------- | --------------------- | -------- | -------------------------------------- | ------- |
| user     | [メンバー](#メンバー) | Yes      | ミュートを解除する必要があるユーザー。 |         |

### Examples

<a name='volume'></a>

---

## !volume

引数が渡された場合は音量を設定するか、現在の音量を表示します。

### Usage

```text
!volume [volume]
```

### Arguments

| Argument | Type          | Required | Description          | Details |
| -------- | ------------- | -------- | -------------------- | ------- |
| volume   | [番号](#番号) | No       | 音量が設定される値。 |         |

### Examples

```text
!volume
```

<a name='warn'></a>

---

## !warn

メンバーに警告する

### Usage

```text
!warn <member> [reason]
```

### Arguments

| Argument | Type                  | Required | Description                | Details |
| -------- | --------------------- | -------- | -------------------------- | ------- |
| member   | [メンバー](#メンバー) | Yes      | メンバーに警告する         |         |
| reason   | [テキスト](#テキスト) | No       | メンバーが警告された理由。 |         |

### Examples
