import { Command, CommandDecorators, Message, Middleware, Logger, logger } from 'yamdbf';
import { Role, User } from 'discord.js';
import { IMClient } from '../client';
import { ranks, customInvites, inviteCodes } from '../sequelize';
const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'add-invites',
			aliases: ['addInvites'],
			desc: 'Adds invites to a member',
			usage: '<prefix>add-invites @user amountOfInvites (reason)',
			info: '',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			guildOnly: true
		});
	}

	@using(resolve('user: User, amount: Number, ...reason: String'))
	@using(expect('user: User, amount: Number'))
	public async action(message: Message, [user, amount, reason]: [User, number, string]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		if (amount === 0) {
			message.channel.send(`Adding zero invites doesn't really make sense...`);
			return;
		}

		const invAmount = await inviteCodes.sum('uses', {
			where: {
				guildId: message.guild.id,
				inviterId: user.id,
			}
		}) || 0;
		const customInvAmount = await customInvites.sum('amount', {
			where: {
				guildId: message.guild.id,
				memberId: user.id,
			}
		}) || 0;
		const totalInvites = invAmount + customInvAmount + amount;

		await customInvites.create({
			guildId: message.guild.id,
			memberId: user.id,
			creatorId: message.author.id,
			amount,
			reason,
		});

		const msg = amount > 0 ? `Added **${amount}** invites for` : `Removed **${-amount}** invites from`;
		message.channel.send(msg + ` <@${user.id}>, now at: **${totalInvites}** invites`);
	}
}
