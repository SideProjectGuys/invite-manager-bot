import { Cache } from '../../framework/cache/Cache';

export class VanityUrlCache extends Cache<string> {
	public async init() {
		// NO-OP
	}

	protected async _get(guildId: string): Promise<string> {
		return (
			this.client.guilds.get(guildId)?.vanityURL ||
			this.client
				.getGuildVanity(guildId)
				.then((r) => r.code as any)
				.catch(() => null)
		);
	}
}
