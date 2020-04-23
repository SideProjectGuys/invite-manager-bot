import { IMCache } from '../../framework/cache/Cache';
import { GuildFeature, VanityInvite } from '../../types';

export class VanityCache extends IMCache<VanityInvite> {
	public async init() {
		// NO-OP
	}

	public async _get(guildId: string): Promise<VanityInvite> {
		const guild = this.client.guilds.get(guildId);
		if (!guild || !guild.features.includes(GuildFeature.VANITY_URL)) {
			return null;
		}

		return guild.getVanity().catch(() => null);
	}
}
