import { MemberSettingsKey } from './models/MemberSetting';
import { SettingsKey } from './models/Setting';

import { InternalSettingsTypes } from './types';

// ------------------------------------
// MemberSettings
// ------------------------------------
export type MemberSettingsObject = {
	hideFromLeaderboard: boolean;
};

export type MemberSettingsTypesObject = {
	[k in MemberSettingsKey]: InternalSettingsTypes
};

export const memberSettingsTypes: MemberSettingsTypesObject = {
	hideFromLeaderboard: 'Boolean'
};

export const defaultMemberSettings: MemberSettingsObject = {
	hideFromLeaderboard: false
};

// ------------------------------------
// Presences
// ------------------------------------
export enum PresenceStatus {
	online = 'online',
	offline = 'offline',
	idle = 'idle',
	dnd = 'dnd'
}

export enum GameType {
	playing = 0,
	streaming = 1,
	listening = 2
}
