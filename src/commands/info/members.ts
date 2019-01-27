import { Message } from 'eris';

import { IMClient } from '../../client';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.members,
			aliases: ['member', 'membersCount'],
			group: CommandGroup.Info,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		flags: {},
		{ guild, t }: Context
	): Promise<any> {
		await guild.getRESTMembers();

		const ONE_SECOND = 1000;
		const ONE_MINUTE = 60 * ONE_SECOND;
		const ONE_HOUR = 60 * ONE_MINUTE;
		const ONE_DAY = 24 * ONE_HOUR;
		const ONE_WEEK = 7 * ONE_DAY;
		const ONE_MONTH = 4 * ONE_WEEK;
		const todayTimestamp = new Date().getTime();

		let botCount = guild.members.filter(m => m.user.bot).length;
		let humanCount = guild.memberCount - botCount;
		let offlineCount = guild.members.filter(m => m.status === 'offline').length;
		let joinedToday = guild.members.filter(
			m => todayTimestamp - m.joinedAt < ONE_DAY
		).length;
		let joinedThisWeek = guild.members.filter(
			m => todayTimestamp - m.joinedAt < ONE_WEEK
		).length;
		let joinedThisMonth = guild.members.filter(
			m => todayTimestamp - m.joinedAt < ONE_MONTH
		).length;

		const embed = this.createEmbed();
		embed.fields.push({
			name: t('cmd.members.members'),
			value: guild.memberCount.toString(),
			inline: true
		});
		embed.fields.push({
			name: t('cmd.members.online'),
			value: (guild.memberCount - offlineCount).toString(),
			inline: true
		});
		embed.fields.push({
			name: t('cmd.members.humans'),
			value: humanCount.toString(),
			inline: true
		});
		embed.fields.push({
			name: t('cmd.members.bots'),
			value: botCount.toString(),
			inline: true
		});
		embed.fields.push({
			name: t('cmd.members.joined.day'),
			value: joinedToday.toString(),
			inline: true
		});
		embed.fields.push({
			name: t('cmd.members.joined.week'),
			value: joinedThisWeek.toString(),
			inline: true
		});
		embed.fields.push({
			name: t('cmd.members.joined.month'),
			value: joinedThisMonth.toString(),
			inline: true
		});

		return this.sendReply(message, embed);
	}
}
