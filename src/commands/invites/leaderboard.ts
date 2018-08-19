import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import moment from 'moment';

import { IMClient } from '../../client';
import { generateLeaderboard } from '../../functions/Leaderboard';
import {
	createEmbed,
	sendReply,
	showPaginated
} from '../../functions/Messaging';
import { checkProBot, checkRoles } from '../../middleware';
import { LeaderboardStyle } from '../../sequelize';
import { SettingsCache } from '../../storage/SettingsCache';
import { BotCommand, CommandGroup, RP } from '../../types';

const chrono = require('chrono-node');

const { resolve, localize } = Middleware;
const { using } = CommandDecorators;

const usersPerPage = 10;
const upSymbol = '🔺';
const downSymbol = '🔻';
const neutralSymbol = '🔹';

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'leaderboard',
			aliases: ['top'],
			desc: 'Show members with most invites.',
			usage: '<prefix>leaderboard (page) (date)',
			info:
				'`page`:\n' +
				'Which page of the leaderboard to get.\n\n' +
				'`date`:\n' +
				'The date (& time) for which the leaderboard is shown\n\n',
			clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.leaderboard))
	@using(resolve('page: Number, ...date?: String'))
	@using(localize)
	public async action(
		message: Message,
		[rp, _page, _date]: [RP, number, string]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		let from = moment();
		let to = moment().subtract(1, 'day');
		if (_date) {
			const res = chrono.parse(_date);
			if (!res[0]) {
				return sendReply(message, rp.CMD_LEADERBOARD_INVALID_DATE());
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

		const guildSettings = await SettingsCache.get(message.guild.id);
		const hideLeft = guildSettings.hideLeftMembersFromLeaderboard === 'true';

		const { keys, oldKeys, invs, stillInServer } = await generateLeaderboard(
			message.guild,
			hideLeft,
			from,
			to,
			100
		);

		if (keys.length === 0) {
			const embed = createEmbed(this.client);
			embed.setDescription(rp.CMD_LEADERBOARD_NO_INVITES());
			embed.setTitle(rp.CMD_LEADERBOARD_TITLE());
			return sendReply(message, embed);
		}

		const maxPage = Math.ceil(keys.length / usersPerPage);
		const p = Math.max(Math.min(_page ? _page - 1 : 0, maxPage - 1), 0);

		const style: LeaderboardStyle = guildSettings.leaderboardStyle;

		// Show the leaderboard as a paginated list
		showPaginated(this.client, message, p, maxPage, page => {
			const fromText = from.format('YYYY/MM/DD - HH:mm:ss - z');
			const toText = to.format('YYYY/MM/DD - HH:mm:ss - z');

			let str =
				fromText + `\n(${rp.CMD_LEADERBOARD_COMPARED_TO({ to: toText })})\n\n`;

			// Collect texts first to possibly make a table
			const lines: string[][] = [];
			let lengths: number[] = [1, 6, 4, 1, 1, 1, 1];

			if (style === LeaderboardStyle.table) {
				lines.push([
					'#',
					rp.CMD_LEADERBOARD_COL_CHANGE(),
					rp.CMD_LEADERBOARD_COL_NAME(),
					rp.CMD_LEADERBOARD_COL_TOTAL(),
					rp.CMD_LEADERBOARD_COL_REGULAR(),
					rp.CMD_LEADERBOARD_COL_CUSTOM(),
					rp.CMD_LEADERBOARD_COL_FAKE(),
					rp.CMD_LEADERBOARD_COL_LEAVE()
				]);
				lines.push(lines[0].map(h => '-'.repeat(h.length)));
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
							: `${inv.name}`;
					const symbol =
						posChange > 0
							? upSymbol
							: posChange < 0
								? downSymbol
								: neutralSymbol;

					const posText =
						posChange > 0
							? '+' + posChange
							: posChange === 0
								? '--'
								: posChange;

					const line = [
						`${pos}.`,
						`${symbol} (${posText})`,
						name,
						`${inv.total}`,
						`${inv.regular}`,
						`${inv.custom}`,
						`${inv.fake}`,
						`${inv.leaves}`
					];

					lines.push(line);
					lengths.forEach(
						(l, pIndex) =>
							(lengths[pIndex] = Math.max(l, Array.from(line[pIndex]).length))
					);
				});

			// Put string together
			if (style === LeaderboardStyle.table) {
				str += '```';
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
					str += rp.CMD_LEADERBOARD_ROW_ENTRY({
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
				str += '```\n' + rp.CMD_LEADERBOARD_TABLE_LEGEND();
			}

			return createEmbed(this.client)
				.setTitle(rp.CMD_LEADERBOARD_TITLE())
				.setDescription(str);
		});
	}
}
