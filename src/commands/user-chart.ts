import { Command, CommandDecorators, Logger, logger, Message, Middleware } from '@yamdbf/core';
import moment from 'moment';

import { IMClient } from '../client';
import { joins, sequelize } from '../sequelize';
import { Chart } from '../utils/Chart';
import { CommandGroup, createEmbed, RP, sendEmbed } from '../utils/util';

const { resolve } = Middleware;
const { using, localizable } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'graph',
			aliases: ['g', 'chart'],
			desc: 'Display graph',
			usage: '<prefix>graph <graph> <type>',
			group: CommandGroup.Other,
			guildOnly: true
		});
	}

	@using(resolve('type: string'))
	@localizable
	public async action(message: Message, [rp, type]: [RP, string]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const js = await joins.findAll({
			attributes: [
				[sequelize.fn('YEAR', 'createdAt'), 'year'],
				[sequelize.fn('MONTH', 'createdAt'), 'month'],
				[sequelize.fn('DAY', 'createdAt'), 'day'],
				[sequelize.fn('COUNT', 'id'), 'total']
			],
			group: [
				sequelize.fn('YEAR', 'createdAt'),
				sequelize.fn('MONTH', 'createdAt'),
				sequelize.fn('DAY', 'createdAt')
			],
			where: {
				guildId: message.guild.id
			},
			order: [sequelize.literal('MAX(createdAt)')],
			limit: 60,
			raw: true
		});

		let data = {
			labels: ['JAN', 'FEB', 'MAR', 'APR'],
			datasets: [{
				label: 'Data',
				borderColor: 'black',
				pointBorderColor: 'black',
				pointBackgroundColor: 'black',
				pointHoverBackgroundColor: 'black',
				pointHoverBorderColor: 'black',
				pointBorderWidth: 0,
				pointHoverRadius: 0,
				pointHoverBorderWidth: 0,
				pointRadius: 1,
				fill: true,
				borderWidth: 2,
				data: [2000, 2533, 1890, 3400],
				datalabels: {
					align: 'end',
					anchor: 'end'
				}
			}]
		};

		let chart = new Chart();
		chart.getChart(type, data).then((buffer: Buffer) => {

			const embed = createEmbed(this.client);
			embed.setTitle('User Growth');
			embed.setDescription('This is the main body of text, it can hold 2048 characters.');
			embed.setImage('attachment://chart.png');
			embed.attachFiles([{
				attachment: buffer,
				name: 'chart.png'
			}]);

			message.channel.send({ embed }).then(() => {
				// chartNode.destroy();
			});
		});
	}
}
