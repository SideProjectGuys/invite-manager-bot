import { RichEmbed } from 'discord.js';
import { Client, Command, CommandDecorators, GuildStorage, Logger, logger, Message, Middleware } from 'yamdbf';

import { inviteCodes, joins, members, sequelize } from '../sequelize';
import { CommandGroup, createEmbed, showPaginated } from '../utils/util';

const { resolve } = Middleware;
const { using } = CommandDecorators;

const usersPerPage = 20;

export default class extends Command<Client> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'fake',
			aliases: ['fakes', 'cheaters', 'cheater', 'invalid'],
			desc: 'Help find users trying to cheat.',
			usage: '<prefix>fake (page)',
			info: '`' +
				'page  Which page of the fake list to get.\n' +
				'`',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Admin,
			guildOnly: true
		});
	}

	@using(resolve('page: Number'))
	public async action(message: Message, [_page]: [number]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		const js = await joins.findAll({
			attributes: [
				'memberId',
				[sequelize.fn('COUNT', sequelize.col('join.id')), 'totalJoins'],
				[sequelize.fn('GROUP_CONCAT', sequelize.literal('`exactMatch`.`inviterId` SEPARATOR \',\'')), 'inviterIds'],
			],
			where: {
				guildId: message.guild.id
			},
			group: ['join.memberId'],
			include: [
				{
					attributes: [],
					model: members,
					required: true,
				},
				{
					attributes: [],
					model: inviteCodes,
					as: 'exactMatch',
					required: true,
				}
			],
			raw: true,
		});

		if (js.length <= 0) {
			message.channel.send(`No fake invites detected so far.`);
			return;
		}

		const suspiciousJoins = js
			.filter((j: any) => parseInt(j.totalJoins, 10) > 1)
			.sort((a: any, b: any) => parseInt(a.totalJoins, 10) - parseInt(b.totalJoins, 10));

		if (suspiciousJoins.length === 0) {
			message.channel.send(`There have been no fake invites since the bot has been added to this server.`);
			return;
		}

		const maxPage = Math.ceil(suspiciousJoins.length / usersPerPage);
		const p = Math.max(Math.min(_page ? _page - 1 : 0, maxPage - 1), 0);

		showPaginated(this.client, message, p, maxPage, page => {
			let description = '';

			suspiciousJoins.slice(page * usersPerPage, (page + 1) * usersPerPage).forEach((join: any) => {
				const invs: { [x: string]: number } = {};
				join.inviterIds.split(',').forEach((id: string) => {
					if (invs[id]) {
						invs[id]++;
					} else {
						invs[id] = 1;
					}
				});
				const invText = Object.keys(invs).map(id => {
					const timesText = invs[id] > 1 ? ` (**${invs[id]}** times)` : '';
					return `<@${id}>${timesText}`;
				}).join(', ');
				let newFakeText = `<@${join.memberId}> joined **${join.totalJoins} times**, invited by: ${invText}\n`;
				if (description.length + newFakeText.length < 2048) {
					description += newFakeText;
				}
			});

			return new RichEmbed()
				.setTitle('Fake invites')
				.setDescription(description);
		});
	}
}
