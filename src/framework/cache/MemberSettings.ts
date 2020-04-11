import { Service } from '../decorators/Service';
import { Member } from '../models/Member';
import { BaseMemberSettings } from '../models/MemberSettings';
import { SettingsService } from '../services/Settings';

import { IMCache } from './Cache';

type MemberSettings<T> = BaseMemberSettings & T;
type KeyOfSettings<T> = Extract<keyof MemberSettings<T>, string>;

export class MemberSettingsCache extends IMCache<Map<string, BaseMemberSettings>> {
	@Service() private settings: SettingsService;

	public async init() {
		// NO-OP
	}

	public async get<T>(key: string): Promise<Map<string, MemberSettings<T>>> {
		return super.get(key) as any;
	}

	protected async _get(guildId: string): Promise<Map<string, BaseMemberSettings>> {
		const sets = await this.settings.getMemberSettingsForGuild(guildId);

		const map = new Map();
		sets.forEach((set) => map.set(set.memberId, { ...this.settings.getMemberDefaultSettings(), ...set.value }));
		return map;
	}

	public async getOne<T>(guildId: string, memberId: string): Promise<MemberSettings<T>> {
		const guildSets = await this.get<T>(guildId);
		const set = guildSets.get(memberId);
		return { ...this.settings.getMemberDefaultSettings(), ...set };
	}

	public async setOne<T>(
		guildId: string,
		userId: string,
		key: KeyOfSettings<T>,
		value: MemberSettings<T>[KeyOfSettings<T>]
	): Promise<MemberSettings<T>[KeyOfSettings<T>]> {
		const guildSet = await this.get<T>(guildId);
		const dbVal = this.settings.toDbValue(this.settings.getSettingsInfo(Member, key), value);

		let set = guildSet.get(userId);
		if (!set) {
			set = this.settings.getMemberDefaultSettings();
			guildSet.set(userId, set);
		}

		// Check if the value changed
		if (set[key] !== dbVal) {
			set[key] = dbVal;

			await this.settings.saveMemberSettings({ memberId: userId, guildId, value: set });
		}

		return dbVal;
	}
}
