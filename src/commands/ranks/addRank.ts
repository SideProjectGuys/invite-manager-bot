import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { Role } from 'discord.js';

import { IMClient } from '../../client';
import { checkProBot, checkRoles } from '../../middleware';
import { LogAction, ranks, roles } from '../../sequelize';
import { BotCommand, CommandGroup, RP } from '../../types';
import { sendReply } from '../../functions/Messaging';

const { resolve, expect, localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'add-rank',
			aliases: ['addRank', 'set-rank', 'setRank'],
			desc: 'Add a new rank',
			usage: '<prefix>add-rank @role invites (info)',
			info:
				'`@role`:\n' +
				'The role which the user will receive when reaching this rank\n\n' +
				'`invites`:\n' +
				'The amount of invites needed to reach the rank\n\n' +
				'`info`:\n' +
				'A decription that users will see so they know more about this rank\n\n',
			group: CommandGroup.Ranks,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.addRank))
	@using(resolve('role: Role, invites: Number, ...description: String'))
	@using(expect('role: Role, invites: Number'))
	@using(localize)
	public async action(
		message: Message,
		[rp, role, invites, description]: [RP, Role, number, string]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		await roles.insertOrUpdate({
			id: role.id,
			name: role.name,
			guildId: role.guild.id,
			color: role.hexColor,
			createdAt: role.createdAt
		});

		const myRole = message.guild.me.roles.highest;
		// Check if we are higher then the role we want to assign
		if (myRole.comparePositionTo(role) < 0) {
			return sendReply(
				message,
				rp.CMD_ADDRANK_ROLE_TOO_HIGH({ role: role.name, myRole: myRole.name })
			);
			return;
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
				message,
				rp.CMD_ADDRANK_UPDATED({
					role: role.name,
					invites,
					description
				})
			);
		} else {
			return sendReply(
				message,
				rp.CMD_ADDRANK_CREATED({
					role: role.name,
					invites,
					description
				})
			);
		}
	}
}
