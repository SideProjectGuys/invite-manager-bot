const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('../config_invitemanager.json');

client.on('ready', () => {
  //client.user.setGame(`on ${client.guilds.size} servers`);
  client.guilds.forEach(g => {
    console.log(g.id, g.name, g.memberCount);
  })

  let guild = client.guilds.get('403289272548851714');
  guild.fetchInvites().then(invs => {
    // console.log(invs.map(i => i.inviter));
  });
});

client.on('message', message => {
  console.log(message.content);
});

client.login(config.discordToken);