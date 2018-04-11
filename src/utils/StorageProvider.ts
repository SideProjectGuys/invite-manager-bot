import { StorageProvider } from 'yamdbf';

import { settings, SettingsKeys } from '../sequelize';

export class IMStorageProvider extends StorageProvider {

	private name: string;
	private cache: { [guildId: string]: string } = {};

	constructor(name: string) {
		super();
		this.name = name;
	}

	public async get(key: string) {
		if (this.name !== 'guild_settings') {
			return '{}';
		}

		if (this.cache[key]) {
			return this.cache[key];
		}

		const sets = await settings.findAll({
			where: {
				guildId: key
			}
		});

		const obj: { [k in SettingsKeys]: string } = {} as any;
		sets.forEach(set => obj[set.key] = set.value);

		const str = JSON.stringify(obj);
		this.cache[key] = str;
		return str;
	}

	public async set(key: string, value: string) {
		if (this.name !== 'guild_settings') {
			return;
		}

		this.cache[key] = value;

		// TODO: Maybe we can debounce this
		const config = JSON.parse(value);
		const sets = Object.keys(config).map((k: SettingsKeys) => ({ guildId: key, key: k, value: config[k] }));
		settings.bulkCreate(
			sets,
			{
				updateOnDuplicate: ['value']
			}
		);
	}

	public async keys() {
		return new Promise<string[]>((resolve) => resolve([]));
	}
}
