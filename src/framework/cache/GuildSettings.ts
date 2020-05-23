import { Service } from '../decorators/Service';
import { Guild } from '../models/Guild';
import { BaseGuildSettings } from '../models/GuildSettings';
import { SettingsService } from '../services/Settings';

import { IMCache } from './Cache';

type GuildSettings<T> = BaseGuildSettings & T;
type KeyOfSettings<T> = Extract<keyof GuildSettings<T>, string>;

export class GuildSettingsCache extends IMCache<BaseGuildSettings> {
	@Service() private settings: SettingsService;

	public async init() {
		// NO-OP
	}

	public async get<T>(key: string): Promise<GuildSettings<T>> {
		return super.get(key) as any;
	}

	protected async _get(guildId: string): Promise<BaseGuildSettings> {
		const set = await this.settings.getGuildSettings(guildId);
		console.log({ ...this.settings.getGuildDefaultSettings(), ...(set ? set.value : null) });
		return { ...this.settings.getGuildDefaultSettings(), ...(set ? set.value : null) };
	}

	public async setOne<T>(
		guildId: string,
		key: KeyOfSettings<T>,
		value: GuildSettings<T>[KeyOfSettings<T>]
	): Promise<GuildSettings<T>[KeyOfSettings<T>]> {
		const set = await this.get<T>(guildId);
		const dbVal = this.settings.toDbValue(this.settings.getSettingsInfo(Guild, key), value);

		// Check if the value changed
		if (set[key] !== dbVal) {
			set[key] = dbVal;

			// Save into DB
			await this.settings.saveGuildSettings({ guildId, value: set });
		}

		return dbVal;
	}
}
