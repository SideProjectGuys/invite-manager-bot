import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { checkProBot } from '../../middleware';
import { checkRoles } from '../../middleware/CheckRoles';
import { BotCommand, CommandGroup, RP } from '../../types';

const { localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'members',
			aliases: ['member', 'membersCount'],
			desc: 'Show member count of current server.',
			usage: '<prefix>members',
			group: CommandGroup.Info,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.members))
	@using(localize)
	public async action(message: Message, [rp]: [RP]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const guild = message.guild;
		await guild.members.fetch();

		const ONE_SECOND = 1000;
		const ONE_MINUTE = 60 * ONE_SECOND;
		const ONE_HOUR = 60 * ONE_MINUTE;
		const ONE_DAY = 24 * ONE_HOUR;
		const ONE_WEEK = 7 * ONE_DAY;
		const ONE_MONTH = 4 * ONE_WEEK;
		const todayTimestamp = new Date().getTime();

		let botCount = guild.members.filter(m => m.user.bot).size;
		let humanCount = guild.memberCount - botCount;
		let offlineCount = guild.members.filter(
			m => m.presence.status === 'offline'
		).size;
		let joinedToday = guild.members.filter(
			m => todayTimestamp - m.joinedTimestamp < ONE_DAY
		).size;
		let joinedThisWeek = guild.members.filter(
			m => todayTimestamp - m.joinedTimestamp < ONE_WEEK
		).size;
		let joinedThisMonth = guild.members.filter(
			m => todayTimestamp - m.joinedTimestamp < ONE_MONTH
		).size;

		const embed = createEmbed(this.client);
		embed.addField(rp.CMD_MEMBERS_MEMBERS(), guild.memberCount, true);
		embed.addField(
			rp.CMD_MEMBERS_ONLINE(),
			guild.memberCount - offlineCount,
			true
		);
		embed.addField(rp.CMD_MEMBERS_HUMANS(), humanCount, true);
		embed.addField(rp.CMD_MEMBERS_BOTS(), botCount, true);
		embed.addField(rp.CMD_MEMBERS_JOINED_DAY(), joinedToday, true);
		embed.addField(rp.CMD_MEMBERS_JOINED_WEEK(), joinedThisWeek, true);
		embed.addField(rp.CMD_MEMBERS_JOINED_MONTH(), joinedThisMonth, true);
		embed.addBlankField(true);

		return sendReply(message, embed);
	}
}
