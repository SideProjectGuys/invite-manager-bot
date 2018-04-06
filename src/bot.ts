import { IMClient } from './client';
import { sequelize } from './sequelize';

process.on('unhandledRejection', (reason: any, p: any) => {
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

const client = new IMClient();

console.log('Syncing database...');
sequelize.sync({ alter: true }).then(() => {
	console.log('Starting bot...');
	client.start();
});

/*client.on('guildMemberAdd', async member => {
	let storage: GuildStorage = client.storage.guilds.get(member.guild.id);
	let settings: GuildSettings = storage.settings;
	let joinChannel = await settings.get(EStrings.JOIN_MESSAGE_CHANNEL);
	let oldInvitesCount = await storage.get(EStrings.LAST_SAVED_GUILD_INVITES);
	if (!oldInvitesCount) { oldInvitesCount = {}; }

	member.guild.fetchInvites().then(async invs => {
		let newInvitesCount = getInviteCounts(invs);
		let inviteOwners = getInviteOwners(invs);
		await storage.set(EStrings.LAST_SAVED_GUILD_INVITES, newInvitesCount);

		let inviteCodesUsed: string[] = compareInvites(oldInvitesCount, newInvitesCount);

		let joins = await storage.get(`members.${member.id}.joins`);
		let newJoin = { timestamp: member.joinedTimestamp, inviteCodesUsed: inviteCodesUsed };
		if (joins) {
			joins.push(newJoin);
		} else {
			joins = [newJoin];
		}
		await storage.set(`members.${member.id}.joins`, joins);
		let oldInviteOwners = await storage.get(EStrings.ALL_INVITE_CODES); // Get the old invites
		if (!oldInviteOwners) { oldInviteOwners = {}; }
		Object.assign(oldInviteOwners, inviteOwners); // Add new invite codes
		await storage.set(EStrings.ALL_INVITE_CODES, oldInviteOwners); // Save back all codes

		let invitedBy = invs.find(inv => inv.code === inviteCodesUsed[0]);
		if (invitedBy) {
			if (invitedBy.inviter) {
				console.log(member.guild.name + ': ' + member.user.username + ' was invited by ' + invitedBy.inviter.username);

				invs = invs.filter(i => !i.temporary);
				invs = invs.filter(i => !!i.inviter); // Need to have valid inviter or we ignore it
				let personalInvites = invs.filter(i => i.inviter.id === invitedBy.inviter.id);
				let personalInvitesCount = personalInvites.reduce((a, b) => a + b.uses, 0);

				let ranks: IRank[] = await settings.get('ranks');

				if (!ranks) {
					ranks = [];
				}

				// let nextRankName = '';
				let nextRank: IRank = null;

				let rolesToAdd: string[] = [];
				let inviter = member.guild.members.get(invitedBy.inviter.id);
				ranks.forEach(r => {
					let role = member.guild.roles.get(r.roleid);
					if (role) {
						if (r.invitesNeeded <= personalInvitesCount) { // Rank needs less/equal invites, so we add add role
							if (!inviter.roles.has(role.id)) {
								rolesToAdd.push(role.id);
							}
						} else { // Rank requires more invites
							if (nextRank) {
								if (r.invitesNeeded < nextRank.invitesNeeded) { // Next rank is the one with lowest invites needed
									nextRank = r;
									// nextRankName = role.name;
								}
							} else {
								nextRank = r;
								// nextRankName = role.name;
							}
						}
					} else {
						console.log('ROLE DOESNT EXIST');
					}
				});

				if (rolesToAdd.length > 0) {
					inviter.addRoles(rolesToAdd);
				}
				// let nextRankPointsDiff = nextRank.invitesNeeded - personalInvitesCount;

				if (joinChannel) {
					// tslint:disable-next-line
					let inviteChannel = <TextChannel>member.guild.channels.get(joinChannel);
					inviteChannel.send(`<@${member.user.id}> was invited by ${invitedBy.inviter.username} 
						(${personalInvitesCount} invites)`);
				}
			} else {
				console.log(`${invitedBy.code} does not have an inviter!`);
			}
		}
	}).catch(e => {
		console.log(`ERROR in EVENT(guildMemberAdd):${member.guild.id},${member.guild.name}`, e);
	});
});*/
