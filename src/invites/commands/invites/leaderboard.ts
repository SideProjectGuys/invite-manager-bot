import { Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { LeaderboardStyle } from '../../../framework/models/GuildSetting';
import { NumberResolver } from '../../../framework/resolvers';
import { CommandGroup, InvitesCommand } from '../../../types';

const usersPerPage = 10;

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: InvitesCommand.leaderboard,
			aliases: ['top'],
			args: [
				{
					name: 'page',
					resolver: NumberResolver
				}
			],
			flags: [],
			group: CommandGroup.Invites,
			guildOnly: true,
			defaultAdminOnly: false,
			extraExamples: ['!leaderboard 1mo', '!leaderboard 30d 6']
		});
	}

	public async action(message: Message, [_page]: [number], flags: {}, { guild, t, settings }: Context): Promise<any> {
		let invs = await this.client.cache.leaderboard.get(guild.id);
		const meta = this.client.cache.leaderboard.getCacheMeta(guild.id);
		if (settings.hideLeftMembersFromLeaderboard) {
			invs = invs.filter((e) => guild.members.has(e.id));
		}

		// Get the member settings everytime because it's not that much work
		// and because we want the 'hideFromLeaderboard' setting to work immediatly
		const memSets = await this.client.cache.members.get(guild.id);
		invs = invs.filter((e) => !memSets.has(e.id) || !memSets.get(e.id).hideFromLeaderboard);

		const fromText = t('cmd.leaderboard.from', {
			from: `**${moment(guild.createdAt).locale(settings.lang).fromNow()}**`
		});
		const lastUpdateText = t('cmd.leaderboard.lastUpdate', {
			lastUpdate: `**${meta.cachedAt.locale(settings.lang).fromNow()}**`,
			nextUpdate: `**${meta.validUntil.locale(settings.lang).fromNow()}**`
		});

		if (invs.length === 0) {
			const embed = this.createEmbed({
				title: t('cmd.leaderboard.title'),
				description: `${fromText}\n(${lastUpdateText})\n\n**${t('cmd.leaderboard.noInvites')}**`
			});
			return this.sendReply(message, embed);
		}

		const maxPage = Math.ceil(invs.length / usersPerPage);
		const p = Math.max(Math.min(_page ? _page - 1 : 0, maxPage - 1), 0);

		const style: LeaderboardStyle = settings.leaderboardStyle;

		// Show the leaderboard as a paginated list
		await this.showPaginated(message, p, maxPage, (page) => {
			let str = `${fromText}\n(${lastUpdateText})\n\n`;

			// Collect texts first to possibly make a table
			const lines: string[][] = [];
			const lengths: number[] = [2, 1, 4, 1, 1, 1, 1];

			if (style === LeaderboardStyle.table) {
				lines.push([
					'#',
					t('cmd.leaderboard.col.name'),
					t('cmd.leaderboard.col.total'),
					t('cmd.leaderboard.col.regular'),
					t('cmd.leaderboard.col.custom'),
					t('cmd.leaderboard.col.fake'),
					t('cmd.leaderboard.col.leave')
				]);
				lines.push(lines[0].map((h) => '―'.repeat(h.length + 1)));
			}

			invs.slice(page * usersPerPage, (page + 1) * usersPerPage).forEach((inv, i) => {
				const pos = page * usersPerPage + i + 1;
				const name = style === LeaderboardStyle.mentions ? `<@${inv.id}>` : inv.name.substring(0, 10);

				const line = [
					`${pos}.`,
					name,
					`${inv.total} `,
					`${inv.regular} `,
					`${inv.custom} `,
					`${inv.fakes} `,
					`${inv.leaves} `
				];

				lines.push(line);
				lengths.forEach((l, pIndex) => (lengths[pIndex] = Math.max(l, Array.from(line[pIndex]).length)));
			});

			// Put string together
			if (style === LeaderboardStyle.table) {
				str += '```diff\n';
			}
			lines.forEach((line) => {
				if (style === LeaderboardStyle.table) {
					line.forEach((part, partIndex) => {
						str += part + ' '.repeat(lengths[partIndex] - part.length + 2);
					});
				} else if (style === LeaderboardStyle.normal || style === LeaderboardStyle.mentions) {
					str += t('cmd.leaderboard.entry', {
						pos: line[0],
						name: line[1],
						total: line[2],
						regular: line[3],
						custom: line[4],
						fake: line[5],
						leave: line[6]
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
