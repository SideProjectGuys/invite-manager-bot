import { RichEmbed } from 'discord.js';
import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from 'yamdbf';

import { IMClient } from '../client';
import {
	inviteCodes,
	JoinAttributes,
	JoinInstance,
	joins,
	members,
	sequelize
} from '../sequelize';
import { CommandGroup, createEmbed, showPaginated } from '../utils/util';

const { resolve } = Middleware;
const { using } = CommandDecorators;

const usersPerPage = 20;

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'fake',
			aliases: ['fakes', 'cheaters', 'cheater', 'invalid'],
			desc: 'Help find users trying to cheat.',
			usage: '<prefix>fake (page)',
			info: '`page`:\n' + 'Which page of the fake list to get.\n\n',
			clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Admin,
			guildOnly: true
		});
	}

	@using(resolve('page: Number'))
	public async action(message: Message, [_page]: [number]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		type ExtendedJoin = JoinAttributes & {
			memberName: string;
			totalJoins: string;
			inviterIds: string | null;
		};

		const js: ExtendedJoin[] = (await joins.findAll({
			attributes: [
				'memberId',
				[sequelize.literal('`member`.`name`'), 'memberName'],
				[sequelize.fn('COUNT', sequelize.col('join.id')), 'totalJoins'],
				[
					sequelize.fn(
						'GROUP_CONCAT',
						sequelize.literal(
							'CONCAT(`exactMatch`.`inviterId`, "|", `exactMatch->inviter`.`name`) SEPARATOR "\\t"'
						)
					),
					'inviterIds'
				]
			],
			where: {
				guildId: message.guild.id
			},
			group: ['join.memberId'],
			include: [
				{
					attributes: ['name'],
					model: members,
					required: true
				},
				{
					attributes: [],
					model: inviteCodes,
					as: 'exactMatch',
					required: true,
					include: [
						{
							attributes: [],
							as: 'inviter',
							model: members,
							required: true
						}
					]
				}
			],
			raw: true
		})) as any;

		if (js.length <= 0) {
			message.channel.send(`No fake invites detected so far.`);
			return;
		}

		const suspiciousJoins = js
			.filter((j: ExtendedJoin) => parseInt(j.totalJoins, 10) > 1)
			.sort(
				(a: ExtendedJoin, b: ExtendedJoin) =>
					parseInt(b.totalJoins, 10) - parseInt(a.totalJoins, 10)
			);

		if (suspiciousJoins.length === 0) {
			message.channel.send(
				`There have been no fake invites since the bot has been added to this server.`
			);
			return;
		}

		const maxPage = Math.ceil(suspiciousJoins.length / usersPerPage);
		const p = Math.max(Math.min(_page ? _page - 1 : 0, maxPage - 1), 0);

		showPaginated(this.client, message, p, maxPage, page => {
			let description = '';

			suspiciousJoins
				.slice(page * usersPerPage, (page + 1) * usersPerPage)
				.forEach((join: ExtendedJoin) => {
					if (!join.inviterIds) {
						return;
					}

					const invs: { [x: string]: number } = {};
					join.inviterIds.split('\t').forEach((idName: string) => {
						const name = idName.split('|', 2)[1];
						if (invs[name]) {
							invs[name]++;
						} else {
							invs[name] = 1;
						}
					});
					const invText = Object.keys(invs)
						.map(name => {
							const timesText =
								invs[name] > 1 ? ` (**${invs[name]}** times)` : '';
							return `**${name}**${timesText}`;
						})
						.join(', ');
					let newFakeText = `**${join.memberName}** joined **${
						join.totalJoins
					} times**, invited by: ${invText}\n`;
					if (description.length + newFakeText.length < 2048) {
						description += newFakeText;
					}
				});

			return createEmbed(this.client)
				.setTitle('Fake invites')
				.setDescription(description);
		});
	}
}
