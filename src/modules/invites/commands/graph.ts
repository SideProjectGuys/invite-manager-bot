import { Message } from 'eris';
import moment, { Duration } from 'moment';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { DurationResolver, EnumResolver } from '../../../framework/resolvers';
import { ChartType, CommandGroup, InvitesCommand } from '../../../types';
import { Chart } from '../models/Chart';

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
					name: 'duration',
					resolver: DurationResolver
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
		[type, duration]: [ChartType, Duration],
		flags: {},
		{ guild, t }: Context
	): Promise<any> {
		let days = 60;
		if (duration) {
			days = duration.asDays();
			if (days < 5) {
				days = 5;
			}
		}

		const start = moment().subtract(days, 'day');
		const end = moment();

		let title = '';
		let description = '';
		const vs: { [x: string]: number } = {};

		if (type === ChartType.joins) {
			title = t('cmd.graph.joins.title');
			description = t('cmd.graph.joins.text');

			const joins = await this.client.repo.join
				.createQueryBuilder()
				.select('YEAR(createdAt)', 'year')
				.addSelect('MONTH(createdAt)', 'month')
				.addSelect('DAY(createdAt)', 'day')
				.addSelect('COUNT(id)', 'total')
				.groupBy('YEAR(createdAt)')
				.addGroupBy('MONTH(createdAt)')
				.addGroupBy('DAY(createdAt)')
				.where(`guildId = :guildId`, { guildId: guild.id })
				.orderBy('MAX(createdAt)', 'DESC')
				.limit(days)
				.getRawMany();

			joins.forEach(join => (vs[`${join.year}-${join.month}-${join.day}`] = join.total));
		} else if (type === ChartType.leaves) {
			title = t('cmd.graph.leaves.title');
			description = t('cmd.graph.leaves.text');

			const leaves = await this.client.repo.leave
				.createQueryBuilder()
				.select('YEAR(createdAt)', 'year')
				.addSelect('MONTH(createdAt)', 'month')
				.addSelect('DAY(createdAt)', 'day')
				.addSelect('COUNT(id)', 'total')
				.groupBy('YEAR(createdAt)')
				.addGroupBy('MONTH(createdAt)')
				.addGroupBy('DAY(createdAt)')
				.where(`guildId = :guildId`, { guildId: guild.id })
				.orderBy('MAX(createdAt)', 'DESC')
				.limit(days)
				.getRawMany();

			leaves.forEach(leave => (vs[`${leave.year}-${leave.month}-${leave.day}`] = leave.total));
		} else if (type === ChartType.usage) {
			title = t('cmd.graph.usage.title');
			description = t('cmd.graph.usage.text');

			const cmdUsages = await this.client.repo.commandUsage
				.createQueryBuilder()
				.select('YEAR(createdAt)', 'year')
				.addSelect('MONTH(createdAt)', 'month')
				.addSelect('DAY(createdAt)', 'day')
				.addSelect('COUNT(id)', 'total')
				.groupBy('YEAR(createdAt)')
				.addGroupBy('MONTH(createdAt)')
				.addGroupBy('DAY(createdAt)')
				.where(`guildId = :guildId`, { guildId: guild.id })
				.orderBy('MAX(createdAt)', 'DESC')
				.limit(days)
				.getRawMany();

			cmdUsages.forEach(cmdUsage => (vs[`${cmdUsage.year}-${cmdUsage.month}-${cmdUsage.day}`] = cmdUsage.total));
		}

		const labels: string[] = [];
		const data: number[] = [];

		for (const m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
			labels.push(m.format('DD.MM.YYYY'));
			const val = vs[m.format('YYYY-M-D')];
			data.push(val ? val : 0);
		}

		const config = {
			labels,
			datasets: [
				{
					label: 'Data',
					borderColor: 'black',
					pointBorderColor: 'black',
					pointBackgroundColor: 'black',
					pointBorderWidth: 0,
					pointRadius: 1,
					fill: true,
					borderWidth: 2,
					data,
					datalabels: {
						align: 'end',
						anchor: 'end'
					}
				}
			]
		};

		const chart = new Chart();
		chart.getChart('line', config).then((buffer: Buffer) => {
			const embed = this.createEmbed({
				title,
				description,
				image: {
					url: 'attachment://chart.png'
				}
			});

			message.channel
				.createMessage({ embed }, { file: buffer, name: 'chart.png' })
				.then(() => {
					chart.destroy();
				})
				.catch(() => {
					chart.destroy();
				});
		});
	}
}
