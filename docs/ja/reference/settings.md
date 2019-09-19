# Configs

There are many config options that can be set. You don't have to set all of them. If you just added the bot, just run `!setup`, which will guide you through the most important ones.

## Overview

### settings.groups.general.title

| Setting                                            | Description                          |
| -------------------------------------------------- | ------------------------------------ |
| [settings.prefix.title](#prefix)                   | settings.prefix.description          |
| [settings.lang.title](#lang)                       | settings.lang.description            |
| [settings.logChannel.title](#logchannel)           | settings.logChannel.description      |
| [settings.getUpdates.title](#getupdates)           | settings.getUpdates.description      |
| [settings.channels.title](#channels)               | settings.channels.description        |
| [settings.ignoredChannels.title](#ignoredchannels) | settings.ignoredChannels.description |

### settings.groups.invites.title

#### settings.groups.invites.joins.title

| Setting                                                  | Description                             |
| -------------------------------------------------------- | --------------------------------------- |
| [settings.joinMessage.title](#joinmessage)               | settings.joinMessage.description        |
| [settings.joinMessageChannel.title](#joinmessagechannel) | settings.joinMessageChannel.description |

#### settings.groups.invites.leaves.title

| Setting                                                                  | Description                                     |
| ------------------------------------------------------------------------ | ----------------------------------------------- |
| [settings.leaveMessage.title](#leavemessage)                             | settings.leaveMessage.description               |
| [settings.leaveMessageChannel.title](#leavemessagechannel)               | settings.leaveMessageChannel.description        |
| [settings.autoSubtractLeaves.title](#autosubtractleaves)                 | settings.autoSubtractLeaves.description         |
| [settings.autoSubtractLeaveThreshold.title](#autosubtractleavethreshold) | settings.autoSubtractLeaveThreshold.description |

#### settings.groups.invites.leaderboard.title

| Setting                                                                          | Description                                         |
| -------------------------------------------------------------------------------- | --------------------------------------------------- |
| [settings.leaderboardStyle.title](#leaderboardstyle)                             | settings.leaderboardStyle.description               |
| [settings.hideLeftMembersFromLeaderboard.title](#hideleftmembersfromleaderboard) | settings.hideLeftMembersFromLeaderboard.description |

#### settings.groups.invites.fakes.title

| Setting                                                | Description                            |
| ------------------------------------------------------ | -------------------------------------- |
| [settings.autoSubtractFakes.title](#autosubtractfakes) | settings.autoSubtractFakes.description |

#### settings.groups.invites.ranks.title

| Setting                                                            | Description                                  |
| ------------------------------------------------------------------ | -------------------------------------------- |
| [settings.rankAssignmentStyle.title](#rankassignmentstyle)         | settings.rankAssignmentStyle.description     |
| [settings.rankAnnouncementChannel.title](#rankannouncementchannel) | settings.rankAnnouncementChannel.description |
| [settings.rankAnnouncementMessage.title](#rankannouncementmessage) | settings.rankAnnouncementMessage.description |

### settings.groups.moderation.title

#### settings.groups.moderation.captcha.title

| Setting                                                                                | Description                                            |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| [settings.captchaVerificationOnJoin.title](#captchaverificationonjoin)                 | settings.captchaVerificationOnJoin.description         |
| [settings.captchaVerificationWelcomeMessage.title](#captchaverificationwelcomemessage) | settings.captchaVerificationWelcomeMessage.description |
| [settings.captchaVerificationSuccessMessage.title](#captchaverificationsuccessmessage) | settings.captchaVerificationSuccessMessage.description |
| [settings.captchaVerificationFailedMessage.title](#captchaverificationfailedmessage)   | settings.captchaVerificationFailedMessage.description  |
| [settings.captchaVerificationTimeout.title](#captchaverificationtimeout)               | settings.captchaVerificationTimeout.description        |
| [settings.captchaVerificationLogEnabled.title](#captchaverificationlogenabled)         | settings.captchaVerificationLogEnabled.description     |

#### settings.groups.moderation.general.title

| Setting                                                                                        | Description                                                |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [settings.autoModEnabled.title](#automodenabled)                                               | settings.autoModEnabled.description                        |
| [settings.autoModModeratedChannels.title](#automodmoderatedchannels)                           | settings.autoModModeratedChannels.description              |
| [settings.autoModModeratedRoles.title](#automodmoderatedroles)                                 | settings.autoModModeratedRoles.description                 |
| [settings.autoModIgnoredChannels.title](#automodignoredchannels)                               | settings.autoModIgnoredChannels.description                |
| [settings.autoModIgnoredRoles.title](#automodignoredroles)                                     | settings.autoModIgnoredRoles.description                   |
| [settings.mutedRole.title](#mutedrole)                                                         | settings.mutedRole.description                             |
| [settings.autoModDisabledForOldMembers.title](#automoddisabledforoldmembers)                   | settings.autoModDisabledForOldMembers.description          |
| [settings.autoModDisabledForOldMembersThreshold.title](#automoddisabledforoldmembersthreshold) | settings.autoModDisabledForOldMembersThreshold.description |

#### settings.groups.moderation.logging.title

| Setting                                                                                            | Description                                                  |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [settings.autoModLogEnabled.title](#automodlogenabled)                                             | settings.autoModLogEnabled.description                       |
| [settings.modLogChannel.title](#modlogchannel)                                                     | settings.modLogChannel.description                           |
| [settings.autoModDeleteBotMessage.title](#automoddeletebotmessage)                                 | settings.autoModDeleteBotMessage.description                 |
| [settings.autoModDeleteBotMessageTimeoutInSeconds.title](#automoddeletebotmessagetimeoutinseconds) | settings.autoModDeleteBotMessageTimeoutInSeconds.description |
| [settings.modPunishmentBanDeleteMessage.title](#modpunishmentbandeletemessage)                     | settings.modPunishmentBanDeleteMessage.description           |
| [settings.modPunishmentKickDeleteMessage.title](#modpunishmentkickdeletemessage)                   | settings.modPunishmentKickDeleteMessage.description          |
| [settings.modPunishmentSoftbanDeleteMessage.title](#modpunishmentsoftbandeletemessage)             | settings.modPunishmentSoftbanDeleteMessage.description       |
| [settings.modPunishmentWarnDeleteMessage.title](#modpunishmentwarndeletemessage)                   | settings.modPunishmentWarnDeleteMessage.description          |
| [settings.modPunishmentMuteDeleteMessage.title](#modpunishmentmutedeletemessage)                   | settings.modPunishmentMuteDeleteMessage.description          |

#### settings.groups.moderation.invites.title

| Setting                                                        | Description                                |
| -------------------------------------------------------------- | ------------------------------------------ |
| [settings.autoModInvitesEnabled.title](#automodinvitesenabled) | settings.autoModInvitesEnabled.description |

#### settings.groups.moderation.links.title

| Setting                                                                    | Description                                      |
| -------------------------------------------------------------------------- | ------------------------------------------------ |
| [settings.autoModLinksEnabled.title](#automodlinksenabled)                 | settings.autoModLinksEnabled.description         |
| [settings.autoModLinksWhitelist.title](#automodlinkswhitelist)             | settings.autoModLinksWhitelist.description       |
| [settings.autoModLinksBlacklist.title](#automodlinksblacklist)             | settings.autoModLinksBlacklist.description       |
| [settings.autoModLinksFollowRedirects.title](#automodlinksfollowredirects) | settings.autoModLinksFollowRedirects.description |

#### settings.groups.moderation.bannedWords.title

| Setting                                                        | Description                                |
| -------------------------------------------------------------- | ------------------------------------------ |
| [settings.autoModWordsEnabled.title](#automodwordsenabled)     | settings.autoModWordsEnabled.description   |
| [settings.autoModWordsBlacklist.title](#automodwordsblacklist) | settings.autoModWordsBlacklist.description |

#### settings.groups.moderation.caps.title

| Setting                                                                      | Description                                       |
| ---------------------------------------------------------------------------- | ------------------------------------------------- |
| [settings.autoModAllCapsEnabled.title](#automodallcapsenabled)               | settings.autoModAllCapsEnabled.description        |
| [settings.autoModAllCapsMinCharacters.title](#automodallcapsmincharacters)   | settings.autoModAllCapsMinCharacters.description  |
| [settings.autoModAllCapsPercentageCaps.title](#automodallcapspercentagecaps) | settings.autoModAllCapsPercentageCaps.description |

#### settings.groups.moderation.duplicate.title

| Setting                                                                                          | Description                                                 |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| [settings.autoModDuplicateTextEnabled.title](#automodduplicatetextenabled)                       | settings.autoModDuplicateTextEnabled.description            |
| [settings.autoModDuplicateTextTimeframeInSeconds.title](#automodduplicatetexttimeframeinseconds) | settings.autoModDuplicateTextTimeframeInSeconds.description |

#### settings.groups.moderation.spam.title

| Setting                                                                                          | Description                                                 |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| [settings.autoModQuickMessagesEnabled.title](#automodquickmessagesenabled)                       | settings.autoModQuickMessagesEnabled.description            |
| [settings.autoModQuickMessagesNumberOfMessages.title](#automodquickmessagesnumberofmessages)     | settings.autoModQuickMessagesNumberOfMessages.description   |
| [settings.autoModQuickMessagesTimeframeInSeconds.title](#automodquickmessagestimeframeinseconds) | settings.autoModQuickMessagesTimeframeInSeconds.description |

#### settings.groups.moderation.mentions.title

| Setting                                                                                          | Description                                                 |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| [settings.autoModMentionUsersEnabled.title](#automodmentionusersenabled)                         | settings.autoModMentionUsersEnabled.description             |
| [settings.autoModMentionUsersMaxNumberOfMentions.title](#automodmentionusersmaxnumberofmentions) | settings.autoModMentionUsersMaxNumberOfMentions.description |
| [settings.autoModMentionRolesEnabled.title](#automodmentionrolesenabled)                         | settings.autoModMentionRolesEnabled.description             |
| [settings.autoModMentionRolesMaxNumberOfMentions.title](#automodmentionrolesmaxnumberofmentions) | settings.autoModMentionRolesMaxNumberOfMentions.description |

#### settings.groups.moderation.emojis.title

| Setting                                                                          | Description                                         |
| -------------------------------------------------------------------------------- | --------------------------------------------------- |
| [settings.autoModEmojisEnabled.title](#automodemojisenabled)                     | settings.autoModEmojisEnabled.description           |
| [settings.autoModEmojisMaxNumberOfEmojis.title](#automodemojismaxnumberofemojis) | settings.autoModEmojisMaxNumberOfEmojis.description |
| [settings.autoModHoistEnabled.title](#automodhoistenabled)                       | settings.autoModHoistEnabled.description            |

### settings.groups.music.title

#### settings.groups.music.general.title

| Setting                                                | Description                            |
| ------------------------------------------------------ | -------------------------------------- |
| [settings.musicVolume.title](#musicvolume)             | settings.musicVolume.description       |
| [settings.announceNextSong.title](#announcenextsong)   | settings.announceNextSong.description  |
| [settings.announcementVoice.title](#announcementvoice) | settings.announcementVoice.description |
| [settings.fadeMusicOnTalk.title](#fademusicontalk)     | settings.fadeMusicOnTalk.description   |
| [settings.fadeMusicEndDelay.title](#fademusicenddelay) | settings.fadeMusicEndDelay.description |

<a name=prefix></a>

---

## settings.prefix.title

settings.prefix.description

Type: `String`

Default: `!`

Reset to default:
`!config prefix default`

Examples:

`!config prefix +`

`!config prefix >`

<a name=lang></a>

---

## settings.lang.title

settings.lang.description

Type: `Enum<Lang>`

Default: `en`

Reset to default:
`!config lang default`

Possible values: `ar`, `bg`, `cs`, `de`, `en`, `es`, `fr`, `id_ID`, `it`, `ja`, `nl`, `pl`, `pt`, `pt_BR`, `ro`, `ru`, `tr`, `zh_CN`, `zh_TW`, `ur_PK`, `sv`, `sr`, `hu`, `lt`, `el`

Example:

`!config lang ar`

<a name=logChannel></a>

---

## settings.logChannel.title

settings.logChannel.description

Type: `Channel`

Default: `null`

Reset to default:
`!config logChannel default`

Examples:

`!config logChannel #channel`

<a name=getUpdates></a>

---

## settings.getUpdates.title

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

---

## settings.channels.title

settings.channels.description

Type: `Channel[]`

Default: ``

Reset to default:
`!config channels default`

<a name=ignoredChannels></a>

---

## settings.ignoredChannels.title

settings.ignoredChannels.description

Type: `Channel[]`

Default: ``

Reset to default:
`!config ignoredChannels default`

<a name=joinMessage></a>

---

## settings.joinMessage.title

settings.joinMessage.description

Type: `String`

Default: `{memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)`

Reset to default:
`!config joinMessage default`

<a name=joinMessageChannel></a>

---

## settings.joinMessageChannel.title

settings.joinMessageChannel.description

Type: `Channel`

Default: `null`

Reset to default:
`!config joinMessageChannel default`

Examples:

`!config joinMessageChannel #general`

`!config joinMessageChannel #joins`

<a name=leaveMessage></a>

---

## settings.leaveMessage.title

settings.leaveMessage.description

Type: `String`

Default: `{memberName} **left**; Invited by **{inviterName}**`

Reset to default:
`!config leaveMessage default`

Examples:

`!config leaveMessage`

`!config leaveMessage`

<a name=leaveMessageChannel></a>

---

## settings.leaveMessageChannel.title

settings.leaveMessageChannel.description

Type: `Channel`

Default: `null`

Reset to default:
`!config leaveMessageChannel default`

Examples:

`!config leaveMessageChannel #general`

`!config leaveMessageChannel #leaves`

<a name=leaderboardStyle></a>

---

## settings.leaderboardStyle.title

settings.leaderboardStyle.description

Type: `Enum<LeaderboardStyle>`

Default: `normal`

Reset to default:
`!config leaderboardStyle default`

Possible values: `normal`, `table`, `mentions`

Example:

`!config leaderboardStyle normal`

<a name=hideLeftMembersFromLeaderboard></a>

---

## settings.hideLeftMembersFromLeaderboard.title

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

---

## settings.autoSubtractFakes.title

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

---

## settings.autoSubtractLeaves.title

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

---

## settings.autoSubtractLeaveThreshold.title

settings.autoSubtractLeaveThreshold.description

Type: `Number`

Default: `600`

Reset to default:
`!config autoSubtractLeaveThreshold default`

Examples:

`!config autoSubtractLeaveThreshold 60`

`!config autoSubtractLeaveThreshold 3600`

<a name=rankAssignmentStyle></a>

---

## settings.rankAssignmentStyle.title

settings.rankAssignmentStyle.description

Type: `Enum<RankAssignmentStyle>`

Default: `all`

Reset to default:
`!config rankAssignmentStyle default`

Possible values: `all`, `highest`

Example:

`!config rankAssignmentStyle all`

<a name=rankAnnouncementChannel></a>

---

## settings.rankAnnouncementChannel.title

settings.rankAnnouncementChannel.description

Type: `Channel`

Default: `null`

Reset to default:
`!config rankAnnouncementChannel default`

Examples:

`!config rankAnnouncementChannel`

`!config rankAnnouncementChannel`

<a name=rankAnnouncementMessage></a>

---

## settings.rankAnnouncementMessage.title

settings.rankAnnouncementMessage.description

Type: `String`

Default: `Congratulations, **{memberMention}** has reached the **{rankName}** rank!`

Reset to default:
`!config rankAnnouncementMessage default`

Examples:

`!config rankAnnouncementMessage`

`!config rankAnnouncementMessage`

<a name=captchaVerificationOnJoin></a>

---

## settings.captchaVerificationOnJoin.title

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

---

## settings.captchaVerificationWelcomeMessage.title

settings.captchaVerificationWelcomeMessage.description

Type: `String`

Default: `Welcome to the server **{serverName}**! For extra protection, new members are required to enter a captcha.`

Reset to default:
`!config captchaVerificationWelcomeMessage default`

Examples:

`!config captchaVerificationWelcomeMessage Welcome, please enter the captcha below!`

<a name=captchaVerificationSuccessMessage></a>

---

## settings.captchaVerificationSuccessMessage.title

settings.captchaVerificationSuccessMessage.description

Type: `String`

Default: `You have successfully entered the captcha. Welcome to the server!`

Reset to default:
`!config captchaVerificationSuccessMessage default`

Examples:

`!config captchaVerificationSuccessMessage Thanks for entering the captcha, enjoy our server!`

<a name=captchaVerificationFailedMessage></a>

---

## settings.captchaVerificationFailedMessage.title

settings.captchaVerificationFailedMessage.description

Type: `String`

Default: `You did not enter the captha right within the specified time.We're sorry, but we have to kick you from the server. Feel free to join again.`

Reset to default:
`!config captchaVerificationFailedMessage default`

Examples:

`!config captchaVerificationFailedMessage Looks like you are not human :(. You can join again and try again later if this was a mistake!`

<a name=captchaVerificationTimeout></a>

---

## settings.captchaVerificationTimeout.title

settings.captchaVerificationTimeout.description

Type: `Number`

Default: `180`

Reset to default:
`!config captchaVerificationTimeout default`

Examples:

`!config captchaVerificationTimeout 60`

`!config captchaVerificationTimeout 600`

<a name=captchaVerificationLogEnabled></a>

---

## settings.captchaVerificationLogEnabled.title

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

---

## settings.autoModEnabled.title

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

## settings.autoModModeratedChannels.title

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

## settings.autoModModeratedRoles.title

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

## settings.autoModIgnoredChannels.title

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

## settings.autoModIgnoredRoles.title

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

## settings.mutedRole.title

settings.mutedRole.description

Type: `Role`

Default: `null`

Reset to default:
`!config mutedRole default`

Examples:

`!config mutedRole @muted`

<a name=autoModDisabledForOldMembers></a>

---

## settings.autoModDisabledForOldMembers.title

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

## settings.autoModDisabledForOldMembersThreshold.title

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

## settings.autoModLogEnabled.title

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

## settings.modLogChannel.title

settings.modLogChannel.description

Type: `Channel`

Default: `null`

Reset to default:
`!config modLogChannel default`

Examples:

`!config modLogChannel #channel`

`!config modLogChannel #logs`

<a name=autoModDeleteBotMessage></a>

---

## settings.autoModDeleteBotMessage.title

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

## settings.autoModDeleteBotMessageTimeoutInSeconds.title

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

## settings.modPunishmentBanDeleteMessage.title

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

---

## settings.modPunishmentKickDeleteMessage.title

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

---

## settings.modPunishmentSoftbanDeleteMessage.title

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

---

## settings.modPunishmentWarnDeleteMessage.title

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

---

## settings.modPunishmentMuteDeleteMessage.title

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

---

## settings.autoModInvitesEnabled.title

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

## settings.autoModLinksEnabled.title

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

## settings.autoModLinksWhitelist.title

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

## settings.autoModLinksBlacklist.title

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

## settings.autoModLinksFollowRedirects.title

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

## settings.autoModWordsEnabled.title

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

---

## settings.autoModWordsBlacklist.title

settings.autoModWordsBlacklist.description

Type: `String[]`

Default: ``

Reset to default:
`!config autoModWordsBlacklist default`

Examples:

`!config autoModWordsBlacklist gay`

`!config autoModWordsBlacklist stupid,fuck`

<a name=autoModAllCapsEnabled></a>

---

## settings.autoModAllCapsEnabled.title

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

## settings.autoModAllCapsMinCharacters.title

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

## settings.autoModAllCapsPercentageCaps.title

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

## settings.autoModDuplicateTextEnabled.title

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

## settings.autoModDuplicateTextTimeframeInSeconds.title

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

## settings.autoModQuickMessagesEnabled.title

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

## settings.autoModQuickMessagesNumberOfMessages.title

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

## settings.autoModQuickMessagesTimeframeInSeconds.title

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

## settings.autoModMentionUsersEnabled.title

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

## settings.autoModMentionUsersMaxNumberOfMentions.title

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

## settings.autoModMentionRolesEnabled.title

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

## settings.autoModMentionRolesMaxNumberOfMentions.title

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

## settings.autoModEmojisEnabled.title

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

## settings.autoModEmojisMaxNumberOfEmojis.title

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

## settings.autoModHoistEnabled.title

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

## settings.musicVolume.title

settings.musicVolume.description

Type: `Number`

Default: `100`

Reset to default:
`!config musicVolume default`

<a name=announceNextSong></a>

---

## settings.announceNextSong.title

settings.announceNextSong.description

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

## settings.announcementVoice.title

settings.announcementVoice.description

Type: `Enum<AnnouncementVoice>`

Default: `Joanna`

Reset to default:
`!config announcementVoice default`

Possible values: `Joanna`, `Salli`, `Kendra`, `Kimberly`, `Ivy`, `Matthew`, `Justin`, `Joey`

Example:

`!config announcementVoice Joanna`

<a name=fadeMusicOnTalk></a>

---

## settings.fadeMusicOnTalk.title

settings.fadeMusicOnTalk.description

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

## settings.fadeMusicEndDelay.title

settings.fadeMusicEndDelay.description

Type: `Number`

Default: `1`

Reset to default:
`!config fadeMusicEndDelay default`
