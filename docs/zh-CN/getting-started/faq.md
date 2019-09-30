# 问与答}

## 我该如何更改机器人前缀？

你可以使用 `!config prefix -` 来更改前缀。

如果你不知道前缀是什么，你可以使用 `@InviteManager config prefix` 来查看前缀。

## 我该如何设定加入与离开讯息？

要设定频道使用

`!config joinMessageChannel #channel`

或

`!config leaveMessageChannel #channel`.

之后，新的加入及离开讯息将会发布到那个频道。

## Can I customize the join and leave messages?

Absolutely! You can change the message by doing for example

`!config joinMessage {memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)`

or

`!config leaveMessage {memberName} **left**; Invited by **{inviterName}**`.

There are many placeholders available. You can see the full list on the '[Custom Messages](/zh-CN/modules/invites/custom-messages.md)' page.

## What are 'Ranks' and how can I use them?

Ranks are used to assign roles to people when they reach a certain amount of invites. For example. if you have a role called `@Beginner` and you want people who have 5 or more invites to be added to that role, you would have to create a rank for that like so: `!add-rank @Beginner 5 (and if you want a description here)`. As soon as someone has 5 invites, he will automatically be added to that role!

## How can I disable the bot in all but one/some channels?

Take away the read message permissions in the channels where you don't want the bot to reply.

## Limitation: No advanced tracking before the bot joins

Advanced tracking (who invited who) only works after you have invited the bot. The bot will still know everyones invite count after you invite it, don't worry. Just the additional information is missing and can only be collected for members who join after you invited the bot.
