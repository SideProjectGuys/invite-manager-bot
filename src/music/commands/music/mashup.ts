import { Message } from 'eris';

import { IMModule } from '../../../framework/Module';
import { StringResolver } from '../../../framework/resolvers';
import { RaveDJ } from '../../models/ravedj/RaveDJ';
import { CommandContext, IMMusicCommand } from '../MusicCommand';

export default class extends IMMusicCommand {
	public constructor(module: IMModule) {
		super(module, {
			name: 'mashup',
			aliases: [],
			args: [
				{
					name: 'videos',
					resolver: StringResolver,
					required: true,
					rest: true
				}
			],
			group: 'Music',
			guildOnly: true,
			defaultAdminOnly: false,
			premiumOnly: true
		});
	}

	public async action(message: Message, [videos]: [string], flags: {}, { t, guild }: CommandContext): Promise<any> {
		const voiceChannelId = message.member.voiceState.channelID;
		if (!voiceChannelId) {
			await this.sendReply(message, t('music.voiceChannelRequired'));
			return;
		}

		const [link1, link2] = videos.split(' ');
		if (!link2) {
			await this.sendReply(message, t('cmd.mashup.missingSecondVideo'));
			return;
		}
		const platform1 = this.music.getPlatformForLink(link1);
		const platform2 = this.music.getPlatformForLink(link2);

		const musicPlatform = this.music.getPlatform(RaveDJ);

		let mashupId;

		const video1 = await platform1.getByLink(link1);
		const video2 = await platform2.getByLink(link2);
		mashupId = await musicPlatform.mix(video1.id, video2.id);

		await this.sendReply(message, `RaveDJ Link: https://rave.dj/${mashupId}`);
	}
}
