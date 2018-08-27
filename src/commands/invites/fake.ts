import { Message } from 'eris';

import { IMClient } from '../../client';
import {
	createEmbed,
	sendReply,
	showPaginated
} from '../../functions/Messaging';
import { NumberResolver } from '../../resolvers';
import {
	inviteCodes,
	JoinAttributes,
	joins,
	members,
	sequelize
} from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

const usersPerPage = 20;

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.fake,
			aliases: ['fakes', 'cheaters', 'cheater', 'invalid'],
			desc: 'Help find users trying to cheat.',
			args: [
				{
					name: 'page',
					resolver: NumberResolver,
					description: 'Which page of the fake list to get.'
				}
			],
			// clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[_page]: [number],
		{ guild, t }: Context
	): Promise<any> {
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
				guildId: guild.id
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
			return sendReply(this.client, message, t('cmd.fake.none'));
		}

		const suspiciousJoins = js
			.filter((j: ExtendedJoin) => parseInt(j.totalJoins, 10) > 1)
			.sort(
				(a: ExtendedJoin, b: ExtendedJoin) =>
					parseInt(b.totalJoins, 10) - parseInt(a.totalJoins, 10)
			);

		if (suspiciousJoins.length === 0) {
			return sendReply(this.client, message, t('cmd.fake.noneSinceJoin'));
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

					const mainText = t('cmd.fake.join.entry.text', {
						name: join.memberName,
						times: join.totalJoins
					});

					const invText = Object.keys(invs)
						.map(name => {
							return t('cmd.fake.join.entry.invite', {
								name,
								times: invs[name] > 1 ? invs[name] : undefined
							});
						})
						.join(', ');

					const newFakeText = mainText + ' ' + invText + '\n';
					if (description.length + newFakeText.length < 2048) {
						description += newFakeText;
					}
				});

			return createEmbed(this.client, {
				title: t('cmd.fake.title'),
				description
			});
		});
	}
}
