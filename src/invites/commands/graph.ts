import { Message } from 'eris';
import moment, { Moment } from 'moment';

import { IMClient } from '../../client';
import { Command, Context } from '../../framework/commands/Command';
import { DateResolver, EnumResolver } from '../../framework/resolvers';
import { ChartType, CommandGroup, InvitesCommand } from '../../types';
import { renderChart } from '../models/Chart';

const DEFAULT_DAYS = 30;
const COLORS = ['blue', 'red', 'black'];

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: InvitesCommand.graph,
			aliases: ['g', 'chart'],
			args: [
				{
					name: 'type',
					resolver: new EnumResolver(client, Object.values(ChartType)),
					required: true
				},
				{
					name: 'from',
					resolver: DateResolver
				},
				{
					name: 'to',
					resolver: DateResolver
				}
			],
			group: CommandGroup.Other,
			guildOnly: true,
			defaultAdminOnly: false,
			extraExamples: ['!graph joins', '!graph leaves', '!graph usage']
		});
	}

	public async action(
		message: Message,
		[type, from, to]: [ChartType, Moment, Moment],
		flags: {},
		{ guild, t }: Context
	): Promise<any> {
		if (!to) {
			to = moment();
		}
		if (!from) {
			from = to.clone().subtract(DEFAULT_DAYS, 'days');
		}

		from = from.startOf('day');
		to = to.endOf('day');

		const days = to.diff(from, 'days');
		if (days < 5) {
			await this.sendReply(message, t('cmd.graph.minDays', { days: 5 }));
			return;
		} else if (days > 120) {
			await this.sendReply(message, t('cmd.graph.maxDays', { days: 120 }));
			return;
		}

		let title = '';
		let description = '';

		const dates: Moment[] = [];
		const vs: Map<string, number>[] = [];
		for (const curr = from.clone(); to.isSameOrAfter(curr, 'days'); curr.add(1, 'days')) {
			dates.push(curr.clone());
		}

		const addDataset = () => {
			const map: Map<string, number> = new Map();
			dates.forEach((date) => map.set(date.format('YYYY-MM-DD'), 0));
			vs.push(map);
			return map;
		};

		if (type === ChartType.joinsAndLeaves) {
			title = t('cmd.graph.joinsAndLeaves.title');
			description = t('cmd.graph.joinsAndLeaves.text');

			const joinsMap = addDataset();
			const fs = await this.client.db.getJoinsPerDay(guild.id, from.toDate(), to.toDate());
			fs.forEach((join) =>
				joinsMap.set(`${join.year}-${`${join.month}`.padStart(2, '0')}-${`${join.day}`.padStart(2, '0')}`, join.total)
			);

			const leavesMap = addDataset();
			const lvs = await this.client.db.getLeavesPerDay(guild.id, from.toDate(), to.toDate());
			lvs.forEach((leave) =>
				leavesMap.set(
					`${leave.year}-${`${leave.month}`.padStart(2, '0')}-${`${leave.day}`.padStart(2, '0')}`,
					Number(leave.total)
				)
			);
		} else if (type === ChartType.joins) {
			title = t('cmd.graph.joins.title');
			description = t('cmd.graph.joins.text');

			const map = addDataset();
			const joins = await this.client.db.getJoinsPerDay(guild.id, from.toDate(), to.toDate());
			joins.forEach((join) =>
				map.set(`${join.year}-${`${join.month}`.padStart(2, '0')}-${`${join.day}`.padStart(2, '0')}`, join.total)
			);
		} else if (type === ChartType.leaves) {
			title = t('cmd.graph.leaves.title');
			description = t('cmd.graph.leaves.text');

			const map = addDataset();
			const leaves = await this.client.db.getLeavesPerDay(guild.id, from.toDate(), to.toDate());
			leaves.forEach((leave) =>
				map.set(`${leave.year}-${`${leave.month}`.padStart(2, '0')}-${`${leave.day}`.padStart(2, '0')}`, leave.total)
			);
		}

		const datasets: any[] = [];
		for (const v of vs) {
			const color = COLORS[datasets.length];
			const data = [...v.entries()].sort((a, b) => a[0].localeCompare(b[0])).map((e) => e[1]);

			datasets.push({
				label: 'Data',
				borderColor: color,
				pointBorderColor: color,
				pointBackgroundColor: color,
				pointBorderWidth: 0,
				pointRadius: 1,
				fill: true,
				borderWidth: 2,
				data,
				datalabels: {
					align: 'end',
					anchor: 'end'
				}
			});
		}

		const config = {
			labels: dates.map((d) => d.format('DD.MM.YYYY')),
			datasets
		};

		const buffer = await renderChart('line', config);

		const embed = this.createEmbed({
			title,
			description,
			image: {
				url: 'attachment://chart.png'
			}
		});

		await message.channel.createMessage({ embed }, { file: buffer, name: 'chart.png' });
	}
}
