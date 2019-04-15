# Configs

There are many config options that can be set. You don't have to set all of them. If you just added the bot, just run `!setup`, which will guide you through the most important ones.

## Overview

### General

| Setting                                            | Description                          |
| -------------------------------------------------- | ------------------------------------ |
| [Prefix](#prefix)                                  | settings.prefix.description          |
| [Language](#lang)                                  | settings.lang.description            |
| [Log Channel](#logchannel)                         | settings.logChannel.description      |
| [Get Updates](#getupdates)                         | settings.getUpdates.description      |
| [settings.channels.title](#channels)               | settings.channels.description        |
| [settings.ignoredChannels.title](#ignoredchannels) | settings.ignoredChannels.description |

### Invites

#### Joins

| Setting                                | Description                             |
| -------------------------------------- | --------------------------------------- |
| [Message](#joinmessage)                | settings.joinMessage.description        |
| [Message Channel](#joinmessagechannel) | settings.joinMessageChannel.description |

#### Leaves

| Setting                                                | Description                                     |
| ------------------------------------------------------ | ----------------------------------------------- |
| [Message](#leavemessage)                               | settings.leaveMessage.description               |
| [Message Channel](#leavemessagechannel)                | settings.leaveMessageChannel.description        |
| [Auto Subtract](#autosubtractleaves)                   | settings.autoSubtractLeaves.description         |
| [Auto Subtract Threshold](#autosubtractleavethreshold) | settings.autoSubtractLeaveThreshold.description |

#### Leaderboard

| Setting                                              | Description                                         |
| ---------------------------------------------------- | --------------------------------------------------- |
| [Style](#leaderboardstyle)                           | settings.leaderboardStyle.description               |
| [Hide left members](#hideleftmembersfromleaderboard) | settings.hideLeftMembersFromLeaderboard.description |

#### Fakes

| Setting                             | Description                            |
| ----------------------------------- | -------------------------------------- |
| [Auto Subtract](#autosubtractfakes) | settings.autoSubtractFakes.description |

#### Ranks

| Setting                                          | Description                                  |
| ------------------------------------------------ | -------------------------------------------- |
| [Assignment Style](#rankassignmentstyle)         | settings.rankAssignmentStyle.description     |
| [Announcement Channel](#rankannouncementchannel) | settings.rankAnnouncementChannel.description |
| [Announcement Message](#rankannouncementmessage) | settings.rankAnnouncementMessage.description |

### Moderation

#### settings.groups.moderation.captcha.title

| Setting                                               | Description                                            |
| ----------------------------------------------------- | ------------------------------------------------------ |
| [Enabled](#captchaverificationonjoin)                 | settings.captchaVerificationOnJoin.description         |
| [Welcome Message](#captchaverificationwelcomemessage) | settings.captchaVerificationWelcomeMessage.description |
| [Success Message](#captchaverificationsuccessmessage) | settings.captchaVerificationSuccessMessage.description |
| [Failed Message](#captchaverificationfailedmessage)   | settings.captchaVerificationFailedMessage.description  |
| [Verification Timeout](#captchaverificationtimeout)   | settings.captchaVerificationTimeout.description        |
| [Log Enabled](#captchaverificationlogenabled)         | settings.captchaVerificationLogEnabled.description     |

#### settings.groups.moderation.general.title

| Setting                                                         | Description                                                |
| --------------------------------------------------------------- | ---------------------------------------------------------- |
| [Enabled](#automodenabled)                                      | settings.autoModEnabled.description                        |
| [Moderated Channels](#automodmoderatedchannels)                 | settings.autoModModeratedChannels.description              |
| [Moderated Roles](#automodmoderatedroles)                       | settings.autoModModeratedRoles.description                 |
| [Ignored Channels](#automodignoredchannels)                     | settings.autoModIgnoredChannels.description                |
| [Ignored Roles](#automodignoredroles)                           | settings.autoModIgnoredRoles.description                   |
| [Muted Role](#mutedrole)                                        | settings.mutedRole.description                             |
| [Disabled for Old Members](#automoddisabledforoldmembers)       | settings.autoModDisabledForOldMembers.description          |
| [Old Members Threshold](#automoddisabledforoldmembersthreshold) | settings.autoModDisabledForOldMembersThreshold.description |

#### settings.groups.moderation.logging.title

| Setting                                                                | Description                                                  |
| ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| [Log Enabled](#automodlogenabled)                                      | settings.autoModLogEnabled.description                       |
| [Log Channel](#modlogchannel)                                          | settings.modLogChannel.description                           |
| [Delete Bot Messages](#automoddeletebotmessage)                        | settings.autoModDeleteBotMessage.description                 |
| [Delete Bot Message Timeout](#automoddeletebotmessagetimeoutinseconds) | settings.autoModDeleteBotMessageTimeoutInSeconds.description |
| [Delete Ban Messages](#modpunishmentbandeletemessage)                  | settings.modPunishmentBanDeleteMessage.description           |
| [Delete Kick Messages](#modpunishmentkickdeletemessage)                | settings.modPunishmentKickDeleteMessage.description          |
| [Delete Softban Messages](#modpunishmentsoftbandeletemessage)          | settings.modPunishmentSoftbanDeleteMessage.description       |
| [Delete Warn Messages](#modpunishmentwarndeletemessage)                | settings.modPunishmentWarnDeleteMessage.description          |
| [Delete Mute Messages](#modpunishmentmutedeletemessage)                | settings.modPunishmentMuteDeleteMessage.description          |

#### settings.groups.moderation.invites.title

| Setting                           | Description                                |
| --------------------------------- | ------------------------------------------ |
| [Enabled](#automodinvitesenabled) | settings.autoModInvitesEnabled.description |

#### settings.groups.moderation.links.title

| Setting                                          | Description                                      |
| ------------------------------------------------ | ------------------------------------------------ |
| [Enabled](#automodlinksenabled)                  | settings.autoModLinksEnabled.description         |
| [Whitelist](#automodlinkswhitelist)              | settings.autoModLinksWhitelist.description       |
| [Blacklist](#automodlinksblacklist)              | settings.autoModLinksBlacklist.description       |
| [Follow Redirects](#automodlinksfollowredirects) | settings.autoModLinksFollowRedirects.description |

#### settings.groups.moderation.bannedWords.title

| Setting                             | Description                                |
| ----------------------------------- | ------------------------------------------ |
| [Enabled](#automodwordsenabled)     | settings.autoModWordsEnabled.description   |
| [Blacklist](#automodwordsblacklist) | settings.autoModWordsBlacklist.description |

#### settings.groups.moderation.caps.title

| Setting                                          | Description                                       |
| ------------------------------------------------ | ------------------------------------------------- |
| [Enabled](#automodallcapsenabled)                | settings.autoModAllCapsEnabled.description        |
| [Min. Characters](#automodallcapsmincharacters)  | settings.autoModAllCapsMinCharacters.description  |
| [Percentage CAPs](#automodallcapspercentagecaps) | settings.autoModAllCapsPercentageCaps.description |

#### settings.groups.moderation.duplicate.title

| Setting                                                         | Description                                                 |
| --------------------------------------------------------------- | ----------------------------------------------------------- |
| [Enabled](#automodduplicatetextenabled)                         | settings.autoModDuplicateTextEnabled.description            |
| [Timeframe in Seconds](#automodduplicatetexttimeframeinseconds) | settings.autoModDuplicateTextTimeframeInSeconds.description |

#### settings.groups.moderation.spam.title

| Setting                                                         | Description                                                 |
| --------------------------------------------------------------- | ----------------------------------------------------------- |
| [Enabled](#automodquickmessagesenabled)                         | settings.autoModQuickMessagesEnabled.description            |
| [# of Messages](#automodquickmessagesnumberofmessages)          | settings.autoModQuickMessagesNumberOfMessages.description   |
| [Timeframe in Seconds](#automodquickmessagestimeframeinseconds) | settings.autoModQuickMessagesTimeframeInSeconds.description |

#### settings.groups.moderation.mentions.title

| Setting                                                      | Description                                                 |
| ------------------------------------------------------------ | ----------------------------------------------------------- |
| [Enabled](#automodmentionusersenabled)                       | settings.autoModMentionUsersEnabled.description             |
| [Max # of Mentions](#automodmentionusersmaxnumberofmentions) | settings.autoModMentionUsersMaxNumberOfMentions.description |
| [Enabled](#automodmentionrolesenabled)                       | settings.autoModMentionRolesEnabled.description             |
| [Max # of Mentions](#automodmentionrolesmaxnumberofmentions) | settings.autoModMentionRolesMaxNumberOfMentions.description |

#### settings.groups.moderation.emojis.title

| Setting                                            | Description                                         |
| -------------------------------------------------- | --------------------------------------------------- |
| [Enabled](#automodemojisenabled)                   | settings.autoModEmojisEnabled.description           |
| [Max # of Emojis](#automodemojismaxnumberofemojis) | settings.autoModEmojisMaxNumberOfEmojis.description |
| [Dehoist Enabled](#automodhoistenabled)            | settings.autoModHoistEnabled.description            |

<a name=prefix></a>

## Prefix

settings.prefix.description

Type: `String`

Default: `!`

Reset to default:
`!config prefix default`

Examples:

`!config prefix +`

`!config prefix >`

<a name=lang></a>

## Language

settings.lang.description

Type: `Enum<Lang>`

Default: `en`

Reset to default:
`!config lang default`

Possible values: `cs`, `de`, `en`, `es`, `fr`, `hu`, `it`, `nl`, `pt_BR`, `pt`, `ro`, `ru`, `sr`, `sv`, `ur_PK`

Example:

`!config lang cs`

<a name=logChannel></a>

## Log Channel

settings.logChannel.description

Type: `Channel`

Default: `null`

Reset to default:
`!config logChannel default`

Examples:

`!config logChannel #channel`

<a name=getUpdates></a>

## Get Updates

settings.getUpdates.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config getUpdates default`

Enable:

`!config getUpdates true`

Disable:

`!config getUpdates false`

<a name=channels></a>

## settings.channels.title

settings.channels.description

Type: `Channel[]`

Default: ``

Reset to default:
`!config channels default`

<a name=ignoredChannels></a>

## settings.ignoredChannels.title

settings.ignoredChannels.description

Type: `Channel[]`

Default: ``

Reset to default:
`!config ignoredChannels default`

<a name=joinMessage></a>

## Message

settings.joinMessage.description

Type: `String`

Default: `{memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)`

Reset to default:
`!config joinMessage default`

<a name=joinMessageChannel></a>

## Message Channel

settings.joinMessageChannel.description

Type: `Channel`

Default: `null`

Reset to default:
`!config joinMessageChannel default`

Examples:

`!config joinMessageChannel #general`

`!config joinMessageChannel #joins`

<a name=leaveMessage></a>

## Message

settings.leaveMessage.description

Type: `String`

Default: `{memberName} **left**; Invited by **{inviterName}**`

Reset to default:
`!config leaveMessage default`

Examples:

`!config leaveMessage`

`!config leaveMessage`

<a name=leaveMessageChannel></a>

## Message Channel

settings.leaveMessageChannel.description

Type: `Channel`

Default: `null`

Reset to default:
`!config leaveMessageChannel default`

Examples:

`!config leaveMessageChannel #general`

`!config leaveMessageChannel #leaves`

<a name=leaderboardStyle></a>

## Style

settings.leaderboardStyle.description

Type: `Enum<LeaderboardStyle>`

Default: `normal`

Reset to default:
`!config leaderboardStyle default`

Possible values: `normal`, `table`, `mentions`

Example:

`!config leaderboardStyle normal`

<a name=hideLeftMembersFromLeaderboard></a>

## Hide left members

settings.hideLeftMembersFromLeaderboard.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config hideLeftMembersFromLeaderboard default`

Enable:

`!config hideLeftMembersFromLeaderboard true`

Disable:

`!config hideLeftMembersFromLeaderboard false`

<a name=autoSubtractFakes></a>

## Auto Subtract

settings.autoSubtractFakes.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoSubtractFakes default`

Enable:

`!config autoSubtractFakes true`

Disable:

`!config autoSubtractFakes false`

<a name=autoSubtractLeaves></a>

## Auto Subtract

settings.autoSubtractLeaves.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoSubtractLeaves default`

Enable:

`!config autoSubtractLeaves true`

Disable:

`!config autoSubtractLeaves false`

<a name=autoSubtractLeaveThreshold></a>

## Auto Subtract Threshold

settings.autoSubtractLeaveThreshold.description

Type: `Number`

Default: `600`

Reset to default:
`!config autoSubtractLeaveThreshold default`

Examples:

`!config autoSubtractLeaveThreshold 60`

`!config autoSubtractLeaveThreshold 3600`

<a name=rankAssignmentStyle></a>

## Assignment Style

settings.rankAssignmentStyle.description

Type: `Enum<RankAssignmentStyle>`

Default: `all`

Reset to default:
`!config rankAssignmentStyle default`

Possible values: `all`, `highest`

Example:

`!config rankAssignmentStyle all`

<a name=rankAnnouncementChannel></a>

## Announcement Channel

settings.rankAnnouncementChannel.description

Type: `Channel`

Default: `null`

Reset to default:
`!config rankAnnouncementChannel default`

Examples:

`!config rankAnnouncementChannel`

`!config rankAnnouncementChannel`

<a name=rankAnnouncementMessage></a>

## Announcement Message

settings.rankAnnouncementMessage.description

Type: `String`

Default: `Congratulations, **{memberMention}** has reached the **{rankName}** rank!`

Reset to default:
`!config rankAnnouncementMessage default`

Examples:

`!config rankAnnouncementMessage`

`!config rankAnnouncementMessage`

<a name=captchaVerificationOnJoin></a>

## Enabled

settings.captchaVerificationOnJoin.description

Type: `Boolean`

Default: `false`

Reset to default:
`!config captchaVerificationOnJoin default`

Enable:

`!config captchaVerificationOnJoin true`

Disable:

`!config captchaVerificationOnJoin false`

<a name=captchaVerificationWelcomeMessage></a>

## Welcome Message

settings.captchaVerificationWelcomeMessage.description

Type: `String`

Default: `Welcome to the server **{serverName}**! For extra protection, new members are required to enter a captcha.`

Reset to default:
`!config captchaVerificationWelcomeMessage default`

Examples:

`!config captchaVerificationWelcomeMessage Welcome, please enter the captcha below!`

<a name=captchaVerificationSuccessMessage></a>

## Success Message

settings.captchaVerificationSuccessMessage.description

Type: `String`

Default: `You have successfully entered the captcha. Welcome to the server!`

Reset to default:
`!config captchaVerificationSuccessMessage default`

Examples:

`!config captchaVerificationSuccessMessage Thanks for entering the captcha, enjoy our server!`

<a name=captchaVerificationFailedMessage></a>

## Failed Message

settings.captchaVerificationFailedMessage.description

Type: `String`

Default: `You did not enter the captha right within the specified time.We're sorry, but we have to kick you from the server. Feel free to join again.`

Reset to default:
`!config captchaVerificationFailedMessage default`

Examples:

`!config captchaVerificationFailedMessage Looks like you are not human :(. You can join again and try again later if this was a mistake!`

<a name=captchaVerificationTimeout></a>

## Verification Timeout

settings.captchaVerificationTimeout.description

Type: `Number`

Default: `180`

Reset to default:
`!config captchaVerificationTimeout default`

Examples:

`!config captchaVerificationTimeout 60`

`!config captchaVerificationTimeout 600`

<a name=captchaVerificationLogEnabled></a>

## Log Enabled

settings.captchaVerificationLogEnabled.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config captchaVerificationLogEnabled default`

Enable:

`!config captchaVerificationLogEnabled true`

Disable:

`!config captchaVerificationLogEnabled false`

<a name=autoModEnabled></a>

## Enabled

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

## Moderated Channels

settings.autoModModeratedChannels.description

Type: `Channel[]`

Default: ``

Reset to default:
`!config autoModModeratedChannels default`

Examples:

`!config autoModModeratedChannels #general`

`!config autoModModeratedChannels #support,#help`

<a name=autoModModeratedRoles></a>

## Moderated Roles

settings.autoModModeratedRoles.description

Type: `Role[]`

Default: ``

Reset to default:
`!config autoModModeratedRoles default`

Examples:

`!config autoModModeratedRoles @NewMembers`

`!config autoModModeratedRoles @Newbies,@Starters`

<a name=autoModIgnoredChannels></a>

## Ignored Channels

settings.autoModIgnoredChannels.description

Type: `Channel[]`

Default: ``

Reset to default:
`!config autoModIgnoredChannels default`

Examples:

`!config autoModIgnoredChannels #general`

`!config autoModIgnoredChannels #off-topic,#nsfw`

<a name=autoModIgnoredRoles></a>

## Ignored Roles

settings.autoModIgnoredRoles.description

Type: `Role[]`

Default: ``

Reset to default:
`!config autoModIgnoredRoles default`

Examples:

`!config autoModIgnoredRoles @TrustedMembers`

`!config autoModIgnoredRoles @Moderators,@Staff`

<a name=mutedRole></a>

## Muted Role

settings.mutedRole.description

Type: `Role`

Default: `null`

Reset to default:
`!config mutedRole default`

Examples:

`!config mutedRole @muted`

<a name=autoModDisabledForOldMembers></a>

## Disabled for Old Members

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

## Old Members Threshold

settings.autoModDisabledForOldMembersThreshold.description

Type: `Number`

Default: `604800`

Reset to default:
`!config autoModDisabledForOldMembersThreshold default`

Examples:

`!config autoModDisabledForOldMembersThreshold 604800` (1 week)``

`!config autoModDisabledForOldMembersThreshold 2419200` (1 month)``

<a name=autoModLogEnabled></a>

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

## Log Channel

settings.modLogChannel.description

Type: `Channel`

Default: `null`

Reset to default:
`!config modLogChannel default`

Examples:

`!config modLogChannel #channel`

`!config modLogChannel #logs`

<a name=autoModDeleteBotMessage></a>

## Delete Bot Messages

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

## Delete Bot Message Timeout

settings.autoModDeleteBotMessageTimeoutInSeconds.description

Type: `Number`

Default: `5`

Reset to default:
`!config autoModDeleteBotMessageTimeoutInSeconds default`

Examples:

`!config autoModDeleteBotMessageTimeoutInSeconds 5`

`!config autoModDeleteBotMessageTimeoutInSeconds 10`

<a name=modPunishmentBanDeleteMessage></a>

## Delete Ban Messages

settings.modPunishmentBanDeleteMessage.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentBanDeleteMessage default`

Enable:

`!config modPunishmentBanDeleteMessage true`

Disable:

`!config modPunishmentBanDeleteMessage false`

<a name=modPunishmentKickDeleteMessage></a>

## Delete Kick Messages

settings.modPunishmentKickDeleteMessage.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentKickDeleteMessage default`

Enable:

`!config modPunishmentKickDeleteMessage true`

Disable:

`!config modPunishmentKickDeleteMessage false`

<a name=modPunishmentSoftbanDeleteMessage></a>

## Delete Softban Messages

settings.modPunishmentSoftbanDeleteMessage.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentSoftbanDeleteMessage default`

Enable:

`!config modPunishmentSoftbanDeleteMessage true`

Disable:

`!config modPunishmentSoftbanDeleteMessage false`

<a name=modPunishmentWarnDeleteMessage></a>

## Delete Warn Messages

settings.modPunishmentWarnDeleteMessage.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentWarnDeleteMessage default`

Enable:

`!config modPunishmentWarnDeleteMessage true`

Disable:

`!config modPunishmentWarnDeleteMessage false`

<a name=modPunishmentMuteDeleteMessage></a>

## Delete Mute Messages

settings.modPunishmentMuteDeleteMessage.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentMuteDeleteMessage default`

Enable:

`!config modPunishmentMuteDeleteMessage true`

Disable:

`!config modPunishmentMuteDeleteMessage false`

<a name=autoModInvitesEnabled></a>

## Enabled

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

## Enabled

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

## Whitelist

settings.autoModLinksWhitelist.description

Type: `String[]`

Default: ``

Reset to default:
`!config autoModLinksWhitelist default`

Examples:

`!config autoModLinksWhitelist discordbots.org`

`!config autoModLinksWhitelist youtube.com,twitch.com`

<a name=autoModLinksBlacklist></a>

## Blacklist

settings.autoModLinksBlacklist.description

Type: `String[]`

Default: ``

Reset to default:
`!config autoModLinksBlacklist default`

Examples:

`!config autoModLinksBlacklist google.com`

`!config autoModLinksBlacklist twitch.com,youtube.com`

<a name=autoModLinksFollowRedirects></a>

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

## Enabled

settings.autoModWordsEnabled.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModWordsEnabled default`

Enable:

`!config autoModWordsEnabled true`

Disable:

`!config autoModWordsEnabled false`

<a name=autoModWordsBlacklist></a>

## Blacklist

settings.autoModWordsBlacklist.description

Type: `String[]`

Default: ``

Reset to default:
`!config autoModWordsBlacklist default`

Examples:

`!config autoModWordsBlacklist gay`

`!config autoModWordsBlacklist stupid,fuck`

<a name=autoModAllCapsEnabled></a>

## Enabled

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

## Min. Characters

settings.autoModAllCapsMinCharacters.description

Type: `Number`

Default: `10`

Reset to default:
`!config autoModAllCapsMinCharacters default`

Examples:

`!config autoModAllCapsMinCharacters 5`

`!config autoModAllCapsMinCharacters 15`

<a name=autoModAllCapsPercentageCaps></a>

## Percentage CAPs

settings.autoModAllCapsPercentageCaps.description

Type: `Number`

Default: `70`

Reset to default:
`!config autoModAllCapsPercentageCaps default`

Examples:

`!config autoModAllCapsPercentageCaps 50`

`!config autoModAllCapsPercentageCaps 90`

<a name=autoModDuplicateTextEnabled></a>

## Enabled

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

## Timeframe in Seconds

settings.autoModDuplicateTextTimeframeInSeconds.description

Type: `Number`

Default: `60`

Reset to default:
`!config autoModDuplicateTextTimeframeInSeconds default`

Examples:

`!config autoModDuplicateTextTimeframeInSeconds 5`

`!config autoModDuplicateTextTimeframeInSeconds 20`

<a name=autoModQuickMessagesEnabled></a>

## Enabled

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

## # of Messages

settings.autoModQuickMessagesNumberOfMessages.description

Type: `Number`

Default: `5`

Reset to default:
`!config autoModQuickMessagesNumberOfMessages default`

Examples:

`!config autoModQuickMessagesNumberOfMessages 5`

`!config autoModQuickMessagesNumberOfMessages 10`

<a name=autoModQuickMessagesTimeframeInSeconds></a>

## Timeframe in Seconds

settings.autoModQuickMessagesTimeframeInSeconds.description

Type: `Number`

Default: `3`

Reset to default:
`!config autoModQuickMessagesTimeframeInSeconds default`

Examples:

`!config autoModQuickMessagesTimeframeInSeconds 2`

`!config autoModQuickMessagesTimeframeInSeconds 10`

<a name=autoModMentionUsersEnabled></a>

## Enabled

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

## Enabled

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

## Enabled

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

## Max # of Emojis

settings.autoModEmojisMaxNumberOfEmojis.description

Type: `Number`

Default: `5`

Reset to default:
`!config autoModEmojisMaxNumberOfEmojis default`

Examples:

`!config autoModEmojisMaxNumberOfEmojis 5`

`!config autoModEmojisMaxNumberOfEmojis 10`

<a name=autoModHoistEnabled></a>

## Dehoist Enabled

settings.autoModHoistEnabled.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModHoistEnabled default`

Enable:

`!config autoModHoistEnabled true`

Disable:

`!config autoModHoistEnabled false`
