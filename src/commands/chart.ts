import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import moment from 'moment';

import { IMClient } from '../client';
import { commandUsage, joins, leaves, sequelize } from '../sequelize';
import { Chart } from '../utils/Chart';
import { CommandGroup, createEmbed, RP, sendEmbed } from '../utils/util';

const { resolve, expect, localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'graph',
			aliases: ['g', 'chart'],
			desc: 'Shows graphs about various stats on this server.',
			usage: '<prefix>graph type (duration)',
			group: CommandGroup.Other,
			guildOnly: true,
			hidden: true
		});
	}

	@using(resolve('type: string, duration: string'))
	@using(expect('type: string'))
	@using(localize)
	public async action(
		message: Message,
		[rp, type, duration]: [RP, string, string]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		if (type !== 'joins' && type !== 'leaves' && type !== 'cmd') {
			message.channel.send(
				'Invalid graph type. Use one of: `joins`, `leaves`, `cmd`'
			);
			return;
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

		if (type === 'joins') {
			title = 'User Growth';
			description = 'This chart shows the growth of your server.';

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
					guildId: message.guild.id
				},
				order: [sequelize.literal('MAX(createdAt) DESC')],
				limit: days,
				raw: true
			});

			js.forEach((j: any) => (vs[`${j.year}-${j.month}-${j.day}`] = j.total));
		} else if (type === 'leaves') {
			title = 'Users leaving';
			description = 'This chart shows the number of users leaving your server.';

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
					guildId: message.guild.id
				},
				order: [sequelize.literal('MAX(createdAt) DESC')],
				limit: days,
				raw: true
			});

			lvs.forEach((l: any) => (vs[`${l.year}-${l.month}-${l.day}`] = l.total));
		} else if (type === 'cmd') {
			title = 'Command usage';
			description =
				'This chart shows the usage of InviteManager commands on this server.';

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
					guildId: message.guild.id
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
			const embed = createEmbed(this.client);
			embed.setTitle(title);
			embed.setDescription(description);
			embed.setImage('attachment://chart.png');
			embed.attachFiles([
				{
					attachment: buffer,
					name: 'chart.png'
				}
			]);

			message.channel.send({ embed }).then(() => {
				chart.destroy();
			});
		});
	}
}
