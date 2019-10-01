# Strikes

## What are strikes?

Strikes are points that users get for violating server rules. Every time the user receives a strike, he gets a personal message telling him how many strikes he has and why he got them. When a user reaches a certain amount of strikes, he will receive a **punishment**.

## What are violations?

Violations are auto-moderation rules that you can enable or disable on your server. Currently, the following violations exist:

- [invites](strikes.md#invites)
- [links](strikes.md#links)
- [words](strikes.md#words)
- [allCaps](strikes.md#allcaps)
- [duplicateText](strikes.md#duplicatetext)
- [quickMessages](strikes.md#quickmessages)
- [mentionUsers](strikes.md#mentionusers)
- [mentionRoles](strikes.md#mentionroles)
- [emojis](strikes.md#emojis)

For each of those violations, you have to define how many strikes will be given if someone violates it. You can do that by using the `strikeconfig` command:

```text
!strikeconfig <violationType> <numberOfStrikes>
```

For example, if you want users to get `2` strikes for violating the `invites` rule, then you would use the following command:

```text
!strikeconfig invites 2
```

You can check the current config by doing:

```text
!strikeconfig
```

## Detailed list of violations

### invites

This violation is triggered whenever the user posts an invite link to another discord server.

Example:

`!strikeconfig invites 1`

To delete the strike config:

`!strikeconfig invites 0`

**Config options:**

- [autoModInvitesEnabled](https://docs.invitemanager.co/bot/other/configs#automodinvitesenabled)

### links

This violation is triggered whenever the user posts a link.

Example:

`!strikeconfig links 1`

To delete the strike config:

`!strikeconfig links 0`

**Config options:**

- [autoModLinksEnabled](https://docs.invitemanager.co/bot/other/configs#automodlinksenabled)
- [autoModLinksWhitelist](https://docs.invitemanager.co/bot/other/configs#automodlinkswhitelist)
- [autoModLinksBlacklist](https://docs.invitemanager.co/bot/other/configs#automodlinksblacklist)
- [autoModLinksFollowRedirects](https://docs.invitemanager.co/bot/other/configs#automodlinksfollowredirects)

### words

This violation is triggered whenever the user posts blacklisted words.

Example:

`!strikeconfig words 1`

To delete the strike config:

`!strikeconfig words 0`

**Config options:**

- [autoModWordsEnabled](https://docs.invitemanager.co/bot/other/configs#automodwordsenabled)
- [autoModWordsBlacklist](https://docs.invitemanager.co/bot/other/configs#automodwordsblacklist)

### allCaps

This violation is triggered whenever the user posts a message that is mostly in CAPS.

Example:

`!strikeconfig allCaps 1`

To delete the strike config:

`!strikeconfig allCaps 0`

**Config options:**

- [autoModAllCapsEnabled](https://docs.invitemanager.co/bot/other/configs#automodallcapsenabled)
- [autoModAllCapsMinCharacters](https://docs.invitemanager.co/bot/other/configs#automodallcapsmincharacters)
- [autoModAllCapsPercentageCaps](https://docs.invitemanager.co/bot/other/configs#automodallcapspercentagecaps)

### duplicateText

This violation is triggered whenever the user posts the same text multiple times.

Example:

`!strikeconfig duplicateText 1`

To delete the strike config:

`!strikeconfig duplicateText 0`

**Config options:**

- [autoModDuplicateTextEnabled](https://docs.invitemanager.co/bot/other/configs#automodduplicatetextenabled)
- [autoModDuplicateTextTimeframeInSeconds](https://docs.invitemanager.co/bot/other/configs#automodduplicatetexttimeframeinseconds)

### quickMessages

This violation is triggered whenever the user quickly posts messages.

Example:

`!strikeconfig quickMessages 1`

To delete the strike config:

`!strikeconfig quickMessages 0`

**Config options:**

- [autoModQuickMessagesEnabled](https://docs.invitemanager.co/bot/other/configs#automodquickmessagesenabled)
- [autoModQuickMessagesNumberOfMessages](https://docs.invitemanager.co/bot/other/configs#automodquickmessagesnumberofmessages)
- [autoModQuickMessagesTimeframeInSeconds](https://docs.invitemanager.co/bot/other/configs#automodquickmessagestimeframeinseconds)

### mentionUsers

This violation is triggered whenever the user mentions mutliple users.

Example:

`!strikeconfig mentionUsers 1`

To delete the strike config:

`!strikeconfig mentionUsers 0`

**Config options:**

- [autoModMentionUsersEnabled](https://docs.invitemanager.co/bot/other/configs#automodmentionusersenabled)
- [autoModMentionUsersMaxNumberOfMentions](https://docs.invitemanager.co/bot/other/configs#automodmentionusersmaxnumberofmentions)

### mentionRoles

This violation is triggered whenever the user mentions mutliple roles.

Example:

`!strikeconfig mentionRoles 1`

To delete the strike config:

`!strikeconfig mentionRoles 0`

**Config options:**

- [autoModMentionRolesEnabled](https://docs.invitemanager.co/bot/other/configs#automodmentionrolesenabled)
- [autoModMentionRolesMaxNumberOfMentions](https://docs.invitemanager.co/bot/other/configs#automodmentionrolesmaxnumberofmentions)

### emojis

This violation is triggered whenever the user posts multiple emojis.

Example:

`!strikeconfig emojis 1`

To delete the strike config:

`!strikeconfig emojis 0`

**Config options:**

- [autoModEmojisEnabled](https://docs.invitemanager.co/bot/other/configs#automodemojisenabled)
- [autoModEmojisMaxNumberOfEmojis](https://docs.invitemanager.co/bot/other/configs#automodemojismaxnumberofemojis)
