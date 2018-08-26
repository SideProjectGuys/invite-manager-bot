import { Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../client';
import { Chart } from '../functions/Chart';
import { createEmbed, sendReply } from '../functions/Messaging';
import { commandUsage, joins, leaves, sequelize } from '../sequelize';
import { BotCommand, ChartType, CommandGroup } from '../types';

import { Command, Context } from './Command';
import { EnumResolver, NumberResolver } from './resolvers';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.graph,
			aliases: ['g', 'chart'],
			desc: 'Shows graphs about various stats on this server.',
			args: [
				{
					name: 'type',
					resolver: new EnumResolver(client, []),
					description: 'The type of chart to display.'
				},
				{
					name: 'duration',
					resolver: NumberResolver,
					description: 'The duration period for the chart.'
				}
			],
			group: CommandGroup.Other,
			guildOnly: true,
			hidden: true
		});
	}

	public async action(
		message: Message,
		[_type, duration]: [string, string],
		{ guild, t }: Context
	): Promise<any> {
		if (!_type) {
			return sendReply(
				this.client,
				message,
				t('CMD_CHART_MISSING_TYPE', {
					types: Object.keys(ChartType)
						.map(k => '`' + k + '`')
						.join(', ')
				})
			);
		}

		const type = Object.keys(ChartType).find(
			(k: any) => ChartType[k].toLowerCase() === _type.toLowerCase()
		) as ChartType;
		if (!type) {
			return sendReply(
				this.client,
				message,
				t('CMD_CHART_INVALID_TYPE', {
					types: Object.keys(ChartType)
						.map(k => '`' + k + '`')
						.join(', ')
				})
			);
		}

		let days = 60;
		if (duration) {
			const d = parseInt(duration, 10);

			if (duration.indexOf('d') >= 0) {
				days = d;
			} else if (duration.indexOf('w') >= 0) {
				days = d * 7;
			} else if (duration.indexOf('m') >= 0) {
				days = d * 30;
			} else if (duration.indexOf('y') >= 0) {
				days = d * 365;
			}
		}

		const start = moment().subtract(days, 'day');
		const end = moment();

		let title = '';
		let description = '';
		const vs: { [x: string]: number } = {};

		if (type === ChartType.joins) {
			title = t('CMD_CHART_JOINS_TITLE');
			description = t('CMD_CHART_JOINS_DESCRIPTION');

			const js = await joins.findAll({
				attributes: [
					[sequelize.fn('YEAR', sequelize.col('createdAt')), 'year'],
					[sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
					[sequelize.fn('DAY', sequelize.col('createdAt')), 'day'],
					[sequelize.fn('COUNT', 'id'), 'total']
				],
				group: [
					sequelize.fn('YEAR', sequelize.col('createdAt')),
					sequelize.fn('MONTH', sequelize.col('createdAt')),
					sequelize.fn('DAY', sequelize.col('createdAt'))
				],
				where: {
					guildId: guild.id
				},
				order: [sequelize.literal('MAX(createdAt) DESC')],
				limit: days,
				raw: true
			});

			js.forEach((j: any) => (vs[`${j.year}-${j.month}-${j.day}`] = j.total));
		} else if (type === ChartType.leaves) {
			title = t('CMD_CHART_LEAVES_TITLE');
			description = t('CMD_CHART_LEAVES_DESCRIPTION');

			const lvs = await leaves.findAll({
				attributes: [
					[sequelize.fn('YEAR', sequelize.col('createdAt')), 'year'],
					[sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
					[sequelize.fn('DAY', sequelize.col('createdAt')), 'day'],
					[sequelize.fn('COUNT', 'id'), 'total']
				],
				group: [
					sequelize.fn('YEAR', sequelize.col('createdAt')),
					sequelize.fn('MONTH', sequelize.col('createdAt')),
					sequelize.fn('DAY', sequelize.col('createdAt'))
				],
				where: {
					guildId: guild.id
				},
				order: [sequelize.literal('MAX(createdAt) DESC')],
				limit: days,
				raw: true
			});

			lvs.forEach((l: any) => (vs[`${l.year}-${l.month}-${l.day}`] = l.total));
		} else if (type === ChartType.usage) {
			title = t('CMD_CHART_USAGE_TITLE');
			description = t('CMD_CHART_USAGE_DESCRIPTION');

			const us = await commandUsage.findAll({
				attributes: [
					[sequelize.fn('YEAR', sequelize.col('createdAt')), 'year'],
					[sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
					[sequelize.fn('DAY', sequelize.col('createdAt')), 'day'],
					[sequelize.fn('COUNT', 'id'), 'total']
				],
				group: [
					sequelize.fn('YEAR', sequelize.col('createdAt')),
					sequelize.fn('MONTH', sequelize.col('createdAt')),
					sequelize.fn('DAY', sequelize.col('createdAt'))
				],
				where: {
					guildId: guild.id
				},
				order: [sequelize.literal('MAX(createdAt) DESC')],
				limit: days,
				raw: true
			});

			us.forEach((u: any) => (vs[`${u.year}-${u.month}-${u.day}`] = u.total));
		}

		const labels: string[] = [];
		const data: number[] = [];

		for (var m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
			labels.push(m.format('DD.MM.YYYY'));
			const val = vs[m.format('YYYY-M-D')];
			data.push(val ? val : 0);
		}

		let config = {
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

		let chart = new Chart();
		chart.getChart('line', config).then((buffer: Buffer) => {
			const embed = createEmbed(this.client, {
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
				});
		});
	}
}
