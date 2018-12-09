import { Message } from 'eris';

import { IMClient } from '../../client';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

// Developers
const developers = [
	{
		name: 'Andy',
		discriminator: '1801',
		link: ''
	},
	{
		name: 'Valandur',
		discriminator: '3581',
		link: ''
	},
	{
		name: 'santjum',
		discriminator: '0651',
		link: ''
	},
	{
		name: 'legendarylol',
		discriminator: '8215',
		link: ''
	}
];

// Staff
const moderators = [
	{
		name: 'SemiMute',
		discriminator: '2018',
		link: ''
	},
	{
		name: 'theGordHoard',
		discriminator: '9607',
		link: ''
	}
];

const staff = [
	{
		name: 'CelestialStriden',
		discriminator: '1931',
		link: ''
	},
	{
		name: 'Mennoplays',
		discriminator: '5632',
		link: ''
	},
	{
		name: `Lukas'`,
		discriminator: '8798',
		link: ''
	},
	{
		name: 'JackJuiCE',
		discriminator: '1180',
		link: ''
	}
];

const translators = [
	{
		name: 'amiog',
		discriminator: '5622',
		language: '',
		link: ''
	},
	{
		name: 'CyberDarkBR',
		discriminator: '7805',
		language: 'pt',
		link: ''
	},
	{
		name: 'qq1zz (REAL) (New Account)2374',
		discriminator: '1204',
		language: '',
		link: ''
	},
	{
		name: 'Lorio',
		discriminator: '6270',
		language: 'French',
		link: ''
	},
	{
		name: 'legendarylol',
		discriminator: '8215',
		link: ''
	},
	{
		name: `Lukas'`,
		discriminator: '8798',
		link: ''
	},
	{
		name: 'Mennoplays',
		discriminator: '5632',
		language: 'Dutch',
		link: ''
	},
	{
		name: 'RMG | RoHellowtf💤',
		discriminator: '6783',
		language: 'Romanian',
		link: ''
	},
	{
		name: 'Thę_Olaoleo[TGB]',
		discriminator: '1391',
		language: '',
		link: ''
	}
];

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.credits,
			aliases: [],
			group: CommandGroup.Info,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		{ t }: Context
	): Promise<any> {
		const embed = this.client.createEmbed();

		embed.fields.push({
			name: t('cmd.credits.developers'),
			value: this.getList(developers)
		});

		embed.fields.push({
			name: t('cmd.credits.moderators'),
			value: this.getList(moderators)
		});

		embed.fields.push({
			name: t('cmd.credits.staff'),
			value: this.getList(staff)
		});

		embed.fields.push({
			name: t('cmd.credits.translators'),
			value: this.getList(translators)
		});

		return this.client.sendReply(message, embed);
	}

	private getList(array: any[]) {
		return this.shuffle(array)
			.map(
				d =>
					d.link
						? `[${d.name}#${d.discriminator}](${d.link})`
						: `${d.name}#${d.discriminator}`
			)
			.join('\n');
	}

	private shuffle(array: any[]) {
		var currentIndex = array.length,
			temporaryValue,
			randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}
}
