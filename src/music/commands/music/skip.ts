import { Message } from 'eris';

import { IMClient } from '../../../client';
import { NumberResolver } from '../../../framework/resolvers';
import { CommandContext, IMMusicCommand } from '../MusicCommand';

export default class extends IMMusicCommand {
	public constructor(client: IMClient) {
		super(client, {
			name: 'skip',
			aliases: ['next'],
			args: [
				{
					name: 'amount',
					required: false,
					resolver: new NumberResolver(client, 1)
				}
			],
			group: 'Music',
			guildOnly: true,
			defaultAdminOnly: false,
			premiumOnly: true
		});
	}

	public async action(message: Message, [amount]: [number], flags: {}, { t, guild }: CommandContext): Promise<any> {
		const conn = await this.music.getMusicConnection(guild);
		if (!conn.isPlaying()) {
			await this.sendReply(message, t('music.notPlaying'));
			return;
		}

		await conn.skip(amount || 0);
	}
}
