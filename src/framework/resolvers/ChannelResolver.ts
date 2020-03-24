import { Channel } from 'eris';

import { Context } from '../commands/Command';

import { Resolver } from './Resolver';

const channelRegex = /^(?:<#)?(\d+)>?$/;

export class ChannelResolver extends Resolver {
	public async resolve(value: string, { guild, t }: Context): Promise<Channel> {
		if (!guild || !value) {
			return;
		}

		let channel: Channel;
		if (channelRegex.test(value)) {
			const id = value.match(channelRegex)[1];
			channel = guild.channels.get(id);
			if (!channel) {
				throw Error(t(`resolvers.${this.getType()}.notFound`));
			}
		} else {
			const name = value.toLowerCase();
			const channels = guild.channels.filter((r) => {
				const rName = r.name.toLowerCase();
				return rName.includes(name) || name.includes(rName);
			});

			if (channels.length === 1) {
				channel = channels[0];
			} else {
				if (channels.length === 0) {
					throw Error(t(`resolvers.${this.getType()}.notFound`));
				} else {
					throw Error(
						t(`resolvers.${this.getType()}.multiple`, {
							channels: channels
								.slice(0, 10)
								.map((c) => `\`${c.name}\``)
								.join(', ')
						})
					);
				}
			}
		}

		return channel;
	}
}
