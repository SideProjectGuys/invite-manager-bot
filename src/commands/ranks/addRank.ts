import { Message, Role } from 'eris';
import { getRepository, Repository } from 'typeorm';

import { IMClient } from '../../client';
import { LogAction } from '../../models/Log';
import { Rank } from '../../models/Rank';
import { Role as DBRole } from '../../models/Role';
import { NumberResolver, RoleResolver, StringResolver } from '../../resolvers';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	private rolesRepo: Repository<DBRole>;
	private ranksRepo: Repository<Rank>;

	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.addRank,
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
			strict: true
		});

		this.rolesRepo = getRepository(DBRole);
		this.ranksRepo = getRepository(Rank);
	}

	public async action(
		message: Message,
		[role, invites, description]: [Role, number, string],
		{ guild, t, me }: Context
	): Promise<any> {
		await this.rolesRepo.save({
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
			return this.sendReply(
				message,
				t('cmd.addRank.roleTooHigh', { role: role.name, myRole: myRole.name })
			);
		}

		let rank = await this.ranksRepo.findOne({
			where: {
				guildId: role.guild.id,
				roleId: role.id
			}
		});

		const descr = description ? description : '';

		let isNew = false;
		if (rank) {
			if (rank.deletedAt !== null) {
				isNew = true;
			}
			rank.numInvites = invites;
			rank.description = descr;
			rank.deletedAt = null;
		} else {
			rank = this.ranksRepo.create({
				guildId: role.guild.id,
				roleId: role.id,
				numInvites: invites,
				description: descr
			});
			isNew = true;
		}

		await this.ranksRepo.save(rank);

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
