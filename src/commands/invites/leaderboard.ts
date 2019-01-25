import { Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../client';
import { NumberResolver, StringResolver } from '../../resolvers';
import { LeaderboardStyle } from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

const chrono = require('chrono-node');

const usersPerPage = 10;
const upSymbol = '🔺';
const downSymbol = '🔻';
const neutralSymbol = '🔹';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.leaderboard,
			aliases: ['top'],
			args: [
				{
					name: 'page',
					resolver: NumberResolver
				},
				{
					name: 'date',
					resolver: StringResolver
				}
			],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[_page, _date]: [number, string],
		flags: {},
		{ guild, t, settings }: Context
	): Promise<any> {
		let from = moment();
		let to = moment().subtract(1, 'day');
		if (_date) {
			const res = chrono.parse(_date);
			if (!res[0]) {
				return this.sendReply(message, t('cmd.leaderboard.invalidDate'));
			}
			if (res[0].start) {
				from = moment(res[0].start.date());
				to = from.clone().subtract(1, 'day');
			}
			if (res[0].end) {
				to = moment.min(moment(), moment(res[0].end.date()));
			} else if (!from.isSame(moment(), 'day')) {
				to = moment();
			}
			const min = moment.min(from, to);
			from = moment.max(from, to);
			to = min;
		}

		const hideLeft = settings.hideLeftMembersFromLeaderboard;

		const {
			keys,
			oldKeys,
			invs,
			stillInServer
		} = await this.client.invs.generateLeaderboard(
			guild,
			hideLeft,
			from,
			to,
			100
		);

		if (keys.length === 0) {
			const embed = this.createEmbed({
				title: t('cmd.leaderboard.title'),
				description: t('cmd.leaderboard.noInvites')
			});
			return this.sendReply(message, embed);
		}

		const maxPage = Math.ceil(keys.length / usersPerPage);
		const p = Math.max(Math.min(_page ? _page - 1 : 0, maxPage - 1), 0);

		const style: LeaderboardStyle = settings.leaderboardStyle;

		// Show the leaderboard as a paginated list
		this.showPaginated(message, p, maxPage, page => {
			const fromText = from.format('YYYY/MM/DD - HH:mm:ss - z');
			const toText = to.format('YYYY/MM/DD - HH:mm:ss - z');

			let str = `${fromText}\n(${t('cmd.leaderboard.comparedTo', {
				to: toText
			})})\n\n`;

			// Collect texts first to possibly make a table
			const lines: string[][] = [];
			const lengths: number[] = [2, 1, 4, 1, 1, 1, 1];

			if (style === LeaderboardStyle.table) {
				lines.push([
					'⇳',
					'#',
					t('cmd.leaderboard.col.name'),
					t('cmd.leaderboard.col.total'),
					t('cmd.leaderboard.col.regular'),
					t('cmd.leaderboard.col.custom'),
					t('cmd.leaderboard.col.fake'),
					t('cmd.leaderboard.col.leave')
				]);
				lines.push(lines[0].map(h => '―'.repeat(h.length + 1)));
			}

			keys
				.slice(page * usersPerPage, (page + 1) * usersPerPage)
				.forEach((k, i) => {
					const inv = invs[k];
					const pos = page * usersPerPage + i + 1;

					const prevPos = oldKeys.indexOf(k) + 1;
					const posChange = prevPos - i - 1;

					const name =
						style === LeaderboardStyle.mentions && stillInServer[k]
							? `<@${k}>`
							: inv.name.substring(0, 10);

					const symbol =
						posChange > 0
							? upSymbol
							: posChange < 0
							? downSymbol
							: neutralSymbol;

					const posText =
						posChange > 0
							? `+${posChange}`
							: posChange === 0
							? `±0`
							: posChange;

					const line = [
						`${pos}.`,
						`${symbol} (${posText})`,
						name,
						`${inv.total} `,
						`${inv.regular} `,
						`${inv.custom} `,
						`${inv.fake} `,
						`${inv.leave} `
					];

					lines.push(line);
					lengths.forEach(
						(l, pIndex) =>
							(lengths[pIndex] = Math.max(l, Array.from(line[pIndex]).length))
					);
				});

			// Put string together
			if (style === LeaderboardStyle.table) {
				str += '```diff\n';
			}
			lines.forEach(line => {
				if (style === LeaderboardStyle.table) {
					line.forEach((part, partIndex) => {
						str += part + ' '.repeat(lengths[partIndex] - part.length + 2);
					});
				} else if (
					style === LeaderboardStyle.normal ||
					style === LeaderboardStyle.mentions
				) {
					str += t('cmd.leaderboard.entry', {
						pos: line[0],
						change: line[1],
						name: line[2],
						total: line[3],
						regular: line[4],
						custom: line[5],
						fake: line[6],
						leave: line[7]
					});
				}

				str += '\n';
			});
			if (style === LeaderboardStyle.table) {
				str += '\n```\n' + t('cmd.leaderboard.legend');
			}

			return this.createEmbed({
				title: t('cmd.leaderboard.title'),
				description: str
			});
		});
	}
}
