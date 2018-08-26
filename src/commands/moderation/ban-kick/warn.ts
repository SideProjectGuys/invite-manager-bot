import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { GuildMember, User } from 'discord.js';

import { IMClient } from '../../../client';
import { createEmbed, sendEmbed, sendReply } from '../../../functions/Messaging';
import { checkProBot, checkRoles } from '../../../middleware';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	joins,
	sequelize,
	strikeConfigs,
	strikes,
	ViolationType
} from '../../../sequelize';
import { BotCommand, CommandGroup, ModerationCommand, RP } from '../../../types';

const { localize, resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'warn',
			aliases: [],
			desc: 'Send warning to the user',
			usage: '<prefix>ban <user> <limit> <reason>',
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(ModerationCommand.warn))
	@using(resolve('user: Member, reason: String'))
	@using(expect('user: Member'))
	@using(localize)
	public async action(
		message: Message,
		[rp, user, reason]: [RP, GuildMember, string]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		if (this.client.config.ownerGuildIds.indexOf(message.guild.id) === -1) {
			return;
		}

		let nofStrikes = 2;

		let strikeConfig = await strikeConfigs.find({
			where: {
				violationType: ViolationType.warn
			}
		});

		await strikes.create({
			id: null,
			guildId: message.guild.id,
			memberId: user.id,
			amount: strikeConfig.amount,
			strikeConfigId: strikeConfig.id
		});

		let personalStrikes = await strikes.find({
			where: {
				guildId: message.guild.id,
				memberId: user.id
			}
		});

		console.log(personalStrikes);

		user.send(
			`You have been warned by ${message.author.username} because of the following reason: ${reason}\n` +
			`You now have ${nofStrikes} strikes.\n` +
			``
		);

		const embed = createEmbed(this.client);
		embed.setAuthor(`Warning sent to ${user.user.username}!`, user.user.avatarURL());
		embed.setDescription(`Reason: ${reason}`);
		sendReply(message, embed);
	}
}
