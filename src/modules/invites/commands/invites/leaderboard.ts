import { Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import {
	DurationResolver,
	NumberResolver
} from '../../../../framework/resolvers';
import { LeaderboardStyle } from '../../../../sequelize';
import { BotType, CommandGroup, InvitesCommand } from '../../../../types';

const usersPerPage = 10;
const upSymbol = '🔺';
const downSymbol = '🔻';
const neutralSymbol = '🔹';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: InvitesCommand.leaderboard,
			aliases: ['top'],
			args: [
				{
					name: 'duration',
					resolver: DurationResolver
				},
				{
					name: 'page',
					resolver: NumberResolver
				}
			],
			flags: [
				{
					name: 'compare',
					short: 'c',
					resolver: DurationResolver
				}
			],
			group: CommandGroup.Invites,
			guildOnly: true,
			defaultAdminOnly: false,
			extraExamples: ['!leaderboard 1mo', '!leaderboard 30d 6']
		});
	}

	public async action(
		message: Message,
		[duration, _page]: [moment.Duration, number],
		{ compare }: { compare: moment.Duration },
		{ guild, t, settings }: Context
	): Promise<any> {
		if (this.client.type === BotType.regular) {
			const embed = this.createEmbed({
				title: t('cmd.leaderboard.title'),
				description:
					'Invite commands are currently disabled while we upgrade our servers.\n\n' +
					'Invites are still being tracked during this time.\n\nWe apologize for the inconvenience.'
			});
			return this.sendReply(message, embed);
		}

		const from = duration
			? moment().subtract(duration)
			: moment(guild.createdAt);
		const comp = compare
			? moment().subtract(compare)
			: moment().subtract(1, 'day');

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
			comp,
			100
		);

		const fromText = t('cmd.leaderboard.from', {
			from: `**${from.locale(settings.lang).fromNow()}**`
		});

		if (keys.length === 0) {
			const embed = this.createEmbed({
				title: t('cmd.leaderboard.title'),
				description: fromText + '\n\n**' + t('cmd.leaderboard.noInvites') + '**'
			});
			return this.sendReply(message, embed);
		}

		const maxPage = Math.ceil(keys.length / usersPerPage);
		const p = Math.max(Math.min(_page ? _page - 1 : 0, maxPage - 1), 0);

		const style: LeaderboardStyle = settings.leaderboardStyle;

		// Show the leaderboard as a paginated list
		await this.showPaginated(message, p, maxPage, page => {
			const compText = t('cmd.leaderboard.comparedTo', {
				to: `**${comp.locale(settings.lang).fromNow()}**`
			});

			let str = `${fromText}\n(${compText})\n\n`;

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
						`${inv.fakes} `,
						`${inv.leaves} `
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
