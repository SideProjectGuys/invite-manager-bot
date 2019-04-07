import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { StringResolver } from '../../../../framework/resolvers';
import {
	CommandGroup,
	MusicCommand,
	MusicPlatformTypes
} from '../../../../types';
import { RaveDJ } from '../../models/ravedj/RaveDJ';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: MusicCommand.mashup,
			aliases: [],
			args: [
				{
					name: 'video1',
					resolver: StringResolver,
					rest: false
				},
				{
					name: 'video2',
					resolver: StringResolver,
					rest: false
				}
			],
			group: CommandGroup.Music,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[video1, video2]: [string, string],
		flags: {},
		{ t, guild }: Context
	): Promise<any> {
		// TODO
		const voiceChannelId = message.member.voiceState.channelID;
		if (!voiceChannelId) {
			this.sendReply(
				message,
				'Please join a voice channel before using this command'
			);
			return;
		}

		const musicPlatform = this.client.music.musicPlatformService.getPlatform(
			MusicPlatformTypes.RaveDJ
		) as RaveDJ;

		console.log(video1, video2);

		const mashupId = await musicPlatform.mix(video1, video2);

		console.log(mashupId);

		this.sendReply(message, `RaveDJ Link: https://rave.dj/${mashupId}`);
	}
}
