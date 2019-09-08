import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { NumberResolver } from '../../../../framework/resolvers';
import {
	inviteCodes,
	JoinAttributes,
	joins,
	members,
	sequelize
} from '../../../../sequelize';
import { CommandGroup, InvitesCommand } from '../../../../types';

const USERS_PER_PAGE = 20;

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: InvitesCommand.fake,
			aliases: ['fakes', 'cheaters', 'cheater', 'invalid'],
			args: [
				{
					name: 'page',
					resolver: NumberResolver
				}
			],
			group: CommandGroup.Invites,
			guildOnly: true,
			defaultAdminOnly: true,
			extraExamples: ['!fake 4']
		});
	}

	public async action(
		message: Message,
		[_page]: [number],
		flags: {},
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
			return this.sendReply(message, t('cmd.fake.none'));
		}

		const suspiciousJoins = js
			.filter((j: ExtendedJoin) => parseInt(j.totalJoins, 10) > 1)
			.sort(
				(a: ExtendedJoin, b: ExtendedJoin) =>
					parseInt(b.totalJoins, 10) - parseInt(a.totalJoins, 10)
			);

		if (suspiciousJoins.length === 0) {
			return this.sendReply(message, t('cmd.fake.noneSinceJoin'));
		}

		const maxPage = Math.ceil(suspiciousJoins.length / USERS_PER_PAGE);
		const p = Math.max(Math.min(_page ? _page - 1 : 0, maxPage - 1), 0);

		this.showPaginated(message, p, maxPage, page => {
			let description = '';

			suspiciousJoins
				.slice(page * USERS_PER_PAGE, (page + 1) * USERS_PER_PAGE)
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
						.map(name =>
							invs[name] > 1
								? t('cmd.fake.join.entry.multi', { name, times: invs[name] })
								: t('cmd.fake.join.entry.single', { name })
						)
						.join(', ');

					const newFakeText = mainText + ' ' + invText + '\n';
					if (description.length + newFakeText.length < 2048) {
						description += newFakeText;
					}
				});

			return this.createEmbed({
				title: t('cmd.fake.title'),
				description
			});
		});
	}
}
