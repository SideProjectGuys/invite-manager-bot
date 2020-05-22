import { Service } from '../decorators/Service';
import { InviteCode } from '../models/InviteCode';
import { BaseInviteCodeSettings } from '../models/InviteCodeSettings';
import { SettingsService } from '../services/Settings';

import { IMCache } from './Cache';

type InviteCodeSettings<T> = BaseInviteCodeSettings & T;
type KeyOfSettings<T> = Extract<keyof InviteCodeSettings<T>, string>;

export class InviteCodeSettingsCache extends IMCache<Map<string, BaseInviteCodeSettings>> {
	@Service() private settings: SettingsService;

	public async init() {
		// NO-OP
	}

	public async get<T>(key: string): Promise<Map<string, InviteCodeSettings<T>>> {
		return super.get(key) as any;
	}

	protected async _get(guildId: string): Promise<Map<string, BaseInviteCodeSettings>> {
		const sets = await this.settings.getInviteCodeSettingsForGuild(guildId);

		const map = new Map();
		sets.forEach((set) => map.set(set.inviteCode, { ...this.settings.getInviteCodeDefaultSettings(), ...set.value }));
		return map;
	}

	public async getOne<T>(guildId: string, invCode: string): Promise<InviteCodeSettings<T>> {
		const guildSets = await this.get<T>(guildId);
		const set = guildSets.get(invCode);
		return { ...this.settings.getInviteCodeDefaultSettings(), ...set };
	}

	public async setOne<T>(
		guildId: string,
		inviteCode: string,
		key: KeyOfSettings<T>,
		value: InviteCodeSettings<T>[KeyOfSettings<T>]
	): Promise<InviteCodeSettings<T>[KeyOfSettings<T>]> {
		const guildSet = await this.get<T>(guildId);
		const dbVal = this.settings.toDbValue(this.settings.getSettingsInfo(InviteCode, key), value);

		let set = guildSet.get(inviteCode);
		if (!set) {
			set = this.settings.getInviteCodeDefaultSettings();
			guildSet.set(inviteCode, set);
		}

		// Check if the value changed
		if (set[key] !== dbVal) {
			set[key] = dbVal;

			await this.settings.saveInviteCodeSettings({ inviteCode, guildId, value: set });
		}

		return dbVal;
	}
}
