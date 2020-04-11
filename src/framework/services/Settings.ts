import { Channel, Client, Role } from 'eris';

import { InternalSettingsTypes, SettingsInfo } from '../../types';
import { Service } from '../decorators/Service';
import { settingsBaseClasses, SettingsBaseTypeConstructor, settingsClassesProperties } from '../decorators/Setting';
import { BaseBotSettings, BotSetting } from '../models/BotSettings';
import { Guild } from '../models/Guild';
import { BaseGuildSettings, GuildSetting } from '../models/GuildSettings';
import { InviteCode } from '../models/InviteCode';
import { BaseInviteCodeSettings, InviteCodeSetting } from '../models/InviteCodeSettings';
import { Member } from '../models/Member';
import { BaseMemberSettings, MemberSetting } from '../models/MemberSettings';

import { DatabaseService, GLOBAL_SHARD_ID } from './Database';
import { IMService } from './Service';

enum TABLE {
	botSettings = '`botSettings`',
	guildSettings = '`guildSettings`',
	inviteCodeSettings = '`inviteCodeSettings`',
	memberSettings = '`memberSettings`'
}

const BASE_CLASSES: SettingsBaseTypeConstructor[] = [Client, Guild, Member, InviteCode];

export class SettingsService extends IMService {
	@Service() private db: DatabaseService;

	private settingsInfos: Map<SettingsBaseTypeConstructor, Map<string, SettingsInfo<any>>> = new Map();
	private defaultSettings: Map<SettingsBaseTypeConstructor, any> = new Map();

	private botDefaultSettings: any = {};
	public getBotDefaultSettings<T = {}>(): BaseBotSettings & T {
		return { ...this.botDefaultSettings };
	}

	private guildDefaultSettings: any = {};
	public getGuildDefaultSettings<T = {}>(): BaseGuildSettings & T {
		return { ...this.guildDefaultSettings };
	}

	private inviteCodeDefaultSettings: any = {};
	public getInviteCodeDefaultSettings<T = {}>(): BaseInviteCodeSettings & T {
		return { ...this.inviteCodeDefaultSettings };
	}

	private memberDefaultSettings: any = {};
	public getMemberDefaultSettings<T = {}>(): BaseMemberSettings & T {
		return { ...this.memberDefaultSettings };
	}

	public getSettingsKeys(baseClass: SettingsBaseTypeConstructor) {
		return [...this.settingsInfos.get(baseClass).keys()];
	}
	public getSettingsInfos(baseClass: SettingsBaseTypeConstructor) {
		return new Map(this.settingsInfos.get(baseClass));
	}
	public getSettingsInfo(baseClass: SettingsBaseTypeConstructor, key: string) {
		return this.settingsInfos.get(baseClass).get(key);
	}

	public async init() {
		// Collect settings
		for (const baseClass of BASE_CLASSES) {
			const infoMap: Map<string, SettingsInfo<any>> = new Map();
			const defaultSettings: any = {};
			for (const settingsClass of settingsBaseClasses.get(baseClass)) {
				const propertyMap = settingsClassesProperties.get(settingsClass);
				if (!propertyMap) {
					continue;
				}

				for (const [propertyName, info] of propertyMap) {
					info.clearable = info.type.endsWith('[]') || info.defaultValue === null;
					infoMap.set(propertyName, info);
					defaultSettings[propertyName] = info.defaultValue;
				}
			}
			this.settingsInfos.set(baseClass, infoMap);
			this.defaultSettings.set(baseClass, defaultSettings);
		}
	}

	public async getBotSettings(botId: string) {
		return this.db.findOne<BotSetting>(GLOBAL_SHARD_ID, TABLE.botSettings, '`id` = ?', [botId]);
	}
	public async saveBotSettings(settings: Partial<BotSetting>) {
		await this.db.insertOrUpdate(TABLE.botSettings, ['id', 'value'], ['value'], [settings], () => GLOBAL_SHARD_ID);
	}

	public async getGuildSettings(guildId: string) {
		return this.db.findOne<GuildSetting>(guildId, TABLE.guildSettings, '`guildId` = ?', [guildId]);
	}
	public async saveGuildSettings(settings: Partial<GuildSetting>) {
		await this.db.insertOrUpdate(TABLE.guildSettings, ['guildId', 'value'], ['value'], [settings], (s) => s.guildId);
	}

	public async getMemberSettingsForGuild(guildId: string) {
		return this.db.findMany<MemberSetting>(guildId, TABLE.memberSettings, '`guildId` = ?', [guildId]);
	}
	public async saveMemberSettings(settings: Partial<MemberSetting>) {
		await this.db.insertOrUpdate(
			TABLE.memberSettings,
			['guildId', 'memberId', 'value'],
			['value'],
			[settings],
			(s) => s.guildId
		);
	}

	public async getInviteCodeSettingsForGuild(guildId: string) {
		return this.db.findMany<InviteCodeSetting>(guildId, TABLE.inviteCodeSettings, '`guildId` = ?', [guildId]);
	}
	public async saveInviteCodeSettings(settings: Partial<InviteCodeSetting>) {
		await this.db.insertOrUpdate(
			TABLE.inviteCodeSettings,
			['guildId', 'inviteCode', 'value'],
			['value'],
			[settings],
			(s) => s.guildId
		);
	}

	public toDbValue(info: SettingsInfo<any>, value: any): any {
		if (value === 'default') {
			return this._toDbValue(info.type, info.defaultValue);
		}

		return this._toDbValue(info.type, value);
	}
	private _toDbValue(type: string, value: any): string {
		if (value === 'none' || value === 'empty' || value === 'null' || value === null) {
			return null;
		}

		if (type === 'Channel') {
			if (typeof value === 'string') {
				return value;
			} else {
				return (value as Channel).id;
			}
		} else if (type === 'Role') {
			if (typeof value === 'string') {
				return value;
			} else {
				return (value as Role).id;
			}
		} else if (type.endsWith('[]')) {
			const subType = type.substring(0, type.length - 2);
			return value && value.length > 0 ? value.map((v: any) => this._toDbValue(subType, v)) : null;
		}

		return value;
	}

	public beautify(type: InternalSettingsTypes, value: any) {
		if (typeof value === 'undefined' || value === null) {
			return null;
		}

		if (type.endsWith('[]')) {
			return value
				.map((v: any) => this.beautify(type.substring(0, type.length - 2) as InternalSettingsTypes, v))
				.join(' ');
		}

		switch (type) {
			case 'Boolean':
				return value ? 'True' : 'False';

			case 'Role':
				return `<@&${value}>`;

			case 'Channel':
				return `<#${value}>`;

			default:
				if (typeof value === 'string' && value.length > 1000) {
					return '`' + value.substr(0, 1000) + '`...';
				}
				return `\`${value}\``;
		}
	}
}
