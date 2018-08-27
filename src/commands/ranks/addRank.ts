import { Message, Role } from 'eris';

import { IMClient } from '../../client';
import { sendReply } from '../../functions/Messaging';
import { NumberResolver, RoleResolver, StringResolver } from '../../resolvers';
import { LogAction, ranks, roles } from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.addRank,
			aliases: ['add-rank', 'set-rank', 'setRank'],
			desc: 'Add a new rank',
			args: [
				{
					name: 'role',
					resolver: RoleResolver,
					description:
						'The role which the user will receive when reaching this rank',
					required: true
				},
				{
					name: 'invites',
					resolver: NumberResolver,
					description: 'The amount of invites needed to reach the rank',
					required: true
				},
				{
					name: 'info',
					resolver: StringResolver,
					description:
						'A description that users will see so they know more about this rank'
				}
			],
			group: CommandGroup.Ranks,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[role, invites, description]: [Role, number, string],
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
		if (myRole.position < role.position) {
			return sendReply(
				this.client,
				message,
				t('cmd.addRank.roleTooHigh', { role: role.name, myRole: myRole.name })
			);
		}

		let rank = await ranks.find({
			where: {
				guildId: role.guild.id,
				roleId: role.id
			},
			paranoid: false // Turn off paranoid mode, because if this rank already exists we need to reuse it
		});

		let isNew = false;
		if (rank) {
			if (rank.deletedAt !== null) {
				isNew = true;
			}
			rank.numInvites = invites;
			rank.description = description;
			rank.setDataValue('deletedAt', null);
			rank.save();
		} else {
			rank = await ranks.create({
				id: null,
				guildId: role.guild.id,
				roleId: role.id,
				numInvites: invites,
				description,
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

		if (!isNew) {
			return sendReply(
				this.client,
				message,
				t('cmd.addRank.updated', {
					role: role.name,
					invites,
					description
				})
			);
		} else {
			return sendReply(
				this.client,
				message,
				t('cmd.addRank.created', {
					role: role.name,
					invites,
					description
				})
			);
		}
	}
}
