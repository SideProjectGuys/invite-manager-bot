# Commands

To get a list of available commands, do !help on your server.

## Overview

### Invites

| Command                                 | Description                                      | Usage                                       |
| --------------------------------------- | ------------------------------------------------ | ------------------------------------------- |
| [addInvites](#addInvites)               | Adds/Removes invites to/from a member.           | !addInvites \<user\> \<amount\> [reason]    |
| [clearInvites](#clearInvites)           | Clear invites of the server/a user.              | !clearInvites [-d value                     | --date=value] [-cb | --clearBonus] [user] |
| [createInvite](#createInvite)           | Creates unique invite codes.                     | !createInvite \<name\> [channel]            |
| [fake](#fake)                           | Help find users trying to cheat.                 | !fake [page]                                |
| [info](#info)                           | Show info about a specific member.               | !info \<user\> [details][page]              |
| [inviteCodes](#inviteCodes)             | Get a list of all your invite codes              | !inviteCodes                                |
| [inviteDetails](#inviteDetails)         | Shows details about where your invites are from. | !inviteDetails [user]                       |
| [invites](#invites)                     | Show personal invites.                           | !invites [user]                             |
| [leaderboard](#leaderboard)             | Show members with most invites.                  | !leaderboard [-c value                      | --compare=value] [duration][page] |
| [legacyInvites](#legacyInvites)         | cmd.legacyInvites.self.description               | !legacyInvites [user]                       |
| [legacyLeaderboard](#legacyLeaderboard) | cmd.legacyLeaderboard.self.description           | !legacyLeaderboard [page][date]             |
| [removeInvites](#removeInvites)         | cmd.removeInvites.self.description               | !removeInvites \<user\> \<amount\> [reason] |
| [restoreInvites](#restoreInvites)       | Restore all previously cleared invites.          | !restoreInvites [user]                      |
| [subtractFakes](#subtractFakes)         | Remove fake invites from all users.              | !subtractFakes                              |
| [subtractLeaves](#subtractLeaves)       | Remove leaves from all users                     | !subtractLeaves                             |

### Ranks

| Command                   | Description     | Usage                                |
| ------------------------- | --------------- | ------------------------------------ |
| [addRank](#addRank)       | Add a new rank. | !addRank \<role\> \<invites\> [info] |
| [ranks](#ranks)           | Show all ranks. | !ranks                               |
| [removeRank](#removeRank) | Remove a rank.  | !removeRank [rank]                   |

### Config

| Command                                 | Description                                               | Usage                                       |
| --------------------------------------- | --------------------------------------------------------- | ------------------------------------------- |
| [botConfig](#botConfig)                 | Show and change the config of the bot.                    | !botConfig [key][value]                     |
| [config](#config)                       | Show and change the config of the server.                 | !config [key][value]                        |
| [interactiveConfig](#interactiveConfig) | cmd.interactiveConfig.self.description                    | !interactiveConfig                          |
| [inviteCodeConfig](#inviteCodeConfig)   | Show and change the config of invite codes of the server. | !inviteCodeConfig [key][invitecode] [value] |
| [memberConfig](#memberConfig)           | Show and change the config of members of the server.      | !memberConfig [key][user] [value]           |
| [permissions](#permissions)             | Configure permissions to use commands.                    | !permissions [cmd][role]                    |

### Info

| Command             | Description                                                                       | Usage           |
| ------------------- | --------------------------------------------------------------------------------- | --------------- |
| [botInfo](#botInfo) | Get general information about the bot.                                            | !botInfo        |
| [credits](#credits) | cmd.credits.self.description                                                      | !credits        |
| [getBot](#getBot)   | Get an invite link for the bot.                                                   | !getBot         |
| [help](#help)       | Display help.                                                                     | !help [command] |
| [members](#members) | Show member count of current server.                                              | !members        |
| [ping](#ping)       | cmd.ping.self.description                                                         | !ping           |
| [prefix](#prefix)   | Shows the current prefix of the bot.                                              | !prefix         |
| [setup](#setup)     | Help with setting up the bot and checking for problems (e.g. missing permissions) | !setup          |
| [support](#support) | Get an invite link to our support server.                                         | !support        |

### Premium

| Command                   | Description                                                               | Usage             |
| ------------------------- | ------------------------------------------------------------------------- | ----------------- |
| [export](#export)         | Export data of InviteManager to a csv sheet.                              | !export \<type\>  |
| [premium](#premium)       | Info about premium version of InviteManager.                              | !premium [action] |
| [tryPremium](#tryPremium) | Try the premium version of InviteManager for free for a limited duration. | !tryPremium       |

### Moderation

| Command                               | Description                                                      | Usage                                            |
| ------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------ |
| [ban](#ban)                           | Ban a member from the server.                                    | !ban [-d value                                   | --deleteMessageDays=value] \<user\> [reason] |
| [caseDelete](#caseDelete)             | cmd.caseDelete.self.description                                  | !caseDelete \<caseNumber\> [reason]              |
| [caseView](#caseView)                 | cmd.caseView.self.description                                    | !caseView \<caseNumber\>                         |
| [check](#check)                       | Check violation and punishment history of a user.                | !check \<user\>                                  |
| [clean](#clean)                       | Clean a channel of certain message types.                        | !clean \<type\> [numberOfMessages]               |
| [cleanShort](#cleanShort)             | Clear short messages                                             | !cleanShort \<maxTextLength\> [numberOfMessages] |
| [cleanText](#cleanText)               | cmd.cleanText.self.description                                   | !cleanText \<text\> [numberOfMessages]           |
| [kick](#kick)                         | Kick a member from the server.                                   | !kick \<member\> [reason]                        |
| [mute](#mute)                         | cmd.mute.self.description                                        | !mute \<user\> [reason]                          |
| [punishmentConfig](#punishmentConfig) | Configure punishments when reaching a certain amount of strikes. | !punishmentConfig [punishment][strikes] [args]   |
| [purgeUntil](#purgeUntil)             | Purge messages in a channel up until a specified message.        | !purgeUntil \<messageID\>                        |
| [softBan](#softBan)                   | Ban and then automatically unban a member from the server.       | !softBan [-d value                               | --deleteMessageDays=value] \<user\> [reason] |
| [strike](#strike)                     | cmd.strike.self.description                                      | !strike \<member\> \<type\> \<amount\>           |
| [strikeConfig](#strikeConfig)         | Configure strikes received for various violations.               | !strikeConfig [violation][strikes]               |
| [unban](#unban)                       | cmd.unban.self.description                                       | !unban \<user\> [reason]                         |
| [unhoist](#unhoist)                   | cmd.unhoist.self.description                                     | !unhoist                                         |
| [unmute](#unmute)                     | cmd.unmute.self.description                                      | !unmute \<user\>                                 |
| [warn](#warn)                         | Warn a member.                                                   | !warn \<member\> [reason]                        |

### Other

| Command                             | Description                                                  | Usage                      |
| ----------------------------------- | ------------------------------------------------------------ | -------------------------- |
| [graph](#graph)                     | Shows graphs about various stats on this server.             | !graph \<type\> [duration] |
| [makeMentionable](#makeMentionable) | Make a role mentionable for 60 seconds or until it was used. | !makeMentionable \<role\>  |
| [mentionRole](#mentionRole)         | Mention an unmentionable role.                               | !mentionRole \<role\>      |

<a href='#addInvites'></a>

## cmd.addInvites.self.title

Adds/Removes invites to/from a member.

### Usage

!addInvites \<user\> \<amount\> [reason]

### Arguments

**\<user\>**
The user that will receive/lose the bonus invites.

**\<amount\>**
The amount of invites the user will get/lose. Use a negative (-) number to remove invites.

**\<reason\>**
The reason for adding/removing the invites.

<a href='#addRank'></a>

## cmd.addRank.self.title

Add a new rank.

### Usage

!addRank \<role\> \<invites\> [info]

### Arguments

**\<role\>**
The role which the user will receive when reaching this rank.

**\<invites\>**
The amount of invites needed to reach the rank.

**\<info\>**
A description that users will see so they know more about this rank.

<a href='#ban'></a>

## cmd.ban.self.title

Ban a member from the server.

### Usage

!ban [-d value|--deleteMessageDays=value] \<user\> [reason]

### Arguments

**--deleteMessageDays**
cmd.ban.self.flags.deleteMessageDays

**\<user\>**
User to ban.

**\<reason\>**
Why was the user banned.

<a href='#botConfig'></a>

## cmd.botConfig.self.title

Show and change the config of the bot.

### Usage

!botConfig [key][value]

### Arguments

**\<key\>**
The bot config setting which you want to show/change.
Use one of the following values: activityStatus, activityEnabled, activityType, activityMessage, activityUrl, embedDefaultColor

**\<value\>**
The new value of the setting.

<a href='#botInfo'></a>

## cmd.botInfo.self.title

Get general information about the bot.

### Usage

!botInfo

### Arguments

<a href='#caseDelete'></a>

## cmd.caseDelete.self.title

cmd.caseDelete.self.description

### Usage

!caseDelete \<caseNumber\> [reason]

### Arguments

**\<caseNumber\>**
cmd.caseDelete.self.args.caseNumber

**\<reason\>**
cmd.caseDelete.self.args.reason

<a href='#caseView'></a>

## cmd.caseView.self.title

cmd.caseView.self.description

### Usage

!caseView \<caseNumber\>

### Arguments

**\<caseNumber\>**
cmd.caseView.self.args.caseNumber

<a href='#check'></a>

## cmd.check.self.title

Check violation and punishment history of a user.

### Usage

!check \<user\>

### Arguments

**\<user\>**
User to check.

<a href='#clean'></a>

## cmd.clean.self.title

Clean a channel of certain message types.

### Usage

!clean \<type\> [numberOfMessages]

### Arguments

**\<type\>**
The type of messages that will be deleted.
Use one of the following values: images, links, mentions, bots, embeds, emojis, reacted, reactions

**\<numberOfMessages\>**
Number of messages that will be searched.

<a href='#cleanShort'></a>

## cmd.cleanShort.self.title

Clear short messages

### Usage

!cleanShort \<maxTextLength\> [numberOfMessages]

### Arguments

**\<maxTextLength\>**
All messages shorter than this will be deleted.

**\<numberOfMessages\>**
Number of messages that will be searched.

<a href='#cleanText'></a>

## cmd.cleanText.self.title

cmd.cleanText.self.description

### Usage

!cleanText \<text\> [numberOfMessages]

### Arguments

**\<text\>**
All messages containing this word will be deleted.

**\<numberOfMessages\>**
Number of messages that will be searched.

<a href='#clearInvites'></a>

## cmd.clearInvites.self.title

Clear invites of the server/a user.

### Usage

!clearInvites [-d value|--date=value][-cb|--clearbonus] [user]

### Arguments

**--date**
The date start at which invites should be counted. Default is today.

**--clearBonus**
Add this flag to clear bonus invites aswell. Otherwise bonus invites are left untouched.

**\<user\>**
The user to clear all invites from. If omitted clears all users.

<a href='#config'></a>

## cmd.config.self.title

Show and change the config of the server.

### Usage

!config [key][value]

### Arguments

**\<key\>**
The config setting which you want to show/change.
Use one of the following values: prefix, lang, getUpdates, logChannel, channels, ignoredChannels, joinMessage, joinMessageChannel, leaveMessage, leaveMessageChannel, leaderboardStyle, hideLeftMembersFromLeaderboard, autoSubtractFakes, autoSubtractLeaves, autoSubtractLeaveThreshold, rankAssignmentStyle, rankAnnouncementChannel, rankAnnouncementMessage, mutedRole, captchaVerificationOnJoin, captchaVerificationWelcomeMessage, captchaVerificationSuccessMessage, captchaVerificationFailedMessage, captchaVerificationTimeout, captchaVerificationLogEnabled, modLogChannel, modPunishmentBanDeleteMessage, modPunishmentKickDeleteMessage, modPunishmentSoftbanDeleteMessage, modPunishmentWarnDeleteMessage, modPunishmentMuteDeleteMessage, autoModEnabled, autoModModeratedChannels, autoModModeratedRoles, autoModIgnoredChannels, autoModIgnoredRoles, autoModDeleteBotMessage, autoModDeleteBotMessageTimeoutInSeconds, autoModLogEnabled, autoModDisabledForOldMembers, autoModDisabledForOldMembersThreshold, autoModInvitesEnabled, autoModLinksEnabled, autoModLinksWhitelist, autoModLinksBlacklist, autoModLinksFollowRedirects, autoModWordsEnabled, autoModWordsBlacklist, autoModAllCapsEnabled, autoModAllCapsMinCharacters, autoModAllCapsPercentageCaps, autoModDuplicateTextEnabled, autoModDuplicateTextTimeframeInSeconds, autoModQuickMessagesEnabled, autoModQuickMessagesNumberOfMessages, autoModQuickMessagesTimeframeInSeconds, autoModMentionUsersEnabled, autoModMentionUsersMaxNumberOfMentions, autoModMentionRolesEnabled, autoModMentionRolesMaxNumberOfMentions, autoModEmojisEnabled, autoModEmojisMaxNumberOfEmojis, autoModHoistEnabled

**\<value\>**
The new value of the setting.

<a href='#createInvite'></a>

## cmd.createInvite.self.title

Creates unique invite codes.

### Usage

!createInvite \<name\> [channel]

### Arguments

**\<name\>**
The name of the invite code.

**\<channel\>**
The channel for which the invite code is created. Uses the current channel by default.

<a href='#credits'></a>

## cmd.credits.self.title

cmd.credits.self.description

### Usage

!credits

### Arguments

<a href='#export'></a>

## cmd.export.self.title

Export data of InviteManager to a csv sheet.

### Usage

!export \<type\>

### Arguments

**\<type\>**
The type of export you want.
Use one of the following values: leaderboard

<a href='#fake'></a>

## cmd.fake.self.title

Help find users trying to cheat.

### Usage

!fake [page]

### Arguments

**\<page\>**
Which page of the fake list to get.

<a href='#getBot'></a>

## cmd.getBot.self.title

Get an invite link for the bot.

### Usage

!getBot

### Arguments

<a href='#graph'></a>

## cmd.graph.self.title

Shows graphs about various stats on this server.

### Usage

!graph \<type\> [duration]

### Arguments

**\<type\>**
The type of chart to display.
Use one of the following values: joins, leaves, usage

**\<duration\>**
The duration period for the chart.

<a href='#help'></a>

## cmd.help.self.title

Display help.

### Usage

!help [command]

### Arguments

**\<command\>**
The command to get detailed information for.

<a href='#info'></a>

## cmd.info.self.title

Show info about a specific member.

### Usage

!info \<user\> [details][page]

### Arguments

**\<user\>**
The user for whom you want to see additional info.

**\<details\>**
Request only specific details about a member.
Use one of the following values: bonus, members

**\<page\>**
What page of the details to show. You can also use the reactions to navigate.

<a href='#interactiveConfig'></a>

## cmd.interactiveConfig.self.title

cmd.interactiveConfig.self.description

### Usage

!interactiveConfig

### Arguments

<a href='#inviteCodeConfig'></a>

## cmd.inviteCodeConfig.self.title

Show and change the config of invite codes of the server.

### Usage

!inviteCodeConfig [key][invitecode] [value]

### Arguments

**\<key\>**
The config setting which you want to show/change.
Use one of the following values: name, roles

**\<inviteCode\>**
The invite code for which you want to change the settings.

**\<value\>**
The new value of the setting.

<a href='#inviteCodes'></a>

## cmd.inviteCodes.self.title

Get a list of all your invite codes

### Usage

!inviteCodes

### Arguments

<a href='#inviteDetails'></a>

## cmd.inviteDetails.self.title

Shows details about where your invites are from.

### Usage

!inviteDetails [user]

### Arguments

**\<user\>**
The user for whom you want to show detailed invites.

<a href='#invites'></a>

## cmd.invites.self.title

Show personal invites.

### Usage

!invites [user]

### Arguments

**\<user\>**
The user for whom you want to show invites.

<a href='#kick'></a>

## cmd.kick.self.title

Kick a member from the server.

### Usage

!kick \<member\> [reason]

### Arguments

**\<member\>**
Member to kick.

**\<reason\>**
Why the member was kicked.

<a href='#leaderboard'></a>

## cmd.leaderboard.self.title

Show members with most invites.

### Usage

!leaderboard [-c value|--compare=value][duration] [page]

### Arguments

**--compare**
The date to which the current leaderboard standings are compared to

**\<duration\>**
The duration for which to calculate the leaderboard.

**\<page\>**
Which page of the leaderboard to get.

<a href='#legacyInvites'></a>

## cmd.legacyInvites.self.title

cmd.legacyInvites.self.description

### Usage

!legacyInvites [user]

### Arguments

**\<user\>**
cmd.legacyInvites.self.args.user

<a href='#legacyLeaderboard'></a>

## cmd.legacyLeaderboard.self.title

cmd.legacyLeaderboard.self.description

### Usage

!legacyLeaderboard [page][date]

### Arguments

**\<page\>**
cmd.legacyLeaderboard.self.args.page

**\<date\>**
cmd.legacyLeaderboard.self.args.date

<a href='#makeMentionable'></a>

## cmd.makeMentionable.self.title

Make a role mentionable for 60 seconds or until it was used.

### Usage

!makeMentionable \<role\>

### Arguments

**\<role\>**
The role that you want to mention.

<a href='#memberConfig'></a>

## cmd.memberConfig.self.title

Show and change the config of members of the server.

### Usage

!memberConfig [key][user] [value]

### Arguments

**\<key\>**
The member config setting which you want to show/change.
Use one of the following values: hideFromLeaderboard

**\<user\>**
The member that the setting is shown/changed for.

**\<value\>**
The new value of the setting.

<a href='#members'></a>

## cmd.members.self.title

Show member count of current server.

### Usage

!members

### Arguments

<a href='#mentionRole'></a>

## cmd.mentionRole.self.title

Mention an unmentionable role.

### Usage

!mentionRole \<role\>

### Arguments

**\<role\>**
The role that you want to mention.

<a href='#mute'></a>

## cmd.mute.self.title

cmd.mute.self.description

### Usage

!mute \<user\> [reason]

### Arguments

**\<user\>**
The user that should be muted.

**\<reason\>**
The reason why this user is muted.

<a href='#permissions'></a>

## cmd.permissions.self.title

Configure permissions to use commands.

### Usage

!permissions [cmd][role]

### Arguments

**\<cmd\>**
The command to configure permissions for.

**\<role\>**
The role which should be granted or denied access to the command.

<a href='#ping'></a>

## cmd.ping.self.title

cmd.ping.self.description

### Usage

!ping

### Arguments

<a href='#prefix'></a>

## cmd.prefix.self.title

Shows the current prefix of the bot.

### Usage

!prefix

### Arguments

<a href='#premium'></a>

## cmd.premium.self.title

Info about premium version of InviteManager.

### Usage

!premium [action]

### Arguments

**\<action\>**
The action to perform. None for premium info. `check` to check your premium status. `activate` to use your premium for this server.
Use one of the following values: Check, Activate, Deactivate

<a href='#punishmentConfig'></a>

## cmd.punishmentConfig.self.title

Configure punishments when reaching a certain amount of strikes.

### Usage

!punishmentConfig [punishment][strikes] [args]

### Arguments

**\<punishment\>**
Type of punishment to use.
Use one of the following values: ban, kick, softban, warn, mute

**\<strikes\>**
Number of strikes for this punishment to be used.

**\<args\>**
Arguments passed to the punishment.

<a href='#purge'></a>

## cmd.purge.self.title

Purge messages in a channel.

### Usage

!purge \<quantity\> [user]

### Arguments

**\<quantity\>**
How many messages should be deleted.

**\<user\>**
cmd.purge.self.args.user

<a href='#purgeUntil'></a>

## cmd.purgeUntil.self.title

Purge messages in a channel up until a specified message.

### Usage

!purgeUntil \<messageID\>

### Arguments

**\<messageID\>**
Last message ID to be deleted.

<a href='#ranks'></a>

## cmd.ranks.self.title

Show all ranks.

### Usage

!ranks

### Arguments

<a href='#removeInvites'></a>

## cmd.removeInvites.self.title

cmd.removeInvites.self.description

### Usage

!removeInvites \<user\> \<amount\> [reason]

### Arguments

**\<user\>**
cmd.removeInvites.self.args.user

**\<amount\>**
cmd.removeInvites.self.args.amount

**\<reason\>**
cmd.removeInvites.self.args.reason

<a href='#removeRank'></a>

## cmd.removeRank.self.title

Remove a rank.

### Usage

!removeRank [rank]

### Arguments

**\<rank\>**
The for which you want to remove the rank.

<a href='#restoreInvites'></a>

## cmd.restoreInvites.self.title

Restore all previously cleared invites.

### Usage

!restoreInvites [user]

### Arguments

**\<user\>**
The user to restore all invites to. If omitted restores invites for all users.

<a href='#setup'></a>

## cmd.setup.self.title

Help with setting up the bot and checking for problems (e.g. missing permissions)

### Usage

!setup

### Arguments

<a href='#softBan'></a>

## cmd.softBan.self.title

Ban and then automatically unban a member from the server.

### Usage

!softBan [-d value|--deleteMessageDays=value] \<user\> [reason]

### Arguments

**--deleteMessageDays**
cmd.softBan.self.flags.deleteMessageDays

**\<user\>**
User to ban.

**\<reason\>**
Why was the user banned.

<a href='#strike'></a>

## cmd.strike.self.title

cmd.strike.self.description

### Usage

!strike \<member\> \<type\> \<amount\>

### Arguments

**\<member\>**
cmd.strike.self.args.member

**\<type\>**
cmd.strike.self.args.type
Use one of the following values: invites, links, words, allCaps, duplicateText, quickMessages, mentionUsers, mentionRoles, emojis, hoist

**\<amount\>**
cmd.strike.self.args.amount

<a href='#strikeConfig'></a>

## cmd.strikeConfig.self.title

Configure strikes received for various violations.

### Usage

!strikeConfig [violation][strikes]

### Arguments

**\<violation\>**
Violation type.
Use one of the following values: invites, links, words, allCaps, duplicateText, quickMessages, mentionUsers, mentionRoles, emojis, hoist

**\<strikes\>**
Number of strikes.

<a href='#subtractFakes'></a>

## cmd.subtractFakes.self.title

Remove fake invites from all users.

### Usage

!subtractFakes

### Arguments

<a href='#subtractLeaves'></a>

## cmd.subtractLeaves.self.title

Remove leaves from all users

### Usage

!subtractLeaves

### Arguments

<a href='#support'></a>

## cmd.support.self.title

Get an invite link to our support server.

### Usage

!support

### Arguments

<a href='#tryPremium'></a>

## cmd.tryPremium.self.title

Try the premium version of InviteManager for free for a limited duration.

### Usage

!tryPremium

### Arguments

<a href='#unban'></a>

## cmd.unban.self.title

cmd.unban.self.description

### Usage

!unban \<user\> [reason]

### Arguments

**\<user\>**
The user that should be unbanned.

**\<reason\>**
The reason why this user is unbanned.

<a href='#unhoist'></a>

## cmd.unhoist.self.title

cmd.unhoist.self.description

### Usage

!unhoist

### Arguments

<a href='#unmute'></a>

## cmd.unmute.self.title

cmd.unmute.self.description

### Usage

!unmute \<user\>

### Arguments

**\<user\>**
The user that should be unmuted.

<a href='#warn'></a>

## cmd.warn.self.title

Warn a member.

### Usage

!warn \<member\> [reason]

### Arguments

**\<member\>**
Member to warn.

**\<reason\>**
Why was the member was warned.
