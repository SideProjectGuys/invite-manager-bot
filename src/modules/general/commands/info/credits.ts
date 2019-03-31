import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { BotCommand, CommandGroup } from '../../../../types';

// Developers
const developers: string[] = ['Andy', 'Valandur', 'santjum', 'legendarylol'];

// Staff
const moderators: string[] = ['SemiMute', 'theGordHoard', 'Mennoplays'];

const staff: string[] = [
	'CelestialStriden',
	'Lukas',
	'Audio',
	'ᴊᴀᴄᴋ❤ Crush',
	'Lukas1703'
];

const translators: string[] = [
	'amiog',
	'CyberDarkBR',
	'qq1zz',
	'Lorio',
	'legendarylol',
	'Lukas',
	'Mennoplays',
	'RMG | RoHellowtf💤',
	'Thę_Olaoleo',
	'Izmoqwy'
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
		flags: {},
		{ t }: Context
	): Promise<any> {
		const embed = this.createEmbed();

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

		return this.sendReply(message, embed);
	}

	private getList<T>(array: T[]) {
		return this.shuffle(array).join('\n');
	}

	private shuffle<T>(array: T[]) {
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
