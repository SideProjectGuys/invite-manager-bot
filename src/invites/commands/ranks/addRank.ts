import { Message, Role } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { LogAction } from '../../../framework/models/Log';
import { NumberResolver, RoleResolver, StringResolver } from '../../../framework/resolvers';
import { CommandGroup, InvitesCommand } from '../../../types';

const MIN = -2147483648;
const MAX = 2147483647;

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: InvitesCommand.addRank,
			aliases: ['add-rank', 'set-rank', 'setRank'],
			args: [
				{
					name: 'role',
					resolver: RoleResolver,
					required: true
				},
				{
					name: 'invites',
					resolver: new NumberResolver(client, MIN, MAX),
					required: true
				},
				{
					name: 'info',
					resolver: StringResolver,
					rest: true
				}
			],
			group: CommandGroup.Ranks,
			guildOnly: true,
			defaultAdminOnly: true,
			extraExamples: ['!addRank @Role 5', '!addRank "Role with space" 10 Wow, already 10 people!']
		});
	}

	public async action(
		message: Message,
		[role, invites, description]: [Role, number, string],
		flags: {},
		{ guild, t, me }: Context
	): Promise<any> {
		await this.client.db.saveRoles([
			{
				id: role.id,
				name: role.name,
				guildId: role.guild.id,
				color: role.color.toString(16),
				createdAt: new Date(role.createdAt)
			}
		]);

		let myRole: Role;
		me.roles.forEach((r) => {
			const gRole = guild.roles.get(r);
			if (!myRole || gRole.position > myRole.position) {
				myRole = gRole;
			}
		});

		// Check if we are higher then the role we want to assign
		if (!myRole || myRole.position < role.position) {
			return this.sendReply(
				message,
				t('cmd.addRank.roleTooHigh', {
					role: role.name,
					myRole: myRole ? myRole.name : '<None>'
				})
			);
		}

		const ranks = await this.client.cache.ranks.get(guild.id);
		const rank = ranks.find((r) => r.roleId === role.id);
		const descr = description ? description : '';

		let isNew = false;
		if (rank) {
			rank.numInvites = invites;
			rank.description = descr;
			await this.client.db.saveRank(rank);
		} else {
			await this.client.db.saveRank({
				guildId: role.guild.id,
				roleId: role.id,
				numInvites: invites,
				description: descr
			});
			isNew = true;
		}

		await this.client.logAction(guild, message, isNew ? LogAction.addRank : LogAction.updateRank, {
			roleId: role.id,
			numInvites: invites,
			description
		});

		this.client.cache.ranks.flush(guild.id);

		if (!isNew) {
			return this.sendReply(
				message,
				t('cmd.addRank.updated', {
					role: `<@&${role.id}>`,
					invites,
					description
				})
			);
		} else {
			return this.sendReply(
				message,
				t('cmd.addRank.created', {
					role: `<@&${role.id}>`,
					invites,
					description
				})
			);
		}
	}
}
