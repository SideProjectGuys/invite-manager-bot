import { StorageProvider } from 'yamdbf';

import { settings } from '../sequelize';

export class IMStorageProvider extends StorageProvider {

	private name: string;
	private map: { [x: string]: string } = {};

	constructor(name: string) {
		super();
		this.name = name;
	}

	public async clear() {
		console.log(`${this.name} clear`);
		this.map = {};
	}

	public async get(key: string) {
		console.log(`${this.name} get ${key}`);
		if (this.name !== 'guild_settings') {
			return '{}';
		}

		return await settings.findAll({
			where: {
				guildId: key
			}
		}).then(sets => {
			const obj: { [x: string]: string } = {};
			sets.forEach(set => obj[set.key] = set.value);
			return JSON.stringify(obj);
		});
	}

	public async init() {
		console.log(`${this.name} init`);
	}

	public async keys() {
		console.log(`${this.name} keys`);
		return new Promise<string[]>((resolve) => resolve(Object.keys(this.map)));
	}

	public async remove(key: string) {
		console.log(`${this.name} remove ${key}`);
		delete this.map[key];
	}

	public async set(key: string, value: string) {
		console.log(`${this.name} set ${key} = ${value}`);
		this.map[key] = value;
	}
}
