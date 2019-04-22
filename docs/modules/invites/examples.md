# Examples

### Normal

`!config joinMessage {memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)`

`!config leaveMessage {memberName} **left** after {joinedAt:duration} on this server; Invited by **{inviterName}**`

### Embed \(Premium\)

{% tabs %}
{% tab title="Screenshot" %}
![Join Embed](../../assets/join-message-premium-example1.png)
{% endtab %}

{% tab title="Code" %}
`{ "color": "#5cd65c", "author": { "name": "{memberName} joined!", "icon_url": "{memberImage}" }, "fields": [ { "name": "Account created", "value": "{memberCreated:timeAgo}", "inline": true }, { "name": "First joined", "value": "{firstJoin:date}", "inline": true }, { "name": "Number of joins", "value": "{numJoins}", "inline": true }, { "name": "Invited by", "value": "{inviterMention}\n{numInvites} (regular: {numRegularInvites}, bonus: {numBonusInvites}, fake: {numFakeInvites}, leave: {numLeaveInvites})" }, { "name": "Invite Code", "value": "{inviteCode} in channel {channelMention}" }, { "name": "Total Member Count", "value": "{memberCount}" } ] }`
{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Screenshot" %}
![Leave Embed](../../assets/leave-message-premium-example1.png)

{% endtab %}

{% tab title="Code" %}
`{ "color": "#d65c5c", "author": { "name": "{memberName} left!", "icon_url": "{memberImage}" }, "fields": [ { "name": "Time on server", "value": "{joinedAt:duration}", "inline": true }, { "name": "First joined", "value": "{firstJoin:date}", "inline": true }, { "name": "Number of joins", "value": "{numJoins}", "inline": true }, { "name": "Invited by", "value": "{inviterMention}\n{numInvites} (regular: {numRegularInvites}, bonus: {numBonusInvites}, fake: {numFakeInvites}, leave: {numLeaveInvites})" }, { "name": "Invite Code", "value": "{inviteCode} in channel {channelMention}" }, { "name": "Total Member Count", "value": "{memberCount}" } ] }`
{% endtab %}
{% endtabs %}
