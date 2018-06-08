import { Command, Logger, logger, Message } from '@yamdbf/core';

import { IMClient } from '../client';
import { CommandGroup, createEmbed, sendEmbed } from '../utils/util';

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'members',
			aliases: ['member', 'membersCount'],
			desc: 'Show member count of current server.',
			usage: '<prefix>members',
			group: CommandGroup.Other,
			guildOnly: true
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
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
		embed.addField('Members', guild.memberCount, true);
		embed.addField('Online', guild.memberCount - offlineCount, true);
		embed.addField('Humans', humanCount, true);
		embed.addField('Bots', botCount, true);
		embed.addField('Joined last 24h', joinedToday, true);
		embed.addField('Joined this week', joinedThisWeek, true);
		embed.addField('Joined this month', joinedThisMonth, true);
		embed.addBlankField(true);

		sendEmbed(message.channel, embed, message.author);
	}
}
