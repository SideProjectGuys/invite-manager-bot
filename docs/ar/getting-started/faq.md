# الأسئلة الشائعة}

## كيف أغير بريفكس البوت?

يمكنك القيام `!config prefix -` لتغيير البريفكس.

إذا كنت لا تعرف البريفكس الحالية الخاصة بك ، فيمكنك عمل بادئة تهيئة `@InviteManager config prefix` لرؤية البريفكس

## كيف أختار رسائل الدخول والخروج?

Set the channel by doing

`!config joinMessageChannel #channel`

or

`!config leaveMessageChannel #channel`.

After doing that, new joins and leaves will be posted to that channel.

## هل أستطيع أن اعدل على رسالة الدخول والخروج?

Absolutely! You can change the message by doing for example

`!config joinMessage {memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)`

or

`!config leaveMessage {memberName} **left**; Invited by **{inviterName}**`.

There are many placeholders available. You can see the full list on the '[Custom Messages](/ar/modules/invites/custom-messages.md)' page.

## ماهي ال`رتب` وكيف أستطيع استخدامها?

Ranks are used to assign roles to people when they reach a certain amount of invites. For example. if you have a role called `@Beginner` and you want people who have 5 or more invites to be added to that role, you would have to create a rank for that like so: `!add-rank @Beginner 5 (and if you want a description here)`. As soon as someone has 5 invites, he will automatically be added to that role!

## How can I disable the bot in all but one/some channels?

Take away the read message permissions in the channels where you don't want the bot to reply.

## Limitation: No advanced tracking before the bot joins

Advanced tracking (who invited who) only works after you have invited the bot. The bot will still know everyones invite count after you invite it, don't worry. Just the additional information is missing and can only be collected for members who join after you invited the bot.
