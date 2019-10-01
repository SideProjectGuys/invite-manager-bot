# 常見問題}

## 我如何更改機器人的前綴指令？

您可以用`!config prefix -`來更改前綴指令。

如果您不知道當前的前綴指令，您可以用`@InviteManager config prefix`來得知前綴指令。

## 我如何設定加入和離開訊息？

設定頻道用

`!config joinMessageChannel #channel`

或

`!config leaveMessageChannel #channel`。

設定完之後，新的加入和離開訊息就會被顯示在該頻道。

## 我可以製作加入和離開訊息嗎？

絕對可以！你可以更改訊息操作範例

`!config joinMessage {memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)`

或

`!config leaveMessage {memberName} **left**; Invited by **{inviterName}**`。

有很多預留字是可用的。你可以看到完整的清單在'[Custom Messages](/zh-TW/modules/invites/custom-messages.md)'頁面。

## 甚麼是'等級'然後我要如何使用它們？

等級用於分配身分組給人們當他們達到一定數量的邀請。例如，如果您有一個身分組叫做`@Beginner`然後您希望當人們達到 5 以上的邀請數量時被加入該身分組，您需要為此創立一個等級就像這樣：`!add-rank @Beginner 5 （然後如果您需要一個敘述可以寫在此）`。只要有人達到 5 邀請時，他就會自動被加入該身分組！

## How can I disable the bot in all but one/some channels?

Take away the read message permissions in the channels where you don't want the bot to reply.

## Limitation: No advanced tracking before the bot joins

Advanced tracking (who invited who) only works after you have invited the bot. The bot will still know everyones invite count after you invite it, don't worry. Just the additional information is missing and can only be collected for members who join after you invited the bot.
