import { IMCache } from '../../framework/cache/Cache';
import { GuildFeature } from '../../types';

export class VanityUrlCache extends IMCache<string> {
	public async init() {
		// NO-OP
	}

	protected async _get(guildId: string): Promise<string> {
		const guild = this.client.guilds.get(guildId);
		if (!guild || !guild.features.includes(GuildFeature.VANITY_URL)) {
			return null;
		}

		return (
			guild.vanityURL ||
			guild
				.getVanity()
				.then((r) => r.code as any)
				.catch(() => null)
		);
	}
}
