import { Message } from 'eris';

import { IMClient } from '../../../client';
import { BotCommand, CommandGroup } from '../../../types';
import { Command, Context } from '../Command';

// Developers
const developers: string[] = ['Andy#1801', 'Valandur#3581', 'santjum#0450', 'legendarylol#8215'];

// Staff
const moderators: string[] = [
	'GTA Tetris#4587',
	'𝕸σσɳ유#2296',
	'SemiMute#2018',
	'Mennoplays#0001',
	'Simplee.#2222',
	'Alan Wen#3344',
	'malok#8571'
];

const staff: string[] = ['Audio#0265', 'Chris.#0006', 'Gugu72#0016'];

const translators: string[] = [
	'legendarylol#8215',
	'Mennoplays#5943',
	'Simplee ♪ Li .#2222',
	'サロにぃ/Saroniii#3621',
	'CyberWhiteBR#7805',
	'Gugu72#2059',
	'ImRoyal_Raddar#0001',
	'Lorio#0666',
	'Lukas17#2252',
	'Izmoqwy#0423',
	'Qbiczeq#3641',
	'qq1zz (REAL) (New Account)2374#1204',
	'《Ն·Բ》ĂĆRΣANØ#1391'
];

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.credits,
			aliases: [],
			group: CommandGroup.Info,
			defaultAdminOnly: false,
			guildOnly: true
		});
	}

	public async action(message: Message, args: any[], flags: {}, { t }: Context): Promise<any> {
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
