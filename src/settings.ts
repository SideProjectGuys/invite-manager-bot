import { Channel, Role } from 'eris';

import {
	defaultInviteCodeSettings,
	defaultMemberSettings,
	defaultSettings,
	InviteCodeSettingsKey,
	inviteCodeSettingsTypes,
	MemberSettingsKey,
	memberSettingsTypes,
	SettingsKey,
	settingsTypes
} from './sequelize';

type AllKeys = SettingsKey | MemberSettingsKey | InviteCodeSettingsKey;
const allSettingsTypes = {
	...settingsTypes,
	...memberSettingsTypes,
	...inviteCodeSettingsTypes
};
const allDefaultSettings = {
	...defaultSettings,
	...defaultMemberSettings,
	...defaultInviteCodeSettings
};

export function canClear<K extends AllKeys>(key: K) {
	const type = allSettingsTypes[key];
	return type.endsWith('[]') || allDefaultSettings[key] === null;
}

export function toDbValue<K extends AllKeys>(key: K, value: any): string {
	const type = allSettingsTypes[key];

	if (value === 'default') {
		return _toDbValue(type, allDefaultSettings[key]);
	}

	return _toDbValue(type, value);
}
function _toDbValue(type: string, value: any): string {
	if (
		value === 'none' ||
		value === 'empty' ||
		value === 'null' ||
		value === null
	) {
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
	} else if (type === 'Boolean') {
		return value ? 'true' : 'false';
	} else if (type.endsWith('[]')) {
		const subType = type.substring(0, type.length - 2);
		return value && value.length > 0
			? value.map((v: any) => _toDbValue(subType, v)).join(',')
			: null;
	}

	return value;
}

export function fromDbValue<K extends AllKeys>(key: K, value: string): any {
	const type = allSettingsTypes[key];
	return _fromDbValue(type, value);
}
function _fromDbValue(type: string, value: string): any {
	// Handle lists first because we don't want to return null for those
	if (type.endsWith('[]')) {
		const subType = type.substring(0, type.length - 2);
		return value && value.length > 0
			? value.split(',').map(s => _fromDbValue(subType, s))
			: [];
	}

	if (value === undefined || value === null) {
		return null;
	}

	if (type === 'Boolean') {
		return value === 'true';
	} else if (type === 'Number') {
		return parseInt(value, 10);
	}

	return value;
}

export function beautify<K extends AllKeys>(key: K, value: any) {
	if (typeof value === 'undefined' || value === null) {
		return null;
	}

	const type = allSettingsTypes[key];
	if (type === 'Channel') {
		return `<#${value}>`;
	} else if (type === 'Boolean') {
		return value ? 'True' : 'False';
	} else if (type === 'Role') {
		return `<@&${value}>`;
	} else if (type === 'Role[]') {
		return value.map((v: any) => `<@&${v}>`).join(' ');
	} else if (type === 'Channel[]') {
		return value.map((v: any) => `<#${v}>`).join(' ');
	} else if (type === 'String[]') {
		return value.map((v: any) => '`' + v + '`').join(', ');
	}
	if (typeof value === 'string' && value.length > 1000) {
		return value.substr(0, 1000) + '...';
	}
	return value;
}
