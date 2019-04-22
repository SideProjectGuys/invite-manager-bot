---
description: You can customise the join and leave messages with a number of parameters.
---

(Jump to [placeholders](#placeholders))

# Custom Messages

You can set a custom join or leave message by setting the config:

```
!config joinMessage This is your custom join message! It will be posted every time someone joins your server.
```

or

```
!config leaveMessage This is your custom leave message! It will be posted every time someone leaves your server.
```

A message like that obviously doesn't make sense. You should personalise it with information about the new member, inviter or the server. Please see the list below for all available placeholders.

So if we want the message to say

`Welcome @Andy! You were invited by Valandur, who now has 3 invites! Have fun on our server!`

we can easily do that by replacing all the names and the number with placeholders:

`Welcome {memberMention}! You were invited by {inviterName}, who now has {numInvites} invites! Have fun on our server!`

So you can now do `!config joinMessage <message from above>` to set the message. Our bot will automatically replace the placeholders every time someone joins.

> [!NOTE|style:flat]
> Premium users can also use embeds in their join and leave messages. [More info here](modules/invites/examples.md)

Please see the [examples page](modules/invites/examples.md) to see what kind of messages you can make!

### Placeholders

|                          | join | leave | example       | description                                                                               |
| :----------------------- | :--- | :---- | :------------ | :---------------------------------------------------------------------------------------- |
| {memberName}             | yes  | yes   | Andy          | The name of the member that just joined your discord server                               |
| {memberId}               | yes  | yes   | 436844634     | The discord ID of the member that just joined your server                                 |
| {memberMention}          | yes  | no    | @Andy         | The mention of the member that just joined your discord server \(person will be pinged\). |
| {memberFullName}         | yes  | yes   | Andy\#1801    | The username and discriminator of the user that just joined your server                   |
| {memberImage}            | yes  | yes   | \[URL\]       | URL of the avatar of the member                                                           |
| {inviterName}            | yes  | yes   | Andy          | The name of the inviter                                                                   |
| {inviterId}              | yes  | yes   | 241929953     | The discord ID of the inviter                                                             |
| {inviterMention}         | yes  | yes   | @Andy         | The mention of the inviter \(person will be pinged\)                                      |
| {inviterFullName}        | yes  | yes   | Andy\#1801    | The username and discriminator of the inviter                                             |
| {inviterImage}           | yes  | yes   | \[URL\]       | URL of the avatar of the inviter                                                          |
| {numInvites}             | yes  | yes   | 12            | Number of invites the inviter has in total                                                |
| {numRegularInvites}      | yes  | yes   | 7             | Number of invites the inviter has through regular invites                                 |
| {numBonusInvites}        | yes  | yes   | 5             | Number of invites the inviter has as a bonus \(they were assigned manually\)              |
| {numFakeInvites}         | yes  | yes   | 3             | Number of fake invites the inviter has                                                    |
| {numLeaveInvites}        | yes  | yes   | 6             | Number of invites that were removed because the member left again.                        |
| {memberCount}            | yes  | yes   | 42            | Number of members your server has in total                                                |
| {numJoins}               | yes  | yes   | 3             | Number of times the user has joined the server                                            |
| {channelName}            | yes  | yes   | general       | The name of the channel where the invite code was created                                 |
| {channelMention}         | yes  | yes   | \#general     | Mention of the channel where the invite code was created                                  |
| {inviteCode}             | yes  | yes   | fgSr30s       | Invite code used                                                                          |
| {memberCreated:date}     | yes  | yes   | 25.09.2016    | Date the discord user was created                                                         |
| {memberCreated:duration} | yes  | yes   | 5 weeks       | Duration since the discord user was created                                               |
| {memberCreated:timeAgo}  | yes  | yes   | 2 day ago     | Time the discord user was created                                                         |
| {firstJoin:date}         | yes  | yes   | 11.12.2017    | Date the user joined the server for the first time                                        |
| {firstJoin:duration}     | yes  | yes   | 4 days        | Duration since the user joined the server for the first time                              |
| {firstJoin:timeAgo}      | yes  | yes   | 1 week ago    | Time the user joined the server for the first time                                        |
| {previousJoin:date}      | yes  | no    | 02.04.2018    | Date when the user joined the server the last time                                        |
| {previousJoin:duration}  | yes  | no    | 2 months      | Duration since when the user joined the server the last time                              |
| {previousJoin:timeAgo}   | yes  | no    | 1 second ago  | Time when the user joined the server the last time                                        |
| {joinedAt:date}          | no   | yes   | 17.05.2018    | Date when the user joined                                                                 |
| {joinedAt:duration}      | no   | yes   | 3 minutes     | Duration since when the user joined                                                       |
| {joinedAt:timeAgo}       | no   | yes   | 2 minutes ago | Time when the user joined                                                                 |
