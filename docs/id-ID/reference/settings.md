# Configs

There are many config options that can be set. You don't have to set all of them. If you just added the bot, just run `!setup`, which will guide you through the most important ones.

## Overview

### General

| Setting                              | Description                                                |
| ------------------------------------ | ---------------------------------------------------------- |
| [Prefix](#prefix)                    | The prefix used to trigger bot commands.                   |
| [Language](#lang)                    | The language of the bot                                    |
| [Log Channel](#logchannel)           | The channel where bot actions are logged.                  |
| [Get Updates](#getupdates)           | Enable to receive development updates about InviteManager. |
| [Command channels](#channels)        | The channels in which the bot will react to commands.      |
| [Ignored channels](#ignoredchannels) | The channels in which the bot will ignore commands.        |

### Invites

#### General

| Setting                  | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| [Join Roles](#joinroles) | Roles that are assigned to all members when joining. |

#### Joins

| Setting                                | Description                                      |
| -------------------------------------- | ------------------------------------------------ |
| [Message](#joinmessage)                | The message sent when someone joins the server.  |
| [Message Channel](#joinmessagechannel) | The channel that the message on join is sent to. |

#### Leaves

| Setting                                                | Description                                                                             |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| [Message](#leavemessage)                               | The message sent when someone leaves the server.                                        |
| [Message Channel](#leavemessagechannel)                | The channel that the leave message is sent to.                                          |
| [Auto Subtract](#autosubtractleaves)                   | Automatically remove invites from the inviter when the invited user leaves.             |
| [Auto Subtract Threshold](#autosubtractleavethreshold) | The time in seconds for which a user has to stay in the server for the invite to count. |

#### Leaderboard

| Setting                                              | Description                                             |
| ---------------------------------------------------- | ------------------------------------------------------- |
| [Style](#leaderboardstyle)                           | The display style of the leaderboard.                   |
| [Hide left members](#hideleftmembersfromleaderboard) | Hide members that left the server from the leaderboard. |

#### Fakes

| Setting                             | Description                          |
| ----------------------------------- | ------------------------------------ |
| [Auto Subtract](#autosubtractfakes) | Automatically subtract fake invites. |

#### Ranks

| Setting                                          | Description                                                 |
| ------------------------------------------------ | ----------------------------------------------------------- |
| [Assignment Style](#rankassignmentstyle)         | How ranks are rewarded to users.                            |
| [Announcement Channel](#rankannouncementchannel) | The channel where users receiving a new rank are announced. |
| [Announcement Message](#rankannouncementmessage) | The message that is sent when a user receives a new rank.   |

### Moderation

#### Captcha

| Setting                                               | Description                                                                                   |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [Enabled](#captchaverificationonjoin)                 | Whether or not captcha verification is enabled.                                               |
| [Welcome Message](#captchaverificationwelcomemessage) | The message a user will get after joining a server and instructing them to enter the captcha. |
| [Success Message](#captchaverificationsuccessmessage) | The welcome message that will be sent to the user after he successfully verifies.             |
| [Failed Message](#captchaverificationfailedmessage)   | The message sent to the user if he enters an invalid captcha.                                 |
| [Verification Timeout](#captchaverificationtimeout)   | The time within which the captcha has to be entered successfully.                             |
| [Log Enabled](#captchaverificationlogenabled)         | Whether or not verification attempts will be logged.                                          |

#### General

| Setting                                                         | Description                                                                                                                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Enabled](#automodenabled)                                      | Automatically moderate messages (specific rules can also be turned on or off, this has to be ON for ANY rule to work).                                       |
| [Moderated Channels](#automodmoderatedchannels)                 | The list of moderated channels (this acts as a whitelist, leave empty to moderate all channels, or use `autoModIgnoredChannels` to ignore certain channels). |
| [Moderated Roles](#automodmoderatedroles)                       | The list of roles that are moderated (this acts as a whitelist, leave empty to moderate all roles, or use `autoModIgnoredRoles` to ignore certain roles).    |
| [Ignored Channels](#automodignoredchannels)                     | Channels that are ignored while automatically moderating.                                                                                                    |
| [Ignored Roles](#automodignoredroles)                           | Any members with these roles will not automatically be moderated.                                                                                            |
| [Muted Role](#mutedrole)                                        | The role that is given to people who are muted. Make sure this role is denied the "Send Message" permission.                                                 |
| [Disabled for Old Members](#automoddisabledforoldmembers)       | Disabled auto moderation for members that have been in your server for a long time.                                                                          |
| [Old Members Threshold](#automoddisabledforoldmembersthreshold) | The amount of time a member has to be in your server to be considered 'old'.                                                                                 |

#### Logging

| Setting                                                                | Description                                                               |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [Log Enabled](#automodlogenabled)                                      | Log any moderation actions that the bot makes.                            |
| [Mod Log Channel](#modlogchannel)                                      | The channel where moderation logs will be posted in.                      |
| [Delete Bot Messages](#automoddeletebotmessage)                        | Automatically delete the bots own messages (keeps your chat clean).       |
| [Delete Bot Message Timeout](#automoddeletebotmessagetimeoutinseconds) | The timeout after which bot messages are deleted.                         |
| [Delete Ban Messages](#modpunishmentbandeletemessage)                  | Whether or not "Ban" pushment messages will be deleted automatically.     |
| [Delete Kick Messages](#modpunishmentkickdeletemessage)                | Whether or not "Kick" pushment messages will be deleted automatically.    |
| [Delete Softban Messages](#modpunishmentsoftbandeletemessage)          | Whether or not "Softban" pushment messages will be deleted automatically. |
| [Delete Warn Messages](#modpunishmentwarndeletemessage)                | Whether or not "Warn" pushment messages will be deleted automatically.    |
| [Delete Mute Messages](#modpunishmentmutedeletemessage)                | Whether or not "Mute" pushment messages will be deleted automatically.    |

#### Invites

| Setting                           | Description                                                           |
| --------------------------------- | --------------------------------------------------------------------- |
| [Enabled](#automodinvitesenabled) | Automatically scan messages for discord invite links and remove them. |

#### Links

| Setting                                          | Description                                                                             |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| [Enabled](#automodlinksenabled)                  | Automatically remove messages containing links (you can set a whitelist and blacklist). |
| [Whitelist](#automodlinkswhitelist)              | A list of links that users are allowed to post.                                         |
| [Blacklist](#automodlinksblacklist)              | Blacklist certain links which users won't be able to post.                              |
| [Follow Redirects](#automodlinksfollowredirects) | Enable this to resolve redirects for links.                                             |

#### Banned Words

| Setting                             | Description                                             |
| ----------------------------------- | ------------------------------------------------------- |
| [Enabled](#automodwordsenabled)     | Whether or not blacklisted words will be automoderated. |
| [Blacklist](#automodwordsblacklist) | A list of words that are banned.                        |

#### Caps

| Setting                                          | Description                                                                                                       |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| [Enabled](#automodallcapsenabled)                | Automatically moderate messages with A LOT OF CAPS.                                                               |
| [Min. Characters](#automodallcapsmincharacters)  | The minimum amount of characters in a message to be considered for moderating (setting to '3' would ignore 'OK'). |
| [Percentage CAPs](#automodallcapspercentagecaps) | The percentage of characters of the message that have to be CAPs for the rule to trigger.                         |

#### Duplicate Messages

| Setting                                                         | Description                                                         |
| --------------------------------------------------------------- | ------------------------------------------------------------------- |
| [Enabled](#automodduplicatetextenabled)                         | Automatically moderate duplicate messages (copy-paste spam).        |
| [Timeframe in Seconds](#automodduplicatetexttimeframeinseconds) | The timeframe whithin which messages will be considered duplicates. |

#### Spam

| Setting                                                         | Description                                                                           |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [Enabled](#automodquickmessagesenabled)                         | Automatically moderate users sending a lot of messages in a short time.               |
| [# of Messages](#automodquickmessagesnumberofmessages)          | The number of messages that have to be sent within the timeframe to trigger the rule. |
| [Timeframe in Seconds](#automodquickmessagestimeframeinseconds) | The timeframe within which a user is allowed to send a maximum amount of messages.    |

#### Mentions

| Setting                                                      | Description                                                                |
| ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| [Enabled](#automodmentionusersenabled)                       | Automatically moderate messages that mention an excessive amount of users. |
| [Max # of Mentions](#automodmentionusersmaxnumberofmentions) | The maximum amount of users a member can mention in a message.             |
| [Enabled](#automodmentionrolesenabled)                       | Automatically moderate messages that mention an excessive amount of roles. |
| [Max # of Mentions](#automodmentionrolesmaxnumberofmentions) | The maximum amount of roles a member can mention in a message.             |

#### Emojis

| Setting                                            | Description                                                                                                               |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [Enabled](#automodemojisenabled)                   | Automatically moderate messages with an excessive amount of emojis.                                                       |
| [Max # of Emojis](#automodemojismaxnumberofemojis) | The maximum amount of emojis a message is allowed to have before trigger the rule.                                        |
| [Enabled](#automodhoistenabled)                    | Automatically give members nicknames if they try to hoist (use special characters to appear at the top of the user list). |

### Music

#### Music

| Setting                      | Description                                                        |
| ---------------------------- | ------------------------------------------------------------------ |
| [Music Volume](#musicvolume) | The default volume that is set when the bot joins a voice channel. |

#### Announcement

| Setting                                  | Description                                                            |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| [Announce Next Song](#announcenextsong)  | Whether or not the next song should be announced in the voice channel. |
| [Announcement Voice](#announcementvoice) | The voice used in the next song announcements.                         |

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

## Language

The language of the bot

Type: `Enum<Lang>`

Default: `en`

Reset to default:
`!config lang default`

Possible values: `ar`, `bg`, `cs`, `de`, `el`, `en`, `es`, `fr`, `hu`, `id_ID`, `it`, `ja`, `lt`, `nl`, `pl`, `pt`, `pt_BR`, `ro`, `ru`, `sr`, `tr`, `zh_CN`, `zh_TW`

Example:

`!config lang ar`

<a name=logChannel></a>

---

## Log Channel

The channel where bot actions are logged.

Type: `Channel`

Default: `null`

Reset to default:
`!config logChannel default`

Examples:

`!config logChannel #channel`

<a name=getUpdates></a>

---

## Get Updates

Enable to receive development updates about InviteManager.

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

## Command channels

The channels in which the bot will react to commands.

Type: `Channel[]`

Default: ``

Reset to default:
`!config channels default`

<a name=ignoredChannels></a>

---

## Ignored channels

The channels in which the bot will ignore commands.

Type: `Channel[]`

Default: ``

Reset to default:
`!config ignoredChannels default`

<a name=joinRoles></a>

---

## Join Roles

Roles that are assigned to all members when joining.

Type: `Role[]`

Default: ``

Reset to default:
`!config joinRoles default`

<a name=joinMessage></a>

---

## Message

The message sent when someone joins the server.

Type: `String`

Default: `{memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)`

Reset to default:
`!config joinMessage default`

<a name=joinMessageChannel></a>

---

## Message Channel

The channel that the message on join is sent to.

Type: `Channel`

Default: `null`

Reset to default:
`!config joinMessageChannel default`

Examples:

`!config joinMessageChannel #general`

`!config joinMessageChannel #joins`

<a name=leaveMessage></a>

---

## Message

The message sent when someone leaves the server.

Type: `String`

Default: `{memberName} **left**; Invited by **{inviterName}**`

Reset to default:
`!config leaveMessage default`

Examples:

`!config leaveMessage`

`!config leaveMessage`

<a name=leaveMessageChannel></a>

---

## Message Channel

The channel that the leave message is sent to.

Type: `Channel`

Default: `null`

Reset to default:
`!config leaveMessageChannel default`

Examples:

`!config leaveMessageChannel #general`

`!config leaveMessageChannel #leaves`

<a name=leaderboardStyle></a>

---

## Style

The display style of the leaderboard.

Type: `Enum<LeaderboardStyle>`

Default: `normal`

Reset to default:
`!config leaderboardStyle default`

Possible values: `normal`, `table`, `mentions`

Example:

`!config leaderboardStyle normal`

<a name=hideLeftMembersFromLeaderboard></a>

---

## Hide left members

Hide members that left the server from the leaderboard.

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

Automatically subtract fake invites.

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

Automatically remove invites from the inviter when the invited user leaves.

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

The time in seconds for which a user has to stay in the server for the invite to count.

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

How ranks are rewarded to users.

Type: `Enum<RankAssignmentStyle>`

Default: `all`

Reset to default:
`!config rankAssignmentStyle default`

Possible values: `all`, `highest`, `onlyAdd`

Example:

`!config rankAssignmentStyle all`

<a name=rankAnnouncementChannel></a>

---

## Announcement Channel

The channel where users receiving a new rank are announced.

Type: `Channel`

Default: `null`

Reset to default:
`!config rankAnnouncementChannel default`

Examples:

`!config rankAnnouncementChannel`

`!config rankAnnouncementChannel`

<a name=rankAnnouncementMessage></a>

---

## Announcement Message

The message that is sent when a user receives a new rank.

Type: `String`

Default: `Congratulations, **{memberMention}** has reached the **{rankName}** rank!`

Reset to default:
`!config rankAnnouncementMessage default`

Examples:

`!config rankAnnouncementMessage`

`!config rankAnnouncementMessage`

<a name=captchaVerificationOnJoin></a>

---

## Enabled

Whether or not captcha verification is enabled.

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

## Welcome Message

The message a user will get after joining a server and instructing them to enter the captcha.

Type: `String`

Default: `Welcome to the server **{serverName}**! For extra protection, new members are required to enter a captcha.`

Reset to default:
`!config captchaVerificationWelcomeMessage default`

Examples:

`!config captchaVerificationWelcomeMessage Welcome, please enter the captcha below!`

<a name=captchaVerificationSuccessMessage></a>

---

## Success Message

The welcome message that will be sent to the user after he successfully verifies.

Type: `String`

Default: `You have successfully entered the captcha. Welcome to the server!`

Reset to default:
`!config captchaVerificationSuccessMessage default`

Examples:

`!config captchaVerificationSuccessMessage Thanks for entering the captcha, enjoy our server!`

<a name=captchaVerificationFailedMessage></a>

---

## Failed Message

The message sent to the user if he enters an invalid captcha.

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

## Log Enabled

Whether or not verification attempts will be logged.

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

## Enabled

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

## Moderated Roles

The list of roles that are moderated (this acts as a whitelist, leave empty to moderate all roles, or use `autoModIgnoredRoles` to ignore certain roles).

Type: `Role[]`

Default: ``

Reset to default:
`!config autoModModeratedRoles default`

Examples:

`!config autoModModeratedRoles @NewMembers`

`!config autoModModeratedRoles @Newbies,@Starters`

<a name=autoModIgnoredChannels></a>

---

## Ignored Channels

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

## Ignored Roles

Any members with these roles will not automatically be moderated.

Type: `Role[]`

Default: ``

Reset to default:
`!config autoModIgnoredRoles default`

Examples:

`!config autoModIgnoredRoles @TrustedMembers`

`!config autoModIgnoredRoles @Moderators,@Staff`

<a name=mutedRole></a>

---

## Muted Role

The role that is given to people who are muted. Make sure this role is denied the "Send Message" permission.

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

## Delete Bot Messages

Automatically delete the bots own messages (keeps your chat clean).

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

## Delete Bot Message Timeout

The timeout after which bot messages are deleted.

Type: `Number`

Default: `5`

Reset to default:
`!config autoModDeleteBotMessageTimeoutInSeconds default`

Examples:

`!config autoModDeleteBotMessageTimeoutInSeconds 5`

`!config autoModDeleteBotMessageTimeoutInSeconds 10`

<a name=modPunishmentBanDeleteMessage></a>

---

## Delete Ban Messages

Whether or not "Ban" pushment messages will be deleted automatically.

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

## Delete Kick Messages

Whether or not "Kick" pushment messages will be deleted automatically.

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

## Delete Softban Messages

Whether or not "Softban" pushment messages will be deleted automatically.

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

## Delete Warn Messages

Whether or not "Warn" pushment messages will be deleted automatically.

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

## Delete Mute Messages

Whether or not "Mute" pushment messages will be deleted automatically.

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

## Enabled

Automatically scan messages for discord invite links and remove them.

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

## Enabled

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

## Whitelist

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

## Blacklist

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

## Follow Redirects

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

## Enabled

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

## Blacklist

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

## Enabled

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

## Enabled

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

## Timeframe in Seconds

The timeframe whithin which messages will be considered duplicates.

Type: `Number`

Default: `60`

Reset to default:
`!config autoModDuplicateTextTimeframeInSeconds default`

Examples:

`!config autoModDuplicateTextTimeframeInSeconds 5`

`!config autoModDuplicateTextTimeframeInSeconds 20`

<a name=autoModQuickMessagesEnabled></a>

---

## Enabled

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

## Enabled

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

## Enabled

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

## Enabled

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

## Max # of Emojis

The maximum amount of emojis a message is allowed to have before trigger the rule.

Type: `Number`

Default: `5`

Reset to default:
`!config autoModEmojisMaxNumberOfEmojis default`

Examples:

`!config autoModEmojisMaxNumberOfEmojis 5`

`!config autoModEmojisMaxNumberOfEmojis 10`

<a name=autoModHoistEnabled></a>

---

## Enabled

Automatically give members nicknames if they try to hoist (use special characters to appear at the top of the user list).

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

## Music Volume

The default volume that is set when the bot joins a voice channel.

Type: `Number`

Default: `100`

Reset to default:
`!config musicVolume default`

<a name=announceNextSong></a>

---

## Announce Next Song

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
