import { RichEmbed } from 'discord.js';
import { Client, Command, Logger, logger, Message } from 'yamdbf';

import { CommandGroup, createEmbed } from '../utils/util';

export default class extends Command<Client> {
	@logger('Command')
	private readonly _logger: Logger;

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
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		message.guild.fetchMembers().then(guild => {
			const ONE_SECOND = 1000;
			const ONE_MINUTE = 60 * ONE_SECOND;
			const ONE_HOUR = 60 * ONE_MINUTE;
			const ONE_DAY = 24 * ONE_HOUR;
			const ONE_WEEK = 7 * ONE_DAY;
			const ONE_MONTH = 4 * ONE_WEEK;
			const todayTimestamp = new Date().getTime();

			let botCount = guild.members.filter(m => m.user.bot).size;
			let humanCount = guild.memberCount - botCount;
			let offlineCount = guild.members.filter(m => m.presence.status === 'offline').size;
			let joinedToday = guild.members.filter(m => todayTimestamp - m.joinedTimestamp < ONE_DAY).size;
			let joinedThisWeek = guild.members.filter(m => todayTimestamp - m.joinedTimestamp < ONE_WEEK).size;
			let joinedThisMonth = guild.members.filter(m => todayTimestamp - m.joinedTimestamp < ONE_MONTH).size;

			const embed = new RichEmbed();
			embed.addField('Members', guild.memberCount, true);
			embed.addField('Online', guild.memberCount - offlineCount, true);
			embed.addField('Humans', humanCount, true);
			embed.addField('Bots', botCount, true);
			embed.addField('Joined last 24h', joinedToday, true);
			embed.addField('Joined this week', joinedThisWeek, true);
			embed.addField('Joined this month', joinedThisMonth, true);
			embed.addBlankField(true);
			createEmbed(message.client, embed);

			message.channel.send({ embed });
		}).catch(console.error);
	}
}
