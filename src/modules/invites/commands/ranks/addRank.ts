import { Message, Role } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import {
	NumberResolver,
	RoleResolver,
	StringResolver
} from '../../../../framework/resolvers';
import { LogAction, ranks, roles } from '../../../../sequelize';
import { CommandGroup, InvitesCommand } from '../../../../types';

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
					resolver: NumberResolver,
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
			strict: true,
			extraExamples: [
				'!addRank @Role 5',
				'!addRank "Role with space" 10 Wow, already 10 people!'
			]
		});
	}

	public async action(
		message: Message,
		[role, invites, description]: [Role, number, string],
		flags: {},
		{ guild, t, me }: Context
	): Promise<any> {
		await roles.insertOrUpdate({
			id: role.id,
			name: role.name,
			guildId: role.guild.id,
			color: role.color.toString(16),
			createdAt: role.createdAt
		});

		let myRole: Role;
		me.roles.forEach(r => {
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

		let rank = await ranks.find({
			where: {
				guildId: role.guild.id,
				roleId: role.id
			},
			paranoid: false // Turn off paranoid mode, because if this rank already exists we need to reuse it
		});

		const descr = description ? description : '';

		let isNew = false;
		if (rank) {
			if (rank.deletedAt !== null) {
				isNew = true;
			}
			rank.numInvites = invites;
			rank.description = descr;
			rank.setDataValue('deletedAt', null);
			rank.save();
		} else {
			rank = await ranks.create({
				id: null,
				guildId: role.guild.id,
				roleId: role.id,
				numInvites: invites,
				description: descr,
				deletedAt: null
			});
			isNew = true;
		}

		this.client.logAction(
			guild,
			message,
			isNew ? LogAction.addRank : LogAction.updateRank,
			{
				rankId: rank.id,
				roleId: role.id,
				numInvites: invites,
				description
			}
		);

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
